"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  CourseCategory,
  CreateCourseCategoryInput,
  UpdateCourseCategoryInput,
  CategoryListOptions,
  CategoryStats,
} from "../types";
import {
  validateCategoryName,
  validateCategorySlug,
  validateCategoryMove,
} from "../utils";

// 중앙화된 revalidation 함수
function revalidateCourseCategoryPaths() {
  revalidatePath("/course");
  revalidatePath("/admin");
}

// 코스 카테고리 목록 조회
export async function getCourseCategoryList(
  options: CategoryListOptions = {},
): Promise<CourseCategory[]> {
  console.group("🔍 [Server Action] getCourseCategoryList");
  console.log("조회 옵션:", options);

  const supabase = await createServerSupabaseClient();

  let query = supabase.from("course_category").select("*").order("sequence");

  // 비활성 카테고리 제외
  if (!options.include_inactive) {
    query = query.eq("is_active", true);
  }

  // 특정 부모의 하위 카테고리만 조회
  if (options.parent_id !== undefined) {
    query = query.eq("parent_id", options.parent_id);
  }

  const { data, error } = await query;

  if (error) {
    console.error("카테고리 조회 실패:", error);
    console.groupEnd();
    throw error;
  }

  console.log(`${data?.length || 0}개 카테고리 조회 완료`);
  console.groupEnd();
  return data || [];
}

// 코스 카테고리 상세 조회
export async function getCourseCategoryById(
  id: number,
): Promise<CourseCategory | null> {
  console.group("🔍 [Server Action] getCourseCategoryById");
  console.log("카테고리 ID:", id);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("course_category")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("카테고리 조회 실패:", error);
    console.groupEnd();
    return null;
  }

  console.log("카테고리 조회 완료:", data.name);
  console.groupEnd();
  return data;
}

// 효율적인 카테고리 통계 조회 (DB 집계 함수 사용)
export async function getCourseCategoryStats(): Promise<CategoryStats[]> {
  console.group("📊 [Server Action] getCourseCategoryStats");

  const supabase = await createServerSupabaseClient();

  // RPC 함수를 사용하여 DB에서 집계 수행
  const { data, error } = await supabase.rpc("get_course_category_stats");

  if (error) {
    console.error("카테고리 통계 조회 실패:", error);
    console.groupEnd();

    // RPC 함수가 없는 경우 fallback으로 기본 쿼리 사용
    console.log("RPC 함수 미지원, 기본 쿼리로 fallback");
    return await getCourseCategoryStatsFallback();
  }

  console.log("카테고리 통계 조회 완료");
  console.groupEnd();
  return data || [];
}

// Fallback 통계 조회 함수
async function getCourseCategoryStatsFallback(): Promise<CategoryStats[]> {
  const supabase = await createServerSupabaseClient();

  // 기본 집계 쿼리로 성능 최적화
  const { data, error } = await supabase.from("course_category").select(`
      id,
      course_application!course_application_category_id_fkey(
        status,
        enrollment(count)
      )
    `);

  if (error) throw error;

  // 최소한의 애플리케이션 로직
  const stats: CategoryStats[] = (data || []).map((category: any) => {
    const courses = category.course_application || [];
    const publishedCourses = courses.filter(
      (course: any) => course.status === "published",
    );
    const totalEnrollments = publishedCourses.reduce(
      (sum: number, course: any) => sum + (course.enrollment?.length || 0),
      0,
    );

    return {
      category_id: category.id,
      course_count: courses.length,
      published_course_count: publishedCourses.length,
      total_enrollments: totalEnrollments,
    };
  });

  return stats;
}

// 카테고리 생성용 통합 데이터 조회
async function getCategoryDataForValidation() {
  const supabase = await createServerSupabaseClient();

  const [categoriesResult, statsResult] = await Promise.all([
    supabase.from("course_category").select("*"),
    getCourseCategoryStats(),
  ]);

  if (categoriesResult.error) throw categoriesResult.error;

  const courseCounts = new Map<number, number>();
  statsResult.forEach((stat) => {
    courseCounts.set(stat.category_id, stat.course_count);
  });

  return {
    categories: categoriesResult.data || [],
    courseCounts,
  };
}

