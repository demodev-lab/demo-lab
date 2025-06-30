import { notFound } from "next/navigation";
import { getCourseWithDetails } from "@/domains/course/actions/courseAction";
import { getEnrollmentByUserAndCourse } from "@/domains/course/actions/enrollmentAction";
import { getUserCourseProgress } from "@/domains/course/actions/progressAction";
// import { CourseDetail } from "@/domains/course/components/course-detail";
import { CourseDetailNew } from "@/domains/course/components/CourseDetailNew";
import { createServerSupabaseClient } from "@/utils/supabase/server";

interface Props {
  params: { courseId: string };
}

export default async function CourseDetailPage({ params }: Props) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const course = await getCourseWithDetails(params.courseId);

    if (!course) {
      notFound();
    }

    // 사용자별 수강 정보 가져오기
    let enrollment = null;
    let progress = null;

    if (user) {
      enrollment = await getEnrollmentByUserAndCourse(
        user.id,
        Number(params.courseId),
      );
      progress = await getUserCourseProgress(user.id, Number(params.courseId));
    }

    return (
      <CourseDetailNew
        course={course}
        enrollment={enrollment}
        progress={progress}
        userId={user?.id}
      />
    );
  } catch (error) {
    console.error("Failed to load course:", error);
    notFound();
  }
}
