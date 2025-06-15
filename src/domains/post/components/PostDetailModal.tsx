import React from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { postPermissions } from "../permissions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageSquare, User } from "lucide-react";
import { CommentList } from "../../comment/components/CommentList";
import { usePost } from "../hooks/usePost";

interface PostDetailModalProps {
  isOpen: boolean;
  postId: number;
  onClose: () => void;
  onEdit: (postId: number) => void;
  onDelete: (postId: number) => void;
}

export function PostDetailModal({
  isOpen,
  postId,
  onClose,
  onEdit,
  onDelete,
}: PostDetailModalProps) {
  const { data: profile } = useUserProfile();
  const { get, toggleLike } = usePost();
  const toggleLikeMutation = toggleLike();
  const { data: post, isLoading } = get(postId);

  if (isLoading || !post) return null;

  const canEdit = postPermissions.canEdit(post, profile?.role, profile?.id);
  const canDelete = postPermissions.canDelete(post, profile?.role, profile?.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogTitle>게시글 상세</DialogTitle>
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
                {(canEdit || canDelete) && (
                  <div className="flex gap-2">
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-blue-600"
                        onClick={() => onEdit(postId)}
                      >
                        수정
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-red-500"
                        onClick={() => onDelete(postId)}
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
            onClick={() => toggleLikeMutation.mutate(postId)}
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

        <div className="max-h-[40vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            댓글 {post.comment_count}개
          </h3>
          <CommentList postId={post.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
