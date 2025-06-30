"use client";

import React, { useState } from "react";
import { LectureWithDetails } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Edit,
  Trash,
  Save,
  X,
  GripVertical,
  Clock,
  Video,
} from "lucide-react";
import {
  createLecture,
  updateLecture,
  deleteLecture,
} from "../actions/lectureAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LectureManagerProps {
  courseId: number;
  moduleId: number;
  lectures: LectureWithDetails[];
}

interface LectureForm {
  title: string;
  description: string;
  video_url: string;
  duration_secs: number;
}

export function LectureManager({
  courseId,
  moduleId,
  lectures,
}: LectureManagerProps) {
  const router = useRouter();
  const [isAddingLecture, setIsAddingLecture] = useState(false);
  const [editingLectureId, setEditingLectureId] = useState<number | null>(null);
  const [lectureToDelete, setLectureToDelete] = useState<number | null>(null);

  const [lectureForm, setLectureForm] = useState<LectureForm>({
    title: "",
    description: "",
    video_url: "",
    duration_secs: 0,
  });

  const resetForm = () => {
    setLectureForm({
      title: "",
      description: "",
      video_url: "",
      duration_secs: 0,
    });
  };

  const handleAddLecture = async () => {
    if (!lectureForm.title.trim()) {
      toast.error("강의 제목을 입력해주세요.");
      return;
    }

    try {
      await createLecture({
        course_id: courseId,
        module_id: moduleId,
        title: lectureForm.title,
        description: lectureForm.description || null,
        video_url: lectureForm.video_url || null,
        duration_secs: lectureForm.duration_secs,
        sequence: lectures.length + 1,
      });
      toast.success("강의가 추가되었습니다.");
      resetForm();
      setIsAddingLecture(false);
      router.refresh();
    } catch (error) {
      toast.error("강의 추가에 실패했습니다.");
      console.error(error);
    }
  };

  const handleUpdateLecture = async (lectureId: number) => {
    if (!lectureForm.title.trim()) {
      toast.error("강의 제목을 입력해주세요.");
      return;
    }

    try {
      await updateLecture(lectureId, {
        title: lectureForm.title,
        description: lectureForm.description || null,
        video_url: lectureForm.video_url || null,
        duration_secs: lectureForm.duration_secs,
        course_id: courseId,
      });
      toast.success("강의가 수정되었습니다.");
      setEditingLectureId(null);
      resetForm();
      router.refresh();
    } catch (error) {
      toast.error("강의 수정에 실패했습니다.");
      console.error(error);
    }
  };

  const handleDeleteLecture = async (lectureId: number) => {
    try {
      await deleteLecture(lectureId, courseId);
      toast.success("강의가 삭제되었습니다.");
      setLectureToDelete(null);
      router.refresh();
    } catch (error) {
      toast.error("강의 삭제에 실패했습니다.");
      console.error(error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    } else if (minutes > 0) {
      return `${minutes}분 ${secs}초`;
    } else {
      return `${secs}초`;
    }
  };

  const parseDuration = (input: string): number => {
    // "10:30" 형식을 초로 변환
    const parts = input.split(":");
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      return minutes * 60 + seconds;
    }
    return 0;
  };

  return (
    <div className="space-y-4">
      {/* 강의 추가 버튼 */}
      {!isAddingLecture && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setIsAddingLecture(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          강의 추가
        </Button>
      )}

      {/* 새 강의 추가 폼 */}
      {isAddingLecture && (
        <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
          <Input
            placeholder="강의 제목"
            value={lectureForm.title}
            onChange={(e) =>
              setLectureForm({ ...lectureForm, title: e.target.value })
            }
          />
          <Textarea
            placeholder="강의 설명 (선택사항)"
            value={lectureForm.description}
            onChange={(e) =>
              setLectureForm({ ...lectureForm, description: e.target.value })
            }
            rows={2}
          />
          <Input
            placeholder="동영상 URL"
            value={lectureForm.video_url}
            onChange={(e) =>
              setLectureForm({ ...lectureForm, video_url: e.target.value })
            }
          />
          <Input
            placeholder="강의 시간 (예: 10:30)"
            onChange={(e) =>
              setLectureForm({
                ...lectureForm,
                duration_secs: parseDuration(e.target.value),
              })
            }
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddLecture}>
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsAddingLecture(false);
                resetForm();
              }}
            >
              <X className="h-4 w-4 mr-2" />
              취소
            </Button>
          </div>
        </div>
      )}

      {/* 강의 목록 */}
      {lectures.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-4">
          아직 강의가 없습니다.
        </p>
      ) : (
        <div className="space-y-2">
          {lectures.map((lecture) => (
            <div key={lecture.id}>
              {editingLectureId === lecture.id ? (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                  <Input
                    value={lectureForm.title}
                    onChange={(e) =>
                      setLectureForm({ ...lectureForm, title: e.target.value })
                    }
                  />
                  <Textarea
                    value={lectureForm.description}
                    onChange={(e) =>
                      setLectureForm({
                        ...lectureForm,
                        description: e.target.value,
                      })
                    }
                    rows={2}
                  />
                  <Input
                    value={lectureForm.video_url}
                    onChange={(e) =>
                      setLectureForm({
                        ...lectureForm,
                        video_url: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="강의 시간 (예: 10:30)"
                    defaultValue={`${Math.floor(lectureForm.duration_secs / 60)}:${(lectureForm.duration_secs % 60).toString().padStart(2, "0")}`}
                    onChange={(e) =>
                      setLectureForm({
                        ...lectureForm,
                        duration_secs: parseDuration(e.target.value),
                      })
                    }
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdateLecture(lecture.id)}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      저장
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingLectureId(null);
                        resetForm();
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {lecture.sequence}. {lecture.title}
                      </span>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(lecture.duration_secs)}
                        </span>
                        {lecture.video_url && (
                          <span className="flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            동영상
                          </span>
                        )}
                      </div>
                    </div>
                    {lecture.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {lecture.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingLectureId(lecture.id);
                        setLectureForm({
                          title: lecture.title,
                          description: lecture.description || "",
                          video_url: lecture.video_url || "",
                          duration_secs: lecture.duration_secs,
                        });
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => setLectureToDelete(lecture.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog
        open={lectureToDelete !== null}
        onOpenChange={() => setLectureToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>강의를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 강의와 관련된 모든 데이터가
              삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                lectureToDelete && handleDeleteLecture(lectureToDelete)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
