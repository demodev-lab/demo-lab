"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addPost(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Authentication required");

  const newPostData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    category_id: parseInt(formData.get("categoryId") as string),
    author_id: user.id,
  };

  // 1. 게시글을 삽입하고 삽입된 데이터를 반환받습니다.
  const { data: post, error: postError } = await supabase
    .from("posts")
    .insert(newPostData)
    .select()
    .single();

  if (postError) {
    console.error("Error creating post:", postError);
    throw postError;
  }

  // 2. 태그 ID들을 파싱하고 post_tags에 삽입할 데이터를 준비합니다.
  const tagIds = JSON.parse(formData.get("tagIds") as string) as number[];
  if (tagIds && tagIds.length > 0) {
    const postTags = tagIds.map((tagId) => ({
      post_id: post.id,
      tag_id: tagId,
    }));

    const { error: tagsError } = await supabase
      .from("post_tags")
      .insert(postTags);

    if (tagsError) {
      console.error("Error adding tags to post:", tagsError);
      // 참고: 이미 생성된 게시글을 롤백할지 여부는 정책에 따라 결정할 수 있습니다.
      // 여기서는 에러를 던져서 클라이언트가 알 수 있도록 합니다.
      throw tagsError;
    }
  }

  revalidatePath("/"); // 메인 커뮤니티 페이지 캐시 무효화
  revalidatePath("/api/posts"); // API 루트 캐시 무효화
}

export async function updatePost(postId: number, formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Authentication required");

  const updateData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    category_id: parseInt(formData.get("categoryId") as string),
  };

  // 게시글 업데이트
  const { error: postError } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", postId);

  if (postError) {
    console.error("Error updating post:", postError);
    throw postError;
  }

  // 기존 태그 관계 삭제
  await supabase.from("post_tags").delete().eq("post_id", postId);

  // 새 태그 추가
  const tagIds = JSON.parse(formData.get("tagIds") as string) as number[];
  if (tagIds && tagIds.length > 0) {
    const postTags = tagIds.map((tagId) => ({
      post_id: postId,
      tag_id: tagId,
    }));

    const { error: tagsError } = await supabase
      .from("post_tags")
      .insert(postTags);

    if (tagsError) {
      console.error("Error updating post tags:", tagsError);
      throw tagsError;
    }
  }

  revalidatePath("/");
  revalidatePath("/api/posts");
}

export async function deletePost(postId: number) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/api/posts");
}

export async function toggleLikePost(postId: number, isLiked: boolean) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Authentication required");

  if (isLiked) {
    // 좋아요 취소
    const { error } = await supabase
      .from("likes")
      .delete()
      .match({ post_id: postId, user_id: user.id });
    if (error) throw error;
  } else {
    // 좋아요
    const { error } = await supabase
      .from("likes")
      .insert({ post_id: postId, user_id: user.id });
    if (error) throw error;
  }

  // like_count 업데이트 (트리거로 자동화하는 것이 더 좋음)
  const { count, error: countError } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (countError) throw countError;

  await supabase
    .from("posts")
    .update({ like_count: count || 0 })
    .eq("id", postId);

  revalidatePath("/");
  revalidatePath("/api/posts");
}

// ... updatePost, addComment 등 다른 Action들도 유사하게 구현 ...
