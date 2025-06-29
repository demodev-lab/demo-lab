"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { Enrollment } from "../types";

// 사용자의 수강 신청 정보 조회
export async function getEnrollmentByUserAndCourse(
  userId: string,
  courseId: number,
): Promise<Enrollment | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("enrollment")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (error) {
    // 데이터가 없는 경우는 정상적인 상황
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }

  return data;
}

// 코스 수강 신청
export async function enrollCourse(courseId: number) {
  const supabase = await createServerSupabaseClient();

  // 현재 사용자 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  // 이미 수강 중인지 확인
  const existing = await getEnrollmentByUserAndCourse(user.id, courseId);
  if (existing) {
    throw new Error("이미 수강 중인 코스입니다.");
  }

  // 수강 신청
  const { data, error } = await supabase
    .from("enrollment")
    .insert({
      user_id: user.id,
      course_id: courseId,
      status: "수강중",
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath(`/classroom/${courseId}`);
  return data;
}

// 수강 상태 업데이트
export async function updateEnrollmentStatus(
  enrollmentId: number,
  status: "수강전" | "수강중" | "완강",
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("enrollment")
    .update({ status })
    .eq("id", enrollmentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 사용자의 모든 수강 코스 조회
export async function getUserEnrollments(userId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("enrollment")
    .select(
      `
      *,
      course (
        id,
        title,
        subtitle,
        thumbnail_url,
        difficulty,
        total_lecture_count,
        total_duration_secs
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// 코스별 수강생 수 조회
export async function getCourseEnrollmentCount(courseId: number) {
  const supabase = await createServerSupabaseClient();

  const { count, error } = await supabase
    .from("enrollment")
    .select("id", { count: "exact", head: true })
    .eq("course_id", courseId);

  if (error) throw error;
  return count || 0;
}
