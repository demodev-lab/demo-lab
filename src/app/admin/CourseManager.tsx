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

export function CourseManager() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">강좌 관리</h2>
        <p className="text-muted-foreground">
          새로운 강좌를 생성하고 관리합니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>새 강좌 생성</CardTitle>
          <CardDescription>
            새로운 강좌를 생성합니다. 모든 필수 정보를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CourseCreateForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>강좌 목록</CardTitle>
          <CardDescription>현재 등록된 모든 강좌 목록입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <CourseList />
        </CardContent>
      </Card>
    </div>
  );
}
