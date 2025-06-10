import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageSquare, Heart, User } from "lucide-react";
import type { Post } from "../types";
import { CommentList } from "./CommentList";

interface PostDetailModalProps {
  isOpen: boolean;
  post: Post | null;
  onClose: () => void;
  onToggleLike: (postId: number, isLiked: boolean) => void;
  onEdit: (post: Post) => void;
  onDelete: (postId: number) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export function PostDetailModal({
  isOpen,
  post,
  onClose,
  onToggleLike,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: PostDetailModalProps) {
  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div className="font-medium">{post.author_name}</div>
                {/* 수정/삭제 버튼 */}
                {(canEdit || canDelete) && (
                  <div className="flex gap-2">
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-blue-600"
                        onClick={() => onEdit(post)}
                      >
                        수정
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-red-500"
                        onClick={() => onDelete(post.id)}
                      >
                        삭제
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(post.created_at).toLocaleString()} •
                <Badge
                  style={{
                    backgroundColor: post.category_color || "#888888",
                    marginLeft: "4px",
                  }}
                  className="text-white text-xs"
                >
                  {post.category_name}
                </Badge>
                {post.is_pinned && " • 📌 고정됨"}
              </div>
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold">{post.title}</DialogTitle>
          <DialogDescription className="whitespace-pre-line mt-4">
            {post.content}
          </DialogDescription>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {post.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: tag.color,
                    color: tag.color,
                  }}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </DialogHeader>

        <div className="flex gap-4 my-4">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => onToggleLike(post.id, post.is_liked)}
          >
            <Heart
              className={`h-4 w-4 ${
                post.is_liked ? "text-red-500 fill-red-500" : ""
              }`}
            />
            <span>좋아요 {post.like_count}</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>댓글 {post.comment_count}</span>
          </Button>
        </div>

        <Separator className="my-4" />

        {/* 댓글 시스템 */}
        <div className="max-h-[40vh] overflow-y-auto">
          <CommentList postId={post.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
