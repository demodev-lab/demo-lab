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

export interface Tag {
  id: number;
  name: string;
  color: string;
  description?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  postCount: number;
}