// 코스 카테고리 생성
export async function createCourseCategory(
  input: CreateCourseCategoryInput,
): Promise<CourseCategory> {
  console.group("✨ [Server Action] createCourseCategory");
  console.log("생성할 카테고리:", input);

  // 필요한 모든 데이터를 한 번에 조회
  const { categories: existingCategories } =
    await getCategoryDataForValidation();

  // 유효성 검증
  const nameValidation = validateCategoryName(
    input.name,
    existingCategories,
    input.parent_id,
  );
  if (!nameValidation.isValid) {
    console.error("이름 유효성 검증 실패:", nameValidation.error);
    console.groupEnd();
    throw new Error(nameValidation.error);
  }

  const slugValidation = validateCategorySlug(input.slug, existingCategories);
  if (!slugValidation.isValid) {
    console.error("슬러그 유효성 검증 실패:", slugValidation.error);
    console.groupEnd();
    throw new Error(slugValidation.error);
  }

  if (input.parent_id) {
    const moveValidation = validateCategoryMove(
      existingCategories,
      -1, // 새 카테고리이므로 임시 ID
      input.parent_id,
    );
    if (!moveValidation.isValid) {
      console.error("부모 설정 검증 실패:", moveValidation.error);
      console.groupEnd();
      throw new Error(moveValidation.error);
    }
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("course_category")
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error("카테고리 생성 실패:", error);
    console.groupEnd();
    throw error;
  }

  console.log("카테고리 생성 완료:", data.name);
  console.groupEnd();

  revalidateCourseCategoryPaths();
  return data;
}

// 코스 카테고리 수정
export async function updateCourseCategory(
  id: number,
  input: UpdateCourseCategoryInput,
): Promise<CourseCategory> {
  console.group("📝 [Server Action] updateCourseCategory");
  console.log("수정할 카테고리 ID:", id);
  console.log("수정 내용:", input);

  // 유효성 검증이 필요한 경우에만 데이터 조회
  const needsValidation =
    input.name || input.slug || input.parent_id !== undefined;

  if (needsValidation) {
    const { categories: existingCategories } =
      await getCategoryDataForValidation();

    if (input.name) {
      const nameValidation = validateCategoryName(
        input.name,
        existingCategories,
        input.parent_id,
        id,
      );
      if (!nameValidation.isValid) {
        console.error("이름 유효성 검증 실패:", nameValidation.error);
        console.groupEnd();
        throw new Error(nameValidation.error);
      }
    }

    if (input.slug) {
      const slugValidation = validateCategorySlug(
        input.slug,
        existingCategories,
        id,
      );
      if (!slugValidation.isValid) {
        console.error("슬러그 유효성 검증 실패:", slugValidation.error);
        console.groupEnd();
        throw new Error(slugValidation.error);
      }
    }

    if (input.parent_id !== undefined) {
      const moveValidation = validateCategoryMove(
        existingCategories,
        id,
        input.parent_id,
      );
      if (!moveValidation.isValid) {
        console.error("부모 이동 검증 실패:", moveValidation.error);
        console.groupEnd();
        throw new Error(moveValidation.error);
      }
    }
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("course_category")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("카테고리 수정 실패:", error);
    console.groupEnd();
    throw error;
  }

  console.log("카테고리 수정 완료:", data.name);
  console.groupEnd();

  revalidateCourseCategoryPaths();
  return data;
}

