import { Role } from "@/types/auth";
import type { Comment } from "@/domains/comment/types";

export const commentPermission = {
  /**
   * 댓글 수정 가능 여부 체크
   */
  canUpdate(
    comment: Comment,
    userRole: Role | null,
    userId: string | null,
  ): boolean {
    if (!userRole || !userId) return false;
    if (comment.status !== "active") return false;

    return (
      userRole === Role.ADMIN ||
      userRole === Role.MANAGER ||
      comment.author_id === userId
    );
  },

  /**
   * 댓글 삭제 가능 여부 체크
   */
  canDelete(
    comment: Comment,
    userRole: Role | null,
    userId: string | null,
  ): boolean {
    if (!userRole || !userId) return false;
    if (comment.status !== "active") return false;

    return (
      userRole === Role.ADMIN ||
      userRole === Role.MANAGER ||
      comment.author_id === userId
    );
  },
};
