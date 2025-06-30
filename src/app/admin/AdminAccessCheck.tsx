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
    console.log("AdminAccessCheck - userRole:", userRole);
    console.log(
      "AdminAccessCheck - canAccessAdmin:",
      adminPermissions.canAccessAdmin(userRole),
    );

    if (!adminPermissions.canAccessAdmin(userRole)) {
      // 토스트가 이미 표시되었으면 다시 표시하지 않음
      if (!toastShownRef.current) {
        toastShownRef.current = true;
        console.log("AdminAccessCheck - 권한 없음, 토스트 표시");

        // 약간의 지연을 주어 토스트가 렌더링될 시간을 확보
        setTimeout(() => {
          toast.error("관리자 페이지 접근 권한이 없습니다", {
            description: "Manager 이상의 권한이 필요합니다.",
            duration: 5000, // 5초로 늘림
            action: {
              label: "홈으로 이동",
              onClick: () => {
                console.log("AdminAccessCheck - 홈으로 이동 클릭");
                router.push("/");
              },
            },
          });

          // 5초 후 자동으로 홈으로 이동
          setTimeout(() => {
            console.log("AdminAccessCheck - 타이머로 홈 이동");
            router.push("/");
          }, 5000);
        }, 100); // 100ms 지연
      }
    } else {
      console.log("AdminAccessCheck - 권한 있음");
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
