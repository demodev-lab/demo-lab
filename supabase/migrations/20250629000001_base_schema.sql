-- =============================================
-- 기본 스키마 - 사용자 및 핵심 함수
-- 네이밍 컨벤션: snake_case 사용
-- =============================================

-- =============================================
-- ENUM 타입 정의
-- =============================================
CREATE TYPE user_role AS ENUM ('user', 'manager', 'admin');

-- =============================================
-- 함수 정의
-- =============================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 새 사용자 등록 시 프로필 자동 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN new;
END;
$$;

-- 사용자 역할 조회
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT role FROM profiles WHERE id = user_id),
    'user'::user_role
  );
$$;

-- 최소 권한 체크 함수
CREATE OR REPLACE FUNCTION has_minimum_role(required_role user_role, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT CASE 
    WHEN required_role = 'user' THEN true
    WHEN required_role = 'manager' THEN get_user_role(user_id) IN ('manager', 'admin')
    WHEN required_role = 'admin' THEN get_user_role(user_id) = 'admin'
    ELSE false
  END;
$$;

-- 관리자 권한 체크
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT get_user_role(user_id) = 'admin';
$$;

-- 리소스 소유자 체크
CREATE OR REPLACE FUNCTION is_own_resource(resource_user_id UUID, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT resource_user_id = user_id;
$$;

-- =============================================
-- 테이블 생성
-- =============================================

-- 사용자 프로필
CREATE TABLE profiles (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 트리거 생성
-- =============================================

-- 새 사용자 등록 시 프로필 생성 트리거
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- RLS 정책 활성화
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS 정책 생성
-- =============================================

-- profiles 정책
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);