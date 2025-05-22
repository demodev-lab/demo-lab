import React from "react";

export default function LectureManager() {
  // 더미 강의 데이터 (확장된 필드 추가)
  const [lectures, setLectures] = React.useState([
    {
      id: "ai-101",
      title: "AI 입문",
      instructor: "홍길동",
      created: "2024-06-01",
      category: "AI",
      description: "인공지능의 기본 개념과 활용법을 배웁니다.",
      level: "입문",
      status: "공개",
      students: 15,
      avgProgress: 76,
      order: 1,
    },
    {
      id: "fe-201",
      title: "프론트엔드 실전",
      instructor: "김관리",
      created: "2024-06-05",
      category: "개발",
      description: "실무에서 바로 써먹는 프론트엔드 개발 기술을 배웁니다.",
      level: "중급",
      status: "공개",
      students: 8,
      avgProgress: 45,
      order: 2,
    },
  ]);

  // 모달 및 폼 상태
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [studentModalOpen, setStudentModalOpen] = React.useState(false);
  const [currentLecture, setCurrentLecture] = React.useState<any>(null);

  const [addForm, setAddForm] = React.useState({
    title: "",
    instructor: "",
    category: "AI",
    description: "",
    level: "입문",
    status: "공개",
  });

  // 입력 폼 핸들러
  const handleAddChange = (key: string, value: string) => {
    setAddForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleEditChange = (key: string, value: string) => {
    setCurrentLecture((prev: any) => ({ ...prev, [key]: value }));
  };

  // 강의 추가
  const handleAddLecture = () => {
    setLectures((prev) => [
      ...prev,
      {
        id: `lec-${Date.now()}`,
        title: addForm.title,
        instructor: addForm.instructor,
        created: new Date().toISOString().slice(0, 10),
        category: addForm.category,
        description: addForm.description,
        level: addForm.level,
        status: addForm.status,
        students: 0,
        avgProgress: 0,
        order: prev.length + 1,
      },
    ]);
    setAddModalOpen(false);
    setAddForm({
      title: "",
      instructor: "",
      category: "AI",
      description: "",
      level: "입문",
      status: "공개",
    });
  };

  // 강의 삭제
  const handleDelete = (id: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setLectures((prev) => prev.filter((l) => l.id !== id));
    }
  };

  // 강의 수정 모달 열기
  const handleEditOpen = (lecture: any) => {
    setCurrentLecture({ ...lecture });
    setEditModalOpen(true);
  };

  // 강의 수정 저장
  const handleEditSave = () => {
    setLectures((prev) =>
      prev.map((lec) => (lec.id === currentLecture.id ? currentLecture : lec)),
    );
    setEditModalOpen(false);
  };

  // 학습자 현황 모달 열기
  const handleStudentOpen = (lecture: any) => {
    setCurrentLecture({ ...lecture });
    setStudentModalOpen(true);
  };

  // 강의 순서 이동
  const handleMoveUp = (index: number) => {
    if (index === 0) return;

    setLectures((prev) => {
      const newLectures = [...prev];
      [newLectures[index].order, newLectures[index - 1].order] = [
        newLectures[index - 1].order,
        newLectures[index].order,
      ];
      return newLectures.sort((a, b) => a.order - b.order);
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === lectures.length - 1) return;

    setLectures((prev) => {
      const newLectures = [...prev];
      [newLectures[index].order, newLectures[index + 1].order] = [
        newLectures[index + 1].order,
        newLectures[index].order,
      ];
      return newLectures.sort((a, b) => a.order - b.order);
    });
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
            <th className="py-2 text-center">순서</th>
            <th className="text-center">강의명</th>
            <th className="text-center">카테고리</th>
            <th className="text-center">강사</th>
            <th className="text-center">난이도</th>
            <th className="text-center">상태</th>
            <th className="text-center">등록일</th>
            <th className="text-center">수강생</th>
            <th className="text-center">관리</th>
          </tr>
        </thead>
        <tbody>
          {lectures.map((lec, idx) => (
            <tr key={lec.id} className="border-b">
              <td className="py-2 text-center">
                <div className="flex flex-col items-center">
                  <span>{idx + 1}</span>
                  <div className="flex mt-1 gap-1">
                    <button
                      className="text-gray-500 text-xs px-1.5 py-0.5 bg-gray-100 rounded"
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                    >
                      ↑
                    </button>
                    <button
                      className="text-gray-500 text-xs px-1.5 py-0.5 bg-gray-100 rounded"
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === lectures.length - 1}
                    >
                      ↓
                    </button>
                  </div>
                </div>
              </td>
              <td className="text-center">{lec.title}</td>
              <td className="text-center">{lec.category}</td>
              <td className="text-center">{lec.instructor}</td>
              <td className="text-center">{lec.level}</td>
              <td className="text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${lec.status === "공개" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {lec.status}
                </span>
              </td>
              <td className="text-center">{lec.created}</td>
              <td className="text-center">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => handleStudentOpen(lec)}
                >
                  {lec.students}명
                </button>
              </td>
              <td className="text-center">
                <div className="flex justify-center gap-2">
                  <button
                    className="text-blue-500"
                    onClick={() => handleEditOpen(lec)}
                  >
                    수정
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(lec.id)}
                  >
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 강의 등록 모달 */}
      {addModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setAddModalOpen(false)}
            >
              &times;
            </button>
            <h4 className="text-lg font-bold mb-4">강의 등록</h4>

            <div className="mb-3">
              <label className="block text-sm mb-1">강의명 *</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={addForm.title}
                onChange={(e) => handleAddChange("title", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">카테고리</label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={addForm.category}
                onChange={(e) => handleAddChange("category", e.target.value)}
              >
                <option value="AI">AI</option>
                <option value="개발">개발</option>
                <option value="디자인">디자인</option>
                <option value="마케팅">마케팅</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">강사 *</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={addForm.instructor}
                onChange={(e) => handleAddChange("instructor", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">강의 설명</label>
              <textarea
                className="border rounded px-2 py-1 w-full"
                rows={3}
                value={addForm.description}
                onChange={(e) => handleAddChange("description", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">난이도</label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={addForm.level}
                onChange={(e) => handleAddChange("level", e.target.value)}
              >
                <option value="입문">입문</option>
                <option value="초급">초급</option>
                <option value="중급">중급</option>
                <option value="고급">고급</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">상태</label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={addForm.status}
                onChange={(e) => handleAddChange("status", e.target.value)}
              >
                <option value="공개">공개</option>
                <option value="비공개">비공개</option>
              </select>
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

      {/* 강의 수정 모달 */}
      {editModalOpen && currentLecture && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setEditModalOpen(false)}
            >
              &times;
            </button>
            <h4 className="text-lg font-bold mb-4">강의 수정</h4>

            <div className="mb-3">
              <label className="block text-sm mb-1">강의명 *</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={currentLecture.title}
                onChange={(e) => handleEditChange("title", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">카테고리</label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={currentLecture.category}
                onChange={(e) => handleEditChange("category", e.target.value)}
              >
                <option value="AI">AI</option>
                <option value="개발">개발</option>
                <option value="디자인">디자인</option>
                <option value="마케팅">마케팅</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">강사 *</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={currentLecture.instructor}
                onChange={(e) => handleEditChange("instructor", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">강의 설명</label>
              <textarea
                className="border rounded px-2 py-1 w-full"
                rows={3}
                value={currentLecture.description}
                onChange={(e) =>
                  handleEditChange("description", e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">난이도</label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={currentLecture.level}
                onChange={(e) => handleEditChange("level", e.target.value)}
              >
                <option value="입문">입문</option>
                <option value="초급">초급</option>
                <option value="중급">중급</option>
                <option value="고급">고급</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">상태</label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={currentLecture.status}
                onChange={(e) => handleEditChange("status", e.target.value)}
              >
                <option value="공개">공개</option>
                <option value="비공개">비공개</option>
              </select>
            </div>

            <button
              className="bg-primary text-white px-4 py-2 rounded w-full"
              onClick={handleEditSave}
            >
              저장
            </button>
          </div>
        </div>
      )}

      {/* 학습자 현황 모달 */}
      {studentModalOpen && currentLecture && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setStudentModalOpen(false)}
            >
              &times;
            </button>
            <h4 className="text-lg font-bold mb-4">
              {currentLecture.title} - 학습자 현황
            </h4>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">총 수강생</div>
                <div className="text-2xl font-bold">
                  {currentLecture.students}명
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">평균 진도율</div>
                <div className="text-2xl font-bold">
                  {currentLecture.avgProgress}%
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500 mb-1">진도율 분포</div>
            <div className="flex h-8 mb-4 rounded-md overflow-hidden">
              <div
                className="bg-green-500"
                style={{
                  width: `${Math.round(((currentLecture.students * 0.6) / currentLecture.students) * 100)}%`,
                }}
                title="80-100% 완료: 60%"
              ></div>
              <div
                className="bg-yellow-500"
                style={{
                  width: `${Math.round(((currentLecture.students * 0.3) / currentLecture.students) * 100)}%`,
                }}
                title="30-80% 완료: 30%"
              ></div>
              <div
                className="bg-red-500"
                style={{
                  width: `${Math.round(((currentLecture.students * 0.1) / currentLecture.students) * 100)}%`,
                }}
                title="0-30% 완료: 10%"
              ></div>
            </div>

            <div className="text-sm text-gray-500 mb-6">
              * 더 자세한 학습자 현황은 대시보드에서 확인할 수 있습니다.
            </div>

            <button
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded w-full"
              onClick={() => setStudentModalOpen(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
