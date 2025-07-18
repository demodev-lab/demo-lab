-- 게시글 첨부파일 테이블 생성
CREATE TABLE post_attachments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    original_file_name TEXT NOT NULL,
    stored_file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type TEXT NOT NULL, -- MIME 타입 저장
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (게시글별 첨부파일 조회 최적화)
CREATE INDEX idx_post_attachments_post_id ON post_attachments(post_id);

-- 파일 크기 체크 제약 조건 (100MB 제한)
ALTER TABLE post_attachments 
ADD CONSTRAINT check_file_size 
CHECK (file_size > 0 AND file_size <= 104857600); -- 100MB in bytes

-- RLS (Row Level Security) 활성화
ALTER TABLE post_attachments ENABLE ROW LEVEL SECURITY;

-- 정책 생성: 모든 사용자가 첨부파일을 읽을 수 있음
CREATE POLICY "Anyone can view post attachments" 
ON post_attachments FOR SELECT 
USING (true);

-- 정책 생성: 인증된 사용자만 첨부파일 업로드 가능
CREATE POLICY "Authenticated users can insert post attachments" 
ON post_attachments FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- 정책 생성: 작성자만 자신의 게시글 첨부파일 삭제 가능
CREATE POLICY "Authors can delete their post attachments" 
ON post_attachments FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM posts 
        WHERE posts.id = post_attachments.post_id 
        AND posts.author_id = auth.uid()
    )
);

-- 첨부파일 개수 제한을 위한 함수 생성
CREATE OR REPLACE FUNCTION check_attachment_limit()
RETURNS TRIGGER AS $$
BEGIN
    -- 게시글당 최대 10개 첨부파일 제한
    IF (
        SELECT COUNT(*) 
        FROM post_attachments 
        WHERE post_id = NEW.post_id
    ) >= 10 THEN
        RAISE EXCEPTION 'Maximum 10 attachments per post allowed';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER trigger_check_attachment_limit
    BEFORE INSERT ON post_attachments
    FOR EACH ROW
    EXECUTE FUNCTION check_attachment_limit();

-- 게시글 첨부파일 개수 조회 함수
CREATE OR REPLACE FUNCTION get_post_attachment_count(post_id_param INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER 
        FROM post_attachments 
        WHERE post_id = post_id_param
    );
END;
$$ LANGUAGE plpgsql;

-- 게시글 첨부파일 전체 크기 조회 함수
CREATE OR REPLACE FUNCTION get_post_total_attachment_size(post_id_param INTEGER)
RETURNS BIGINT AS $$
BEGIN
    RETURN (
        SELECT COALESCE(SUM(file_size), 0)::BIGINT 
        FROM post_attachments 
        WHERE post_id = post_id_param
    );
END;
$$ LANGUAGE plpgsql;

-- 사용자별 총 첨부파일 크기 조회 함수 (용량 제한 체크용)
CREATE OR REPLACE FUNCTION get_user_total_attachment_size(user_id_param UUID)
RETURNS BIGINT AS $$
BEGIN
    RETURN (
        SELECT COALESCE(SUM(pa.file_size), 0)::BIGINT 
        FROM post_attachments pa
        JOIN posts p ON pa.post_id = p.id
        WHERE p.author_id = user_id_param
    );
END;
$$ LANGUAGE plpgsql;