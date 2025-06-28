-- CourseApplication 테이블 생성
CREATE TABLE "CourseApplication" (
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
  approved_course_id INTEGER REFERENCES "Course"(id),
  
  -- 거절 정보
  rejected_at TIMESTAMPTZ,
  rejected_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  
  -- 메타데이터
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 기존 Course 테이블에서 status 관련 컬럼 제거
ALTER TABLE "Course" 
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS applicant_id,
  DROP COLUMN IF EXISTS applicant_email,
  DROP COLUMN IF EXISTS applicant_phone,
  DROP COLUMN IF EXISTS applied_at,
  DROP COLUMN IF EXISTS approved_at,
  DROP COLUMN IF EXISTS approved_by,
  DROP COLUMN IF EXISTS rejection_reason;

-- 인덱스 생성
CREATE INDEX idx_course_application_applicant_id ON "CourseApplication"(applicant_id);
CREATE INDEX idx_course_application_status ON "CourseApplication"(status);
CREATE INDEX idx_course_application_applied_at ON "CourseApplication"(applied_at);

-- RLS 정책
ALTER TABLE "CourseApplication" ENABLE ROW LEVEL SECURITY;

-- 1. 신청자 본인은 자신의 신청 내역만 조회 가능
CREATE POLICY "Users can view their own applications" ON "CourseApplication"
  FOR SELECT
  USING (
    auth.uid() = applicant_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- 2. 신청은 로그인한 사용자만 가능
CREATE POLICY "Authenticated users can create applications" ON "CourseApplication"
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    auth.uid() = applicant_id
  );

-- 3. 신청 내역 수정은 관리자만 가능 (승인/거절)
CREATE POLICY "Only admins can update applications" ON "CourseApplication"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- 4. 신청 내역 삭제는 관리자만 가능
CREATE POLICY "Only admins can delete applications" ON "CourseApplication"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_course_application_updated_at
  BEFORE UPDATE ON "CourseApplication"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();