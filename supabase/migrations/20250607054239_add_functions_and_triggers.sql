-- 함수와 트리거 추가 마이그레이션
-- 새 사용자 프로필 자동 생성 및 게시글 조회 함수

-- 1. 새 사용자 등록 시 프로필 자동 생성 함수
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN new;
END;
$$;

-- 2. 새 사용자 등록 시 프로필 생성 트리거
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 3. 게시글 상세 정보 조회 함수 (JOIN 포함)
CREATE OR REPLACE FUNCTION get_posts_with_details(
    request_user_id UUID,
    page_limit INTEGER,
    page_offset INTEGER
)
RETURNS TABLE (
    id BIGINT,
    created_at TIMESTAMPTZ,
    title TEXT,
    content TEXT,
    view_count INTEGER,
    like_count INTEGER,
    comment_count INTEGER,
    is_pinned BOOLEAN,
    author_id UUID,
    author_name TEXT,
    category_id BIGINT,
    category_name TEXT,
    category_color TEXT,
    tags JSONB,
    is_liked BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id, p.created_at, p.title, p.content, p.view_count, p.like_count, p.comment_count, p.is_pinned, p.author_id,
        COALESCE(prof.full_name, prof.username, p.author_id::text) as author_name,
        p.category_id, c.name as category_name, c.color as category_color,
        (
            SELECT jsonb_agg(jsonb_build_object(
                'id', t.id,
                'name', t.name,
                'color', t.color,
                'description', t.description
            ))
            FROM public.post_tags pt
            JOIN public.tags t ON pt.tag_id = t.id
            WHERE pt.post_id = p.id
        ) as tags,
        EXISTS(SELECT 1 FROM public.likes l WHERE l.post_id = p.id AND l.user_id = request_user_id) as is_liked
    FROM
        public.posts p
    JOIN
        public.categories c ON p.category_id = c.id
    LEFT JOIN
        public.profiles prof ON p.author_id = prof.id
    WHERE
        p.status = 'published' AND p.is_spam = false
    ORDER BY
        p.is_pinned DESC, p.created_at DESC
    LIMIT page_limit
    OFFSET page_offset;
END;
$$;
