import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { Role } from "@/types/auth";

export interface PermissionCheckResult {
  success: boolean;
  user?: any;
  userProfile?: any;
  response?: NextResponse;
}

/**
 * API 라우트에서 사용할 권한 체크 헬퍼
 */
export async function checkPermission(
  requiredRole: Role,
): Promise<PermissionCheckResult> {
  const supabase = await createServerSupabaseClient();

  // 인증 체크
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  // 사용자 프로필 조회
  const { data: userProfile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !userProfile) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "User profile not found" },
        { status: 404 },
      ),
    };
  }

  // 권한 체크 (Role enum의 순서 활용)
  const roleHierarchy = { user: 1, manager: 2, admin: 3 };
  const userLevel =
    roleHierarchy[userProfile.role as keyof typeof roleHierarchy] || 0;
  const requiredLevel =
    roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 999;

  if (userLevel < requiredLevel) {
    return {
      success: false,
      response: NextResponse.json(
        { error: `Insufficient permissions. ${requiredRole} role required.` },
        { status: 403 },
      ),
    };
  }

  return {
    success: true,
    user,
    userProfile,
  };
}
