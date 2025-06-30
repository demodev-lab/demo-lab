import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/utils/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePagination } from "@/hooks/use-pagination";
import type { PaginationProps } from "@/types/pagination";

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  loading = false,
  className,
}: PaginationProps) {
  const items = usePagination({ currentPage, totalPages, totalCount });

  if (totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="페이지네이션"
      className={cn("mx-auto flex w-full justify-center", className)}
    >
      <ul className="flex flex-row items-center gap-1">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "default",
              }),
              "gap-1 pl-2.5",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>이전</span>
          </button>
        </li>

        {items.map((item, index) => (
          <li key={index}>
            {item.isEllipsis ? (
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">더 많은 페이지</span>
              </span>
            ) : (
              <button
                onClick={() => onPageChange(item.page)}
                disabled={loading}
                className={cn(
                  buttonVariants({
                    variant: item.isCurrent ? "outline" : "ghost",
                    size: "icon",
                  }),
                  "h-9 w-9",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                )}
                aria-current={item.isCurrent ? "page" : undefined}
              >
                {item.page}
              </button>
            )}
          </li>
        ))}

        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "default",
              }),
              "gap-1 pr-2.5",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            <span>다음</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
