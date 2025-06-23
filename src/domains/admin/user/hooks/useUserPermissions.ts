"use client";

import { useState, useEffect } from "react";
import { adminPermissions } from "@/domains/admin/permissions";
import { Role } from "@/types/auth";

/**
 * 사용자 관리 페이지 관련 권한 체크 훅
 */
export function useAdminPermissions(userRole: Role | Role.GUEST) {
  const [canViewUsers, setCanViewUsers] = useState(false);
  const [canManageUsers, setCanManageUsers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        setIsLoading(true);
        const [viewPermission, updatePermission] = await Promise.all([
          adminPermissions.canViewUsers(userRole),
          adminPermissions.canManageUsers(userRole),
        ]);
        setCanViewUsers(viewPermission);
        setCanManageUsers(updatePermission);
      } catch (error) {
        console.error("권한 체크 실패:", error);
        setCanViewUsers(false);
        setCanManageUsers(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPermissions();
  }, []);

  return {
    canViewUsers,
    canManageUsers,
    isLoading,
  };
}
