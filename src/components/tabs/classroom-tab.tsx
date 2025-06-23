"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { CourseCard } from "@/domains/course/components/course-card";
import { useCourses } from "@/domains/course/hooks/useCourses";
import { Skeleton } from "@/components/ui/skeleton";

function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-1 w-full" />
        </div>
      </div>
    </Card>
  );
}

export function ClassroomTab() {
  const router = useRouter();
  const { courses, isLoading, error } = useCourses();

  if (error) {
    return (
      <div className="container py-6">
        <div className="text-center text-destructive">
          강좌 목록을 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="container py-6">
        <div className="text-center text-muted-foreground">
          등록된 강좌가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="cursor-pointer"
            onClick={() => router.push(`/classroom/${course.id}`)}
          >
            <CourseCard course={course} showProgress />
          </div>
        ))}

        {/* 기존 UI 참고용 주석 */}
        {/* {courses.map((course) => (
          <Card
            key={course.id}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(`/classroom/${course.id}`)}
          >
            <div className="aspect-video relative bg-muted">
              <Image
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{course.subtitle}</p>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {course.description}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="w-full space-y-1">
                <div className="flex justify-between text-xs">
                  <span>진행률</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-1" />
              </div>
            </CardFooter>
          </Card>
        ))} */}
      </div>
    </div>
  );
}
