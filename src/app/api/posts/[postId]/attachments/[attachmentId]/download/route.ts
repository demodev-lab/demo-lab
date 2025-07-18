/**
 * @file download/route.ts
 * @description 첨부파일 보안 다운로드 API
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { getServerUserProfile } from "@/utils/supabase/profiles";

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string; attachmentId: string } },
) {
  try {
    const supabase = await createServerSupabaseClient();
    const userProfile = await getServerUserProfile();

    // 사용자 인증 확인
    if (!userProfile) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const postId = parseInt(params.postId);
    const attachmentId = parseInt(params.attachmentId);

    // 게시글 존재 여부 및 접근 권한 확인
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id")
      .eq("id", postId)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    // 첨부파일 정보 조회
    const { data: attachment, error: attachmentError } = await supabase
      .from("post_attachments")
      .select("*")
      .eq("id", attachmentId)
      .eq("post_id", postId)
      .single();

    if (attachmentError || !attachment) {
      return NextResponse.json(
        { error: "첨부파일을 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    // Supabase Storage에서 Signed URL 생성 (1시간 유효)
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET || "demo-lab-storage")
        .createSignedUrl(attachment.stored_file_path, 3600); // 1시간

    if (signedUrlError || !signedUrlData) {
      console.error("Signed URL 생성 실패:", signedUrlError);
      return NextResponse.json(
        { error: "다운로드 링크 생성에 실패했습니다" },
        { status: 500 },
      );
    }

    // 다운로드 정보 반환
    return NextResponse.json({
      downloadUrl: signedUrlData.signedUrl,
      filename: attachment.original_file_name,
      fileSize: attachment.file_size,
      fileType: attachment.file_type,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(), // 1시간 후
    });
  } catch (error) {
    console.error("다운로드 API 에러:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}
