"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { formSchema, stepSchemas } from "./schemas";
import { STEPS, DEFAULT_FORM_VALUES, type StepNumber } from "./constants";
import { Step1BasicInfo } from "./steps/Step1BasicInfo";
import { Step2InstructorInfo } from "./steps/Step2InstructorInfo";
import { Step3Curriculum } from "./steps/Step3Curriculum";
import { Step4PricingInfo } from "./steps/Step4PricingInfo";

// Props 타입
interface MultiStepCourseApplicationFormProps {
  userId: string;
  userEmail?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MultiStepCourseApplicationForm({
  userId,
  userEmail,
  onSuccess,
  onCancel,
}: MultiStepCourseApplicationFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CourseApplicationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...DEFAULT_FORM_VALUES,
      instructor_info: {
        ...DEFAULT_FORM_VALUES.instructor_info,
        email: userEmail || "",
      },
    },
  });

  const progress = (currentStep / STEPS.length) * 100;

  // 단계별 유효성 검증
  const validateCurrentStep = async () => {
    // 현재 단계의 스키마에서 필드 목록 추출
    const currentSchema = stepSchemas[currentStep];
    const fieldsToValidate = Object.keys(
      currentSchema.shape,
    ) as (keyof CourseApplicationFormData)[];

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep((currentStep + 1) as StepNumber);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as StepNumber);
    }
  };

  const onSubmit = async (values: CourseApplicationFormData) => {
    setIsSubmitting(true);
    try {
      console.group("코스 신청 폼 제출");
      console.log("현재 스텝:", currentStep);
      console.log("폼 데이터:", values);
      console.groupEnd();

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

  // Step 컴포넌트 렌더링
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo control={form.control} />;
      case 2:
        return <Step2InstructorInfo control={form.control} />;
      case 3:
        return <Step3Curriculum control={form.control} />;
      case 4:
        return <Step4PricingInfo control={form.control} />;
      default:
        return null;
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Step 4에서만 실제 폼 제출
    if (currentStep === STEPS.length) {
      form.handleSubmit(onSubmit)(e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-4">
          {STEPS.map((step) => (
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
          <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {STEPS[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <Tabs value={`step-${currentStep}`} className="w-full">
                <TabsContent value={`step-${currentStep}`}>
                  {renderStepContent()}
                </TabsContent>
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

                {currentStep < STEPS.length ? (
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
