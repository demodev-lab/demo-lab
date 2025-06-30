import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/lib/utils";
import type { Category } from "@/domains/category/types";
import type { Tag } from "@/domains/tag/types";
import type { SortOption } from "../types";

interface PostFiltersProps {
  categories: Category[];
  tags: Tag[];
  selectedCategoryId?: number;
  selectedTagIds?: number[];
  sortOption?: SortOption;
  searchQuery?: string;
  onCategoryChange: (categoryId: number | null) => void;
  onTagChange: (tagIds: number[]) => void;
  onSortChange: (sortOption: SortOption) => void;
  onSearchChange: (query: string) => void;
  className?: string;
}

export function PostFilters({
  categories,
  selectedCategoryId,
  onCategoryChange,
  onSortChange,
  className,
}: PostFiltersProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      {/* 카테고리 필터 */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 rounded-full px-4 transition-all",
            selectedCategoryId === undefined || selectedCategoryId === null
              ? "bg-[#5046E4] text-white hover:bg-[#5046E4]/90"
              : "hover:bg-gray-100",
          )}
          onClick={() => onCategoryChange(null)}
        >
          전체
        </Button>
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          return (
            <Button
              key={category.id}
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 rounded-full px-4 transition-all",
                isSelected
                  ? "text-white hover:opacity-90"
                  : "hover:bg-gray-100",
              )}
              onClick={() => onCategoryChange(category.id)}
              style={{
                backgroundColor: isSelected ? category.color : "transparent",
                color: isSelected ? "white" : "inherit",
                borderWidth: isSelected ? 0 : 1,
                borderColor: isSelected ? "transparent" : "#e5e7eb",
              }}
            >
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* 정렬 옵션 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-full px-4 gap-1 border-gray-200 hover:bg-gray-50"
          >
            정렬
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuRadioGroup
            onValueChange={(value) => onSortChange(value as SortOption)}
          >
            <DropdownMenuRadioItem value="latest">최신순</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="popular">
              인기순
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="comments">
              댓글순
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
