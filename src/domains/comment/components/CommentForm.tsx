import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CommentFormProps {
  onSubmit: (content: string, parentId?: number) => Promise<void>;
  parentId?: number;
  isReply?: boolean;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export function CommentForm({
  onSubmit,
  parentId,
  isReply = false,
  onCancel,
  placeholder = "댓글을 작성해주세요...",
  autoFocus = false,
  className = "",
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;
    if (content.length > 1000) {
      alert("댓글은 1000자 이하로 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(content.trim(), parentId);
      setContent(""); // 성공 시 폼 초기화

      // 대댓글 폼인 경우 자동으로 닫기
      if (isReply && onCancel) {
        onCancel();
      }
    } catch (error) {
      // 에러는 상위 컴포넌트에서 토스트로 처리
      console.error("댓글 작성 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className={`${className}`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {!isReply && (
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?text=U" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                className="min-h-[80px] resize-none"
                autoFocus={autoFocus}
                disabled={isSubmitting}
                maxLength={1000}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {content.length}/1000
                </span>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#5046E4] hover:bg-[#5046E4]/90"
                  disabled={!content.trim() || isSubmitting}
                >
                  {isSubmitting ? "작성 중..." : "댓글 작성"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {isReply && (
          <div className="ml-6">
            <div className="flex flex-col gap-2">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                className="min-h-[60px] resize-none"
                autoFocus={autoFocus}
                disabled={isSubmitting}
                maxLength={1000}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {content.length}/1000
                </span>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-[#5046E4] hover:bg-[#5046E4]/90"
                    disabled={!content.trim() || isSubmitting}
                  >
                    {isSubmitting ? "작성 중..." : "답글 작성"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    취소
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
