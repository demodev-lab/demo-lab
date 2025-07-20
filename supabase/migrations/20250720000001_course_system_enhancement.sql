-- =============================================
-- 코스 시스템 개선 마이그레이션
-- 날짜: 2025-07-20
-- 설명: 코스 신청, 결제, 리뷰, 카테고리 시스템 추가
-- =============================================

-- =============================================
-- ENUM 타입 추가
-- =============================================
DO $$ BEGIN
    CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lecture_access_type AS ENUM ('free', 'preview', 'paid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- 코스 카테고리 테이블
-- =============================================
CREATE TABLE IF NOT EXISTS course_category (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#6B7280',
    icon TEXT,
    parent_id INTEGER REFERENCES course_category(id),
    sequence INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- course_application 테이블 확장
-- =============================================
ALTER TABLE course_application ADD COLUMN IF NOT EXISTS learning_goals JSONB DEFAULT '[]'::jsonb;
ALTER TABLE course_application ADD COLUMN IF NOT EXISTS background_knowledge JSONB DEFAULT '[]'::jsonb;
ALTER TABLE course_application ADD COLUMN IF NOT EXISTS instructor_info JSONB DEFAULT '{}'::jsonb;
ALTER TABLE course_application ADD COLUMN IF NOT EXISTS modules_plan JSONB DEFAULT '[]'::jsonb;
ALTER TABLE course_application ADD COLUMN IF NOT EXISTS price_info JSONB DEFAULT '{}'::jsonb;
ALTER TABLE course_application ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES course_category(id);
ALTER TABLE course_application ADD COLUMN IF NOT EXISTS target_audience TEXT;
ALTER TABLE course_application ADD COLUMN IF NOT EXISTS expected_duration_weeks INTEGER;
ALTER TABLE course_application ADD COLUMN IF NOT EXISTS course_start_date DATE;
ALTER TABLE course_application ADD COLUMN IF NOT EXISTS additional_materials TEXT;
ALTER TABLE course_application ADD COLUMN IF NOT EXISTS additional_message TEXT;

-- =============================================
-- course 테이블 확장
-- =============================================
ALTER TABLE course ADD COLUMN IF NOT EXISTS status course_status DEFAULT 'draft';
ALTER TABLE course ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2) DEFAULT 0;
ALTER TABLE course ADD COLUMN IF NOT EXISTS sale_price DECIMAL(10,2) DEFAULT 0;
ALTER TABLE course ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'KRW';
ALTER TABLE course ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT TRUE;
ALTER TABLE course ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES course_category(id);
ALTER TABLE course ADD COLUMN IF NOT EXISTS target_audience TEXT;
ALTER TABLE course ADD COLUMN IF NOT EXISTS expected_duration_weeks INTEGER;
ALTER TABLE course ADD COLUMN IF NOT EXISTS course_start_date DATE;
ALTER TABLE course ADD COLUMN IF NOT EXISTS total_students INTEGER DEFAULT 0;
ALTER TABLE course ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.0;
ALTER TABLE course ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- =============================================
-- lecture 테이블 확장 (접근 유형 통합)
-- =============================================
ALTER TABLE lecture ADD COLUMN IF NOT EXISTS access_type lecture_access_type DEFAULT 'paid';

-- =============================================
-- 결제 테이블 (재구매 가능한 구조)
-- =============================================
CREATE TABLE IF NOT EXISTS payment (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id),
    course_id INTEGER NOT NULL REFERENCES course(id),
    
    -- 결제 정보
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'KRW',
    payment_method TEXT,
    
    -- 결제 상태
    status payment_status DEFAULT 'pending',
    
    -- 외부 결제 시스템 정보
    external_payment_id TEXT,
    payment_provider TEXT DEFAULT 'lemonsqueezy',
    
    -- 메타데이터
    payment_data JSONB DEFAULT '{}'::jsonb,
    
    -- 타임스탬프
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
    
    -- UNIQUE 제약조건 제거: 재구매 허용
);

-- =============================================
-- 코스 리뷰 테이블
-- =============================================
CREATE TABLE IF NOT EXISTS course_review (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id),
    course_id INTEGER NOT NULL REFERENCES course(id),
    enrollment_id INTEGER REFERENCES enrollment(id),
    
    -- 리뷰 내용
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT NOT NULL,
    
    -- 상태
    is_published BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- 관리자 검토
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    
    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, course_id)
);

-- =============================================
-- 인덱스 생성
-- =============================================

-- course_category 인덱스
CREATE INDEX idx_course_category_parent_id ON course_category(parent_id);
CREATE INDEX idx_course_category_sequence ON course_category(sequence);
CREATE INDEX idx_course_category_is_active ON course_category(is_active);

-- course 확장 인덱스
CREATE INDEX idx_course_status ON course(status);
CREATE INDEX idx_course_category_id ON course(category_id);
CREATE INDEX idx_course_is_free ON course(is_free);
CREATE INDEX idx_course_price_range ON course(sale_price);

-- payment 인덱스
CREATE INDEX idx_payment_user_id ON payment(user_id);
CREATE INDEX idx_payment_course_id ON payment(course_id);
CREATE INDEX idx_payment_status ON payment(status);
CREATE INDEX idx_payment_created_at ON payment(created_at);
CREATE INDEX idx_payment_external_id ON payment(external_payment_id);

