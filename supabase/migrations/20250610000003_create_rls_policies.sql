-- RLS 정책 설정
-- 모든 테이블에 대한 완전한 보안 정책 (guest 역할 포함)

-- ========================================
-- 1. RLS 활성화
-- ========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 2. Profiles 정책
-- ========================================

-- 프로필 읽기: 본인 또는 Manager 이상만
CREATE POLICY "profiles_read_policy" 
ON profiles FOR SELECT 
TO authenticated 
USING (
  auth.uid() = id OR
  has_minimum_role('manager', auth.uid())
);

-- 프로필 삽입: 본인만
CREATE POLICY "profiles_insert_policy" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 프로필 수정: 본인 또는 admin (역할 변경은 admin만)
CREATE POLICY "profiles_update_policy"
ON profiles FOR UPDATE
USING (
  auth.uid() = id OR 
  has_minimum_role('admin', auth.uid())
);

-- ========================================
-- 3. Categories 정책
-- ========================================

-- 카테고리 읽기: 모든 사용자 (guest 포함)
CREATE POLICY "categories_read_policy"
ON categories FOR SELECT
USING (true);

-- 카테고리 관리: manager 이상만
CREATE POLICY "categories_insert_policy"
ON categories FOR INSERT
WITH CHECK (has_minimum_role('manager', auth.uid()));

CREATE POLICY "categories_update_policy"
ON categories FOR UPDATE
USING (has_minimum_role('manager', auth.uid()));

CREATE POLICY "categories_delete_policy"
ON categories FOR DELETE
USING (has_minimum_role('manager', auth.uid()));

-- ========================================
-- 4. Tags 정책
-- ========================================

-- 태그 읽기: 모든 사용자 (guest 포함)
CREATE POLICY "tags_read_policy"
ON tags FOR SELECT
USING (true);

-- 태그 관리: manager 이상만
CREATE POLICY "tags_insert_policy"
ON tags FOR INSERT
WITH CHECK (has_minimum_role('manager', auth.uid()));

CREATE POLICY "tags_update_policy"
ON tags FOR UPDATE
USING (has_minimum_role('manager', auth.uid()));

CREATE POLICY "tags_delete_policy"
ON tags FOR DELETE
USING (has_minimum_role('manager', auth.uid()));

-- ========================================
-- 5. Posts 정책 (핵심)
-- ========================================

-- 게시글 읽기: 
-- - 게시된 글은 누구나 (guest 포함) 볼 수 있음
-- - 본인 글은 상태 관계없이 볼 수 있음 (user 이상)
-- - Manager 이상은 모든 글 볼 수 있음
CREATE POLICY "posts_read_policy"
ON posts FOR SELECT
USING (
  (status = 'published' AND is_spam = false) OR
  (author_id = auth.uid() AND has_minimum_role('user', auth.uid())) OR
  has_minimum_role('manager', auth.uid())
);

-- 게시글 작성: user 이상만
CREATE POLICY "posts_insert_policy"
ON posts FOR INSERT
WITH CHECK (
  auth.uid() = author_id AND 
  has_minimum_role('user', auth.uid())
);

-- 게시글 수정: 작성자 본인 또는 manager 이상
CREATE POLICY "posts_update_policy"
ON posts FOR UPDATE
USING (can_edit_post(id, auth.uid()));

-- 게시글 삭제: 작성자 본인 또는 manager 이상
CREATE POLICY "posts_delete_policy"
ON posts FOR DELETE
USING (can_delete_post(id, auth.uid()));

-- ========================================
-- 6. Post Tags 정책
-- ========================================

-- 게시글-태그 읽기: 모든 사용자
CREATE POLICY "post_tags_read_policy"
ON post_tags FOR SELECT
USING (true);

-- 게시글-태그 관리: 게시글 작성자 또는 manager 이상
CREATE POLICY "post_tags_write_policy"
ON post_tags 
USING (
  -- 게시글 작성자이거나
  EXISTS (
    SELECT 1 FROM posts 
    WHERE posts.id = post_tags.post_id 
    AND posts.author_id = auth.uid()
    AND has_minimum_role('user', auth.uid())
  ) OR 
  -- Manager 이상
  has_minimum_role('manager', auth.uid())
);

-- ========================================
-- 7. Likes 정책
-- ========================================

