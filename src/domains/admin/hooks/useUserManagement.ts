"use client";

import { useState, useCallback } from "react";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import type { Tables } from "@/types/database.types";
import { Role } from "@/types/auth";

export type UserProfile = Omit<Tables<"profiles">, "role"> & {
  email: string;
  role: Role;
};

export interface UserManagementError {
  type: "permission" | "network" | "unknown";
  message: string;
  originalError?: any;
}

/**
 * 사용자 목록 관리 훅 (단순 조회)
 */
export function useUserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<UserManagementError | null>(null);

  const fetchUsers = useCallback(async () => {
    const supabase = createBrowserSupabaseClient();

    try {
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("로그인이 필요합니다");
      }

      const { data: profiles, error: rpcError } = await supabase.rpc(
        "get_users_with_profiles",
      );

      if (rpcError) {
        throw rpcError;
      }

      setUsers(profiles || []);
    } catch (err: any) {
      console.error("사용자 목록 조회 실패:", err);

      let errorType: UserManagementError["type"] = "unknown";
      let errorMessage = "알 수 없는 오류가 발생했습니다";

      if (
        err?.message?.includes("permission") ||
        err?.message?.includes("policy") ||
        err?.code === "42501"
      ) {
        errorType = "permission";
        errorMessage = "사용자 목록 조회 권한이 없습니다";
      } else if (
        err?.message?.includes("network") ||
        err?.message?.includes("fetch")
      ) {
        errorType = "network";
        errorMessage = "네트워크 오류가 발생했습니다";
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setError({
        type: errorType,
        message: errorMessage,
        originalError: err,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    clearError: () => setError(null),
  };
}
