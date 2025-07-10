"use client";

import React, { useCallback, useState } from "react";
import { Upload, X, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/utils/supabase/storage";
import { getFileIconName } from "@/utils/file-utils";
import * as Icons from "lucide-react";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
}

export function FileUpload({
  onFilesSelected,
  maxFiles = 10,
  className,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFilesSelected(files.slice(0, maxFiles));
      }
    },
    [disabled, maxFiles, onFilesSelected],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onFilesSelected(files.slice(0, maxFiles));
      }
      // Reset input
      e.target.value = "";
    },
    [disabled, maxFiles, onFilesSelected],
  );

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 border-dashed transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={disabled}
        id="file-upload-input"
      />
      <label
        htmlFor="file-upload-input"
        className={cn(
          "flex flex-col items-center justify-center gap-2 p-6 text-center cursor-pointer",
          disabled && "cursor-not-allowed",
        )}
      >
        <Upload className="w-8 h-8 text-muted-foreground" />
        <div className="text-sm">
          <span className="font-semibold">클릭하여 파일 선택</span>
          <span className="text-muted-foreground"> 또는 드래그 & 드롭</span>
        </div>
        <p className="text-xs text-muted-foreground">
          최대 {maxFiles}개 파일, 파일당 100MB까지
        </p>
      </label>
    </div>
  );
}

interface FileListProps {
  files: Array<{
    file: File;
    progress?: number;
    error?: string;
    uploaded?: boolean;
  }>;
  onRemove: (index: number) => void;
}

export function FileList({ files, onRemove }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      {files.map((item, index) => {
        const IconComponent =
          (Icons[
            getFileIconName(item.file.type) as keyof typeof Icons
          ] as React.ComponentType<any>) || FileIcon;

        return (
          <div
            key={index}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border bg-card",
              item.error && "border-destructive bg-destructive/5",
            )}
          >
            <IconComponent className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(item.file.size)}
              </p>
              {item.error && (
                <p className="text-xs text-destructive mt-1">{item.error}</p>
              )}
            </div>
            {item.progress !== undefined && !item.uploaded && (
              <div className="w-20">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  {item.progress}%
                </p>
              </div>
            )}
            {item.uploaded && (
              <span className="text-xs text-green-600 font-medium">완료</span>
            )}
            <button
              onClick={() => onRemove(index)}
              className="p-1 hover:bg-muted rounded-md transition-colors"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
