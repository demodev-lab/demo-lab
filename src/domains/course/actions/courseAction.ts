"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import {
  CreateCourseInput,
  UpdateCourseInput,
  CourseWithDetails,
} from "../types";
import { revalidatePath } from "next/cache";

export async function createCourse(input: CreateCourseInput) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("Course")
    .insert(input)
    .select()
    .single();

  if (error) throw error;

  // Course 생성 후 관련 경로들 revalidate
  revalidatePath("/admin");
  revalidatePath("/classroom");
  return data;
}

export async function getCourseList() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("Course")
    .select(
      `
      *,
      CourseInstructor (
        instructor:profiles (
          id,
          username,
          avatar_url
        )
      )
    `,
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// 모든 코스 목록 조회 (관리자용, 상태 무관)
export async function getAllCourses() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("Course")
    .select(
      `
      *,
      CourseInstructor (
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
    .from("Course")
    .select(
      `
      *,
      CourseInstructor (
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
    .from("Course")
    .select(
      `
      *,
      Module (
        id,
        title,
        sequence,
        Lecture (
          id,
          title,
          description,
          sequence,
          video_url,
          duration_secs,
          created_at,
          updated_at,
          LectureKeypoint (
            id,
            content
          ),
          LectureMaterial (
            id,
            title,
            file_url
          )
        )
      ),
      CourseInstructor (
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
      CourseLearningGoal (
        id,
        content
      ),
      BackgroundKnowledge (
        id,
        content
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  // Module 내 Lecture 정렬
  const sortedModules = data.Module.map((module: any) => ({
    ...module,
    lectures: module.Lecture.sort((a: any, b: any) => a.sequence - b.sequence),
  })).sort((a: any, b: any) => a.sequence - b.sequence);

  return {
    ...data,
    modules: sortedModules,
    instructors: data.CourseInstructor,
    learning_goals: data.CourseLearningGoal,
    background_knowledge: data.BackgroundKnowledge,
  };
}

export async function updateCourse(
  id: string | number,
  input: UpdateCourseInput,
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("Course")
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
export async function applyCourse(input: CreateCourseInput) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("Course")
    .insert({
      ...input,
      status: "pending",
      applied_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/");
  return data;
}

// 코스 승인 (관리자가 승인)
export async function approveCourse(id: string | number) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("로그인이 필요합니다.");

  const { data, error } = await supabase
    .from("Course")
    .update({
      status: "active",
      approved_at: new Date().toISOString(),
      approved_by: user.id,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/classroom");
  return data;
}

// 코스 거절 (관리자가 거절)
export async function rejectCourse(id: string | number, reason: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("Course")
    .update({
      status: "closed",
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
    .from("Course")
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

  const { error } = await supabase.from("Course").delete().eq("id", id);

  if (error) throw error;

  // Course 삭제 후 관련 경로들 revalidate
  revalidatePath("/admin");
  revalidatePath("/classroom");
}

// Course 학습 목표 관리
export async function addCourseLearningGoal(courseId: number, content: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("CourseLearningGoal")
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
    .from("CourseLearningGoal")
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
    .from("BackgroundKnowledge")
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
    .from("BackgroundKnowledge")
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
    .from("CourseInstructor")
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
    .from("CourseInstructor")
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
      supabase.from("Course").select("id", { count: "exact" }),
      supabase.from("Module").select("id", { count: "exact" }),
      supabase.from("Lecture").select("id", { count: "exact" }),
      supabase.from("Enrollment").select("id", { count: "exact" }),
    ]);

  return {
    total_courses: coursesResult.count || 0,
    total_modules: modulesResult.count || 0,
    total_lectures: lecturesResult.count || 0,
    total_enrollments: enrollmentsResult.count || 0,
    average_completion_rate: 0, // TODO: 실제 완료율 계산 로직 추가
  };
}
