import { z } from "zod";

/**
 * 코스 신청 폼 공유 스키마
 * 
 * 클라이언트와 서버 모두에서 사용되는 단일 스키마 정의
 * DRY 원칙을 따라 유효성 규칙의 단일 소스(Single Source of Truth) 역할
 */

// 기본 정보 스키마 (루트 레벨 필드들)
export const basicInfoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "제목은 최소 5글자 이상이어야 합니다")
    .max(100, "제목은 100자를 초과할 수 없습니다"),
  subtitle: z
    .string()
    .trim()
    .max(150, "부제목은 150자를 초과할 수 없습니다")
    .optional(),
  description: z
    .string()
    .trim()
    .min(50, "설명은 최소 50글자 이상이어야 합니다")
    .max(2000, "설명은 2000자를 초과할 수 없습니다"),
  difficulty: z.enum(["입문", "초급", "중급", "고급"], {
    errorMap: () => ({ message: "올바른 난이도를 선택해주세요" })
  }),
  category_id: z
    .number()
    .int()
    .positive("올바른 카테고리를 선택해주세요")
    .nullish(), // null, undefined 허용으로 선택적 필드로 변경
  thumbnail_url: z
    .string()
    .trim()
    .url("올바른 URL을 입력해주세요")
    .optional()
    .or(z.literal("")),
});

// 강사 정보 내부 객체 스키마 (실제 폼에서 수집하는 필드만)
const instructorInfoObjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "이름을 입력해주세요")
    .max(50, "이름은 50자를 초과할 수 없습니다"),
  email: z
    .string()
    .trim()
    .email("올바른 이메일을 입력해주세요"),
  bio: z
    .string()
    .trim()
    .min(50, "자기소개는 최소 50글자 이상이어야 합니다")
    .max(500, "자기소개는 500자를 초과할 수 없습니다"),
  experience: z
    .string()
    .trim()
    .min(30, "경력사항은 최소 30글자 이상이어야 합니다")
    .max(1000, "경력사항은 1000자를 초과할 수 없습니다"),
});

// 강사 정보 스키마 (중첩 구조 포함)
export const instructorInfoSchema = z.object({
  instructor_info: instructorInfoObjectSchema,
  applicant_phone: z
    .string()
    .trim()
    .regex(/^[0-9-]+$/, "올바른 전화번호를 입력해주세요"),
});

// 학습 목표 아이템 스키마
const learningGoalItemSchema = z.object({
  id: z.string(),
  content: z
    .string()
    .trim()
    .min(10, "학습 목표는 최소 10글자 이상이어야 합니다")
    .max(200, "학습 목표는 200자를 초과할 수 없습니다"),
  sequence: z.number(),
});

// 선수 지식 아이템 스키마
const backgroundKnowledgeItemSchema = z.object({
  id: z.string(),
  content: z
    .string()
    .trim()
    .min(5, "선수 지식은 최소 5글자 이상이어야 합니다")
    .max(100, "선수 지식은 100자를 초과할 수 없습니다"),
  sequence: z.number(),
});

// 강의 스키마
const lectureSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .trim()
    .min(5, "강의 제목은 최소 5글자 이상이어야 합니다")
    .max(100, "강의 제목은 100자를 초과할 수 없습니다"),
  description: z
    .string()
    .trim()
    .max(500, "강의 설명은 500자를 초과할 수 없습니다")
    .optional(),
  duration_mins: z
    .number()
    .int()
    .min(5, "강의 시간은 최소 5분 이상이어야 합니다")
    .max(180, "강의 시간은 최대 180분을 초과할 수 없습니다")
    .optional(),
  sequence: z.number(),
  access_type: z.enum(["free", "preview", "paid"]),
});

// 모듈 스키마
const moduleSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .trim()
    .min(5, "모듈 제목은 최소 5글자 이상이어야 합니다")
    .max(100, "모듈 제목은 100자를 초과할 수 없습니다"),
  sequence: z.number(),
  lectures: z
    .array(lectureSchema)
    .min(1, "각 모듈에는 최소 1개 이상의 강의가 필요합니다")
    .max(20, "각 모듈은 최대 20개의 강의까지 가능합니다"),
});

