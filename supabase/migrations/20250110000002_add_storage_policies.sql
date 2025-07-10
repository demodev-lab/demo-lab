-- demo-lab-storage 버킷에 대한 RLS 정책 추가

-- 기존 정책 삭제 (있을 경우)
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;

-- 1. 인증된 사용자만 파일 업로드 가능
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'demo-lab-storage'
  AND auth.role() = 'authenticated'
);

-- 2. 모든 사용자가 파일 조회/다운로드 가능 (공개 버킷)
CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT
USING (bucket_id = 'demo-lab-storage');

-- 3. 인증된 사용자만 파일 삭제 가능
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'demo-lab-storage' 
  AND auth.role() = 'authenticated'
);

-- 4. 인증된 사용자만 파일 업데이트 가능
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'demo-lab-storage' 
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'demo-lab-storage' 
  AND auth.role() = 'authenticated'
);