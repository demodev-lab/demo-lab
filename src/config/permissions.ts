import { Role, ROLE_LEVELS } from "@/types/auth";
import { Post } from "@/domains/post/types";
import { AdminMenuItem } from "@/domains/admin/types";

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
export const ADMIN_MENU: AdminMenuItem[] = [
  {
    key: "dashboard",
    label: "대시보드",
    requiredRole: Role.USER, // USER 이상 접근 가능
    description: "시스템 전반의 현황을 확인할 수 있습니다.",
  },
  {
    key: "user",
    label: "사용자 관리",
    requiredRole: Role.ADMIN, // admin만 접근 가능
    description: "사용자 권한 및 계정을 관리합니다.",
  },
  {
    key: "lecture",
    label: "코스 관리",
    requiredRole: Role.MANAGER, // MANAGER 이상 접근 가능
    description: "코스를 생성하고 관리합니다.",
  },
  {
    key: "community",
    label: "커뮤니티 관리",
    requiredRole: Role.MANAGER, // manager 이상 접근 가능
    description: "커뮤니티 게시글과 댓글을 관리합니다.",
  },
  {
    key: "settings",
    label: "시스템 설정",
    requiredRole: Role.ADMIN, // admin만 접근 가능
    description: "시스템 전반의 설정을 관리합니다.",
  },
];

export const adminPermissions = {
  // 역할 기반 권한 체크
  hasMinimumRole: (
    userRole: Role | undefined | null,
    requiredRole: Role,
  ): boolean => {
    if (!userRole) return false;
    const userLevel = ROLE_LEVELS[userRole] ?? 0;
    const requiredLevel = ROLE_LEVELS[requiredRole] ?? 0;
    return userLevel >= requiredLevel;
  },

  // 어드민 페이지 접근 권한 체크
  canAccessAdmin: (userRole: Role | undefined | null): boolean => {
    return adminPermissions.hasMinimumRole(userRole, Role.USER);
  },

  // 특정 메뉴 접근 권한 체크
  canAccessMenu: (
    userRole: Role | undefined | null,
    menuKey: string,
  ): boolean => {
    const menu = ADMIN_MENU.find((item) => item.key === menuKey);
    if (!menu) return false;
    return adminPermissions.hasMinimumRole(userRole, menu.requiredRole);
  },

  /**
   * 사용자 목록 조회 권한 체크
   */
  canViewUsers: (userRole: Role | undefined | null): boolean => {
    return adminPermissions.hasMinimumRole(userRole, Role.ADMIN);
  },

  /**
   * 사용자 관리 권한 체크
   */
  canManageUsers: (userRole: Role | undefined | null): boolean => {
    return adminPermissions.hasMinimumRole(userRole, Role.ADMIN);
  },

  /**
   * 게시글 관리 권한 체크
   */
  canManagePosts: (userRole: Role | undefined | null): boolean => {
    return adminPermissions.hasMinimumRole(userRole, Role.MANAGER);
  },

  /**
   * 설정 관리 권한 체크
   */
  canManageSettings: (userRole: Role | undefined | null): boolean => {
    return adminPermissions.hasMinimumRole(userRole, Role.ADMIN);
  },

  /**
   * 대시보드 조회 권한 체크
   */
  canViewDashboard: (userRole: Role | undefined | null): boolean => {
    return adminPermissions.hasMinimumRole(userRole, Role.USER);
  },

  /**
   * 강의 관리 권한 체크
   */
  canManageCourses: (userRole: Role | undefined | null): boolean => {
    return adminPermissions.hasMinimumRole(userRole, Role.MANAGER);
  },

  /**
   * 커뮤니티 관리 권한 체크
   */
  canManageCommunity: (userRole: Role | undefined | null): boolean => {
    return adminPermissions.hasMinimumRole(userRole, Role.MANAGER);
  },

  /**
   * 결제 관리 권한 체크
   */
  canManagePayments: (userRole: Role | undefined | null): boolean => {
    return adminPermissions.hasMinimumRole(userRole, Role.ADMIN);
  },
};

export const postPermissions = {
  /**
   * 게시글 수정 권한 체크
   */
  canEdit: (
    post: Post,
    userRole: Role | null,
    authUserId: string | null,
  ): boolean => {
    if (!userRole || !authUserId) return false;
    return (
      userRole === Role.ADMIN ||
      userRole === Role.MANAGER ||
      post.author_id === authUserId
    );
  },

  /**
   * 게시글 삭제 권한 체크
   */
  canDelete: (
    post: Post,
    userRole: Role | null,
    authUserId: string | null,
  ): boolean => {
    if (!userRole || !authUserId) return false;
    return (
      userRole === Role.ADMIN ||
      userRole === Role.MANAGER ||
      post.author_id === authUserId
    );
  },

  /**
   * 게시글 작성 권한 체크
   */
  canCreate: (userRole: Role | null): boolean => {
    if (!userRole) return false;
    return [Role.ADMIN, Role.MANAGER, Role.USER].includes(userRole);
  },

  /**
   * 게시글 조회 권한 체크
   */
  canView: (userRole: Role | null): boolean => {
    if (!userRole) return false;
    return [Role.ADMIN, Role.MANAGER, Role.USER].includes(userRole);
  },
};
