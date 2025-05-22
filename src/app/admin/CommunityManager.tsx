import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pencil,
  Plus,
  MoreVertical,
  Filter,
  Eye,
  EyeOff,
  Pin,
  PinOff,
  AlertCircle,
  Trash,
  RotateCcw,
} from "lucide-react";
import { useCommunityStore } from "@/utils/lib/communityService";

// 타입 정의
interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  postCount: number;
}

interface Tag {
  id: number;
  name: string;
  postCount: number;
}

interface Comment {
  id: number;
  author: string;
  authorUsername?: string;
  email?: string;
  date: string;
  content: string;
  status: "visible" | "hidden";
  isSpam?: boolean;
  likes?: number;
  replies?: Comment[];
}

interface Post {
  id: number;
  author: string;
  authorUsername?: string;
  email?: string;
  date: string;
  title: string;
  content: string;
  category: string;
  categoryId?: number;
  tags?: string[];
  status: "published" | "draft" | "hidden";
  isPinned: boolean;
  pinned?: boolean;
  viewCount?: number;
  likeCount?: number;
  comments?: number;
  likes?: number;
  isLiked?: boolean;
  commentCount?: number;
  commentsList?: Comment[];
  isSpam?: boolean;
}

interface PopularPost {
  id: number;
  title: string;
  views: number;
}

interface CategoryStat {
  name: string;
  count: number;
}

interface TagStat {
  name: string;
  count: number;
}

interface CommunityStats {
  totalPosts: number;
  totalComments: number;
  activeUsers: number;
  topCategories: CategoryStat[];
  topTags: TagStat[];
  popularPosts: PopularPost[];
}

