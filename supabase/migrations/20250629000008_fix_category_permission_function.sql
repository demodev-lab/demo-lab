-- =============================================
-- Fix can_post_in_category function
-- =============================================

-- Drop the policy that depends on the function first
DROP POLICY IF EXISTS "Users can create posts with category permission check" ON posts;

-- Drop the existing function
DROP FUNCTION IF EXISTS can_post_in_category(INTEGER);

-- Create a fixed version of the function
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
    
    -- If user has no role, deny access
    IF user_role_var IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check if user has sufficient role using the has_minimum_role function
    RETURN has_minimum_role(category_role, auth.uid());
END;
$$;

-- Recreate the policy
CREATE POLICY "Users can create posts with category permission check" ON posts
    FOR INSERT
    WITH CHECK (
        auth.uid() = author_id 
        AND can_post_in_category(category_id)
    );