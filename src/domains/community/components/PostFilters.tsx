import React from "react";
// 필터 UI는 기존 코드에서 비어있는 상태로 남겨두어서 추후 구현 예정 표시만 합니다.

interface PostFiltersProps {
  className?: string;
}

export function PostFilters({ className }: PostFiltersProps) {
  return (
    <div className={`flex items-center justify-between ${className || ""}`}>
      {/* 카테고리 필터링 UI는 유지, 로직은 추후 연결 */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 기존 카테고리 버튼들이 들어갈 자리 */}
      </div>
      <div className="flex items-center gap-2">
        {/* 기존 정렬 드롭다운이 들어갈 자리 */}
      </div>
    </div>
  );
}
