"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Course } from "../types";

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
}

export function CourseCard({ course, showProgress = false }: CourseCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">승인 대기</Badge>;
      case "active":
        return null;
      case "closed":
        return <Badge variant="destructive">마감</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="aspect-video relative">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No thumbnail</span>
          </div>
        )}
        {course.status && course.status !== "active" && (
          <div className="absolute top-2 right-2">
            {getStatusBadge(course.status)}
          </div>
        )}
      </div>
      <CardHeader>
        <div className="space-y-1">
          <h3 className="font-semibold leading-none tracking-tight">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground">{course.subtitle}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex justify-between w-full">
          <Badge variant="secondary">{course.difficulty}</Badge>
          <div className="text-sm text-muted-foreground">
            {course.total_lecture_count}개 강의
          </div>
        </div>
        {showProgress && (
          <div className="w-full space-y-1">
            <div className="flex justify-between text-xs">
              <span>진행률</span>
              <span>0%</span>
            </div>
            <Progress value={0} className="h-1" />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
