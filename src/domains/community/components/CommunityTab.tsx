"use client";

import React, { useState } from "react";
import { useCommunity } from "../hooks/useCommunity";
import { usePost } from "@/domains/post/hooks/usePost";
import { useCategory } from "@/domains/category/hooks/useCategories";
import { useTag } from "@/domains/tag/hooks/useTags";
import {
  PostList,
  PostPagination,
  PostCreateButton,
  PostFilters,
  PostDetailModal,
  PostRemoveConfirmModal,
  PostEditorModal,
} from "@/domains/post/components";

export function CommunityTab() {
  // id 기반 모달 상태 관리
  const [detailModalPostId, setDetailModalPostId] = useState<number | null>(
    null,
  );
  const [editorModal, setEditorModal] = useState<
    null | { mode: "create" } | { mode: "edit"; postId: number }
  >(null);
  const [removeModalPostId, setRemoveModalPostId] = useState<number | null>(
    null,
  );

  // 클라이언트 상태 및 액션
  const {
    selectedCategoryId,
    setSelectedCategoryId,
    selectedTagIds,
    setSelectedTagIds,
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery,
    setCurrentPage,
    createPost,
    updatePost,
    removePost,
  } = useCommunity();

  // 서버 데이터
  const { list } = usePost();
  const { data, isLoading: isPostsLoading } = list(1, 10, {
    categoryId: selectedCategoryId,
    tagIds: selectedTagIds,
    sortOption,
    searchQuery,
  });
  const posts = data?.posts ?? [];
  const pagination = data?.pagination;
  const { data: categories, isLoading: isCategoriesLoading } =
    useCategory.list();
  const { data: tags, isLoading: isTagsLoading } = useTag.list();

  return (
    <div className="space-y-4">
      {/* 게시글 작성 버튼 */}
      <PostCreateButton
        onCreateClick={() => setEditorModal({ mode: "create" })}
      />

      {/* 필터 */}
      <PostFilters
        categories={categories ?? []}
        tags={tags ?? []}
        selectedCategoryId={selectedCategoryId}
        selectedTagIds={selectedTagIds}
        sortOption={sortOption}
        searchQuery={searchQuery}
        onCategoryChange={setSelectedCategoryId}
        onTagChange={setSelectedTagIds}
        onSortChange={setSortOption}
        onSearchChange={setSearchQuery}
      />

      {/* 게시글 목록 */}
      <PostList
        posts={posts}
        loading={isPostsLoading}
        onOpenModal={setDetailModalPostId}
        onEdit={(postId) => setEditorModal({ mode: "edit", postId })}
        onDelete={setRemoveModalPostId}
      />

      {/* 페이지네이션 */}
      {pagination && (
        <PostPagination
          pagination={pagination}
          loading={isPostsLoading}
          onPageChange={setCurrentPage}
        />
      )}

      {/* 모달들 */}
      {detailModalPostId !== null && (
        <PostDetailModal
          isOpen={!!detailModalPostId}
          postId={detailModalPostId}
          onClose={() => setDetailModalPostId(null)}
          onEdit={(id) => setEditorModal({ mode: "edit", postId: id })}
          onDelete={(id) => setRemoveModalPostId(id)}
        />
      )}

      {removeModalPostId !== null && (
        <PostRemoveConfirmModal
          isOpen={!!removeModalPostId}
          postId={removeModalPostId}
          onClose={() => setRemoveModalPostId(null)}
          onConfirm={async () => {
            await removePost(removeModalPostId);
            setRemoveModalPostId(null);
          }}
        />
      )}

      {editorModal && (
        <PostEditorModal
          isOpen={!!editorModal}
          mode={editorModal.mode}
          postId={editorModal.mode === "edit" ? editorModal.postId : undefined}
          categories={categories}
          tags={tags}
          onClose={() => setEditorModal(null)}
          onSubmit={async (formData) => {
            if (editorModal.mode === "edit" && editorModal.postId) {
              await updatePost({ postId: editorModal.postId, data: formData });
            } else {
              await createPost(formData);
            }
            setEditorModal(null);
          }}
        />
      )}
    </div>
  );
}
