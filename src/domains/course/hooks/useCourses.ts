"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getCourseList,
  getAllCourses,
  getCourseById,
} from "../actions/courseAction";

export function useCourses(includeAll = false) {
  const {
    data: courses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courses", includeAll ? "all" : "active"],
    queryFn: () => (includeAll ? getAllCourses() : getCourseList()),
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
