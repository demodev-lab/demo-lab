import { NextResponse } from "next/server";
import {
  createServerSupabaseClient,
  createServerSupabaseAdminClient,
} from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

type UserProfileSelect = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: string | null;
};

export async function GET() {
  const supabase = await createServerSupabaseClient();

  // First, check if the requesting user is authenticated and has proper permissions
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the requesting user's profile to check their role
  const { data: userProfile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !userProfile) {
    return NextResponse.json(
      { error: "User profile not found" },
      { status: 404 },
    );
  }

  // Check if user has admin privileges
  if (userProfile.role !== "admin") {
    return NextResponse.json(
      { error: "Insufficient permissions. Admin role required." },
      { status: 403 },
    );
  }

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
