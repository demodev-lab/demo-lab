"use client";

import { useQuery } from "@tanstack/react-query";
import { getCourseList, getCourseById } from "../actions/courseAction";

export function useCourses() {
  const {
    data: courses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getCourseList(),
  });

  return {
    courses,
    isLoading,
    error,
  };
}

export function useCourse(id: string) {
  const {
    data: course,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courses", id],
    queryFn: () => getCourseById(id),
    enabled: !!id,
  });

  return {
    course,
    isLoading,
    error,
  };
}
