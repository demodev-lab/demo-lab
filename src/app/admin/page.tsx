"use client";
import CommunityManager from "@/app/admin/CommunityManager";
import CourseManager from "@/app/admin/CourseManager";
import DashboardCards from "@/app/admin/DashboardCards";
import { UserManagement } from "@/domains/admin/components/UserManagement";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ADMIN_MENU } from "@/config/permissions";
import {
  canViewDashboard,
  canViewUsers,
  canManageCourses,
  canManageCommunity,
  canManagePayments,
} from "@/utils/permissions/permissions";

export default function AdminPage() {
  const [tab, setTab] = useState("dashboard");
  const [error, setError] = useState<string | null>(null);
  const [menuPermissions, setMenuPermissions] = useState<
    Record<string, boolean>
  >({});
  const router = useRouter();

  // 메뉴별 권한 체크
  useEffect(() => {
    const loadPermissions = async () => {
      setMenuPermissions({
        dashboard: await canViewDashboard(),
        user: await canViewUsers(),
        lecture: await canManageCourses(),
        community: await canManageCommunity(),
        settings: await canManagePayments(),
      });
    };

    loadPermissions();
  }, []);

  const handleTabClick = (menuKey: string) => {
    if (!menuPermissions[menuKey]) {
      setError(`이 기능을 사용할 권한이 없습니다.`);
      return;
    }
    setError(null);
    setTab(menuKey);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 사이드바 */}
      <aside className="w-60 bg-white border-r flex flex-col py-8 px-6">
        <div className="mb-8">
          <div className="text-xl font-bold text-[#5046E4]">demo-lab</div>
          <div className="text-xs text-gray-400 mt-1">관리자 백오피스</div>
        </div>
        <nav className="flex-1 space-y-1">
          {ADMIN_MENU.map((item) => {
            const hasPermission = menuPermissions[item.key] ?? false;

            return (
              <button
                key={item.key}
                className={`w-full text-left px-3 py-2 rounded font-medium transition-colors ${
                  tab === item.key
                    ? "bg-[#f3f2fd] text-[#5046E4]"
                    : hasPermission
                      ? "hover:bg-gray-100 text-gray-700"
                      : "text-gray-400 cursor-not-allowed"
                }`}
                onClick={() => hasPermission && handleTabClick(item.key)}
                disabled={!hasPermission}
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

      {/* 컨텐츠 영역 */}
      <main className="flex-1 p-8">
        {error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-bold text-red-600 mb-2">
                접근 권한이 없습니다
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => setError(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                돌아가기
              </button>
            </div>
          </div>
        ) : (
          <>
            {tab === "dashboard" && (
              <>
                <h1 className="text-2xl font-bold mb-6">
                  demo-lab 관리자 대시보드
                </h1>
                <DashboardCards />
              </>
            )}
            {tab === "user" && <UserManagement />}
            {tab === "lecture" && (
              <>
                <h2 className="text-xl font-semibold mb-4">코스 관리</h2>
                <CourseManager />
              </>
            )}
            {tab === "community" && (
              <>
                <h2 className="text-xl font-semibold mb-4">커뮤니티 관리</h2>
                <CommunityManager />
              </>
            )}
            {tab === "settings" && (
              <>
                <h2 className="text-xl font-semibold mb-4">시스템 설정</h2>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-4">Admin 전용 설정</h3>
                  <p className="text-gray-600 mb-4">
                    이 영역은 admin만 접근할 수 있습니다.
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                      <h4 className="font-semibold text-yellow-800">
                        시스템 관리
                      </h4>
                      <p className="text-yellow-700 text-sm mt-1">
                        전체 시스템 설정을 관리합니다.
                      </p>
                    </div>

                    <div className="p-4 bg-red-50 border border-red-200 rounded">
                      <h4 className="font-semibold text-red-800">위험 구역</h4>
                      <p className="text-red-700 text-sm mt-1">
                        데이터 삭제 및 초기화 기능
                      </p>
                      <button className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                        모든 데이터 초기화
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
