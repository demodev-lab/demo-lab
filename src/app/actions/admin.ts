"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

interface FormState {
  message: string;
  error: boolean;
}

export async function createCategory(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createServerSupabaseClient();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const color = formData.get("color") as string;

  if (!name || !color) {
    return { message: "이름과 색상은 필수입니다.", error: true };
  }

  const { error } = await supabase
    .from("categories")
    .insert({ name, description, color });

  if (error) {
    console.error("Create category error:", error);
    return { message: `카테고리 생성 실패: ${error.message}`, error: true };
  }

  revalidatePath("/admin"); // 관리자 페이지 캐시 무효화
  revalidatePath("/api/categories"); // 카테고리 API 캐시 무효화
  return { message: "카테고리가 성공적으로 생성되었습니다.", error: false };
}

export async function createTag(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createServerSupabaseClient();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const color = formData.get("color") as string;

  if (!name || !color) {
    return { message: "태그 이름과 색상은 필수입니다.", error: true };
  }

  const { error } = await supabase
    .from("tags")
    .insert({ name, description, color });

  if (error) {
    console.error("Create tag error:", error);
    return { message: `태그 생성 실패: ${error.message}`, error: true };
  }

  revalidatePath("/admin"); // 관리자 페이지 캐시 무효화
  revalidatePath("/api/tags"); // 태그 API 캐시 무효화 (만들 예정)
  return { message: "태그가 성공적으로 생성되었습니다.", error: false };
}
