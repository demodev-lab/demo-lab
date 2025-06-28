"use client";

import React from "react";
import { CourseWithDetails, Enrollment } from "../types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen, Award } from "lucide-react";
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
  const [isEnrolling, setIsEnrolling] = React.useState(false);

  // 전체 강의 시간 계산
  const totalDurationHours = Math.floor(course.total_duration_secs / 3600);
  const totalDurationMinutes = Math.floor(
    (course.total_duration_secs % 3600) / 60,
  );

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

  // 첫 강의로 이동
  const handleStartLearning = () => {
    if (course.modules && course.modules.length > 0) {
      const firstModule = course.modules[0];
      if (firstModule.lectures && firstModule.lectures.length > 0) {
        const firstLecture = firstModule.lectures[0];
        router.push(`/classroom/${course.id}/lecture/${firstLecture.id}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 영역 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 코스 정보 */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <Badge variant="secondary" className="mb-2">
                  {course.difficulty}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              {course.subtitle && (
                <p className="text-xl text-gray-600 mb-4">{course.subtitle}</p>
              )}
              <p className="text-gray-700 mb-6">{course.description}</p>

              {/* 코스 통계 */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">
                    {totalDurationHours > 0 && `${totalDurationHours}시간 `}
                    {totalDurationMinutes}분
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">
                    {course.total_lecture_count}개 강의
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">
                    {course.modules?.length || 0}개 모듈
                  </span>
                </div>
              </div>

              {/* 강사 정보 */}
              {course.instructors && course.instructors.length > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-gray-600">강사:</span>
                  {course.instructors.map((instructor) => (
                    <div
                      key={instructor.id}
                      className="flex items-center gap-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <Users className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="font-medium">
                        {instructor.instructor.full_name ||
                          instructor.instructor.username ||
                          "강사"}
                      </span>
                      {instructor.role_title && (
                        <span className="text-sm text-gray-500">
                          ({instructor.role_title})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 수강 카드 */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>수강 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  {enrollment ? (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>진도율</span>
                          <span>{progress?.progressPercentage || 0}%</span>
                        </div>
                        <Progress value={progress?.progressPercentage || 0} />
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>
                          전체 {progress?.totalLectures || 0}개 중{" "}
                          {progress?.completedLectures || 0}개 완료
                        </p>
                        <p className="mt-1">상태: {enrollment.status}</p>
                      </div>
                      <Button
                        onClick={handleStartLearning}
                        className="w-full"
                        size="lg"
                      >
                        학습 이어하기
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        아직 수강 신청하지 않은 코스입니다.
                      </p>
                      <Button
                        onClick={handleEnroll}
                        className="w-full"
                        size="lg"
                        disabled={isEnrolling || !userId}
                      >
                        {isEnrolling ? "처리 중..." : "수강 신청하기"}
                      </Button>
                      {!userId && (
                        <p className="text-sm text-gray-500 text-center">
                          로그인이 필요합니다.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 코스 상세 정보 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 학습 목표 */}
            {course.learning_goals && course.learning_goals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>학습 목표</CardTitle>
                  <CardDescription>
                    이 코스를 통해 달성할 수 있는 목표입니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.learning_goals.map((goal) => (
                      <li key={goal.id} className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{goal.content}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* 필요한 배경 지식 */}
            {course.background_knowledge &&
              course.background_knowledge.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>필요한 배경 지식</CardTitle>
                    <CardDescription>
                      이 코스를 수강하기 전에 알아두면 좋은 내용입니다.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {course.background_knowledge.map((knowledge) => (
                        <li
                          key={knowledge.id}
                          className="flex items-start gap-2"
                        >
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>{knowledge.content}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

            {/* 커리큘럼 */}
            <Card>
              <CardHeader>
                <CardTitle>커리큘럼</CardTitle>
                <CardDescription>
                  전체 {course.modules?.length || 0}개 모듈,{" "}
                  {course.total_lecture_count}개 강의
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.modules?.map((module, moduleIndex) => (
                    <div key={module.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3">
                        모듈 {moduleIndex + 1}: {module.title}
                      </h4>
                      <div className="space-y-2">
                        {module.lectures.map((lecture, lectureIndex) => (
                          <div
                            key={lecture.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">
                                {moduleIndex + 1}-{lectureIndex + 1}
                              </span>
                              <span>{lecture.title}</span>
                            </div>
                            <span className="text-gray-500">
                              {Math.floor(lecture.duration_secs / 60)}분
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 추가 정보 */}
          <div className="lg:col-span-1">
            {/* 강사 소개 */}
            {course.instructors && course.instructors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>강사 소개</CardTitle>
                </CardHeader>
                <CardContent>
                  {course.instructors.map((instructor) => (
                    <div key={instructor.id} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {instructor.instructor.full_name ||
                              instructor.instructor.username}
                          </p>
                          {instructor.role_title && (
                            <p className="text-sm text-gray-500">
                              {instructor.role_title}
                            </p>
                          )}
                        </div>
                      </div>
                      {instructor.intro_message && (
                        <p className="text-sm text-gray-600">
                          {instructor.intro_message}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
