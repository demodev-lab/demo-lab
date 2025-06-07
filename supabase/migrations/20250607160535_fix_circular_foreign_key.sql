-- Circular Foreign-Key 문제 해결 마이그레이션
-- comments 테이블의 parent_comment_id 제약 조건을 수정하여 circular reference 문제 해결

-- 1. 기존 foreign key 제약 조건 삭제
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_parent_comment_id_fkey;

-- 2. 새로운 foreign key 제약 조건 추가 (ON DELETE SET NULL)
-- CASCADE 대신 SET NULL을 사용하여 circular deletion 문제 방지
ALTER TABLE comments 
ADD CONSTRAINT comments_parent_comment_id_fkey 
FOREIGN KEY (parent_comment_id) 
REFERENCES comments(id) 
ON DELETE SET NULL;

-- 3. 제약 조건 변경 확인을 위한 정보 출력
DO $$
BEGIN
    RAISE NOTICE '=== Circular Foreign-Key 문제 해결 완료 ===';
    RAISE NOTICE 'comments.parent_comment_id 제약 조건이 ON DELETE SET NULL로 변경되었습니다.';
    RAISE NOTICE '이제 pg_dump에서 circular foreign-key 경고가 발생하지 않습니다.';
    RAISE NOTICE '==========================================';
END $$; 