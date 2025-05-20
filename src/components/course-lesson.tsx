"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { cn } from "@/utils/lib/utils";
import { Header } from "@/components/header";
import { TabNavigation } from "@/components/tab-navigation";

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
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

export function CourseLesson({
  courseId,
  lessonId,
}: {
  courseId: string;
  lessonId: string;
}) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Add this function after the useState declarations
  const getCourseData = (id: string): Course => {
    // This is a simplified example - in a real app, you would fetch this from an API
    if (id === "ai-tips") {
      return {
        id: "ai-tips",
        title: "10X ClassHive TIPS",
        description: "ClassHive를 10배 더 활용하는 팁 자료 모음",
        modules: [
          {
            id: "tips-basics",
            title: "Basic Tips",
            lessons: [
              {
                id: "intro-lesson",
                title: "Introduction to Tips",
                duration: "5:30",
                completed: false,
                videoUrl:
                  "/placeholder.svg?height=720&width=1280&text=Tips+Intro",
              },
              {
                id: "whats-possible",
                title: "What's possible with ClassHive Tips",
                duration: "8:15",
                completed: false,
                videoUrl:
                  "/placeholder.svg?height=720&width=1280&text=ClassHive+Tips+Possibilities",
              },
            ],
          },
        ],
      };
    }

    // Default to the original course data
    return {
      id: "ai-agency-masterclass",
      title: "AI Agency Masterclass",
      description: "Learn how to build and scale your AI agency",
      modules: [
        {
          id: "getting-started",
          title: "Getting Started",
          lessons: [
            {
              id: "the-ai-brain",
              title: "The AI Brain (Start Here)",
              duration: "10:25",
              completed: false,
              videoUrl:
                "/placeholder.svg?height=720&width=1280&text=The+AI+Brain",
            },
            {
              id: "whats-possible",
              title: "What's possible with AI Agency?",
              duration: "8:15",
              completed: false,
              videoUrl:
                "/placeholder.svg?height=720&width=1280&text=AI+Agency+Possibilities",
            },
          ],
        },
        {
          id: "client-acquisition",
          title: "Client Acquisition",
          lessons: [
            {
              id: "get-a-client",
              title: "Get a client, if you finish the videos...",
              duration: "1:43",
              completed: true,
              videoUrl:
                "/placeholder.svg?height=720&width=1280&text=Get+a+Client",
            },
            {
              id: "powerful-ai-tool",
              title: "THE most POWERFUL AI Tool",
              duration: "15:30",
              completed: false,
              videoUrl:
                "/placeholder.svg?height=720&width=1280&text=Powerful+AI+Tool",
            },
          ],
        },
        {
          id: "implementation",
          title: "Implementation",
          lessons: [
            {
              id: "signin-testmyprompt",
              title: "Signin to Testmyprompt.com",
              duration: "5:45",
              completed: false,
              videoUrl:
                "/placeholder.svg?height=720&width=1280&text=Testmyprompt+Signin",
            },
            {
              id: "openai-api-key",
              title: "Get an OpenAI API key",
              duration: "3:20",
              completed: false,
              videoUrl:
                "/placeholder.svg?height=720&width=1280&text=OpenAI+API+Key",
            },
            {
              id: "build-ai-agent",
              title: "Build your first AI Agent",
              duration: "12:10",
              completed: false,
              videoUrl:
                "/placeholder.svg?height=720&width=1280&text=Build+AI+Agent",
            },
            {
              id: "test-ai-agent",
              title: "Test your AI Agent",
              duration: "8:55",
              completed: false,
              videoUrl:
                "/placeholder.svg?height=720&width=1280&text=Test+AI+Agent",
            },
            {
              id: "fix-ai-agent",
              title: "Get AI to fix your AI Agent",
              duration: "7:30",
              completed: false,
              videoUrl:
                "/placeholder.svg?height=720&width=1280&text=Fix+AI+Agent",
            },
          ],
        },
        {
          id: "next-steps",
          title: "Next Steps",
          lessons: [
            {
              id: "part-2",
              title: "Go to Part 2... (Finishing the AI)",
              duration: "1:15",
              completed: false,
              videoUrl:
                "/placeholder.svg?height=720&width=1280&text=Part+2+Preview",
            },
          ],
        },
      ],
    };
  };

  // Replace the courseData useState with this:
  const [courseData, setCourseData] = useState<Course>(getCourseData(courseId));

  // Flatten all lessons for easy navigation - use useMemo to avoid recalculation on every render
  const allLessons = useMemo(() => {
    return courseData.modules.flatMap((module) => module.lessons);
  }, [courseData]);

  // Calculate overall course progress
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

  // Mark a lesson as completed
  const markLessonAsCompleted = (lessonId: string) => {
    setCourseData((prevCourse) => {
      const updatedModules = prevCourse.modules.map((module) => {
        const updatedLessons = module.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson,
        );
        return { ...module, lessons: updatedLessons };
      });
      return { ...prevCourse, modules: updatedModules };
    });

    // Also update activeLesson if it's the current lesson
    if (activeLesson && activeLesson.id === lessonId) {
      setActiveLesson({ ...activeLesson, completed: true });
    }
  };

  // Find current lesson
  useEffect(() => {
    // Check if we're looking at a course that exists in our data
    if (courseId !== courseData.id) {
      console.warn(`Course ${courseId} not found in data`);
      // Could redirect to a 404 page or show an error message
    }

    const lesson = allLessons.find((lesson) => lesson.id === lessonId);
    if (lesson && (!activeLesson || activeLesson.id !== lesson.id)) {
      setActiveLesson(lesson);
    } else if (!lesson) {
      console.warn(`Lesson ${lessonId} not found in course ${courseId}`);
      // Could redirect to the first lesson or show an error message
    }
  }, [lessonId, allLessons, courseId, courseData.id]);

  // Handle video events
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

    // Add error handler
    const handleError = (e) => {
      console.log("Video error in event listener:", e);
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
  }, [activeLesson?.id]); // Only depend on the lesson ID, not the entire object

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      // Handle the play promise to avoid AbortError
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
          })
          .catch((error) => {
            // Auto-play was prevented or another error occurred
            console.log("Play error:", error);
            setIsPlaying(false);
          });
      }
    }
  };

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const navigateToLesson = (lessonId: string) => {
    router.push(`/classroom/${courseId}/${lessonId}`);
  };

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

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with lesson list */}
        <div className="w-full md:w-96 bg-gray-50 border-r overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{courseData.title}</h2>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Course Progress</span>
                <span>{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>

            {courseData.modules.map((module, moduleIndex) => (
              <div key={module.id} className="mb-6">
                {moduleIndex > 0 && (
                  <div className="text-sm font-medium text-gray-500 mb-2">
                    {module.title}
                  </div>
                )}

                <div className="space-y-2">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const isActive = lesson.id === activeLesson?.id;

                    return (
                      <div
                        key={lesson.id}
                        className={cn(
                          "p-3 rounded-md cursor-pointer transition-colors",
                          isActive ? "bg-amber-100" : "hover:bg-gray-100",
                        )}
                        onClick={() => navigateToLesson(lesson.id)}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {moduleIndex + 1}.{lessonIndex + 1}.{" "}
                              {lesson.title}
                            </div>

                            {/* No individual progress display */}
                          </div>

                          {lesson.completed && (
                            <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                              <Check className="h-4 w-4 text-green-600" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto">
          {activeLesson ? (
            <div className="p-6 max-w-5xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">{activeLesson.title}</h1>

              {/* Video player */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  poster="/placeholder.svg?height=720&width=1280&text=AI+101"
                  onClick={togglePlayPause}
                  onError={(e) => {
                    console.log("Video error:", e);
                    // Prevent unhandled promise rejection
                    e.currentTarget.onerror = null;
                    setIsPlaying(false);
                  }}
                  preload="metadata"
                >
                  {activeLesson?.videoUrl && (
                    <source src={activeLesson.videoUrl} type="video/mp4" />
                  )}
                  Your browser does not support the video tag.
                </video>

                {/* Play button overlay */}
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

                {/* Video controls */}
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
                    {isPlaying ? "Pause" : "Play"}
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
                      {formatTime(currentTime)} / {formatTime(duration || 0)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lesson content */}
              <div className="prose max-w-none">
                <h2>Lesson Content</h2>
                <p>
                  This lesson covers how to acquire your first client for your
                  AI agency. You&rsquoll learn effective strategies for client
                  outreach, positioning your services, and closing deals with
                  confidence.
                </p>

                <h3>Key Points:</h3>
                <ul>
                  <li>Identifying your ideal client profile</li>
                  <li>Creating a compelling AI service offering</li>
                  <li>Demonstrating value through case studies</li>
                  <li>Pricing strategies for AI services</li>
                  <li>Effective follow-up techniques</li>
                </ul>

                <h3>Resources:</h3>
                <ul>
                  <li>
                    <a href="#">Client Acquisition Template</a>
                  </li>
                  <li>
                    <a href="#">Sample Proposal Document</a>
                  </li>
                  <li>
                    <a href="#">AI Service Pricing Guide</a>
                  </li>
                </ul>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8 pt-4 border-t">
                {prevLesson ? (
                  <Button
                    variant="outline"
                    onClick={() => navigateToLesson(prevLesson.id)}
                    className="flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous Lesson
                  </Button>
                ) : (
                  <div></div>
                )}

                {nextLesson && (
                  <Button
                    onClick={() => navigateToLesson(nextLesson.id)}
                    className="flex items-center bg-[#5046E4] hover:bg-[#5046E4]/90"
                  >
                    Next Lesson
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p>Lesson not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
