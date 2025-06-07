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

    // RPC를 사용해 복잡한 쿼리 실행
    // is_liked, author 정보, category 정보를 한번에 가져옵니다.
    const { data: posts, error } = await supabase
      .rpc("get_posts_with_details", {
        request_user_id: user?.id,
        page_limit: limit,
        page_offset: offset,
      })
      .select();

    if (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }

    // 전체 게시글 수를 가져와 총 페이지 수 계산
    const { count, error: countError } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "published")
      .eq("is_spam", false);

    if (countError) throw countError;

    return NextResponse.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalCount: count,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}
