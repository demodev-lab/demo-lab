import type { Post } from "@/domains/post/types";
import type { Category } from "@/domains/category/types";
import type { Tag } from "@/domains/tag/types";
import type { PaginationState } from "@/types/pagination";

// 커뮤니티 상태
export interface CommunityState {
  // UI 상태
  currentPage: number;
  selectedPost: Post | null;
  selectedCategoryId: number | null;
  selectedTagIds: number[];
  sortOption: "latest" | "popular" | "comments";
}

// 필터 상태
export interface CommunityFilters {
  categoryId: number | null;
  tagIds: number[];
  sortOption: "latest" | "popular" | "comments";
  searchQuery: string;
}

// 커뮤니티 응답
export interface CommunityResponse {
  posts: Post[];
  categories: Category[];
  tags: Tag[];
  pagination: PaginationState;
}
