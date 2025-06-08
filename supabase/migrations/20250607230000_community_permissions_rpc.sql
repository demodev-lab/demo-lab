-- 커뮤니티 권한 체크용 RPC 함수들
-- 2025-01-09: 커뮤니티 권한 시스템 개선

-- 1. 게시글 수정 권한 체크
CREATE OR REPLACE FUNCTION can_edit_post(post_id BIGINT, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    -- 작성자 본인이거나
    SELECT 1 FROM posts p WHERE p.id = post_id AND p.author_id = user_id
    UNION
    -- Manager 이상 권한자
    SELECT 1 FROM profiles pr 
    WHERE pr.id = user_id 
    AND pr.role IN ('manager', 'admin')
  );
$$;

-- 2. 게시글 삭제 권한 체크  
CREATE OR REPLACE FUNCTION can_delete_post(post_id BIGINT, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    -- 작성자 본인이거나
    SELECT 1 FROM posts p WHERE p.id = post_id AND p.author_id = user_id
    UNION
    -- Manager 이상 권한자
    SELECT 1 FROM profiles pr 
    WHERE pr.id = user_id 
    AND pr.role IN ('manager', 'admin')
  );
$$;

-- 3. 게시글 고정 권한 체크 (Manager 이상만)
CREATE OR REPLACE FUNCTION can_pin_post(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles pr 
    WHERE pr.id = user_id 
    AND pr.role IN ('manager', 'admin')
  );
$$;

-- 4. 카테고리/태그 관리 권한 체크 (Manager 이상만)
CREATE OR REPLACE FUNCTION can_manage_categories(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles pr 
    WHERE pr.id = user_id 
    AND pr.role IN ('manager', 'admin')
  );
$$;

-- 5. 일반적인 역할 기반 권한 체크
CREATE OR REPLACE FUNCTION has_role_or_above(required_role user_role, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles pr 
    WHERE pr.id = user_id 
    AND (
      CASE 
        WHEN required_role = 'user' THEN pr.role IN ('user', 'manager', 'admin')
        WHEN required_role = 'manager' THEN pr.role IN ('manager', 'admin')
        WHEN required_role = 'admin' THEN pr.role = 'admin'
        ELSE FALSE
      END
    )
  );
$$;

-- 함수들에 대한 설명 추가
COMMENT ON FUNCTION can_edit_post(BIGINT, UUID) IS '게시글 수정 권한 체크: 작성자 또는 Manager 이상';
COMMENT ON FUNCTION can_delete_post(BIGINT, UUID) IS '게시글 삭제 권한 체크: 작성자 또는 Manager 이상';
COMMENT ON FUNCTION can_pin_post(UUID) IS '게시글 고정 권한 체크: Manager 이상만';
COMMENT ON FUNCTION can_manage_categories(UUID) IS '카테고리/태그 관리 권한 체크: Manager 이상만';
COMMENT ON FUNCTION has_role_or_above(user_role, UUID) IS '계층적 역할 권한 체크'; 