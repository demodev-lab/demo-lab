-- 개선된 RLS 정책 (RPC 함수 활용)
-- 2025-01-09: 기존 정책 교체

-- 기존 Posts 정책들 삭제
DROP POLICY IF EXISTS "Users can manage their own posts" ON posts;
DROP POLICY IF EXISTS "Allow individual update access" ON posts;
DROP POLICY IF EXISTS "Allow individual delete access" ON posts;
DROP POLICY IF EXISTS "Hierarchical post update permissions" ON posts;

-- 새로운 RPC 기반 정책들
-- 1. 게시글 수정 정책
CREATE POLICY "RPC based post update policy"
ON posts FOR UPDATE
USING (can_edit_post(id, auth.uid()));

-- 2. 게시글 삭제 정책  
CREATE POLICY "RPC based post delete policy"
ON posts FOR DELETE
USING (can_delete_post(id, auth.uid()));

-- 3. 게시글 고정 정책 (is_pinned 컬럼 업데이트)
CREATE POLICY "RPC based post pin policy"
ON posts FOR UPDATE
USING (
  CASE 
    WHEN OLD.is_pinned != NEW.is_pinned THEN can_pin_post(auth.uid())
    ELSE can_edit_post(id, auth.uid())
  END
);

-- Categories 정책 개선
DROP POLICY IF EXISTS "Allow manager and above to insert tags" ON categories;
DROP POLICY IF EXISTS "Allow manager and above to update tags" ON categories;
DROP POLICY IF EXISTS "Allow manager and above to delete tags" ON categories;

CREATE POLICY "RPC based categories insert policy"
ON categories FOR INSERT
WITH CHECK (can_manage_categories(auth.uid()));

CREATE POLICY "RPC based categories update policy"
ON categories FOR UPDATE
USING (can_manage_categories(auth.uid()));

CREATE POLICY "RPC based categories delete policy"
ON categories FOR DELETE
USING (can_manage_categories(auth.uid()));

-- Tags 정책 개선
DROP POLICY IF EXISTS "Allow manager and above to insert tags" ON tags;
DROP POLICY IF EXISTS "Allow manager and above to update tags" ON tags;
DROP POLICY IF EXISTS "Allow manager and above to delete tags" ON tags;

CREATE POLICY "RPC based tags insert policy"
ON tags FOR INSERT
WITH CHECK (can_manage_categories(auth.uid()));

CREATE POLICY "RPC based tags update policy"
ON tags FOR UPDATE
USING (can_manage_categories(auth.uid()));

CREATE POLICY "RPC based tags delete policy"
ON tags FOR DELETE
USING (can_manage_categories(auth.uid()));

-- 정책 설명 추가
COMMENT ON POLICY "RPC based post update policy" ON posts IS 'RPC 함수를 통한 게시글 수정 권한 체크';
COMMENT ON POLICY "RPC based post delete policy" ON posts IS 'RPC 함수를 통한 게시글 삭제 권한 체크';
COMMENT ON POLICY "RPC based post pin policy" ON posts IS 'RPC 함수를 통한 게시글 고정 권한 체크'; 