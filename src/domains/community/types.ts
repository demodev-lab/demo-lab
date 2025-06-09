import { Category } from "../category/types";
import { Tag } from "../tag/types";

// 커뮤니티 도메인 타입들
export interface Post {
  id: number;
  author_id: string;
  author_name: string;
  title: string;
  content: string;
  is_pinned: boolean;
  category_id: number;
  category_name: string;
  category_color: string;
  tags: Tag[];
  like_count: number;
  comment_count: number;
  view_count: number;
  is_liked: boolean;
  created_at: string;
}

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

export interface CommunityState {
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
  updatePost: (postId: number, formData: FormData) => Promise<void>;
  deletePost: (postId: number) => Promise<void>;
  toggleLikePost: (postId: number, isLiked: boolean) => void;
}