export default function CommunityManager() {
  // 상태 관리
  const [activeTab, setActiveTab] = useState("posts");
  const {
    posts,
    categories,
    tags,
    updatePost,
    deletePost,
    togglePinPost,
    updateComment,
    deleteComment,
    addCategory,
    updateCategory,
    deleteCategory,
    addTag,
    updateTag,
    deleteTag,
  } = useCommunityStore();

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostDetailModal, setShowPostDetailModal] = useState(false);

  // 게시글 필터링 상태
  const [postFilter, setPostFilter] = useState({
    searchType: "title" as "title" | "author" | "email" | "content",
    searchValue: "",
    categoryFilter: "all",
    statusFilter: "all" as "all" | "published" | "draft" | "hidden",
    spamFilter: false,
    pinnedFilter: false,
  });

  // 카테고리 관리 상태
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    color: "#000000",
  });
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );

  // 태그 관리 상태
  const [tagForm, setTagForm] = useState({
    name: "",
  });
  const [editingTagId, setEditingTagId] = useState<number | null>(null);

  // 스팸 관리 상태
  const [spamStats, setSpamStats] = useState({
    totalDetected: 4,
    lastWeekDetected: 2,
    automaticallyBlocked: 3,
    manuallyReviewed: 1,
    falsePositives: 0,
  });

  // 통계 상태
  const [communityStats, setCommunityStats] = useState<CommunityStats>({
    totalPosts: posts.length,
    totalComments: posts.reduce(
      (acc, post) => acc + (post.commentCount || 0),
      0,
    ),
    activeUsers: 8,
    topCategories: [
      { name: "Questions", count: 12 },
      { name: "Resources", count: 8 },
      { name: "Discussions", count: 5 },
    ],
    topTags: [
      { name: "프로그래밍", count: 15 },
      { name: "디자인", count: 7 },
      { name: "취업", count: 4 },
    ],
    popularPosts: [
      {
        id: 1,
        title: "ClassHive 커뮤니티에 오신 것을 환영합니다!",
        views: 250,
      },
      { id: 3, title: "유용한 학습 자료 공유합니다", views: 130 },
      { id: 2, title: "학습 로드맵에 대해 질문이 있습니다", views: 85 },
    ],
  });

  // 게시글 작업 관련 함수들
  const handlePostStatusChange = (
    postId: number,
    status: "published" | "draft" | "hidden",
  ) => {
    updatePost(postId, { status });
    if (selectedPost?.id === postId) {
      setSelectedPost((prev) => (prev ? { ...prev, status } : null));
    }

    // 통계 업데이트
    updateCommunityStats();
  };

  const handleTogglePin = (postId: number) => {
    togglePinPost(postId);
    if (selectedPost?.id === postId) {
      setSelectedPost((prev) =>
        prev
          ? { ...prev, isPinned: !prev.isPinned, pinned: !prev.pinned }
          : null,
      );
    }
  };

  const handleDeletePost = (postId: number) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deletePost(postId);
      if (selectedPost?.id === postId) {
        setSelectedPost(null);
      }

      // 통계 업데이트
      updateCommunityStats();
    }
  };

  const handleMarkAsSpam = (postId: number, isSpam: boolean) => {
    updatePost(postId, {
      isSpam,
      status: isSpam ? "hidden" : selectedPost?.status || "published",
    });

    // 스팸 통계 업데이트
    if (isSpam) {
      setSpamStats((prev) => ({
        ...prev,
        totalDetected: prev.totalDetected + 1,
        manuallyReviewed: prev.manuallyReviewed + 1,
      }));
    } else {
      setSpamStats((prev) => ({
        ...prev,
        falsePositives: prev.falsePositives + 1,
      }));
    }
  };

  // 댓글 작업 관련 함수들
  const handleCommentStatusChange = (
    postId: number,
    commentId: number,
    status: "visible" | "hidden",
  ) => {
    updateComment(postId, commentId, { status });

    if (selectedPost?.id === postId) {
      setSelectedPost((prev) =>
        prev
          ? {
              ...prev,
              commentsList: prev.commentsList?.map((comment) =>
                comment.id === commentId ? { ...comment, status } : comment,
              ),
            }
          : null,
      );
    }
  };

  const handleDeleteComment = (postId: number, commentId: number) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteComment(postId, commentId);

      if (selectedPost?.id === postId) {
        setSelectedPost((prev) => {
          if (!prev) return null;

          const updatedCommentsList =
            prev.commentsList?.filter((comment) => comment.id !== commentId) ||
            [];

          return {
            ...prev,
            commentsList: updatedCommentsList,
            commentCount: (prev.commentCount || 0) - 1,
            comments: (prev.comments || 0) - 1,
          };
        });
      }

      // 통계 업데이트
      updateCommunityStats();
    }
  };

  const handleMarkCommentAsSpam = (
    postId: number,
    commentId: number,
    isSpam: boolean,
  ) => {
    updateComment(postId, commentId, {
      isSpam,
      status: isSpam ? "hidden" : "visible",
    });

    // 스팸 통계 업데이트
    if (isSpam) {
      setSpamStats((prev) => ({
        ...prev,
        totalDetected: prev.totalDetected + 1,
        manuallyReviewed: prev.manuallyReviewed + 1,
      }));
    } else {
      setSpamStats((prev) => ({
        ...prev,
        falsePositives: prev.falsePositives + 1,
      }));
    }
  };

  // 카테고리 관련 함수들
  const handleCategorySubmit = () => {
    if (!categoryForm.name.trim()) return;

    if (editingCategoryId) {
      updateCategory(editingCategoryId, {
        name: categoryForm.name,
        description: categoryForm.description,
        color: categoryForm.color,
      });
    } else {
      const newCategory: Category = {
        id: Math.max(0, ...categories.map((c) => c.id)) + 1,
        name: categoryForm.name,
        description: categoryForm.description,
        color: categoryForm.color,
        postCount: 0,
      };
      addCategory(newCategory);
    }

    // 폼 초기화
    setCategoryForm({ name: "", description: "", color: "#000000" });
    setEditingCategoryId(null);

    // 통계 업데이트
    updateCommunityStats();
  };

  const handleEditCategory = (category: Category) => {
    setCategoryForm({
      name: category.name,
      description: category.description,
      color: category.color,
    });
    setEditingCategoryId(category.id);
  };

  const handleCancelCategoryEdit = () => {
    setCategoryForm({ name: "", description: "", color: "#000000" });
    setEditingCategoryId(null);
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (
      window.confirm(
        "정말 삭제하시겠습니까? 연결된 게시글의 카테고리는 '미분류'로 변경됩니다.",
      )
    ) {
      deleteCategory(categoryId);
      updateCommunityStats();
    }
  };

  // 태그 관련 함수들
  const handleTagSubmit = () => {
    if (!tagForm.name.trim()) return;

    if (editingTagId) {
      updateTag(editingTagId, { name: tagForm.name });
    } else {
      const newTag: Tag = {
        id: Math.max(0, ...tags.map((t) => t.id)) + 1,
        name: tagForm.name,
        postCount: 0,
      };
      addTag(newTag);
    }

    // 폼 초기화
    setTagForm({ name: "" });
    setEditingTagId(null);

    // 통계 업데이트
    updateCommunityStats();
  };

  const handleEditTag = (tag: Tag) => {
    setTagForm({ name: tag.name });
    setEditingTagId(tag.id);
  };

  const handleCancelTagEdit = () => {
    setTagForm({ name: "" });
    setEditingTagId(null);
  };

  const handleDeleteTag = (tagId: number) => {
    if (
      window.confirm(
        "정말 삭제하시겠습니까? 연결된 게시글에서 해당 태그가 제거됩니다.",
      )
    ) {
      deleteTag(tagId);
      updateCommunityStats();
    }
  };

  // 통계 업데이트 함수
  const updateCommunityStats = () => {
    // 총 게시글 수
    const totalPosts = posts.filter((p) => p.status === "published").length;

    // 총 댓글 수
    const totalComments = posts.reduce((acc, post) => {
      const visibleComments =
        post.commentsList?.filter((c) => c.status === "visible").length || 0;
      return acc + visibleComments;
    }, 0);

    // 카테고리 통계
    const categoryCount = {};
    posts.forEach((post) => {
      if (post.category && post.status === "published") {
        categoryCount[post.category] = (categoryCount[post.category] || 0) + 1;
      }
    });

    const topCategories = Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // 태그 통계
    const tagCount = {};
    posts.forEach((post) => {
      if (post.tags && post.status === "published") {
        post.tags.forEach((tag) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      }
    });

    const topTags = Object.entries(tagCount)
      .map(([name, count]) => ({ name, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // 인기 게시글
    const popularPosts = [...posts]
      .filter((p) => p.status === "published")
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 3)
      .map((p) => ({ id: p.id, title: p.title, views: p.viewCount || 0 }));

    setCommunityStats({
      totalPosts,
      totalComments,
      activeUsers: 8, // 이 값은 실제로는 활성 사용자 수를 계산해야 합니다
      topCategories,
      topTags,
      popularPosts,
    });
  };

  // 필터링된 게시글 가져오기
  const getFilteredPosts = () => {
    return posts.filter((post) => {
      // 검색어 필터링
      if (postFilter.searchValue) {
        const searchValue = postFilter.searchValue.toLowerCase();
        switch (postFilter.searchType) {
          case "title":
            if (!post.title.toLowerCase().includes(searchValue)) return false;
            break;
          case "author":
            if (!post.author.toLowerCase().includes(searchValue)) return false;
            break;
          case "email":
            if (!post.email?.toLowerCase().includes(searchValue)) return false;
            break;
          case "content":
            if (!post.content.toLowerCase().includes(searchValue)) return false;
            break;
        }
      }

      // 카테고리 필터링
      if (
        postFilter.categoryFilter !== "all" &&
        post.category !== postFilter.categoryFilter
      ) {
        return false;
      }

      // 상태 필터링
      if (
        postFilter.statusFilter !== "all" &&
        post.status !== postFilter.statusFilter
      ) {
        return false;
      }

      // 스팸 필터링
      if (postFilter.spamFilter && !post.isSpam) {
        return false;
      }

      // 고정글 필터링
      if (postFilter.pinnedFilter && !post.isPinned && !post.pinned) {
        return false;
      }

      return true;
    });
  };

  // 게시글 상세보기 모달 열기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post);
    setShowPostDetailModal(true);
  };

  // 게시글 상세보기 모달 닫기
  const closePostDetail = () => {
    setShowPostDetailModal(false);
  };

  return (
    <div className="container py-6 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">커뮤니티 관리</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">게시글 관리</TabsTrigger>
          <TabsTrigger value="categories">카테고리 관리</TabsTrigger>
          <TabsTrigger value="tags">태그 관리</TabsTrigger>
          <TabsTrigger value="stats">통계 및 알림</TabsTrigger>
        </TabsList>

        {/* 게시글 관리 탭 */}
        <TabsContent value="posts" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              <div className="flex-1">
                <Input
                  placeholder="검색어를 입력하세요"
                  value={postFilter.searchValue}
                  onChange={(e) =>
                    setPostFilter({
                      ...postFilter,
                      searchValue: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>
              <Select
                value={postFilter.searchType}
                onValueChange={(value) =>
                  setPostFilter({
                    ...postFilter,
                    searchType: value as
                      | "title"
                      | "author"
                      | "email"
                      | "content",
                  })
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="검색 유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">제목</SelectItem>
                  <SelectItem value="author">작성자</SelectItem>
                  <SelectItem value="email">이메일</SelectItem>
                  <SelectItem value="content">내용</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>필터</span>
              </Button>
            </div>
          </div>

          {/* 필터 옵션 */}
          <div className="flex flex-wrap gap-2">
            <Select
              value={postFilter.categoryFilter}
              onValueChange={(value) =>
                setPostFilter({
                  ...postFilter,
                  categoryFilter: value,
                })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 카테고리</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={postFilter.statusFilter}
              onValueChange={(value) =>
                setPostFilter({
                  ...postFilter,
                  statusFilter: value as
                    | "all"
                    | "published"
                    | "draft"
                    | "hidden",
                })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="published">공개됨</SelectItem>
                <SelectItem value="draft">임시저장</SelectItem>
                <SelectItem value="hidden">숨김</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Switch
                id="spamFilter"
                checked={postFilter.spamFilter}
                onCheckedChange={(checked) =>
                  setPostFilter({
                    ...postFilter,
                    spamFilter: checked,
                  })
                }
              />
              <Label htmlFor="spamFilter">스팸만 보기</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="pinnedFilter"
                checked={postFilter.pinnedFilter}
                onCheckedChange={(checked) =>
                  setPostFilter({
                    ...postFilter,
                    pinnedFilter: checked,
                  })
                }
              />
              <Label htmlFor="pinnedFilter">고정글만 보기</Label>
            </div>
          </div>

          {/* 게시글 목록 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>게시글 목록</CardTitle>
              <CardDescription>
                전체 {posts.length}개 중 {getFilteredPosts().length}개 표시
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>제목</TableHead>
                      <TableHead>작성자</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead>날짜</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredPosts().length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center h-24 text-muted-foreground"
                        >
                          게시글이 없습니다
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredPosts().map((post) => (
                        <TableRow
                          key={post.id}
                          className={post.isSpam ? "bg-red-50" : ""}
                          onClick={() => openPostDetail(post)}
                          style={{ cursor: "pointer" }}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              {(post.isPinned || post.pinned) && (
                                <Pin className="h-4 w-4 text-orange-500 mr-1" />
                              )}
                              <span
                                className={
                                  post.status === "hidden"
                                    ? "line-through text-muted-foreground"
                                    : ""
                                }
                              >
                                {post.title}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{post.author}</TableCell>
                          <TableCell>
                            <Badge
                              style={{
                                backgroundColor:
                                  categories.find(
                                    (c) => c.name === post.category,
                                  )?.color || "#888888",
                              }}
                              className="text-white"
                            >
                              {post.category}
                            </Badge>
                          </TableCell>
                          <TableCell>{post.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                post.status === "published"
                                  ? "default"
                                  : post.status === "draft"
                                    ? "outline"
                                    : "secondary"
                              }
                            >
                              {post.status === "published"
                                ? "공개"
                                : post.status === "draft"
                                  ? "임시저장"
                                  : "숨김"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => openPostDetail(post)}
                                >
                                  상세 보기
                                </DropdownMenuItem>
                                {post.status === "published" ? (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handlePostStatusChange(post.id, "hidden")
                                    }
                                  >
                                    <EyeOff className="h-4 w-4 mr-2" />
                                    숨기기
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handlePostStatusChange(
                                        post.id,
                                        "published",
                                      )
                                    }
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    공개하기
                                  </DropdownMenuItem>
                                )}
                                {post.isPinned || post.pinned ? (
                                  <DropdownMenuItem
                                    onClick={() => handleTogglePin(post.id)}
                                  >
                                    <PinOff className="h-4 w-4 mr-2" />
                                    고정 해제
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => handleTogglePin(post.id)}
                                  >
                                    <Pin className="h-4 w-4 mr-2" />
                                    고정하기
                                  </DropdownMenuItem>
                                )}
                                {post.isSpam ? (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleMarkAsSpam(post.id, false)
                                    }
                                  >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    스팸 아님으로 표시
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleMarkAsSpam(post.id, true)
                                    }
                                    className="text-red-500"
                                  >
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    스팸으로 표시
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleDeletePost(post.id)}
                                  className="text-red-500"
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  삭제하기
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* 게시글 상세보기 모달 */}
          <Dialog
            open={showPostDetailModal}
            onOpenChange={setShowPostDetailModal}
          >
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
              {selectedPost && (
                <>
                  <DialogHeader>
                    <DialogTitle>
                      {(selectedPost.isPinned || selectedPost.pinned) && (
                        <Pin className="h-4 w-4 text-orange-500 mr-1 inline-block" />
                      )}
                      {selectedPost.title}
                    </DialogTitle>
                    <DialogDescription>
                      {selectedPost.author} • {selectedPost.date}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="whitespace-pre-line p-4 bg-muted rounded-md">
                      {selectedPost.content}
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        댓글 ({selectedPost.commentsList?.length || 0})
                      </h4>
                      <div className="space-y-2">
                        {!selectedPost.commentsList?.length ? (
                          <div className="text-center py-4 text-muted-foreground">
                            댓글이 없습니다
                          </div>
                        ) : (
                          selectedPost.commentsList?.map((comment) => (
                            <div
                              key={comment.id}
                              className={`p-3 border rounded-md ${
                                comment.status === "hidden"
                                  ? "bg-muted opacity-70"
                                  : ""
                              } ${comment.isSpam ? "bg-red-50" : ""}`}
                            >
                              <div className="flex justify-between">
                                <div>
                                  <p className="text-sm font-medium">
                                    {comment.author}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {comment.date}
                                  </p>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {comment.status === "visible" ? (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleCommentStatusChange(
                                            selectedPost.id,
                                            comment.id,
                                            "hidden",
                                          )
                                        }
                                      >
                                        <EyeOff className="h-4 w-4 mr-2" />
                                        숨기기
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleCommentStatusChange(
                                            selectedPost.id,
                                            comment.id,
                                            "visible",
                                          )
                                        }
                                      >
                                        <Eye className="h-4 w-4 mr-2" />
                                        보이기
                                      </DropdownMenuItem>
                                    )}
                                    {comment.isSpam ? (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleMarkCommentAsSpam(
                                            selectedPost.id,
                                            comment.id,
                                            false,
                                          )
                                        }
                                      >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        스팸 아님으로 표시
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem
                                        className="text-red-500"
                                        onClick={() =>
                                          handleMarkCommentAsSpam(
                                            selectedPost.id,
                                            comment.id,
                                            true,
                                          )
                                        }
                                      >
                                        <AlertCircle className="h-4 w-4 mr-2" />
                                        스팸으로 표시
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      className="text-red-500"
                                      onClick={() =>
                                        handleDeleteComment(
                                          selectedPost.id,
                                          comment.id,
                                        )
                                      }
                                    >
                                      <Trash className="h-4 w-4 mr-2" />
                                      삭제하기
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <p className="mt-2 text-sm">{comment.content}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <div className="flex gap-2 justify-between w-full">
                      <div>
                        {selectedPost.status === "published" ? (
                          <Button
                            variant="outline"
                            onClick={() =>
                              handlePostStatusChange(selectedPost.id, "hidden")
                            }
                          >
                            <EyeOff className="h-4 w-4 mr-2" />
                            숨기기
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() =>
                              handlePostStatusChange(
                                selectedPost.id,
                                "published",
                              )
                            }
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            공개하기
                          </Button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {selectedPost.isPinned || selectedPost.pinned ? (
                          <Button
                            variant="outline"
                            onClick={() => handleTogglePin(selectedPost.id)}
                          >
                            <PinOff className="h-4 w-4 mr-2" />
                            고정 해제
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => handleTogglePin(selectedPost.id)}
                          >
                            <Pin className="h-4 w-4 mr-2" />
                            고정하기
                          </Button>
                        )}
                        {selectedPost.isSpam ? (
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleMarkAsSpam(selectedPost.id, false)
                            }
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            스팸 아님
                          </Button>
                        ) : (
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleMarkAsSpam(selectedPost.id, true)
                            }
                          >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            스팸으로 표시
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          onClick={() => {
                            handleDeletePost(selectedPost.id);
                            closePostDetail();
                          }}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          삭제하기
                        </Button>
                      </div>
                    </div>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* 카테고리 관리 탭 */}
        <TabsContent value="categories" className="space-y-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="category-name">카테고리 이름</Label>
              <Input
                id="category-name"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, name: e.target.value })
                }
                placeholder="카테고리 이름"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-description">설명</Label>
              <Input
                id="category-description"
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    description: e.target.value,
                  })
                }
                placeholder="카테고리 설명"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-color">색상</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="category-color"
                  type="color"
                  value={categoryForm.color}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      color: e.target.value,
                    })
                  }
                  className="w-16 h-10"
                />
                <Badge
                  style={{ backgroundColor: categoryForm.color }}
                  className="text-white"
                >
                  {categoryForm.name || "미리보기"}
                </Badge>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              {editingCategoryId && (
                <Button variant="outline" onClick={handleCancelCategoryEdit}>
                  취소
                </Button>
              )}
              <Button
                onClick={handleCategorySubmit}
                disabled={!categoryForm.name.trim()}
              >
                {editingCategoryId ? "수정" : "추가"}
              </Button>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>색상</TableHead>
                  <TableHead>사용</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center h-24 text-muted-foreground"
                    >
                      등록된 카테고리가 없습니다
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        <Badge
                          style={{ backgroundColor: category.color }}
                          className="text-white"
                        >
                          {category.name}
                        </Badge>
                      </TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: category.color }}
                        ></div>
                      </TableCell>
                      <TableCell>{category.postCount}개</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* 태그 관리 탭 */}
        <TabsContent value="tags" className="space-y-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="tag-name">태그 이름</Label>
              <div className="flex gap-2">
                <Input
                  id="tag-name"
                  value={tagForm.name}
                  onChange={(e) =>
                    setTagForm({ ...tagForm, name: e.target.value })
                  }
                  placeholder="태그 이름"
                />
                <Button
                  onClick={handleTagSubmit}
                  disabled={!tagForm.name.trim()}
                >
                  {editingTagId ? (
                    <Pencil className="h-4 w-4 mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {editingTagId ? "수정" : "추가"}
                </Button>
                {editingTagId && (
                  <Button variant="outline" onClick={handleCancelTagEdit}>
                    취소
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>사용</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center h-24 text-muted-foreground"
                    >
                      등록된 태그가 없습니다
                    </TableCell>
                  </TableRow>
                ) : (
                  tags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell className="font-medium">
                        <Badge variant="outline">{tag.name}</Badge>
                      </TableCell>
                      <TableCell>{tag.postCount}개</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTag(tag)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => handleDeleteTag(tag.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* 통계 및 알림 탭 */}
        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 통계 요약 */}
            <Card>
              <CardHeader>
                <CardTitle>커뮤니티 통계</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">총 게시글</h4>
                    <p className="text-2xl font-bold">
                      {communityStats.totalPosts}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">총 댓글</h4>
                    <p className="text-2xl font-bold">
                      {communityStats.totalComments}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">활성 사용자</h4>
                    <p className="text-2xl font-bold">
                      {communityStats.activeUsers}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 인기 게시글 */}
            <Card>
              <CardHeader>
                <CardTitle>인기 게시글</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {communityStats.popularPosts.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      인기 게시글이 없습니다
                    </div>
                  ) : (
                    communityStats.popularPosts.map((post, index) => (
                      <div
                        key={post.id}
                        className="flex items-center space-x-2"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {post.title}
                          </p>
                          <div className="flex text-xs text-muted-foreground">
                            <p>조회 {post.views}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 스팸 감지 */}
            <Card>
              <CardHeader>
                <CardTitle>스팸 감지</CardTitle>
              </CardHeader>
              <CardContent>
                {spamStats.totalDetected === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    현재 스팸 의심 항목이 없습니다
                  </div>
                ) : (
                  <div className="space-y-4">
                    {spamStats.totalDetected > 0 && (
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-md">
                        <div className="flex items-center space-x-3">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                          <div>
                            <p className="font-medium">스팸 의심 항목</p>
                            <p className="text-sm text-muted-foreground">
                              {spamStats.totalDetected}개의 항목이 스팸으로
                              의심됩니다
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setActiveTab("posts");
                            setPostFilter({
                              ...postFilter,
                              spamFilter: true,
                            });
                          }}
                        >
                          확인하기
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 카테고리 및 태그 분석 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>인기 카테고리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {communityStats.topCategories.map((category, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-full">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            {category.name}
                          </span>
                          <span className="text-sm font-medium">
                            {category.count}개
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{
                              width: `${(category.count / Math.max(...communityStats.topCategories.map((c) => c.count))) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>인기 태그</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {communityStats.topTags.map((tag, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-full">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            {tag.name}
                          </span>
                          <span className="text-sm font-medium">
                            {tag.count}개
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{
                              width: `${(tag.count / Math.max(...communityStats.topTags.map((t) => t.count))) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
