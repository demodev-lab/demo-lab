import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, User } from "lucide-react";

interface PostCreateButtonProps {
  onCreateClick: () => void;
  className?: string;
}

export function PostCreateButton({
  onCreateClick,
  className,
}: PostCreateButtonProps) {
  return (
    <Card className={`border shadow-none ${className || ""}`}>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage alt="User" />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground">
            커뮤니티에 질문하거나 정보를 공유해보세요!
          </span>
        </div>
        <Button
          className="bg-[#5046E4] hover:bg-[#5046E4]/90"
          onClick={onCreateClick}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          글쓰기
        </Button>
      </CardContent>
    </Card>
  );
}
