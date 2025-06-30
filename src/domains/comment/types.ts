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
  status: string;
  isLiked: boolean;
  replies: ExtendedComment[];
}


