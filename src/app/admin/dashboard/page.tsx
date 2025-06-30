import { DashboardCards } from "./components/DashboardCards";

export default async function DashboardPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">demo-lab 관리자 대시보드</h1>
      <DashboardCards />
    </>
  );
}
