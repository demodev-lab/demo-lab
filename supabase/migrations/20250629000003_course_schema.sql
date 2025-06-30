-- =============================================
-- 코스 관련 스키마
-- 네이밍 컨벤션: snake_case 사용
-- =============================================

-- =============================================
-- ENUM 타입 정의
-- =============================================
CREATE TYPE difficulty_level AS ENUM ('입문', '초급', '중급', '고급');
CREATE TYPE enrollment_status AS ENUM ('수강전', '수강중', '완강');

-- =============================================
-- 테이블 생성
-- =============================================

-- 코스
CREATE TABLE course (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    thumbnail_url TEXT,
    difficulty difficulty_level NOT NULL DEFAULT '입문',
    total_lecture_count INTEGER DEFAULT 0,
    total_duration_secs INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 코스 신청
CREATE TABLE course_application (
    id SERIAL PRIMARY KEY,
    -- 신청 정보
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    thumbnail_url TEXT,
    difficulty difficulty_level NOT NULL DEFAULT '입문',
    
    -- 신청자 정보
    applicant_id UUID NOT NULL REFERENCES profiles(id),
    applicant_email TEXT,
    applicant_phone TEXT,
    
    -- 신청/승인 정보
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- 승인 정보
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES auth.users(id),
    approved_course_id INTEGER REFERENCES course(id),
    
    -- 거절 정보
    rejected_at TIMESTAMPTZ,
    rejected_by UUID REFERENCES auth.users(id),
    rejection_reason TEXT,
    
    -- 메타데이터
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 코스 강사
CREATE TABLE course_instructor (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES course(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES profiles(id),
    role_title TEXT,
    intro_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, instructor_id)
);

-- 코스 학습 목표
CREATE TABLE course_learning_goal (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES course(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sequence INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 배경 지식
CREATE TABLE background_knowledge (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES course(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sequence INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 모듈
CREATE TABLE module (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES course(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    sequence INTEGER NOT NULL
);

-- 강의
CREATE TABLE lecture (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES course(id) ON DELETE CASCADE,
    module_id INTEGER REFERENCES module(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    sequence INTEGER NOT NULL,
    video_url TEXT,
    duration_secs INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 수강 신청
CREATE TABLE enrollment (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    course_id INTEGER REFERENCES course(id) ON DELETE CASCADE,
    status enrollment_status DEFAULT '수강전',
    completed_lecture_count INTEGER DEFAULT 0,
    last_viewed_lecture_id INTEGER REFERENCES lecture(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- 강의 진도
CREATE TABLE lecture_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    lecture_id INTEGER REFERENCES lecture(id) ON DELETE CASCADE,
    progress_secs INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lecture_id)
);

-- 강의 핵심 내용
CREATE TABLE lecture_keypoint (
    id SERIAL PRIMARY KEY,
    lecture_id INTEGER REFERENCES lecture(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sequence INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 강의 자료
CREATE TABLE lecture_material (
    id SERIAL PRIMARY KEY,
    lecture_id INTEGER REFERENCES lecture(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 관련 코스
CREATE TABLE related_course (
    id SERIAL PRIMARY KEY,
    course_a_id INTEGER REFERENCES course(id) ON DELETE CASCADE,
    course_b_id INTEGER REFERENCES course(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_a_id, course_b_id),
    CHECK (course_a_id < course_b_id)
);

-- =============================================
-- 인덱스 생성
-- =============================================
CREATE INDEX idx_course_application_applicant_id ON course_application(applicant_id);
CREATE INDEX idx_course_application_status ON course_application(status);
CREATE INDEX idx_course_application_applied_at ON course_application(applied_at);

-- =============================================
-- 트리거 생성
-- =============================================

-- updated_at 트리거
CREATE TRIGGER update_course_updated_at
    BEFORE UPDATE ON course
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_application_updated_at
    BEFORE UPDATE ON course_application
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lecture_updated_at
    BEFORE UPDATE ON lecture
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollment_updated_at
    BEFORE UPDATE ON enrollment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lecture_progress_updated_at
    BEFORE UPDATE ON lecture_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- RLS 정책 활성화
-- =============================================
ALTER TABLE course ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_application ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_instructor ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_learning_goal ENABLE ROW LEVEL SECURITY;
ALTER TABLE background_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE module ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollment ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture_keypoint ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE related_course ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS 정책 생성
-- =============================================

-- course 정책
CREATE POLICY "Courses are viewable by everyone" ON course
    FOR SELECT USING (true);

CREATE POLICY "Only instructors and above can create courses" ON course
    FOR INSERT WITH CHECK (has_minimum_role('instructor'));

CREATE POLICY "Only instructors and above can update courses" ON course
    FOR UPDATE USING (has_minimum_role('instructor'));

CREATE POLICY "Only managers and above can delete courses" ON course
    FOR DELETE USING (has_minimum_role('manager'));

-- course_application 정책
CREATE POLICY "Users can view their own applications" ON course_application
    FOR SELECT USING (
        auth.uid() = applicant_id OR has_minimum_role('manager')
    );

CREATE POLICY "Authenticated users can create applications" ON course_application
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = applicant_id);

CREATE POLICY "Only admins can update applications" ON course_application
    FOR UPDATE USING (has_minimum_role('manager'));

CREATE POLICY "Only admins can delete applications" ON course_application
    FOR DELETE USING (has_minimum_role('manager'));

-- enrollment 정책
CREATE POLICY "Users can view own enrollments" ON enrollment
    FOR SELECT USING (auth.uid() = user_id OR has_minimum_role('manager'));

CREATE POLICY "Users can create own enrollments" ON enrollment
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments" ON enrollment
    FOR UPDATE USING (auth.uid() = user_id);

-- lecture_progress 정책
CREATE POLICY "Users can view own progress" ON lecture_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress" ON lecture_progress
    FOR ALL USING (auth.uid() = user_id);

-- 기타 코스 관련 테이블들은 코스 자체와 동일한 정책 적용
CREATE POLICY "Course details are viewable by everyone" ON course_instructor
    FOR SELECT USING (true);

CREATE POLICY "Only instructors and above can manage course instructors" ON course_instructor
    FOR ALL USING (has_minimum_role('instructor'));

CREATE POLICY "Course goals are viewable by everyone" ON course_learning_goal
    FOR SELECT USING (true);

CREATE POLICY "Only instructors and above can manage course goals" ON course_learning_goal
    FOR ALL USING (has_minimum_role('instructor'));

CREATE POLICY "Background knowledge is viewable by everyone" ON background_knowledge
    FOR SELECT USING (true);

CREATE POLICY "Only instructors and above can manage background knowledge" ON background_knowledge
    FOR ALL USING (has_minimum_role('instructor'));

CREATE POLICY "Modules are viewable by everyone" ON module
    FOR SELECT USING (true);

CREATE POLICY "Only instructors and above can manage modules" ON module
    FOR ALL USING (has_minimum_role('instructor'));

CREATE POLICY "Lectures are viewable by everyone" ON lecture
    FOR SELECT USING (true);

CREATE POLICY "Only instructors and above can manage lectures" ON lecture
    FOR ALL USING (has_minimum_role('instructor'));

CREATE POLICY "Lecture keypoints are viewable by everyone" ON lecture_keypoint
    FOR SELECT USING (true);

CREATE POLICY "Only instructors and above can manage lecture keypoints" ON lecture_keypoint
    FOR ALL USING (has_minimum_role('instructor'));

CREATE POLICY "Lecture materials are viewable by everyone" ON lecture_material
    FOR SELECT USING (true);

CREATE POLICY "Only instructors and above can manage lecture materials" ON lecture_material
    FOR ALL USING (has_minimum_role('instructor'));

CREATE POLICY "Related courses are viewable by everyone" ON related_course
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage related courses" ON related_course
    FOR ALL USING (has_minimum_role('manager'));