// 커리큘럼 스키마
export const curriculumSchema = z.object({
  learning_goals: z
    .array(learningGoalItemSchema)
    .min(3, "최소 3개 이상의 학습 목표를 입력해주세요")
    .max(10, "학습 목표는 최대 10개까지 입력할 수 있습니다"),
  background_knowledge: z
    .array(backgroundKnowledgeItemSchema)
    .max(5, "선수 지식은 최대 5개까지 입력할 수 있습니다"),
  modules_plan: z
    .array(moduleSchema)
    .min(1, "최소 1개 이상의 모듈을 입력해주세요")
    .max(20, "최대 20개의 모듈까지 입력할 수 있습니다"),
});

// 가격 정보 내부 객체 스키마
const priceInfoObjectSchema = z
  .object({
    is_free: z.boolean(),
    original_price: z
      .number()
      .int()
      .min(0, "가격은 0원 이상이어야 합니다")
      .max(10000000, "가격은 1000만원을 초과할 수 없습니다")
      .optional(),
    sale_price: z
      .number()
      .int()
      .min(0, "가격은 0원 이상이어야 합니다")
      .max(10000000, "가격은 1000만원을 초과할 수 없습니다")
      .optional(),
    currency: z.string().default("KRW"),
    discount_percentage: z
      .number()
      .min(0, "할인율은 0% 이상이어야 합니다")
      .max(100, "할인율은 100%를 초과할 수 없습니다")
      .optional(),
    promotion_end_date: z
      .string()
      .optional()
      .or(z.coerce.date().transform(val => val.toISOString()).optional()),
  })
  .superRefine((data, ctx) => {
    // 유료 코스인 경우 정가 필수 검증
    if (!data.is_free) {
      if (!data.original_price || data.original_price === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "유료 코스는 정가를 입력해야 합니다",
          path: ["original_price"],
        });
      }
      
      // 판매가가 정가보다 높은 경우 검증
      if (
        data.sale_price !== undefined &&
        data.original_price !== undefined &&
        data.sale_price > data.original_price
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "판매가는 정가보다 낮아야 합니다",
          path: ["sale_price"],
        });
      }
    }
  });

// 가격 및 추가 정보 스키마
export const pricingInfoSchema = z.object({
  price_info: priceInfoObjectSchema,
  target_audience: z
    .string()
    .trim()
    .max(500, "대상 수강생 설명은 500자를 초과할 수 없습니다")
    .optional(),
  expected_duration_weeks: z
    .number()
    .int()
    .min(1, "수강 기간은 최소 1주 이상이어야 합니다")
    .max(52, "수강 기간은 최대 52주를 초과할 수 없습니다")
    .optional(),
  course_start_date: z
    .string()
    .optional()
    .or(z.coerce.date().transform(val => val.toISOString()).optional()),
  additional_materials: z
    .string()
    .trim()
    .max(1000, "추가 학습 자료 설명은 1000자를 초과할 수 없습니다")
    .optional(),
  additional_message: z
    .string()
    .trim()
    .max(2000, "관리자 메시지는 2000자를 초과할 수 없습니다")
    .optional(),
});

// 전체 코스 신청 스키마 (중첩 구조 유지하면서 조합)
export const courseApplicationSchema = basicInfoSchema
  .merge(instructorInfoSchema)
  .merge(curriculumSchema)
  .merge(pricingInfoSchema);

// 타입 추론을 위한 타입 정의
export type CourseApplicationFormData = z.infer<typeof courseApplicationSchema>;
export type BasicInfoData = z.infer<typeof basicInfoSchema>;
export type InstructorInfoData = z.infer<typeof instructorInfoSchema>;
export type CurriculumData = z.infer<typeof curriculumSchema>;
export type PricingInfoData = z.infer<typeof pricingInfoSchema>;

// 개별 객체 타입들 (DB 저장시 유용)
export type InstructorInfo = z.infer<typeof instructorInfoObjectSchema>;
export type PriceInfo = z.infer<typeof priceInfoObjectSchema>;
export type LearningGoal = z.infer<typeof learningGoalItemSchema>;
export type BackgroundKnowledgeItem = z.infer<typeof backgroundKnowledgeItemSchema>;
export type Lecture = z.infer<typeof lectureSchema>;
export type ModulePlan = z.infer<typeof moduleSchema>;