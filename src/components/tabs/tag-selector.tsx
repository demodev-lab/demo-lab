import React, { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Tag } from "lucide-react";
import { useCommunityStore } from "@/utils/lib/communityService";

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  const { tags } = useCommunityStore();
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // 바깥쪽 클릭 시 제안 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 입력값에 따른 추천 태그 필터링
  const filteredTags = tags
    .filter(
      (tag) =>
        tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.includes(tag.name),
    )
    .map((tag) => tag.name);

  // 태그 추가
  const addTag = (tag: string) => {
    if (tag.trim() && !selectedTags.includes(tag) && selectedTags.length < 5) {
      onChange([...selectedTags, tag]);
    }
    setInputValue("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // 태그 제거
  const removeTag = (tagToRemove: string) => {
    onChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (
      e.key === "Backspace" &&
      !inputValue &&
      selectedTags.length > 0
    ) {
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[42px] mb-1">
        {selectedTags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedTags.length === 0
                ? "태그 입력 (최대 5개)"
                : selectedTags.length === 5
                  ? "태그 최대 개수 도달"
                  : "태그 추가..."
            }
            disabled={selectedTags.length >= 5}
            className="border-0 shadow-none focus-visible:ring-0 p-0 h-8"
          />
          {showSuggestions && inputValue.trim() && filteredTags.length > 0 && (
            <div
              ref={suggestionRef}
              className="absolute z-10 w-full max-h-60 overflow-auto bg-background border rounded-md mt-1 shadow-md"
            >
              {filteredTags.map((tag) => (
                <div
                  key={tag}
                  className="px-3 py-2 hover:bg-accent cursor-pointer flex items-center gap-2"
                  onClick={() => addTag(tag)}
                >
                  <Tag className="h-4 w-4" />
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>{selectedTags.length}/5 태그 사용</span>
        {inputValue.trim() &&
          !selectedTags.includes(inputValue.trim()) &&
          selectedTags.length < 5 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => addTag(inputValue.trim())}
            >
              <Plus className="h-3 w-3 mr-1" />
              &quot{inputValue}&quot 추가
            </Button>
          )}
      </div>
    </div>
  );
}
