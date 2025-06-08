import { Role, ROLE_LEVELS } from "@/types/auth";
import { PERMISSIONS, type Permission } from "@/config/permissions";
import { getUserRole } from "@/utils/supabase/profiles";

// ===== 도메인별 권한 체크 함수들 =====

// 기본 접근 권한들
export async function canViewPublicContent(): Promise<boolean> {
  return await checkUserPermission("VIEW_PUBLIC_CONTENT");
}

export async function canViewMemberContent(): Promise<boolean> {
  return await checkUserPermission("VIEW_MEMBER_CONTENT");
}

export async function canViewManagerContent(): Promise<boolean> {
  return await checkUserPermission("VIEW_MANAGER_CONTENT");
}

// Admin 권한들
export async function canViewUsers(): Promise<boolean> {
  return await checkUserPermission("VIEW_USERS");
}

export async function canUpdateUserRole(): Promise<boolean> {
  return await checkUserPermission("UPDATE_USER_ROLE");
}

export async function canManageCourses(): Promise<boolean> {
  return await checkUserPermission("MANAGE_COURSES");
}

export async function canManageCommunity(): Promise<boolean> {
  return await checkUserPermission("MANAGE_COMMUNITY");
}

export async function canManagePayments(): Promise<boolean> {
  return await checkUserPermission("MANAGE_PAYMENTS");
}

export async function canViewDashboard(): Promise<boolean> {
  return await checkUserPermission("VIEW_DASHBOARD");
}

// ===== 기본 권한 체크 함수 =====

export async function checkUserPermission(
  permission: Permission,
): Promise<boolean> {
  // null이나 undefined인 경우 GUEST로 처리
  const userRole: Role = await getUserRole();
  const userLevel = ROLE_LEVELS[userRole];
  const requiredLevel = ROLE_LEVELS[PERMISSIONS[permission]];
  return userLevel >= requiredLevel;
}
