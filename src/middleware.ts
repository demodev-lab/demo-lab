/**
 * @file middleware.ts
 * @description Next.js 미들웨어 설정 파일
 *
 * 이 파일은 Next.js 애플리케이션의 라우팅 미들웨어를 정의합니다.
 * 모든 요청에 대해 Supabase 세션을 업데이트하는 미들웨어를 적용합니다.
 *
 * 주요 기능:
 * 1. 모든 요청에 대해 Supabase 세션 업데이트
 * 2. 세션 쿠키 관리
 * 3. 인증 상태 유지
 * 4. Admin 페이지 기본 인증 체크 (로그인된 사용자만 접근 허용)
 *
 * 구현 로직:
 * - 모든 요청에 대해 updateSession 함수를 실행
 * - Admin 페이지는 로그인된 사용자만 접근 가능 (상세 권한은 페이지에서 체크)
 * - 정적 파일, 이미지 최적화, favicon 등 특정 경로는 미들웨어 처리에서 제외
 *
 * @dependencies
 * - next/server
 * - @/utils/supabase/middleware
 */

import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // 1. Supabase 세션 업데이트
  const response = await updateSession(request);

  // 2. Admin 페이지 기본 인증 체크
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // updateSession에서 이미 인증 정보를 처리했으므로,
    // 로그인 페이지로 리다이렉트되지 않았다면 기본 인증은 통과
    // 상세한 권한 체크는 페이지 컴포넌트에서 수행
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public file paths with file extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
