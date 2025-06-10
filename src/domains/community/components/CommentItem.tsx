import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User, Heart } from "lucide-react";
import { canEditComment, canDeleteComment } from "../permissions";
import type { ExtendedComment } from "../types/index";
import type { Role } from "@/types/auth";

interface CommentItemProps {
  comment: ExtendedComment;
  userRole: Role | null;
  authUserId: string | null;
  editCommentId: number | null;
  editCommentText: string;
  onEditClick: (comment: ExtendedComment) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onEditTextChange: (text: string) => void;
  onDeleteComment: (commentId: number) => void;
  onToggleLike: (commentId: number) => void;
  onReplyClick?: (commentId: number) => void;
}

export function CommentItem({
  comment,
  userRole,
  authUserId,
  editCommentId,
  editCommentText,
  onEditClick,
  onEditSave,
  onEditCancel,
  onEditTextChange,
  onDeleteComment,
  onToggleLike,
  onReplyClick,
}: CommentItemProps) {
  const isSoftDeleted = comment.status === "soft_deleted";
  const canEdit = canEditComment(comment, userRole, authUserId);
  const canDelete = canDeleteComment(comment, userRole, authUserId);

  return (
    <div className={comment.depth && comment.depth >= 1 ? "pl-6" : ""}>
      <div className={`flex gap-2 mt-4 ${isSoftDeleted ? "opacity-60" : ""}`}>
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={`/placeholder.svg?text=${comment.author.charAt(0)}`}
          />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{comment.author}</span>
            <span className="text-xs text-muted-foreground">
              {comment.date}
            </span>
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => onEditClick(comment)}
              >
                수정
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-red-500"
                onClick={() => onDeleteComment(comment.id)}
              >
                삭제
              </Button>
            )}
          </div>
          {editCommentId === comment.id && !isSoftDeleted ? (
            <div className="flex flex-col gap-2 mt-2">
              <Textarea
                value={editCommentText}
                onChange={(e) => onEditTextChange(e.target.value)}
                className="flex-1 min-h-[60px]"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-[#5046E4] hover:bg-[#5046E4]/90"
                  onClick={onEditSave}
                  disabled={!editCommentText.trim()}
                >
                  저장
                </Button>
                <Button size="sm" variant="outline" onClick={onEditCancel}>
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p
                className={`text-sm mt-1 ${isSoftDeleted ? "text-gray-500 italic" : ""}`}
              >
                {comment.content}
              </p>
              {!isSoftDeleted && (
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => onToggleLike(comment.id)}
                  >
                    <Heart
                      className={`h-3 w-3 mr-1 ${comment.isLiked ? "text-red-500 fill-red-500" : "text-gray-400"}`}
                    />
                    <span>{comment.likes || 0}</span>
                  </Button>
                  {/* 대댓글 버튼 (최상위 댓글에만 표시) */}
                  {!comment.depth && onReplyClick && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => onReplyClick(comment.id)}
                    >
                      답글
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={{ ...reply, depth: 1 }}
                  userRole={userRole}
                  authUserId={authUserId}
                  editCommentId={editCommentId}
                  editCommentText={editCommentText}
                  onEditClick={onEditClick}
                  onEditSave={onEditSave}
                  onEditCancel={onEditCancel}
                  onEditTextChange={onEditTextChange}
                  onDeleteComment={onDeleteComment}
                  onToggleLike={onToggleLike}
                  onReplyClick={onReplyClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
