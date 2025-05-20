import { CourseLesson } from "@/components/course-lesson";

export default function CourseLessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  return <CourseLesson courseId={params.courseId} lessonId={params.lessonId} />;
}
