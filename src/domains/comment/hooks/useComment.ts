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
    onMutate: async ({ postId }) => {
      // 낙관적 업데이트 - comment_count 증가
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["post", postId] });

      const previousPosts = queryClient.getQueryData(["posts"]);
      const previousPost = queryClient.getQueryData(["post", postId]);

      // posts 목록 업데이트
      queryClient.setQueriesData({ queryKey: ["posts"] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          posts: old.posts?.map((post: any) =>
            post.id === postId
              ? { ...post, comment_count: (post.comment_count || 0) + 1 }
              : post,
          ),
        };
      });

      // 단일 post 업데이트
      queryClient.setQueryData(["post", postId], (old: any) => {
        if (!old) return old;
        return { ...old, comment_count: (old.comment_count || 0) + 1 };
      });

      return { previousPosts, previousPost };
    },
    onError: (err, variables, context) => {
      // 에러 시 롤백
      if (context?.previousPosts) {
        queryClient.setQueriesData(
          { queryKey: ["posts"] },
          context.previousPosts,
        );
      }
      if (context?.previousPost) {
        queryClient.setQueryData(
          ["post", variables.postId],
          context.previousPost,
        );
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      // posts 쿼리도 무효화하여 comment_count 업데이트
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.postId] });
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
export const useRemoveComment = (postId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: number) => {
      return deleteComment(commentId);
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["post", postId] });

      const previousComments = queryClient.getQueriesData({
        queryKey: ["comments"],
      });
      const previousPosts = queryClient.getQueryData(["posts"]);
      const previousPost = queryClient.getQueryData(["post", postId]);

      queryClient.setQueriesData<any>({ queryKey: ["comments"] }, (oldData) => {
        if (!oldData) return oldData;
        return deleteCommentOptimistically(oldData, commentId);
      });

      // comment_count 감소
      queryClient.setQueriesData({ queryKey: ["posts"] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          posts: old.posts?.map((post: any) =>
            post.id === postId
              ? {
                  ...post,
                  comment_count: Math.max(0, (post.comment_count || 0) - 1),
                }
              : post,
          ),
        };
      });

      queryClient.setQueryData(["post", postId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          comment_count: Math.max(0, (old.comment_count || 0) - 1),
        };
      });

      return { previousComments, previousPosts, previousPost };
    },
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        context.previousComments.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousPosts) {
        queryClient.setQueriesData(
          { queryKey: ["posts"] },
          context.previousPosts,
        );
      }
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
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
