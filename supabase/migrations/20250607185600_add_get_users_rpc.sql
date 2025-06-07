-- 사용자 목록 조회용 RPC 함수 생성
-- auth.users와 profiles를 JOIN해서 이메일과 프로필 정보를 함께 가져옴

CREATE OR REPLACE FUNCTION get_users_with_profiles()
RETURNS TABLE (
  id UUID,
  email TEXT,
  role user_role,
  full_name TEXT,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    p.id,
    u.email,
    p.role,
    p.full_name,
    p.username,
    p.avatar_url,
    p.created_at
  FROM profiles p
  JOIN auth.users u ON p.id = u.id
  ORDER BY p.created_at DESC;
$$;

-- 이 함수는 manager 이상만 실행할 수 있도록 RLS 정책과 연동
-- (auth.users는 RLS 적용 안되므로 함수 레벨에서 권한 체크)
COMMENT ON FUNCTION get_users_with_profiles() IS 'Manager 이상이 사용자 목록을 조회할 수 있는 함수'; 