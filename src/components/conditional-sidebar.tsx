"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

/**
 * 조건부 사이드바 컴포넌트
 * classroom과 calendar 페이지에서는 사이드바를 숨김
 */
export function ConditionalSidebar() {
  const pathname = usePathname();

  // 사이드바를 숨길 경로들
  const hideSidebarPaths = ["/classroom", "/calendar"];

  // 현재 경로가 사이드바를 숨겨야 하는 경로에 포함되는지 확인
  const shouldHideSidebar = hideSidebarPaths.some((path) =>
    pathname.startsWith(path),
  );

  // 사이드바를 숨겨야 하는 경우 null 반환
  if (shouldHideSidebar) {
    return null;
  }

  return <Sidebar />;
}