// 코스 카테고리 삭제
export async function deleteCourseCategory(id: number): Promise<void> {
  console.group("🗑️ [Server Action] deleteCourseCategory");
  console.log("삭제할 카테고리 ID:", id);

  const supabase = await createServerSupabaseClient();

  // RPC 함수로 삭제 유효성 검증
  const { data: validation, error: validationError } = await supabase.rpc(
    "validate_course_category_deletion",
    { category_id_to_delete: id },
  );

  if (validationError) {
    console.error("삭제 검증 실패:", validationError);
    console.groupEnd();
    throw validationError;
  }

  if (!validation.can_delete) {
    const reason =
      validation.reason === "has_children"
        ? "하위 카테고리가 존재합니다"
        : "이 카테고리에 할당된 코스가 있습니다";

    console.error("삭제 불가:", reason);
    console.log("영향받는 항목:", {
      childCategories: validation.child_count,
      courses: validation.course_count,
    });
    console.groupEnd();
    throw new Error(reason);
  }

  // 삭제 실행
  const { error } = await supabase
    .from("course_category")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("카테고리 삭제 실패:", error);
    console.groupEnd();
    throw error;
  }

  console.log("카테고리 삭제 완료");
  console.groupEnd();

  revalidateCourseCategoryPaths();
}

// 카테고리 순서 변경 (배치 업데이트 최적화)
export async function reorderCourseCategories(
  updates: { id: number; sequence: number }[],
): Promise<void> {
  console.group("🔄 [Server Action] reorderCourseCategories");
  console.log("순서 변경할 카테고리:", updates);

  const supabase = await createServerSupabaseClient();

  // 트랜잭션으로 일관성 보장
  const { error } = await supabase.rpc("reorder_course_categories", {
    category_updates: updates,
  });

  if (error) {
    console.error("RPC 순서 변경 실패, 개별 업데이트로 fallback:", error);

    // RPC 함수가 없는 경우 개별 업데이트
    const updatePromises = updates.map(({ id, sequence }) =>
      supabase.from("course_category").update({ sequence }).eq("id", id),
    );

    const results = await Promise.all(updatePromises);
    const errors = results.filter((result) => result.error);

    if (errors.length > 0) {
      console.error("순서 변경 실패:", errors);
      console.groupEnd();
      throw new Error("카테고리 순서 변경에 실패했습니다");
    }
  }

  console.log("카테고리 순서 변경 완료");
  console.groupEnd();

  revalidateCourseCategoryPaths();
}

// 카테고리 활성화/비활성화 토글
export async function toggleCourseCategoryStatus(
  id: number,
  isActive: boolean,
): Promise<CourseCategory> {
  console.group("🔄 [Server Action] toggleCourseCategoryStatus");
  console.log("카테고리 ID:", id, "활성화:", isActive);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("course_category")
    .update({ is_active: isActive })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("카테고리 상태 변경 실패:", error);
    console.groupEnd();
    throw error;
  }

  console.log("카테고리 상태 변경 완료:", data.name);
  console.groupEnd();

  revalidateCourseCategoryPaths();
  return data;
}

// 카테고리 트리 구조 조회
export async function getCourseCategoryTree(rootId?: number | null) {
  console.group("🌲 [Server Action] getCourseCategoryTree");
  console.log("루트 ID:", rootId);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("get_course_category_tree", {
    root_id: rootId,
  });

  if (error) {
    console.error("카테고리 트리 조회 실패:", error);
    console.groupEnd();
    throw error;
  }

  console.log(`${data?.length || 0}개 카테고리 노드 조회 완료`);
  console.groupEnd();
  return data || [];
}

// 카테고리별 상세 통계 조회
export async function getCourseCategoryDetailedStats(categoryId?: number) {
  console.group("📊 [Server Action] getCourseCategoryDetailedStats");
  console.log("카테고리 ID:", categoryId);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc(
    "get_course_category_detailed_stats",
    {
      category_id_param: categoryId,
    },
  );

  if (error) {
    console.error("카테고리 상세 통계 조회 실패:", error);
    console.groupEnd();
    throw error;
  }

  console.log("카테고리 상세 통계 조회 완료");
  console.groupEnd();
  return data || [];
}
