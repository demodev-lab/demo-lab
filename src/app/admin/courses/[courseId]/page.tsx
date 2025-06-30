import { notFound } from "next/navigation";
import { getCourseWithDetails } from "@/domains/course/actions/courseAction";
import { CourseDetailManager } from "@/domains/course/components/CourseDetailManager";

interface PageProps {
  params: {
    courseId: string;
  };
}

export default async function AdminCourseDetailPage({ params }: PageProps) {
  try {
    const course = await getCourseWithDetails(params.courseId);

    if (!course) {
      notFound();
    }

    return <CourseDetailManager course={course} />;
  } catch {
    notFound();
  }
}
