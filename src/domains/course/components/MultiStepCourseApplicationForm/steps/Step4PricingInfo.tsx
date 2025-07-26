"use client";

import React from "react";
import { Control } from "react-hook-form";
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

interface Step4PricingInfoProps {
  control: Control<CourseApplicationFormData>;
}

export function Step4PricingInfo({ control }: Step4PricingInfoProps) {
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
                      e.target.value ? parseInt(e.target.value) : undefined,
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DatePickerFormField<CourseApplicationFormData, "course_start_date">
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
