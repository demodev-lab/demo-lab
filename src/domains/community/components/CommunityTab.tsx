"use client";

import React from "react";
import { toast } from "sonner";

// 분리된 훅들
import {
  useCommunityPosts,
  useCommunityPermissions,
  useCommunityFilters,
  useCommunityModals,
} from "../hooks";

// 분리된 컴포넌트들
import {
  PostCreateButton,
  PostFilters,
  PostList,
  PostPagination,
  PostDetailModal,
  PostDeleteConfirmModal,
  PostEditorModal,
} from "./";

export function CommunityTab() {
  // 훅들로부터 필요한 상태와 함수들을 가져오기
  const {
    posts,
    pagination,
    loading,
    categories,
    tags,
    handleAddPost,
    handleUpdatePost,
    handleDeletePost,
    handleToggleLike,
    loadPage,
  } = useCommunityPosts();

  const { canEditPost, canDeletePost } = useCommunityPermissions();

  const {
    sortOption,
    selectedCategory,
    showAllCategories,
    visibleCategories,
    setSortOption,
    setSelectedCategory,
    toggleCategories,
  } = useCommunityFilters(categories);

  const {
    // 포스트 에디터 모달
    isPostEditorOpen,
    isEditMode,
    editingPost,
    isSubmitting,
    setIsSubmitting,
    openPostEditor,
    closePostEditor,
    openEditMode,
    // 상세 모달
    selectedPost,
    isModalOpen,
    openPostDetail,
    closePostDetail,
    // 삭제 확인 모달
    deleteConfirmOpen,
    postToDelete,
    openDeleteConfirm,
    closeDeleteConfirm,
  } = useCommunityModals();

  // 비즈니스 로직 핸들러들
  const handlePostSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      let result;
      if (isEditMode && editingPost) {
        result = await handleUpdatePost(editingPost.id, formData);
      } else {
        result = await handleAddPost(formData);
      }

      if (result.success) {
        closePostEditor();
        toast.success(
          isEditMode ? "게시글이 수정되었습니다." : "게시글이 작성되었습니다.",
        );
      } else {
        toast.error(
          isEditMode
            ? "게시글 수정에 실패했습니다."
            : "게시글 작성에 실패했습니다.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPost = (post: (typeof posts)[0]) => {
    openEditMode(post);
  };

  const handleDeletePostClick = (postId: number) => {
    openDeleteConfirm(postId);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;

    const result = await handleDeletePost(postToDelete);

    if (result.success) {
      // 상세보기 모달이 열려있고 삭제된 게시글이면 모달 닫기
      if (selectedPost && selectedPost.id === postToDelete) {
        closePostDetail();
      }
      toast.success("게시글이 삭제되었습니다.");
    } else {
      toast.error("게시글 삭제에 실패했습니다.");
    }

    closeDeleteConfirm();
  };

  const handleToggleLikeClick = async (postId: number, isLiked: boolean) => {
    const result = await handleToggleLike(postId, isLiked);
    if (!result.success) {
      toast.error("좋아요 처리에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 글쓰기 버튼 */}
      <PostCreateButton onCreateClick={openPostEditor} />

      {/* 필터 및 정렬 */}
      <PostFilters />

      {/* 게시글 목록 */}
      <PostList
        posts={posts}
        loading={loading}
        onOpenModal={openPostDetail}
        onToggleLike={handleToggleLikeClick}
        onEdit={handleEditPost}
        onDelete={handleDeletePostClick}
        canEdit={canEditPost}
        canDelete={canDeletePost}
      />

      {/* 페이지네이션 */}
      <PostPagination
        pagination={pagination}
        loading={loading}
        onPageChange={loadPage}
      />

      {/* 게시글 작성/수정 모달 */}
      <PostEditorModal
        isOpen={isPostEditorOpen}
        isEditMode={isEditMode}
        editingPost={editingPost}
        categories={categories}
        tags={tags}
        onClose={closePostEditor}
        onSubmit={handlePostSubmit}
        isSubmitting={isSubmitting}
      />

      {/* 게시글 상세보기 모달 */}
      <PostDetailModal
        isOpen={isModalOpen}
        post={selectedPost}
        onClose={closePostDetail}
        onToggleLike={handleToggleLikeClick}
        onEdit={handleEditPost}
        onDelete={handleDeletePostClick}
        canEdit={selectedPost ? canEditPost(selectedPost) : false}
        canDelete={selectedPost ? canDeletePost(selectedPost) : false}
      />

      {/* 삭제 확인 모달 */}
      <PostDeleteConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDeletePost}
      />
    </div>
  );
}
