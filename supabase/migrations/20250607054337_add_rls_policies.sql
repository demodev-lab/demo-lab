-- RLS 정책 추가 마이그레이션
-- 테이블별 보안 정책 설정

-- 1. RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 2. Profiles 정책
CREATE POLICY "Public profiles are viewable by authenticated users" 
ON profiles FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- 3. Categories 정책 (공개 읽기)
CREATE POLICY "Allow public read access" 
ON categories FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated users to read categories" 
ON categories FOR SELECT 
TO authenticated 
USING (true);

-- Categories 정책 (manager 이상의 권한 사용자가 관리)
CREATE POLICY "Allow manager and above to insert categories" 
ON categories FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles user_profile 
        WHERE user_profile.id = auth.uid() 
        AND user_profile.role >= 'manager'
    )
);

CREATE POLICY "Allow manager and above to update categories" 
ON categories FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM profiles user_profile 
        WHERE user_profile.id = auth.uid() 
        AND user_profile.role >= 'manager'
    )
);

CREATE POLICY "Allow manager and above to delete categories" 
ON categories FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM profiles user_profile 
        WHERE user_profile.id = auth.uid() 
        AND user_profile.role >= 'manager'
    )
);

-- 4. Tags 정책 (공개 읽기)
CREATE POLICY "Allow public read access" 
ON tags FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated users to read tags" 
ON tags FOR SELECT 
TO authenticated 
USING (true);

-- Tags 정책 (manager 이상의 권한 사용자가 관리)
CREATE POLICY "Allow manager and above to insert tags" 
ON tags FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles user_profile 
        WHERE user_profile.id = auth.uid() 
        AND user_profile.role >= 'manager'
    )
);

CREATE POLICY "Allow manager and above to update tags" 
ON tags FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM profiles user_profile 
        WHERE user_profile.id = auth.uid() 
        AND user_profile.role >= 'manager'
    )
);

CREATE POLICY "Allow manager and above to delete tags" 
ON tags FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM profiles user_profile 
        WHERE user_profile.id = auth.uid() 
        AND user_profile.role >= 'manager'
    )
);

-- 5. Posts 정책
CREATE POLICY "Anyone can view published posts" 
ON posts FOR SELECT 
USING (status = 'published');

CREATE POLICY "Posts are viewable by everyone" 
ON posts FOR SELECT 
USING (true);

CREATE POLICY "Users can view their own posts" 
ON posts FOR SELECT 
USING (author_id = auth.uid());

CREATE POLICY "Users can insert their own posts" 
ON posts FOR INSERT 
WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can manage their own posts" 
ON posts 
USING (auth.uid() = author_id);

CREATE POLICY "Allow individual update access" 
ON posts FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Allow individual delete access" 
ON posts FOR DELETE 
USING (auth.uid() = author_id);

-- 계층적 권한 (매니저/관리자)
CREATE POLICY "Hierarchical post update permissions" 
ON posts FOR UPDATE 
USING (
    author_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM profiles user_profile 
        WHERE user_profile.id = auth.uid() 
        AND user_profile.role >= 'manager'
    )
);

CREATE POLICY "Hierarchical post delete permissions" 
ON posts FOR DELETE 
USING (
    author_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM profiles user_profile 
        WHERE user_profile.id = auth.uid() 
        AND user_profile.role >= 'manager'
    )
);

-- 6. Post Tags 정책
CREATE POLICY "Allow public read access" 
ON post_tags FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view post tags" 
ON post_tags FOR SELECT 
USING (true);

CREATE POLICY "Hierarchical post tags insert permissions" 
ON post_tags FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM posts 
        WHERE posts.id = post_tags.post_id 
        AND posts.author_id = auth.uid()
    ) OR 
    EXISTS (
        SELECT 1 FROM profiles user_profile 
        WHERE user_profile.id = auth.uid() 
        AND user_profile.role >= 'manager'
    )
);

CREATE POLICY "Hierarchical post tags update permissions" 
ON post_tags FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM posts 
        WHERE posts.id = post_tags.post_id 
        AND posts.author_id = auth.uid()
    ) OR 
    EXISTS (
        SELECT 1 FROM profiles user_profile 
        WHERE user_profile.id = auth.uid() 
        AND user_profile.role >= 'manager'
    )
);

CREATE POLICY "Hierarchical post tags delete permissions" 
ON post_tags FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM posts 
        WHERE posts.id = post_tags.post_id 
        AND posts.author_id = auth.uid()
    ) OR 
    EXISTS (
        SELECT 1 FROM profiles user_profile 
        WHERE user_profile.id = auth.uid() 
        AND user_profile.role >= 'manager'
    )
);

-- 7. Likes 정책
CREATE POLICY "Allow public read access" 
ON likes FOR SELECT 
USING (true);

CREATE POLICY "Allow individual insert access" 
ON likes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow individual delete access" 
ON likes FOR DELETE 
USING (auth.uid() = user_id);

-- 8. Comments 정책
CREATE POLICY "Allow public read access" 
ON comments FOR SELECT 
USING (status = 'visible' AND is_spam = false);

CREATE POLICY "Allow individual insert access" 
ON comments FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Allow individual update access" 
ON comments FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Allow individual delete access" 
ON comments FOR DELETE 
USING (auth.uid() = author_id);

-- 9. Subscriptions 정책
CREATE POLICY "Users can view their own subscriptions" 
ON subscriptions FOR SELECT 
USING (auth.uid() = user_id);
