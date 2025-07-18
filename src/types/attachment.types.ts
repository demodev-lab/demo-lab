/**
 * @file attachment.types.ts
 * @description 첨부파일 관련 타입 정의
 */

// 재사용될 첨부파일 기본 입력 타입
export interface AttachmentInput {
  originalName: string;
  storedPath: string; // 클라이언트가 Supabase Storage에 선-업로드 후 받은 경로
  publicUrl: string;  // Supabase getPublicUrl()로 얻은 URL
  fileSize: number;
  fileType: string;
}