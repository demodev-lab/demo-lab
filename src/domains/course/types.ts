import type { Database } from "@/types/database.types";

// 데이터베이스 타입 정의
export type Course = Database["public"]["Tables"]["Course"]["Row"];
export type Module = Database["public"]["Tables"]["Module"]["Row"];
export type Lecture = Database["public"]["Tables"]["Lecture"]["Row"];
export type CourseInstructor =
  Database["public"]["Tables"]["CourseInstructor"]["Row"];
export type CourseLearningGoal =
  Database["public"]["Tables"]["CourseLearningGoal"]["Row"];
export type BackgroundKnowledge =
  Database["public"]["Tables"]["BackgroundKnowledge"]["Row"];
export type LectureKeypoint =
  Database["public"]["Tables"]["LectureKeypoint"]["Row"];
export type LectureMaterial =
  Database["public"]["Tables"]["LectureMaterial"]["Row"];
export type Enrollment = Database["public"]["Tables"]["Enrollment"]["Row"];
export type LectureProgress =
  Database["public"]["Tables"]["LectureProgress"]["Row"];
export type CourseApplication =
  Database["public"]["Tables"]["CourseApplication"]["Row"];

// 입력 타입 정의
export type CreateCourseInput =
  Database["public"]["Tables"]["Course"]["Insert"];
export type UpdateCourseInput =
  Database["public"]["Tables"]["Course"]["Update"];
export type CreateModuleInput =
  Database["public"]["Tables"]["Module"]["Insert"];
export type UpdateModuleInput =
  Database["public"]["Tables"]["Module"]["Update"];
export type CreateLectureInput =
  Database["public"]["Tables"]["Lecture"]["Insert"];
export type UpdateLectureInput =
  Database["public"]["Tables"]["Lecture"]["Update"];
export type CreateCourseApplicationInput =
  Database["public"]["Tables"]["CourseApplication"]["Insert"];
export type UpdateCourseApplicationInput =
  Database["public"]["Tables"]["CourseApplication"]["Update"];

// 확장된 타입 정의 (조인된 데이터 포함)
export interface CourseWithDetails extends Course {
  modules?: ModuleWithLectures[];
  instructors?: CourseInstructorWithProfile[];
  learning_goals?: CourseLearningGoal[];
  background_knowledge?: BackgroundKnowledge[];
  enrollment_count?: number;
}

export interface ModuleWithLectures extends Module {
  lectures: LectureWithDetails[];
}

export interface LectureWithDetails extends Lecture {
  keypoints?: LectureKeypoint[];
  materials?: LectureMaterial[];
  progress?: LectureProgress;
}

export interface CourseInstructorWithProfile extends CourseInstructor {
  instructor: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    username: string | null;
  };
}

// 관리자용 통계 타입
export interface CourseStats {
  total_courses: number;
  total_modules: number;
  total_lectures: number;
  total_enrollments: number;
  average_completion_rate: number;
}

export interface CourseWithProgress extends Course {
  progress: number;
}
