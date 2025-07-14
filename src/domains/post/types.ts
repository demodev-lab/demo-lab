import type { Tag } from "@/domains/tag/types";

import type { PaginationState } from "@/types/pagination";
import type { Role } from "@/types/auth";

// 커뮤니티 도메인 타입들
export interface Post {
  id: number;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  category_id: number;
  category_name: string;
  category_color: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  comment_count: number;
  view_count: number;
  is_pinned: boolean;
  is_liked?: boolean;
  tags: Tag[];
  attachments?: PostAttachment[];
}

export interface PostAttachment {
  id: number;
  post_id: number;
  original_file_name: string;
  stored_file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
}


export interface PostWithPagination {
  posts: Post[];
  pagination: PaginationState;
}

export interface PostFormData {
  title: string;
  content: string;
  categoryId: number;
  authorId: string;
  tagIds?: number[];
}

export type SortOption = "latest" | "popular" | "comments";

export interface PostFilters {
  categoryId?: number;
  tagIds?: number[];
  search?: string;
  sort?: SortOption;
}

export interface PostPermissions {
  canEdit: (post: Post, userRole?: Role, userId?: string) => boolean;
  canDelete: (post: Post, userRole?: Role, userId?: string) => boolean;
}

// 카테고리 상수
export const DEFAULT_CATEGORY = "All";
