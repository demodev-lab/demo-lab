import { Role } from "@/types/auth";
import type { Post } from "../types";
import type { ExtendedComment } from "../types/index";

/**
 * 게시글 수정 권한 체크
 */
export const canEditPost = (
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
};

/**
 * 게시글 삭제 권한 체크
 */
export const canDeletePost = (
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
};

/**
 * 댓글 수정 권한 체크
 */
export const canEditComment = (
  comment: ExtendedComment,
  userRole: Role | null,
  authUserId: string | null,
): boolean => {
  if (!userRole || !authUserId) return false;
  if (comment.status !== "active") return false;
  return (
    userRole === Role.ADMIN ||
    userRole === Role.MANAGER ||
    comment.author_id === authUserId
  );
};

/**
 * 댓글 삭제 권한 체크
 */
export const canDeleteComment = (
  comment: ExtendedComment,
  userRole: Role | null,
  authUserId: string | null,
): boolean => {
  if (!userRole || !authUserId) return false;
  if (comment.status !== "active") return false;
  return (
    userRole === Role.ADMIN ||
    userRole === Role.MANAGER ||
    comment.author_id === authUserId
  );
};
