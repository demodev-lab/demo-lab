import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { searchParams } = new URL(request.url);

  // 페이지네이션 파라미터
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  // 필터링 및 정렬 파라미터 (향후 확장 가능)
  // const category = searchParams.get("category");
  // const sort = searchParams.get("sort");

  try {
    // 현재 로그인한 사용자 정보 가져오기
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("API: User info:", user?.id ? "Logged in" : "Anonymous");

    // RPC 함수를 사용하여 게시글 데이터 가져오기
    const { data: posts, error } = await supabase.rpc(
      "get_posts_with_details",
      {
        request_user_id: user?.id || null,
        page_limit: limit,
        page_offset: offset,
      },
    );

    if (error) {
      console.error("Error fetching posts with RPC:", error);
      throw error;
    }

    console.log("API: Posts found:", posts?.length || 0);

    // RPC 함수에서 이미 변환된 데이터를 그대로 사용
    const transformedPosts =
      posts?.map((post: any) => ({
        id: post.id,
        created_at: post.created_at,
        title: post.title,
        content: post.content,
        view_count: post.view_count,
        like_count: post.like_count,
        comment_count: post.comment_count,
        is_pinned: post.is_pinned,
        author_id: post.author_id,
        author_name: post.author_name || "Unknown User",
        category_id: post.category_id,
        category_name: post.category_name || "Uncategorized",
        category_color: post.category_color || "#888888",
        tags: post.tags || [],
        is_liked: post.is_liked || false,
      })) || [];

    // 전체 게시글 수를 가져와 총 페이지 수 계산
    const { count, error: countError } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "published")
      .eq("is_spam", false);

    if (countError) {
      console.error("Error counting posts:", countError);
      throw countError;
    }

    console.log("API: Total posts count:", count);

    return NextResponse.json({
      posts: transformedPosts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalCount: count,
      },
    });
  } catch (error) {
    console.error("Error in posts API:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts", details: error.message },
      { status: 500 },
    );
  }
}
