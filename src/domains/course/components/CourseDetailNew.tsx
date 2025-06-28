"use client";

import React, { useState, useMemo } from "react";
import { CourseWithDetails, Enrollment } from "../types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, User } from "lucide-react";
import { cn } from "@/utils/lib/utils";
import { enrollCourse } from "../actions/enrollmentAction";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CourseDetailNewProps {
  course: CourseWithDetails;
  enrollment: Enrollment | null;
  progress: {
    totalLectures: number;
    completedLectures: number;
    progressPercentage: number;
  } | null;
  userId?: string;
}

export function CourseDetailNew({
  course,
  enrollment,
  progress,
  userId,
}: CourseDetailNewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("lesson");
  const [isEnrolling, setIsEnrolling] = useState(false);

  // 모든 강의 목록을 하나의 배열로 합치기
  const allLessons = useMemo(() => {
    return course.modules?.flatMap((module) => module.lectures) || [];
  }, [course.modules]);

  // 전체 강의 진행률 계산
  const overallProgress = progress?.progressPercentage || 0;

  // 전체 강의 시간 계산
  const totalDurationHours = Math.floor(course.total_duration_secs / 3600);
  const totalDurationMinutes = Math.floor(
    (course.total_duration_secs % 3600) / 60,
  );
  const formattedDuration =
    totalDurationHours > 0
      ? `${totalDurationHours}시간 ${totalDurationMinutes}분`
      : `${totalDurationMinutes}분`;

  // 수강 신청 처리
  const handleEnroll = async () => {
    if (!userId) {
      toast.error("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    setIsEnrolling(true);
    try {
      await enrollCourse(course.id);
      toast.success("수강 신청이 완료되었습니다!");
      router.refresh();
    } catch (error) {
      toast.error("수강 신청에 실패했습니다.");
      console.error(error);
    } finally {
      setIsEnrolling(false);
    }
  };

  // 특정 강의로 이동
  const navigateToLesson = (lecture: any) => {
    router.push(`/classroom/${course.id}/lecture/${lecture.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="container py-6">
        {/* 강의 헤더 */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">
              {course.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-1">
                <span className="font-medium">난이도:</span>
                <span>{course.difficulty}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">강의 시간:</span>
                <span>{formattedDuration}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">총 강의 수:</span>
                <span>{course.total_lecture_count}개</span>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>강의 진행률</span>
                <span>{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          </div>

          {/* 수강 신청 카드 - 모바일에서도 보이게 */}
          <div className="w-full md:w-1/3">
            {!enrollment ? (
              <Card>
                <CardContent className="p-4">
                  <Button
                    onClick={handleEnroll}
                    className="w-full bg-[#5046E4] hover:bg-[#5046E4]/90"
                    size="lg"
                    disabled={isEnrolling || !userId}
                  >
                    {isEnrolling ? "처리 중..." : "수강 신청하기"}
                  </Button>
                  {!userId && (
                    <p className="text-sm text-gray-500 text-center mt-2">
                      로그인이 필요합니다.
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-2">
                    수강 상태: {enrollment.status}
                  </div>
                  <Button
                    onClick={() => {
                      if (allLessons.length > 0) {
                        navigateToLesson(allLessons[0]);
                      }
                    }}
                    className="w-full bg-[#5046E4] hover:bg-[#5046E4]/90"
                    size="lg"
                  >
                    학습 시작하기
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 강의 내용 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="lesson">강의 보기</TabsTrigger>
            <TabsTrigger value="overview">강의 개요</TabsTrigger>
            <TabsTrigger value="curriculum">커리큘럼</TabsTrigger>
            <TabsTrigger value="instructors">강사 소개</TabsTrigger>
          </TabsList>

          {/* 강의 보기 탭 */}
          <TabsContent value="lesson">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 강의 목록 사이드바 */}
              <div className="md:col-span-1 border rounded-lg overflow-hidden">
                <div className="bg-muted p-4">
                  <h3 className="font-bold">강의 목록</h3>
                </div>
                <div className="h-[calc(100vh-400px)] overflow-y-auto">
                  {course.modules?.map((module, moduleIndex) => (
                    <div key={module.id} className="border-t">
                      <div className="bg-gray-50 p-3">
                        <h4 className="font-medium text-sm">
                          모듈 {moduleIndex + 1}: {module.title}
                        </h4>
                      </div>
                      <div className="divide-y">
                        {module.lectures.map((lecture, lectureIndex) => {
                          const isActive = activeLesson?.id === lecture.id;
                          const lectureProgress = lecture.progress;

                          return (
                            <div
                              key={lecture.id}
                              className={cn(
                                "p-3 flex justify-between items-center cursor-pointer",
                                isActive ? "bg-amber-50" : "hover:bg-gray-50",
                              )}
                              onClick={() => navigateToLesson(lecture)}
                            >
                              <div className="flex items-start gap-2">
                                <div
                                  className={cn(
                                    "flex-shrink-0 w-6 h-6 rounded-full text-white flex items-center justify-center text-xs",
                                    isActive ? "bg-[#5046E4]" : "bg-gray-400",
                                  )}
                                >
                                  {moduleIndex + 1}.{lectureIndex + 1}
                                </div>
                                <div>
                                  <h5 className="text-sm font-medium">
                                    {lecture.title}
                                  </h5>
                                  <p className="text-xs text-muted-foreground">
                                    {Math.floor(lecture.duration_secs / 60)}분
                                  </p>
                                </div>
                              </div>
                              {lectureProgress?.is_completed && (
                                <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                                  <Check className="h-4 w-4 text-green-600" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 비디오 플레이어 및 강의 내용 */}
              <div className="md:col-span-2">
                {enrollment ? (
                  <div className="text-center py-12">
                    <p className="mb-4">강의를 선택해주세요.</p>
                    {allLessons.length > 0 && (
                      <Button
                        onClick={() => navigateToLesson(allLessons[0])}
                        className="bg-[#5046E4] hover:bg-[#5046E4]/90"
                      >
                        첫 번째 강의 시작하기
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="mb-4">
                      수강 신청 후 강의를 시청할 수 있습니다.
                    </p>
                    <Button
                      onClick={handleEnroll}
                      className="bg-[#5046E4] hover:bg-[#5046E4]/90"
                      disabled={isEnrolling || !userId}
                    >
                      {isEnrolling ? "처리 중..." : "수강 신청하기"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* 강의 개요 탭 */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold mb-4">강의 소개</h2>
                <p className="mb-6">{course.description}</p>
                <h2 className="text-xl font-bold mb-4">학습 목표</h2>
                <ul className="space-y-2">
                  {course.learning_goals?.map((goal) => (
                    <li key={goal.id} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{goal.content}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4">수강 전 필요한 것</h2>
                <ul className="space-y-2">
                  {course.background_knowledge?.map((knowledge) => (
                    <li key={knowledge.id} className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#5046E4] mt-2 flex-shrink-0" />
                      <span>{knowledge.content}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* 커리큘럼 탭 */}
          <TabsContent value="curriculum">
            <div className="space-y-6">
              {course.modules?.map((module, moduleIndex) => (
                <div
                  key={module.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="bg-muted p-4">
                    <h3 className="font-bold">
                      모듈 {moduleIndex + 1}: {module.title}
                    </h3>
                  </div>
                  <div className="divide-y">
                    {module.lectures.map((lecture, lectureIndex) => (
                      <div
                        key={lecture.id}
                        className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigateToLesson(lecture)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#5046E4] text-white flex items-center justify-center text-xs">
                            {moduleIndex + 1}.{lectureIndex + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{lecture.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {Math.floor(lecture.duration_secs / 60)}분
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {enrollment && lecture.progress?.is_completed && (
                            <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                              <Check className="h-4 w-4 text-green-600" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* 강사 소개 탭 */}
          <TabsContent value="instructors">
            <div className="grid md:grid-cols-2 gap-8">
              {course.instructors?.map((instructor) => (
                <Card key={instructor.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={
                            instructor.instructor.avatar_url ||
                            "/placeholder.svg"
                          }
                        />
                        <AvatarFallback>
                          <User className="h-12 w-12" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold">
                          {instructor.instructor.full_name ||
                            instructor.instructor.username}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {instructor.role_title}
                        </p>
                        <p>{instructor.intro_message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* 관련 강의 */}
        {/* TODO: 관련 강의 데이터 구현 후 추가 */}
      </div>
    </div>
  );
}
