import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/domains/admin/dashboard/actions/dashboardAction";
import type { DashboardData } from "@/domains/admin/dashboard/types";

export function useDashboardStats(initialData?: DashboardData) {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardData,
    initialData,
    refetchInterval: 30000, // 30초마다 자동 갱신
  });
}
