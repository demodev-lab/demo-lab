/**
 * @file download.ts
 * @description 파일 다운로드 유틸리티 함수
 */

import { toast } from "sonner";
import type { PostAttachment } from "@/domains/post/types";

interface DownloadResponse {
  downloadUrl: string;
  filename: string;
  fileSize: number;
  fileType: string;
  expiresAt: string;
}

/**
 * 첨부파일 다운로드 함수
 * @param postId 게시글 ID
 * @param attachment 첨부파일 정보
 */
export async function downloadAttachment(
  postId: number,
  attachment: PostAttachment,
): Promise<void> {
  try {
    // 보안 다운로드 API 호출
    const response = await fetch(
      `/api/posts/${postId}/attachments/${attachment.id}/download`,
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "다운로드 링크 생성에 실패했습니다");
    }

    const downloadData: DownloadResponse = await response.json();

    // 브라우저 다운로드 트리거
    const link = document.createElement("a");
    link.href = downloadData.downloadUrl;
    link.download = downloadData.filename;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    // 링크 클릭 시뮬레이션
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`${attachment.original_file_name} 다운로드가 시작되었습니다`);
  } catch (error) {
    console.error("다운로드 에러:", error);
    toast.error(
      error instanceof Error ? error.message : "다운로드에 실패했습니다",
    );
  }
}

/**
 * 다운로드 URL 미리 생성 (성능 최적화용)
 * @param postId 게시글 ID
 * @param attachmentId 첨부파일 ID
 * @returns 다운로드 정보
 */
export async function generateDownloadUrl(
  postId: number,
  attachmentId: number,
): Promise<DownloadResponse | null> {
  try {
    const response = await fetch(
      `/api/posts/${postId}/attachments/${attachmentId}/download`,
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("다운로드 URL 생성 에러:", error);
    return null;
  }
}
