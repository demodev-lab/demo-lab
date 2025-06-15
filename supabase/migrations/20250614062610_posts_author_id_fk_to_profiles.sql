-- posts.author_id의 FK를 profiles.id로 변경

-- 1. 기존 FK 제약조건 삭제 (있을 경우)
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_author_id_fkey;

-- 2. 데이터 일관성 체크 (실행만, 실패 시 FK 추가 전에 데이터 정리 필요)
-- SELECT author_id FROM posts WHERE author_id NOT IN (SELECT id FROM profiles);

-- 3. 새 FK 추가
ALTER TABLE posts
ADD CONSTRAINT posts_author_id_fkey
FOREIGN KEY (author_id) REFERENCES profiles(id);
