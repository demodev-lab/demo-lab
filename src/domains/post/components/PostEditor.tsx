"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { ChevronDown, Loader2, Paperclip } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { PostFileList } from "./PostFileList";
import { uploadFile, getPublicUrl } from "@/utils/supabase/storage";
import { generateDomainStoragePath } from "@/utils/file-utils";
import { toast } from "sonner";
import type { Category } from "@/domains/category/types";
import type { Tag } from "@/domains/tag/types";
import { CreatePostDto } from "@/dtos/create-post.dto";
import { UpdatePostDto } from "@/dtos/update-post.dto";
import type { PostAttachment } from "@/domains/post/types";
import type {
  FileItem,
  NewFileItem,
  ExistingFileItem,
} from "../types/file.types";
import { useProfile } from "@/hooks/use-profile";

interface PostEditorProps {
  categories?: Category[];
  tags?: Tag[];
  onSubmit: (data: CreatePostDto | UpdatePostDto) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
  initialData?: {
    title: string;
    content: string;
    categoryId?: number | null;
    tagIds?: number[];
    attachments?: PostAttachment[];
  };
  submitButtonText?: string;
}

export function PostEditor({
  categories,
  tags,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = "create",
  initialData,
  submitButtonText = "게시하기",
}: PostEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(new Set());
  const [attachments, setAttachments] = useState<FileItem[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);

  // 사용자 프로필 정보 가져오기
  const { data: userProfile } = useProfile();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setCategoryId(initialData.categoryId);
      setSelectedTagIds(new Set(initialData.tagIds));

      // 수정 모드일 때 기존 첨부파일 설정
      if (mode === "edit" && initialData.attachments) {
        const existingFiles: ExistingFileItem[] = initialData.attachments.map(
          (att) => ({
            type: "existing" as const,
            id: att.id,
            fileName: att.original_file_name,
            storedPath: att.stored_file_path,
            publicUrl: getPublicUrl(att.stored_file_path),
            fileSize: att.file_size,
            fileType: att.file_type,
            markedForDeletion: false,
          }),
        );
        setAttachments(existingFiles);
        setShowFileUpload(true); // 첨부파일이 있으면 자동으로 표시
      }
    } else if (categories && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [initialData, categories, mode]);

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

  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      console.group("PostEditor handleFilesSelected");
      console.log("Files selected:", files.length);

      // 사용자 인증 확인
      if (!userProfile?.id) {
        toast.error("로그인이 필요합니다.");
        return;
      }

      const userId = userProfile.id;

      // 파일 목록에 추가 (고유 ID 부여)
      const newFiles: NewFileItem[] = files.map((file) => ({
        type: "new" as const,
        id: crypto.randomUUID(),
        file,
      }));
      setAttachments((prev) => [...prev, ...newFiles]);
      setIsUploadingFiles(true);

      // 파일 업로드
      for (let i = 0; i < newFiles.length; i++) {
        const fileItem = newFiles[i];
        const file = fileItem.file;

        try {
          // 도메인별 저장 경로 생성
          const storagePath = generateDomainStoragePath(
            userId,
            "posts",
            file.name,
          );

          console.log(`Uploading file ${i + 1}/${newFiles.length}:`, file.name);

          // 파일 업로드
          const result = await uploadFile(file, storagePath);

          if (result.success) {
            setAttachments((prev) =>
              prev.map((attachment) =>
                attachment.type === "new" && attachment.id === fileItem.id
                  ? {
                      ...attachment,
                      uploaded: true,
                      storedPath: result.path,
                      publicUrl: result.publicUrl,
                    }
                  : attachment,
              ),
            );
          } else {
            setAttachments((prev) =>
              prev.map((attachment) =>
                attachment.type === "new" && attachment.id === fileItem.id
                  ? { ...attachment, error: result.error }
                  : attachment,
              ),
            );
            toast.error(`파일 업로드 실패: ${file.name}`);
          }
        } catch (error) {
          console.error("File upload error:", error);
          setAttachments((prev) =>
            prev.map((attachment) =>
              attachment.type === "new" && attachment.id === fileItem.id
                ? { ...attachment, error: "업로드 중 오류가 발생했습니다." }
                : attachment,
            ),
          );
        }
      }

      setIsUploadingFiles(false);
      console.groupEnd();
    },
    [attachments.length, userProfile?.id],
  );

  const handleRemoveNewFile = useCallback((fileId: string) => {
    setAttachments((prev) =>
      prev.filter((att) => !(att.type === "new" && att.id === fileId)),
    );
  }, []);

  const handleToggleExistingFile = useCallback((fileId: number) => {
    setAttachments((prev) =>
      prev.map((att) =>
        att.type === "existing" && att.id === fileId
          ? { ...att, markedForDeletion: !att.markedForDeletion }
          : att,
      ),
    );
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 입력값 검증
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    // 사용자 인증 확인
    if (!userProfile?.id) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    // 파일 업로드 중이면 대기
    if (isUploadingFiles) {
      toast.error("파일 업로드가 진행 중입니다. 잠시만 기다려주세요.");
      return;
    }

    // 업로드 실패한 파일이 있는지 확인
    const failedFiles = attachments.filter(
      (item) => item.type === "new" && item.error,
    );

    if (failedFiles.length > 0) {
      toast.error(
        `${failedFiles.length}개 파일 업로드에 실패했습니다. 해당 파일을 제거 후 다시 시도해주세요.`,
      );
      return;
    }

    // 업로드된 파일 정보 추가
    const uploadedFiles = attachments.filter(
      (item): item is NewFileItem =>
        item.type === "new" && item.uploaded === true && !!item.storedPath,
    );
    const attachmentData = uploadedFiles.map((item) => ({
      originalName: item.file.name,
      storedPath: item.storedPath!,
      publicUrl: item.publicUrl,
      fileSize: item.file.size,
      fileType: item.file.type,
    }));

    if (mode === "create") {
      const postData: CreatePostDto = {
        title,
        content,
        categoryId: categoryId || 0,
        authorId: userProfile.id,
        tagIds: Array.from(selectedTagIds),
        attachments: attachmentData.length > 0 ? attachmentData : undefined,
      };
      try {
        await onSubmit(postData);
        toast.success("게시글이 성공적으로 작성되었습니다.");
      } catch (error) {
        console.error("게시글 작성 에러:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "게시글 작성에 실패했습니다. 다시 시도해주세요.",
        );
      }
    } else {
      // 수정 모드
      const deletedIds = attachments
        .filter(
          (att): att is ExistingFileItem =>
            att.type === "existing" && att.markedForDeletion === true,
        )
        .map((att) => att.id);

      const updateData: UpdatePostDto = {
        title,
        content,
        categoryId: categoryId || 0,
        tagIds: Array.from(selectedTagIds),
        deleteAttachmentIds: deletedIds.length > 0 ? deletedIds : undefined,
        addAttachments: attachmentData.length > 0 ? attachmentData : undefined,
      };

      try {
        await onSubmit(updateData);
        toast.success("게시글이 성공적으로 수정되었습니다.");
      } catch (error) {
        console.error("게시글 수정 에러:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "게시글 수정에 실패했습니다. 다시 시도해주세요.",
        );
      }
    }
  };

  const selectedCategory = categories?.find((c) => c.id === categoryId);

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
            {categories && categories.length === 0 ? (
              <div className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50">
                작성 가능한 카테고리가 없습니다. 권한이 필요할 수 있습니다.
              </div>
            ) : (
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
                    value={categoryId?.toString() || ""}
                    onValueChange={(value) => setCategoryId(Number(value))}
                  >
                    {categories?.map((category) => (
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
            )}
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
              {tags?.map((tag) => (
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
              {tags?.length === 0 && (
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

          {/* 파일 첨부 섹션 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-medium">
                파일 첨부 (선택사항)
                {attachments.length > 0 && (
                  <span className="text-sm text-muted-foreground ml-2">
                    {attachments.length}개 파일
                  </span>
                )}
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowFileUpload(!showFileUpload)}
              >
                <Paperclip className="w-4 h-4 mr-2" />
                {showFileUpload ? "숨기기" : "파일 첨부"}
              </Button>
            </div>

            {showFileUpload && (
              <>
                <FileUpload
                  onFilesSelected={handleFilesSelected}
                  maxFiles={10}
                  disabled={isUploadingFiles}
                />
                {attachments.length > 0 && (
                  <PostFileList
                    files={attachments}
                    onRemoveNewFile={handleRemoveNewFile}
                    onToggleExistingFile={handleToggleExistingFile}
                    isEditMode={mode === "edit"}
                  />
                )}
              </>
            )}
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
              disabled={
                isLoading ||
                isUploadingFiles ||
                !title.trim() ||
                !content.trim()
              }
            >
              {(isLoading || isUploadingFiles) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isUploadingFiles ? "파일 업로드 중..." : submitButtonText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
