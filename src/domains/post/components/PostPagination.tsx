import React from "react";
import { Pagination } from "@/components/ui/pagination";
import type { PaginationState } from "@/types/pagination";

interface PostPaginationProps {
  pagination: PaginationState;
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
  return (
    <Pagination
      {...pagination}
      onPageChange={onPageChange}
      loading={loading}
      className={className}
    />
  );
}
