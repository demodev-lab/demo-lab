import { Role } from "@/types/auth";
import type { ExtendedComment } from "@/domains/comment/types";

export const commentPermission = {
  /**
   * 댓글 수정 가능 여부 체크
   */
  canUpdate(
    comment: ExtendedComment,
    userRole: Role | null,
    userId: string | null,
  ): boolean {
    if (!userRole || !userId) return false;
    // soft_deleted 상태인 댓글은 수정 불가
    if (comment.status === "soft_deleted") return false;

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
    comment: ExtendedComment,
    userRole: Role | null,
    userId: string | null,
  ): boolean {
    if (!userRole || !userId) return false;
    // soft_deleted 상태인 댓글은 삭제 불가
    if (comment.status === "soft_deleted") return false;

    return (
      userRole === Role.ADMIN ||
      userRole === Role.MANAGER ||
      comment.author_id === userId
    );
  },
};
