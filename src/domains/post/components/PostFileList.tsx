/**
 * @file PostFileList.tsx
 * @description 게시글 에디터용 파일 목록 컴포넌트 (기존 파일 + 새 파일 통합 관리)
 */

"use client";

import React from "react";
import { X, FileIcon, Check, AlertCircle, RotateCcw } from "lucide-react";
import * as Icons from "lucide-react";
import { cn } from "@/utils/lib/utils";
import { formatFileSize, getFileIconName } from "@/utils/file-utils";
import type { FileItem } from "../types/file.types";

interface PostFileListProps {
  files: FileItem[];
  onRemoveNewFile: (fileId: string) => void;
  onToggleExistingFile: (fileId: number) => void;
  isEditMode?: boolean;
}

export function PostFileList({
  files,
  onRemoveNewFile,
  onToggleExistingFile,
  isEditMode = false,
}: PostFileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      {files.map((item) => {
        const isExisting = item.type === "existing";
        const isMarkedForDeletion = isExisting && item.markedForDeletion;

        // 파일 정보 가져오기
        const fileName = isExisting ? item.fileName : item.file.name;
        const fileSize = isExisting ? item.fileSize : item.file.size;
        const fileType = isExisting ? item.fileType : item.file.type;
        const error = item.type === "new" ? item.error : undefined;
        const uploaded = item.type === "new" ? item.uploaded : true;

        const IconComponent =
          (Icons[
            getFileIconName(fileType) as keyof typeof Icons
          ] as React.ComponentType<any>) || FileIcon;

        // 고유 key 생성
        const uniqueKey =
          item.type === "existing" ? `existing-${item.id}` : `new-${item.id}`;

        return (
          <div
            key={uniqueKey}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border bg-card transition-all",
              error && "border-destructive bg-destructive/5",
              isMarkedForDeletion && "opacity-50",
            )}
          >
            <IconComponent className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-sm font-medium truncate",
                  isMarkedForDeletion && "line-through text-muted-foreground",
                )}
              >
                {fileName}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatFileSize(fileSize)}</span>
                {isExisting && isEditMode && (
                  <span className="text-blue-600">기존 파일</span>
                )}
              </div>
              {error && (
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {error}
                </p>
              )}
            </div>

            {/* 상태 표시 */}
            {uploaded && !isExisting && (
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <Check className="w-3 h-3" />
                업로드 완료
              </span>
            )}

            {/* 삭제/복원 버튼 */}
            <button
              onClick={() => {
                if (item.type === "existing") {
                  onToggleExistingFile(item.id);
                } else {
                  onRemoveNewFile(item.id);
                }
              }}
              className={cn(
                "p-1 hover:bg-muted rounded-md transition-colors",
                isMarkedForDeletion && "hover:bg-green-100",
              )}
              type="button"
              title={isMarkedForDeletion ? "삭제 취소" : "삭제"}
            >
              {isMarkedForDeletion ? (
                <RotateCcw className="w-4 h-4 text-green-600" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </button>
          </div>
        );
      })}

      {isEditMode &&
        files.some((f) => f.type === "existing" && f.markedForDeletion) && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            취소선이 그어진 파일은 저장 시 삭제됩니다
          </p>
        )}
    </div>
  );
}
