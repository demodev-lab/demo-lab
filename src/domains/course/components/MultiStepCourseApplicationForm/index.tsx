"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/lib/utils";
import { createCourseApplication } from "../../actions/courseApplicationActions";
import type { CourseApplicationFormData } from "../../types";
import { FORM_STEPS, getDefaultFormValues } from "./config";

// Props 타입
interface MultiStepCourseApplicationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MultiStepCourseApplicationForm({
  onSuccess,
  onCancel,
}: MultiStepCourseApplicationFormProps) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const currentStep = FORM_STEPS[currentStepIndex];
  const progress = ((currentStepIndex + 1) / FORM_STEPS.length) * 100;

  // 전체 스키마 생성
  const formSchema = z.object(
    FORM_STEPS.reduce((acc, step) => {
      // z.object 스키마에서 shape 가져오기
      const shape = (step.schema as z.ZodObject<any>).shape;
      return { ...acc, ...shape };
    }, {} as z.ZodRawShape)
  );

  // 기본값 설정
  const defaultValues = getDefaultFormValues();

  const form = useForm<CourseApplicationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });


  // 단계별 유효성 검증
  const validateCurrentStep = async () => {
    const result = await form.trigger(currentStep.fields);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStepIndex < FORM_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const onSubmit = async (values: CourseApplicationFormData) => {
    setIsSubmitting(true);
    try {
      console.group("코스 신청 폼 제출");
      console.log("현재 스텝:", currentStep.metadata.title);
      console.log("폼 데이터:", values);
      console.groupEnd();

      // 🔐 보안: 서버 액션에서 인증 정보를 직접 가져오므로 클라이언트 정보는 전달하지 않음
      const result = await createCourseApplication(values);

      if (result.success) {
        console.log("✅ 신청 성공! Application ID:", result.applicationId);
        toast.success(
          "코스 등록 신청이 완료되었습니다! 관리자 승인 후 코스가 공개됩니다.",
        );

        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/my-courses");
        }
      } else {
        console.error("❌ 신청 실패:", result.error);
        toast.error(result.error || "코스 등록 신청에 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ 예상치 못한 에러:", error);
      toast.error("시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 현재 Step 컴포넌트 가져오기
  const StepComponent = currentStep.component;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 폼 제출은 handleSubmitClick에서 처리
  };

  const handleSubmitClick = async () => {
    // 마지막 스텝에서 제출 버튼을 직접 클릭했을 때만 실행
    const isValid = await validateCurrentStep();
    if (isValid) {
      const formData = form.getValues();
      await onSubmit(formData);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-4">
          {FORM_STEPS.map((step, index) => {
            const Icon = step.metadata.icon;
            return (
              <div
                key={step.metadata.id}
                className={cn(
                  "flex flex-col items-center",
                  currentStepIndex >= index
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2",
                    currentStepIndex > index
                      ? "bg-primary border-primary text-primary-foreground"
                      : currentStepIndex === index
                        ? "border-primary"
                        : "border-muted-foreground",
                  )}
                >
                  {currentStepIndex > index ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className="text-xs mt-2 text-center hidden sm:block">
                  {step.metadata.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{currentStep.metadata.title}</CardTitle>
          <CardDescription>
            {currentStep.metadata.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <Tabs value={currentStep.metadata.id} className="w-full">
                <TabsContent value={currentStep.metadata.id}>
                  <StepComponent control={form.control} />
                </TabsContent>
              </Tabs>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={currentStepIndex === 0 ? onCancel : handlePrevious}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {currentStepIndex === 0 ? "취소" : "이전"}
                </Button>

                {currentStepIndex < FORM_STEPS.length - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    다음
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="button" onClick={handleSubmitClick} disabled={isSubmitting}>
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
