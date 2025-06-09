import React from "react";
import { Loader2 } from "lucide-react";
import { PostItem } from "./PostItem";
import type { Post } from "../types";

interface PostListProps {
  posts: Post[];
  loading: boolean;
  onOpenModal: (post: Post) => void;
  onToggleLike: (postId: number, isLiked: boolean) => void;
  onEdit: (post: Post) => void;
  onDelete: (postId: number) => void;
  canEdit: (post: Post) => boolean;
  canDelete: (post: Post) => boolean;
  className?: string;
}

export function PostList({
  posts,
  loading,
  onOpenModal,
  onToggleLike,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  className,
}: PostListProps) {
  if (loading && posts.length === 0) {
    return (
      <div
        className={`flex justify-center items-center h-40 ${className || ""}`}
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div
        className={`flex justify-center items-center h-40 text-muted-foreground text-lg ${className || ""}`}
      >
        게시글이 없습니다
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          onOpenModal={() => onOpenModal(post)}
          onToggleLike={() => onToggleLike(post.id, post.is_liked)}
          onEdit={onEdit}
          onDelete={onDelete}
          canEdit={canEdit(post)}
          canDelete={canDelete(post)}
        />
      ))}
    </div>
  );
}
