import type { CourseCategory } from "../types";
import { getDescendantCategoryIds } from "./categoryTreeUtils";

/**
 * 카테고리가 하위 카테고리를 가지고 있는지 확인
 */
export function hasChildren(
  categories: CourseCategory[],
  categoryId: number,
): boolean {
  return categories.some((cat) => cat.parent_id === categoryId);
}

/**
 * 카테고리 삭제 가능 여부 확인
 */
export function canDeleteCategory(
  categories: CourseCategory[],
  categoryId: number,
  courseCounts?: Map<number, number>,
): {
  canDelete: boolean;
  reason?: string;
  affectedItems?: {
    childCategories: number;
    courses: number;
  };
} {
  const childCategoryIds = categories.filter(
    (cat) => cat.parent_id === categoryId,
  );
  const descendantIds = getDescendantCategoryIds(categories, categoryId);

  // 코스 개수 확인 (courseCounts가 제공된 경우)
  let totalCourses = 0;
  if (courseCounts) {
    totalCourses = courseCounts.get(categoryId) || 0;
    descendantIds.forEach((id) => {
      totalCourses += courseCounts.get(id) || 0;
    });
  }

  // 하위 카테고리가 있는 경우
  if (childCategoryIds.length > 0) {
    return {
      canDelete: false,
      reason: "하위 카테고리가 존재합니다",
      affectedItems: {
        childCategories: descendantIds.length,
        courses: totalCourses,
      },
    };
  }

  // 코스가 할당된 경우
  if (totalCourses > 0) {
    return {
      canDelete: false,
      reason: "이 카테고리에 할당된 코스가 있습니다",
      affectedItems: {
        childCategories: 0,
        courses: totalCourses,
      },
    };
  }

  return { canDelete: true };
}

/**
 * 카테고리 이름 유효성 검증
 */
export function validateCategoryName(
  name: string,
  existingCategories: CourseCategory[],
  parentId?: number | null,
  excludeId?: number,
): {
  isValid: boolean;
  error?: string;
} {
  // 빈 이름 체크
  if (!name.trim()) {
    return {
      isValid: false,
      error: "카테고리 이름을 입력해주세요",
    };
  }

  // 길이 체크
  if (name.length > 50) {
    return {
      isValid: false,
      error: "카테고리 이름은 50자 이하로 입력해주세요",
    };
  }

  // 같은 부모 하위에서 중복 이름 체크
  const siblings = existingCategories.filter(
    (cat) => cat.parent_id === parentId && cat.id !== excludeId,
  );

  if (siblings.some((cat) => cat.name.toLowerCase() === name.toLowerCase())) {
    return {
      isValid: false,
      error: "같은 레벨에 동일한 이름의 카테고리가 이미 존재합니다",
    };
  }

  return { isValid: true };
}

/**
 * 카테고리 슬러그 유효성 검증
 */
export function validateCategorySlug(
  slug: string,
  existingCategories: CourseCategory[],
  excludeId?: number,
): {
  isValid: boolean;
  error?: string;
} {
  // 빈 슬러그 체크
  if (!slug.trim()) {
    return {
      isValid: false,
      error: "카테고리 슬러그를 입력해주세요",
    };
  }

  // 슬러그 형식 체크 (영문, 숫자, 하이픈만 허용)
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugPattern.test(slug)) {
    return {
      isValid: false,
      error: "슬러그는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다",
    };
  }

  // 중복 슬러그 체크
  if (
    existingCategories.some((cat) => cat.slug === slug && cat.id !== excludeId)
  ) {
    return {
      isValid: false,
      error: "이미 사용 중인 슬러그입니다",
    };
  }

  return { isValid: true };
}

/**
 * 카테고리 이동 유효성 검증
 */
export function validateCategoryMove(
  categories: CourseCategory[],
  categoryId: number,
  newParentId: number | null,
  maxDepth = 5,
): {
  isValid: boolean;
  error?: string;
} {
  const category = categories.find((cat) => cat.id === categoryId);
  if (!category) {
    return {
      isValid: false,
      error: "카테고리를 찾을 수 없습니다",
    };
  }

  // 자기 자신으로 이동 방지
  if (categoryId === newParentId) {
    return {
      isValid: false,
      error: "자기 자신을 부모로 설정할 수 없습니다",
    };
  }

  // 순환 참조 방지
  if (newParentId !== null) {
    const descendantIds = getDescendantCategoryIds(categories, categoryId);
    if (descendantIds.includes(newParentId)) {
      return {
        isValid: false,
        error: "하위 카테고리를 부모로 설정할 수 없습니다",
      };
    }
  }

  // 최대 깊이 체크
  if (newParentId !== null) {
    let depth = 1;
    let currentId: number | null = newParentId;

    while (currentId !== null && depth < maxDepth) {
      const parent = categories.find((cat) => cat.id === currentId);
      if (!parent) break;
      currentId = parent.parent_id;
      depth++;
    }

    if (depth >= maxDepth) {
      return {
        isValid: false,
        error: `카테고리 깊이는 최대 ${maxDepth}단계까지만 허용됩니다`,
      };
    }
  }

  return { isValid: true };
}
