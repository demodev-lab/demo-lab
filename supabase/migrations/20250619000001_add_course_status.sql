-- Course 상태 Enum 타입 생성
CREATE TYPE course_status AS ENUM ('pending', 'active', 'closed');

-- Course 테이블에 status 컬럼 추가
ALTER TABLE "Course" ADD COLUMN status course_status NOT NULL DEFAULT 'pending';

-- 신청자 정보를 위한 컬럼 추가
ALTER TABLE "Course" ADD COLUMN applicant_id UUID REFERENCES profiles(id);
ALTER TABLE "Course" ADD COLUMN applicant_email TEXT;
ALTER TABLE "Course" ADD COLUMN applicant_phone TEXT;
ALTER TABLE "Course" ADD COLUMN applied_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE "Course" ADD COLUMN approved_at TIMESTAMPTZ;
ALTER TABLE "Course" ADD COLUMN approved_by UUID REFERENCES auth.users(id);
ALTER TABLE "Course" ADD COLUMN rejection_reason TEXT;

-- 기존 코스들을 active로 업데이트 (이미 등록된 코스들은 승인된 것으로 간주)
UPDATE "Course" SET status = 'active', approved_at = NOW() WHERE status = 'pending';

-- 인덱스 추가
CREATE INDEX idx_course_status ON "Course"(status);
CREATE INDEX idx_course_applicant_id ON "Course"(applicant_id);

-- RLS 정책 추가/수정
-- 1. pending 상태의 코스는 신청자 본인과 관리자만 볼 수 있음
CREATE POLICY "Users can view their own pending courses" ON "Course"
  FOR SELECT
  USING (
    status != 'pending' OR 
    auth.uid() = applicant_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- 2. 코스 생성은 로그인한 사용자만 가능 (pending 상태로 생성)
CREATE POLICY "Authenticated users can apply for courses" ON "Course"
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    status = 'pending' AND
    applicant_id = auth.uid()
  );

-- 3. 코스 수정은 관리자만 가능 (상태 변경 포함)
CREATE POLICY "Only admins can update courses" ON "Course"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- 4. 코스 삭제는 관리자만 가능
CREATE POLICY "Only admins can delete courses" ON "Course"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );