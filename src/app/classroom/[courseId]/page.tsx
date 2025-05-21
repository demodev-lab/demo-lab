import { CourseDetail } from "@/components/course-detail";

interface Props {
  params: { courseId: string };
}

export default function CourseDetailPage({ params }: Props) {
  return <CourseDetail courseId={params.courseId} />;
}
