"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

export async function getUsers() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("profiles").select("*");
  return data;
}
