-- 댓글 권한 확인 함수
CREATE OR REPLACE FUNCTION can_manage_comment(p_comment_id BIGINT, p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.comments
    WHERE id = p_comment_id
      AND (
        author_id = p_user_id OR
        has_minimum_role('manager', p_user_id)
      )
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 댓글 소프트 삭제 함수 (자식 댓글이 있을 경우)
CREATE OR REPLACE FUNCTION soft_delete_comment(p_comment_id BIGINT)
RETURNS VOID AS $$
DECLARE
  current_user_id UUID := auth.uid();
BEGIN
  IF NOT can_manage_comment(p_comment_id, current_user_id) THEN
    RAISE EXCEPTION 'You do not have permission to delete this comment.';
  END IF;

  UPDATE public.comments
  SET 
    content = '삭제된 댓글입니다.',
    status = 'soft_deleted',
    updated_at = now()
  WHERE id = p_comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 댓글 완전 삭제 함수 (자식 댓글이 없을 경우)
CREATE OR REPLACE FUNCTION hard_delete_comment(p_comment_id BIGINT)
RETURNS VOID AS $$
DECLARE
  current_user_id UUID := auth.uid();
BEGIN
  IF NOT can_manage_comment(p_comment_id, current_user_id) THEN
    RAISE EXCEPTION 'You do not have permission to delete this comment.';
  END IF;

  DELETE FROM public.comments
  WHERE id = p_comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
