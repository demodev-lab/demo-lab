"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
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
  canViewUsers,
  canUpdateUserRole,
} from "@/utils/permissions/permissions";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  email: string;
  role: Role;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [roleUpdateLoading, setRoleUpdateLoading] = useState<string | null>(
    null,
  );
  const [canView, setCanView] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);
  const [permissionsLoading, setPermissionsLoading] = useState(true);

  // 권한 체크
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        setPermissionsLoading(true);
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
        setPermissionsLoading(false);
      }
    };

    checkPermissions();
  }, []);

  const fetchUsers = useCallback(async () => {
    const supabase = createBrowserSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.log("로그인되지 않음 - 사용자 목록 조회 중단");
      return;
    }

    if (!canView) {
      console.log("사용자 목록 조회 권한이 없음");
      return;
    }

    try {
      setLoading(true);
      console.log("사용자 목록 조회 시작... (RPC 함수 사용)");

      const { data: profiles, error } = await supabase.rpc(
        "get_users_with_profiles",
      );

      console.log("Supabase RPC 응답:", { profiles, error });

      if (error) {
        console.error("Supabase 에러:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }

      setUsers(profiles || []);
      console.log(`사용자 목록 조회 성공: ${profiles?.length || 0}명`);
    } catch (error: any) {
      console.error("사용자 목록 가져오기 실패:", error);

      if (
        error?.message?.includes("permission") ||
        error?.message?.includes("policy") ||
        error?.code === "42501"
      ) {
        toast.error("사용자 목록 조회 권한이 없습니다. 관리자에게 문의하세요.");
      } else {
        toast.error(
          `사용자 목록을 가져오는데 실패했습니다: ${error?.message || "알 수 없는 오류"}`,
        );
      }
    } finally {
      setLoading(false);
    }
  }, [canView]);

  // 실시간 구독 설정
  useEffect(() => {
    if (!canView || permissionsLoading) {
      return;
    }

    fetchUsers();

    let channel: any = null;

    try {
      const supabase = createBrowserSupabaseClient();
      const channelName = `user-profiles-list-${Date.now()}`;

      channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "profiles",
          },
          (payload) => {
            console.log("사용자 프로필 업데이트:", payload);

            try {
              if (payload.eventType === "INSERT") {
                fetchUsers();
                toast.info(`새 사용자가 가입했습니다`);
              } else if (payload.eventType === "UPDATE") {
                const updatedProfile = payload.new as any;
                setUsers((prev) =>
                  prev.map((user) =>
                    user.id === updatedProfile.id
                      ? {
                          ...user,
                          role: updatedProfile.role,
                          full_name: updatedProfile.full_name,
                          username: updatedProfile.username,
                          avatar_url: updatedProfile.avatar_url,
                        }
                      : user,
                  ),
                );

                const oldProfile = payload.old as any;
                if (oldProfile.role !== updatedProfile.role) {
                  const user = users.find((u) => u.id === updatedProfile.id);
                  if (user) {
                    toast.success(
                      `${user.email} 권한이 ${oldProfile.role}에서 ${updatedProfile.role}로 변경되었습니다.`,
                    );
                  }
                }
              } else if (payload.eventType === "DELETE") {
                const deletedProfile = payload.old as any;
                setUsers((prev) =>
                  prev.filter((user) => user.id !== deletedProfile.id),
                );
                toast.info(`사용자가 삭제되었습니다`);
              }
            } catch (error) {
              console.error("실시간 업데이트 처리 실패:", error);
              fetchUsers();
            }
          },
        )
        .subscribe((status) => {
          console.log("사용자 목록 실시간 구독 상태:", status);
        });
    } catch (error) {
      console.error("실시간 구독 설정 실패:", error);
    }

    return () => {
      if (channel) {
        try {
          channel.unsubscribe();
          console.log("사용자 목록 실시간 구독 해제됨");
        } catch (error) {
          console.error("실시간 구독 해제 실패:", error);
        }
      }
    };
  }, [fetchUsers, canView, permissionsLoading]);

  const updateUserRole = async (userId: string, newRole: Role) => {
    if (!canUpdate) {
      toast.error("권한이 없습니다.");
      return;
    }

    try {
      setRoleUpdateLoading(userId);

      const { updateUserRole: updateUserRoleAction } = await import(
        "@/app/actions/user"
      );
      const result = await updateUserRoleAction(userId, newRole);

      if (!result.error) {
        toast.success(result.message);
        fetchUsers();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.error("사용자 역할 업데이트 실패:", error);

      let errorMessage = error?.message || "역할 업데이트에 실패했습니다.";

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
                              {Object.values(Role).map((role) => (
                                <DropdownMenuItem
                                  key={role}
                                  onClick={() => updateUserRole(user.id, role)}
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
