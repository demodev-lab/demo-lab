// 다른 도메인의 타입들을 재사용
import type { Tag } from "@/domains/tag/types";
import type { Category } from "@/domains/category/types";

export type { Tag } from "@/domains/tag/types";
export type { Category } from "@/domains/category/types";

export interface Post {
  id: number;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  category_id: number;
  category_name: string;
  category_color?: string;
  created_at: string;
  updated_at?: string;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  is_pinned: boolean;
  tags?: Tag[];
}

export interface Comment {
  id: number;
  post_id: number;
  parent_comment_id?: number | null;
  author_id: string;
  content: string;
  author: string;
  authorUsername: string;
  date: string;
  likes: number;
  status: string;
  replies?: Comment[];
}

export interface ExtendedComment extends Comment {
  depth?: number;
  isLiked?: boolean;
}

export interface PostFormData {
  title: string;
  content: string;
  categoryId: string;
  tagIds: number[];
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

// 정렬 옵션 상수
export const SORT_OPTIONS = {
  DEFAULT: "default",
  LATEST: "latest",
  POPULAR: "popular",
  OLDEST: "oldest",
} as const;

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];

// 카테고리 상수
export const DEFAULT_CATEGORY = "All";
