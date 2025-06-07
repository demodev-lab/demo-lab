import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addPost as addPostAction,
  deletePost as deletePostAction,
  toggleLikePost as toggleLikePostAction,
} from "@/app/actions/community";

export interface Comment {
  id: number;
  author: string;
  authorUsername?: string;
  email?: string;
  date: string;
  content: string;
  status: "visible" | "hidden";
  isSpam?: boolean;
  likes?: number;
  replies?: Comment[];
}

export interface Post {
  id: number;
  created_at: string;
  title: string;
  content: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_pinned: boolean;
  author_id: string;
  author_name: string;
  category_id: number;
  category_name: string;
  category_color: string;
  tags: Tag[];
  is_liked: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  postCount: number;
}

export interface Tag {
  id: number;
  name: string;
  description: string | null;
  color: string;
  postCount?: number;
}

interface CommunityState {
  posts: Post[];
  categories: Category[];
  tags: Tag[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
  loading: boolean;
  fetchPosts: (page?: number, limit?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchTags: () => Promise<void>;
  addPost: (formData: FormData) => Promise<void>;
  deletePost: (postId: number) => Promise<void>;
  toggleLikePost: (postId: number, isLiked: boolean) => void;
}

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
