CREATE OR REPLACE FUNCTION toggle_comment_like(p_comment_id BIGINT)
RETURNS VOID AS $$
DECLARE
  current_user_id UUID := auth.uid();
  is_liked BOOLEAN;
  target_comment_status TEXT;
BEGIN
  -- 1. 로그인한 사용자인지 확인
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- 2. 대상 댓글이 'active' 상태인지 확인 (소프트 삭제된 댓글 등에는 좋아요 불가)
  SELECT status INTO target_comment_status FROM public.comments WHERE id = p_comment_id;
  IF target_comment_status != 'active' THEN
    RAISE EXCEPTION 'Cannot like a non-active comment';
  END IF;

  -- 3. 현재 좋아요 상태 확인
  SELECT EXISTS (
    SELECT 1 FROM public.comment_likes
    WHERE comment_id = p_comment_id AND user_id = current_user_id
  ) INTO is_liked;

  -- 4. 상태에 따라 좋아요 또는 좋아요 취소 실행
  IF is_liked THEN
    DELETE FROM public.comment_likes
    WHERE comment_id = p_comment_id AND user_id = current_user_id;
  ELSE
    INSERT INTO public.comment_likes (comment_id, user_id)
    VALUES (p_comment_id, current_user_id);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION toggle_comment_like(BIGINT) IS '사용자의 댓글 좋아요 상태를 토글합니다. (좋아요/좋아요 취소)';
