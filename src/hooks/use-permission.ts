import { useAuth } from "@/components/auth/auth-provider";
import { Role, ROLE_LEVELS } from "@/types/auth";
import { useEffect, useState, useCallback } from "react";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";

interface UserWithRole {
  id: string;
  email?: string;
  role?: Role;
}

export function usePermission() {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    // auth 로딩 중이면 대기
    if (authLoading) {
      return;
    }

    // 로그인하지 않은 상태
    if (!authUser) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const supabase = createBrowserSupabaseClient();
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", authUser.id)
        .single();

      if (error) {
        console.warn("프로필 조회 실패:", error);
        // 프로필이 없어도 기본 사용자로 처리
        setUser({
          id: authUser.id,
          email: authUser.email,
          role: Role.USER,
        });
      } else {
        setUser({
          id: authUser.id,
          email: authUser.email,
          role: (profile?.role as Role) || Role.USER,
        });
      }
    } catch (error) {
      console.error("사용자 프로필 가져오기 실패:", error);
      // 에러 발생 시에도 기본 사용자로 처리
      setUser({
        id: authUser.id,
        email: authUser.email,
        role: Role.USER,
      });
    } finally {
      setIsLoading(false);
    }
  }, [authUser, authLoading]);

  useEffect(() => {
    // 초기 데이터 로드
    fetchUserProfile();

    // 로그인하지 않은 상태면 실시간 구독 안함
    if (!authUser) {
      return;
    }

    // Supabase 실시간 구독 설정 (안전하게)
    let channel: any = null;

    try {
      const supabase = createBrowserSupabaseClient();

      // 고유한 채널명 생성 (타임스탬프 + 사용자 ID)
      const channelName = `user-profile-${authUser.id}-${Date.now()}`;

      channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${authUser.id}`, // 현재 사용자의 프로필만 감지
          },
          (payload) => {
            console.log("내 프로필 업데이트:", payload);
            // 실시간으로 프로필 다시 가져오기
            fetchUserProfile();
          },
        )
        .subscribe((status) => {
          console.log("실시간 구독 상태:", status);
        });
    } catch (error) {
      console.error("실시간 구독 설정 실패:", error);
      // 실시간 구독이 실패해도 기본 기능은 계속 작동
    }

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      if (channel) {
        try {
          const supabase = createBrowserSupabaseClient();
          supabase.removeChannel(channel);
          console.log("권한 체크 실시간 구독 해제");
        } catch (error) {
          console.error("실시간 구독 해제 실패:", error);
        }
      }
    };
  }, [authUser?.id]); // fetchUserProfile 대신 authUser.id만 의존성으로

  const hasRole = (requiredRole: Role): boolean => {
    if (!user?.role) return false;

    const userLevel = ROLE_LEVELS[user.role];
    const requiredLevel = ROLE_LEVELS[requiredRole];

    return userLevel >= requiredLevel;
  };

  const isAdmin = (): boolean => hasRole(Role.ADMIN);
  const isManager = (): boolean => hasRole(Role.MANAGER);

  // 권한 정보 강제 새로고침 (이제는 불필요하지만 호환성을 위해 유지)
  const refreshPermissions = useCallback(() => {
    return fetchUserProfile();
  }, [fetchUserProfile]);

  return {
    user,
    isLoading: isLoading || authLoading,
    hasRole,
    isAdmin,
    isManager,
    refreshPermissions,
  };
}
