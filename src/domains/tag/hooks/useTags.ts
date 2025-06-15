import { useQuery } from "@tanstack/react-query";
import { getTagList } from "../actions/tagAction";
import type { Tag } from "../types";

export const useTag = {
  list() {
    return useQuery<Tag[]>({
      queryKey: ["tags"],
      queryFn: () => getTagList(),
      staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    });
  },
};
