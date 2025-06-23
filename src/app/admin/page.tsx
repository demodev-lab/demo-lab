import { redirect } from "next/navigation";

export default function AdminPage() {
  // /admin으로 접근 시 /admin/dashboard로 리다이렉트
  redirect("/admin/dashboard");
}
