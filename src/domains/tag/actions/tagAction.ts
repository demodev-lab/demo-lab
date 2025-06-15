"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// 태그 목록 조회
export async function getTagList() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("tags").select("*").order("name");
  if (error) throw error;
  return data;
}

// 태그 생성
export async function createTag(name: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("tags")
    .insert([{ name }])
    .select()
    .single();
  if (error) throw error;
  revalidatePath("/community");
  return data;
}

// 태그 수정
export async function updateTag(id: number, name: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("tags")
    .update({ name })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  revalidatePath("/community");
  return data;
}

// 태그 삭제
export async function deleteTag(id: number) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/community");
}
