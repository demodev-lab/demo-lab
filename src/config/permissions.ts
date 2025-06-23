import { Role } from "@/types/auth";

/**
 * 🎯 모든 권한의 단일 진실 공급원 (Single Source of Truth)
 * API와 클라이언트가 모두 이 설정을 사용합니다.
 *
 * 권한 레벨:
 * - GUEST: 로그인하지 않은 사용자 (레벨 0)
 * - USER: 일반 사용자 (레벨 1)
 * - MANAGER: 관리자 (레벨 2)
 * - ADMIN: 최고 관리자 (레벨 3)
 */

/**
 * Admin 메뉴 구성 - 권한과 연결된 실제 데이터
 */
export const ADMIN_MENU = [
  {
    key: "dashboard",
    label: "📊 대시보드",
  },
  {
    key: "user",
    label: "👥 사용자 관리",
  },
  {
    key: "lecture",
    label: "📚 코스 관리",
  },
  {
    key: "community",
    label: "💬 커뮤니티 관리",
  },
  {
    key: "settings",
    label: "⚙️ 시스템 설정",
  },
] as const;
