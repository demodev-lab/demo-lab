"use client";

import React, { useState, useEffect, useTransition } from "react";
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUserRole } from "@/app/actions/user";

// 사용자 데이터 타입 정의
interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: "admin" | "manager" | "user";
}

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    message: string;
    error: boolean;
  } | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/users");
      if (res.ok) {
        setUsers(await res.json());
      }
    }
    fetchUsers();
  }, []);

  const handleRoleChange = (
    userId: string,
    newRole: "admin" | "manager" | "user",
  ) => {
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      setFeedback(result); // 피드백 상태 업데이트
      if (!result.error) {
        // UI 즉시 업데이트
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user,
          ),
        );
      }
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">사용자 관리</h2>
      {feedback && (
        <div
          className={`p-2 rounded-md text-sm ${feedback.error ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
        >
          {feedback.message}
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>사용자</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>현재 역할</TableHead>
            <TableHead>역할 변경</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url || ""} />
                  <AvatarFallback>
                    {user.full_name?.[0] || user.email[0]}
                  </AvatarFallback>
                </Avatar>
                {user.full_name || user.username}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span className="font-semibold">{user.role}</span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={isPending}>
                      {isPending ? "변경 중..." : "역할 변경"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(user.id, "admin")}
                    >
                      Admin으로 설정
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(user.id, "manager")}
                    >
                      Manager로 설정
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(user.id, "user")}
                    >
                      User로 설정
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
