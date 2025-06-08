import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { canViewUsers } from "@/utils/permissions/permissions";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await canViewUsers())) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 },
    );
  }

  try {
    const supabase = await createServerSupabaseClient();

    // RPC 함수를 사용하여 이메일과 프로필 정보를 함께 가져옴
    const { data: users, error } = await supabase.rpc(
      "get_users_with_profiles",
    );

    if (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(users || []);
  } catch (error: any) {
    console.error("Error in users API:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
