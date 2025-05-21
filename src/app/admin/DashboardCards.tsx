import React from "react";

export default function DashboardCards() {
  // TODO: 실제 API 연동 필요
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
        <span className="text-lg font-semibold mb-2">전체 가입자 수</span>
        <span className="text-3xl font-bold">-</span>
      </div>
      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
        <span className="text-lg font-semibold mb-2">전체 게시글 수</span>
        <span className="text-3xl font-bold">-</span>
      </div>
      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
        <span className="text-lg font-semibold mb-2">회원 평균 수강률</span>
        <span className="text-3xl font-bold">-</span>
      </div>
      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
        <span className="text-lg font-semibold mb-2">최근 7일간 게시글</span>
        <span className="text-3xl font-bold">-</span>
      </div>
      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
        <span className="text-lg font-semibold mb-2">최근 7일간 댓글</span>
        <span className="text-3xl font-bold">-</span>
      </div>
    </div>
  );
}
