-- posts 테이블에 updated_at 컬럼 추가
ALTER TABLE posts 
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- 기존 레코드들에 대해 updated_at을 created_at과 동일하게 설정
UPDATE posts 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- RPC 함수 수정 (updated_at 컬럼 이슈 해결)
CREATE OR REPLACE FUNCTION update_post_with_attachments(
  p_post_id BIGINT,
  p_user_id UUID,
  p_title TEXT DEFAULT NULL,
  p_content TEXT DEFAULT NULL,
  p_category_id BIGINT DEFAULT NULL,
  p_tag_ids BIGINT[] DEFAULT NULL,
  p_delete_attachment_ids BIGINT[] DEFAULT NULL,
  p_add_attachments JSONB DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_post_author_id UUID;
  v_user_role TEXT;
  v_deleted_files TEXT[];
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
  
  -- 작성자 본인이거나 관리자만 수정 가능
  IF v_post_author_id != p_user_id AND v_user_role != 'admin' THEN
    RAISE EXCEPTION '게시글을 수정할 권한이 없습니다.';
  END IF;
  
  -- 3. 삭제할 첨부파일의 경로 저장 (트랜잭션 롤백 시 Storage 삭제 방지)
  IF p_delete_attachment_ids IS NOT NULL AND array_length(p_delete_attachment_ids, 1) > 0 THEN
    SELECT ARRAY_AGG(stored_file_path) INTO v_deleted_files
    FROM post_attachments
    WHERE id = ANY(p_delete_attachment_ids) AND post_id = p_post_id;
    
    -- 첨부파일 DB 레코드 삭제
    DELETE FROM post_attachments 
    WHERE id = ANY(p_delete_attachment_ids) AND post_id = p_post_id;
  END IF;
  
  -- 4. 새 첨부파일 추가
  IF p_add_attachments IS NOT NULL THEN
    INSERT INTO post_attachments (
      post_id, 
      original_file_name, 
      stored_file_path, 
      file_size, 
      file_type
    )
    SELECT 
      p_post_id,
      (attachment->>'originalName')::TEXT,
      (attachment->>'storedPath')::TEXT,
      (attachment->>'fileSize')::BIGINT,
      (attachment->>'fileType')::TEXT
    FROM jsonb_array_elements(p_add_attachments) AS attachment;
  END IF;
  
  -- 5. 게시글 정보 업데이트 (updated_at 컬럼 추가됨)
  UPDATE posts SET
    title = COALESCE(p_title, title),
    content = COALESCE(p_content, content),
    category_id = COALESCE(p_category_id, category_id),
    updated_at = NOW()
  WHERE id = p_post_id;
  
  -- 6. 태그 업데이트
  IF p_tag_ids IS NOT NULL THEN
    -- 기존 태그 삭제
    DELETE FROM post_tags WHERE post_id = p_post_id;
    
    -- 새 태그 추가
    IF array_length(p_tag_ids, 1) > 0 THEN
      INSERT INTO post_tags (post_id, tag_id)
      SELECT p_post_id, unnest(p_tag_ids);
    END IF;
  END IF;
  
  -- 7. 결과 반환
  v_result := jsonb_build_object(
    'success', true,
    'deleted_files', COALESCE(v_deleted_files, ARRAY[]::TEXT[])
  );
  
  RETURN v_result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- 에러 발생 시 자동으로 롤백됨
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;