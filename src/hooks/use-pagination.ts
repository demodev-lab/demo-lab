import { useMemo } from "react";
import type { PaginationItem, PaginationState } from "@/types/pagination";

export function usePagination(pagination: PaginationState) {
  const { currentPage, totalPages } = pagination;

  return useMemo(() => {
    const items: PaginationItem[] = [];
    const maxVisiblePages = 5; // 한 번에 보여줄 페이지 수

    // 현재 페이지 주변의 페이지들을 계산
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // 시작 페이지 조정
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 첫 페이지
    if (startPage > 1) {
      items.push({ page: 1, isCurrent: false, isEllipsis: false });
      if (startPage > 2) {
        items.push({ page: 0, isCurrent: false, isEllipsis: true });
      }
    }

    // 페이지 번호들
    for (let i = startPage; i <= endPage; i++) {
      items.push({
        page: i,
        isCurrent: i === currentPage,
        isEllipsis: false,
      });
    }

    // 마지막 페이지
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push({ page: 0, isCurrent: false, isEllipsis: true });
      }
      items.push({ page: totalPages, isCurrent: false, isEllipsis: false });
    }

    return items;
  }, [currentPage, totalPages]);
}
