import type { UserRole } from "@/types/auth";
import type { Database } from "@/types/database.types";

// 커뮤니티 카테고리 타입 (기존)
export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  postCount: number;
  min_role_required?: UserRole | null;
}

// 코스 카테고리 기본 타입
export type CourseCategory =
  Database["public"]["Tables"]["course_category"]["Row"];
export type CreateCourseCategoryInput =
  Database["public"]["Tables"]["course_category"]["Insert"];
export type UpdateCourseCategoryInput =
  Database["public"]["Tables"]["course_category"]["Update"];

// 계층 구조를 위한 확장 타입
export interface CategoryTreeNode extends CourseCategory {
  children: CategoryTreeNode[];
  level: number;
  parentPath: number[];
}

// 카테고리 경로 타입
export interface CategoryPath {
  id: number;
  name: string;
  slug: string;
}

// 카테고리 통계 타입
export interface CategoryStats {
  category_id: number;
  course_count: number;
  published_course_count: number;
  total_enrollments: number;
}

// 카테고리 목록 쿼리 옵션
export interface CategoryListOptions {
  include_inactive?: boolean;
  include_stats?: boolean;
  parent_id?: number | null;
  max_depth?: number;
}
