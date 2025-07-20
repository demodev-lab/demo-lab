/**
 * @file file.types.ts
 * @description 게시글 첨부파일 관련 타입 정의
 */

// 새로 업로드할 파일
export interface NewFileItem {
  type: "new";
  id: string; // 고유 ID (crypto.randomUUID())
  file: File;
  error?: string;
  uploaded?: boolean;
  storedPath?: string;
  publicUrl?: string;
}

// 기존 첨부파일
export interface ExistingFileItem {
  type: "existing";
  id: number; // DB ID
  fileName: string;
  storedPath: string;
  publicUrl: string;
  fileSize: number;
  fileType: string;
  markedForDeletion?: boolean;
}

export type FileItem = NewFileItem | ExistingFileItem;
