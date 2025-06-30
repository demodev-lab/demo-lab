"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import {
  CreateCourseInput,
  UpdateCourseInput,
  CourseWithDetails,
  CreateCourseApplicationInput,
} from "../types";
import { revalidatePath } from "next/cache";

export async function createCourse(input: CreateCourseInput) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("course")
      .insert(input)
      .select()
      .single();

    if (error) {
      console.error("Course creation error:", error);
      throw new Error(error.message || "코스 생성에 실패했습니다.");
    }

    // Course 생성 후 관련 경로들 revalidate
    revalidatePath("/admin");
    revalidatePath("/classroom");
    return data;
  } catch (error) {
    console.error("createCourse error:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("코스 생성 중 알 수 없는 오류가 발생했습니다.");
  }
}

export async function getCourseList() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("course")
    .select(
      `
      *,
      course_instructor (
        instructor:profiles (
          id,
          username,
          avatar_url
        )
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getCourseById(id: string | number) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("course")
    .select(
      `
      *,
      course_instructor (
        instructor:profiles (
          id,
          username,
          avatar_url
        )
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getCourseWithDetails(
  id: string | number,
): Promise<CourseWithDetails> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("course")
    .select(
      `
      *,
      module (
        id,
        title,
        sequence,
        lecture (
          id,
          title,
          description,
          sequence,
          video_url,
          duration_secs,
          created_at,
          updated_at,
          lecture_keypoint (
            id,
            content
          ),
          lecture_material (
            id,
            title,
            file_url
          )
        )
      ),
      course_instructor (
        id,
        role_title,
        intro_message,
        instructor:profiles (
          id,
          full_name,
          avatar_url,
          username
        )
      ),
      course_learning_goal (
        id,
        content
      ),
      background_knowledge (
        id,
        content
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  // Module 내 Lecture 정렬
  const sortedModules = data.module
    .map((module: any) => ({
      ...module,
      lectures: module.lecture.sort(
        (a: any, b: any) => a.sequence - b.sequence,
      ),
    }))
    .sort((a: any, b: any) => a.sequence - b.sequence);

  return {
    ...data,
    modules: sortedModules,
    instructors: data.course_instructor,
    learning_goals: data.course_learning_goal,
    background_knowledge: data.background_knowledge,
  };
}

export async function updateCourse(
  id: string | number,
  input: UpdateCourseInput,
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("course")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // Course 수정 후 관련 경로들 revalidate
  revalidatePath("/admin");
  revalidatePath("/classroom");
  revalidatePath(`/classroom/${id}`);
  return data;
}

// 코스 신청 (사용자가 신청)
export async function applyCourse(input: CreateCourseApplicationInput) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("course_application")
      .insert({
        ...input,
        status: "pending",
        applied_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Course application error:", error);
      throw new Error(error.message || "코스 신청에 실패했습니다.");
    }

    revalidatePath("/");
    return data;
  } catch (error) {
    console.error("applyCourse error:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("코스 신청 중 알 수 없는 오류가 발생했습니다.");
  }
}

// 코스 승인 (관리자가 승인)
export async function approveCourse(id: string | number) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("로그인이 필요합니다.");

  // 1. 신청 정보 가져오기
  const { data: application, error: appError } = await supabase
    .from("course_application")
    .select("*")
    .eq("id", id)
    .single();

  if (appError || !application)
    throw new Error("신청 정보를 찾을 수 없습니다.");

  // 2. Course 테이블에 새 코스 생성
  const { data: newCourse, error: courseError } = await supabase
    .from("course")
    .insert({
      title: application.title,
      subtitle: application.subtitle,
      description: application.description,
      thumbnail_url: application.thumbnail_url,
      difficulty: application.difficulty,
    })
    .select()
    .single();

  if (courseError) throw courseError;

  // 3. CourseApplication 상태 업데이트
  const { error: updateError } = await supabase
    .from("course_application")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: user.id,
      approved_course_id: newCourse.id,
    })
    .eq("id", id);

  if (updateError) throw updateError;

  revalidatePath("/admin");
  revalidatePath("/classroom");
  return newCourse;
}

// 코스 거절 (관리자가 거절)
export async function rejectCourse(id: string | number, reason: string) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("로그인이 필요합니다.");

  const { data, error } = await supabase
    .from("course_application")
    .update({
      status: "rejected",
      rejected_at: new Date().toISOString(),
      rejected_by: user.id,
      rejection_reason: reason,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/admin");
  return data;
}

// 대기 중인 코스 목록 조회
export async function getPendingCourses() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("course_application")
    .select(
      `
      *,
      applicant:applicant_id (
        id,
        full_name,
        username,
        avatar_url
      )
    `,
    )
    .eq("status", "pending")
    .order("applied_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteCourse(id: string | number) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("course").delete().eq("id", id);

  if (error) throw error;

  // Course 삭제 후 관련 경로들 revalidate
  revalidatePath("/admin");
  revalidatePath("/classroom");
}

// Course 학습 목표 관리
export async function addCourseLearningGoal(courseId: number, content: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("course_learning_goal")
    .insert({
      course_id: courseId,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  revalidatePath(`/classroom/${courseId}`);
  return data;
}

export async function deleteCourseLearningGoal(id: number) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("course_learning_goal")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Course 배경 지식 관리
export async function addBackgroundKnowledge(
  courseId: number,
  content: string,
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("background_knowledge")
    .insert({
      course_id: courseId,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  revalidatePath(`/classroom/${courseId}`);
  return data;
}

export async function deleteBackgroundKnowledge(id: number) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("background_knowledge")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Course 강사 관리
export async function addCourseInstructor(
  courseId: number,
  instructorId: string,
  roleTitle?: string,
  introMessage?: string,
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("course_instructor")
    .insert({
      course_id: courseId,
      instructor_id: instructorId,
      role_title: roleTitle,
      intro_message: introMessage,
    })
    .select()
    .single();

  if (error) throw error;
  revalidatePath(`/classroom/${courseId}`);
  return data;
}

export async function removeCourseInstructor(
  courseId: number,
  instructorId: string,
) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("course_instructor")
    .delete()
    .eq("course_id", courseId)
    .eq("instructor_id", instructorId);

  if (error) throw error;
  revalidatePath(`/classroom/${courseId}`);
}

// Course 통계 가져오기
export async function getCourseStats() {
  const supabase = await createServerSupabaseClient();

  const [coursesResult, modulesResult, lecturesResult, enrollmentsResult] =
    await Promise.all([
      supabase.from("course").select("id", { count: "exact" }),
      supabase.from("module").select("id", { count: "exact" }),
      supabase.from("lecture").select("id", { count: "exact" }),
      supabase.from("enrollment").select("id", { count: "exact" }),
    ]);

  return {
    total_courses: coursesResult.count || 0,
    total_modules: modulesResult.count || 0,
    total_lectures: lecturesResult.count || 0,
    total_enrollments: enrollmentsResult.count || 0,
    average_completion_rate: 0, // TODO: 실제 완료율 계산 로직 추가
  };
}
