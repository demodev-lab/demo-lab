"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCourse,
  updateCourse,
  deleteCourse,
} from "../actions/courseAction";
import type { CreateCourseInput, UpdateCourseInput } from "../types";

export function useCourseAdmin() {
  const queryClient = useQueryClient();

  const createCourseMutation = useMutation({
    mutationFn: (input: CreateCourseInput) => createCourse(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("코스가 생성되었습니다.");
    },
    onError: (error) => {
      console.error("Create course error:", error);
      if (error instanceof Error) {
        toast.error(error.message || "코스 생성 중 오류가 발생했습니다.");
      } else {
        toast.error("코스 생성 중 오류가 발생했습니다.");
      }
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({
      id,
      ...input
    }: UpdateCourseInput & { id: string | number }) => updateCourse(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("코스가 수정되었습니다.");
    },
    onError: (error) => {
      console.error("Update course error:", error);
      if (error instanceof Error) {
        toast.error(error.message || "코스 수정 중 오류가 발생했습니다.");
      } else {
        toast.error("코스 수정 중 오류가 발생했습니다.");
      }
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("코스가 삭제되었습니다.");
    },
    onError: (error) => {
      console.error("Delete course error:", error);
      if (error instanceof Error) {
        toast.error(error.message || "코스 삭제 중 오류가 발생했습니다.");
      } else {
        toast.error("코스 삭제 중 오류가 발생했습니다.");
      }
    },
  });

  return {
    createCourse: createCourseMutation.mutate,
    updateCourse: updateCourseMutation.mutate,
    deleteCourse: deleteCourseMutation.mutate,
    isCreating: createCourseMutation.isPending,
    isUpdating: updateCourseMutation.isPending,
    isDeleting: deleteCourseMutation.isPending,
  };
}
