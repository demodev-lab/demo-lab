"use server";

import type { CourseApplicationFormData } from "../types";

interface CourseApplicationSubmitData extends CourseApplicationFormData {
  applicant_id: string;
  applicant_email: string | null;
  status: "pending" | "approved" | "rejected";
}

/**
 * 임시 코스 신청 서버 액션
 * TODO: 실제 구현 필요
 */
export async function createCourseApplication(
  data: CourseApplicationSubmitData,
): Promise<{ success: boolean; error?: string }> {
  console.log("Course application data:", data);

  // 임시로 성공 반환
  return {
    success: true,
  };
}
