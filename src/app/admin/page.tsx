"use client";
import CategoryManager from "@/app/admin/CategoryManager";

import CourseManager from "@/app/admin/CourseManager";
import DashboardCards from "@/app/admin/DashboardCards";
import UserTable from "@/app/admin/UserTable";
// 관리자 대시보드 메인 페이지

import React, { useState } from "react";

const MENU = [
  { key: "dashboard", label: "대시보드" },
  { key: "user", label: "회원 관리" },
  { key: "lecture", label: "코스 관리" },
  { key: "email", label: "이메일" },
  { key: "student", label: "수강 정보" },
];

export default function AdminPage() {
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 사이드바 */}
      <aside className="w-60 bg-white border-r flex flex-col py-8 px-6 min-h-screen">
        <div className="mb-8">
          <div className="text-xl font-bold text-[#5046E4]">demo-lab</div>
          <div className="text-xs text-gray-400 mt-1">관리자 백오피스</div>
        </div>
        <nav className="flex-1 space-y-1">
          {MENU.map((item) => (
            <button
              key={item.key}
              className={`w-full text-left px-3 py-2 rounded font-medium transition-colors ${tab === item.key ? "bg-[#f3f2fd] text-[#5046E4]" : "hover:bg-gray-100 text-gray-700"}`}
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button className="mt-auto text-gray-400 text-sm hover:underline">
          로그아웃
        </button>
      </aside>
      {/* 컨텐츠 영역 */}
      <main className="flex-1 p-8">
        {tab === "dashboard" && (
          <>
            <h1 className="text-2xl font-bold mb-6">
              demo-lab 관리자 대시보드
            </h1>
            <DashboardCards />
          </>
        )}
        {tab === "user" && (
          <>
            <h2 className="text-xl font-semibold mb-4">회원 관리</h2>
            <UserTable />
          </>
        )}
        {tab === "lecture" && (
          <>
            <h2 className="text-xl font-semibold mb-4">코스 관리</h2>
            <CourseManager />
          </>
        )}
        {tab === "student" && (
          <>
            <h2 className="text-xl font-semibold mb-4">카테고리 관리</h2>
            <CategoryManager />
          </>
        )}
        {/* 이메일 탭은 추후 구현 */}
      </main>
    </div>
  );
}
