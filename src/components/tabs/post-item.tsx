import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/utils/lib/communityService";

interface PostItemProps {
  post: Post;
  onOpenModal: (post: Post) => void;
  onToggleLike: (postId: number) => void;
  categoryColors: Record<string, string>;
}

export function PostItem({
  post,
  onOpenModal,
  onToggleLike,
  categoryColors,
}: PostItemProps) {
  return (
    <Card
      className={`${post.pinned ? "border-[#5046E4]" : ""} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={() => onOpenModal(post)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`/placeholder.svg?text=${post.author.charAt(0)}`}
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{post.author}</div>
              <div className="text-xs text-muted-foreground">
                {post.date} •
                <Badge
                  style={{
                    backgroundColor: categoryColors[post.category] || "#888888",
                    marginLeft: "4px",
                  }}
                  className="text-white text-xs"
                >
                  {post.category}
                </Badge>
                {post.pinned && " • 📌 고정됨"}
              </div>
            </div>
          </div>
        </div>
        <h3 className="text-xl font-bold mt-2">{post.title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{post.content}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
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
              onToggleLike(post.id);
            }}
          >
            <Heart
              className={`h-4 w-4 ${post.isLiked ? "text-red-500 fill-red-500" : ""}`}
            />
            <span>{post.likeCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
