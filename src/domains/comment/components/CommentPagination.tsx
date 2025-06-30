import React from "react";
import { Pagination } from "@/components/ui/pagination";
import type { PaginationState } from "@/types/pagination";

interface CommentPaginationProps {
  pagination: PaginationState;
  loading: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}

export function CommentPagination({
  pagination,
  loading,
  onPageChange,
  className,
}: CommentPaginationProps) {
  return (
    <Pagination
      {...pagination}
      onPageChange={onPageChange}
      loading={loading}
      className={className}
    />
  );
}
