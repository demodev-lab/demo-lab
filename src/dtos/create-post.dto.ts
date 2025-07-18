/**
 * @file create-post.dto.ts
 * @description 게시글 생성 시 사용되는 데이터 전송 객체
 */

import { AttachmentInput } from '@/types/attachment.types';

export interface CreatePostDto {
  title: string;
  content: string;
  categoryId: number;
  authorId: string;
  tagIds?: number[];
  attachments?: AttachmentInput[]; // 새로 추가될 파일 목록 (Optional)
}