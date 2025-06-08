-- GUEST 권한 추가 및 권한 순서 조정 마이그레이션
-- 권한 순서: guest < user < manager < admin

-- 1. 새로운 user_role enum 생성 (올바른 순서로)
CREATE TYPE user_role_new AS ENUM ('guest', 'user', 'manager', 'admin');

-- 2. profiles 테이블의 role 컬럼을 새로운 enum으로 변경
ALTER TABLE profiles 
  ALTER COLUMN role TYPE user_role_new 
  USING role::text::user_role_new;

-- 3. 기본값을 guest로 변경 (로그인하지 않은 사용자용)
ALTER TABLE profiles 
  ALTER COLUMN role SET DEFAULT 'guest';

-- 4. 기존 enum 타입 삭제
DROP TYPE user_role;

-- 5. 새로운 enum 타입을 기존 이름으로 변경
ALTER TYPE user_role_new RENAME TO user_role;

-- 6. 코멘트 추가
COMMENT ON TYPE user_role IS '사용자 권한 레벨: guest(비로그인) < user(일반) < manager(관리자) < admin(최고관리자)'; 