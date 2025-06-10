import { useState, useCallback } from "react";
import type { ExtendedComment } from "../types/index";
import {
  createCommentAction,
  updateCommentAction,
  deleteCommentAction,
  toggleCommentLikeAction,
  getCommentsAction,
} from "../actions/comments";

interface UseCommentsReturn {
  comments: ExtendedComment[];
  isLoading: boolean;
  createComment: (content: string, parentId?: number) => Promise<void>;
  updateComment: (commentId: number, content: string) => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;
  toggleLike: (commentId: number) => Promise<void>;
  refreshComments: () => Promise<void>;
  error: string | null;
}

/**
 * 댓글 관련 상태와 액션을 관리하는 훅
 */
export function useComments(postId: number): UseCommentsReturn {
  const [comments, setComments] = useState<ExtendedComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 댓글 목록 새로고침
   */
  const refreshComments = useCallback(async () => {
    if (!postId) return;

    setIsLoading(true);
    setError(null);

    try {
      const commentsData = await getCommentsAction(postId);
      setComments(commentsData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "댓글을 불러오는데 실패했습니다.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  /**
   * 댓글 생성
   */
  const createComment = useCallback(
    async (content: string, parentId?: number) => {
      setError(null);

      try {
        await createCommentAction(postId, content, parentId);

        // 낙관적 업데이트 대신 전체 새로고침
        // TODO: 향후 성능 최적화를 위해 낙관적 업데이트 적용 고려
        await refreshComments();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "댓글 작성에 실패했습니다.";
        setError(errorMessage);
        throw err; // 컴포넌트에서 토스트 처리를 위해 에러 재발생
      }
    },
    [postId, refreshComments],
  );

  /**
   * 댓글 수정
   */
  const updateComment = useCallback(
    async (commentId: number, content: string) => {
      setError(null);

      try {
        // 낙관적 업데이트
        setComments((prevComments) =>
          updateCommentsOptimistically(prevComments, commentId, {
            content,
          }),
        );

        await updateCommentAction(commentId, content);

        // 성공 시 최신 데이터로 갱신
        await refreshComments();
      } catch (err) {
        // 실패 시 다시 새로고침하여 원복
        await refreshComments();

        const errorMessage =
          err instanceof Error ? err.message : "댓글 수정에 실패했습니다.";
        setError(errorMessage);
        throw err;
      }
    },
    [refreshComments],
  );

  /**
   * 댓글 삭제
   */
  const deleteComment = useCallback(
    async (commentId: number) => {
      setError(null);

      try {
        // 낙관적 업데이트 - 댓글 숨기기
        setComments((prevComments) =>
          removeCommentOptimistically(prevComments, commentId),
        );

        await deleteCommentAction(commentId);

        // 성공 시 최신 데이터로 갱신
        await refreshComments();
      } catch (err) {
        // 실패 시 다시 새로고침하여 원복
        await refreshComments();

        const errorMessage =
          err instanceof Error ? err.message : "댓글 삭제에 실패했습니다.";
        setError(errorMessage);
        throw err;
      }
    },
    [refreshComments],
  );

  /**
   * 댓글 좋아요 토글
   */
  const toggleLike = useCallback(
    async (commentId: number) => {
      setError(null);

      try {
        // 새로운 토글 로직을 사용한 낙관적 업데이트
        setComments((prevComments) =>
          updateCommentsOptimistically(prevComments, commentId, (comment) => ({
            isLiked: !comment.isLiked,
            likes: comment.isLiked
              ? (comment.likes || 1) - 1
              : (comment.likes || 0) + 1,
          })),
        );

        await toggleCommentLikeAction(commentId);
      } catch (err) {
        console.error(err);
        // 실패 시 다시 새로고침하여 원복
        await refreshComments();

        const errorMessage =
          err instanceof Error ? err.message : "좋아요 처리에 실패했습니다.";
        setError(errorMessage);
        throw err;
      }
    },
    [refreshComments],
  );

  return {
    comments,
    isLoading,
    createComment,
    updateComment,
    deleteComment,
    toggleLike,
    refreshComments,
    error,
  };
}

/**
 * 댓글 목록에서 특정 댓글을 낙관적으로 업데이트하는 헬퍼 함수
 */
function updateCommentsOptimistically(
  comments: ExtendedComment[],
  commentId: number,
  getUpdates:
    | Partial<ExtendedComment>
    | ((comment: ExtendedComment) => Partial<ExtendedComment>),
): ExtendedComment[] {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      const updates =
        typeof getUpdates === "function" ? getUpdates(comment) : getUpdates;
      const updatedComment = { ...comment };

      Object.entries(updates).forEach(([key, value]) => {
        (updatedComment as any)[key] = value;
      });

      return updatedComment;
    }

    // 대댓글도 확인
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentsOptimistically(
          comment.replies,
          commentId,
          getUpdates,
        ),
      };
    }

    return comment;
  });
}

/**
 * 댓글 목록에서 특정 댓글을 낙관적으로 제거하는 헬퍼 함수
 */
function removeCommentOptimistically(
  comments: ExtendedComment[],
  commentId: number,
): ExtendedComment[] {
  return comments.filter((comment) => {
    if (comment.id === commentId) {
      return false;
    }

    // 대댓글도 필터링
    if (comment.replies && comment.replies.length > 0) {
      comment.replies = removeCommentOptimistically(comment.replies, commentId);
    }

    return true;
  });
}
