"use client";

import React from "react";
import { CourseCreateForm } from "@/domains/course/components/CourseCreateForm";
import { CourseList } from "@/domains/course/components/CourseList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function CourseManager() {
  const router = useRouter();

  const handleCourseClick = (courseId: string) => {
    router.push(`/admin/courses/${courseId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">코스 관리</h2>
        <p className="text-muted-foreground">
          새로운 코스를 생성하고 관리합니다. 코스를 클릭하면 모듈과 강의를
          관리할 수 있습니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>새 코스 생성</CardTitle>
          <CardDescription>
            새로운 코스를 생성합니다. 모든 필수 정보를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CourseCreateForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>코스 목록</CardTitle>
          <CardDescription>
            현재 등록된 모든 코스 목록입니다. 코스를 클릭하여 상세 관리 페이지로
            이동하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CourseList onCourseClick={handleCourseClick} />
        </CardContent>
      </Card>
    </div>
  );
}
