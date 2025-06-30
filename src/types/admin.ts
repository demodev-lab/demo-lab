import { Role } from "@/types/auth";

// Form State 타입
export interface FormState {
  message: string;
  error: boolean;
}

// 관리자 페이지 메뉴 타입
export interface AdminMenuItem {
  id: string;
  label: string;
  description?: string;
  permission: string;
  minRole: Role;
}

// 관리자 권한 타입
export interface AdminPermissions {
  canViewUsers: boolean;
  canManageUsers: boolean;
  canManageCourses: boolean;
  canManageCommunity: boolean;
  canManagePayments: boolean;
  canViewDashboard: boolean;
}

// 통계 카드 타입
export interface StatCard {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}
