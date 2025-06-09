"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { NoPermission } from "@/components/ui/no-permission";
import { useUserPermissions } from "../hooks/useUserPermissions";
import { useUserManagement } from "../hooks/useUserManagement";
import { useUserRoleUpdate } from "../hooks/useUserRoleUpdate";
import { UserManagementHeader } from "./userManagementHeader";
import { UserTable } from "./userTable";
import { User } from "../types";
import { toast } from "sonner";

export function UserManagement() {
  // 권한 체크
  const {
    canView,
    canUpdate,
    isLoading: permissionsLoading,
  } = useUserPermissions();

  // 사용자 목록 관리
  const { users, loading, error, fetchUsers, clearError } = useUserManagement();

  // 역할 업데이트
  const { updateUserRole, roleUpdateLoading } = useUserRoleUpdate(
    canUpdate,
    fetchUsers,
  );

  // 권한이 확인되면 데이터 가져오기
  useEffect(() => {
    if (!permissionsLoading && canView) {
      fetchUsers();
    }
  }, [permissionsLoading, canView, fetchUsers]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      switch (error.type) {
        case "permission":
          toast.error(`${error.message}. 관리자에게 문의하세요.`);
          break;
        case "network":
          toast.error(`${error.message}. 잠시 후 다시 시도해주세요.`);
          break;
        default:
          toast.error(
            `사용자 목록을 가져오는데 실패했습니다: ${error.message}`,
          );
      }
      clearError();
    }
  }, [error, clearError]);

  // 권한 확인 중
  if (permissionsLoading) {
    return (
      <Card>
        <UserManagementHeader
          canUpdate={false}
          loading={false}
          onRefresh={() => {}}
        />
        <CardContent>
          <LoadingSpinner message="권한을 확인하는 중..." />
        </CardContent>
      </Card>
    );
  }

  // 권한 없음
  if (!canView) {
    return (
      <Card>
        <UserManagementHeader
          canUpdate={false}
          loading={false}
          onRefresh={() => {}}
        />
        <CardContent>
          <NoPermission message="사용자 목록 조회 권한이 없습니다." />
        </CardContent>
      </Card>
    );
  }

  // 메인 렌더링
  return (
    <Card>
      <UserManagementHeader
        canUpdate={canUpdate}
        loading={loading}
        onRefresh={fetchUsers}
      />
      <CardContent>
        {loading ? (
          <LoadingSpinner message="사용자 목록을 불러오는 중..." />
        ) : (
          <UserTable
            users={users as User[]}
            canUpdate={canUpdate}
            roleUpdateLoading={roleUpdateLoading}
            onRoleUpdate={updateUserRole}
          />
        )}
      </CardContent>
    </Card>
  );
}
