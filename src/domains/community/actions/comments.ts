"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { ExtendedComment } from "../types/index";

/**
 * 댓글 생성
 */
export async function createCommentAction(
  postId: number,
  content: string,
  parentId?: number | null,
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  if (!content.trim()) {
    throw new Error("댓글 내용을 입력해주세요.");
  }

  if (content.length > 1000) {
    throw new Error("댓글은 1000자 이하로 입력해주세요.");
  }

  // 대댓글의 경우 부모 댓글이 존재하는지 확인
  if (parentId) {
    const { data: parentComment, error: parentError } = await supabase
      .from("comments")
      .select("id, parent_comment_id")
      .eq("id", parentId)
      .single();

    if (parentError || !parentComment) {
      throw new Error("존재하지 않는 댓글입니다.");
    }

    // 대댓글의 대댓글은 허용하지 않음 (최대 1단계 깊이)
    if (parentComment.parent_comment_id) {
      throw new Error("대댓글의 대댓글은 작성할 수 없습니다.");
    }
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      content: content.trim(),
      author_id: user.id,
      parent_comment_id: parentId || null,
      status: "active",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating comment:", error);
    throw new Error("댓글 작성에 실패했습니다.");
  }

  // 게시글의 댓글 수 업데이트
  const { count, error: countError } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId)
    .eq("status", "active");

  if (!countError && count !== null) {
    await supabase
      .from("posts")
      .update({ comment_count: count })
      .eq("id", postId);
  }

  revalidatePath("/");
  return data;
}

/**
 * 댓글 수정
 */
export async function updateCommentAction(commentId: number, content: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  if (!content.trim()) {
    throw new Error("댓글 내용을 입력해주세요.");
  }

  if (content.length > 1000) {
    throw new Error("댓글은 1000자 이하로 입력해주세요.");
  }

  // 댓글 존재 및 권한 확인
  const { data: comment, error: fetchError } = await supabase
    .from("comments")
    .select("author_id, status")
    .eq("id", commentId)
    .single();

  if (fetchError || !comment) {
    throw new Error("존재하지 않는 댓글입니다.");
  }

  if (comment.status !== "active") {
    throw new Error("삭제된 댓글은 수정할 수 없습니다.");
  }

  // 사용자 권한 확인
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const userRole = profile?.role || null;
  const isAuthor = comment.author_id === user.id;
  const isAdmin = userRole === "admin" || userRole === "manager";

  if (!isAuthor && !isAdmin) {
    throw new Error("댓글을 수정할 권한이 없습니다.");
  }

  const { error } = await supabase
    .from("comments")
    .update({
      content: content.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", commentId);

  if (error) {
    console.error("Error updating comment:", error);
    throw new Error("댓글 수정에 실패했습니다.");
  }

  revalidatePath("/");
}

/**
 * 댓글 삭제
 */
export async function deleteCommentAction(commentId: number) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  // 댓글 존재 및 권한 확인
  const { data: comment, error: fetchError } = await supabase
    .from("comments")
    .select("post_id, children_count")
    .eq("id", commentId)
    .single();

  if (fetchError || !comment) {
    throw new Error("존재하지 않는 댓글입니다.");
  }

  const hasChildren = comment.children_count > 0;

  // 자식 댓글 유무에 따라 다른 RPC 호출
  if (hasChildren) {
    // 소프트 삭제 RPC 호출
    const { error } = await supabase.rpc("soft_delete_comment", {
      p_comment_id: commentId,
    });

    if (error) {
      console.error("Error soft deleting comment:", error);
      throw new Error("댓글 삭제에 실패했습니다.");
    }
  } else {
    // 완전 삭제 RPC 호출
    const { error } = await supabase.rpc("hard_delete_comment", {
      p_comment_id: commentId,
    });

    if (error) {
      console.error("Error deleting comment:", error);
      throw new Error("댓글 삭제에 실패했습니다.");
    }
  }

  // 게시글의 댓글 수 업데이트
  const { count, error: countError } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", comment.post_id)
    .eq("status", "active");

  if (!countError && count !== null) {
    await supabase
      .from("posts")
      .update({ comment_count: count })
      .eq("id", comment.post_id);
  }

  revalidatePath("/");
  revalidatePath(`/community/post/${comment.post_id}`);
}

/**
 * 댓글 좋아요 토글
 */
export async function toggleCommentLikeAction(commentId: number) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("toggle_comment_like", {
    p_comment_id: commentId,
  });

  if (error) {
    console.error("Error toggling comment like:", error);
    throw new Error("좋아요 처리에 실패했습니다.");
  }

  revalidatePath("/");
}

/**
 * 게시글의 댓글 목록 조회
 */
export async function getCommentsAction(
  postId: number,
): Promise<ExtendedComment[]> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 댓글과 작성자 정보 조회 (JOIN 없이 별도 쿼리로 처리)
  const { data: comments, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      is_liked:comment_likes(user_id)
    `,
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error);
    throw new Error("댓글을 불러오는데 실패했습니다.");
  }

  // 모든 작성자 ID 수집
  const authorIds = [
    ...new Set(comments.map((comment: any) => comment.author_id)),
  ];

  // 작성자 정보 별도 조회
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, full_name")
    .in("id", authorIds);

  // 프로필 맵 생성
  const profileMap = new Map();
  profiles?.forEach((profile) => {
    profileMap.set(profile.id, profile);
  });

  // 댓글 데이터 변환 및 계층 구조 생성
  const transformedComments = comments.map((comment: any) => {
    const profile = profileMap.get(comment.author_id);
    return {
      id: comment.id,
      post_id: comment.post_id,
      parent_comment_id: comment.parent_comment_id,
      author_id: comment.author_id,
      content: comment.content,
      author: profile?.full_name || profile?.username || "익명",
      authorUsername: profile?.username || "",
      date: new Date(comment.created_at).toLocaleDateString("ko-KR"),
      likes: comment.like_count || 0,
      status: comment.status,
      isLiked: user ? comment.is_liked.length > 0 : false,
      replies: [],
    };
  });

  // 부모-자식 관계 구성
  const parentComments = transformedComments.filter(
    (comment) => !comment.parent_comment_id,
  );
  const childComments = transformedComments.filter(
    (comment) => comment.parent_comment_id,
  );

  // 자식 댓글을 부모 댓글에 연결
  parentComments.forEach((parent) => {
    parent.replies = childComments.filter(
      (child) => child.parent_comment_id === parent.id,
    );
  });

  return parentComments;
}
