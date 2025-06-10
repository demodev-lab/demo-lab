-- 함수와 트리거 생성
-- 사용자 프로필 자동 생성, 권한 체크, 게시글 조회 등 모든 필요한 함수들

-- ========================================
-- 1. 새 사용자 등록 시 프로필 자동 생성
-- ========================================

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

-- 새 사용자 등록 시 프로필 생성 트리거
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ========================================
-- 2. 권한 체크 핵심 함수들
-- ========================================

-- 사용자 역할 조회 (없으면 guest 반환)
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT role FROM profiles WHERE id = user_id),
    'guest'::user_role
  );
$$;

-- 최소 권한 체크 함수 (계층적 권한 체계)
CREATE OR REPLACE FUNCTION has_minimum_role(required_role user_role, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    CASE get_user_role(user_id)
      WHEN 'admin' THEN TRUE
      WHEN 'manager' THEN required_role IN ('guest', 'user', 'manager')
      WHEN 'user' THEN required_role IN ('guest', 'user')
      WHEN 'guest' THEN required_role = 'guest'
      ELSE FALSE
    END;
$$;

-- ========================================
-- 3. 커뮤니티 권한 체크 함수들
-- ========================================

-- 게시글 수정 권한 체크
CREATE OR REPLACE FUNCTION can_edit_post(post_id BIGINT, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    -- 로그인된 사용자여야 하고
    has_minimum_role('user', user_id) AND (
      -- 작성자 본인이거나
      EXISTS (SELECT 1 FROM posts p WHERE p.id = post_id AND p.author_id = user_id)
      OR
      -- Manager 이상 권한자
      has_minimum_role('manager', user_id)
    );
$$;

-- 게시글 삭제 권한 체크
CREATE OR REPLACE FUNCTION can_delete_post(post_id BIGINT, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    -- 로그인된 사용자여야 하고
    has_minimum_role('user', user_id) AND (
      -- 작성자 본인이거나
      EXISTS (SELECT 1 FROM posts p WHERE p.id = post_id AND p.author_id = user_id)
      OR
      -- Manager 이상 권한자
      has_minimum_role('manager', user_id)
    );
$$;

-- 게시글 고정 권한 체크 (Manager 이상만)
CREATE OR REPLACE FUNCTION can_pin_post(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT has_minimum_role('manager', user_id);
$$;

-- 카테고리/태그 관리 권한 체크 (Manager 이상만)
CREATE OR REPLACE FUNCTION can_manage_categories(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT has_minimum_role('manager', user_id);
$$;

-- ========================================
-- 4. 게시글 상세 정보 조회 함수 (JOIN 포함)
-- ========================================

CREATE OR REPLACE FUNCTION get_posts_with_details(
    request_user_id UUID DEFAULT auth.uid(),
    page_limit INTEGER DEFAULT 20,
    page_offset INTEGER DEFAULT 0
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
    LEFT JOIN
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

-- ========================================
-- 5. 사용자 목록 조회 함수 (Admin용)
-- ========================================

CREATE OR REPLACE FUNCTION get_users_with_profiles()
RETURNS TABLE (
  id UUID,
  email TEXT,
  role user_role,
  full_name TEXT,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    p.id,
    u.email,
    p.role,
    p.full_name,
    p.username,
    p.avatar_url,
    p.created_at
  FROM profiles p
  JOIN auth.users u ON p.id = u.id
  ORDER BY p.created_at DESC;
$$;

-- ========================================
-- 6. 함수 설명 추가
-- ========================================

COMMENT ON FUNCTION handle_new_user() IS '새 사용자 등록 시 프로필 자동 생성 (다양한 소셜 제공자 지원)';
COMMENT ON FUNCTION get_user_role(UUID) IS '사용자 역할 조회 (없으면 guest 반환)';
COMMENT ON FUNCTION has_minimum_role(user_role, UUID) IS '최소 필요 권한 체크 (guest < user < manager < admin)';
COMMENT ON FUNCTION can_edit_post(BIGINT, UUID) IS '게시글 수정 권한: user 이상 + (작성자 또는 manager 이상)';
COMMENT ON FUNCTION can_delete_post(BIGINT, UUID) IS '게시글 삭제 권한: user 이상 + (작성자 또는 manager 이상)';
COMMENT ON FUNCTION can_pin_post(UUID) IS '게시글 고정 권한: manager 이상만';
COMMENT ON FUNCTION can_manage_categories(UUID) IS '카테고리/태그 관리 권한: manager 이상만';
COMMENT ON FUNCTION get_posts_with_details(UUID, INTEGER, INTEGER) IS '게시글 상세 정보 조회 (JOIN 포함)';
COMMENT ON FUNCTION get_users_with_profiles() IS 'Manager 이상이 사용자 목록을 조회할 수 있는 함수';

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '=== 함수와 트리거 생성 완료 ===';
    RAISE NOTICE '- 사용자 프로필 자동 생성 트리거';
    RAISE NOTICE '- 권한 체크 함수들 (get_user_role, has_minimum_role)';
    RAISE NOTICE '- 커뮤니티 권한 함수들 (can_edit_post, can_delete_post 등)';
    RAISE NOTICE '- 게시글 조회 및 사용자 관리 함수들';
    RAISE NOTICE '================================';
END $$; 