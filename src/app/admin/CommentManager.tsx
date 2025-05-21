import React from "react";

export default function CommentManager() {
  // TODO: 실제 데이터 연동 필요
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="댓글 내용 검색"
        />
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="작성자(이메일/이름) 검색"
        />
        <button className="bg-primary text-white px-4 py-2 rounded">
          검색
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">내용</th>
            <th>작성자 이메일</th>
            <th>작성일</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {/* 예시 데이터 */}
          <tr>
            <td className="py-2">댓글 예시</td>
            <td>user@email.com</td>
            <td>2024-06-01</td>
            <td>
              <button className="text-red-500">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
