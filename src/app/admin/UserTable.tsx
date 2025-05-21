import React from "react";

export default function UserTable() {
  // TODO: 실제 데이터 연동 필요
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">회원 목록</h3>
        <button className="bg-primary text-white px-4 py-2 rounded">
          회원 매뉴얼 추가
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">이메일</th>
            <th>가입일</th>
            <th>이름</th>
            <th>권한</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {/* 예시 데이터 */}
          <tr>
            <td className="py-2">user@email.com</td>
            <td>2024-06-01</td>
            <td>홍길동</td>
            <td>
              <select className="border rounded px-2 py-1">
                <option>user</option>
                <option>admin</option>
              </select>
            </td>
            <td>
              <button className="text-red-500">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
