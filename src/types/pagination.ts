export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export interface PaginationProps extends PaginationState {
  onPageChange: (page: number) => void;
  loading?: boolean;
  className?: string;
}

export interface PaginationItem {
  page: number;
  isCurrent: boolean;
  isEllipsis: boolean;
}
