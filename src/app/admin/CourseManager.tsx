import React from "react";

export default function CourseManager() {
  // 더미 코스 및 강의 데이터
  const [courses, setCourses] = React.useState([
    {
      id: "course-1",
      name: "AI 마스터코스",
      lectures: [
        {
          id: "ai-101",
          title: "AI 입문",
          instructor: "홍길동",
          created: "2024-06-01",
        },
        {
          id: "ai-201",
          title: "AI 실전",
          instructor: "김관리",
          created: "2024-06-05",
        },
      ],
    },
    {
      id: "course-2",
      name: "프론트엔드 챌린지",
      lectures: [
        {
          id: "fe-101",
          title: "HTML/CSS",
          instructor: "이프론트",
          created: "2024-06-03",
        },
      ],
    },
  ]);
  const [selectedCourseId, setSelectedCourseId] = React.useState(
    courses[0]?.id || "",
  );
  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  // 코스 추가/삭제 모달 상태
  const [addCourseOpen, setAddCourseOpen] = React.useState(false);
  const [addCourseName, setAddCourseName] = React.useState("");

  const handleAddCourse = () => {
    setCourses((prev) => [
      ...prev,
      { id: `course-${Date.now()}`, name: addCourseName, lectures: [] },
    ]);
    setAddCourseOpen(false);
    setAddCourseName("");
  };
  const handleDeleteCourse = (id: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      if (selectedCourseId === id && courses.length > 1) {
        setSelectedCourseId(courses[0].id);
      }
    }
  };

  // 강의 추가/삭제 모달 상태
  const [addLectureOpen, setAddLectureOpen] = React.useState(false);
  const [addLectureForm, setAddLectureForm] = React.useState({
    title: "",
    instructor: "",
  });
  const handleAddLecture = () => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === selectedCourseId
          ? {
              ...c,
              lectures: [
                ...c.lectures,
                {
                  id: `lec-${Date.now()}`,
                  title: addLectureForm.title,
                  instructor: addLectureForm.instructor,
                  created: new Date().toISOString().slice(0, 10),
                },
              ],
            }
          : c,
      ),
    );
    setAddLectureOpen(false);
    setAddLectureForm({ title: "", instructor: "" });
  };
  const handleDeleteLecture = (lectureId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === selectedCourseId
          ? { ...c, lectures: c.lectures.filter((l) => l.id !== lectureId) }
          : c,
      ),
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold">코스 선택:</span>
          <select
            className="border rounded px-2 py-1"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            className="ml-2 text-xs text-blue-500 underline"
            onClick={() => setAddCourseOpen(true)}
          >
            + 코스 추가
          </button>
        </div>
        <div>
          <button
            className="text-red-500 text-xs underline"
            onClick={() => handleDeleteCourse(selectedCourseId)}
          >
            코스 삭제
          </button>
        </div>
      </div>
      {/* 강의 목록 */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">강의 목록</h3>
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => setAddLectureOpen(true)}
        >
          + 강의 추가
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
          {selectedCourse?.lectures.map((lec, idx) => (
            <tr key={lec.id}>
              <td className="py-2 text-center">{idx + 1}</td>
              <td className="text-center">{lec.title}</td>
              <td className="text-center">{lec.instructor}</td>
              <td className="text-center">{lec.created}</td>
              <td className="text-center">
                <button
                  className="text-red-500"
                  onClick={() => handleDeleteLecture(lec.id)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 코스 추가 모달 */}
      {addCourseOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setAddCourseOpen(false)}
            >
              &times;
            </button>
            <h4 className="text-lg font-bold mb-4">코스 추가</h4>
            <input
              className="border rounded px-2 py-1 w-full mb-4"
              placeholder="코스명 입력"
              value={addCourseName}
              onChange={(e) => setAddCourseName(e.target.value)}
            />
            <button
              className="bg-primary text-white px-4 py-2 rounded w-full"
              onClick={handleAddCourse}
            >
              추가
            </button>
          </div>
        </div>
      )}
      {/* 강의 추가 모달 */}
      {addLectureOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setAddLectureOpen(false)}
            >
              &times;
            </button>
            <h4 className="text-lg font-bold mb-4">강의 추가</h4>
            <div className="mb-3">
              <label className="block text-sm mb-1">강의명</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={addLectureForm.title}
                onChange={(e) =>
                  setAddLectureForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">강사</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={addLectureForm.instructor}
                onChange={(e) =>
                  setAddLectureForm((f) => ({
                    ...f,
                    instructor: e.target.value,
                  }))
                }
              />
            </div>
            <button
              className="bg-primary text-white px-4 py-2 rounded w-full"
              onClick={handleAddLecture}
            >
              추가
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
