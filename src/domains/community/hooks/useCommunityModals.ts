import { useState } from "react";
import type { Post } from "../types";

export const useCommunityModals = () => {
  // 포스트 작성/수정 모달
  const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 게시글 상세 모달
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 삭제 확인 모달
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const openPostEditor = () => {
    setIsPostEditorOpen(true);
  };

  const closePostEditor = () => {
    setIsPostEditorOpen(false);
    setIsEditMode(false);
    setEditingPost(null);
  };

  const openEditMode = (post: Post) => {
    setEditingPost(post);
    setIsEditMode(true);
    setIsPostEditorOpen(true);
  };

  const openPostDetail = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closePostDetail = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const openDeleteConfirm = (postId: number) => {
    setPostToDelete(postId);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setPostToDelete(null);
    setDeleteConfirmOpen(false);
  };

  return {
    // 포스트 에디터 상태
    isPostEditorOpen,
    isEditMode,
    editingPost,
    isSubmitting,
    setIsSubmitting,
    openPostEditor,
    closePostEditor,
    openEditMode,

    // 상세 모달 상태
    selectedPost,
    isModalOpen,
    openPostDetail,
    closePostDetail,

    // 삭제 확인 모달 상태
    deleteConfirmOpen,
    postToDelete,
    openDeleteConfirm,
    closeDeleteConfirm,
  };
};
