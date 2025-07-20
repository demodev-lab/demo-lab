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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DynamicListField } from "./DynamicListField";
import type { CourseApplicationFormData } from "../../types";

interface CurriculumFieldsProps {
  control: Control<CourseApplicationFormData>;
}

// 타입 안전한 경로 생성을 위한 헬퍼 타입
type ModuleLecturesPath = `modules_plan.${number}.lectures`;

export function CurriculumFields({ control }: CurriculumFieldsProps) {
  // 학습 목표 필드
  const learningGoalsField = (
    <DynamicListField
      control={control}
      name="learning_goals"
      label="학습 목표"
      description="이 코스를 통해 학습자가 달성할 수 있는 구체적인 목표를 작성해주세요"
      minItems={3}
      maxItems={10}
      newItemTemplate={() => ({
        id: crypto.randomUUID(),
        content: "",
        sequence: 0,
      })}
      renderItem={(field, index) => (
        <FormField
          control={control}
          name={`learning_goals.${index}.content`}
          render={({ field: inputField }) => (
            <FormItem>
              <FormLabel>학습 목표 {index + 1}</FormLabel>
              <FormControl>
                <Input
                  placeholder="예: React의 기본 개념을 이해하고 간단한 컴포넌트를 만들 수 있다"
                  {...inputField}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    />
  );

  // 선수 지식 필드
  const backgroundKnowledgeField = (
    <DynamicListField
      control={control}
      name="background_knowledge"
      label="선수 지식"
      description="이 코스를 수강하기 전에 알아야 할 사전 지식"
      minItems={0}
      maxItems={5}
      newItemTemplate={() => ({
        id: crypto.randomUUID(),
        content: "",
        sequence: 0,
      })}
      renderItem={(field, index) => (
        <FormField
          control={control}
          name={`background_knowledge.${index}.content`}
          render={({ field: inputField }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="예: HTML/CSS 기초 지식" {...inputField} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    />
  );

  // 중첩된 강의 목록을 렌더링하는 별도 컴포넌트
  const renderModuleLectures = (moduleIndex: number) => {
    const lecturesPath =
      `modules_plan.${moduleIndex}.lectures` as ModuleLecturesPath;

    return (
      <DynamicListField
        control={control}
        name={lecturesPath}
        label="강의 목록"
        description="이 모듈에 포함될 강의들"
        minItems={1}
        maxItems={20}
        newItemTemplate={() => ({
          id: crypto.randomUUID(),
          title: "",
          description: "",
          duration_mins: 30,
          sequence: 0,
          access_type: "paid" as const,
        })}
        renderItem={(lecture, lectureIndex) => (
          <div className="space-y-3">
            <FormField
              control={control}
              name={`modules_plan.${moduleIndex}.lectures.${lectureIndex}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>강의 제목</FormLabel>
                  <FormControl>
                    <Input placeholder="예: 컴포넌트와 Props" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`modules_plan.${moduleIndex}.lectures.${lectureIndex}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>강의 설명 (선택)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="강의 내용을 간략히 설명해주세요"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`modules_plan.${moduleIndex}.lectures.${lectureIndex}.duration_mins`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>예상 시간 (분)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={5}
                        max={180}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`modules_plan.${moduleIndex}.lectures.${lectureIndex}.access_type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>접근 권한</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="free">
                          <Badge variant="secondary">무료</Badge>
                        </SelectItem>
                        <SelectItem value="preview">
                          <Badge variant="outline">미리보기</Badge>
                        </SelectItem>
                        <SelectItem value="paid">
                          <Badge>유료</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      />
    );
  };

  // 모듈 계획 필드
  const modulesField = (
    <DynamicListField
      control={control}
      name="modules_plan"
      label="모듈 구성"
      description="코스를 구성하는 모듈과 각 모듈의 강의를 계획해주세요"
      minItems={1}
      maxItems={20}
      newItemTemplate={() => ({
        id: crypto.randomUUID(),
        title: "",
        sequence: 0,
        lectures: [],
      })}
      renderItem={(field, moduleIndex) => (
        <div className="space-y-4">
          <FormField
            control={control}
            name={`modules_plan.${moduleIndex}.title`}
            render={({ field: titleField }) => (
              <FormItem>
                <FormLabel>모듈 제목</FormLabel>
                <FormControl>
                  <Input placeholder="예: React 기초" {...titleField} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 강의 목록 */}
          {renderModuleLectures(moduleIndex)}
        </div>
      )}
    />
  );

  return (
    <div className="space-y-6">
      {learningGoalsField}
      {backgroundKnowledgeField}
      {modulesField}
    </div>
  );
}
