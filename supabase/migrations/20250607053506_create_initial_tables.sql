-- 초기 테이블 생성 마이그레이션
-- 커뮤니티 플랫폼을 위한 기본 스키마

-- 1. 사용자 역할 enum 생성
CREATE TYPE user_role AS ENUM ('user', 'manager', 'admin');

-- 2. 프로필 테이블 (auth.users 확장)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    role user_role DEFAULT 'user' NOT NULL
);

COMMENT ON TABLE profiles IS 'Public profile information for each user.';

-- 3. 카테고리 테이블
CREATE TABLE categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#888888' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE categories IS '게시글 카테고리';

-- 4. 태그 테이블
CREATE TABLE tags (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#888888' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE tags IS '게시글 태그';

-- 5. 게시글 테이블
CREATE TABLE posts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT,
    status TEXT DEFAULT 'published' NOT NULL,
    is_pinned BOOLEAN DEFAULT false NOT NULL,
    is_spam BOOLEAN DEFAULT false NOT NULL,
    view_count INTEGER DEFAULT 0 NOT NULL,
    like_count INTEGER DEFAULT 0 NOT NULL,
    comment_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ
);

COMMENT ON TABLE posts IS '커뮤니티 게시글';

-- 6. 게시글-태그 관계 테이블 (다대다)
CREATE TABLE post_tags (
    post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
    tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

COMMENT ON TABLE post_tags IS '게시글과 태그의 다대다 관계';

-- 7. 좋아요 테이블
CREATE TABLE likes (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, post_id)
);

COMMENT ON TABLE likes IS '사용자의 게시글 좋아요 관계';

-- 8. 댓글 테이블
CREATE TABLE comments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    parent_comment_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'visible' NOT NULL,
    is_spam BOOLEAN DEFAULT false NOT NULL,
    like_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ
);

COMMENT ON TABLE comments IS '게시글 댓글';

-- 9. 구독 테이블 (결제 관련)
CREATE TABLE subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    lemonsqueezy_subscription_id BIGINT NOT NULL UNIQUE,
    status TEXT NOT NULL,
    current_period_end TIMESTAMPTZ,
    product_id BIGINT,
    variant_id BIGINT,
    price_id BIGINT,
    lemon_squeezy_customer_id BIGINT,
    lemon_squeezy_order_id BIGINT,
    test_mode BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
