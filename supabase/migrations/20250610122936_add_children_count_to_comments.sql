-- 1. comments 테이블에 children_count 컬럼 추가
ALTER TABLE public.comments
ADD COLUMN children_count INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.comments.children_count IS '자식 댓글 수 (성능 최적화용)';

-- 2. children_count를 업데이트하는 함수 생성
CREATE OR REPLACE FUNCTION update_children_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- 댓글 추가 시
    IF (TG_OP = 'INSERT' AND NEW.parent_comment_id IS NOT NULL) THEN
        UPDATE public.comments
        SET children_count = children_count + 1
        WHERE id = NEW.parent_comment_id;
    END IF;

    -- 댓글 삭제 시 (소프트/하드 삭제 모두)
    IF (TG_OP = 'DELETE' AND OLD.parent_comment_id IS NOT NULL) THEN
        UPDATE public.comments
        SET children_count = children_count - 1
        WHERE id = OLD.parent_comment_id;
    END IF;
    
    -- 댓글 상태 변경에 따른 처리 (소프트 삭제)
    IF (TG_OP = 'UPDATE' AND OLD.status = 'active' AND NEW.status = 'soft_deleted' AND OLD.parent_comment_id IS NOT NULL) THEN
        UPDATE public.comments
        SET children_count = children_count - 1
        WHERE id = OLD.parent_comment_id;
    END IF;

    RETURN NULL; -- 결과는 중요하지 않음
END;
$$;

COMMENT ON FUNCTION update_children_count() IS '댓글 추가/삭제 시 부모 댓글의 children_count를 업데이트합니다.';

-- 3. 댓글 추가/삭제 시 함수를 실행하는 트리거 생성
CREATE TRIGGER handle_comment_change
    AFTER INSERT OR DELETE OR UPDATE ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION update_children_count();

COMMENT ON TRIGGER handle_comment_change ON public.comments IS '댓글 추가/삭제/상태변경 시 부모 댓글의 자식 수(children_count)를 업데이트합니다.';
