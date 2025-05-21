import React from "react";

// 코스 상세 타입 정의
interface Lecture {
  id: number;
  title: string;
  description: string;
  progress: number; // 0~100
}
interface Course {
  id: number;
  name: string;
  lectures: Lecture[];
}

interface CourseDetailProps {
  course: Course;
}

export default function CourseDetail({ course }: CourseDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">{course.name} - 강의 목록</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-center">번호</th>
            <th className="text-center">강의명</th>
            <th className="text-center">설명</th>
            <th className="text-center">진도율</th>
          </tr>
        </thead>
        <tbody>
          {course.lectures.map((lecture, idx) => (
            <tr key={lecture.id} className="border-b last:border-b-0">
              <td className="py-2 text-center">{idx + 1}</td>
              <td className="text-center font-medium">{lecture.title}</td>
              <td className="text-center">{lecture.description}</td>
              <td className="text-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${lecture.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">
                    {lecture.progress}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