-- 부분 인덱스: 유효한 결제(completed)에 대해서만 중복 방지
CREATE UNIQUE INDEX idx_payment_active_unique 
    ON payment(user_id, course_id) 
    WHERE status = 'completed';

-- course_review 인덱스
CREATE INDEX idx_course_review_course_id ON course_review(course_id);
CREATE INDEX idx_course_review_user_id ON course_review(user_id);
CREATE INDEX idx_course_review_rating ON course_review(rating);
CREATE INDEX idx_course_review_is_published ON course_review(is_published);

-- lecture access_type 인덱스
CREATE INDEX idx_lecture_access_type ON lecture(access_type);

-- =============================================
-- 트리거 생성
-- =============================================

-- updated_at 트리거
CREATE TRIGGER update_course_category_updated_at
    BEFORE UPDATE ON course_category
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_updated_at
    BEFORE UPDATE ON payment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_review_updated_at
    BEFORE UPDATE ON course_review
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- RLS 정책 활성화
-- =============================================
ALTER TABLE course_category ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_review ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS 정책 생성
-- =============================================

-- course_category 정책
CREATE POLICY "Categories are viewable by everyone" ON course_category
    FOR SELECT USING (is_active = true);

CREATE POLICY "Only managers can manage categories" ON course_category
    FOR ALL USING (has_minimum_role('manager'));

-- payment 정책
CREATE POLICY "Users can view their own payments" ON payment
    FOR SELECT USING (
        auth.uid() = user_id OR has_minimum_role('manager')
    );

CREATE POLICY "Users can create their own payments" ON payment
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only system can update payments" ON payment
    FOR UPDATE USING (has_minimum_role('manager'));

-- course_review 정책
CREATE POLICY "Published reviews are viewable by everyone" ON course_review
    FOR SELECT USING (is_published = true);

CREATE POLICY "Users can manage their own reviews" ON course_review
    FOR ALL USING (
        auth.uid() = user_id OR has_minimum_role('manager')
    );

-- =============================================
-- 강화된 lecture 접근 정책 (통합된 access_type 기반)
-- =============================================

-- 기존 lecture 정책 삭제 후 재생성
DROP POLICY IF EXISTS "Lectures are viewable by everyone" ON lecture;

-- 새로운 lecture 접근 정책
CREATE POLICY "Lecture access based on type and enrollment" ON lecture
    FOR SELECT USING (
        -- 무료 또는 맛보기 강의는 모두 접근 가능
        access_type IN ('free', 'preview')
        -- 관리자는 모든 강의 접근 가능
        OR has_minimum_role('manager')
        -- 유료 강의는 수강신청 또는 결제 완료한 사용자만 접근 가능
        OR (
            access_type = 'paid' AND (
                EXISTS (
                    SELECT 1 FROM enrollment e
                    WHERE e.user_id = auth.uid() 
                    AND e.course_id = lecture.course_id
                )
                OR EXISTS (
                    SELECT 1 FROM payment p
                    WHERE p.user_id = auth.uid() 
                    AND p.course_id = lecture.course_id 
                    AND p.status = 'completed'
                )
            )
        )
    );

-- =============================================
-- 기본 카테고리 데이터 삽입
-- =============================================
INSERT INTO course_category (name, description, color, sequence) VALUES
    ('프로그래밍', '웹 개발, 앱 개발, 프로그래밍 언어', '#3B82F6', 1),
    ('디자인', 'UI/UX, 그래픽 디자인, 웹 디자인', '#EC4899', 2),
    ('마케팅', '디지털 마케팅, SNS 마케팅, 브랜딩', '#10B981', 3),
    ('비즈니스', '창업, 경영, 재무', '#F59E0B', 4),
    ('자기계발', '생산성, 리더십, 커뮤니케이션', '#8B5CF6', 5);

-- =============================================
-- 함수 생성: 코스 통계 업데이트
-- =============================================
CREATE OR REPLACE FUNCTION update_course_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- enrollment 추가/삭제 시 총 수강생 수 업데이트
    IF TG_TABLE_NAME = 'enrollment' THEN
        UPDATE course 
        SET total_students = (
            SELECT COUNT(*) FROM enrollment WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
        )
        WHERE id = COALESCE(NEW.course_id, OLD.course_id);
    END IF;
    
    -- review 추가/삭제/수정 시 평점 및 리뷰 수 업데이트
    IF TG_TABLE_NAME = 'course_review' THEN
        UPDATE course 
        SET 
            total_reviews = (
                SELECT COUNT(*) FROM course_review 
                WHERE course_id = COALESCE(NEW.course_id, OLD.course_id) 
                AND is_published = true
            ),
            average_rating = (
                SELECT COALESCE(AVG(rating), 0) FROM course_review 
                WHERE course_id = COALESCE(NEW.course_id, OLD.course_id) 
                AND is_published = true
            )
        WHERE id = COALESCE(NEW.course_id, OLD.course_id);
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER update_course_stats_on_enrollment
    AFTER INSERT OR DELETE ON enrollment
    FOR EACH ROW EXECUTE FUNCTION update_course_stats();

CREATE TRIGGER update_course_stats_on_review
    AFTER INSERT OR UPDATE OR DELETE ON course_review
    FOR EACH ROW EXECUTE FUNCTION update_course_stats();