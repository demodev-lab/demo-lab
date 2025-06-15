import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { Category } from "@/domains/category/types";
import type { Tag } from "@/domains/tag/types";
import type { SortOption } from "../types";
// 필터 UI는 기존 코드에서 비어있는 상태로 남겨두어서 추후 구현 예정 표시만 합니다.

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
  tags,
  selectedCategoryId,
  selectedTagIds,
  sortOption,
  searchQuery,
  onCategoryChange,
  onTagChange,
  onSortChange,
  onSearchChange,
  className,
}: PostFiltersProps) {
  return (
    <div className={`flex items-center justify-between ${className || ""}`}>
      {/* 카테고리 필터 */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCategoryChange(null)}
        >
          전체
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            style={{
              borderColor: category.color,
              color: category.color,
            }}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* 정렬 옵션 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            정렬
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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
