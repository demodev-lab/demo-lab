"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// 카테고리 목록 조회
export async function getCategoryList() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) throw error;
  return data;
}

// 카테고리 생성
export async function createCategory(name: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .insert([{ name }])
    .select()
    .single();
  if (error) throw error;
  revalidatePath("/community");
  return data;
}

// 카테고리 수정
export async function updateCategory(id: number, name: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  revalidatePath("/community");
  return data;
}

// 카테고리 삭제
export async function deleteCategory(id: number) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/community");
}
