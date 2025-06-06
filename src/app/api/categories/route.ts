import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  try {
    let queryBuilder = supabase
      .from("categories")
      .select("id, name, description, color")
      .order("name", { ascending: true });

    if (query) {
      queryBuilder = queryBuilder.ilike("name", `%${query}%`);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
