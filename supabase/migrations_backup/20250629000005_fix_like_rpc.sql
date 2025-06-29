-- Fix toggle_post_like_rpc function to bypass RLS policies
CREATE OR REPLACE FUNCTION toggle_post_like_rpc(post_id_param INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Allow function to bypass RLS
AS $$
DECLARE
    like_exists BOOLEAN;
BEGIN
    -- Check if like exists
    SELECT EXISTS(
        SELECT 1 FROM post_likes 
        WHERE post_id = post_id_param AND user_id = auth.uid()
    ) INTO like_exists;
    
    IF like_exists THEN
        -- Remove like
        DELETE FROM post_likes 
        WHERE post_id = post_id_param AND user_id = auth.uid();
        
        -- Decrease like count
        UPDATE posts 
        SET like_count = GREATEST(0, like_count - 1) -- Prevent negative counts
        WHERE id = post_id_param;
        
        RETURN FALSE;
    ELSE
        -- Add like
        INSERT INTO post_likes (post_id, user_id) 
        VALUES (post_id_param, auth.uid());
        
        -- Increase like count
        UPDATE posts 
        SET like_count = like_count + 1 
        WHERE id = post_id_param;
        
        RETURN TRUE;
    END IF;
END;
$$;

-- Also fix the comment like RPC if it exists
CREATE OR REPLACE FUNCTION toggle_comment_like_rpc(comment_id_param INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Allow function to bypass RLS
AS $$
DECLARE
    like_exists BOOLEAN;
BEGIN
    -- Check if like exists
    SELECT EXISTS(
        SELECT 1 FROM comment_likes 
        WHERE comment_id = comment_id_param AND user_id = auth.uid()
    ) INTO like_exists;
    
    IF like_exists THEN
        -- Remove like
        DELETE FROM comment_likes 
        WHERE comment_id = comment_id_param AND user_id = auth.uid();
        
        -- Decrease like count
        UPDATE comments 
        SET like_count = GREATEST(0, like_count - 1) -- Prevent negative counts
        WHERE id = comment_id_param;
        
        RETURN FALSE;
    ELSE
        -- Add like
        INSERT INTO comment_likes (comment_id, user_id) 
        VALUES (comment_id_param, auth.uid());
        
        -- Increase like count
        UPDATE comments 
        SET like_count = like_count + 1 
        WHERE id = comment_id_param;
        
        RETURN TRUE;
    END IF;
END;
$$;