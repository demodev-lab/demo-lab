"use server";

import { cache } from "react";
import { AdminTab } from "../types";
import { Role } from "@/types/auth";
import { adminPermissions } from "@/config/permissions";
import { getServerUserProfile } from "@/utils/supabase/profiles";

// 서버 사이드에서 사용자의 role을 가져오는 함수
export const getUserRole = cache(async (): Promise<Role | null> => {
  try {
    const profile = await getServerUserProfile();
    return profile?.role || null;
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
