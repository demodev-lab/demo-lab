import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PostEditor } from "./PostEditor";
import type { Post, Category, Tag } from "../types/index";

interface PostEditorModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  editingPost: Post | null;
  categories: Category[];
  tags: Tag[];
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
}

export function PostEditorModal({
  isOpen,
  isEditMode,
  editingPost,
  categories,
  tags,
  onClose,
  onSubmit,
  isSubmitting,
}: PostEditorModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "게시글 수정" : "새 게시글 작성"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "게시글 내용을 수정해주세요."
              : "커뮤니티에 공유할 내용을 작성해주세요."}
          </DialogDescription>
        </DialogHeader>
        <PostEditor
          categories={categories}
          tags={tags}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isSubmitting}
          initialData={
            editingPost
              ? {
                  title: editingPost.title,
                  content: editingPost.content,
                  categoryId: editingPost.category_id.toString(),
                  tagIds: editingPost.tags?.map((tag) => tag.id) || [],
                }
              : undefined
          }
          submitButtonText={isEditMode ? "수정하기" : "게시하기"}
        />
      </DialogContent>
    </Dialog>
  );
}
