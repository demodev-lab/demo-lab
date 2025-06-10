-- 1. comment_likes 테이블 생성
CREATE TABLE public.comment_likes (
    comment_id BIGINT NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (comment_id, user_id)
);

COMMENT ON TABLE public.comment_likes IS '댓글 좋아요 관계 테이블';

-- 인덱스 추가
CREATE INDEX idx_comment_likes_user_id ON public.comment_likes(user_id);

-- 2. comment_likes 테이블 RLS 정책 설정
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comment_likes_read_policy"
ON public.comment_likes FOR SELECT
USING (true);

CREATE POLICY "comment_likes_insert_policy"
ON public.comment_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comment_likes_delete_policy"
ON public.comment_likes FOR DELETE
USING (auth.uid() = user_id);

-- 3. like_count 업데이트를 위한 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_comment_like_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.comments
        SET like_count = like_count + 1
        WHERE id = NEW.comment_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.comments
        SET like_count = like_count - 1
        WHERE id = OLD.comment_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

-- 4. 트리거 생성
CREATE TRIGGER on_comment_like_change
    AFTER INSERT OR DELETE ON public.comment_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_comment_like_count();

COMMENT ON TRIGGER on_comment_like_change ON public.comment_likes IS 'comment_likes 테이블 변경 시 comments.like_count를 업데이트합니다.';
