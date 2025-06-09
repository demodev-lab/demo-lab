/**
 * @file schema.ts
 * @description 로그인 및 회원가입 유효성 검사 스키마
 *
 * 이 파일은 로그인 및 회원가입 폼의 유효성 검사를 위한 Zod 스키마를 정의합니다.
 * 이메일 및 비밀번호에 대한 유효성 검사 규칙을 설정합니다.
 *
 * 주요 기능:
 * 1. 로그인 폼 유효성 검사 스키마 정의
 * 2. 회원가입 폼 유효성 검사 스키마 정의 (강화된 비밀번호 요구사항)
 * 3. 유효성 검사 결과에 따른 오류 메시지 설정
 * 4. 타입 안전성을 위한 타입 정의
 *
 * 구현 로직:
 * - Zod 라이브러리를 사용한 스키마 정의
 * - 이메일 형식 검증 규칙 적용
 * - 비밀번호 요구사항 검증 (isPasswordValid 유틸리티 활용)
 * - 오류 메시지의 다국어 지원 (한국어)
 * - 스키마 타입을 추론하여 타입 정의 생성
 *
 * @dependencies
 * - zod
 * - @/components/auth/password-requirements (비밀번호 요구사항 검증 유틸리티)
 */

import { z } from "zod";
import { isPasswordValid } from "@/components/auth/password-requirements";

// 로그인 폼 스키마
export const loginSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

// 회원가입 폼 스키마 - requirements.tsx의 검증 로직 활용
export const signupSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요.")
    .refine(
      (value) => isPasswordValid(value),
      "비밀번호는 최소 6자 이상이며, 영문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.",
    ),
});

// 매직 링크 폼 스키마
export const magicLinkSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
});

// 입력 타입 정의
export type LoginFormInput = z.infer<typeof loginSchema>;
export type SignupFormInput = z.infer<typeof signupSchema>;
export type MagicLinkFormInput = z.infer<typeof magicLinkSchema>;

export enum Role {
  GUEST = "guest",
  USER = "user",
  MANAGER = "manager",
  ADMIN = "admin",
}

export const ROLE_LEVELS = {
  [Role.GUEST]: 0,
  [Role.USER]: 1,
  [Role.MANAGER]: 2,
  [Role.ADMIN]: 3,
} as const;

export const ROLE_BADGE_VARIANTS = {
  [Role.GUEST]: "outline",
  [Role.USER]: "secondary",
  [Role.MANAGER]: "default",
  [Role.ADMIN]: "destructive",
} as const;

export const ROLE_ICONS = {
  [Role.GUEST]: "⚪",
  [Role.USER]: "🟢",
  [Role.MANAGER]: "🟡",
  [Role.ADMIN]: "🔴",
} as const;
