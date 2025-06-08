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
export const PERMISSIONS = {
  // 기본 접근 권한
  VIEW_PUBLIC_CONTENT: Role.GUEST, // 공개 게시글 조회 등
  VIEW_MEMBER_CONTENT: Role.USER, // 회원 전용 콘텐츠
  VIEW_MANAGER_CONTENT: Role.MANAGER, // 관리자 전용 콘텐츠

  // 관리자 기능들
  VIEW_DASHBOARD: Role.MANAGER,

  // 사용자 관리
  VIEW_USERS: Role.MANAGER, // API와 클라이언트 모두 사용
  UPDATE_USER_ROLE: Role.ADMIN,

  // 컨텐츠 관리
  MANAGE_COURSES: Role.MANAGER,
  MANAGE_COMMUNITY: Role.MANAGER,

  // 시스템 관리
  MANAGE_PAYMENTS: Role.ADMIN,
} as const;

export type Permission = keyof typeof PERMISSIONS;

/**
 * Admin 메뉴 구성 - 권한과 연결된 실제 데이터
 */
export const ADMIN_MENU = [
  {
    key: "dashboard",
    label: "📊 대시보드",
    permission: "VIEW_DASHBOARD" as Permission,
  },
  {
    key: "user",
    label: "👥 사용자 관리",
    permission: "VIEW_USERS" as Permission,
  },
  {
    key: "lecture",
    label: "📚 코스 관리",
    permission: "MANAGE_COURSES" as Permission,
  },
  {
    key: "community",
    label: "💬 커뮤니티 관리",
    permission: "MANAGE_COMMUNITY" as Permission,
  },
  {
    key: "settings",
    label: "⚙️ 시스템 설정",
    permission: "MANAGE_PAYMENTS" as Permission, // 시스템 설정은 가장 높은 권한 필요
  },
] as const;
