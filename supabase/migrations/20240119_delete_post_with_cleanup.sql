-- 게시글 삭제 함수 (관련 리소스 모두 정리)
-- CASCADE가 이미 설정되어 있으므로 Storage 파일만 따로 정리하면 됨
CREATE OR REPLACE FUNCTION delete_post_with_cleanup(
  p_post_id BIGINT,
  p_user_id UUID
) RETURNS JSONB AS $$
DECLARE
  v_post_author_id UUID;
  v_user_role TEXT;
  v_attachment_files TEXT[];
  v_result JSONB;
BEGIN
  -- 1. 게시글 존재 여부 및 작성자 확인
  SELECT author_id INTO v_post_author_id
  FROM posts
  WHERE id = p_post_id;
  
  IF v_post_author_id IS NULL THEN
    RAISE EXCEPTION '게시글을 찾을 수 없습니다.';
  END IF;
  
  -- 2. 사용자 권한 확인
  SELECT role INTO v_user_role
  FROM profiles
  WHERE id = p_user_id;
  
  -- 작성자 본인이거나 관리자만 삭제 가능
  IF v_post_author_id != p_user_id AND v_user_role != 'admin' THEN
    RAISE EXCEPTION '게시글을 삭제할 권한이 없습니다.';
  END IF;
  
  -- 3. 삭제할 첨부파일 경로 저장 (Storage 정리용)
  -- CASCADE로 인해 post_attachments도 함께 삭제되므로 먼저 경로를 저장
  SELECT ARRAY_AGG(stored_file_path) INTO v_attachment_files
  FROM post_attachments
  WHERE post_id = p_post_id;
  
  -- 4. 게시글 삭제 
  -- CASCADE 설정으로 다음 테이블들이 자동 삭제됨:
  -- - post_tags (게시글-태그 연결)
  -- - post_attachments (첨부파일 메타데이터)
  -- - post_likes (좋아요)
  -- - comments (댓글 및 하위 댓글들도 CASCADE로 삭제)
  -- - comment_likes (댓글 좋아요들도 CASCADE로 삭제)
  DELETE FROM posts WHERE id = p_post_id;
  
  -- 5. 결과 반환 (Storage에서 삭제할 파일 목록 포함)
  v_result := jsonb_build_object(
    'success', true,
    'deleted_files', COALESCE(v_attachment_files, ARRAY[]::TEXT[]),
    'message', '게시글과 관련 데이터가 성공적으로 삭제되었습니다.'
  );
  
  RETURN v_result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- 에러 발생 시 자동으로 롤백됨 (CASCADE 삭제도 모두 롤백)
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 권한 설정
GRANT EXECUTE ON FUNCTION delete_post_with_cleanup TO authenticated;