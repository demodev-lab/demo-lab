import { getDashboardData } from "@/domains/admin/dashboard/actions/dashboardAction";
import { DashboardStats } from "./DashboardStats";

export async function DashboardCards() {
  try {
    const data = await getDashboardData();
    return <DashboardStats initialData={data} />;
  } catch (error) {
    if (error instanceof Error && error.message === "권한이 없습니다") {
      return (
        <div className="text-red-600">대시보드에 접근할 권한이 없습니다.</div>
      );
    }
    return (
      <div className="text-red-600">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }
}
