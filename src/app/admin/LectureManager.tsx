import React from "react";

export default function LectureManager() {
  // 더미 강의 데이터
  const [lectures, setLectures] = React.useState([
    {
      id: "ai-101",
      title: "AI 입문",
      instructor: "홍길동",
      created: "2024-06-01",
    },
    {
      id: "fe-201",
      title: "프론트엔드 실전",
      instructor: "김관리",
      created: "2024-06-05",
    },
  ]);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [addForm, setAddForm] = React.useState({ title: "", instructor: "" });

  const handleAddChange = (key: string, value: string) => {
    setAddForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddLecture = () => {
    setLectures((prev) => [
      ...prev,
      {
        id: `lec-${Date.now()}`,
        title: addForm.title,
        instructor: addForm.instructor,
        created: new Date().toISOString().slice(0, 10),
      },
    ]);
    setAddModalOpen(false);
    setAddForm({ title: "", instructor: "" });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setLectures((prev) => prev.filter((l) => l.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">강의 목록</h3>
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => setAddModalOpen(true)}
        >
          + 강의 등록
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-center">번호</th>
            <th className="text-center">강의명</th>
            <th className="text-center">강사</th>
            <th className="text-center">등록일</th>
            <th className="text-center">관리</th>
          </tr>
        </thead>
        <tbody>
          {lectures.map((lec, idx) => (
            <tr key={lec.id}>
              <td className="py-2 text-center">{idx + 1}</td>
              <td className="text-center">{lec.title}</td>
              <td className="text-center">{lec.instructor}</td>
              <td className="text-center">{lec.created}</td>
              <td className="text-center">
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(lec.id)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 강의 등록 모달 */}
      {addModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setAddModalOpen(false)}
            >
              &times;
            </button>
            <h4 className="text-lg font-bold mb-4">강의 등록</h4>
            <div className="mb-3">
              <label className="block text-sm mb-1">강의명</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={addForm.title}
                onChange={(e) => handleAddChange("title", e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">강사</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={addForm.instructor}
                onChange={(e) => handleAddChange("instructor", e.target.value)}
              />
            </div>
            <button
              className="bg-primary text-white px-4 py-2 rounded w-full"
              onClick={handleAddLecture}
            >
              등록
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
