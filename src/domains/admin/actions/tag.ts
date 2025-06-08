"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { FormState } from "../types";

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

  revalidatePath("/admin");
  revalidatePath("/api/tags");
  return { message: "태그가 성공적으로 생성되었습니다.", error: false };
}
