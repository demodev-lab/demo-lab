/**
 * @file PostAttachmentList.tsx
 * @description 게시글 첨부파일 목록 표시 컴포넌트
 */

"use client";

import React, { useState } from "react";
import { Download, Eye, Trash2 } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import {
  formatFileSize,
  getFileIconName,
  isImageFile,
} from "@/utils/file-utils";
import { getPublicUrl } from "@/utils/supabase/storage";
import type { PostAttachment } from "@/domains/post/types";

interface PostAttachmentListProps {
  attachments: PostAttachment[];
  onDownload: (attachment: PostAttachment) => void;
  onDelete?: (attachment: PostAttachment) => void; // 수정 모드용
  isEditable?: boolean; // 수정 모드 여부
  // TODO: 전체 다운로드 기능 추가 예정
  // onDownloadAll?: () => void;
}

interface AttachmentItemProps {
  attachment: PostAttachment;
  onDownload: (attachment: PostAttachment) => void;
  onDelete?: (attachment: PostAttachment) => void;
  isEditable?: boolean;
}

function AttachmentItem({
  attachment,
  onDownload,
  onDelete,
  isEditable,
  onImageClick,
}: AttachmentItemProps & {
  onImageClick?: (attachment: PostAttachment) => void;
}) {
  const [imageError, setImageError] = useState(false);

  const isImage = isImageFile(attachment.file_type);
  const IconComponent =
    Icons[getFileIconName(attachment.file_type) as keyof typeof Icons] ||
    Icons.File;
  const publicUrl = getPublicUrl(attachment.stored_file_path);

  const handleImageClick = () => {
    if (isImage && !imageError && onImageClick) {
      onImageClick(attachment);
    } else if (isImage && !imageError) {
      // Fallback to download if no lightbox handler provided
      onDownload(attachment);
    } else {
      onDownload(attachment);
    }
  };

  return (
    <>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          {/* 파일 아이콘 또는 이미지 썸네일 */}
          <div className="flex-shrink-0">
            {isImage && !imageError ? (
              <div
                className="w-12 h-12 rounded-lg overflow-hidden cursor-pointer bg-gray-100 flex items-center justify-center"
                onClick={handleImageClick}
              >
                <img
                  src={publicUrl}
                  alt={attachment.original_file_name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-gray-600" />
              </div>
            )}
          </div>

          {/* 파일 정보 */}
          <div className="flex-1 min-w-0">
            <p
              className="font-medium text-sm truncate"
              title={attachment.original_file_name}
            >
              {attachment.original_file_name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {formatFileSize(attachment.file_size)}
              </Badge>
              <span className="text-xs text-gray-500">
                {attachment.file_type.split("/")[1]?.toUpperCase() || "FILE"}
              </span>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex items-center gap-1">
            {isImage && !imageError && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleImageClick}
                className="h-8 w-8 p-0"
                title="이미지 보기"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownload(attachment)}
              className="h-8 w-8 p-0"
              title="다운로드"
            >
              <Download className="h-4 w-4" />
            </Button>
            {isEditable && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(attachment)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                title="삭제"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}

export function PostAttachmentList({
  attachments,
  onDownload,
  onDelete,
  isEditable = false,
}: PostAttachmentListProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!attachments || attachments.length === 0) {
    return null;
  }

  const imageFiles = attachments.filter((att) => isImageFile(att.file_type));
  const otherFiles = attachments.filter((att) => !isImageFile(att.file_type));

  // Prepare lightbox slides
  const lightboxSlides = imageFiles.map((attachment) => ({
    src: getPublicUrl(attachment.stored_file_path),
    alt: attachment.original_file_name,
  }));

  const handleImageClick = (attachment: PostAttachment) => {
    const index = imageFiles.findIndex((img) => img.id === attachment.id);
    if (index !== -1) {
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          첨부파일 {attachments.length}개
        </h3>
        {/* TODO: 전체 다운로드 기능 추가 예정 */}
        {/* <Button variant="outline" size="sm" onClick={onDownloadAll}>
          전체 다운로드
        </Button> */}
      </div>

      <div className="space-y-3">
        {/* 이미지 파일 먼저 표시 */}
        {imageFiles.map((attachment) => (
          <AttachmentItem
            key={attachment.id}
            attachment={attachment}
            onDownload={onDownload}
            onDelete={onDelete}
            isEditable={isEditable}
            onImageClick={handleImageClick}
          />
        ))}

        {/* 기타 파일 표시 */}
        {otherFiles.map((attachment) => (
          <AttachmentItem
            key={attachment.id}
            attachment={attachment}
            onDownload={onDownload}
            onDelete={onDelete}
            isEditable={isEditable}
          />
        ))}
      </div>

      {/* Lightbox for image viewing */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
        on={{
          click: ({ index }) => {
            // 배경(빈 공간) 클릭 시에만 라이트박스 닫기
            if (index === -1) {
              setLightboxOpen(false);
            }
            // 이미지 자체 클릭(index >= 0)은 아무것도 하지 않음 (기본 동작 유지)
          },
        }}
      />
    </div>
  );
}
