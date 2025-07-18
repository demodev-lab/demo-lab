-- =============================================
-- post_tags 테이블 RLS 정책 추가
-- =============================================

-- post_tags 테이블에 대한 RLS 정책 생성

-- 모든 사용자가 게시글 태그를 읽을 수 있음
CREATE POLICY "Post tags are viewable by everyone" 
ON post_tags FOR SELECT 
USING (true);

-- 인증된 사용자가 자신의 게시글에 태그를 추가할 수 있음
CREATE POLICY "Users can add tags to their own posts" 
ON post_tags FOR INSERT 
WITH CHECK (
    auth.uid() IS NOT NULL 
    AND EXISTS (
        SELECT 1 FROM posts 
        WHERE posts.id = post_tags.post_id 
        AND posts.author_id = auth.uid()
    )
);

-- 인증된 사용자가 자신의 게시글에서 태그를 제거할 수 있음
CREATE POLICY "Users can remove tags from their own posts" 
ON post_tags FOR DELETE 
USING (
    auth.uid() IS NOT NULL 
    AND EXISTS (
        SELECT 1 FROM posts 
        WHERE posts.id = post_tags.post_id 
        AND posts.author_id = auth.uid()
    )
);

-- 매니저 이상의 권한을 가진 사용자는 모든 게시글의 태그를 관리할 수 있음
CREATE POLICY "Managers can manage all post tags" 
ON post_tags FOR ALL 
USING (has_minimum_role('manager'));
