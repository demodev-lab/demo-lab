"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { Post } from "../types";
import { CreatePostDto } from "@/dtos/create-post.dto";
import { UpdatePostDto } from "@/dtos/update-post.dto";
import { deleteStorageFile } from "@/utils/supabase/storage-server";
import { revalidatePath } from "next/cache";
import { getServerUserProfile } from "@/utils/supabase/profiles";

// DB에서 가져온 raw post 데이터를 클라이언트에서 사용할 수 있는 형태로 변환
function transformPost(post: any, userId?: string): Post {
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
    attachments:
      post.post_attachments?.map((attachment: any) => ({
        id: attachment.id,
        post_id: attachment.post_id,
        original_file_name: attachment.original_file_name,
        stored_file_path: attachment.stored_file_path,
        file_size: attachment.file_size,
        file_type: attachment.file_type,
        created_at: attachment.created_at,
      })) ?? [],
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
      post_likes!left(user_id),
      post_attachments(
        id,
        post_id,
        original_file_name,
        stored_file_path,
        file_size,
        file_type,
        created_at
      )
    `,
  );

  // 카테고리 필터링
  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  // 정렬 옵션 적용
  switch (sortOption) {
    case "popular":
      query = query.order("like_count", { ascending: false });
      break;
    case "comments":
      query = query.order("comment_count", { ascending: false });
      break;
    case "latest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  // 페이지네이션
  const { data, error } = await query.range(start, end);

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
    data?.map((post) => transformPost(post, userProfile?.id || undefined)) ||
    [];
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
      post_likes!left(user_id),
      post_attachments(
        id,
        post_id,
        original_file_name,
        stored_file_path,
        file_size,
        file_type,
        created_at
      )
    `,
    )
    .eq("id", postId)
    .single();

  if (error) throw error;

  return transformPost(data, userProfile?.id || undefined);
}

// 게시글 작성
export async function createPost(data: CreatePostDto) {
  const supabase = await createServerSupabaseClient();
  const userProfile = await getServerUserProfile();

  if (!userProfile) {
    throw new Error("로그인이 필요합니다.");
  }

  // 카테고리 권한 체크
  if (data.categoryId) {
    const { data: canPost, error: permError } = await supabase.rpc(
      "can_post_in_category",
      { category_id_param: data.categoryId },
    );

    if (permError || !canPost) {
      throw new Error("해당 카테고리에 게시글을 작성할 권한이 없습니다.");
    }
  }

  // 트랜잭션 시작: 게시글 생성
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

  try {
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

    // 첨부파일 메타데이터 저장
    if (data.attachments?.length) {
      const attachmentRecords = data.attachments.map((att) => ({
        post_id: post.id,
        original_file_name: att.originalName,
        stored_file_path: att.storedPath,
        file_size: att.fileSize,
        file_type: att.fileType,
      }));

      const { error: attachmentError } = await supabase
        .from("post_attachments")
        .insert(attachmentRecords);

      if (attachmentError) throw attachmentError;
    }

    revalidatePath("/community");
    return post;
  } catch (error) {
    // 에러 발생 시 생성된 게시글 삭제 (보상 트랜잭션)
    await supabase.from("posts").delete().eq("id", post.id);
    throw error;
  }
}

// 게시글 수정 (트랜잭션 처리를 위해 RPC 함수 사용)
export async function updatePost(postId: number, data: UpdatePostDto) {
  const supabase = await createServerSupabaseClient();
  const userProfile = await getServerUserProfile();

  if (!userProfile) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    console.group("[postAction] updatePost");
    console.log("게시글 수정 시도:", { postId, userId: userProfile.id });
    console.log("전달될 데이터:", {
      title: data.title,
      content: data.content,
      categoryId: data.categoryId,
      tagIds: data.tagIds,
      deleteAttachmentIds: data.deleteAttachmentIds,
      addAttachments: data.addAttachments,
    });
    // RPC 함수를 사용하여 트랜잭션 안에서 수행
    const { data: result, error } = await supabase.rpc(
      "update_post_with_attachments",
      {
        p_post_id: postId,
        p_user_id: userProfile.id,
        p_title: data.title,
        p_content: data.content,
        p_category_id: data.categoryId,
        p_tag_ids: data.tagIds,
        p_delete_attachment_ids: data.deleteAttachmentIds,
        p_add_attachments: data.addAttachments,
      },
    );

    if (error) {
      console.error("게시글 수정 RPC 에러:", error);
      throw new Error(error.message || "게시글 수정에 실패했습니다.");
    }

    console.log("RPC 결과:", result);

    // Storage 파일 삭제 (트랜잭션 성공 후)
    if (result.deleted_files && result.deleted_files.length > 0) {
      console.log("삭제할 Storage 파일들:", result.deleted_files);

      await Promise.all(
        result.deleted_files.map(async (filePath: string) => {
          const deleteResult = await deleteStorageFile(filePath);
          if (!deleteResult.success) {
            console.error(
              `Storage 파일 삭제 실패: ${filePath}`,
              deleteResult.error,
            );
            // 에러 로그만 기록하고 넘어감
          }
        }),
      );
    }

    revalidatePath("/community");
    console.groupEnd();
  } catch (error) {
    console.error("게시글 수정 실패:", error);
    console.groupEnd();
    throw error;
  }
}

// 게시글 삭제 (트랜잭션 처리 및 리소스 정리를 위해 RPC 함수 사용)
export async function removePost(postId: number) {
  const supabase = await createServerSupabaseClient();
  const userProfile = await getServerUserProfile();

  if (!userProfile) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    console.group("[postAction] removePost");
    console.log("게시글 삭제 시도:", { postId, userId: userProfile.id });

    // RPC 함수를 사용하여 트랜잭션 안에서 수행
    const { data: result, error } = await supabase.rpc(
      "delete_post_with_cleanup",
      {
        p_post_id: postId,
        p_user_id: userProfile.id,
      },
    );

    if (error) {
      console.error("게시글 삭제 RPC 에러:", error);
      throw new Error(error.message || "게시글 삭제에 실패했습니다.");
    }

    console.log("RPC 결과:", result);

    // Storage 파일 삭제 (트랜잭션 성공 후)
    if (result.deleted_files && result.deleted_files.length > 0) {
      console.log("삭제할 Storage 파일들:", result.deleted_files);

      await Promise.all(
        result.deleted_files.map(async (filePath: string) => {
          const deleteResult = await deleteStorageFile(filePath);
          if (!deleteResult.success) {
            console.error(
              `Storage 파일 삭제 실패: ${filePath}`,
              deleteResult.error,
            );
            // 에러 로그만 기록하고 넘어감 (고아 파일 남을 수 있지만 서비스는 정상 동작)
          }
        }),
      );
    }

    revalidatePath("/community");
    console.groupEnd();
  } catch (error) {
    console.error("게시글 삭제 실패:", error);
    console.groupEnd();
    throw error;
  }
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
