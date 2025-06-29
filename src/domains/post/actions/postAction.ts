"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { PostFormData, PostWithDetails } from "../types";
import { revalidatePath } from "next/cache";
import { getServerUserProfile } from "@/utils/supabase/profiles";

// DB에서 가져온 raw post 데이터를 클라이언트에서 사용할 수 있는 형태로 변환
function transformPost(post: any, userId?: string): PostWithDetails {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    author_id: post.author_id,
    category_id: post.category_id,
    created_at: post.created_at,
    updated_at: post.updated_at,
    like_count: post.like_count || 0,
    comment_count: post.comment_count || 0,
    view_count: post.view_count || 0,
    is_pinned: post.is_pinned || false,
    author_name: post.author.full_name ?? "익명",
    category_name: post.category?.name ?? "Unknown",
    category_color: post.category?.color ?? "#000000",
    tags: post.tags?.map((t: any) => t.tag) ?? [],
    is_liked: userId
      ? post.post_likes?.some((like: any) => like.user_id === userId)
      : false,
  };
}

// 게시글 목록 조회
// TODO: 필터 파라미터 전달
export async function getPostList(
  page = 1,
  limit = 10,
  categoryId?: number,
  tagIds?: number[],
  sortOption?: string,
  searchQuery?: string,
) {
  console.log("[postAction] Starting getList with params:", {
    page,
    limit,
    categoryId,
    tagIds,
    sortOption,
    searchQuery,
  });
  const supabase = await createServerSupabaseClient();
  const userProfile = await getServerUserProfile();
  console.log("[postAction] Supabase client created");

  const start = (page - 1) * limit;
  const end = start + limit - 1; // range는 inclusive이므로 -1
  console.log("[postAction] Query range:", { start, end });

  let query = supabase.from("posts").select(
    `
      *,
      author:profiles(full_name),
      category:categories(name, color),
      tags:post_tags(tag:tags(*)),
      post_likes!left(user_id)
    `,
  );

  // 카테고리 필터링
  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  // 정렬 및 페이지네이션
  const { data, error } = await query
    .order("created_at", { ascending: false })
    .range(start, end);

  console.log("[postAction] Posts query result:", {
    data,
    error,
    dataLength: data?.length,
  });

  if (error) {
    console.error("[postAction] Error fetching posts:", error);
    throw error;
  }

  // 전체 게시글 수 조회 (필터 적용)
  let countQuery = supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  if (categoryId) {
    countQuery = countQuery.eq("category_id", categoryId);
  }

  const { count, error: countError } = await countQuery;

  console.log("[postAction] Total count query:", { count, countError });

  if (countError) {
    console.error("[postAction] Error fetching count:", countError);
  }

  const transformedPosts =
    data?.map((post) => transformPost(post, userProfile?.id)) || [];
  console.log("[postAction] Transformed posts:", {
    transformedPostsLength: transformedPosts.length,
  });

  const result = {
    posts: transformedPosts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit),
      totalCount: count || 0,
    },
  };

  console.log("[postAction] Final transformed result:", result);
  return result;
}

// 단일 게시글 조회
export async function getPost(postId: number) {
  const supabase = await createServerSupabaseClient();
  const userProfile = await getServerUserProfile();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:profiles(full_name),
      category:categories(name, color),
      tags:post_tags(tag:tags(*)),
      post_likes!left(user_id)
    `,
    )
    .eq("id", postId)
    .single();

  if (error) throw error;

  return transformPost(data, userProfile?.id);
}

// 게시글 작성
export async function createPost(data: PostFormData) {
  const supabase = await createServerSupabaseClient();

  const { data: post, error } = await supabase
    .from("posts")
    .insert([
      {
        title: data.title,
        content: data.content,
        category_id: data.categoryId,
        author_id: data.authorId,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // 태그 연결
  if (data.tagIds?.length) {
    const { error: tagError } = await supabase.from("post_tags").insert(
      data.tagIds.map((tag_id) => ({
        post_id: post.id,
        tag_id,
      })),
    );

    if (tagError) throw tagError;
  }

  revalidatePath("/community");
  return post;
}

// 게시글 수정
export async function updatePost(postId: number, data: PostFormData) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("posts")
    .update({
      title: data.title,
      content: data.content,
      category_id: data.categoryId,
    })
    .eq("id", postId);

  if (error) throw error;

  // 태그 연결 업데이트
  if (data.tagIds) {
    // 기존 태그 연결 삭제
    await supabase.from("post_tags").delete().eq("post_id", postId);

    // 새로운 태그 연결
    if (data.tagIds.length) {
      const { error: tagError } = await supabase.from("post_tags").insert(
        data.tagIds.map((tag_id) => ({
          post_id: postId,
          tag_id,
        })),
      );

      if (tagError) throw tagError;
    }
  }

  revalidatePath("/community");
}

// 게시글 삭제
export async function removePost(postId: number) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw error;

  revalidatePath("/community");
}

// 좋아요 토글
export async function postToggleLike(postId: number) {
  const supabase = await createServerSupabaseClient();
  const userProfile = await getServerUserProfile();
  if (!userProfile) throw new Error("사용자 정보를 찾을 수 없습니다.");

  try {
    // RPC 함수를 사용하여 좋아요 토글
    const { data: isLiked, error } = await supabase.rpc(
      "toggle_post_like_rpc",
      {
        post_id_param: postId,
      },
    );

    if (error) {
      console.error("좋아요 토글 에러:", error);
      throw new Error("좋아요 처리에 실패했습니다.");
    }

    // 업데이트된 게시글 정보 가져오기
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("like_count")
      .eq("id", postId)
      .single();

    if (postError) {
      console.error("게시글 조회 에러:", postError);
      throw new Error("게시글 정보를 가져올 수 없습니다.");
    }

    revalidatePath("/community");

    // 업데이트된 상태 반환
    return {
      like_count: post.like_count || 0,
      is_liked: isLiked,
    };
  } catch (error) {
    throw error;
  }
}

// 댓글 수 조회
export async function getCommentCount(postId: number): Promise<number> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select("comment_count")
    .eq("id", postId)
    .single();

  if (error) {
    console.error("Error getting comment count:", error);
    throw new Error("댓글 수 조회에 실패했습니다.");
  }

  return data?.comment_count || 0;
}

// 댓글 수 업데이트
export async function updateCommentCount(postId: number) {
  const supabase = await createServerSupabaseClient();

  const { count, error } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (error) throw error;

  const { error: updateError } = await supabase
    .from("posts")
    .update({ comment_count: count || 0 })
    .eq("id", postId);

  if (updateError) throw updateError;

  revalidatePath("/community");
}
