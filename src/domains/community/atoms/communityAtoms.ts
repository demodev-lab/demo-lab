import { atom, WritableAtom } from "jotai";
import type { Post } from "@/domains/post/types";
import type { CommunityState, CommunityFilters } from "../types";

// 기본 상태
const initialState: CommunityState = {
  currentPage: 1,
  selectedPost: null,
  selectedCategoryId: null,
  selectedTagIds: [],
  sortOption: "latest",
};

// 기본 필터
const initialFilters: CommunityFilters = {
  categoryId: null,
  tagIds: [],
  sortOption: "latest",
  searchQuery: "",
};

// 상태 atoms
export const communityStateAtom = atom<CommunityState>(initialState);
export const communityFiltersAtom = atom<CommunityFilters>(initialFilters);

// 선택된 게시글 atom
export const selectedPostAtom = atom<Post | null>(null) as WritableAtom<
  Post | null,
  [Post | null],
  void
>;

// 필터 atoms
export const selectedCategoryIdAtom = atom<number | null>(null);
export const selectedTagIdsAtom = atom<number[]>([]);
export const sortOptionAtom = atom<"latest" | "popular" | "comments">("latest");
export const searchQueryAtom = atom<string>("");

// 페이지네이션 atom
export const currentPageAtom = atom<number>(1);
