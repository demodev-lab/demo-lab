import { create } from "zustand";
import {
  addPost as addPostAction,
  updatePost as updatePostAction,
  deletePost as deletePostAction,
  toggleLikePost as toggleLikePostAction,
} from "@/domains/community/actions/community";
import type { CommunityState } from "./types";

export const useCommunityStore = create<CommunityState>((set, get) => ({
  posts: [],
  categories: [],
  tags: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  },
  loading: false,

  fetchPosts: async (page = 1, limit = 10) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/posts?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      set({
        posts: data.posts,
        pagination: data.pagination,
        loading: false,
      });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      set({ categories: data });
    } catch (error) {
      console.error(error);
      set({ categories: [] });
    }
  },

  fetchTags: async () => {
    try {
      const response = await fetch("/api/tags");
      if (!response.ok) throw new Error("Failed to fetch tags");
      const data = await response.json();
      set({ tags: data });
    } catch (error) {
      console.error(error);
      set({ tags: [] });
    }
  },

  addPost: async (formData: FormData) => {
    await addPostAction(formData);
    await get().fetchPosts(1);
  },

  updatePost: async (postId: number, formData: FormData) => {
    await updatePostAction(postId, formData);
    await get().fetchPosts(get().pagination.currentPage);
  },

  deletePost: async (postId: number) => {
    await deletePostAction(postId);
    await get().fetchPosts(get().pagination.currentPage);
  },

  toggleLikePost: (postId: number, isLiked: boolean) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              is_liked: !post.is_liked,
              like_count: post.is_liked
                ? post.like_count - 1
                : post.like_count + 1,
            }
          : post,
      ),
    }));
    toggleLikePostAction(postId, isLiked).catch(() => {
      get().fetchPosts(get().pagination.currentPage);
    });
  },
}));
