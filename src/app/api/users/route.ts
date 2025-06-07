import { NextResponse } from "next/server";
import {
  createServerSupabaseClient,
  createServerSupabaseAdminClient,
} from "@/utils/supabase/server";
import { PERMISSIONS } from "@/config/permissions";
import { checkPermission } from "@/utils/auth/permission-check";

export const dynamic = "force-dynamic";

type UserProfileSelect = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: string | null;
};

export async function GET() {
  // 목록 조회 권한 체크 (Manager도 가능)
  const permissionCheck = await checkPermission(
    PERMISSIONS.USER_LIST_VIEW.minRole,
  );
  if (!permissionCheck.success) {
    return permissionCheck.response!;
  }

  const supabase = await createServerSupabaseClient();

  // If user has proper permissions, proceed with fetching user list
  const supabaseAdmin = await createServerSupabaseAdminClient();

  // Get profiles data
  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, username, avatar_url, role")
    .order("role", { ascending: true })
    .returns<UserProfileSelect[]>();

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
    return NextResponse.json({ error: profilesError.message }, { status: 500 });
  }

  // Get auth users data to get emails (using admin client)
  const { data: authData, error: authError2 } =
    await supabaseAdmin.auth.admin.listUsers();

  if (authError2) {
    console.error("Error fetching auth users:", authError2);
    return NextResponse.json({ error: authError2.message }, { status: 500 });
  }

  // Safely access users array
  const authUsers = authData?.users || [];

  // Combine profile and auth data
  const formattedUsers = profilesData.map((profile) => {
    const authUser = authUsers.find((user: any) => user.id === profile.id);
    return {
      ...profile,
      email: authUser?.email ?? "No Email",
    };
  });

  return NextResponse.json(formattedUsers);
}
