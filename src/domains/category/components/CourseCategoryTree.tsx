"use client";

import React, { useState, memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Edit,
  Trash,
  Eye,
  EyeOff,
  Folder,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/utils/lib/utils";
import type { CategoryTreeNode } from "../types";

// 카테고리 아이템 Props 타입
interface CategoryItemProps {
  category: CategoryTreeNode;
  isExpanded: boolean;
  isSelected: boolean;
  expandedIds: Set<number>;
  selectedId?: number;
  onToggleExpanded: (id: number) => void;
  onAdd?: (parentId: number | null) => void;
  onEdit?: (category: CategoryTreeNode) => void;
  onDelete?: (category: CategoryTreeNode) => void;
  onToggleStatus?: (category: CategoryTreeNode) => void;
  onSelect?: (category: CategoryTreeNode) => void;
  showActions: boolean;
}

// 메모이제이션된 카테고리 아이템 컴포넌트
const CategoryItem = memo<CategoryItemProps>(
  ({
    category,
    isExpanded,
    isSelected,
    expandedIds,
    selectedId,
    onToggleExpanded,
    onAdd,
    onEdit,
    onDelete,
    onToggleStatus,
    onSelect,
    showActions,
  }) => {
    const hasChildren = category.children.length > 0;

    const handleToggleExpanded = useCallback(() => {
      onToggleExpanded(category.id);
    }, [category.id, onToggleExpanded]);

    const handleSelect = useCallback(() => {
      onSelect?.(category);
    }, [category, onSelect]);

    return (
      <div className="w-full">
        <div
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent",
            isSelected && "bg-accent",
            !category.is_active && "opacity-60",
          )}
          style={{ paddingLeft: `${category.level * 20 + 8}px` }}
        >
          {/* 확장/축소 버튼 */}
          <button
            onClick={handleToggleExpanded}
            className={cn(
              "p-0.5 hover:bg-accent-foreground/10 rounded",
              !hasChildren && "invisible",
            )}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {/* 폴더 아이콘 */}
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Folder className="h-4 w-4 text-muted-foreground" />
            )
          ) : (
            <div className="w-4" />
          )}

          {/* 카테고리 이름 */}
          <button
            onClick={handleSelect}
            className="flex-1 text-left text-sm font-medium"
          >
            {category.name}
          </button>

          {/* 상태 배지 */}
          {!category.is_active && (
            <Badge variant="secondary" className="text-xs">
              비활성
            </Badge>
          )}

          {/* 액션 메뉴 */}
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onAdd && (
                  <DropdownMenuItem onClick={() => onAdd(category.id)}>
                    <Plus className="mr-2 h-4 w-4" />
                    하위 카테고리 추가
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(category)}>
                    <Edit className="mr-2 h-4 w-4" />
                    수정
                  </DropdownMenuItem>
                )}
                {onToggleStatus && (
                  <DropdownMenuItem onClick={() => onToggleStatus(category)}>
                    {category.is_active ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        비활성화
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        활성화
                      </>
                    )}
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(category)}
                      className="text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      삭제
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* 하위 카테고리 렌더링 */}
        {hasChildren && isExpanded && (
          <CategorySubTree
            categories={category.children}
            expandedIds={expandedIds}
            onToggleExpanded={onToggleExpanded}
            selectedId={selectedId}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
            onSelect={onSelect}
            showActions={showActions}
          />
        )}
      </div>
    );
  },
);

CategoryItem.displayName = "CategoryItem";

// 하위 트리 렌더링을 위한 내부 컴포넌트
interface CategorySubTreeProps {
  categories: CategoryTreeNode[];
  expandedIds: Set<number>;
  onToggleExpanded: (id: number) => void;
  selectedId?: number;
  onAdd?: (parentId: number | null) => void;
  onEdit?: (category: CategoryTreeNode) => void;
  onDelete?: (category: CategoryTreeNode) => void;
  onToggleStatus?: (category: CategoryTreeNode) => void;
  onSelect?: (category: CategoryTreeNode) => void;
  showActions: boolean;
}

const CategorySubTree: React.FC<CategorySubTreeProps> = ({
  categories,
  expandedIds,
  onToggleExpanded,
  selectedId,
  onAdd,
  onEdit,
  onDelete,
  onToggleStatus,
  onSelect,
  showActions,
}) => {
  return (
    <>
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          isExpanded={expandedIds.has(category.id)}
          isSelected={selectedId === category.id}
          expandedIds={expandedIds}
          selectedId={selectedId}
          onToggleExpanded={onToggleExpanded}
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onSelect={onSelect}
          showActions={showActions}
        />
      ))}
    </>
  );
};

// 메인 트리 컴포넌트 Props
interface CourseCategoryTreeProps {
  categories: CategoryTreeNode[];
  onAdd?: (parentId: number | null) => void;
  onEdit?: (category: CategoryTreeNode) => void;
  onDelete?: (category: CategoryTreeNode) => void;
  onToggleStatus?: (category: CategoryTreeNode) => void;
  selectedId?: number | null;
  onSelect?: (category: CategoryTreeNode) => void;
  showActions?: boolean;
  className?: string;
}

// 메인 트리 컴포넌트
export function CourseCategoryTree({
  categories,
  onAdd,
  onEdit,
  onDelete,
  onToggleStatus,
  selectedId,
  onSelect,
  showActions = true,
  className,
}: CourseCategoryTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  // useCallback으로 함수 메모이제이션
  const handleToggleExpanded = useCallback((id: number) => {
    setExpandedIds((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return newExpanded;
    });
  }, []);

  const handleAddRoot = useCallback(() => {
    onAdd?.(null);
  }, [onAdd]);

  return (
    <div className={cn("space-y-1", className)}>
      {/* 최상위 카테고리 추가 버튼 */}
      {showActions && onAdd && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddRoot}
          className="w-full justify-start"
        >
          <Plus className="mr-2 h-4 w-4" />새 카테고리 추가
        </Button>
      )}

      {/* 카테고리 트리 렌더링 */}
      {categories.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          등록된 카테고리가 없습니다.
        </div>
      ) : (
        <CategorySubTree
          categories={categories}
          expandedIds={expandedIds}
          onToggleExpanded={handleToggleExpanded}
          selectedId={selectedId ?? undefined}
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onSelect={onSelect}
          showActions={showActions}
        />
      )}
    </div>
  );
}
