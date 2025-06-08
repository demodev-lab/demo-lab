import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { canViewManagerContent } from "@/utils/permissions/permissions";

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
