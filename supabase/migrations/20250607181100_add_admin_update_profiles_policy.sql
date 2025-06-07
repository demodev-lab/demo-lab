-- Admin이 다른 사용자의 role을 변경할 수 있는 정책 추가
-- 기존 "Users can update their own profile" 정책을 대체

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- 새로운 정책 생성 (본인 + admin)
CREATE POLICY "Users can update their own profile or admin can update any profile" 
ON profiles FOR UPDATE 
USING (
    auth.uid() = id OR 
    EXISTS (
        SELECT 1 FROM profiles admin_profile 
        WHERE admin_profile.id = auth.uid() 
        AND admin_profile.role = 'admin'
    )
); 