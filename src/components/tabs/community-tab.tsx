"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Heart,
  Paperclip,
  LinkIcon,
  Smile,
  User,
  Send,
  Filter,
  Check,
  ChevronDown,
  ChevronUp,
  Settings,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// 분리된 컴포넌트들 가져오기
import { PostItem } from "./post-item";
import { CommentItem } from "./comment-item";
import { TagSelector } from "./tag-selector";
import { CategoryTagManager } from "./category-tag-manager";

// 커뮤니티 상태 스토어
import { useCommunityStore, Post, Comment } from "@/utils/lib/communityService";

export function CommunityTab() {
  const {
    posts,
    categories,
    addPost,
    updatePost,
    deletePost,
    toggleLikePost,
    addComment,
    updateComment,
    deleteComment,
    toggleLikeComment,
  } = useCommunityStore();

  // 포스트 작성 상태
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [newPostCategory, setNewPostCategory] = useState("Questions");
  const [newPostTags, setNewPostTags] = useState<string[]>([]);

  // 게시글 표시 상태
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState("default");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 댓글 상태
  const [commentText, setCommentText] = useState("");
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  // 게시글 편집 상태
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editPostTitle, setEditPostTitle] = useState("");
  const [editPostContent, setEditPostContent] = useState("");
  const [editPostTags, setEditPostTags] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  // 카테고리 및 태그 관리 상태
  const [showCategoryTagManager, setShowCategoryTagManager] = useState(false);

  // 카테고리 색상 매핑
  const categoryColors = categories.reduce(
    (acc, category) => ({
      ...acc,
      [category.name]: category.color,
    }),
    {} as Record<string, string>,
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    const categoryParam = url.searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, []);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!postTitle.trim() || !postContent.trim()) {
      return;
    }

    const newPost: Post = {
      id: Math.max(0, ...posts.map((post) => post.id)) + 1,
      pinned: false,
      isPinned: false,
      author: "Current User",
      authorUsername: "current-user",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      category: newPostCategory,
      title: postTitle,
      content: postContent,
      tags: newPostTags,
      comments: 0,
      commentCount: 0,
      likes: 0,
      likeCount: 0,
      isLiked: false,
      status: "published",
      commentsList: [],
    };

    addPost(newPost);

    setPostTitle("");
    setPostContent("");
    setNewPostTags([]);
    setIsExpanded(false);
  };

  const getSortedPosts = () => {
    const postsToSort = [...posts];
    // pinned/비pinned 분리
    const pinnedPosts = postsToSort.filter((p) => p.pinned || p.isPinned);
    const normalPosts = postsToSort.filter((p) => !p.pinned && !p.isPinned);

    // pinned 게시물은 생성일(날짜) 오름차순
    pinnedPosts.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    // 나머지 게시물은 필터에 따라 정렬
    let sortedNormalPosts = [];
    switch (sortOption) {
      case "new":
        sortedNormalPosts = normalPosts.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        break;
      case "top":
        sortedNormalPosts = normalPosts.sort(
          (a, b) => b.likeCount - a.likeCount,
        );
        break;
      default:
        // 기본순: 최신순(내림차순)
        sortedNormalPosts = normalPosts.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        break;
    }

    // pinned + 나머지
    return [...pinnedPosts, ...sortedNormalPosts];
  };

  const handleOpenModal = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    setCommentText("");
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedPost) return;

    const newComment: Comment = {
      id:
        selectedPost.commentsList && selectedPost.commentsList.length > 0
          ? Math.max(...selectedPost.commentsList.map((c) => c.id)) + 1
          : 1,
      author: "Current User",
      authorUsername: "current-user",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      content: commentText,
      likes: 0,
      status: "visible",
      replies: [],
    };

    addComment(selectedPost.id, newComment);
    setCommentText("");
  };

  const handleEditClick = (comment: Comment) => {
    setEditCommentId(comment.id);
    setEditCommentText(comment.content);
  };

  const handleEditPostClick = (post: Post) => {
    setEditPostId(post.id);
    setEditPostTitle(post.title);
    setEditPostContent(post.content);
    setEditPostTags(post.tags || []);
  };

  const handleEditPostSave = () => {
    if (!editPostId) return;

    updatePost(editPostId, {
      title: editPostTitle,
      content: editPostContent,
      tags: editPostTags,
    });

    setEditPostId(null);
    setEditPostTitle("");
    setEditPostContent("");
    setEditPostTags([]);
  };

  const handleEditPostCancel = () => {
    setEditPostId(null);
    setEditPostTitle("");
    setEditPostContent("");
    setEditPostTags([]);
  };

  const handleDeletePost = (postId: number) => {
    setPostToDelete(postId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeletePost = () => {
    if (!postToDelete) return;

    deletePost(postToDelete);

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

  const handleEditSave = () => {
    if (!editCommentId || !selectedPost) return;
    updateComment(selectedPost.id, editCommentId, {
      content: editCommentText,
    });
    setEditCommentId(null);
    setEditCommentText("");
  };

  const handleEditCancel = () => {
    setEditCommentId(null);
    setEditCommentText("");
  };

  const handleDeleteComment = (commentId: number) => {
    if (!selectedPost) return;
    deleteComment(selectedPost.id, commentId);
  };

  const handleToggleLike = (postId: number) => {
    toggleLikePost(postId);
  };

  const handleToggleCommentLike = (commentId: number) => {
    if (!selectedPost) return;
    toggleLikeComment(selectedPost.id, commentId);
  };

  const toggleCategories = () => {
    setShowAllCategories(!showAllCategories);
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

  return (
    <div className="space-y-6">
      <Card className="border shadow-none">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div
              className={`flex ${
                isExpanded ? "flex-col" : "flex-row"
              } items-start gap-4`}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {isExpanded ? (
                  <>
                    <Input
                      className="mb-4"
                      placeholder="제목을 입력하세요"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                    />
                    <div className="mb-4 flex items-center">
                      <span className="mr-2 text-sm text-muted-foreground">
                        카테고리:
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex items-center gap-1 text-sm"
                          >
                            <Badge
                              style={{
                                backgroundColor:
                                  categoryColors[newPostCategory] || "#888888",
                              }}
                              className="text-white"
                            >
                              {newPostCategory}
                            </Badge>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuRadioGroup
                            value={newPostCategory}
                            onValueChange={setNewPostCategory}
                          >
                            {categories.map((category) => (
                              <DropdownMenuRadioItem
                                key={category.id}
                                value={category.name}
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
                    </div>
                    <div className="mb-4">
                      <span className="mb-2 block text-sm text-muted-foreground">
                        태그:
                      </span>
                      <TagSelector
                        selectedTags={newPostTags}
                        onChange={setNewPostTags}
                      />
                    </div>
                  </>
                ) : (
                  <div
                    className="border rounded-md p-2 text-muted-foreground cursor-text"
                    onClick={() => setIsExpanded(true)}
                  >
                    커뮤니티에 질문하거나 정보를 공유해보세요...
                  </div>
                )}
                {isExpanded && (
                  <>
                    <Textarea
                      placeholder="본문을 입력하세요..."
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="min-h-[100px] resize-none mt-4"
                    />
                    <div className="flex justify-between mt-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => {
                            // TODO: 구현
                          }}
                        >
                          <Paperclip className="h-4 w-4 mr-1" />
                          첨부
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => {
                            // TODO: 구현
                          }}
                        >
                          <LinkIcon className="h-4 w-4 mr-1" />
                          링크
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => {
                            // TODO: 구현
                          }}
                        >
                          <Smile className="h-4 w-4 mr-1" />
                          이모지
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsExpanded(false);
                            setPostTitle("");
                            setPostContent("");
                            setNewPostTags([]);
                          }}
                        >
                          취소
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#5046E4] hover:bg-[#5046E4]/90"
                          onClick={handlePostSubmit}
                          disabled={!postTitle.trim() || !postContent.trim()}
                        >
                          게시하기
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {visibleCategories.map((category) => (
            <Button
              key={category.id}
              variant={
                selectedCategory === category.label ? "default" : "outline"
              }
              size="sm"
              onClick={() => setSelectedCategory(category.label)}
              className="text-sm"
            >
              {category.label}
            </Button>
          ))}
          {getUniqueCategories().length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCategories}
              className="text-sm"
            >
              {showAllCategories ? "접기" : "더 보기"}
              {showAllCategories ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                <Filter className="h-4 w-4 mr-2" />
                {sortOption === "default"
                  ? "기본순"
                  : sortOption === "new"
                    ? "최신순"
                    : "인기순"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={sortOption}
                onValueChange={setSortOption}
              >
                <DropdownMenuRadioItem value="default">
                  <div className="flex items-center">
                    <span className="mr-2">기본순</span>
                    {sortOption === "default" && <Check className="h-4 w-4" />}
                  </div>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="new">
                  <div className="flex items-center">
                    <span className="mr-2">최신순</span>
                    {sortOption === "new" && <Check className="h-4 w-4" />}
                  </div>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="top">
                  <div className="flex items-center">
                    <span className="mr-2">인기순</span>
                    {sortOption === "top" && <Check className="h-4 w-4" />}
                  </div>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

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

      <div className="space-y-4">
        {(() => {
          const filteredPosts =
            selectedCategory === "All" || selectedCategory === "all"
              ? getSortedPosts()
              : getSortedPosts().filter(
                  (post) => post.category === selectedCategory,
                );
          if (filteredPosts.length === 0) {
            return (
              <div className="flex justify-center items-center h-40 text-muted-foreground text-lg">
                관련된 게시글이 없습니다
              </div>
            );
          }
          return filteredPosts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              onOpenModal={handleOpenModal}
              onToggleLike={handleToggleLike}
              categoryColors={categoryColors}
            />
          ));
        })()}
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedPost && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`/placeholder.svg?text=${selectedPost.author.charAt(0)}`}
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{selectedPost.author}</div>
                      {selectedPost.authorUsername === "current-user" && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleEditPostClick(selectedPost)}
                          >
                            수정
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-red-500"
                            onClick={() => handleDeletePost(selectedPost.id)}
                          >
                            삭제
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {selectedPost.date} •
                      <Badge
                        style={{
                          backgroundColor:
                            categoryColors[selectedPost.category] || "#888888",
                          marginLeft: "4px",
                        }}
                        className="text-white text-xs"
                      >
                        {selectedPost.category}
                      </Badge>
                      {(selectedPost.pinned || selectedPost.isPinned) &&
                        " • 📌 고정됨"}
                    </div>
                  </div>
                </div>
                {editPostId === selectedPost.id ? (
                  <div className="space-y-4 mt-4">
                    <Input
                      value={editPostTitle}
                      onChange={(e) => setEditPostTitle(e.target.value)}
                      className="text-xl font-bold"
                      autoFocus
                    />
                    <div className="mb-4">
                      <span className="mb-2 block text-sm text-muted-foreground">
                        태그:
                      </span>
                      <TagSelector
                        selectedTags={editPostTags}
                        onChange={setEditPostTags}
                      />
                    </div>
                    <Textarea
                      value={editPostContent}
                      onChange={(e) => setEditPostContent(e.target.value)}
                      className="min-h-[150px] resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        className="bg-[#5046E4] hover:bg-[#5046E4]/90"
                        onClick={handleEditPostSave}
                        disabled={
                          !editPostTitle.trim() || !editPostContent.trim()
                        }
                      >
                        저장
                      </Button>
                      <Button variant="outline" onClick={handleEditPostCancel}>
                        취소
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <DialogTitle className="text-2xl font-bold">
                      {selectedPost.title}
                    </DialogTitle>
                    <DialogDescription className="whitespace-pre-line mt-4">
                      {selectedPost.content}
                    </DialogDescription>
                    {selectedPost.tags && selectedPost.tags.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {selectedPost.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </DialogHeader>

              {!editPostId && (
                <>
                  <div className="flex gap-4 my-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleToggleLike(selectedPost.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${selectedPost.isLiked ? "text-red-500 fill-red-500" : ""}`}
                      />
                      <span>좋아요 {selectedPost.likeCount}</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>댓글 {selectedPost.comments}</span>
                    </Button>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <h4 className="font-medium">
                      댓글 {selectedPost.comments}개
                    </h4>

                    <div className="flex gap-2 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?text=Me" />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex gap-2">
                        <Input
                          placeholder="댓글을 입력하세요..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleAddComment();
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          className="bg-[#5046E4] hover:bg-[#5046E4]/90"
                          onClick={handleAddComment}
                          disabled={!commentText.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4 mt-6">
                      {selectedPost.commentsList?.map((comment) => (
                        <CommentItem
                          key={comment.id}
                          comment={comment}
                          currentUser="current-user"
                          editCommentId={editCommentId}
                          editCommentText={editCommentText}
                          onEditClick={handleEditClick}
                          onEditSave={handleEditSave}
                          onEditCancel={handleEditCancel}
                          onEditTextChange={setEditCommentText}
                          onDeleteComment={handleDeleteComment}
                          onToggleLike={handleToggleCommentLike}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

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
