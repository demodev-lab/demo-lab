"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  User,
} from "lucide-react";
import { cn } from "@/utils/lib/utils";
import { Header } from "@/components/header";
import { TabNavigation } from "@/components/tab-navigation";

interface Instructor {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl?: string;
  content?: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  level: string;
  duration: string;
  totalLessons: number;
  imageUrl: string;
  modules: Module[];
  instructors: Instructor[];
  requirements: string[];
  objectives: string[];
  relatedCourses: string[];
}

export function CourseDetail({ courseId }: { courseId: string }) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeTab, setActiveTab] = useState("lesson");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // 강의 데이터 - 실제 앱에서는 API에서 가져올 것입니다
  const getCourseData = (id: string): Course => {
    const courses = {
      "ai-agency-masterclass": {
        id: "ai-agency-masterclass",
        title: "ClassHive 입문자를 위한 필수 가이드",
        subtitle: "ClassHive Ready: 기초 개념부터 실전까지",
        description:
          "ClassHive를 제대로 활용하기 위한 필수 기초 지식을 배워봅시다! 경험이 없다면, 반드시 이 강의를 먼저 수강하세요. 이 강의는 ClassHive 플랫폼의 모든 기능을 효과적으로 활용하는 방법을 단계별로 안내합니다. 초보자도 쉽게 따라할 수 있는 실습 중심의 커리큘럼으로 구성되어 있습니다.",
        level: "입문",
        duration: "3시간 30분",
        totalLessons: 12,
        imageUrl: "/placeholder.svg?text=ClassHive+입문",
        modules: [
          {
            id: "getting-started",
            title: "시작하기",
            description:
              "ClassHive 플랫폼의 기본 개념과 인터페이스를 소개합니다.",
            lessons: [
              {
                id: "the-ai-brain",
                title: "ClassHive 소개 (여기서 시작하세요)",
                duration: "10:25",
                completed: false,
                videoUrl:
                  "/placeholder.svg?height=720&width=1280&text=ClassHive+소개",
                content: `
                <h2>ClassHive 소개</h2>
                <p>안녕하세요! ClassHive 플랫폼에 오신 것을 환영합니다. 이 강의에서는 ClassHive의 기본 개념과 주요 기능을 소개합니다.</p>
                
                <h3>주요 내용:</h3>
                <ul>
                  <li>ClassHive 플랫폼의 철학과 목표</li>
                  <li>주요 기능 및 인터페이스 소개</li>
                  <li>효과적인 학습을 위한 기본 설정</li>
                  <li>첫 번째 학습 세션 시작하기</li>
                </ul>
                
                <h3>학습 자료:</h3>
                <ul>
                  <li><a href="#">ClassHive 시작 가이드 PDF</a></li>
                  <li><a href="#">플랫폼 둘러보기 체크리스트</a></li>
                </ul>
                `,
              },
              {
                id: "whats-possible",
                title: "ClassHive로 무엇을 할 수 있나요?",
                duration: "8:15",
                completed: false,
                videoUrl:
                  "/placeholder.svg?height=720&width=1280&text=ClassHive+가능성",
                content: `
                <h2>ClassHive로 무엇을 할 수 있나요?</h2>
                <p>이 강의에서는 ClassHive 플랫폼을 활용하여 할 수 있는 다양한 활동과 프로젝트에 대해 알아봅니다.</p>
                
                <h3>주요 내용:</h3>
                <ul>
                  <li>개인 학습 및 그룹 학습 시나리오</li>
                  <li>프로젝트 기반 학습 사례</li>
                  <li>커뮤니티 참여 및 네트워킹</li>
                  <li>학습 성과 추적 및 분석</li>
                </ul>
                
                <h3>학습 자료:</h3>
                <ul>
                  <li><a href="#">성공 사례 모음집</a></li>
                  <li><a href="#">프로젝트 아이디어 템플릿</a></li>
                </ul>
                `,
              },
            ],
          },
          {
            id: "basic-features",
            title: "기본 기능 익히기",
            description: "ClassHive의 핵심 기능을 배우고 실습합니다.",
            lessons: [
              {
                id: "community-features",
                title: "커뮤니티 기능 활용하기",
                duration: "15:30",
                completed: false,
                videoUrl:
                  "/placeholder.svg?height=720&width=1280&text=커뮤니티+기능",
                content: `
                <h2>커뮤니티 기능 활용하기</h2>
                <p>이 강의에서는 ClassHive의 커뮤니티 기능을 효과적으로 활용하는 방법을 배웁니다.</p>
                
                <h3>주요 내용:</h3>
                <ul>
                  <li>토론 참여 및 질문하기</li>
                  <li>자료 공유 및 피드백 받기</li>
                  <li>스터디 그룹 찾기 및 참여하기</li>
                  <li>네트워킹 전략</li>
                </ul>
                
                <h3>학습 자료:</h3>
                <ul>
                  <li><a href="#">효과적인 질문 작성법</a></li>
                  <li><a href="#">커뮤니티 에티켓 가이드</a></li>
                </ul>
                `,
              },
              {
                id: "classroom-features",
                title: "강의실 기능 활용하기",
                duration: "12:45",
                completed: false,
                videoUrl:
                  "/placeholder.svg?height=720&width=1280&text=강의실+기능",
                content: `
                <h2>강의실 기능 활용하기</h2>
                <p>이 강의에서는 ClassHive의 강의실 기능을 효과적으로 활용하는 방법을 배웁니다.</p>
                
                <h3>주요 내용:</h3>
                <ul>
                  <li>강의 검색 및 필터링</li>
                  <li>노트 작성 및 관리</li>
                  <li>학습 진도 추적</li>
                  <li>퀴즈 및 과제 제출</li>
                </ul>
                
                <h3>학습 자료:</h3>
                <ul>
                  <li><a href="#">효과적인 노트 작성법</a></li>
                  <li><a href="#">학습 계획 템플릿</a></li>
                </ul>
                `,
              },
              {
                id: "calendar-features",
                title: "캘린더 기능 활용하기",
                duration: "9:20",
                completed: false,
                videoUrl:
                  "/placeholder.svg?height=720&width=1280&text=캘린더+기능",
                content: `
                <h2>캘린더 기능 활용하기</h2>
                <p>이 강의에서는 ClassHive의 캘린더 기능을 효과적으로 활용하는 방법을 배웁니다.</p>
                
                <h3>주요 내용:</h3>
                <ul>
                  <li>학습 일정 계획 및 관리</li>
                  <li>이벤트 및 마감일 설정</li>
                  <li>알림 설정 및 관리</li>
                  <li>일정 공유 및 협업</li>
                </ul>
                
                <h3>학습 자료:</h3>
                <ul>
                  <li><a href="#">효과적인 시간 관리 가이드</a></li>
                  <li><a href="#">학습 일정 템플릿</a></li>
                </ul>
                `,
              },
            ],
          },
          {
            id: "advanced-features",
            title: "고급 기능 익히기",
            description: "더 효율적인 학습을 위한 고급 기능을 배웁니다.",
            lessons: [
              {
                id: "collaboration-tools",
                title: "협업 도구 활용하기",
                duration: "14:15",
                completed: false,
                videoUrl:
                  "/placeholder.svg?height=720&width=1280&text=협업+도구",
                content: `
                <h2>협업 도구 활용하기</h2>
                <p>이 강의에서는 ClassHive의 협업 도구를 효과적으로 활용하는 방법을 배웁니다.</p>
                
                <h3>주요 내용:</h3>
                <ul>
                  <li>그룹 프로젝트 관리</li>
                  <li>실시간 문서 공동 편집</li>
                  <li>피드백 주고받기</li>
                  <li>화상 회의 및 스터디 세션</li>
                </ul>
                
                <h3>학습 자료:</h3>
                <ul>
                  <li><a href="#">효과적인 협업 가이드</a></li>
                  <li><a href="#">프로젝트 관리 템플릿</a></li>
                </ul>
                `,
              },
              {
                id: "progress-tracking",
                title: "학습 진도 관리하기",
                duration: "11:30",
                completed: false,
                videoUrl:
                  "/placeholder.svg?height=720&width=1280&text=진도+관리",
                content: `
                <h2>학습 진도 관리하기</h2>
                <p>이 강의에서는 ClassHive에서 학습 진도를 효과적으로 관리하는 방법을 배웁니다.</p>
                
                <h3>주요 내용:</h3>
                <ul>
                  <li>학습 목표 설정</li>
                  <li>진도 추적 및 분석</li>
                  <li>학습 패턴 파악</li>
                  <li>개선 전략 수립</li>
                </ul>
                
                <h3>학습 자료:</h3>
                <ul>
                  <li><a href="#">학습 목표 설정 가이드</a></li>
                  <li><a href="#">진도 추적 템플릿</a></li>
                </ul>
                `,
              },
              {
                id: "custom-settings",
                title: "개인 설정 최적화하기",
                duration: "8:45",
                completed: false,
                videoUrl:
                  "/placeholder.svg?height=720&width=1280&text=개인+설정",
                content: `
                <h2>개인 설정 최적화하기</h2>
                <p>이 강의에서는 ClassHive의 개인 설정을 최적화하여 학습 경험을 향상시키는 방법을 배웁니다.</p>
                
                <h3>주요 내용:</h3>
                <ul>
                  <li>인터페이스 사용자 정의</li>
                  <li>알림 및 이메일 설정</li>
                  <li>개인 정보 및 보안 설정</li>
                  <li>접근성 옵션</li>
                </ul>
                
                <h3>학습 자료:</h3>
                <ul>
                  <li><a href="#">개인 설정 체크리스트</a></li>
                  <li><a href="#">보안 가이드</a></li>
                </ul>
                `,
              },
            ],
          },
          {
            id: "practical-application",
            title: "실전 활용",
            description: "배운 내용을 실제 학습에 적용하는 방법을 배웁니다.",
            lessons: [
              {
                id: "learning-path",
                title: "나만의 학습 경로 만들기",
                duration: "16:20",
                completed: false,
                videoUrl:
                  "/placeholder.svg?height=720&width=1280&text=학습+경로",
                content: `
                <h2>나만의 학습 경로 만들기</h2>
                <p>이 강의에서는 ClassHive를 활용하여 개인화된 학습 경로를 설계하는 방법을 배웁니다.</p>
                
                <h3>주요 내용:</h3>
                <ul>
                  <li>학습 목표 및 우선순위 설정</li>
                  <li>강의 및 자료 선택</li>
                  <li>학습 일정 계획</li>
                  <li>진도 관리 및 조정</li>
                </ul>
                
                <h3>학습 자료:</h3>
                <ul>
                  <li><a href="#">학습 경로 설계 템플릿</a></li>
                  <li><a href="#">성공적인 학습 경로 사례</a></li>
                </ul>
                `,
              },
              {
                id: "study-group",
                title: "스터디 그룹 만들고 운영하기",
                duration: "13:10",
                completed: false,
                videoUrl:
                  "/placeholder.svg?height=720&width=1280&text=스터디+그룹",
                content: `
                <h2>스터디 그룹 만들고 운영하기</h2>
                <p>이 강의에서는 ClassHive에서 효과적인 스터디 그룹을 만들고 운영하는 방법을 배웁니다.</p>
                
                <h3>주요 내용:</h3>
                <ul>
                  <li>스터디 그룹 목적 및 규칙 설정</li>
                  <li>멤버 모집 및 관리</li>
                  <li>효과적인 스터디 세션 진행</li>
                  <li>그룹 활동 평가 및 개선</li>
                </ul>
                
                <h3>학습 자료:</h3>
                <ul>
                  <li><a href="#">스터디 그룹 운영 가이드</a></li>
                  <li><a href="#">스터디 세션 템플릿</a></li>
                </ul>
                `,
              },
              {
                id: "final-project",
                title: "최종 프로젝트: 학습 계획 수립하기",
                duration: "20:15",
                completed: false,
                videoUrl:
                  "/placeholder.svg?height=720&width=1280&text=최종+프로젝트",
                content: `
                <h2>최종 프로젝트: 학습 계획 수립하기</h2>
                <p>이 강의에서는 지금까지 배운 내용을 종합하여 자신만의 학습 계획을 수립합니다.</p>
                
                <h3>주요 내용:</h3>
                <ul>
                  <li>학습 목표 및 기간 설정</li>
                  <li>필요한 자료 및 강의 선택</li>
                  <li>일정 및 마일스톤 계획</li>
                  <li>진도 추적 및 평가 방법</li>
                </ul>
                
                <h3>학습 자료:</h3>
                <ul>
                  <li><a href="#">종합 학습 계획 템플릿</a></li>
                  <li><a href="#">자기 평가 체크리스트</a></li>
                </ul>
                `,
              },
            ],
          },
        ],
        instructors: [
          {
            id: "hyungwoo",
            name: "박형우",
            role: "ClassHive 창립자 & 수석 강사",
            bio: "10년 이상의 교육 경험을 가진 전문가로, 학습자 중심의 교육 방법론을 연구하고 적용합니다. ClassHive 플랫폼의 모든 기능을 설계하고 개발한 주역입니다.",
            avatarUrl: "/placeholder.svg?text=H",
          },
          {
            id: "sunghyun",
            name: "고성현",
            role: "커뮤니티 매니저",
            bio: "커뮤니티 활성화와 회원 관리를 담당하며, 모든 회원이 편안하게 참여할 수 있는 환경을 조성합니다. 학습 커뮤니티 운영 전문가입니다.",
            avatarUrl: "/placeholder.svg?text=S",
          },
        ],
        requirements: [
          "기본적인 컴퓨터 사용 능력",
          "인터넷 브라우저 사용 경험",
          "학습에 대한 열정과 의지",
        ],
        objectives: [
          "ClassHive 플랫폼의 모든 기능을 능숙하게 활용할 수 있습니다.",
          "효율적인 학습 계획을 수립하고 실행할 수 있습니다.",
          "커뮤니티 기능을 활용하여 다른 학습자들과 효과적으로 소통할 수 있습니다.",
          "자신만의 학습 경로를 설계하고 관리할 수 있습니다.",
          "스터디 그룹을 만들고 운영할 수 있습니다.",
        ],
        relatedCourses: ["ai-tips", "ai-challenge", "ai-gallery"],
      },
      "ai-tips": {
        id: "ai-tips",
        title: "10X ClassHive TIPS",
        subtitle: "ClassHive를 10배 더 활용하는 팁 자료 모음",
        description:
          "ClassHive의 숨겨진 기능과 활용법을 배워 학습 효율을 높여보세요. 이 강의는 ClassHive를 이미 기본적으로 사용해본 사용자를 위한 중급 과정입니다. 플랫폼을 더욱 효율적으로 활용하는 다양한 팁과 트릭을 배울 수 있습니다.",
        level: "중급",
        duration: "2시간 45분",
        totalLessons: 10,
        imageUrl: "/placeholder.svg?text=10X+TIPS",
        modules: [
          {
            id: "tips-basics",
            title: "기본 팁",
            description:
              "ClassHive를 더 효율적으로 사용하기 위한 기본 팁을 소개합니다.",
            lessons: [
              {
                id: "intro-lesson",
                title: "팁 소개",
                duration: "5:30",
                completed: false,
                videoUrl: "/placeholder.svg?height=720&width=1280&text=팁+소개",
                content: `
                <h2>팁 소개</h2>
                <p>이 강의에서는 ClassHive를 더 효율적으로 활용하기 위한 다양한 팁을 소개합니다.</p>
                
                <h3>주요 내용:</h3>
                <ul>
                  <li>이 강의 시리즈의 목적과 구성</li>
                  <li>팁을 효과적으로 활용하는 방법</li>
                  <li>학습 효율성 향상의 기본 원칙</li>
                </ul>
                
                <h3>학습 자료:</h3>
                <ul>
                  <li><a href="#">팁 활용 가이드</a></li>
                  <li><a href="#">효율성 체크리스트</a></li>
                </ul>
                `,
              },
              {
                id: "whats-possible",
                title: "ClassHive 팁으로 가능한 것들",
                duration: "8:15",
                completed: false,
                videoUrl:
                  "/placeholder.svg?height=720&width=1280&text=팁+가능성",
                content: `
                <h2>ClassHive 팁으로 가능한 것들</h2>
                <p>이 강의에서는 ClassHive 팁을 활용하여 할 수 있는 다양한 활동과 개선점에 대해 알아봅니다.</p>
                
                <h3>주요 내용:</h3>
                <ul>
                  <li>학습 시간 단축 사례</li>
                  <li>정보 관리 효율화 방법</li>
                  <li>협업 품질 향상 전략</li>
                  <li>학습 성과 극대화 방안</li>
                </ul>
                
                <h3>학습 자료:</h3>
                <ul>
                  <li><a href="#">성공 사례 모음집</a></li>
                  <li><a href="#">효율성 향상 템플릿</a></li>
                </ul>
                `,
              },
            ],
          },
          // 다른 모듈 생략...
        ],
        instructors: [
          {
            id: "tim",
            name: "팀 넬름스",
            role: "콘텐츠 디렉터",
            bio: "교육 콘텐츠 개발과 품질 관리를 담당하며, 최신 트렌드를 반영한 커리큘럼을 설계합니다. ClassHive 플랫폼을 가장 효율적으로 활용하는 전문가입니다.",
            avatarUrl: "/placeholder.svg?text=T",
          },
        ],
        requirements: [
          "ClassHive 기본 기능에 대한 이해",
          "ClassHive 입문자를 위한 필수 가이드 수강 완료",
          "중급 수준의 컴퓨터 활용 능력",
        ],
        objectives: [
          "ClassHive의 숨겨진 고급 기능을 활용할 수 있습니다.",
          "학습 생산성을 크게 향상시킬 수 있습니다.",
          "키보드 단축키를 활용하여 작업 속도를 높일 수 있습니다.",
          "맞춤형 템플릿을 만들고 활용할 수 있습니다.",
          "학습 데이터를 분석하여 학습 효율을 개선할 수 있습니다.",
        ],
        relatedCourses: ["ai-agency-masterclass", "ai-challenge", "ai-gallery"],
      },
      // 다른 강의 데이터 생략...
    };

    return courses[id] || courses["ai-agency-masterclass"]; // 기본값으로 첫 번째 강의 반환
  };

  const course = getCourseData(courseId);

  // 모든 강의 목록을 하나의 배열로 합치기
  const allLessons = useMemo(() => {
    return course.modules.flatMap((module) => module.lessons);
  }, [course.modules]);

  // 전체 강의 진행률 계산
  const calculateOverallProgress = () => {
    const totalLessons = allLessons.length;
    const completedLessons = allLessons.filter(
      (lesson) => lesson.completed,
    ).length;
    return totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;
  };

  const overallProgress = calculateOverallProgress();

  // 페이지 로드 시 첫 번째 강의 자동 선택
  useEffect(() => {
    if (allLessons.length > 0 && !activeLesson) {
      setActiveLesson(allLessons[0]);
    }
  }, [allLessons, activeLesson]);

  // 비디오 이벤트 처리
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      if (activeLesson) {
        markLessonAsCompleted(activeLesson.id);
      }
    };

    // 에러 핸들러 추가
    const handleError = (e) => {
      console.log("비디오 에러:", e);
      setIsPlaying(false);
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
    };
  }, [activeLesson]);

  // 강의 완료 표시
  const markLessonAsCompleted = (lessonId: string) => {
    // 실제 앱에서는 서버에 완료 상태를 저장할 것입니다
    console.log(`강의 ${lessonId} 완료 표시`);
  };

  // 재생/일시정지 토글
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      // 재생 프로미스 처리로 AbortError 방지
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // 재생 시작 성공
          })
          .catch((error) => {
            // 자동 재생 방지 또는 다른 오류 발생
            console.log("재생 오류:", error);
            setIsPlaying(false);
          });
      }
    }
  };

  // 재생 속도 변경
  const changePlaybackRate = () => {
    const video = videoRef.current;
    if (!video) return;

    const rates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];

    setPlaybackRate(newRate);
    video.playbackRate = newRate;
  };

  // 시간 포맷팅
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 특정 강의로 이동
  const navigateToLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setActiveTab("lesson"); // 강의 탭으로 전환
  };

  // 다음 강의 가져오기
  const getNextLesson = () => {
    if (!activeLesson) return null;
    const currentIndex = allLessons.findIndex(
      (lesson) => lesson.id === activeLesson.id,
    );
    if (currentIndex < allLessons.length - 1) {
      return allLessons[currentIndex + 1];
    }
    return null;
  };

  // 이전 강의 가져오기
  const getPrevLesson = () => {
    if (!activeLesson) return null;
    const currentIndex = allLessons.findIndex(
      (lesson) => lesson.id === activeLesson.id,
    );
    if (currentIndex > 0) {
      return allLessons[currentIndex - 1];
    }
    return null;
  };

  const nextLesson = getNextLesson();
  const prevLesson = getPrevLesson();

  // 관련 강의로 이동
  const navigateToRelatedCourse = (relatedCourseId: string) => {
    router.push(`/classroom/${relatedCourseId}`);
  };

  const handleTabNavigation = (tab: string) => {
    switch (tab) {
      case "community":
        router.push("/");
        break;
      case "classroom":
        router.push("/classroom");
        break;
      case "calendar":
        router.push("/calendar");
        break;
      case "members":
        router.push("/members");
        break;
      case "about":
        router.push("/about");
        break;
      default:
        router.push("/");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <TabNavigation activeTab="classroom" setActiveTab={handleTabNavigation} />

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
                <span>{course.level}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">강의 시간:</span>
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">총 강의 수:</span>
                <span>{course.totalLessons}개</span>
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
                  {course.modules.map((module, moduleIndex) => (
                    <div key={module.id} className="border-t">
                      <div className="bg-gray-50 p-3">
                        <h4 className="font-medium text-sm">
                          모듈 {moduleIndex + 1}: {module.title}
                        </h4>
                      </div>
                      <div className="divide-y">
                        {module.lessons.map((lesson, lessonIndex) => {
                          const isActive = activeLesson?.id === lesson.id;

                          return (
                            <div
                              key={lesson.id}
                              className={cn(
                                "p-3 flex justify-between items-center cursor-pointer",
                                isActive ? "bg-amber-50" : "hover:bg-gray-50",
                              )}
                              onClick={() => navigateToLesson(lesson)}
                            >
                              <div className="flex items-start gap-2">
                                <div
                                  className={cn(
                                    "flex-shrink-0 w-6 h-6 rounded-full text-white flex items-center justify-center text-xs",
                                    isActive ? "bg-[#5046E4]" : "bg-gray-400",
                                  )}
                                >
                                  {moduleIndex + 1}.{lessonIndex + 1}
                                </div>
                                <div>
                                  <h5 className="text-sm font-medium">
                                    {lesson.title}
                                  </h5>
                                  <p className="text-xs text-muted-foreground">
                                    {lesson.duration}
                                  </p>
                                </div>
                              </div>
                              {lesson.completed && (
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
                {activeLesson ? (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      {activeLesson.title}
                    </h2>

                    {/* 비디오 플레이어 */}
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
                      <video
                        ref={videoRef}
                        className="w-full h-full"
                        poster="/placeholder.svg?height=720&width=1280&text=강의+영상"
                        onClick={togglePlayPause}
                        onError={(e) => {
                          console.log("비디오 에러:", e);
                          e.currentTarget.onerror = null;
                          setIsPlaying(false);
                        }}
                        preload="metadata"
                      >
                        {activeLesson?.videoUrl && (
                          <source
                            src={activeLesson.videoUrl}
                            type="video/mp4"
                          />
                        )}
                        브라우저가 비디오 태그를 지원하지 않습니다.
                      </video>

                      {/* 재생 버튼 오버레이 */}
                      {!isPlaying && (
                        <div
                          className="absolute inset-0 flex items-center justify-center cursor-pointer"
                          onClick={togglePlayPause}
                        >
                          <div className="bg-white bg-opacity-80 rounded-full p-6">
                            <Play className="h-12 w-12 text-gray-800" />
                          </div>
                        </div>
                      )}

                      {/* 비디오 컨트롤 */}
                      <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white rounded-md px-4 py-2 flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                          onClick={togglePlayPause}
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4 mr-1" />
                          ) : (
                            <Play className="h-4 w-4 mr-1" />
                          )}
                          {isPlaying ? "일시정지" : "재생"}
                        </Button>

                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20"
                            onClick={changePlaybackRate}
                          >
                            {playbackRate}×
                          </Button>

                          <div className="text-sm">
                            {formatTime(currentTime)} /{" "}
                            {formatTime(duration || 0)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 강의 내용 */}
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: activeLesson.content || "",
                      }}
                    />

                    {/* 이전/다음 강의 버튼 */}
                    <div className="flex justify-between mt-8 pt-4 border-t">
                      {prevLesson ? (
                        <Button
                          variant="outline"
                          onClick={() => navigateToLesson(prevLesson)}
                          className="flex items-center"
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          이전 강의
                        </Button>
                      ) : (
                        <div></div>
                      )}

                      {nextLesson && (
                        <Button
                          onClick={() => navigateToLesson(nextLesson)}
                          className="flex items-center bg-[#5046E4] hover:bg-[#5046E4]/90"
                        >
                          다음 강의
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p>강의를 선택해주세요.</p>
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
                  {course.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4">수강 전 필요한 것</h2>
                <ul className="space-y-2">
                  {course.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#5046E4] mt-2 flex-shrink-0" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* 커리큘럼 탭 */}
          <TabsContent value="curriculum">
            <div className="space-y-6">
              {course.modules.map((module, moduleIndex) => (
                <div
                  key={module.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="bg-muted p-4">
                    <h3 className="font-bold">
                      모듈 {moduleIndex + 1}: {module.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                  <div className="divide-y">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigateToLesson(lesson)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#5046E4] text-white flex items-center justify-center text-xs">
                            {moduleIndex + 1}.{lessonIndex + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{lesson.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {lesson.duration}
                            </p>
                          </div>
                        </div>
                        {lesson.completed && (
                          <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                            <Check className="h-4 w-4 text-green-600" />
                          </div>
                        )}
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
              {course.instructors.map((instructor) => (
                <Card key={instructor.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={instructor.avatarUrl || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          <User className="h-12 w-12" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold">{instructor.name}</h3>
                        <p className="text-muted-foreground mb-4">
                          {instructor.role}
                        </p>
                        <p>{instructor.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* 관련 강의 */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">관련 강의</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {course.relatedCourses.map((relatedCourseId) => {
              const relatedCourse = getCourseData(relatedCourseId);
              return (
                <Card
                  key={relatedCourseId}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigateToRelatedCourse(relatedCourseId)}
                >
                  <div className="aspect-video relative bg-muted">
                    <Image
                      src={relatedCourse.imageUrl || "/placeholder.svg"}
                      alt={relatedCourse.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">
                      {relatedCourse.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {relatedCourse.subtitle}
                    </p>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedCourse.description}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">난이도:</span>
                      <span>{relatedCourse.level}</span>
                      <span className="mx-2">•</span>
                      <span>{relatedCourse.duration}</span>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
