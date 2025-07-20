import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCourseCategoryList,
  getCourseCategoryById,
  getCourseCategoryStats,
  getCourseCategoryTree,
  getCourseCategoryDetailedStats,
  createCourseCategory,
  updateCourseCategory,
  deleteCourseCategory,
  reorderCourseCategories,
  toggleCourseCategoryStatus,
} from "../actions/courseCategoryAction";
import type {
  CourseCategory,
  CategoryListOptions,
  UpdateCourseCategoryInput,
} from "../types";

// Query Keys
const COURSE_CATEGORY_KEYS = {
  all: ["courseCategories"] as const,
  lists: () => [...COURSE_CATEGORY_KEYS.all, "list"] as const,
  list: (options?: CategoryListOptions) =>
    [...COURSE_CATEGORY_KEYS.lists(), options] as const,
  details: () => [...COURSE_CATEGORY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...COURSE_CATEGORY_KEYS.details(), id] as const,
  stats: () => [...COURSE_CATEGORY_KEYS.all, "stats"] as const,
  detailedStats: (categoryId?: number) =>
    [...COURSE_CATEGORY_KEYS.stats(), "detailed", categoryId] as const,
  tree: (rootId?: number | null) =>
    [...COURSE_CATEGORY_KEYS.all, "tree", rootId] as const,
};

// 코스 카테고리 목록 조회 훅
export function useCourseCategories(options?: CategoryListOptions) {
  return useQuery({
    queryKey: COURSE_CATEGORY_KEYS.list(options),
    queryFn: () => getCourseCategoryList(options),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
}

// 코스 카테고리 상세 조회 훅
export function useCourseCategoryById(id: number, enabled = true) {
  return useQuery({
    queryKey: COURSE_CATEGORY_KEYS.detail(id),
    queryFn: () => getCourseCategoryById(id),
    enabled: enabled && id > 0,
    staleTime: 1000 * 60 * 5,
  });
}

// 코스 카테고리 통계 조회 훅
export function useCourseCategoryStats() {
  return useQuery({
    queryKey: COURSE_CATEGORY_KEYS.stats(),
    queryFn: getCourseCategoryStats,
    staleTime: 1000 * 60 * 3, // 3분 (통계는 더 자주 갱신)
  });
}

// 코스 카테고리 트리 구조 조회 훅
export function useCourseCategoryTree(rootId?: number | null) {
  return useQuery({
    queryKey: COURSE_CATEGORY_KEYS.tree(rootId),
    queryFn: () => getCourseCategoryTree(rootId),
    staleTime: 1000 * 60 * 5,
  });
}

// 코스 카테고리 상세 통계 조회 훅
export function useCourseCategoryDetailedStats(categoryId?: number) {
  return useQuery({
    queryKey: COURSE_CATEGORY_KEYS.detailedStats(categoryId),
    queryFn: () => getCourseCategoryDetailedStats(categoryId),
    staleTime: 1000 * 60 * 3,
  });
}

// 코스 카테고리 생성 훅
export function useCreateCourseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourseCategory,
    onSuccess: (newCategory) => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: COURSE_CATEGORY_KEYS.lists(),
      });

      // 트리 구조 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: COURSE_CATEGORY_KEYS.all,
        predicate: (query) =>
          query.queryKey.length > 2 && query.queryKey[1] === "tree",
      });

      // 새로운 카테고리를 캐시에 추가
      queryClient.setQueryData(
        COURSE_CATEGORY_KEYS.detail(newCategory.id),
        newCategory,
      );
    },
  });
}

// 코스 카테고리 수정 훅
export function useUpdateCourseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateCourseCategoryInput;
    }) => updateCourseCategory(id, data),
    onSuccess: (updatedCategory, { id }) => {
      // 상세 캐시 업데이트
      queryClient.setQueryData(
        COURSE_CATEGORY_KEYS.detail(id),
        updatedCategory,
      );

      // 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: COURSE_CATEGORY_KEYS.lists(),
      });

      // 트리 구조 캐시 무효화 (부모가 변경될 수 있으므로)
      queryClient.invalidateQueries({
        queryKey: COURSE_CATEGORY_KEYS.all,
        predicate: (query) =>
          query.queryKey.length > 2 && query.queryKey[1] === "tree",
      });
    },
  });
}

// 코스 카테고리 삭제 훅
export function useDeleteCourseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourseCategory,
    onSuccess: (_, deletedId) => {
      // 상세 캐시 제거
      queryClient.removeQueries({
        queryKey: COURSE_CATEGORY_KEYS.detail(deletedId),
      });

      // 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: COURSE_CATEGORY_KEYS.lists(),
      });

      // 트리 구조 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: COURSE_CATEGORY_KEYS.all,
        predicate: (query) =>
          query.queryKey.length > 2 && query.queryKey[1] === "tree",
      });

      // 통계 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: COURSE_CATEGORY_KEYS.stats(),
      });
    },
  });
}

// 카테고리 순서 변경 훅
export function useReorderCourseCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderCourseCategories,
    onSuccess: () => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: COURSE_CATEGORY_KEYS.lists(),
      });

      // 트리 구조 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: COURSE_CATEGORY_KEYS.all,
        predicate: (query) =>
          query.queryKey.length > 2 && query.queryKey[1] === "tree",
      });
    },
  });
}

// 카테고리 상태 토글 훅
export function useToggleCourseCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      toggleCourseCategoryStatus(id, isActive),
    onMutate: async ({ id, isActive }) => {
      // 낙관적 업데이트를 위해 이전 데이터 백업
      await queryClient.cancelQueries({
        queryKey: COURSE_CATEGORY_KEYS.detail(id),
      });

      const previousCategory = queryClient.getQueryData<CourseCategory>(
        COURSE_CATEGORY_KEYS.detail(id),
      );

      if (previousCategory) {
        queryClient.setQueryData(COURSE_CATEGORY_KEYS.detail(id), {
          ...previousCategory,
          is_active: isActive,
        });
      }

      return { previousCategory };
    },
    onError: (err, { id }, context) => {
      // 오류 발생 시 이전 데이터로 롤백
      if (context?.previousCategory) {
        queryClient.setQueryData(
          COURSE_CATEGORY_KEYS.detail(id),
          context.previousCategory,
        );
      }
    },
    onSettled: () => {
      // 성공/실패 여부와 관계없이 캐시 갱신
      queryClient.invalidateQueries({
        queryKey: COURSE_CATEGORY_KEYS.lists(),
      });
    },
  });
}

// 활성 카테고리만 조회하는 편의 훅
export function useActiveCoursCategories() {
  return useCourseCategories({ include_inactive: false });
}

// 특정 부모의 하위 카테고리만 조회하는 편의 훅
export function useChildCourseCategories(parentId: number | null) {
  return useCourseCategories({ parent_id: parentId });
}
