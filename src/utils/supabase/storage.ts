/**
 * @file storage.ts
 * @description Supabase Storage 유틸리티 함수 (공개 버킷)
 */

import { createBrowserSupabaseClient } from "./client";

// 환경변수에서 버킷 이름을 읽음
const BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET || "test-bucket";

// 업로드 결과 타입 정의
export interface UploadResult {
  success: boolean;
  path?: string;
  publicUrl?: string;
  error?: string;
}

// 파일 유효성 검사 결과 타입 정의
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

// 허용된 파일 타입 (MIME 타입)
const ALLOWED_FILE_TYPES = [
  // 이미지
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  // 문서
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
  "text/plain",
  "text/csv",
  // 압축 파일
  "application/zip",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
];

// 파일 크기 제한 (바이트 단위)
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

/**
 * 파일 유효성을 검사합니다.
 * @param file 검사할 파일
 * @returns 유효성 검사 결과
 */
export function validateFile(file: File): FileValidationResult {
  console.group("Storage validateFile");
  console.log("Validating file:", {
    name: file.name,
    size: file.size,
    type: file.type,
  });

  // 파일 존재 여부 확인
  if (!file) {
    console.error("No file provided");
    console.groupEnd();
    return { isValid: false, error: "파일이 없습니다." };
  }

  // 파일 크기 검사
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
    console.error(`File too large: ${sizeMB}MB > ${maxSizeMB}MB`);
    console.groupEnd();
    return {
      isValid: false,
      error: `파일 크기가 너무 큽니다. (${sizeMB}MB > ${maxSizeMB}MB)`,
    };
  }

  // 파일 타입 검사
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    console.error(`Invalid file type: ${file.type}`);
    console.groupEnd();
    return {
      isValid: false,
      error: `허용되지 않는 파일 형식입니다. (${file.type})`,
    };
  }

  console.log("File validation passed");
  console.groupEnd();
  return { isValid: true };
}

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 변환합니다.
 * @param bytes 바이트 크기
 * @returns 포맷된 크기 문자열
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 파일명에서 확장자를 추출합니다.
 * @param filename 파일명
 * @returns 확장자 (점 제외, 소문자)
 */
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return "";
  }
  return filename.substring(lastDotIndex + 1).toLowerCase();
}

/**
 * Storage에 저장할 유니크한 파일 경로를 생성합니다.
 * @param originalFilename 원본 파일명
 * @param folderPath 저장할 폴더 경로 (예: "posts/2024/01")
 * @returns 유니크한 파일 경로
 */
export function generateStorageFilePath(
  originalFilename: string,
  folderPath: string,
): string {
  const extension = getFileExtension(originalFilename);
  const uniqueId = crypto.randomUUID();
  const filename = extension ? `${uniqueId}.${extension}` : uniqueId;

  // 폴더 경로 정규화 (앞뒤 슬래시 제거)
  const normalizedPath = folderPath.replace(/^\/+|\/+$/g, "");

  return normalizedPath ? `${normalizedPath}/${filename}` : filename;
}

/**
 * 날짜 기반 폴더 경로를 생성합니다.
 * @param prefix 경로 접두사 (예: "posts", "profiles")
 * @returns 날짜 기반 폴더 경로 (예: "posts/2024/01")
 */
export function generateDateBasedPath(prefix: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  return `${prefix}/${year}/${month}`;
}

/**
 * 버킷 내 파일 목록을 조회합니다.
 * @returns 파일 목록 또는 빈 배열
 */
export async function listFiles() {
  try {
    const supabase = createBrowserSupabaseClient();

    // 루트 경로에서 파일 목록 가져오기
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list("", { sortBy: { column: "name", order: "asc" } });

    if (error) {
      console.error("Storage listFiles error:", error.message);
      throw new Error(error.message);
    }

    return data || [];
  } catch (err) {
    console.error("Storage listFiles exception:", err);
    return [];
  }
}

/**
 * 공개 버킷의 파일에 대한 public URL을 반환합니다.
 * @param path 파일 경로
 * @returns 파일의 공개 URL
 */
export function getPublicUrl(path: string): string {
  try {
    if (!path) return "";

    const supabase = createBrowserSupabaseClient();
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

    return data?.publicUrl || "";
  } catch (err) {
    console.error("Storage getPublicUrl exception:", err);
    return "";
  }
}

/**
 * 파일을 Storage 버킷에 업로드합니다.
 * @param file 업로드할 파일
 * @param path 파일 저장 경로 (전체 경로, 파일명 포함)
 * @returns 업로드 결과 (경로, URL, 성공 여부)
 */
export async function uploadFile(
  file: File,
  path: string,
): Promise<UploadResult> {
  try {
    console.group("Storage uploadFile");
    console.log("Uploading file:", {
      originalName: file.name,
      size: file.size,
      type: file.type,
      storagePath: path,
    });

    // 파일 유효성 검사
    if (!file) {
      console.error("No file provided");
      console.groupEnd();
      return { success: false, error: "업로드할 파일이 없습니다." };
    }

    if (!path) {
      console.error("No path provided");
      console.groupEnd();
      return { success: false, error: "파일 경로가 필요합니다." };
    }

    const supabase = createBrowserSupabaseClient();

    // 파일 업로드
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600", // 1시간 캐시
        contentType: file.type,
      });

    if (error) {
      console.error("Upload error:", error);
      console.groupEnd();
      return { success: false, error: error.message };
    }

    // 업로드 성공 시 공개 URL 생성
    const publicUrl = getPublicUrl(data.path);

    console.log("Upload successful:", {
      storedPath: data.path,
      publicUrl: publicUrl,
    });
    console.groupEnd();

    return {
      success: true,
      path: data.path,
      publicUrl: publicUrl,
    };
  } catch (err) {
    console.error("Upload exception:", err);
    console.groupEnd();

    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "파일 업로드 중 오류가 발생했습니다.",
    };
  }
}

/**
 * 버킷에서 파일을 삭제합니다.
 * @param path 삭제할 파일 경로
 * @returns 성공 여부와 오류 메시지
 */
export async function deleteFile(
  path: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!path) {
      return { success: false, error: "삭제할 파일 경로가 필요합니다." };
    }

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.storage.from(BUCKET).remove([path]);

    if (error) {
      console.error("Storage deleteFile error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Storage deleteFile exception:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "파일 삭제 중 오류가 발생했습니다.",
    };
  }
}
