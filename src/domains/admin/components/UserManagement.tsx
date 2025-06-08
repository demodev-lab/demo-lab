"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role } from "@/types/auth";
import {
  useUserPermissions,
  useUserManagement,
  useUserRoleUpdate,
} from "../hooks";
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

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return "destructive";
      case Role.MANAGER:
        return "default";
      case Role.USER:
        return "secondary";
      default:
        return "outline";
    }
  };

  if (permissionsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>사용자 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">권한을 확인하는 중...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!canView) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>사용자 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            사용자 목록 조회 권한이 없습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>사용자 관리</CardTitle>
          {!canUpdate && (
            <p className="text-sm text-muted-foreground mt-1">
              ℹ️ 사용자 관리 권한이 없습니다.
            </p>
          )}
        </div>
        <Button onClick={fetchUsers} disabled={loading} size="sm">
          {loading ? "새로고침 중..." : "새로고침"}
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">사용자 목록을 불러오는 중...</span>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>사용자</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>권한</TableHead>
                  <TableHead>가입일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      사용자가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url || ""} />
                            <AvatarFallback>
                              {user.full_name?.[0] ||
                                user.email[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {user.username || "사용자명 없음"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.full_name || (
                          <span className="text-muted-foreground">
                            이름 없음
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeColor(user.role)}>
                          {user.role === Role.ADMIN && "🔴 "}
                          {user.role === Role.MANAGER && "🟡 "}
                          {user.role === Role.USER && "🟢 "}
                          {user.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString("ko-KR")}
                      </TableCell>
                      <TableCell className="text-right">
                        {canUpdate ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={roleUpdateLoading === user.id}
                              >
                                {roleUpdateLoading === user.id
                                  ? "업데이트 중..."
                                  : "권한 변경"}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {Object.values(Role)
                                .filter((role) => role !== Role.GUEST)
                                .map((role) => (
                                  <DropdownMenuItem
                                    key={role}
                                    onClick={() =>
                                      updateUserRole(user.id, role)
                                    }
                                    disabled={
                                      user.role === role ||
                                      roleUpdateLoading === user.id
                                    }
                                  >
                                    {role.toUpperCase()}로 변경
                                  </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled
                            className="text-muted-foreground"
                          >
                            🔒 권한 없음
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
