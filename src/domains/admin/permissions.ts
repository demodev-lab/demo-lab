import { Role } from "@/types/auth";

export const adminPermissions = {
  /**
   * 관리자 페이지 접근 권한 체크
   */
  canAccessAdmin: (userRole: Role | null): boolean => {
    if (!userRole) return false;
    return [Role.ADMIN, Role.MANAGER].includes(userRole);
  },

  /**
   * 사용자 목록 조회 권한 체크
   */
  canViewUsers: (userRole: Role | null): boolean => {
    if (!userRole) return false;
    return userRole === Role.ADMIN || userRole === Role.MANAGER;
  },

  /**
   * 사용자 관리 권한 체크
   */
  canManageUsers: (userRole: Role | null): boolean => {
    if (!userRole) return false;
    return userRole === Role.ADMIN;
  },

  /**
   * 게시글 관리 권한 체크
   */
  canManagePosts: (userRole: Role | null): boolean => {
    if (!userRole) return false;
    return [Role.ADMIN, Role.MANAGER].includes(userRole);
  },

  /**
   * 설정 관리 권한 체크
   */
  canManageSettings: (userRole: Role | null): boolean => {
    if (!userRole) return false;
    return userRole === Role.ADMIN;
  },

  /**
   * 대시보드 조회 권한 체크
   */
  canViewDashboard: (userRole: Role | null): boolean => {
    if (!userRole) return false;
    return [Role.ADMIN, Role.MANAGER].includes(userRole);
  },

  /**
   * 강의 관리 권한 체크
   */
  canManageCourses: (userRole: Role | null): boolean => {
    if (!userRole) return false;
    return [Role.ADMIN, Role.MANAGER].includes(userRole);
  },

  /**
   * 커뮤니티 관리 권한 체크
   */
  canManageCommunity: (userRole: Role | null): boolean => {
    if (!userRole) return false;
    return [Role.ADMIN, Role.MANAGER].includes(userRole);
  },

  /**
   * 결제 관리 권한 체크
   */
  canManagePayments: (userRole: Role | null): boolean => {
    if (!userRole) return false;
    return userRole === Role.ADMIN;
  },
};
