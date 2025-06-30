import { notFound } from "next/navigation";
import { getLectureById } from "@/domains/course/actions/lectureAction";
import { getCourseById } from "@/domains/course/actions/courseAction";
import { getEnrollmentByUserAndCourse } from "@/domains/course/actions/enrollmentAction";
import { getLectureProgress } from "@/domains/course/actions/progressAction";
import { LectureDetail } from "@/domains/course/components/LectureDetail";
import { createServerSupabaseClient } from "@/utils/supabase/server";

interface Props {
  params: {
    courseId: string;
    lectureId: string;
  };
}

export default async function LectureDetailPage({ params }: Props) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 강의 정보 가져오기
    const lecture = await getLectureById(Number(params.lectureId));
    if (!lecture) {
      notFound();
    }

    // 코스 정보 가져오기
    const course = await getCourseById(params.courseId);
    if (!course) {
      notFound();
    }

    // 권한 확인: 수강 신청을 했는지 체크
    let enrollment = null;
    let lectureProgress = null;

    if (user) {
      enrollment = await getEnrollmentByUserAndCourse(
        user.id,
        Number(params.courseId),
      );

      // 수강 신청하지 않은 경우 접근 제한
      if (!enrollment) {
        // TODO: 미리보기 가능한 강의인지 체크할 수도 있음
        notFound();
      }

      // 진도 정보 가져오기
      lectureProgress = await getLectureProgress(
        user.id,
        Number(params.lectureId),
      );
    } else {
      // 로그인하지 않은 경우
      notFound();
    }

    return (
      <LectureDetail
        lecture={lecture}
        course={course}
        enrollment={enrollment}
        progress={lectureProgress}
        userId={user?.id}
      />
    );
  } catch (error) {
    console.error("Failed to load lecture:", error);
    notFound();
  }
}
