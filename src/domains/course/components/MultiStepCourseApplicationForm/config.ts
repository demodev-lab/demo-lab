import { 
  BasicInfoStep, 
  InstructorInfoStep, 
  CurriculumStep, 
  PricingInfoStep 
} from "./steps";
import type { StepConfig } from "./types";
import type { CourseApplicationFormData } from "../../types";

// Step 설정 배열 - 순서를 쉽게 변경할 수 있음
export const FORM_STEPS: StepConfig[] = [
  BasicInfoStep,
  InstructorInfoStep,
  CurriculumStep,
  PricingInfoStep,
];

// 모든 Step의 defaultValues를 합쳐서 전체 기본값 생성
export function getDefaultFormValues(): CourseApplicationFormData {
  return FORM_STEPS.reduce((acc, step) => {
    return { ...acc, ...step.defaultValues };
  }, {} as CourseApplicationFormData);
}