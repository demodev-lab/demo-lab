import { createServerSupabaseClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// 이 레이아웃과 하위 페이지들을 항상 동적으로 렌더링하도록 설정하여,
// 빌드 시점이 아닌 요청 시점에 사용자 정보를 확인하도록 합니다.
// 유저 role은 로그인 시점에 확인하므로 빌드 시점에는 유저 role을 확인하지 않습니다.
export const dynamic = "force-dynamic";

// 역할 확인을 위한 DB 함수를 호출하는 헬퍼 함수
async function getUserRole(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const role = await getUserRole(supabase);

  // admin 또는 manager가 아니면 메인 페이지로 리디렉션
  if (role !== "admin" && role !== "manager") {
    redirect("/");
  }

  return <>{children}</>;
}
