import type { Database } from "@/types/database.types";

// =============================================
// JSONB 필드 타입 정의 (타입 안전성을 위해)
// =============================================

// 학습 목표 타입
export interface LearningGoal {
  id: string;
  content: string;
  sequence: number;
}

// 배경 지식 타입
export interface BackgroundKnowledgeItem {
  id: string;
  content: string;
  sequence: number;
}

// 강사 정보 타입
export interface InstructorInfo {
  name: string;
  email: string;
  bio: string;
  experience: string;
  avatar_url?: string;
  certifications?: string[];
}

// 강의 계획 타입
export interface LecturePlan {
  id: string;
  title: string;
  description?: string;
  duration_mins?: number;
  sequence: number;
  access_type: "free" | "preview" | "paid";
}

// 모듈 계획 타입
export interface ModulePlan {
  id: string;
  title: string;
  sequence: number;
  lectures: LecturePlan[];
}

// 가격 정보 타입
export interface PriceInfo {
  is_free: boolean;
  original_price?: number;
  sale_price?: number;
  currency: string;
  discount_percentage?: number;
  promotion_end_date?: string;
}

// =============================================
// 기본 데이터베이스 타입 정의
// =============================================
export type Course = Database["public"]["Tables"]["course"]["Row"];
export type Module = Database["public"]["Tables"]["module"]["Row"];
export type Lecture = Database["public"]["Tables"]["lecture"]["Row"];
export type CourseInstructor =
  Database["public"]["Tables"]["course_instructor"]["Row"];
export type CourseLearningGoal =
  Database["public"]["Tables"]["course_learning_goal"]["Row"];
export type BackgroundKnowledge =
  Database["public"]["Tables"]["background_knowledge"]["Row"];
export type LectureKeypoint =
  Database["public"]["Tables"]["lecture_keypoint"]["Row"];
export type LectureMaterial =
  Database["public"]["Tables"]["lecture_material"]["Row"];
export type Enrollment = Database["public"]["Tables"]["enrollment"]["Row"];
export type LectureProgress =
  Database["public"]["Tables"]["lecture_progress"]["Row"];

// 기본 CourseApplication 타입 (JSONB 필드는 Json 타입)
type CourseApplicationBase =
  Database["public"]["Tables"]["course_application"]["Row"];

// 새로운 테이블 타입들
export type CourseCategory =
  Database["public"]["Tables"]["course_category"]["Row"];
export type Payment = Database["public"]["Tables"]["payment"]["Row"];
export type CourseReview = Database["public"]["Tables"]["course_review"]["Row"];

// ENUM 타입들
export type CourseStatus = Database["public"]["Enums"]["course_status"];
export type DifficultyLevel = Database["public"]["Enums"]["difficulty_level"];
export type LectureAccessType =
  Database["public"]["Enums"]["lecture_access_type"];
export type PaymentStatus = Database["public"]["Enums"]["payment_status"];

// =============================================
// 타입 안전한 CourseApplication 타입 (JSONB 필드 구체화)
// =============================================
export type CourseApplication = Omit<
  CourseApplicationBase,
  | "learning_goals"
  | "background_knowledge"
  | "instructor_info"
  | "modules_plan"
  | "price_info"
> & {
  learning_goals: LearningGoal[] | null;
  background_knowledge: BackgroundKnowledgeItem[] | null;
  instructor_info: InstructorInfo | null;
  modules_plan: ModulePlan[] | null;
  price_info: PriceInfo | null;
};

// =============================================
// 입력 타입 정의
// =============================================
export type CreateCourseInput =
  Database["public"]["Tables"]["course"]["Insert"];
export type UpdateCourseInput =
  Database["public"]["Tables"]["course"]["Update"];
export type CreateModuleInput =
  Database["public"]["Tables"]["module"]["Insert"];
export type UpdateModuleInput =
  Database["public"]["Tables"]["module"]["Update"];
export type CreateLectureInput =
  Database["public"]["Tables"]["lecture"]["Insert"];
export type UpdateLectureInput =
  Database["public"]["Tables"]["lecture"]["Update"];

// CourseApplication 입력 타입 (기본 타입 기반으로 구체화)
export type CreateCourseApplicationInput = Omit<
  Database["public"]["Tables"]["course_application"]["Insert"],
  | "learning_goals"
  | "background_knowledge"
  | "instructor_info"
  | "modules_plan"
  | "price_info"
> & {
  learning_goals?: LearningGoal[];
  background_knowledge?: BackgroundKnowledgeItem[];
  instructor_info?: InstructorInfo;
  modules_plan?: ModulePlan[];
  price_info?: PriceInfo;
};

export type UpdateCourseApplicationInput = Omit<
  Database["public"]["Tables"]["course_application"]["Update"],
  | "learning_goals"
  | "background_knowledge"
  | "instructor_info"
  | "modules_plan"
  | "price_info"
> & {
  learning_goals?: LearningGoal[] | null;
  background_knowledge?: BackgroundKnowledgeItem[] | null;
  instructor_info?: InstructorInfo | null;
  modules_plan?: ModulePlan[] | null;
  price_info?: PriceInfo | null;
};

// 새로운 테이블 입력 타입들
export type CreateCourseCategoryInput =
  Database["public"]["Tables"]["course_category"]["Insert"];
export type CreatePaymentInput =
  Database["public"]["Tables"]["payment"]["Insert"];
export type CreateCourseReviewInput =
  Database["public"]["Tables"]["course_review"]["Insert"];

// =============================================
// 특화된 업데이트 타입들 (필요한 필드만 업데이트)
// =============================================
export type UpdateCourseTitleInput = Pick<UpdateCourseInput, "title">;
export type UpdateCourseStatusInput = Pick<UpdateCourseInput, "status">;
export type UpdateCoursePriceInput = Pick<
  UpdateCourseInput,
  "original_price" | "sale_price" | "is_free"
>;

// =============================================
// 폼 관련 타입들 (다단계 폼용)
// =============================================
export interface CourseApplicationFormStep1 {
  title: string;
  subtitle?: string;
  description: string;
  difficulty: DifficultyLevel;
  category_id: number;
  thumbnail_url?: string;
}

export interface CourseApplicationFormStep2 {
  instructor_info: InstructorInfo;
  applicant_phone: string;
}

export interface CourseApplicationFormStep3 {
  learning_goals: LearningGoal[];
  background_knowledge: BackgroundKnowledgeItem[];
  modules_plan: ModulePlan[];
}

export interface CourseApplicationFormStep4 {
  price_info: PriceInfo;
  target_audience?: string;
  expected_duration_weeks?: number;
  course_start_date?: string;
  additional_materials?: string;
  additional_message?: string;
}

export type CourseApplicationFormData = CourseApplicationFormStep1 &
  CourseApplicationFormStep2 &
  CourseApplicationFormStep3 &
  CourseApplicationFormStep4;

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
