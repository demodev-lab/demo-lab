"use client";

import { useEffect, useState } from "react";
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
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!adminPermissions.canAccessAdmin(userRole)) {
      toast.error("관리자 페이지 접근 권한이 없습니다", {
        description: "Manager 이상의 권한이 필요합니다.",
        action: {
          label: "홈으로 이동",
          onClick: () => router.push("/"),
        },
        onAutoClose: () => {
          router.push("/");
        },
        onDismiss: () => {
          router.push("/");
        },
      });
    } else {
      setShowContent(true);
    }
  }, [userRole, router]);

  // 권한이 없으면 로딩 상태 표시
  if (!adminPermissions.canAccessAdmin(userRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">권한을 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  // 권한이 있을 때만 콘텐츠 표시
  if (!showContent) {
    return null;
  }

  return <>{children}</>;
}
