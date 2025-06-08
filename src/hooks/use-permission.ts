// src/hooks/use-permission.ts
"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { Role } from "@/types/auth";
import { useEffect, useState, useCallback } from "react";
import { getUserRole } from "@/utils/supabase/profiles";

/**
 * 🎯 단순하게 현재 유저 권한만 가져오는 훅
 */
export function usePermission() {
  const { isLoading: authLoading } = useAuth();
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserRole = useCallback(async () => {
    if (authLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const role = await getUserRole();
      setUserRole(role);
    } catch (error) {
      console.error("권한 조회 실패:", error);
      setUserRole(Role.GUEST);
    } finally {
      setIsLoading(false);
    }
  }, [authLoading]);

  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  // 🎯 단순하게 userRole과 로딩만 제공
  return {
    userRole,
    isLoading: isLoading || authLoading,
    refresh: fetchUserRole,
  };
}
