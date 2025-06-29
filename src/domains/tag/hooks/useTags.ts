import { useQuery } from "@tanstack/react-query";
import { getTagList } from "../actions/tagAction";
import type { Tag } from "../types";

export function useTags() {
  return useQuery<Tag[]>({
    // useQuery를 직접 호출
    queryKey: ["tags"],
    queryFn: () => getTagList(),
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
  });
}
