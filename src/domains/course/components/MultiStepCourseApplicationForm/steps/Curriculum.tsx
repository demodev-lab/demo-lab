"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import * as z from "zod";
import { CurriculumFields } from "../../form-fields/CurriculumFields";
import type { StepConfig, StepProps } from "../types";

// 스키마 정의
const schema = z.object({
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

// Step 설정 export
export const CurriculumStep: StepConfig = {
  metadata: {
    id: "curriculum",
    title: "커리큘럼",
    description: "학습 목표와 커리큘럼을 구성해주세요",
    icon: BookOpen,
  },
  component: CurriculumFields,
  schema,
  fields: ["learning_goals", "background_knowledge", "modules_plan"],
  defaultValues: {
    learning_goals: [],
    background_knowledge: [],
    modules_plan: [],
  },
};