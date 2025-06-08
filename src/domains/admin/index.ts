// Types
export type {
  FormState,
  AdminMenuItem,
  AdminPermissions,
  StatCard,
} from "./types";

// Permissions
export {
  checkUserPermission,
  canViewUsers,
  canUpdateUserRole,
  canManageCourses,
  canManageCommunity,
  canManagePayments,
  canViewDashboard,
} from "@/utils/permissions/permissions";

// Hooks
export { usePermission } from "@/hooks/use-permission";

// Actions
export { createCategory } from "./actions/category";
export { createTag } from "./actions/tag";

// Middleware
export { checkAdminAccess } from "./middleware";

// Components
export { UserManagement } from "./components/UserManagement";
