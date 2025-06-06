/**
 * @file buttons.tsx
 * @description 인증 관련 버튼 컴포넌트 모음
 *
 * 이 파일은 로그인, 회원가입, 로그아웃 등 인증 과정에서 사용되는 다양한 버튼 컴포넌트를 정의합니다.
 * 각 버튼은 Supabase 인증 상태 및 폼 상태와 연동됩니다.
 *
 * 주요 컴포넌트:
 * 1. LoginButton: 로그인 폼 제출 버튼 (로딩 상태 포함)
 * 2. SignupButton: 회원가입 폼 제출 버튼 (로딩 상태 및 비밀번호 유효성 검사 연동)
 * 3. LogoutButton: 로그아웃 버튼
 * 4. KakaoButton: 카카오 소셜 로그인 버튼
 * 5. GoogleButton: Google 소셜 로그인 버튼
 *
 * 구현 로직:
 * - `useFormStatus` 훅을 사용하여 폼 제출 상태 관리 (LoginButton, SignupButton)
 * - `createBrowserSupabaseClient`를 사용하여 클라이언트 측 Supabase 인증 로직 수행 (LogoutButton, KakaoButton)
 * - `signInWithOAuth` 메서드를 사용하여 소셜 로그인 처리 (KakaoButton)
 * - 라우팅 처리를 위해 `next/navigation`의 `useRouter` 사용
 * - 인증 상태는 AuthProvider의 onAuthStateChange 이벤트에 의해 관리됨
 *
 * @dependencies
 * - react
 * - next/navigation
 * - react-dom (useFormStatus)
 * - @/components/ui/button (ShadcnUI Button)
 * - @/utils/supabase/client
 * - @supabase/supabase-js (signInWithOAuth)
 *
 * 실제 로그인 흐름
 * 1. 사용자가 로그인 버튼 클릭
 * 2. 서버 액션 시작 → pending = true
 * 3. 서버 액션 완료 → pending = false
 * 4. 로그인 성공 시 → setIsLoading(true) 설정
 * 5. refreshUser() 호출 및 완료
 * 6. 리다이렉트 시작
 * 7. (리다이렉트 후) → isLoading = false(새 페이지에서 리셋)
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { sendMagicLink } from "@/actions/auth";

export function LoginButton({ isLoading }: { isLoading?: boolean }) {
  const { pending } = useFormStatus();
  const loading = isLoading || pending;

  return (
    <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          로그인 중...
        </>
      ) : (
        "로그인"
      )}
    </Button>
  );
}

// 회원가입 버튼 컴포넌트
export function SignupButton({
  isPasswordValid,
  isSignupSuccessful,
}: {
  isPasswordValid: boolean;
  isSignupSuccessful?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full h-12 text-lg"
      disabled={!isPasswordValid || isSignupSuccessful || pending}
    >
      {pending
        ? "처리 중..."
        : isSignupSuccessful
          ? "회원가입 완료! 이메일을 확인해주세요."
          : "회원가입"}
    </Button>
  );
}

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.signOut();

      // onAuthStateChange 이벤트가 SIGNED_OUT 이벤트를 발생시키므로
      // AuthProvider에서 자동으로 사용자 상태를 업데이트함
      // 로그인 페이지로 직접 이동
      router.push("/login");
    } catch (error) {
      console.error("로그아웃 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      disabled={loading}
      className={className}
    >
      {loading ? "로그아웃 중..." : "로그아웃"}
    </Button>
  );
}

export function KakaoButton() {
  const [loading, setLoading] = useState(false);

  const handleKakaoLogin = async () => {
    try {
      setLoading(true);
      const supabase = createBrowserSupabaseClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("카카오 로그인 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleKakaoLogin}
      disabled={loading}
      className="
        w-full
        h-12
        rounded-md
        bg-[#FEE500]
        hover:bg-[#F2D900]
        text-[#191919]
        font-medium
        flex
        items-center
        justify-center
        transition-colors
        duration-200
        border-0
        relative
        px-0
        py-0
      "
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>로그인 중...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <svg width="18" height="18" viewBox="0 0 18 18" className="mr-2">
            <g fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 0.5C4.30375 0.5 0.5 3.4375 0.5 7.0625C0.5 9.3 2.05687 11.2688 4.32937 12.25C4.17625 12.7781 3.68937 14.3938 3.6025 14.8187C3.49812 15.3781 3.78062 15.3719 4.00187 15.2219C4.18 15.1 5.94937 13.85 6.59312 13.3781C7.35375 13.5062 8.15875 13.625 9 13.625C13.6962 13.625 17.5 10.6875 17.5 7.0625C17.5 3.4375 13.6962 0.5 9 0.5Z"
                fill="#191919"
              />
            </g>
          </svg>
          <span className="text-[15px] leading-[1.4]">카카오 로그인</span>
        </div>
      )}
    </Button>
  );
}

export function GoogleButton() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const supabase = createBrowserSupabaseClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Google 로그인 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="
        w-full
        h-12
        rounded-md
        bg-white
        hover:bg-gray-50
        text-gray-900
        font-medium
        flex
        items-center
        justify-center
        transition-colors
        duration-200
        border
        border-gray-300
        hover:border-gray-400
        relative
        px-0
        py-0
      "
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>로그인 중...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <svg width="18" height="18" viewBox="0 0 48 48" className="mr-2">
            <path
              fill="#fbc02d"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20 s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#e53935"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4caf50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1565c0"
              d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          <span className="text-[15px] leading-[1.4]">Google로 계속하기</span>
        </div>
      )}
    </Button>
  );
}

export function MagicLinkButton({
  email,
  onSuccess,
}: {
  email: string;
  onSuccess?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // 쿨다운 타이머
  const startCooldown = () => {
    setCooldown(60);
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleMagicLinkClick = async () => {
    if (!email || cooldown > 0) return;

    try {
      setIsLoading(true);

      // 폼 데이터 생성
      const formData = new FormData();
      formData.set("email", email);

      // sendMagicLink 서버 액션 호출
      const result = await sendMagicLink(null, formData);

      if (result.success) {
        startCooldown(); // 쿨다운 시작
        onSuccess?.(); // 성공 콜백 호출
      } else {
        console.error("매직 링크 전송 실패:", result.error);
        // 여기서 toast나 alert로 에러 표시 가능
      }
    } catch (error) {
      console.error("매직 링크 버튼 에러:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = !email || isLoading || cooldown > 0;

  return (
    <Button
      type="button"
      onClick={handleMagicLinkClick}
      disabled={isDisabled}
      className="
        w-full
        h-12
        rounded-md
        bg-gradient-to-r
        from-purple-500
        to-pink-500
        hover:from-purple-600
        hover:to-pink-600
        text-white
        font-medium
        flex
        items-center
        justify-center
        transition-all
        duration-200
        border-0
        relative
        px-0
        py-0
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>전송 중...</span>
        </div>
      ) : cooldown > 0 ? (
        <div className="flex items-center justify-center">
          <span>재전송 가능 ({cooldown}초)</span>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span>매직 링크로 로그인</span>
        </div>
      )}
    </Button>
  );
}
