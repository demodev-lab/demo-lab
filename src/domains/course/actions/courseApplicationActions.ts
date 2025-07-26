"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { CourseApplicationFormData } from "../types";
import type { TablesInsert } from "@/types/database.types";

/**
 * 코스 신청 서버 액션
 * 폼 데이터를 검증하고 데이터베이스에 저장
 * 
 * 보안 원칙:
 * - 클라이언트가 전송한 사용자 식별 정보는 신뢰하지 않음
 * - 서버에서 인증된 세션을 통해 사용자 정보를 가져옴
 * - 상태는 서버에서 강제로 'pending'으로 설정
 */
export async function createCourseApplication(
  data: CourseApplicationFormData,
): Promise<{ success: boolean; error?: string; applicationId?: number }> {
  try {
    console.group("🚀 코스 신청 처리 시작");
    console.log("코스 제목:", data.title?.trim());

    // Supabase 클라이언트 생성
    const supabase = await createServerSupabaseClient();

    // 🔐 보안: 서버에서 인증된 사용자 정보 가져오기
    console.log("🔐 사용자 인증 확인 중...");
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("❌ 인증 실패:", authError);
      return {
        success: false,
        error: "로그인이 필요합니다.",
      };
    }

    // 인증된 사용자 정보 사용 (클라이언트 데이터 무시)
    const authenticatedUserId = user.id;
    const authenticatedUserEmail = user.email || null;
    
    console.log("✅ 인증된 사용자:", authenticatedUserId);

    // 데이터 검증: 제목 정리
    const cleanTitle = data.title?.trim();
    if (!cleanTitle) {
      return {
        success: false,
        error: "코스 제목을 입력해주세요.",
      };
    }

    // 중복 신청 체크 (제목 trim 처리)
    console.log("🔍 중복 신청 체크 중...");
    const { data: existingApplication, error: checkError } = await supabase
      .from("course_application")
      .select("id, title, status")
      .eq("applicant_id", authenticatedUserId)
      .eq("title", cleanTitle)
      .eq("status", "pending")
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116은 "no rows returned" 에러로, 정상적인 경우
      console.error("❌ 중복 신청 체크 에러:", checkError);
      return {
        success: false,
        error: "신청 확인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      };
    }

    if (existingApplication) {
      console.log("⚠️ 중복 신청 발견:", existingApplication);
      return {
        success: false,
        error: "동일한 제목의 코스 신청이 이미 검토 중입니다.",
      };
    }

    // 데이터베이스에 저장할 데이터 준비
    console.log("📝 데이터 매핑 중...");
    const applicationData: TablesInsert<"course_application"> = {
      // 기본 정보
      title: cleanTitle,
      subtitle: data.subtitle?.trim() || null,
      description: data.description?.trim() || null,
      difficulty: data.difficulty,
      category_id: data.category_id || null,
      thumbnail_url: data.thumbnail_url?.trim() || null,

      // 🔐 보안: 서버에서 인증된 정보만 사용
      applicant_id: authenticatedUserId,
      applicant_email: authenticatedUserEmail,

      // JSON 필드들 (타입 안전한 변환)
      instructor_info: data.instructor_info ? (data.instructor_info as any) : null,
      learning_goals: data.learning_goals ? (data.learning_goals as any) : null,
      background_knowledge: data.background_knowledge ? (data.background_knowledge as any) : null,
      modules_plan: data.modules_plan ? (data.modules_plan as any) : null,
      price_info: data.price_info ? (data.price_info as any) : null,

      // 추가 정보
      target_audience: data.target_audience?.trim() || null,
      expected_duration_weeks: data.expected_duration_weeks || null,
      course_start_date: data.course_start_date || null,
      additional_materials: data.additional_materials?.trim() || null,
      additional_message: data.additional_message?.trim() || null,

      // 🔐 보안: 상태는 서버에서 강제 설정
      status: "pending",
      applied_at: new Date().toISOString(),
    };

    console.log("💾 데이터베이스 저장 중...");
    
    // 데이터베이스에 저장
    const { data: savedApplication, error: insertError } = await supabase
      .from("course_application")
      .insert(applicationData)
      .select("id")
      .single();

    if (insertError) {
      console.error("❌ 데이터베이스 저장 에러:", insertError);
      return {
        success: false,
        error: "신청서 저장에 실패했습니다. 잠시 후 다시 시도해주세요.",
      };
    }

    console.log("✅ 신청 완료! ID:", savedApplication.id);
    console.groupEnd();

    return {
      success: true,
      applicationId: savedApplication.id,
    };

  } catch (error) {
    console.error("❌ 코스 신청 처리 에러:", error);
    console.groupEnd();
    
    return {
      success: false,
      error: "시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    };
  }
}
