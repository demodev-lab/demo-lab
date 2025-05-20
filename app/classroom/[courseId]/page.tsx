import { CourseDetail } from "@/components/course-detail";

export default function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  return <CourseDetail courseId={params.courseId} />;
}
