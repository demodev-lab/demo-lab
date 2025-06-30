-- =============================================
-- 커뮤니티 관련 스키마
-- 네이밍 컨벤션: snake_case 사용
-- =============================================

-- =============================================
-- 테이블 생성
-- =============================================

-- 카테고리
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#808080',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 태그
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#E5E7EB',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 게시글
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    content TEXT,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    author_id UUID REFERENCES profiles(id) NOT NULL,
    category_id INTEGER REFERENCES categories(id) NOT NULL
);

-- 게시글 태그
CREATE TABLE post_tags (
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- 댓글
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    content TEXT NOT NULL,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id) NOT NULL,
    parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    children_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0
);

-- 게시글 좋아요
CREATE TABLE post_likes (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    UNIQUE(post_id, user_id)
);

-- 댓글 좋아요
CREATE TABLE comment_likes (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    UNIQUE(comment_id, user_id)
);

-- =============================================
-- 인덱스 생성
-- =============================================
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);

-- =============================================
-- RLS 정책 활성화
-- =============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS 정책 생성
-- =============================================

-- categories 정책
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage categories" ON categories
    FOR ALL USING (has_minimum_role('admin'));

-- tags 정책
CREATE POLICY "Tags are viewable by everyone" ON tags
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage tags" ON tags
    FOR ALL USING (has_minimum_role('admin'));

-- posts 정책
CREATE POLICY "Posts are viewable by everyone" ON posts
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts" ON posts
    FOR UPDATE USING (auth.uid() = author_id OR has_minimum_role('manager'));

CREATE POLICY "Users can delete own posts" ON posts
    FOR DELETE USING (auth.uid() = author_id OR has_minimum_role('manager'));

-- comments 정책
CREATE POLICY "Comments are viewable by everyone" ON comments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON comments
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments" ON comments
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments" ON comments
    FOR DELETE USING (auth.uid() = author_id OR has_minimum_role('manager'));

-- post_likes 정책
CREATE POLICY "Post likes are viewable by everyone" ON post_likes
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own post likes" ON post_likes
    FOR ALL USING (auth.uid() = user_id);

-- comment_likes 정책
CREATE POLICY "Comment likes are viewable by everyone" ON comment_likes
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own comment likes" ON comment_likes
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 초기 데이터 삽입
-- =============================================

-- 카테고리 초기 데이터
INSERT INTO categories (name, description, color) VALUES
    ('일반', '일반적인 주제에 대한 게시글', '#808080'),
    ('질문', '도움이 필요하거나 궁금한 점', '#3B82F6'),
    ('정보', '유용한 정보 공유', '#10B981'),
    ('자유', '자유로운 주제로 대화', '#F59E0B');

-- 태그 초기 데이터
INSERT INTO tags (name, description, color) VALUES
    ('초보', '초보자를 위한 내용', '#DBEAFE'),
    ('중급', '중급자를 위한 내용', '#FEF3C7'),
    ('고급', '고급자를 위한 내용', '#FEE2E2'),
    ('팁', '유용한 팁과 트릭', '#D1FAE5'),
    ('리소스', '유용한 자료 및 링크', '#E9D5FF');

-- =============================================
-- 저장 프로시저 생성
-- =============================================

-- 게시글 상세 조회 함수
CREATE OR REPLACE FUNCTION get_posts_with_details(
    request_user_id UUID,
    page_limit INTEGER DEFAULT 10,
    page_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id INTEGER,
    created_at TIMESTAMPTZ,
    title TEXT,
    content TEXT,
    view_count INTEGER,
    like_count INTEGER,
    comment_count INTEGER,
    is_pinned BOOLEAN,
    author_id UUID,
    author_name TEXT,
    category_id INTEGER,
    category_name TEXT,
    category_color TEXT,
    tags JSONB,
    is_liked BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.created_at,
        p.title,
        p.content,
        p.view_count,
        p.like_count,
        p.comment_count,
        p.is_pinned,
        p.author_id,
        COALESCE(pr.full_name, pr.username, 'Unknown') as author_name,
        p.category_id,
        c.name as category_name,
        c.color as category_color,
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id', t.id,
                    'name', t.name,
                    'color', t.color
                ) ORDER BY t.name
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'::jsonb
        ) as tags,
        EXISTS(
            SELECT 1 FROM post_likes pl 
            WHERE pl.post_id = p.id 
            AND pl.user_id = request_user_id
        ) as is_liked
    FROM posts p
    LEFT JOIN profiles pr ON p.author_id = pr.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    GROUP BY p.id, pr.full_name, pr.username, c.name, c.color
    ORDER BY p.is_pinned DESC, p.created_at DESC
    LIMIT page_limit
    OFFSET page_offset;
