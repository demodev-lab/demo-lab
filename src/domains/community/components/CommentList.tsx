import React, { useState, useEffect } from "react";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import { useComments } from "../hooks/useComments";
import { useCommunityPermissions } from "../hooks/useCommunityPermissions";
import type { ExtendedComment } from "../types/index";
import { toast } from "sonner";

interface CommentListProps {
  postId: number;
  className?: string;
}

export function CommentList({ postId, className = "" }: CommentListProps) {
  const {
    comments,
    isLoading,
    createComment,
    updateComment,
    deleteComment,
    toggleLike,
    refreshComments,
    error,
  } = useComments(postId);

  const { userRole, authUser } = useCommunityPermissions();

  // 댓글 수정 상태
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  // 대댓글 작성 상태
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);

  // 초기 댓글 로드
  useEffect(() => {
    refreshComments();
  }, [refreshComments]);

  // 에러 토스트 처리
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  /**
   * 댓글 작성 처리
   */
  const handleCreateComment = async (content: string, parentId?: number) => {
    try {
      await createComment(content, parentId);
      toast.success(
        parentId ? "답글이 작성되었습니다." : "댓글이 작성되었습니다.",
      );
    } catch (error) {
      // 에러는 훅에서 반환되어 useEffect에서 토스트로 처리됨
    }
  };

  /**
   * 댓글 수정 시작
   */
  const handleEditClick = (comment: ExtendedComment) => {
    setEditCommentId(comment.id);
    setEditCommentText(comment.content);
  };

  /**
   * 댓글 수정 저장
   */
  const handleEditSave = async () => {
    if (editCommentId === null) return;

    try {
      await updateComment(editCommentId, editCommentText);
      setEditCommentId(null);
      setEditCommentText("");
      toast.success("댓글이 수정되었습니다.");
    } catch (error) {
      // 에러는 훅에서 반환되어 useEffect에서 토스트로 처리됨
    }
  };

  /**
   * 댓글 수정 취소
   */
  const handleEditCancel = () => {
    setEditCommentId(null);
    setEditCommentText("");
  };

  /**
   * 댓글 삭제 처리
   */
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await deleteComment(commentId);
      toast.success("댓글이 삭제되었습니다.");
    } catch (error) {
      // 에러는 훅에서 반환되어 useEffect에서 토스트로 처리됨
    }
  };

  /**
   * 댓글 좋아요 토글
   */
  const handleToggleLike = async (commentId: number) => {
    try {
      await toggleLike(commentId);
    } catch (error) {
      // 에러는 훅에서 반환되어 useEffect에서 토스트로 처리됨
    }
  };

  /**
   * 답글 작성 시작
   */
  const handleReplyClick = (commentId: number) => {
    setReplyToCommentId(commentId);
  };

  /**
   * 답글 작성 취소
   */
  const handleReplyCancel = () => {
    setReplyToCommentId(null);
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 댓글 작성 폼 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">댓글 {comments.length}개</h3>
        <CommentForm
          onSubmit={handleCreateComment}
          placeholder="댓글을 작성해주세요..."
        />
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            첫 번째 댓글을 작성해보세요!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                userRole={userRole}
                authUserId={authUser?.id}
                editCommentId={editCommentId}
                editCommentText={editCommentText}
                onEditClick={handleEditClick}
                onEditSave={handleEditSave}
                onEditCancel={handleEditCancel}
                onEditTextChange={setEditCommentText}
                onDeleteComment={handleDeleteComment}
                onToggleLike={handleToggleLike}
                onReplyClick={handleReplyClick}
              />

              {/* 답글 작성 폼 */}
              {replyToCommentId === comment.id && (
                <div className="mt-2">
                  <CommentForm
                    onSubmit={handleCreateComment}
                    parentId={comment.id}
                    isReply={true}
                    onCancel={handleReplyCancel}
                    placeholder="답글을 작성해주세요..."
                    autoFocus={true}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
