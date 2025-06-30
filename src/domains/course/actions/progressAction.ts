"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { LectureProgress } from "../types";

// 특정 강의의 진도 정보 조회
export async function getLectureProgress(
  userId: string,
  lectureId: number,
): Promise<LectureProgress | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("lecture_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("lecture_id", lectureId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }

  return data;
}

// 강의 진도 업데이트 (동영상 재생 시간 저장)
export async function updateLectureProgress(
  lectureId: number,
  progressSecs: number,
  isCompleted: boolean = false,
) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  // upsert를 사용하여 없으면 생성, 있으면 업데이트
  const { data, error } = await supabase
    .from("lecture_progress")
    .upsert({
      user_id: user.id,
      lecture_id: lectureId,
      progress_secs: progressSecs,
      is_completed: isCompleted,
    })
    .select()
    .single();

  if (error) throw error;

  // 강의가 완료되면 Enrollment의 completed_lecture_count 업데이트
  if (isCompleted) {
    await updateEnrollmentProgress(user.id, lectureId);
  }

  return data;
}

// 강의 완료 처리
export async function completeLecture(lectureId: number) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  // 강의 정보 가져오기
  const { data: lecture } = await supabase
    .from("lecture")
    .select("duration_secs")
    .eq("id", lectureId)
    .single();

  if (!lecture) {
    throw new Error("강의를 찾을 수 없습니다.");
  }

  return updateLectureProgress(lectureId, lecture.duration_secs, true);
}

// 사용자의 코스별 전체 진도 조회
export async function getUserCourseProgress(userId: string, courseId: number) {
  const supabase = await createServerSupabaseClient();

  // 코스의 모든 강의 ID 가져오기
  const { data: lectures } = await supabase
    .from("lecture")
    .select("id")
    .eq("course_id", courseId);

  if (!lectures || lectures.length === 0) {
    return {
      totalLectures: 0,
      completedLectures: 0,
      progressPercentage: 0,
    };
  }

  const lectureIds = lectures.map((l) => l.id);

  // 사용자의 진도 정보 가져오기
  const { data: progress } = await supabase
    .from("lecture_progress")
    .select("lecture_id, is_completed")
    .eq("user_id", userId)
    .in("lecture_id", lectureIds);

  const completedCount = progress?.filter((p) => p.is_completed).length || 0;

  return {
    totalLectures: lectures.length,
    completedLectures: completedCount,
    progressPercentage: Math.round((completedCount / lectures.length) * 100),
  };
}

// Enrollment의 completed_lecture_count 업데이트 (내부 함수)
async function updateEnrollmentProgress(userId: string, lectureId: number) {
  const supabase = await createServerSupabaseClient();

  // 강의가 속한 코스 ID 찾기
  const { data: lecture } = await supabase
    .from("lecture")
    .select("course_id")
    .eq("id", lectureId)
    .single();

  if (!lecture) return;

  // 해당 코스의 완료된 강의 수 계산
  const { data: completedLectures } = await supabase
    .from("lecture_progress")
    .select("lecture_id")
    .eq("user_id", userId)
    .eq("is_completed", true)
    .in(
      "lecture_id",
      (
        await supabase
          .from("lecture")
          .select("id")
          .eq("course_id", lecture.course_id)
      ).data?.map((l) => l.id) || [],
    );

  const completedCount = completedLectures?.length || 0;

  // Enrollment 업데이트
  await supabase
    .from("enrollment")
    .update({
      completed_lecture_count: completedCount,
      last_viewed_lecture_id: lectureId,
    })
    .eq("user_id", userId)
    .eq("course_id", lecture.course_id);

  revalidatePath(`/classroom/${lecture.course_id}`);
}

// 모듈별 진도 조회
export async function getModuleProgress(userId: string, moduleId: number) {
  const supabase = await createServerSupabaseClient();

  // 모듈의 모든 강의 가져오기
  const { data: lectures } = await supabase
    .from("lecture")
    .select("id")
    .eq("module_id", moduleId);

  if (!lectures || lectures.length === 0) {
    return {
      totalLectures: 0,
      completedLectures: 0,
      progressPercentage: 0,
    };
  }

  const lectureIds = lectures.map((l) => l.id);

  // 진도 정보 가져오기
  const { data: progress } = await supabase
    .from("lecture_progress")
    .select("is_completed")
    .eq("user_id", userId)
    .in("lecture_id", lectureIds)
    .eq("is_completed", true);

  const completedCount = progress?.length || 0;

  return {
    totalLectures: lectures.length,
    completedLectures: completedCount,
    progressPercentage: Math.round((completedCount / lectures.length) * 100),
  };
}
