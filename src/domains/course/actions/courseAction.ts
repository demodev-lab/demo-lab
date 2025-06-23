"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { CreateCourseInput } from "../types";
import { revalidatePath } from "next/cache";

export async function createCourse(input: CreateCourseInput) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("Course")
    .insert(input)
    .select()
    .single();

  if (error) throw error;

  // Course 생성 후 관련 경로들 revalidate
  revalidatePath("/admin");
  revalidatePath("/classroom");
  return data;
}

export async function getCourseList() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("Course")
    .select(
      `
      *,
      CourseInstructor (
        instructor:profiles (
          id,
          username,
          avatar_url
        )
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getCourseById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("Course")
    .select(
      `
      *,
      CourseInstructor (
        instructor:profiles (
          id,
          username,
          avatar_url
        )
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateCourse(
  id: string,
  input: Partial<CreateCourseInput>,
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("Course")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // Course 수정 후 관련 경로들 revalidate
  revalidatePath("/admin");
  revalidatePath("/classroom");
  revalidatePath(`/classroom/${id}`);
  return data;
}

export async function deleteCourse(id: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("Course").delete().eq("id", id);

  if (error) throw error;

  // Course 삭제 후 관련 경로들 revalidate
  revalidatePath("/admin");
  revalidatePath("/classroom");
}
