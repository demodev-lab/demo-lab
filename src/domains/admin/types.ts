import { Role } from "@/types/auth";

export type AdminTab =
  | "dashboard"
  | "user"
  | "lecture"
  | "community"
  | "settings";

export interface AdminMenuItem {
  key: AdminTab;
  label: string;
  requiredRole: Role;
  description: string;
}

export interface AdminSidebarProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  userRole?: Role | null;
}
