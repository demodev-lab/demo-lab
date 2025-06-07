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
import { usePermission } from "@/hooks/use-permission";
import { getRequiredRole } from "@/config/permissions";
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

export default function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [roleUpdateLoading, setRoleUpdateLoading] = useState<string | null>(
    null,
  );

  const { hasRole } = usePermission();

  // 권한 체크
  const canViewUsers = hasRole(getRequiredRole("USER_LIST_VIEW"));
  const canManageRoles = hasRole(getRequiredRole("USER_ROLE_MANAGEMENT"));

  const fetchUsers = useCallback(async () => {
    // 로그인 확인 추가
    const supabase = createBrowserSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.log("로그인되지 않음 - 사용자 목록 조회 중단");
      return;
    }

    if (!canViewUsers) {
      console.log("사용자 목록 조회 권한이 없음");
      return;
    }

    try {
      setLoading(true);

      console.log("사용자 목록 조회 시작... (RPC 함수 사용)");

      // RPC 함수 호출로 변경
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
      console.error("사용자 목록 가져오기 실패:", {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        stack: error?.stack,
      });

      // 권한 문제인지 확인
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
  }, [canViewUsers]);

  // 실시간 구독 설정
  useEffect(() => {
    // 초기 데이터 로드
    fetchUsers();

    // 권한이 없으면 실시간 구독도 안함
    if (!canViewUsers) {
      return;
    }

    // Supabase 실시간 구독 (안전하게)
    let channel: any = null;

    try {
      const supabase = createBrowserSupabaseClient();

      // 고유한 채널명 생성
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
                // 새 사용자 추가 시 전체 목록 다시 가져오기 (이메일 정보 필요)
                fetchUsers();
                const newUser = payload.new as any;
                toast.info(`새 사용자가 가입했습니다`);
              } else if (payload.eventType === "UPDATE") {
                const updatedProfile = payload.new as any;
                // 기존 사용자 목록에서 해당 사용자만 업데이트
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

                // 권한 변경인지 확인
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
              // 에러 발생 시 전체 목록 다시 가져오기
              fetchUsers();
            }
          },
        )
        .subscribe((status) => {
          console.log("사용자 목록 실시간 구독 상태:", status);
        });
    } catch (error) {
      console.error("실시간 구독 설정 실패:", error);
      // 실시간 구독이 실패해도 기본 기능은 계속 작동
    }

    return () => {
      if (channel) {
        try {
          const supabase = createBrowserSupabaseClient();
          supabase.removeChannel(channel);
          console.log("사용자 목록 실시간 구독 해제");
        } catch (error) {
          console.error("실시간 구독 해제 실패:", error);
        }
      }
    };
  }, [canViewUsers]); // fetchUsers 의존성 제거

  const updateUserRole = async (userId: string, newRole: Role) => {
    if (!canManageRoles) {
      toast.error("권한이 없습니다. Admin만 사용자 역할을 변경할 수 있습니다.");
      return;
    }

    try {
      setRoleUpdateLoading(userId);
      const supabase = createBrowserSupabaseClient();

      console.log("역할 변경 시도:", { userId, newRole });

      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) {
        console.error("역할 변경 Supabase 에러:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }

      console.log("역할 변경 성공");
      // 실시간으로 업데이트되므로 별도 상태 업데이트 불필요
      toast.success("사용자 역할이 성공적으로 변경되었습니다.");
    } catch (error: any) {
      console.error("역할 업데이트 실패:", {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        stack: error?.stack,
      });

      const errorMessage = error?.message || "알 수 없는 오류가 발생했습니다.";

      // 권한 관련 오류인지 확인
      if (errorMessage.includes("권한") || errorMessage.includes("Admin")) {
        toast.error("권한이 부족합니다.");
      } else {
        toast.error(`역할 변경 실패: ${errorMessage}`);
      }
    } finally {
      setRoleUpdateLoading(null);
    }
  };

  if (!canViewUsers) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            사용자 목록을 조회할 권한이 없습니다. (Manager 이상 필요)
          </p>
        </CardContent>
      </Card>
    );
  }

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case Role.MANAGER:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case Role.USER:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">사용자 관리</h2>
        <div className="flex items-center gap-2">
          {!canManageRoles && (
            <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded">
              🔒 조회 전용
            </div>
          )}
          {loading && (
            <span className="text-sm text-muted-foreground">
              🔄 실시간 동기화 중...
            </span>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사용자</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead>현재 역할</TableHead>
                <TableHead>역할 변경</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.avatar_url || ""}
                        alt={user.full_name || user.username || user.email}
                      />
                      <AvatarFallback>
                        {(user.full_name ||
                          user.username ||
                          user.email)[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {user.full_name || user.username || "사용자"}
                      </p>
                      {user.username && user.full_name && (
                        <p className="text-sm text-muted-foreground">
                          @{user.username}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString("ko-KR")}
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {canManageRoles ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={roleUpdateLoading === user.id}
                          >
                            {roleUpdateLoading === user.id
                              ? "변경 중..."
                              : "역할 변경"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {Object.values(Role).map((role) => (
                            <DropdownMenuItem
                              key={role}
                              onClick={() => updateUserRole(user.id, role)}
                              disabled={user.role === role}
                              className={user.role === role ? "opacity-50" : ""}
                            >
                              {role === Role.ADMIN && "🔴 "}
                              {role === Role.MANAGER && "🔵 "}
                              {role === Role.USER && "🟢 "}
                              {role}로 설정
                              {user.role === role && " (현재)"}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        권한 없음 🔒
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {users.length === 0 && !loading && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    등록된 사용자가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
