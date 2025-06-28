"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lecture, Course, Enrollment, LectureProgress } from "../types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { cn } from "@/utils/lib/utils";
import {
  updateLectureProgress,
  completeLecture,
} from "../actions/progressAction";
import { getCourseLecturesWithProgress } from "../actions/lectureAction";
import { toast } from "sonner";

interface LectureDetailProps {
  lecture: Lecture & {
    Module: {
      id: number;
      title: string;
      course_id: number;
      sequence: number;
    };
    LectureKeypoint?: Array<{ id: number; content: string }>;
    LectureMaterial?: Array<{ id: number; title: string; file_url: string }>;
  };
  course: Course;
  enrollment: Enrollment | null;
  progress: LectureProgress | null;
  userId?: string;
}

export function LectureDetail({
  lecture,
  course,
  progress,
  userId,
}: LectureDetailProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [allLectures, setAllLectures] = useState<any[]>([]);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  // 모든 강의 목록 가져오기
  useEffect(() => {
    const fetchAllLectures = async () => {
      try {
        const modules = await getCourseLecturesWithProgress(course.id, userId);
        const lectures = modules.flatMap((module) =>
          module.Lecture.map((lecture: any) => ({
            ...lecture,
            moduleTitle: module.title,
            moduleId: module.id,
          })),
        );
        setAllLectures(lectures);

        // 현재 강의의 인덱스 찾기
        const index = lectures.findIndex((l) => l.id === lecture.id);
        setCurrentLectureIndex(index);
      } catch (error) {
        console.error("Failed to fetch lectures:", error);
      }
    };

    if (course.id) {
      fetchAllLectures();
    }
  }, [course.id, lecture.id, userId]);

  // 비디오 진행 상태 업데이트
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);

      // 5초마다 진도 저장
      if (
        Math.floor(video.currentTime) % 5 === 0 &&
        userId &&
        !isUpdatingProgress
      ) {
        setIsUpdatingProgress(true);
        updateLectureProgress(lecture.id, Math.floor(video.currentTime))
          .then(() => setIsUpdatingProgress(false))
          .catch((error) => {
            console.error("Failed to update progress:", error);
            setIsUpdatingProgress(false);
          });
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (progress?.progress_secs) {
        video.currentTime = progress.progress_secs;
      }
    };

    const handleEnded = async () => {
      setIsPlaying(false);
      if (userId && !progress?.is_completed) {
        try {
          await completeLecture(lecture.id);
          toast.success("강의를 완료했습니다!");
          router.refresh();
        } catch (error) {
          console.error("Failed to complete lecture:", error);
        }
      }
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [lecture.id, userId, progress, router, isUpdatingProgress]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value[0];
  };

  const handlePlaybackRateChange = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, video.currentTime - 10);
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(duration, video.currentTime + 10);
  };

  const navigateToPreviousLecture = () => {
    if (currentLectureIndex > 0) {
      const prevLecture = allLectures[currentLectureIndex - 1];
      router.push(`/classroom/${course.id}/lecture/${prevLecture.id}`);
    }
  };

  const navigateToNextLecture = () => {
    if (currentLectureIndex < allLectures.length - 1) {
      const nextLecture = allLectures[currentLectureIndex + 1];
      router.push(`/classroom/${course.id}/lecture/${nextLecture.id}`);
    }
  };

  const navigateToLecture = (lectureId: number) => {
    router.push(`/classroom/${course.id}/lecture/${lectureId}`);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="container py-6">
        {/* 헤더 네비게이션 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/classroom/${course.id}`)}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              코스로 돌아가기
            </Button>
            <div className="h-4 w-px bg-gray-300" />
            <span className="text-sm text-muted-foreground">
              {lecture.Module.title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={navigateToPreviousLecture}
              disabled={currentLectureIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              이전 강의
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={navigateToNextLecture}
              disabled={currentLectureIndex === allLectures.length - 1}
            >
              다음 강의
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 비디오 플레이어 */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative bg-black">
                {lecture.video_url ? (
                  <>
                    <video
                      ref={videoRef}
                      src={lecture.video_url}
                      className="w-full aspect-video"
                      onClick={togglePlayPause}
                    />

                    {/* 비디오 컨트롤 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      {/* 진행 바 */}
                      <div className="mb-3">
                        <Progress
                          value={progressPercentage}
                          className="h-1 cursor-pointer"
                          onClick={(e) => {
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const percentage = x / rect.width;
                            handleSeek([duration * percentage]);
                          }}
                        />
                      </div>

                      {/* 컨트롤 버튼들 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                            onClick={togglePlayPause}
                          >
                            {isPlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                            onClick={skipBackward}
                          >
                            <SkipBack className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                            onClick={skipForward}
                          >
                            <SkipForward className="h-4 w-4" />
                          </Button>
                          <span className="text-white text-sm">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={playbackRate}
                            onChange={(e) =>
                              handlePlaybackRateChange(Number(e.target.value))
                            }
                            className="bg-transparent text-white text-sm border border-white/20 rounded px-2 py-1"
                          >
                            <option value={0.5}>0.5x</option>
                            <option value={0.75}>0.75x</option>
                            <option value={1}>1x</option>
                            <option value={1.25}>1.25x</option>
                            <option value={1.5}>1.5x</option>
                            <option value={2}>2x</option>
                          </select>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                            onClick={handleFullscreen}
                          >
                            <Maximize className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="aspect-video flex items-center justify-center">
                    <p className="text-white">비디오를 불러올 수 없습니다.</p>
                  </div>
                )}
              </div>

              <CardHeader>
                <CardTitle>{lecture.title}</CardTitle>
                <p className="text-muted-foreground">{lecture.description}</p>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">개요</TabsTrigger>
                    <TabsTrigger value="materials">학습 자료</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">핵심 내용</h3>
                        <ul className="space-y-2">
                          {lecture.LectureKeypoint?.map((keypoint) => (
                            <li
                              key={keypoint.id}
                              className="flex items-start gap-2"
                            >
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{keypoint.content}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="materials">
                    <div className="space-y-2">
                      {lecture.LectureMaterial?.map((material) => (
                        <Card key={material.id}>
                          <CardContent className="p-4">
                            <a
                              href={material.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between hover:text-[#5046E4]"
                            >
                              <span className="font-medium">
                                {material.title}
                              </span>
                              <Button variant="ghost" size="sm">
                                다운로드
                              </Button>
                            </a>
                          </CardContent>
                        </Card>
                      ))}
                      {(!lecture.LectureMaterial ||
                        lecture.LectureMaterial.length === 0) && (
                        <p className="text-muted-foreground">
                          등록된 학습 자료가 없습니다.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* 강의 목록 사이드바 */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted">
                <CardTitle className="text-lg">강의 목록</CardTitle>
              </CardHeader>
              <div className="h-[calc(100vh-300px)] overflow-y-auto">
                {allLectures
                  .reduce((acc: any[], lecture, index) => {
                    const lastModule = acc[acc.length - 1];

                    if (
                      !lastModule ||
                      lastModule.moduleId !== lecture.moduleId
                    ) {
                      acc.push({
                        moduleId: lecture.moduleId,
                        moduleTitle: lecture.moduleTitle,
                        lectures: [{ ...lecture, index }],
                      });
                    } else {
                      lastModule.lectures.push({ ...lecture, index });
                    }

                    return acc;
                  }, [])
                  .map((module, moduleIndex) => (
                    <div key={module.moduleId} className="border-t">
                      <div className="bg-gray-50 p-3">
                        <h4 className="font-medium text-sm">
                          모듈 {moduleIndex + 1}: {module.moduleTitle}
                        </h4>
                      </div>
                      <div className="divide-y">
                        {module.lectures.map(
                          (lec: any, lectureIndex: number) => {
                            const isActive = lec.id === lecture.id;
                            const isCompleted = lec.progress?.is_completed;

                            return (
                              <div
                                key={lec.id}
                                className={cn(
                                  "p-3 flex justify-between items-center cursor-pointer transition-colors",
                                  isActive
                                    ? "bg-[#5046E4]/10"
                                    : "hover:bg-gray-50",
                                )}
                                onClick={() => navigateToLecture(lec.id)}
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
                                    <h5
                                      className={cn(
                                        "text-sm font-medium",
                                        isActive && "text-[#5046E4]",
                                      )}
                                    >
                                      {lec.title}
                                    </h5>
                                    <p className="text-xs text-muted-foreground">
                                      {Math.floor(lec.duration_secs / 60)}분
                                    </p>
                                  </div>
                                </div>
                                {isCompleted && (
                                  <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                                    <Check className="h-4 w-4 text-green-600" />
                                  </div>
                                )}
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
