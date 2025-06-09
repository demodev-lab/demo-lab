import { usePermission } from "@/hooks/use-permission";
import { useAuth } from "@/components/auth/auth-provider";
import { canEditPost, canDeletePost } from "../permissions";
import type { Post } from "../types";

export const useCommunityPermissions = () => {
  const { userRole, isLoading: permissionLoading } = usePermission();
  const { user: authUser } = useAuth();

  const checkCanEditPost = (post: Post) => {
    return canEditPost(post, userRole, authUser?.id || null);
  };

  const checkCanDeletePost = (post: Post) => {
    return canDeletePost(post, userRole, authUser?.id || null);
  };

  return {
    userRole,
    authUser,
    permissionLoading,
    canEditPost: checkCanEditPost,
    canDeletePost: checkCanDeletePost,
  };
};
