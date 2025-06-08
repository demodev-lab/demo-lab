import { Role } from "@/types/auth";

// ===== 타입 정의 =====
export interface UserProfile {
  id: string;
  role: Role;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  created_at?: string;
}

// ===== 환경별 Supabase Client 생성 =====
async function getSupabaseClient() {
  // 서버 환경인지 확인 (Next.js에서 서버 컴포넌트나 API 라우트)
  if (typeof window === "undefined") {
    // 서버 환경
    const { createServerSupabaseClient } = await import(
      "@/utils/supabase/server"
    );
    return await createServerSupabaseClient();
  } else {
    // 클라이언트 환경
    const { createBrowserSupabaseClient } = await import(
      "@/utils/supabase/client"
    );
    return createBrowserSupabaseClient();
  }
}

// ===== 프로필 조회 함수들 =====
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const supabaseClient = await getSupabaseClient();

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

export async function getUserRole(): Promise<Role> {
  try {
    const profile = await getUserProfile();
    return profile.role;
  } catch (error) {
    // 에러 발생 시 GUEST 권한 반환 (로그인하지 않은 사용자로 취급)
    console.warn(`사용자 권한 조회 실패, GUEST 권한으로 처리: ${error}`);
    return Role.GUEST;
  }
}
