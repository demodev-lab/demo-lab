/**
 * @file file-utils.ts
 * @description 파일 관련 비즈니스 로직 유틸리티 (경로 생성, 파일명 처리 등)
 */

/**
 * 파일명에서 확장자를 추출합니다.
 * @param filename 파일명
 * @returns 확장자 (점 제외, 소문자)
 */
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return "";
  }
  return filename.substring(lastDotIndex + 1).toLowerCase();
}

/**
 * 도메인별 Storage 경로를 생성합니다.
 * @param userId 사용자 ID
 * @param domain 도메인명 (예: "posts", "profiles", "courses")
 * @param filename 원본 파일명
 * @returns 생성된 경로 (예: "user123/posts/550e8400-e29b-41d4-a716-446655440000.jpg")
 */
export function generateDomainStoragePath(
  userId: string,
  domain: string,
  filename: string,
): string {
  const extension = getFileExtension(filename);
  const uniqueId = crypto.randomUUID();
  const uniqueFilename = extension ? `${uniqueId}.${extension}` : uniqueId;

  return `${userId}/${domain}/${uniqueFilename}`;
}

/**
 * MIME 타입이 이미지인지 확인합니다.
 * @param mimeType MIME 타입
 * @returns 이미지 여부
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

/**
 * 파일 타입별 아이콘 이름을 반환합니다.
 * @param mimeType MIME 타입
 * @returns lucide-react 아이콘 이름
 */
export function getFileIconName(mimeType: string): string {
  if (isImageFile(mimeType)) return "Image";
  if (mimeType === "application/pdf") return "FileText";
  if (mimeType.includes("word")) return "FileText";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
    return "Sheet";
  if (mimeType.includes("powerpoint") || mimeType.includes("presentation"))
    return "Presentation";
  if (mimeType.includes("zip") || mimeType.includes("compressed"))
    return "Archive";
  if (mimeType.startsWith("text/")) return "FileText";
  return "File";
}

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 변환합니다.
 * @param bytes 바이트 크기
 * @returns 포맷된 크기 문자열
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
