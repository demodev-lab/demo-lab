import { useQuery } from "@tanstack/react-query";
import { getCategoryList } from "../actions/categoryAction";
import type { Category } from "../types";

export function useCategories() {
  return useQuery<Category[]>({
    // useQuery를 직접 호출
    queryKey: ["categories"],
    queryFn: () => getCategoryList(),
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
  });
}
