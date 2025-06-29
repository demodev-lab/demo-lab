import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ExtendedComment } from "@/domains/comment/types";
import {
  createComment,
  deleteComment,
  getCommentList,
  toggleCommentLike,
  updateComment,
} from "../actions/commentAction";

/**
 * 댓글 목록 조회 훅
 */
export const useCommentList = (postId: number) => {
  return useQuery<ExtendedComment[]>({
    // useQuery를 직접 호출
    queryKey: ["comments", postId],
    queryFn: () => getCommentList(postId),
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
  });
};

/**
 * 댓글 생성 훅
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      content,
      parentId,
    }: {
      postId: number;
      content: string;
      parentId?: number;
    }) => {
      return createComment(postId, content, parentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};

/**
 * 댓글 수정 훅
 */
export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => {
      return updateComment(commentId, content);
    },
    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] });
      const previousData = queryClient.getQueriesData({
        queryKey: ["comments"],
      });

      queryClient.setQueriesData<any>({ queryKey: ["comments"] }, (oldData) => {
        if (!oldData) return oldData;
        return updateCommentsOptimistically(oldData, commentId, {
          content,
        });
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};

/**
 * 댓글 삭제 훅
 */
export const useRemoveComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: number) => {
      return deleteComment(commentId);
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] });
      const previousData = queryClient.getQueriesData({
        queryKey: ["comments"],
      });

      queryClient.setQueriesData<any>({ queryKey: ["comments"] }, (oldData) => {
        if (!oldData) return oldData;
        return deleteCommentOptimistically(oldData, commentId);
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};

/**
 * 댓글 좋아요 토글 훅
 */
export const useToggleCommentLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: number) => {
      return toggleCommentLike(commentId);
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] });
      const previousData = queryClient.getQueriesData({
        queryKey: ["comments"],
      });

      queryClient.setQueriesData<any>({ queryKey: ["comments"] }, (oldData) => {
        if (!oldData) return oldData;
        return updateCommentsOptimistically(oldData, commentId, (comment) => ({
          isLiked: !comment.isLiked,
          likes: comment.isLiked
            ? (comment.likes || 1) - 1
            : (comment.likes || 0) + 1,
        }));
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};

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
      return { ...comment, ...updates };
    }
    if (comment.replies?.length) {
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
function deleteCommentOptimistically(
  comments: ExtendedComment[],
  commentId: number,
): ExtendedComment[] {
  return comments.filter((comment) => {
    if (comment.id === commentId) return false;
    if (comment.replies?.length) {
      comment.replies = deleteCommentOptimistically(comment.replies, commentId);
    }
    return true;
  });
}
