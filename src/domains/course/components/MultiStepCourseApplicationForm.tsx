"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Info,
  BookOpen,
  User,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CourseCategorySelect } from "@/domains/category/components";
import { createCourseApplication } from "../actions/courseApplicationAction";
import type { CourseApplicationFormData } from "../types";

// Step 1: 기본 정보
const step1Schema = z.object({
  title: z.string().min(5, "제목은 최소 5글자 이상이어야 합니다").max(100),
  subtitle: z.string().max(150).optional(),
  description: z
    .string()
    .min(50, "설명은 최소 50글자 이상이어야 합니다")
    .max(2000),
  difficulty: z.enum(["beginner", "elementary", "intermediate", "advanced"]),
  category_id: z.number().min(1, "카테고리를 선택해주세요"),
  thumbnail_url: z
    .string()
    .url("올바른 URL을 입력해주세요")
    .optional()
    .or(z.literal("")),
});

// Step 2: 강사 정보
const step2Schema = z.object({
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
const step3Schema = z.object({
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
const step4Schema = z.object({
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
const formSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  ...step4Schema.shape,
});

// 단계별 스키마 맵핑
const stepSchemas = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: step4Schema,
} as const;

// Props 타입
interface MultiStepCourseApplicationFormProps {
  userId: string;
  userEmail?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// 단계 정보
const steps = [
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

export function MultiStepCourseApplicationForm({
  userId,
  userEmail,
  onSuccess,
  onCancel,
}: MultiStepCourseApplicationFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CourseApplicationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Step 1
      title: "",
      subtitle: "",
      description: "",
      difficulty: "beginner",
      category_id: undefined,
      thumbnail_url: "",
      // Step 2
      instructor_info: {
        name: "",
        email: userEmail || "",
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
    },
  });

  const progress = (currentStep / steps.length) * 100;

  // 단계별 유효성 검증
  const validateCurrentStep = async () => {
    // 현재 단계의 스키마에서 필드 목록 추출
    const currentSchema = stepSchemas[currentStep as keyof typeof stepSchemas];
    const fieldsToValidate = Object.keys(
      currentSchema.shape,
    ) as (keyof CourseApplicationFormData)[];

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (values: CourseApplicationFormData) => {
    setIsSubmitting(true);
    try {
      await createCourseApplication({
        ...values,
        applicant_id: userId,
        applicant_email: userEmail || null,
        status: "pending",
      });

      toast.success(
        "코스 등록 신청이 완료되었습니다! 관리자 승인 후 코스가 공개됩니다.",
      );

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/my-courses");
      }
    } catch (error) {
      console.error("Course application error:", error);
      toast.error("코스 등록 신청에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center",
                currentStep >= step.id
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2",
                  currentStep > step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : currentStep === step.id
                      ? "border-primary"
                      : "border-muted-foreground",
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className="text-xs mt-2 text-center hidden sm:block">
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={`step-${currentStep}`} className="w-full">
                {/* Step 1: 기본 정보 */}
                <TabsContent value="step-1" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>코스 제목 *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="예: React 기초부터 실전까지"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          수강생들이 쉽게 이해할 수 있는 명확한 제목을
                          입력해주세요
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>코스 부제목</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="예: 실습으로 배우는 모던 웹 개발"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>코스 설명 *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="코스의 목표, 대상, 특징 등을 자세히 설명해주세요"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          최소 50자 이상 작성해주세요
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>난이도 *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="난이도를 선택하세요" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">입문</SelectItem>
                              <SelectItem value="elementary">초급</SelectItem>
                              <SelectItem value="intermediate">중급</SelectItem>
                              <SelectItem value="advanced">고급</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>카테고리 *</FormLabel>
                          <FormControl>
                            <CourseCategorySelect
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="카테고리를 선택하세요"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="thumbnail_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>썸네일 이미지 URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          코스를 대표하는 이미지 URL (선택사항)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Step 2: 강사 정보 */}
                <TabsContent value="step-2" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="instructor_info.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>강사명 *</FormLabel>
                          <FormControl>
                            <Input placeholder="홍길동" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="instructor_info.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이메일 *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="instructor@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="instructor_info.bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>자기소개 *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="강사님의 전문 분야와 강의 스타일을 소개해주세요"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          최소 50자 이상 작성해주세요
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instructor_info.experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>경력사항 *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="관련 경력과 프로젝트 경험을 작성해주세요"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          최소 30자 이상 작성해주세요
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="applicant_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>연락처 *</FormLabel>
                        <FormControl>
                          <Input placeholder="010-1234-5678" {...field} />
                        </FormControl>
                        <FormDescription>
                          코스 승인 관련 연락을 받을 수 있는 연락처
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Step 3과 Step 4는 다음 메시지에서 계속... */}
              </Tabs>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={currentStep === 1 ? onCancel : handlePrevious}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {currentStep === 1 ? "취소" : "이전"}
                </Button>

                {currentStep < steps.length ? (
                  <Button type="button" onClick={handleNext}>
                    다음
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "제출 중..." : "신청 완료"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
