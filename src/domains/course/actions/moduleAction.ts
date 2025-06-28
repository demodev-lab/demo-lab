"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { CreateModuleInput, UpdateModuleInput } from "../types";
import { revalidatePath } from "next/cache";

// Module CRUD 액션들
export async function createModule(input: CreateModuleInput) {
  const supabase = await createServerSupabaseClient();

  // 동일한 course_id에서 최대 sequence 값 조회
  const { data: maxSeqData } = await supabase
    .from("Module")
    .select("sequence")
    .eq("course_id", input.course_id)
    .order("sequence", { ascending: false })
    .limit(1)
    .single();

  const newSequence = maxSeqData ? maxSeqData.sequence + 1 : 1;

  const { data, error } = await supabase
    .from("Module")
    .insert({
      ...input,
      sequence: input.sequence ?? newSequence,
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath(`/classroom/${input.course_id}`);
  return data;
}

export async function getModulesByCourseId(courseId: number) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("Module")
    .select(
      `
      *,
      Lecture (
        id,
        title,
        description,
        sequence,
        video_url,
        duration_secs,
        created_at,
        updated_at
      )
    `,
    )
    .eq("course_id", courseId)
    .order("sequence", { ascending: true });

  if (error) throw error;

  // 각 모듈 내의 강의들도 순서대로 정렬
  return data.map((module) => ({
    ...module,
    Lecture: module.Lecture.sort((a: any, b: any) => a.sequence - b.sequence),
  }));
}

export async function updateModule(
  id: number,
  input: UpdateModuleInput & { course_id: number },
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("Module")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath(`/classroom/${input.course_id}`);
  return data;
}

export async function deleteModule(id: number, courseId: number) {
  const supabase = await createServerSupabaseClient();

  // 모듈 삭제 (CASCADE DELETE로 관련 강의도 자동 삭제됨)
  const { error } = await supabase.from("Module").delete().eq("id", id);

  if (error) throw error;

  // 남은 모듈들의 sequence 재정렬
  await reorderModules(courseId);

  revalidatePath("/admin");
  revalidatePath(`/classroom/${courseId}`);
}

export async function reorderModules(courseId: number) {
  const supabase = await createServerSupabaseClient();

  // 해당 코스의 모든 모듈을 sequence 순으로 가져오기
  const { data: modules, error: fetchError } = await supabase
    .from("Module")
    .select("id")
    .eq("course_id", courseId)
    .order("sequence", { ascending: true });

  if (fetchError) throw fetchError;

  // sequence를 1부터 순차적으로 재할당
  for (let i = 0; i < modules.length; i++) {
    await supabase
      .from("Module")
      .update({ sequence: i + 1 })
      .eq("id", modules[i].id);
  }
}

export async function updateModuleOrder(
  courseId: number,
  moduleOrders: { id: number; sequence: number }[],
) {
  const supabase = await createServerSupabaseClient();

  // 트랜잭션처럼 처리하기 위해 Promise.all 사용
  const updates = moduleOrders.map(({ id, sequence }) =>
    supabase.from("Module").update({ sequence }).eq("id", id),
  );

  const results = await Promise.all(updates);

  // 에러 체크
  const hasError = results.some((result) => result.error);
  if (hasError) {
    throw new Error("Failed to update module order");
  }

  revalidatePath("/admin");
  revalidatePath(`/classroom/${courseId}`);
}
