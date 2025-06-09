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
 *
 * 구현 로직:
 * - 모든 요청에 대해 updateSession 함수를 실행
 * - 정적 파일, 이미지 최적화, favicon 등 특정 경로는 미들웨어 처리에서 제외
 *
 * @dependencies
 * - next/server
 * - @/utils/supabase/middleware
 */

import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { canViewManagerContent } from "@/utils/permissions/permissions";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // 1. Supabase 세션 업데이트
  const response = await updateSession(request);

  // 2. Admin 페이지 권한 체크
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const adminCheck = await checkAdminAccess(request);
    if (adminCheck) return adminCheck; // 리다이렉트 필요시
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

/**
 * Admin 페이지 접근 권한을 체크하는 미들웨어
 * @param request - NextRequest 객체
 * @returns 리다이렉트가 필요하면 NextResponse, 통과하면 null
 */
export async function checkAdminAccess(
  request: NextRequest,
): Promise<NextResponse | null> {
  // Supabase 클라이언트 생성
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // 미들웨어에서는 쿠키 설정 불가 (읽기 전용)
        },
        remove(name: string, options: any) {
          // 미들웨어에서는 쿠키 제거 불가 (읽기 전용)
        },
      },
    },
  );

  try {
    // Manager 이상 권한 체크 (내부에서 자동으로 사용자 권한을 조회함)
    if (!(await canViewManagerContent())) {
      console.log("Admin 접근 차단: 권한 부족");
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log("Admin 접근 허용");
    return null; // 통과
  } catch (error) {
    console.error("Admin 권한 체크 중 오류:", error);
    // 오류 발생 시 홈으로 리다이렉트
    return NextResponse.redirect(new URL("/", request.url));
  }
}
