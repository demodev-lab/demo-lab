import { Control } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { z } from "zod";
import type { CourseApplicationFormData } from "../../types";

// Step 메타데이터 인터페이스
export interface StepMetadata {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

// Step 컴포넌트 Props 인터페이스
export interface StepProps {
  control: Control<CourseApplicationFormData>;
}

// Step 설정 인터페이스
export interface StepConfig {
  metadata: StepMetadata;
  component: React.ComponentType<StepProps>;
  schema: z.ZodSchema<any>;
  fields: (keyof CourseApplicationFormData)[];
  defaultValues: Partial<CourseApplicationFormData>;
}

// 전체 폼 설정 인터페이스
export interface FormStepConfig {
  steps: StepConfig[];
}