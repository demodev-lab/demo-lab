"use client";

import React from "react";
import { Control } from "react-hook-form";
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
import type { CourseApplicationFormData } from "../../../types";

interface Step2InstructorInfoProps {
  control: Control<CourseApplicationFormData>;
}

export function Step2InstructorInfo({ control }: Step2InstructorInfoProps) {
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
            <FormDescription>최소 50자 이상 작성해주세요</FormDescription>
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
            <FormDescription>최소 30자 이상 작성해주세요</FormDescription>
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
