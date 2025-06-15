"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { postPermissions } from "../permissions";
import { PostItem } from "./PostItem";
import type { Post } from "../types";

interface PostListProps {
  posts: Post[];
  loading: boolean;
  onOpenModal: (postId: number) => void;
  onEdit: (postId: number) => void;
  onDelete: (postId: number) => void;
  className?: string;
}

export function PostList({
  posts,
  loading,
  onOpenModal,
  onEdit,
  onDelete,
  className,
}: PostListProps) {
  const { data: profile } = useUserProfile();

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
          postId={post.id}
          onOpenModal={onOpenModal}
          onEdit={onEdit}
          onDelete={onDelete}
          canEdit={postPermissions.canEdit(post, profile?.role, profile?.id)}
          canDelete={postPermissions.canDelete(
            post,
            profile?.role,
            profile?.id,
          )}
        />
      ))}
    </div>
  );
}
