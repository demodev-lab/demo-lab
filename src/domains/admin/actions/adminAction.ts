"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { cache } from "react";
import { AdminTab } from "../types";
import { Role } from "@/types/auth";
import { adminPermissions } from "../permissions";

// 서버 사이드에서 사용자의 role을 가져오는 함수
export const getUserRole = cache(async (): Promise<Role | null> => {
  const supabase = await createServerSupabaseClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // DB에서 가져온 role 문자열을 Role enum으로 변환
    if (profile?.role && Object.values(Role).includes(profile.role as Role)) {
      return profile.role as Role;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
});

// 특정 탭에 대한 접근 권한 확인
export async function checkTabPermission(tab: AdminTab) {
  const role = await getUserRole();
  if (!role) return false;

  return adminPermissions.canAccessMenu(role, tab);
}

// 어드민 페이지 접근 권한 확인
export async function checkAdminAccess(): Promise<boolean> {
  const role = await getUserRole();
  if (!role) return false;

  return adminPermissions.canAccessAdmin(role);
}
