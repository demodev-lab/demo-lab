/**
 * @file url.ts
 * @description URL 생성 및 처리 유틸리티 함수들
 *
 * 이 파일은 환경에 따라 동적으로 URL을 생성하는 기능을 제공합니다.
 * 개발환경(localhost), Vercel 배포, 프로덕션 환경을 자동으로 감지하여
 * 적절한 URL을 반환합니다.
 *
 * 주요 기능:
 * 1. 환경별 Base URL 자동 감지
 * 2. 프로토콜(http/https) 자동 추가
 * 3. 매직 링크 콜백 URL 생성
 *
 * @see {@link https://supabase.com/docs/guides/auth/redirect-urls} - Supabase Redirect URLs 공식 문서
 */

/**
 * 현재 환경에 맞는 Base URL을 반환합니다.
 *
 * 우선순위:
 * 1. NEXT_PUBLIC_SITE_URL (프로덕션에서 설정)
 * 2. NEXT_PUBLIC_VERCEL_URL (Vercel에서 자동 설정)
 * 3. http://localhost:3000/ (개발환경 폴백)
 *
 * @returns {string} 완전한 Base URL (프로토콜 포함, 끝에 / 포함)
 */
export function getURL(): string {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // 프로덕션에서 설정
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Vercel에서 자동 설정
    "http://localhost:3000/"; // 개발환경 폴백

  // localhost가 아닌 경우 https:// 프로토콜 추가
  url = url.startsWith("http") ? url : `https://${url}`;

  // 끝에 / 추가
  url = url.endsWith("/") ? url : `${url}/`;

  return url;
}

/**
 * 매직 링크 인증 콜백 URL을 생성합니다.
 *
 * @returns {string} 인증 콜백 완전 URL
 */
export function getAuthCallbackURL(): string {
  return `${getURL()}auth/callback`;
}

/**
 * 특정 경로에 대한 완전 URL을 생성합니다.
 *
 * @param {string} path - Base URL에 추가할 경로 (시작에 / 포함하지 않음)
 * @returns {string} 완전 URL
 */
export function getAbsoluteURL(path: string): string {
  const baseURL = getURL();
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${baseURL}${cleanPath}`;
}
