import { Info, User, BookOpen, DollarSign } from "lucide-react";
import type { CourseApplicationFormData } from "../../types";

// 단계 정보
export const STEPS = [
  {
    id: 1,
    title: "기본 정보",
    description: "코스의 기본 정보를 입력해주세요",
    icon: Info,
  },
  {
    id: 2,
    title: "강사 정보",
    description: "강사 프로필을 작성해주세요",
    icon: User,
  },
  {
    id: 3,
    title: "커리큘럼",
    description: "학습 목표와 커리큘럼을 구성해주세요",
    icon: BookOpen,
  },
  {
    id: 4,
    title: "가격 및 추가 정보",
    description: "가격 정책과 추가 정보를 입력해주세요",
    icon: DollarSign,
  },
];

// 기본 폼 데이터
export const DEFAULT_FORM_VALUES: CourseApplicationFormData = {
  // Step 1
  title: "",
  subtitle: "",
  description: "",
  difficulty: "입문",
  category_id: undefined as any,
  thumbnail_url: "",
  // Step 2
  instructor_info: {
    name: "",
    email: "",
    bio: "",
    experience: "",
    avatar_url: "",
    certifications: [],
  },
  applicant_phone: "",
  // Step 3
  learning_goals: [],
  background_knowledge: [],
  modules_plan: [],
  // Step 4
  price_info: {
    is_free: true,
    original_price: 0,
    sale_price: 0,
    currency: "KRW",
    discount_percentage: 0,
    promotion_end_date: "",
  },
  target_audience: "",
  expected_duration_weeks: 4,
  course_start_date: "",
  additional_materials: "",
  additional_message: "",
};

// 타입 안전한 키 타입
export type StepNumber = 1 | 2 | 3 | 4;
