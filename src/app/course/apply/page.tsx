import { CourseApplicationForm } from "@/domains/course/components/CourseApplicationForm";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function CourseApplicationPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-2">코스 등록 신청</h1>
      <p className="text-muted-foreground mb-8">
        새로운 코스를 등록하려면 아래 양식을 작성해주세요. 관리자가 검토 후 승인
        여부를 알려드립니다.
      </p>
      <CourseApplicationForm userId={user.id} userEmail={user.email} />
    </div>
  );
}
