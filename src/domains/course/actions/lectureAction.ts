"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { CreateLectureInput, UpdateLectureInput } from "../types";
import { revalidatePath } from "next/cache";

// Lecture CRUD 액션들
export async function createLecture(input: CreateLectureInput) {
  const supabase = await createServerSupabaseClient();

  // 동일한 module_id에서 최대 sequence 값 조회
  const { data: maxSeqData } = await supabase
    .from("Lecture")
    .select("sequence")
    .eq("module_id", input.module_id)
    .order("sequence", { ascending: false })
    .limit(1)
    .single();

  const newSequence = maxSeqData ? maxSeqData.sequence + 1 : 1;

  const { data, error } = await supabase
    .from("Lecture")
    .insert({
      ...input,
      sequence: input.sequence ?? newSequence,
    })
    .select()
    .single();

  if (error) throw error;

  // Course의 total_lecture_count와 total_duration_secs 업데이트
  await updateCourseStats(input.course_id);

  revalidatePath("/admin");
  revalidatePath(`/classroom/${input.course_id}`);
  return data;
}

export async function getLecturesByModuleId(moduleId: number) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("Lecture")
    .select(
      `
      *,
      LectureKeypoint (
        id,
        content
      ),
      LectureMaterial (
        id,
        title,
        file_url
      )
    `,
    )
    .eq("module_id", moduleId)
    .order("sequence", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getLectureById(id: number) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("Lecture")
    .select(
      `
      *,
      Module (
        id,
        title,
        course_id
      ),
      LectureKeypoint (
        id,
        content
      ),
      LectureMaterial (
        id,
        title,
        file_url
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateLecture(
  id: number,
  input: UpdateLectureInput & { course_id: number },
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("Lecture")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // Course의 total_duration_secs 업데이트
  await updateCourseStats(input.course_id);

  revalidatePath("/admin");
  revalidatePath(`/classroom/${input.course_id}`);
  return data;
}

export async function deleteLecture(id: number, courseId: number) {
  const supabase = await createServerSupabaseClient();

  // 강의 정보 먼저 가져오기
  const { data: lecture } = await supabase
    .from("Lecture")
    .select("module_id")
    .eq("id", id)
    .single();

  if (!lecture) throw new Error("Lecture not found");

  // 강의 삭제 (CASCADE DELETE로 관련 데이터도 자동 삭제됨)
  const { error } = await supabase.from("Lecture").delete().eq("id", id);

  if (error) throw error;

  // 남은 강의들의 sequence 재정렬
  await reorderLectures(lecture.module_id);

  // Course 통계 업데이트
  await updateCourseStats(courseId);

  revalidatePath("/admin");
  revalidatePath(`/classroom/${courseId}`);
}

export async function reorderLectures(moduleId: number) {
  const supabase = await createServerSupabaseClient();

  // 해당 모듈의 모든 강의를 sequence 순으로 가져오기
  const { data: lectures, error: fetchError } = await supabase
    .from("Lecture")
    .select("id")
    .eq("module_id", moduleId)
    .order("sequence", { ascending: true });

  if (fetchError) throw fetchError;

  // sequence를 1부터 순차적으로 재할당
  for (let i = 0; i < lectures.length; i++) {
    await supabase
      .from("Lecture")
      .update({ sequence: i + 1 })
      .eq("id", lectures[i].id);
  }
}

export async function updateLectureOrder(
  moduleId: number,
  lectureOrders: { id: number; sequence: number }[],
) {
  const supabase = await createServerSupabaseClient();

  // 트랜잭션처럼 처리하기 위해 Promise.all 사용
  const updates = lectureOrders.map(({ id, sequence }) =>
    supabase.from("Lecture").update({ sequence }).eq("id", id),
  );

  const results = await Promise.all(updates);

  // 에러 체크
  const hasError = results.some((result) => result.error);
  if (hasError) {
    throw new Error("Failed to update lecture order");
  }

  revalidatePath("/admin");
}

// Course의 통계 업데이트 헬퍼 함수
async function updateCourseStats(courseId: number) {
  const supabase = await createServerSupabaseClient();

  // 해당 코스의 모든 강의 수와 총 시간 계산
  const { data: stats } = await supabase
    .from("Lecture")
    .select("duration_secs")
    .eq("course_id", courseId);

  if (stats) {
    const totalLectures = stats.length;
    const totalDuration = stats.reduce(
      (sum, lecture) => sum + (lecture.duration_secs || 0),
      0,
    );

    await supabase
      .from("Course")
      .update({
        total_lecture_count: totalLectures,
        total_duration_secs: totalDuration,
      })
      .eq("id", courseId);
  }
}

// 강의 키포인트 관리
export async function addLectureKeypoint(lectureId: number, content: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("LectureKeypoint")
    .insert({
      lecture_id: lectureId,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLectureKeypoint(id: number) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("LectureKeypoint")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// 강의 자료 관리
export async function addLectureMaterial(
  lectureId: number,
  title: string,
  fileUrl: string,
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("LectureMaterial")
    .insert({
      lecture_id: lectureId,
      title,
      file_url: fileUrl,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLectureMaterial(id: number) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("LectureMaterial")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
