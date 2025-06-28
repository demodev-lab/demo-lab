-- Course 테이블의 기존 RLS 정책 제거
DROP POLICY IF EXISTS "Users can view their own pending courses" ON "Course";
DROP POLICY IF EXISTS "Authenticated users can apply for courses" ON "Course";
DROP POLICY IF EXISTS "Only admins can update courses" ON "Course";
DROP POLICY IF EXISTS "Only admins can delete courses" ON "Course";

-- Course 테이블의 새로운 RLS 정책 생성
-- 1. 모든 사용자가 코스를 볼 수 있음
CREATE POLICY "Anyone can view courses" ON "Course"
  FOR SELECT
  USING (true);

-- 2. 관리자만 코스를 생성할 수 있음
CREATE POLICY "Only admins can create courses" ON "Course"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- 3. 관리자만 코스를 수정할 수 있음
CREATE POLICY "Only admins can update courses" ON "Course"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- 4. 관리자만 코스를 삭제할 수 있음
CREATE POLICY "Only admins can delete courses" ON "Course"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'manager')
    )
  );