-- 좋아요 읽기: 모든 사용자
CREATE POLICY "likes_read_policy"
ON likes FOR SELECT
USING (true);

-- 좋아요 추가: user 이상 (본인만)
CREATE POLICY "likes_insert_policy"
ON likes FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND 
  has_minimum_role('user', auth.uid())
);

-- 좋아요 삭제: user 이상 (본인만)
CREATE POLICY "likes_delete_policy"
ON likes FOR DELETE
USING (
  auth.uid() = user_id AND 
  has_minimum_role('user', auth.uid())
);

-- ========================================
-- 8. Comments 정책
-- ========================================

-- 댓글 읽기: 스팸이 아닌 모든 댓글 허용 (게스트 포함)
CREATE POLICY "comments_read_policy"
ON comments FOR SELECT
USING (is_spam = false);

-- 댓글 작성: user 이상만
CREATE POLICY "comments_insert_policy"
ON comments FOR INSERT
WITH CHECK (
  auth.uid() = author_id AND
  has_minimum_role('user', auth.uid()) AND
  status = 'active'
);

-- 댓글 수정: 작성자 본인 또는 manager 이상
CREATE POLICY "comments_update_policy"
ON comments FOR UPDATE
USING (
  auth.uid() = author_id OR
  has_minimum_role('manager', auth.uid())
);

-- 댓글 삭제: 작성자 본인 또는 manager 이상
CREATE POLICY "comments_delete_policy"
ON comments FOR DELETE
USING (
  auth.uid() = author_id OR 
  has_minimum_role('manager', auth.uid())
);

-- ========================================
-- 9. Subscriptions 정책 (결제 관련)
-- ========================================

-- 구독 정보 읽기: 본인만
CREATE POLICY "subscriptions_read_policy"
ON subscriptions FOR SELECT
USING (auth.uid() = user_id);

-- 구독 정보는 시스템에서만 관리하므로 INSERT/UPDATE/DELETE 정책 없음

-- ========================================
-- 10. 정책 설명 추가
-- ========================================

-- Profiles 정책 설명
COMMENT ON POLICY "profiles_read_policy" ON profiles IS '본인 또는 Manager 이상만 프로필 읽기 가능';
COMMENT ON POLICY "profiles_insert_policy" ON profiles IS '본인 프로필만 생성 가능';
COMMENT ON POLICY "profiles_update_policy" ON profiles IS '본인 또는 admin만 수정 가능';

-- Categories/Tags 정책 설명
COMMENT ON POLICY "categories_read_policy" ON categories IS 'guest 포함 모든 사용자 읽기 가능';
COMMENT ON POLICY "tags_read_policy" ON tags IS 'guest 포함 모든 사용자 읽기 가능';

-- Posts 정책 설명
COMMENT ON POLICY "posts_read_policy" ON posts IS '게시된 글은 guest도 읽기 가능, 본인 글은 user 이상, manager는 모든 글';
COMMENT ON POLICY "posts_insert_policy" ON posts IS 'user 이상만 게시글 작성 가능';

-- Comments 정책 설명
COMMENT ON POLICY "comments_read_policy" ON comments IS '스팸이 아닌 모든 댓글 허용 (게스트 포함)';
COMMENT ON POLICY "comments_insert_policy" ON comments IS 'user 이상만 댓글 작성 가능';

-- Likes 정책 설명
COMMENT ON POLICY "likes_read_policy" ON likes IS '좋아요는 guest도 조회 가능';
COMMENT ON POLICY "likes_insert_policy" ON likes IS 'user 이상만 좋아요 가능';

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '=== RLS 정책 설정 완료 ===';
    RAISE NOTICE '권한 체계: guest < user < manager < admin';
    RAISE NOTICE '';
    RAISE NOTICE '권한별 주요 기능:';
    RAISE NOTICE '- Guest: 게시글/댓글 읽기만';
    RAISE NOTICE '- User: 글/댓글 작성, 좋아요';
    RAISE NOTICE '- Manager: 카테고리/태그 관리, 다른 사용자 글 수정/삭제';
    RAISE NOTICE '- Admin: 사용자 역할 변경 등 모든 권한';
    RAISE NOTICE '';
    RAISE NOTICE '모든 테이블에 RLS 적용 완료';
    RAISE NOTICE '=============================';
END $$; 