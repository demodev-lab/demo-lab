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

export const usePost = () => {
  const queryClient = useQueryClient();

  const list = (
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
        // TODO: getPostList에 필터 파라미터 전달
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

  const get = (postId: number) => {
    return useQuery({
      queryKey: ["post", postId],
      queryFn: () => getPost(postId),
      staleTime: 1000 * 60 * 5, // 5분
    });
  };

  const create = () => {
    return useMutation({
      mutationFn: (data: PostFormData) => createPost(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    });
  };

  const update = () => {
    return useMutation({
      mutationFn: ({ postId, data }: { postId: number; data: PostFormData }) =>
        updatePost(postId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        queryClient.invalidateQueries({ queryKey: ["post"] });
      },
    });
  };

  const remove = () => {
    return useMutation({
      mutationFn: (postId: number) => removePost(postId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    });
  };

  const toggleLike = () => {
    return useMutation({
      mutationFn: (postId: number) => postToggleLike(postId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        queryClient.invalidateQueries({ queryKey: ["post"] });
      },
    });
  };

  // Categories 조회 훅
  const categories = () => {
    return useQuery({
      queryKey: ["categories"],
      queryFn: () => getCategoryList(),
      staleTime: 1000 * 60 * 10, // 10분간 fresh 상태 유지 (카테고리는 자주 변경되지 않음)
    });
  };

  // Tags 조회 훅
  const tags = () => {
    return useQuery({
      queryKey: ["tags"],
      queryFn: () => getTagList(),
      staleTime: 1000 * 60 * 10, // 10분간 fresh 상태 유지
    });
  };

  return {
    list,
    get,
    create,
    update,
    remove,
    toggleLike,
    categories,
    tags,
  };
};
