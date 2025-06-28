"use client";

import React from "react";
import { CourseCreateForm } from "@/domains/course/components/CourseCreateForm";
import { CourseList } from "@/domains/course/components/CourseList";
import { PendingCourseList } from "@/domains/course/components/PendingCourseList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
          코스 승인 요청을 검토하고, 새로운 코스를 생성하고 관리합니다.
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">승인 대기</TabsTrigger>
          <TabsTrigger value="active">승인된 코스</TabsTrigger>
          <TabsTrigger value="create">새 코스 생성</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>승인 대기 중인 코스</CardTitle>
              <CardDescription>
                사용자들이 신청한 코스를 검토하고 승인 또는 거절할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PendingCourseList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>승인된 코스 목록</CardTitle>
              <CardDescription>
                현재 공개된 코스 목록입니다. 코스를 클릭하여 상세 관리 페이지로
                이동하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseList onCourseClick={handleCourseClick} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>새 코스 생성</CardTitle>
              <CardDescription>
                관리자가 직접 새로운 코스를 생성합니다. 모든 필수 정보를
                입력해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseCreateForm isAdmin={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
