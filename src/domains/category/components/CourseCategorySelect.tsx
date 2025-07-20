"use client";

import React, { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useActiveCoursCategories } from "../hooks";
import {
  buildCategoryTree,
  flattenCategoryTree,
  getDescendantCategoryIds,
} from "../utils";
import type { CategoryTreeNode } from "../types";

interface CourseCategorySelectProps {
  value?: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  excludeId?: number; // 자기 자신을 제외할 때 사용 (수정 시)
  maxDepth?: number; // 최대 선택 가능한 깊이
  className?: string;
}

export function CourseCategorySelect({
  value,
  onChange,
  placeholder = "카테고리를 선택하세요",
  disabled = false,
  error,
  excludeId,
  maxDepth,
  className,
}: CourseCategorySelectProps) {
  const { data: categories, isLoading, isError } = useActiveCoursCategories();

  // 카테고리 트리 구조 생성 및 플래튼
  const flatCategories = useMemo(() => {
    if (!categories) return [];

    // excludeId가 있으면 해당 카테고리와 하위 카테고리 제외
    let filteredCategories = categories;
    if (excludeId) {
      // 기존 유틸리티 함수 재사용
      const descendantIds = getDescendantCategoryIds(categories, excludeId);
      const excludeIds = new Set([excludeId, ...descendantIds]);

      filteredCategories = categories.filter((cat) => !excludeIds.has(cat.id));
    }

    const tree = buildCategoryTree(filteredCategories);
    return flattenCategoryTree(tree);
  }, [categories, excludeId]);

  // 선택 가능한 카테고리인지 확인
  const isSelectable = (category: CategoryTreeNode) => {
    if (maxDepth !== undefined && category.level >= maxDepth) {
      return false;
    }
    return true;
  };

  // 카테고리 표시명 생성
  const getCategoryDisplayName = (category: CategoryTreeNode) => {
    const indent = "　".repeat(category.level); // 전각 공백으로 들여쓰기
    const prefix = category.level > 0 ? "└ " : "";
    return `${indent}${prefix}${category.name}`;
  };

  if (isLoading) {
    return <Skeleton className={`h-10 w-full ${className}`} />;
  }

  if (isError) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          카테고리를 불러오는 중 오류가 발생했습니다.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      <Select
        value={value?.toString() || ""}
        onValueChange={(val) => onChange(val ? parseInt(val, 10) : null)}
        disabled={disabled}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">선택 없음</SelectItem>
          {flatCategories.map((category) => {
            const selectable = isSelectable(category);
            return (
              <SelectItem
                key={category.id}
                value={category.id.toString()}
                disabled={!selectable}
                className={`
                  ${!selectable ? "opacity-50" : ""}
                  ${category.level > 0 ? "pl-" + (category.level * 4 + 2) : ""}
                `}
              >
                {getCategoryDisplayName(category)}
                {!selectable && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (최대 깊이 초과)
                  </span>
                )}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
