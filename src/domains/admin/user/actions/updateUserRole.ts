"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { adminPermissions } from "@/domains/admin/permissions";
import { Role } from "@/types/auth";

type FormState = {
  message: string;
  error: boolean;
};

export async function updateUserRole(
  userId: string,
  newRole: Role,
  userRole: Role
): Promise<FormState> {
  if (!(await adminPermissions.canManageUsers(userRole))) {
    return {
      message: "권한 변경 권한이 없습니다.",
      error: true,
    };
  }

  const supabase = await createServerSupabaseClient();

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
