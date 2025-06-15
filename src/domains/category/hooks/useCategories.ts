import { useQuery } from "@tanstack/react-query";
import { getCategoryList } from "../actions/categoryAction";
import type { Category } from "../types";

export const useCategory = {
  list() {
    return useQuery<Category[]>({
      queryKey: ["categories"],
      queryFn: () => getCategoryList(),
      staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    });
  },
};
