import { Role } from "@/types/auth";

// 권한 설정 타입
export interface PermissionConfig {
  label: string;
  minRole: Role;
  apiEndpoint?: string;
  description?: string;
}

// 중앙 집중식 권한 설정
export const PERMISSIONS = {
  // Admin 기능들
  DASHBOARD: {
    label: "대시보드",
    minRole: Role.MANAGER,
    description: "시스템 통계 및 개요 조회",
  },

  // 회원 관리 세분화
  USER_LIST_VIEW: {
    label: "회원 목록 조회",
    minRole: Role.MANAGER,
    apiEndpoint: "/api/users",
    description: "사용자 목록 조회",
  },
  USER_ROLE_MANAGEMENT: {
    label: "회원 권한 관리",
    minRole: Role.ADMIN,
    description: "사용자 권한 변경",
  },
  USER_MANAGEMENT: {
    label: "회원 관리",
    minRole: Role.MANAGER, // 탭 접근은 Manager도 가능
    description: "사용자 목록 조회 및 권한 관리",
  },

  COURSE_MANAGEMENT: {
    label: "코스 관리",
    minRole: Role.MANAGER,
    description: "강의 코스 생성 및 관리",
  },
  COMMUNITY_MANAGEMENT: {
    label: "커뮤니티 관리",
    minRole: Role.MANAGER,
    description: "게시글, 댓글, 카테고리 관리",
  },
  SYSTEM_SETTINGS: {
    label: "시스템 설정",
    minRole: Role.ADMIN,
    description: "시스템 전체 설정 관리",
  },

  // API별 권한 (확장 가능)
  API_CATEGORIES: {
    label: "카테고리 관리 API",
    minRole: Role.MANAGER,
    apiEndpoint: "/api/categories",
  },
  API_POSTS: {
    label: "게시글 관리 API",
    minRole: Role.MANAGER,
    apiEndpoint: "/api/posts",
  },
} as const;

// Admin 메뉴 설정 (PERMISSIONS에서 자동 생성)
export const ADMIN_MENU = [
  { key: "dashboard", ...PERMISSIONS.DASHBOARD },
  { key: "user", ...PERMISSIONS.USER_MANAGEMENT },
  { key: "lecture", ...PERMISSIONS.COURSE_MANAGEMENT },
  { key: "community", ...PERMISSIONS.COMMUNITY_MANAGEMENT },
  { key: "settings", ...PERMISSIONS.SYSTEM_SETTINGS },
] as const;

// 권한 체크 헬퍼 함수
export function getRequiredRole(feature: keyof typeof PERMISSIONS): Role {
  return PERMISSIONS[feature].minRole;
}

// API 엔드포인트별 권한 맵
export const API_PERMISSIONS = Object.fromEntries(
  Object.entries(PERMISSIONS)
    .filter(([_, config]) => "apiEndpoint" in config && config.apiEndpoint)
    .map(([_, config]) => [(config as any).apiEndpoint, config.minRole]),
);
