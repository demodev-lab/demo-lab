-- =============================================
-- Comment system fixes and improvements
-- =============================================

-- Create trigger to automatically update comment count on posts
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts 
        SET comment_count = comment_count + 1 
        WHERE id = NEW.post_id;
        
        -- Update parent comment's children_count if it's a reply
        IF NEW.parent_id IS NOT NULL THEN
            UPDATE comments 
            SET children_count = children_count + 1 
            WHERE id = NEW.parent_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts 
        SET comment_count = comment_count - 1 
        WHERE id = OLD.post_id;
        
        -- Update parent comment's children_count if it's a reply
        IF OLD.parent_id IS NOT NULL THEN
            UPDATE comments 
            SET children_count = children_count - 1 
            WHERE id = OLD.parent_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for comment count updates
CREATE TRIGGER update_post_comment_count_trigger
AFTER INSERT OR DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_post_comment_count();

-- Add soft delete support for comments
ALTER TABLE comments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS deleted_content TEXT;

-- Update delete_comment_rpc to support soft delete for comments with children
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
    END IF;
    
    RETURN TRUE;
END;
$$;

-- Update RLS policy to handle soft-deleted comments
CREATE POLICY "Hide deleted content from non-authors" ON comments
    FOR SELECT
    USING (
        deleted_at IS NULL 
        OR auth.uid() = author_id 
        OR has_minimum_role('manager')
    );