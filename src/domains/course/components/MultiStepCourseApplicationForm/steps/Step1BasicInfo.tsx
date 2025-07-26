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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseCategorySelect } from "@/domains/category/components";
import type { CourseApplicationFormData } from "../../../types";

interface Step1BasicInfoProps {
  control: Control<CourseApplicationFormData>;
}

export function Step1BasicInfo({ control }: Step1BasicInfoProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>코스 제목 *</FormLabel>
            <FormControl>
              <Input placeholder="예: React 기초부터 실전까지" {...field} />
            </FormControl>
            <FormDescription>
              수강생들이 쉽게 이해할 수 있는 명확한 제목을 입력해주세요
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
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
        control={control}
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
            <FormDescription>최소 50자 이상 작성해주세요</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>난이도 *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="난이도를 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="입문">입문</SelectItem>
                  <SelectItem value="초급">초급</SelectItem>
                  <SelectItem value="중급">중급</SelectItem>
                  <SelectItem value="고급">고급</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
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
        control={control}
        name="thumbnail_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>썸네일 이미지 URL</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/image.jpg" {...field} />
            </FormControl>
            <FormDescription>
              코스를 대표하는 이미지 URL (선택사항)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
