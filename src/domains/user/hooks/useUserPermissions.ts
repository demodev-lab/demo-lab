"use client";

import { useState, useEffect } from "react";
import {
  canViewUsers,
  canUpdateUserRole,
} from "@/utils/permissions/permissions";

/**
 * 사용자 관리 페이지 관련 권한 체크 훅
 */
export function useUserPermissions() {
  const [canView, setCanView] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        setIsLoading(true);
        const [viewPermission, updatePermission] = await Promise.all([
          canViewUsers(),
          canUpdateUserRole(),
        ]);
        setCanView(viewPermission);
        setCanUpdate(updatePermission);
      } catch (error) {
        console.error("권한 체크 실패:", error);
        setCanView(false);
        setCanUpdate(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPermissions();
  }, []);

  return {
    canView,
    canUpdate,
    isLoading,
  };
}
