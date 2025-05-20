"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function ClassroomTab() {
  const router = useRouter();

  const courses = [
    {
      id: "ai-agency-masterclass",
      title: "ClassHive 입문자를 위한 필수 가이드",
      subtitle: "ClassHive Ready: 기초 개념부터 실전까지",
      description:
        "ClassHive를 제대로 활용하기 위한 필수 기초 지식을 배워봅시다! 경험이 없다면, 반드시 이 강의를 먼저 수강하세요.",
      progress: 0,
      image: "/placeholder.svg?text=ClassHive+입문",
    },
    {
      id: "ai-tips",
      title: "10X ClassHive TIPS",
      subtitle: "ClassHive를 10배 더 활용하는 팁 자료 모음",
      description:
        "ClassHive의 숨겨진 기능과 활용법을 배워 학습 효율을 높여보세요.",
      progress: 0,
      image: "/placeholder.svg?text=10X+TIPS",
    },
    {
      id: "ai-challenge",
      title: "ClassHive 챌린지 자료",
      subtitle: "3주 마스터 플랜",
      description:
        "300명이 도전한 검증된 챌린지! ClassHive로 학습 목표를 달성해보세요!",
      progress: 0,
      image: "/placeholder.svg?text=챌린지",
    },
    {
      id: "ai-gallery",
      title: "학습 자료 갤러리",
      subtitle: "다양한 학습 자료를 공유합니다",
      description:
        "커뮤니티 멤버들이 공유한 유용한 학습 자료들을 모아놓았습니다.",
      progress: 0,
      image: "/placeholder.svg?text=자료+갤러리",
    },
  ];

  const handleCourseClick = (courseId: string) => {
    // 강의 상세 페이지로 이동
    router.push(`/classroom/${courseId}`);
  };

  return (
    <div className="container py-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCourseClick(course.id)}
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
        ))}
      </div>
    </div>
  );
}
