import React from "react";

export default function CategoryManager() {
  // TODO: 실제 데이터 연동 필요
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center mb-4 gap-2">
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="카테고리 이름 입력"
        />
        <button className="bg-primary text-white px-4 py-2 rounded">
          카테고리 추가
        </button>
      </div>
      <ul className="space-y-2">
        {/* 예시 데이터 */}
        <li className="flex items-center gap-2">
          <input
            className="border rounded px-2 py-1 flex-1"
            defaultValue="카테고리1"
          />
          <button className="bg-primary text-white px-2 py-1 rounded">
            저장
          </button>
          <button className="text-red-500">삭제</button>
        </li>
      </ul>
    </div>
  );
}
