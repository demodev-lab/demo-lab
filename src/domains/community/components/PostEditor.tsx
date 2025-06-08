"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Loader2 } from "lucide-react";
import type { Category, Tag } from "../types";

interface PostEditorProps {
  categories: Category[];
  tags?: Tag[];
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: {
    title: string;
    content: string;
    categoryId: string;
    tagIds?: number[];
  };
  submitButtonText?: string;
}

export function PostEditor({
  categories,
  tags = [],
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
  submitButtonText = "게시하기",
}: PostEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setCategoryId(initialData.categoryId);
      setSelectedTagIds(new Set(initialData.tagIds));
    } else if (categories.length > 0) {
      setCategoryId(categories[0].id.toString());
    }
  }, [initialData, categories]);

  const handleTagClick = (tagId: number) => {
    setSelectedTagIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tagId)) {
        newSet.delete(tagId);
      } else {
        newSet.add(tagId);
      }
      return newSet;
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("categoryId", categoryId);
    formData.append("tagIds", JSON.stringify(Array.from(selectedTagIds)));

    await onSubmit(formData);
  };

  const selectedCategory = categories.find(
    (c) => c.id.toString() === categoryId,
  );

  return (
    <div className="w-full">
      <div className="space-y-6">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="font-medium">
              제목
            </label>
            <Input
              id="title"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium">카테고리</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex w-full justify-start items-center gap-2 text-sm"
                >
                  {selectedCategory ? (
                    <Badge
                      style={{ backgroundColor: selectedCategory.color }}
                      className="text-white"
                    >
                      {selectedCategory.name}
                    </Badge>
                  ) : (
                    "카테고리 선택"
                  )}
                  <ChevronDown className="h-4 w-4 ml-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[--radix-dropdown-menu-trigger-width]"
              >
                <DropdownMenuRadioGroup
                  value={categoryId}
                  onValueChange={setCategoryId}
                >
                  {categories.map((category) => (
                    <DropdownMenuRadioItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      <Badge
                        style={{
                          backgroundColor: category.color,
                        }}
                        className="text-white"
                      >
                        {category.name}
                      </Badge>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-2">
            <label className="font-medium">
              태그 (선택사항, 최대 5개)
              {selectedTagIds.size > 0 && (
                <span className="text-sm text-muted-foreground ml-2">
                  {selectedTagIds.size}/5 선택됨
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTagIds.has(tag.id) ? "default" : "outline"}
                  onClick={() => {
                    if (selectedTagIds.has(tag.id) || selectedTagIds.size < 5) {
                      handleTagClick(tag.id);
                    }
                  }}
                  className={`cursor-pointer transition-all ${
                    !selectedTagIds.has(tag.id) && selectedTagIds.size >= 5
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  style={
                    selectedTagIds.has(tag.id)
                      ? { backgroundColor: tag.color, color: "white" }
                      : {}
                  }
                >
                  {tag.name}
                </Badge>
              ))}
              {tags.length === 0 && (
                <p className="text-sm text-muted-foreground py-2">
                  아직 생성된 태그가 없습니다.
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="content" className="font-medium">
              내용
            </label>
            <Textarea
              id="content"
              placeholder="본문을 입력하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                취소
              </Button>
            )}
            <Button
              type="submit"
              className="bg-[#5046E4] hover:bg-[#5046E4]/90"
              disabled={isLoading || !title.trim() || !content.trim()}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitButtonText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
