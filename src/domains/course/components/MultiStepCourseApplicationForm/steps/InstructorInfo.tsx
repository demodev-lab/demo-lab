"use client";

import React from "react";
import { User } from "lucide-react";
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
import { instructorInfoSchema } from "../../../schemas/courseApplicationSchema";
import type { StepConfig, StepProps } from "../types";

// 공유 스키마 사용
const schema = instructorInfoSchema;

// 컴포넌트
function InstructorInfoFields({ control }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
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
        control={control}
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
        control={control}
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
        control={control}
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
    </div>
  );
}

// Step 설정 export
export const InstructorInfoStep: StepConfig = {
  metadata: {
    id: "instructor-info",
    title: "강사 정보",
    description: "강사 프로필을 작성해주세요",
    icon: User,
  },
  component: InstructorInfoFields,
  schema,
  fields: ["instructor_info", "applicant_phone"],
  defaultValues: {
    instructor_info: {
      name: "",
      email: "",
      bio: "",
      experience: "",
      avatar_url: "",
      certifications: [],
    },
    applicant_phone: "",
  },
};