"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  Heart,
  User,
  Filter,
  Check,
  ChevronDown,
  ChevronUp,
  Settings,
  Loader2,
  PlusCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// 분리된 컴포넌트들 가져오기
import { PostItem } from "./post-item";
import { PostEditor } from "../community/PostEditor"; // 새로 만든 에디터 컴포넌트
import { CategoryTagManager } from "./category-tag-manager";

// 커뮤니티 상태 스토어
import {
  useCommunityStore,
  Post,
  Category,
  Tag,
} from "@/utils/lib/communityService";

export function CommunityTab() {
  const {
    posts,
    pagination,
    loading,
    fetchPosts,
    addPost,
    deletePost,
    toggleLikePost,
    categories,
    tags,
    fetchCategories,
    fetchTags,
  } = useCommunityStore();

  // 포스트 작성 상태
  const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 게시글 표시 상태
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState("default");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 게시글 편집/삭제 상태
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  // 카테고리 및 태그 관리 상태
  const [showCategoryTagManager, setShowCategoryTagManager] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 첫 페이지 게시글 로드 및 카테고리/태그 로드
    fetchPosts(1);
    fetchCategories();
    fetchTags();
  }, [fetchPosts, fetchCategories, fetchTags]);

  const handlePostSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await addPost(formData);
      setIsPostEditorOpen(false);
    } catch (error) {
      console.error("Failed to submit post:", error);
      // TODO: 사용자에게 오류 알림 (예: toast)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenModal = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleDeletePost = (postId: number) => {
    setPostToDelete(postId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    await deletePost(postToDelete);

    if (selectedPost && selectedPost.id === postToDelete) {
      handleCloseModal();
    }
    setPostToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const cancelDeletePost = () => {
    setPostToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const handleToggleLike = (postId: number, isLiked: boolean) => {
    toggleLikePost(postId, isLiked);
  };

  const getUniqueCategories = () => {
    const allCategories = [
      { id: "all", label: "All" },
      ...categories.map((cat) => ({
        id: cat.name.toLowerCase(),
        label: cat.name,
      })),
    ];
    return allCategories;
  };

  const visibleCategories = showAllCategories
    ? getUniqueCategories()
    : getUniqueCategories().slice(0, 5);

  const toggleCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  return (
    <div className="space-y-6">
      {/* 글쓰기 버튼 */}
      <Card className="border shadow-none">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground">
              커뮤니티에 질문하거나 정보를 공유해보세요!
            </span>
          </div>
          <Button
            className="bg-[#5046E4] hover:bg-[#5046E4]/90"
            onClick={() => setIsPostEditorOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            글쓰기
          </Button>
        </CardContent>
      </Card>

      {/* 필터 및 정렬 */}
      <div className="flex items-center justify-between">
        {/* 카테고리 필터링 UI는 유지, 로직은 추후 연결 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* ... 기존 카테고리 버튼 ... */}
        </div>
        <div className="flex items-center gap-2">
          {/* ... 기존 정렬 드롭다운 ... */}
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={() => setShowCategoryTagManager(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            카테고리/태그 관리
          </Button>
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="space-y-4">
        {loading && posts.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex justify-center items-center h-40 text-muted-foreground text-lg">
            게시글이 없습니다
          </div>
        ) : (
          posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              onOpenModal={() => handleOpenModal(post)}
              onToggleLike={() => handleToggleLike(post.id, post.is_liked)}
            />
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchPosts(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1 || loading}
          >
            이전
          </Button>
          <span>
            {pagination.currentPage} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchPosts(pagination.currentPage + 1)}
            disabled={
              pagination.currentPage >= pagination.totalPages || loading
            }
          >
            다음
          </Button>
        </div>
      )}

      {/* 게시글 작성 다이얼로그 */}
      <Dialog open={isPostEditorOpen} onOpenChange={setIsPostEditorOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <PostEditor
            categories={categories}
            tags={tags}
            onSubmit={handlePostSubmit}
            onCancel={() => setIsPostEditorOpen(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* 게시글 상세보기 모달 */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedPost && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        {selectedPost.author_name}
                      </div>
                      {/* 수정/삭제 버튼 (인증 로직 추가 필요) */}
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-red-500"
                          onClick={() => handleDeletePost(selectedPost.id)}
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(selectedPost.created_at).toLocaleString()} •
                      <Badge
                        style={{
                          backgroundColor:
                            selectedPost.category_color || "#888888",
                          marginLeft: "4px",
                        }}
                        className="text-white text-xs"
                      >
                        {selectedPost.category_name}
                      </Badge>
                      {selectedPost.is_pinned && " • 📌 고정됨"}
                    </div>
                  </div>
                </div>
                <DialogTitle className="text-2xl font-bold">
                  {selectedPost.title}
                </DialogTitle>
                <DialogDescription className="whitespace-pre-line mt-4">
                  {selectedPost.content}
                </DialogDescription>
                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {selectedPost.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="text-xs"
                        style={{
                          borderColor: tag.color,
                          color: tag.color,
                        }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </DialogHeader>

              <div className="flex gap-4 my-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() =>
                    handleToggleLike(selectedPost.id, selectedPost.is_liked)
                  }
                >
                  <Heart
                    className={`h-4 w-4 ${selectedPost.is_liked ? "text-red-500 fill-red-500" : ""}`}
                  />
                  <span>좋아요 {selectedPost.like_count}</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>댓글 {selectedPost.comment_count}</span>
                </Button>
              </div>

              <Separator className="my-4" />

              {/* 댓글 기능은 추후 구현 */}
              <div className="text-center text-muted-foreground py-8">
                댓글 기능은 준비 중입니다.
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 모달 */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>게시글 삭제</DialogTitle>
            <DialogDescription>
              정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={cancelDeletePost}>
              취소
            </Button>
            <Button variant="destructive" onClick={confirmDeletePost}>
              삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 카테고리 및 태그 관리 다이얼로그 */}
      <CategoryTagManager
        open={showCategoryTagManager}
        onOpenChange={setShowCategoryTagManager}
      />
    </div>
  );
}
