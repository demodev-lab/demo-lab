"use client";

import { useEffect, useState } from "react";
import { CourseApplication } from "../types";
import {
  getPendingCourses,
  approveCourse,
  rejectCourse,
} from "../actions/courseAction";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Phone, User } from "lucide-react";

interface CourseApplicationWithApplicant extends CourseApplication {
  applicant?: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export function PendingCourseList() {
  const [courses, setCourses] = useState<CourseApplicationWithApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] =
    useState<CourseApplicationWithApplicant | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  const fetchPendingCourses = async () => {
    try {
      const data = await getPendingCourses();
      setCourses(data as CourseApplicationWithApplicant[]);
    } catch (error) {
      toast.error("대기 중인 코스 목록을 불러오는데 실패했습니다.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (courseId: number) => {
    setProcessingId(courseId);
    try {
      await approveCourse(courseId);
      toast.success("코스가 승인되었습니다.");
      await fetchPendingCourses();
    } catch (error) {
      toast.error("코스 승인에 실패했습니다.");
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectClick = (course: CourseApplicationWithApplicant) => {
    setSelectedCourse(course);
    setRejectDialogOpen(true);
    setRejectionReason("");
  };

  const handleReject = async () => {
    if (!selectedCourse || !rejectionReason.trim()) {
      toast.error("거절 사유를 입력해주세요.");
      return;
    }

    setProcessingId(selectedCourse.id);
    try {
      await rejectCourse(selectedCourse.id, rejectionReason);
      toast.success("코스가 거절되었습니다.");
      setRejectDialogOpen(false);
      await fetchPendingCourses();
    } catch (error) {
      toast.error("코스 거절에 실패했습니다.");
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="text-center py-4">로딩 중...</div>;
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        승인 대기 중인 코스가 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{course.title}</CardTitle>
                  {course.subtitle && (
                    <CardDescription>{course.subtitle}</CardDescription>
                  )}
                </div>
                <Badge variant="secondary">{course.difficulty}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{course.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">신청자:</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={course.applicant?.avatar_url || ""} />
                      <AvatarFallback>
                        {course.applicant?.username?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {course.applicant?.full_name ||
                        course.applicant?.username ||
                        "Unknown"}
                    </span>
                  </div>
                </div>

                {course.applicant_email && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground ml-6">이메일:</span>
                    <span>{course.applicant_email}</span>
                  </div>
                )}

                {course.applicant_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">연락처:</span>
                    <span>{course.applicant_phone}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">신청일:</span>
                  <span>{formatDate(course.applied_at)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button
                onClick={() => handleApprove(course.id)}
                disabled={processingId === course.id}
              >
                {processingId === course.id ? "처리 중..." : "승인"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleRejectClick(course)}
                disabled={processingId === course.id}
              >
                거절
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>코스 거절</DialogTitle>
            <DialogDescription>
              &quot;{selectedCourse?.title}&quot; 코스를 거절하시겠습니까? 거절
              사유를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="거절 사유를 입력해주세요..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim() || processingId !== null}
            >
              {processingId ? "처리 중..." : "거절"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
