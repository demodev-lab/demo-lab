import { Role } from "@/types/auth";
import { SupabaseClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "./server";

// ===== 타입 정의 =====
export interface UserProfile {
  id: string;
  role: Role;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  created_at?: string;
}

export async function getServerUserProfile(
): Promise<UserProfile> {
  const supabase = await createServerSupabaseClient();
  return getUserProfile(supabase);
}

export async function getUserProfile(
  supabaseClient: SupabaseClient,
): Promise<UserProfile> {
  try {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    const userId = user?.id;

    if (!userId) {
      throw new Error("인증되지 않은 사용자입니다.");
    }

    const { data: profile, error } = await supabaseClient
      .from("profiles")
      .select("id, role, full_name, username, avatar_url, created_at")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(`프로필 조회 실패: ${error.message}`);
    }

    if (!profile) {
      throw new Error(`사용자 프로필을 찾을 수 없습니다: ${userId}`);
    }

    return {
      id: userId,
      role: profile.role as Role,
      full_name: profile.full_name,
      username: profile.username,
      avatar_url: profile.avatar_url,
      created_at: profile.created_at,
    };
  } catch (error) {
    // 에러를 다시 throw하여 호출자가 처리하도록
    throw error;
  }
}
