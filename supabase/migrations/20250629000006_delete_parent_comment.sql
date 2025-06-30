-- =============================================
-- Enhanced comment deletion with parent cleanup
-- =============================================

-- Drop the existing function first
DROP FUNCTION IF EXISTS delete_comment_rpc(INTEGER);

-- Create enhanced delete_comment_rpc that also removes soft-deleted parents when last child is deleted
CREATE OR REPLACE FUNCTION delete_comment_rpc(comment_id INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    parent_comment_id INTEGER;
    comment_author_id UUID;
    post_id_var INTEGER;
    has_children BOOLEAN;
    parent_deleted_at TIMESTAMPTZ;
    parent_children_count INTEGER;
BEGIN
    -- Get comment info
    SELECT parent_id, author_id, post_id, children_count > 0
    INTO parent_comment_id, comment_author_id, post_id_var, has_children
    FROM comments
    WHERE id = comment_id;
    
    -- Check permissions: author or manager+
    IF comment_author_id != auth.uid() AND NOT has_minimum_role('manager') THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;
    
    -- Handle the comment deletion
    IF has_children THEN
        -- Soft delete: mark as deleted but keep for context
        UPDATE comments 
        SET 
            deleted_at = NOW(),
            deleted_content = content,
            content = '[삭제된 댓글입니다]'
        WHERE id = comment_id;
    ELSE
        -- Hard delete: actually remove from database
        DELETE FROM comments WHERE id = comment_id;
        
        -- Check if parent comment needs to be deleted too
        IF parent_comment_id IS NOT NULL THEN
            -- Get parent comment info
            SELECT deleted_at, children_count
            INTO parent_deleted_at, parent_children_count
            FROM comments
            WHERE id = parent_comment_id;
            
            -- If parent is soft-deleted and this was the last child, delete the parent too
            IF parent_deleted_at IS NOT NULL AND parent_children_count = 0 THEN
                DELETE FROM comments WHERE id = parent_comment_id;
            END IF;
        END IF;
    END IF;
    
    RETURN TRUE;
END;
$$;

-- Add index for better performance when checking parent comments
CREATE INDEX IF NOT EXISTS idx_comments_parent_id_deleted_at ON comments(parent_id, deleted_at);