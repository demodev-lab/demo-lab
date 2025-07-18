/**
 * @file update-post.dto.ts
 * @description 게시글 수정 시 사용되는 데이터 전송 객체
 */

import { AttachmentInput } from '@/types/attachment.types';

export interface UpdatePostDto {
  title?: string;
  content?: string;
  categoryId?: number;
  tagIds?: number[];
  
  // 파일 처리를 위한 새로운 구조
  deleteAttachmentIds?: number[]; // 삭제할 기존 첨부파일의 ID 목록
  addAttachments?: AttachmentInput[]; // 새로 추가할 파일 목록
}