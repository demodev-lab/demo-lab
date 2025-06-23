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
      toast.success("강좌가 생성되었습니다.");
    },
    onError: (error) => {
      toast.error("강좌 생성 중 오류가 발생했습니다.");
      return error;
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ id, ...input }: UpdateCourseInput) =>
      updateCourse(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("강좌가 수정되었습니다.");
    },
    onError: (error) => {
      toast.error("강좌 수정 중 오류가 발생했습니다.");
      return error;
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("강좌가 삭제되었습니다.");
    },
    onError: (error) => {
      toast.error("강좌 삭제 중 오류가 발생했습니다.");
      return error;
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
