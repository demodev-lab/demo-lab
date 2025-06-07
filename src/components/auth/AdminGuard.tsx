"use client";
import { usePermission } from "@/hooks/use-permission";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Role } from "@/types/auth";

interface AdminGuardProps {
  children: ReactNode;
  minRole?: Role;
  fallbackRoute?: string;
}

export function AdminGuard({
  children,
  minRole = Role.MANAGER,
  fallbackRoute = "/",
}: AdminGuardProps) {
  const { hasRole, user, isLoading } = usePermission();
  const router = useRouter();

  useEffect(() => {
    // 로딩 중이면 아무것도 하지 않음
    if (isLoading) return;

    // 로그인하지 않았거나 권한이 없으면 리디렉션
    if (!user || !hasRole(minRole)) {
      router.push(fallbackRoute);
    }
  }, [user, hasRole, minRole, router, fallbackRoute, isLoading]);

  // 로딩 중
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>권한을 확인하는 중...</p>
        </div>
      </div>
    );
  }

  // 로그인하지 않았거나 권한 없음
  if (!user || !hasRole(minRole)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            접근 권한이 없습니다
          </h1>
          <p className="text-gray-600">
            {!user ? "로그인이 필요합니다" : `필요 권한: ${minRole} 이상`}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
