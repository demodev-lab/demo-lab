"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Role } from "@/types/auth";
import { adminPermissions } from "@/config/permissions";

interface AdminAccessCheckProps {
  userRole: Role | null;
  children: React.ReactNode;
}

export function AdminAccessCheck({
  userRole,
  children,
}: AdminAccessCheckProps) {
  const router = useRouter();

  useEffect(() => {
    if (!adminPermissions.canAccessAdmin(userRole)) {
      toast.error("관리자 페이지 접근 권한이 없습니다", {
        description: "Manager 이상의 권한이 필요합니다.",
      });
      router.push("/");
    }
  }, [userRole, router]);

  // 권한이 없으면 null 반환 (리다이렉트 중)
  if (!adminPermissions.canAccessAdmin(userRole)) {
    return null;
  }

  return <>{children}</>;
}
