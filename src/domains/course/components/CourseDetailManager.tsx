"use client";

import React, { useState } from "react";
import { CourseWithDetails } from "../types";
import { ModuleManager } from "./ModuleManager";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { updateCourse } from "../actions/courseAction";
import { toast } from "sonner";
import { Database } from "@/types/database.types";

type DifficultyLevel = Database["public"]["Enums"]["difficulty_level"];

interface CourseDetailManagerProps {
  course: CourseWithDetails;
}

export function CourseDetailManager({ course }: CourseDetailManagerProps) {
  const router = useRouter();
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: course.title,
    subtitle: course.subtitle || "",
    description: course.description || "",
    thumbnail_url: course.thumbnail_url || "",
    difficulty: course.difficulty,
  });

  const handleUpdateCourse = async () => {
    try {
      await updateCourse(course.id, courseForm);
      toast.success("강좌 정보가 업데이트되었습니다.");
      setIsEditingCourse(false);
      router.refresh();
    } catch (error) {
      toast.error("강좌 업데이트에 실패했습니다.");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">강좌 상세 관리</h2>
            <p className="text-muted-foreground">
              강좌, 모듈, 강의를 관리합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 강좌 정보 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>강좌 정보</CardTitle>
              <CardDescription>
                강좌의 기본 정보를 수정할 수 있습니다.
              </CardDescription>
            </div>
            {!isEditingCourse ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingCourse(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                수정
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleUpdateCourse}
                >
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditingCourse(false);
                    setCourseForm({
                      title: course.title,
                      subtitle: course.subtitle || "",
                      description: course.description || "",
                      thumbnail_url: course.thumbnail_url || "",
                      difficulty: course.difficulty,
                    });
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  취소
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!isEditingCourse ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  제목
                </p>
                <p className="text-lg">{course.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  부제목
                </p>
                <p>{course.subtitle || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  설명
                </p>
                <p className="whitespace-pre-wrap">
                  {course.description || "-"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    난이도
                  </p>
                  <p>{course.difficulty}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    통계
                  </p>
                  <p>
                    총 {course.total_lecture_count}개 강의 ·{" "}
                    {Math.floor(course.total_duration_secs / 3600)}시간{" "}
                    {Math.floor((course.total_duration_secs % 3600) / 60)}분
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">제목</label>
                <Input
                  value={courseForm.title}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">부제목</label>
                <Input
                  value={courseForm.subtitle}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, subtitle: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">설명</label>
                <Textarea
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium">썸네일 URL</label>
                <Input
                  value={courseForm.thumbnail_url}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      thumbnail_url: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">난이도</label>
                <Select
                  value={courseForm.difficulty}
                  onValueChange={(value: DifficultyLevel) =>
                    setCourseForm({ ...courseForm, difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="입문">입문</SelectItem>
                    <SelectItem value="초급">초급</SelectItem>
                    <SelectItem value="중급">중급</SelectItem>
                    <SelectItem value="고급">고급</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 모듈 및 강의 관리 */}
      <ModuleManager courseId={course.id} modules={course.modules || []} />
    </div>
  );
}
