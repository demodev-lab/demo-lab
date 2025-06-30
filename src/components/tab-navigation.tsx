"use client";

import { cn } from "@/utils/lib/utils";
import { usePathname, useRouter } from "next/navigation";

/**
 * 탭 네비게이션 컴포넌트
 * 현재 pathname을 기반으로 활성 탭을 결정하고 클릭 시 해당 경로로 이동
 */
export function TabNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { id: "community", label: "Community", path: "/" },
    { id: "classroom", label: "Classroom", path: "/classroom" },
    { id: "calendar", label: "Calendar", path: "/calendar" },
    { id: "members", label: "Members", path: "/members" },
    { id: "about", label: "About", path: "/about" },
  ];

  // 현재 경로를 기반으로 활성 탭 결정
  const getActiveTab = () => {
    if (pathname === "/") return "community";
    if (pathname.startsWith("/classroom")) return "classroom";
    if (pathname.startsWith("/calendar")) return "calendar";
    if (pathname.startsWith("/members")) return "members";
    if (pathname.startsWith("/about")) return "about";
    return "community"; // 기본값
  };

  const activeTab = getActiveTab();

  // 탭 클릭 시 해당 경로로 이동
  const handleTabClick = (tab: (typeof tabs)[0]) => {
    router.push(tab.path);
  };

  return (
    <div className="sticky top-14 z-40 w-full border-b bg-white">
      <nav className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              activeTab === tab.id
                ? "border-b-2 border-[#5046E4] text-[#5046E4]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
