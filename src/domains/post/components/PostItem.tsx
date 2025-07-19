import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageSquare,
  User,
  Edit,
  Trash2,
  MoreHorizontal,
  Paperclip,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useTogglePostLike } from "../hooks/usePost";
import { useAuth } from "@/components/auth/auth-provider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Post } from "../types";

interface PostItemProps {
  post: Post;
  onOpenModal: (postId: number) => void;
  onEdit?: (postId: number) => void;
  onDelete?: (postId: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function PostItem({
  post,
  onOpenModal,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false,
}: PostItemProps) {
  const toggleLikeMutation = useTogglePostLike();
  const { user } = useAuth();
  const router = useRouter();

  return (
    <Card
      className={`${post.is_pinned ? "border-[#5046E4]" : ""} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={() => onOpenModal(post.id)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`/placeholder.svg?text=${post.author_name.charAt(0)}`}
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{post.author_name}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                •
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
          {(canEdit || canDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEdit && onEdit && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(post.id);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    수정
                  </DropdownMenuItem>
                )}
                {canDelete && onDelete && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(post.id);
                    }}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    삭제
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <h3 className="text-xl font-bold mt-2">{post.title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{post.content}</p>
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
      </CardContent>
      <CardFooter>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={(e) => {
              e.stopPropagation();
              if (!user) {
                toast.error("로그인이 필요합니다", {
                  action: {
                    label: "로그인",
                    onClick: () => router.push("/login"),
                  },
                });
                return;
              }
              toggleLikeMutation.mutate(post.id);
            }}
            disabled={toggleLikeMutation.isPending}
          >
            <Heart
              className={`h-4 w-4 ${post.is_liked ? "text-red-500 fill-red-500" : ""}`}
            />
            <span>{post.like_count}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.comment_count}</span>
          </Button>
          {post.attachments && post.attachments.length > 0 && (
            <Button variant="ghost" size="sm" className="gap-1">
              <Paperclip className="h-4 w-4" />
              <span className="truncate max-w-48">
                {post.attachments[0].original_file_name}
                {post.attachments.length > 1 &&
                  ` (외 ${post.attachments.length - 1}개)`}
              </span>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
