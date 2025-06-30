"use client";

import { useEffect, useState, useRef } from "react";
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
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (!adminPermissions.canAccessAdmin(userRole)) {
      // 토스트가 이미 표시되었으면 다시 표시하지 않음
      if (!toastShownRef.current) {
        toastShownRef.current = true;

        // 약간의 지연을 주어 토스트가 렌더링될 시간을 확보
        setTimeout(() => {
          toast.error("관리자 페이지 접근 권한이 없습니다", {
            description: "Manager 이상의 권한이 필요합니다.",
            duration: 5000, // 5초로 늘림
            action: {
              label: "홈으로 이동",
              onClick: () => {
                router.push("/");
              },
            },
          });

          // 5초 후 자동으로 홈으로 이동
          setTimeout(() => {
            router.push("/");
          }, 5000);
        }, 100); // 100ms 지연
      }
    } else {
      setShowContent(true);
    }
  }, [userRole, router]);

  // 권한이 없으면 오버레이만 표시
  if (!adminPermissions.canAccessAdmin(userRole)) {
    return (
      <>
        {/* 배경 오버레이 - z-[100]으로 헤더(z-50)보다 위에 표시 */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
      </>
    );
  }

  // 권한이 있을 때만 콘텐츠 표시
  if (!showContent) {
    return null;
  }

  return <>{children}</>;
}
