"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { getServerUserProfile } from "@/utils/supabase/profiles";
import type { ExtendedComment } from "@/domains/comment/types";
import { updateCommentCount } from "../../post/actions/postAction";

export async function createComment(
  postId: number,
  content: string,
  parentId?: number | null,
) {
  const supabase = await createServerSupabaseClient();
  const profile = await getServerUserProfile();
  if (!profile) throw new Error("Unauthorized");
  await validateCommentContent(content);
  if (parentId) {
    const { data: parentComment, error: parentError } = await supabase
      .from("comments")
      .select("id, parent_id")
      .eq("id", parentId)
      .single();
    if (parentError || !parentComment)
      throw new Error("존재하지 않는 댓글입니다.");
    if (parentComment.parent_id)
      throw new Error("대댓글의 대댓글은 작성할 수 없습니다.");
  }
  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      content: content.trim(),
      author_id: profile.id,
      parent_id: parentId || null,
    })
    .select()
    .single();
  if (error) throw new Error("댓글 작성에 실패했습니다.");
  await updateCommentCount(postId);
  revalidatePath("/");
  return data;
}

export async function updateComment(commentId: number, content: string) {
  const supabase = await createServerSupabaseClient();
  const profile = await getServerUserProfile();
  if (!profile) throw new Error("Unauthorized");
  await validateCommentContent(content);
  const { data: comment, error } = await supabase
    .from("comments")
    .update({
      content: content.trim(),
      // updated_at is handled by database trigger
    })
    .eq("id", commentId)
    .eq("author_id", profile.id)
    .select()
    .single();
  if (error) throw new Error("댓글 수정에 실패했습니다.");
  revalidatePath("/");
  return comment;
}

export async function deleteComment(commentId: number) {
  const supabase = await createServerSupabaseClient();
  const profile = await getServerUserProfile();
  if (!profile) throw new Error("Unauthorized");
  const { data: comment, error: fetchError } = await supabase
    .from("comments")
    .select("post_id")
    .eq("id", commentId)
    .single();
  if (fetchError || !comment) throw new Error("존재하지 않는 댓글입니다.");
  // Use the delete_comment_rpc function which handles both soft and hard deletes
  const { error } = await supabase.rpc("delete_comment_rpc", {
    comment_id: commentId,
  });
  if (error) throw new Error("댓글 삭제에 실패했습니다.");
  await updateCommentCount(comment.post_id);
  revalidatePath("/");
  revalidatePath(`/community/post/${comment.post_id}`);
}

export async function toggleCommentLike(commentId: number) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("toggle_comment_like_rpc", {
    comment_id_param: commentId,
  });
  if (error) throw new Error("좋아요 처리에 실패했습니다.");
  revalidatePath("/");
}

export async function getCommentList(
  postId: number,
): Promise<ExtendedComment[]> {
  const supabase = await createServerSupabaseClient();
  const profile = await getServerUserProfile();
  const { data: comments, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      author:profiles!author_id(id, full_name, role),
      is_liked:comment_likes(user_id)
    `,
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error)
    throw new Error("댓글을 불러오는데 실패했습니다.", {
      cause: error.message,
    });
  const transformedComments = comments.map((comment: any) => ({
    id: comment.id,
    post_id: comment.post_id,
    parent_comment_id: comment.parent_id,
    author_id: comment.author_id,
    content: comment.content,
    author: comment.author.full_name,
    authorUsername: comment.author.username || "",
    date: new Date(comment.created_at).toLocaleDateString("ko-KR"),
    likes: comment.like_count || 0,
    status: undefined, // Comments don't have status in the database
    isLiked: profile ? comment.is_liked.length > 0 : false,
    replies: [],
  }));
  const parentComments = transformedComments.filter(
    (comment) => !comment.parent_comment_id,
  );
  const childComments = transformedComments.filter(
    (comment) => comment.parent_comment_id,
  );
  parentComments.forEach((parent) => {
    parent.replies = childComments.filter(
      (child) => child.parent_comment_id === parent.id,
    );
  });
  return parentComments;
}

// 댓글 관련 유틸리티
async function validateCommentContent(content: string) {
  if (!content.trim()) {
    throw new Error("댓글 내용을 입력해주세요.");
  }
  if (content.length > 1000) {
    throw new Error("댓글은 1000자 이하로 입력해주세요.");
  }
}
