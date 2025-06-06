/**
 * @file actions.ts
 * @description 로그인 및 회원가입 서버 액션
 *
 * 이 파일은 Next.js 서버 액션을 사용하여 Supabase 인증 기능을 구현합니다.
 * 로그인 및 회원가입 폼 제출 처리와 유효성 검사를 담당합니다.
 *
 * 주요 기능:
 * 1. 이메일/비밀번호 로그인 폼 처리 및 Supabase 인증
 * 2. 이메일/비밀번호 회원가입 폼 처리 및 계정 생성
 * 3. 폼 유효성 검사 (Zod 스키마 활용)
 * 4. 사용자 친화적 에러 메시지 제공
 * 5. 로그인 성공 시 홈('/경로')으로 리다이렉트 처리
 * 6. 회원가입 성공 시 이메일 확인 안내
 * 7. revalidatePath를 통한 전체 앱 레이아웃 캐시 무효화로 인증 상태 반영
 *
 * 구현 로직:
 * - Next.js의 "use server" 지시문으로 서버 액션 정의
 * - `FormData`에서 사용자 입력 추출 및 유효성 검사 (`zod`)
 * - `@/utils/supabase/server`의 `createServerSupabaseClient`를 사용하여 서버 측 Supabase 클라이언트 생성
 * - `supabase.auth.signInWithPassword` 및 `supabase.auth.signUp` 메서드를 사용하여 인증 요청 처리
 * - 로그인/회원가입 과정에서 발생할 수 있는 다양한 오류 상황 처리 및 커스텀 메시지 반환
 * - 인증 성공/실패 상태를 클라이언트에 전달하기 위한 `ActionState` 타입 정의
 * - `revalidatePath`를 사용하여 전체 앱의 캐시를 무효화하고 인증 상태 변경 즉시 반영
 * - 회원가입 시 이메일 인증을 위한 `emailRedirectTo` 설정
 *
 * @dependencies
 * - next/cache
 * - @/utils/supabase/server
 * - @/types/schema (Zod 유효성 검사 스키마)
 * - @supabase/supabase-js (auth 메서드)
 */

"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { loginSchema, signupSchema, magicLinkSchema } from "@/types/auth";
import { getAuthCallbackURL } from "@/utils/url";

// 액션 함수들의 반환 타입 정의
type ActionState = {
  error: string | null;
  success: string | null;
  shouldRedirect?: boolean;
  redirectTo?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
};

export async function login(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Zod 스키마를 사용한 유효성 검사
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: Record<string, string | undefined> = {};

      // Zod 에러 형식화
      result.error.errors.forEach((error) => {
        const path = error.path[0] as string;
        fieldErrors[path] = error.message;
      });

      return {
        error: "입력 필드를 확인해주세요.",
        success: null,
        fieldErrors,
      };
    }

    // Supabase 클라이언트 생성
    const supabase = await createServerSupabaseClient();

    // 로그인 시도
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // 로그인 오류 처리
    if (error) {
      // 알려진 오류 패턴에 따라 더 친절한 메시지 제공
      let errorMessage = error.message;
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
      }
      if (error.message.includes("Email not confirmed")) {
        errorMessage = "이메일 인증을 완료해주세요.";
      }

      return { error: errorMessage, success: null };
    }

    // 로그인 성공 시 전체 레이아웃을 새로고침하고 리다이렉트 플래그 반환
    if (data.session) {
      // revalidatePath를 사용해 전체 앱의 레이아웃 캐시를 무효화하여 인증 상태 변경 즉시 반영
      // AuthProvider의 onAuthStateChange 이벤트가 발생하기 전에도 UI에 인증 상태가 반영됨
      revalidatePath("/", "layout");

      return {
        success: "로그인 성공!",
        error: null,
        shouldRedirect: true,
        redirectTo: "/",
      };
    }

    // 비정상적인 케이스
    return {
      error: "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      success: null,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      success: null,
    };
  }
}

export async function signup(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Zod 스키마를 사용한 유효성 검사
    const result = signupSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: Record<string, string | undefined> = {};

      // Zod 에러 형식화
      result.error.errors.forEach((error) => {
        const path = error.path[0] as string;
        fieldErrors[path] = error.message;
      });

      return {
        error: "입력 필드를 확인해주세요.",
        success: null,
        fieldErrors,
      };
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
        }/auth/callback`,
      },
    });

    if (error) {
      // 알려진 오류 패턴에 따라 더 친절한 메시지 제공
      let errorMessage = error.message;
      if (error.message.includes("already registered")) {
        errorMessage = "이미 등록된 이메일 주소입니다. 로그인해 주세요.";
      }
      return { error: errorMessage, success: null };
    }

    // Supabase가 error를 반환하지 않고, user.identities가 빈 배열인 경우(이메일 인증 활성화 시)
    if (data?.user && data.user.identities?.length === 0) {
      return {
        error: "이미 등록된 이메일 주소입니다. 로그인해 주세요.",
        success: null,
      };
    }

    return {
      success: "이메일을 확인해주세요.",
      error: null,
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      success: null,
    };
  }
}

export async function sendMagicLink(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const email = formData.get("email") as string;

    console.group("📧 매직 링크 전송 시작");
    console.log("이메일:", email);

    // Zod 스키마를 사용한 유효성 검사
    const result = magicLinkSchema.safeParse({ email });

    if (!result.success) {
      const fieldErrors: Record<string, string | undefined> = {};

      // Zod 에러 형식화
      result.error.errors.forEach((error) => {
        const path = error.path[0] as string;
        fieldErrors[path] = error.message;
      });

      console.log("❌ 유효성 검사 실패:", fieldErrors);
      console.groupEnd();

      return {
        error: "입력 필드를 확인해주세요.",
        success: null,
        fieldErrors,
      };
    }

    const supabase = await createServerSupabaseClient();

    // 동적 콜백 URL 생성
    const emailRedirectTo = getAuthCallbackURL();
    console.log("🔗 콜백 URL:", emailRedirectTo);

    // 매직 링크 전송
    const { error } = await supabase.auth.signInWithOtp({
      email: result.data.email,
      options: {
        emailRedirectTo,
        shouldCreateUser: true, // 사용자가 없으면 자동 생성
      },
    });

    if (error) {
      console.log("❌ Supabase 에러:", error.message);
      console.groupEnd();

      // Supabase 에러 메시지를 사용자 친화적으로 변환
      let errorMessage = "매직 링크 전송에 실패했습니다.";

      if (
        error.message.includes("invalid email") ||
        error.message.includes("Invalid email")
      ) {
        errorMessage = "유효하지 않은 이메일 주소입니다.";
      } else if (
        error.message.includes("rate limit") ||
        error.message.includes("too many requests")
      ) {
        errorMessage =
          "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.";
      }

      return {
        error: errorMessage,
        success: null,
      };
    }

    console.log("✅ 매직 링크 전송 성공");
    console.groupEnd();

    return {
      error: null,
      success: "이메일로 전송된 매직 링크를 확인해주세요!",
    };
  } catch (err) {
    console.log("❌ 예상치 못한 에러:", err);
    console.groupEnd();

    return {
      error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      success: null,
    };
  }
}
