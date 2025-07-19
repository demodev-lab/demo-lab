/**
 * @file storage-server.ts
 * @description Supabase Storage 서버용 유틸리티 함수
 */

import { createServerSupabaseClient } from "./server";

// 환경변수에서 버킷 이름을 읽음
const BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET || "demo-lab-storage";

/**
 * 서버에서 여러 Storage 파일을 삭제합니다.
 * @param paths 삭제할 파일 경로 배열
 * @returns 성공 여부와 오류 메시지
 */
export async function deleteStorageFiles(
  paths: string[],
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!paths || paths.length === 0) {
      return { success: false, error: "삭제할 파일이 없습니다." };
    }

    console.log(`[Storage] 파일 삭제 시도: ${paths.join(", ")}`);

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.storage.from(BUCKET).remove(paths);

    if (error) {
      console.error(
        `[Storage] 파일 삭제 실패: ${paths.join(", ")}`,
        `에러: ${error.message}`,
      );
      return { success: false, error: error.message };
    }

    console.log(`[Storage] 파일 삭제 성공: ${paths.join(", ")}`);
    return { success: true };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";

    console.error(
      `[Storage] 파일 삭제 중 예외 발생: ${paths.join(", ")}`,
      `에러: ${errorMessage}`,
    );

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * 서버에서 단일 Storage 파일을 삭제합니다.
 * @param path 삭제할 파일 경로
 * @returns 성공 여부와 오류 메시지
 */
export async function deleteStorageFile(
  path: string,
): Promise<{ success: boolean; error?: string }> {
  if (!path) {
    return { success: false, error: "삭제할 파일 경로가 필요합니다." };
  }

  // 단일 파일 삭제는 복수 파일 삭제 함수를 재사용
  return deleteStorageFiles([path]);
}
