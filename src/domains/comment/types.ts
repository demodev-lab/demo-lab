// Comment types
export interface Comment {
  id: number;
  created_at: string;
  content: string;
  post_id: number;
  author_id: string;
  parent_id: number | null;
  children_count: number;
  like_count: number;
  status?: string;
}

export interface ExtendedComment {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  author_id: string;
  content: string;
  author: string;
  authorUsername: string;
  date: string;
  likes: number;
  status?: string;
  isLiked: boolean;
  replies: ExtendedComment[];
}

export interface CommentFormData {
  content: string;
  parentId?: number | null;
}

export interface CommentAuthor {
  id: string;
  full_name: string;
  username?: string;
  role: string;
}
