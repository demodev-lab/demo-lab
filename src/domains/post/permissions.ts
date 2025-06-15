import { Role } from "@/types/auth";
import { Post } from "./types";

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
