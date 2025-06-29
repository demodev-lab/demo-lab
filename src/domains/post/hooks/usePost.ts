"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPostList,
  getPost,
  createPost,
  updatePost,
  removePost,
  postToggleLike,
} from "@/domains/post/actions/postAction";
import { getCategoryList } from "@/domains/category/actions/categoryAction";
import { getTagList } from "@/domains/tag/actions/tagAction";
import type { Post, PostFormData, SortOption } from "../types";

/**
 * 게시글 목록 조회 훅
 */
export const usePostList = (
  page = 1,
  limit = 10,
  options?: {
    categoryId?: number;
    tagIds?: number[];
    sortOption?: SortOption;
    searchQuery?: string;
  },
) => {
  return useQuery({
    queryKey: [
      "posts",
      page,
      limit,
      options?.categoryId,
      options?.tagIds,
      options?.sortOption,
      options?.searchQuery,
    ],
    queryFn: async () => {
      const result = await getPostList(
        page,
        limit,
        options?.categoryId,
        options?.tagIds,
        options?.sortOption,
        options?.searchQuery,
      );
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
  });
};

/**
 * 게시글 상세 조회 훅
 */
export const usePostDetail = (
  postId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery<Post>({
    queryKey: ["post", postId],
    queryFn: () => getPost(postId),
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled !== false && !!postId,
  });
};

/**
 * 게시글 생성 훅
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostFormData) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

/**
 * 게시글 수정 훅
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, data }: { postId: number; data: PostFormData }) =>
      updatePost(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });
};

/**
 * 게시글 삭제 훅
 */
export const useRemovePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: number) => removePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

/**
 * 게시글 좋아요 토글 훅
 */
export const useTogglePostLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: number) => postToggleLike(postId),
    onMutate: async (postId: number) => {
      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["post", postId] });

      // 이전 데이터 스냅샷
      const previousPosts = queryClient.getQueryData(["posts"]);
      const previousPost = queryClient.getQueryData(["post", postId]);

      // 낙관적 업데이트 - posts 목록
      queryClient.setQueriesData({ queryKey: ["posts"] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          posts: old.posts?.map((post: Post) =>
            post.id === postId
              ? {
                  ...post,
                  is_liked: !post.is_liked,
                  like_count: post.is_liked
                    ? post.like_count - 1
                    : post.like_count + 1,
                }
              : post,
          ),
        };
      });

      // 낙관적 업데이트 - 단일 post
      queryClient.setQueryData(["post", postId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          is_liked: !old.is_liked,
          like_count: old.is_liked ? old.like_count - 1 : old.like_count + 1,
        };
      });

      // 롤백을 위한 이전 데이터 반환
      return { previousPosts, previousPost };
    },
    onSuccess: (data, postId) => {
      // 서버에서 반환된 실제 데이터로 캐시 업데이트
      queryClient.setQueriesData({ queryKey: ["posts"] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          posts: old.posts?.map((post: Post) =>
            post.id === postId
              ? {
                  ...post,
                  is_liked: data.is_liked,
                  like_count: data.like_count,
                }
              : post,
          ),
        };
      });

      // 단일 post 업데이트
      queryClient.setQueryData(["post", postId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          is_liked: data.is_liked,
          like_count: data.like_count,
        };
      });
    },
    onError: (err, postId, context) => {
      // 에러 시 이전 데이터로 롤백
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
  });
};

/**
 * Categories 조회 훅
 */
export const useCategories = () => {
  return useQuery<any[]>({
    // useQuery를 직접 호출
    queryKey: ["categories"],
    queryFn: () => getCategoryList(),
    staleTime: 1000 * 60 * 10, // 10분간 fresh 상태 유지 (카테고리는 자주 변경되지 않음)
  });
};

/**
 * Tags 조회 훅
 */
export const useTags = () => {
  return useQuery<any[]>({
    // useQuery를 직접 호출
    queryKey: ["tags"],
    queryFn: () => getTagList(),
    staleTime: 1000 * 60 * 10, // 10분간 fresh 상태 유지
  });
};
