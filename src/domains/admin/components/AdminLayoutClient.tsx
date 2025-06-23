"use client";

import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import type { AdminTab } from "../types";
import { Role } from "@/types/auth";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userRole: Role;
}

export function AdminLayoutClient({ children, userRole }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  // 현재 탭을 pathname에서 추출
  const pathSegments = pathname.split("/");
  const currentTab = (pathSegments[2] || "dashboard") as AdminTab;

  const handleTabChange = (tab: AdminTab) => {
    if (tab === "dashboard") {
      router.push("/admin/dashboard");
    } else if (tab === "user") {
      router.push("/admin/users");
    } else {
      router.push(`/admin/${tab}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        currentTab={currentTab}
        onTabChange={handleTabChange}
        userRole={userRole}
      />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}