"use client";

import React from "react";
import { DollarSign } from "lucide-react";
import * as z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PricingFields } from "../../form-fields/PricingFields";
import { DatePickerFormField } from "../../form-fields/DatePickerFormField";
import type { CourseApplicationFormData } from "../../../types";
import type { StepConfig, StepProps } from "../types";

// 스키마 정의
const schema = z.object({
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

// 컴포넌트
function PricingInfoFields({ control }: StepProps) {
  return (
    <div className="space-y-4">
      <PricingFields control={control} />

      <FormField
        control={control}
        name="target_audience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>대상 수강생</FormLabel>
            <FormControl>
              <Textarea
                placeholder="이 코스가 도움이 될 수 있는 사람들을 구체적으로 설명해주세요"
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="expected_duration_weeks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>예상 수강 기간 (주)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={52}
                  placeholder="예: 8"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DatePickerFormField<
          CourseApplicationFormData,
          "course_start_date"
        >
          control={control}
          name="course_start_date"
          label="코스 시작 예정일"
          placeholder="날짜를 선택하세요"
        />
      </div>

      <FormField
        control={control}
        name="additional_materials"
        render={({ field }) => (
          <FormItem>
            <FormLabel>추가 학습 자료</FormLabel>
            <FormControl>
              <Textarea
                placeholder="코스와 함께 제공되는 추가 자료나 리소스를 설명해주세요"
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="additional_message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>관리자에게 전달할 메시지</FormLabel>
            <FormControl>
              <Textarea
                placeholder="코스 검토 시 참고할 추가 정보나 요청사항을 작성해주세요"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// Step 설정 export
export const PricingInfoStep: StepConfig = {
  metadata: {
    id: "pricing-info",
    title: "가격 및 추가 정보",
    description: "가격 정책과 추가 정보를 입력해주세요",
    icon: DollarSign,
  },
  component: PricingInfoFields,
  schema,
  fields: ["price_info", "target_audience", "expected_duration_weeks", "course_start_date", "additional_materials", "additional_message"],
  defaultValues: {
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
};