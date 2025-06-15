-- post_likes 테이블 RLS 활성화 및 정책 추가

-- 1. RLS 활성화
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- 2. 본인만 insert/select/delete 가능하도록 정책 추가
CREATE POLICY "Allow insert own like" ON post_likes
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow select own like" ON post_likes
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Allow delete own like" ON post_likes
  FOR DELETE
  USING (user_id = auth.uid());
