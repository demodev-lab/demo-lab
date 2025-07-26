import * as z from "zod";

// Step 1: 기본 정보
export const step1Schema = z.object({
  title: z.string().min(5, "제목은 최소 5글자 이상이어야 합니다").max(100),
  subtitle: z.string().max(150).optional(),
  description: z
    .string()
    .min(50, "설명은 최소 50글자 이상이어야 합니다")
    .max(2000),
  difficulty: z.enum(["입문", "초급", "중급", "고급"]),
  category_id: z.number().min(1, "카테고리를 선택해주세요"),
  thumbnail_url: z
    .string()
    .url("올바른 URL을 입력해주세요")
    .optional()
    .or(z.literal("")),
});

// Step 2: 강사 정보
export const step2Schema = z.object({
  instructor_info: z.object({
    name: z.string().min(2, "이름을 입력해주세요"),
    email: z.string().email("올바른 이메일을 입력해주세요"),
    bio: z
      .string()
      .min(50, "자기소개는 최소 50글자 이상이어야 합니다")
      .max(500),
    experience: z
      .string()
      .min(30, "경력사항은 최소 30글자 이상이어야 합니다")
      .max(1000),
    avatar_url: z.string().url().optional().or(z.literal("")),
    certifications: z.array(z.string()).optional(),
  }),
  applicant_phone: z
    .string()
    .regex(/^[0-9-]+$/, "올바른 전화번호를 입력해주세요"),
});

// Step 3: 커리큘럼
export const step3Schema = z.object({
  learning_goals: z
    .array(
      z.object({
        id: z.string(),
        content: z
          .string()
          .min(10, "학습 목표는 최소 10글자 이상이어야 합니다"),
        sequence: z.number(),
      }),
    )
    .min(3, "최소 3개 이상의 학습 목표를 입력해주세요"),
  background_knowledge: z.array(
    z.object({
      id: z.string(),
      content: z.string().min(5),
      sequence: z.number(),
    }),
  ),
  modules_plan: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(5),
        sequence: z.number(),
        lectures: z
          .array(
            z.object({
              id: z.string(),
              title: z.string().min(5),
              description: z.string().optional(),
              duration_mins: z.number().optional(),
              sequence: z.number(),
              access_type: z.enum(["free", "preview", "paid"]),
            }),
          )
          .min(1, "각 모듈에는 최소 1개 이상의 강의가 필요합니다"),
      }),
    )
    .min(1, "최소 1개 이상의 모듈을 입력해주세요"),
});

// Step 4: 가격 및 추가 정보
export const step4Schema = z.object({
  price_info: z
    .object({
      is_free: z.boolean(),
      original_price: z.number().min(0).optional(),
      sale_price: z.number().min(0).optional(),
      currency: z.string().default("KRW"),
      discount_percentage: z.number().min(0).max(100).optional(),
      promotion_end_date: z.string().optional(),
    })
    .refine(
      (data) => {
        // 유료 코스인 경우 가격 검증
        if (!data.is_free) {
          // 정가는 필수
          if (!data.original_price || data.original_price === 0) {
            return false;
          }
          // 판매가가 있는 경우 정가보다 낮아야 함
          if (
            data.sale_price !== undefined &&
            data.sale_price > data.original_price
          ) {
            return false;
          }
        }
        return true;
      },
      {
        message: "유료 코스는 정가가 필요하며, 판매가는 정가보다 낮아야 합니다",
      },
    ),
  target_audience: z.string().max(500).optional(),
  expected_duration_weeks: z.number().min(1).max(52).optional(),
  course_start_date: z.string().optional(),
  additional_materials: z.string().max(1000).optional(),
  additional_message: z.string().max(2000).optional(),
});

// 전체 폼 스키마
export const formSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  ...step4Schema.shape,
});

// 단계별 스키마 맵핑
export const stepSchemas = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: step4Schema,
} as const;

// 스키마 타입
export type Step1Schema = z.infer<typeof step1Schema>;
export type Step2Schema = z.infer<typeof step2Schema>;
export type Step3Schema = z.infer<typeof step3Schema>;
export type Step4Schema = z.infer<typeof step4Schema>;
export type FormSchema = z.infer<typeof formSchema>;
