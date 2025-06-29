"use client";

import { useRouter } from "next/navigation";
import { ADMIN_MENU, adminPermissions } from "@/config/permissions";
import type { AdminSidebarProps } from "../types";

export function AdminSidebar({
  currentTab,
  onTabChange,
  userRole,
}: AdminSidebarProps) {
  const router = useRouter();

  return (
    <aside className="w-60 bg-white border-r flex flex-col py-8 px-6">
      <div className="mb-8">
        <div className="text-xl font-bold text-[#5046E4]">demo-lab</div>
        <div className="text-xs text-gray-400 mt-1">관리자 백오피스</div>
      </div>

      <nav className="flex-1 space-y-1">
        {ADMIN_MENU.map((item) => {
          const hasPermission = adminPermissions.canAccessMenu(
            userRole,
            item.key,
          );

          return (
            <button
              key={item.key}
              className={`w-full text-left px-3 py-2 rounded font-medium transition-colors ${
                currentTab === item.key
                  ? "bg-[#f3f2fd] text-[#5046E4]"
                  : hasPermission
                    ? "hover:bg-gray-100 text-gray-700"
                    : "text-gray-400 cursor-not-allowed"
              }`}
              onClick={() => onTabChange(item.key)}
              disabled={!hasPermission}
              title={!hasPermission ? "접근 권한이 없습니다" : item.description}
            >
              {item.label}
              {!hasPermission && (
                <span className="ml-2 text-xs text-red-500">🔒</span>
              )}
            </button>
          );
        })}
      </nav>

      <button
        className="mt-auto text-gray-400 text-sm hover:underline"
        onClick={() => router.push("/")}
      >
        메인으로 돌아가기
      </button>
    </aside>
  );
}
