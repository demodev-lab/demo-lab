"use client";

import { useState } from "react";
import { Role } from "@/types/auth";
import { toast } from "sonner";

/**
 * 사용자 역할 업데이트 훅
 */
export function useUserRoleUpdate(canUpdate: boolean, onSuccess?: () => void) {
  const [roleUpdateLoading, setRoleUpdateLoading] = useState<string | null>(
    null,
  );

  const updateUserRole = async (userId: string, newRole: Role) => {
    if (!canUpdate) {
      toast.error("권한이 없습니다.");
      return;
    }

    try {
      setRoleUpdateLoading(userId);

      const { updateUserRole: updateUserRoleAction } = await import(
        "@/domains/user/actions/user"
      );
      const result = await updateUserRoleAction(userId, newRole);

      if (!result.error) {
        toast.success(result.message);
        onSuccess?.();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.error("사용자 역할 업데이트 실패:", error);

      const errorMessage = error?.message || "역할 업데이트에 실패했습니다.";

      if (errorMessage.includes("권한") || errorMessage.includes("Admin")) {
        toast.error("권한 변경 권한이 없습니다. Admin 권한이 필요합니다.");
      } else if (errorMessage.includes("Invalid role")) {
        toast.error("올바르지 않은 역할입니다.");
      } else if (errorMessage.includes("User not found")) {
        toast.error("사용자를 찾을 수 없습니다.");
      } else {
        toast.error(`역할 업데이트 실패: ${errorMessage}`);
      }
    } finally {
      setRoleUpdateLoading(null);
    }
  };

  return {
    updateUserRole,
    roleUpdateLoading,
  };
}
