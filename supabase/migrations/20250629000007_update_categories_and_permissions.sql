-- =============================================
-- Update categories and add permission restrictions
-- =============================================

-- Delete existing categories
DELETE FROM categories;

-- Insert new default categories
INSERT INTO categories (name, description, color) VALUES
    ('공지', '중요 공지사항', '#DC2626'),
    ('자유', '자유로운 주제로 대화', '#3B82F6'),
    ('질문', '도움이 필요하거나 궁금한 점', '#10B981');

-- Add a restriction column to categories table to specify role requirements
ALTER TABLE categories ADD COLUMN IF NOT EXISTS min_role_required user_role DEFAULT NULL;

-- Update the 공지 category to require manager role
UPDATE categories SET min_role_required = 'manager' WHERE name = '공지';

-- Create a function to check if user can post in a category
CREATE OR REPLACE FUNCTION can_post_in_category(category_id_param INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    category_role user_role;
    user_role_var user_role;
BEGIN
    -- Get the minimum required role for the category
    SELECT min_role_required INTO category_role
    FROM categories
    WHERE id = category_id_param;
    
    -- If no role restriction, anyone can post
    IF category_role IS NULL THEN
        RETURN TRUE;
    END IF;
    
    -- Get the user's role
    SELECT role INTO user_role_var
    FROM profiles
    WHERE id = auth.uid();
    
    -- Check if user has sufficient role
    RETURN has_minimum_role(category_role::text);
END;
$$;

-- Update the RLS policy for posts to check category permissions
DROP POLICY IF EXISTS "Users can create their own posts" ON posts;

CREATE POLICY "Users can create posts with category permission check" ON posts
    FOR INSERT
    WITH CHECK (
        auth.uid() = author_id 
        AND can_post_in_category(category_id)
    );

-- Add validation to the create post function (if using server actions)
-- This will be handled in the application layer