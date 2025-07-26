"use client";

import React from "react";
import { DollarSign } from "lucide-react";
import { useWatch } from "react-hook-form";
import * as z from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DatePickerFormField } from "../../form-fields/DatePickerFormField";
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
  // 무료 여부 감시
  const isFree = useWatch({
    control,
    name: "price_info.is_free",
  });

  // 숫자 입력 핸들러 (빈 값 허용)
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number | undefined) => void,
  ) => {
    const value = e.target.value;
    if (value === "") {
      onChange(undefined);
    } else {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 가격 설정 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">가격 설정</h3>

        <FormField
          control={control}
          name="price_info.is_free"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">무료 코스</FormLabel>
                <FormDescription>
                  이 코스를 무료로 제공하시겠습니까?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 가격 정보 필드 (유료인 경우만) */}
        {!isFree && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="price_info.original_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>정가</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          min={0}
                          placeholder="0"
                          value={field.value ?? ""}
                          onChange={(e) => handleNumberChange(e, field.onChange)}
                          className="pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          원
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="price_info.sale_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>판매가</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          min={0}
                          placeholder="0"
                          value={field.value ?? ""}
                          onChange={(e) => handleNumberChange(e, field.onChange)}
                          className="pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          원
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      할인가를 적용하려면 정가보다 낮은 금액을 입력하세요
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DatePickerFormField
              control={control}
              name="price_info.promotion_end_date"
              label="프로모션 종료일 (선택)"
              description="할인가 적용이 종료되는 날짜"
              placeholder="프로모션 종료일을 선택하세요"
              disablePastDates
            />
          </>
        )}
      </div>

      {/* 추가 정보 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">추가 정보</h3>

        <FormField
          control={control}
          name="target_audience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>대상 수강생</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="이 코스가 도움이 될 수 있는 대상을 구체적으로 설명해주세요"
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
                    placeholder="4"
                    value={field.value ?? ""}
                    onChange={(e) => handleNumberChange(e, field.onChange)}
                  />
                </FormControl>
                <FormDescription>
                  권장 학습 속도로 진행 시 예상 기간
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <DatePickerFormField
            control={control}
            name="course_start_date"
            label="코스 시작일 (선택)"
            placeholder="날짜 선택"
            disablePastDates
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
                  placeholder="코스와 함께 제공되는 추가 자료가 있다면 설명해주세요 (예: 실습 파일, PDF 자료 등)"
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
                  placeholder="코스 승인 검토 시 참고할 사항이나 특별한 요청사항이 있다면 작성해주세요"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
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