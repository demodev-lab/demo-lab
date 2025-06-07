"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

type FormState = {
  message: string;
  error: boolean;
};

// 허용된 역할 목록 (DB Enum과 일치)
const ALLOWED_ROLES = ["admin", "manager", "user"];

export async function updateUserRole(
  userId: string,
  newRole: string,
): Promise<FormState> {
  if (!ALLOWED_ROLES.includes(newRole)) {
    return { message: "허용되지 않는 역할입니다.", error: true };
  }

  const supabase = await createServerSupabaseClient();

  // 현재 로그인한 사용자가 admin인지 확인 (DB의 RLS가 실제 방어를 수행)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { message: "인증이 필요합니다.", error: true };
  }

  // 대상 사용자의 role을 업데이트
  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    console.error("Update role error:", error);
    return { message: `역할 변경 실패: ${error.message}`, error: true };
  }

  revalidatePath("/admin"); // 관리자 페이지 캐시 무효화
  revalidatePath("/api/users"); // 사용자 목록 API 캐시 무효화
  return { message: "역할이 성공적으로 변경되었습니다.", error: false };
}
