import React from "react";
import { Button } from "@/components/ui/button";
import type { Pagination } from "../types/index";

interface PostPaginationProps {
  pagination: Pagination;
  loading: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PostPagination({
  pagination,
  loading,
  onPageChange,
  className,
}: PostPaginationProps) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div
      className={`flex justify-center items-center space-x-2 pt-4 ${className || ""}`}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={pagination.currentPage <= 1 || loading}
      >
        이전
      </Button>
      <span>
        {pagination.currentPage} / {pagination.totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={pagination.currentPage >= pagination.totalPages || loading}
      >
        다음
      </Button>
    </div>
  );
}