END;
$$;

-- 댓글 삭제 함수
CREATE OR REPLACE FUNCTION delete_comment_rpc(comment_id INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    parent_comment_id INTEGER;
    comment_author_id UUID;
    post_id_var INTEGER;
BEGIN
    -- 댓글 정보 조회
    SELECT parent_id, author_id, post_id INTO parent_comment_id, comment_author_id, post_id_var
    FROM comments
    WHERE id = comment_id;
    
    -- 권한 체크: 작성자 본인이거나 manager 이상
    IF comment_author_id != auth.uid() AND NOT has_minimum_role('manager') THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;
    
    -- 댓글 삭제
    DELETE FROM comments WHERE id = comment_id;
    
    -- 부모 댓글의 children_count 감소
    IF parent_comment_id IS NOT NULL THEN
        UPDATE comments 
        SET children_count = children_count - 1 
        WHERE id = parent_comment_id;
    END IF;
    
    -- 게시글의 comment_count 감소
    UPDATE posts 
    SET comment_count = comment_count - 1 
    WHERE id = post_id_var;
    
    RETURN TRUE;
END;
$$;

-- 게시글 좋아요 토글 함수
CREATE OR REPLACE FUNCTION toggle_post_like_rpc(post_id_param INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    like_exists BOOLEAN;
BEGIN
    -- 좋아요 존재 여부 확인
    SELECT EXISTS(
        SELECT 1 FROM post_likes 
        WHERE post_id = post_id_param AND user_id = auth.uid()
    ) INTO like_exists;
    
    IF like_exists THEN
        -- 좋아요 제거
        DELETE FROM post_likes 
        WHERE post_id = post_id_param AND user_id = auth.uid();
        
        -- 좋아요 수 감소
        UPDATE posts 
        SET like_count = like_count - 1 
        WHERE id = post_id_param;
        
        RETURN FALSE;
    ELSE
        -- 좋아요 추가
        INSERT INTO post_likes (post_id, user_id) 
        VALUES (post_id_param, auth.uid());
        
        -- 좋아요 수 증가
        UPDATE posts 
        SET like_count = like_count + 1 
        WHERE id = post_id_param;
        
        RETURN TRUE;
    END IF;
END;
$$;

-- 댓글 좋아요 토글 함수
CREATE OR REPLACE FUNCTION toggle_comment_like_rpc(comment_id_param INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    like_exists BOOLEAN;
BEGIN
    -- 좋아요 존재 여부 확인
    SELECT EXISTS(
        SELECT 1 FROM comment_likes 
        WHERE comment_id = comment_id_param AND user_id = auth.uid()
    ) INTO like_exists;
    
    IF like_exists THEN
        -- 좋아요 제거
        DELETE FROM comment_likes 
        WHERE comment_id = comment_id_param AND user_id = auth.uid();
        
        -- 좋아요 수 감소
        UPDATE comments 
        SET like_count = like_count - 1 
        WHERE id = comment_id_param;
        
        RETURN FALSE;
    ELSE
        -- 좋아요 추가
        INSERT INTO comment_likes (comment_id, user_id) 
        VALUES (comment_id_param, auth.uid());
        
        -- 좋아요 수 증가
        UPDATE comments 
        SET like_count = like_count + 1 
        WHERE id = comment_id_param;
        
        RETURN TRUE;
    END IF;
END;
$$;