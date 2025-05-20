"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Heart,
  Paperclip,
  LinkIcon,
  Video,
  BarChart2,
  Smile,
  Tag,
  User,
  Send,
  Filter,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

export function CommunityTab() {
  const router = useRouter();
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("Questions");
  const [posts, setPosts] = useState([
    {
      id: 1,
      pinned: true,
      author: "Hyungwoo Park",
      authorUsername: "hyungwoo",
      date: "May 18, 2025",
      category: "Announcements",
      title: "ClassHive 커뮤니티에 오신 것을 환영합니다!",
      content:
        "안녕하세요! 이 공간은 학습하고, 나누고, 함께 성장하는 커뮤니티입니다. 혼자였다면 어려웠을 여정도, 함께라서 훨씬 즐겁고 빠르게 나아갈 수 있어요.\n\n이 커뮤니티에서 누릴 수 있는 것들:\n✔ 커뮤니티 전용 독점 콘텐츠 공유\n✔ 실전 프로젝트 및 튜토리얼\n✔ 최신 학습 자료와 실전 사례 소개\n✔ 다양한 분야의 전문가들과 교류\n\n함께해주셔서 정말 감사합니다. 그리고, 더 재밌게, 더 유익하게 만들어가요!",
      comments: 5,
      likes: 24,
      commentsList: [
        {
          id: 1,
          author: "Sunghyun Ko",
          authorUsername: "sunghyun-ko",
          date: "May 18, 2025",
          content: "환영합니다! 좋은 커뮤니티가 될 것 같아요.",
          likes: 3,
        },
        {
          id: 2,
          author: "Tim Nelms",
          authorUsername: "timothy-nelms",
          date: "May 18, 2025",
          content: "기대가 큽니다. 함께 성장해요!",
          likes: 2,
        },
        {
          id: 3,
          author: "Sean Yoo",
          authorUsername: "sean-yoo",
          date: "May 19, 2025",
          content: "안녕하세요! 잘 부탁드립니다.",
          likes: 1,
        },
        {
          id: 4,
          author: "호영 정",
          authorUsername: "hoyoung",
          date: "May 19, 2025",
          content: "좋은 커뮤니티네요. 열심히 참여하겠습니다!",
          likes: 0,
        },
        {
          id: 5,
          author: "Andrew Choi",
          authorUsername: "andrew-choi",
          date: "May 19, 2025",
          content: "반갑습니다! 함께 배워가요.",
          likes: 1,
        },
      ],
    },
    {
      id: 2,
      pinned: false,
      author: "Sunghyun Ko",
      authorUsername: "sunghyun-ko",
      date: "May 19, 2025",
      category: "Questions",
      title: "학습 로드맵에 대해 질문이 있습니다",
      content:
        "안녕하세요, 처음 시작하는 입장에서 어떤 순서로 강의를 들어야 할지 추천해주실 수 있을까요? 효율적인 학습 로드맵이 궁금합니다.\n\n현재 기초 지식은 있지만, 체계적으로 학습하고 싶습니다. 추천해주시면 정말 감사하겠습니다!",
      comments: 3,
      likes: 7,
      commentsList: [
        {
          id: 1,
          author: "Hyungwoo Park",
          authorUsername: "hyungwoo",
          date: "May 19, 2025",
          content:
            "안녕하세요! 기초 강의부터 시작하시는 것을 추천드립니다. 'ClassHive 입문자를 위한 필수 가이드'를 먼저 수강하시고, 그 다음에 관심 있는 분야의 강의를 들으시면 좋을 것 같아요.",
          likes: 2,
        },
        {
          id: 2,
          author: "Tim Nelms",
          authorUsername: "timothy-nelms",
          date: "May 19, 2025",
          content:
            "저도 Hyungwoo님 의견에 동의합니다. 기초 강의 후에 실습 위주의 강의를 들으시면 효과적일 거예요.",
          likes: 1,
        },
        {
          id: 3,
          author: "Andrew Choi",
          authorUsername: "andrew-choi",
          date: "May 20, 2025",
          content:
            "저는 로드맵을 따라가면서 작은 프로젝트를 병행했을 때 가장 효과적이었어요. 강의만 듣기보다는 배운 내용을 바로 적용해보세요!",
          likes: 3,
        },
      ],
    },
    {
      id: 3,
      pinned: false,
      author: "Tim Nelms",
      authorUsername: "timothy-nelms",
      date: "May 17, 2025",
      category: "Resources",
      title: "유용한 학습 자료 공유합니다",
      content:
        "최근에 발견한 좋은 학습 자료들을 공유합니다. 특히 입문자분들에게 도움이 될 것 같아요.\n\n1. 기초 개념 정리 문서: [링크]\n2. 실전 예제 모음: [링크]\n3. 유용한 툴 소개: [링크]\n4. 커뮤니티 추천 자료: [링크]\n\n다들 학습에 도움이 되셨으면 좋겠습니다!",
      comments: 8,
      likes: 15,
      commentsList: [
        {
          id: 1,
          author: "Sunghyun Ko",
          authorUsername: "sunghyun-ko",
          date: "May 17, 2025",
          content: "정말 유용한 자료네요! 감사합니다.",
          likes: 2,
        },
        {
          id: 2,
          author: "Sean Yoo",
          authorUsername: "sean-yoo",
          date: "May 17, 2025",
          content:
            "특히 실전 예제 모음이 정말 도움이 됐어요. 추가 자료도 있으면 공유해주세요!",
          likes: 1,
        },
        {
          id: 3,
          author: "호영 정",
          authorUsername: "hoyoung",
          date: "May 18, 2025",
          content:
            "좋은 자료 감사합니다. 저도 유용한 자료가 있으면 공유하겠습니다.",
          likes: 0,
        },
        {
          id: 4,
          author: "Kim Jeong ryul",
          authorUsername: "kim-jeong-ryul",
          date: "May 18, 2025",
          content:
            "자료 잘 보고 있습니다. 특히 기초 개념 정리 문서가 체계적이어서 좋네요.",
          likes: 1,
        },
        {
          id: 5,
          author: "Ibra Ryz",
          authorUsername: "ibra-ryz",
          date: "May 18, 2025",
          content: "감사합니다! 많은 도움이 되고 있어요.",
          likes: 0,
        },
        {
          id: 6,
          author: "Andrew Choi",
          authorUsername: "andrew-choi",
          date: "May 19, 2025",
          content:
            "좋은 자료 공유 감사합니다. 저도 몇 가지 추천하고 싶은 자료가 있는데, 나중에 별도 포스트로 공유할게요.",
          likes: 2,
        },
        {
          id: 7,
          author: "현택 이",
          authorUsername: "hyuntaek-lee",
          date: "May 19, 2025",
          content:
            "정말 유용한 자료네요. 특히 3번 유용한 툴 소개가 실무에 많은 도움이 됩니다.",
          likes: 1,
        },
        {
          id: 8,
          author: "Hyungwoo Park",
          authorUsername: "hyungwoo",
          date: "May 20, 2025",
          content:
            "좋은 자료 공유 감사합니다! 커뮤니티 자료실에도 추가해두었습니다.",
          likes: 3,
        },
      ],
    },
  ]);

  // Add this useEffect after the other state declarations
  useEffect(() => {
    // Check URL for category parameter
    const url = new URL(window.location.href);
    const categoryParam = url.searchParams.get("category");
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, []);

  const categories = [
    { id: "all", label: "All" },
    { id: "introductions", label: "Introductions" },
    { id: "questions", label: "Questions" },
    { id: "resources", label: "Resources" },
    { id: "announcements", label: "Announcements" },
    { id: "events", label: "Events" },
    { id: "projects", label: "Projects" },
    { id: "feedback", label: "Feedback" },
    { id: "tutorials", label: "Tutorials" },
    { id: "discussions", label: "Discussions" },
    { id: "news", label: "News" },
    { id: "jobs", label: "Jobs" },
  ];

  // Display only the first 5 categories or all categories based on state
  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 5);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!postTitle.trim() || !postContent.trim()) {
      // Don't submit if title or content is empty
      return;
    }

    // Create a new post object
    const newPost = {
      id: posts.length > 0 ? Math.max(...posts.map((post) => post.id)) + 1 : 1,
      pinned: false,
      author: "Current User", // In a real app, this would be the logged-in user
      authorUsername: "current-user",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      category: selectedCategory,
      title: postTitle,
      content: postContent,
      comments: 0,
      likes: 0,
      commentsList: [],
    };

    // Add the new post to the beginning of the posts array
    setPosts([newPost, ...posts]);

    // Reset the form
    setPostTitle("");
    setPostContent("");
    setIsExpanded(false);
  };

  // Sort posts based on selected option
  const getSortedPosts = () => {
    const postsToSort = [...posts];

    switch (sortOption) {
      case "new":
        return postsToSort.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "top":
        return postsToSort.sort((a, b) => b.likes - a.likes);
      default:
        // Default sorting: pinned posts first, then by date
        return postsToSort.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.date) - new Date(a.date);
        });
    }
  };

  const handleOpenModal = (post) => {
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
    // 새 댓글 객체 생성
    const newComment = {
      id:
        selectedPost.commentsList.length > 0
          ? Math.max(...selectedPost.commentsList.map((c) => c.id)) + 1
          : 1,
      author: "Current User", // 실제 앱에서는 로그인 유저 정보 사용
      authorUsername: "current-user",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      content: commentText,
      likes: 0,
    };
    // posts 배열에서 해당 post의 commentsList에 새 댓글 추가
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === selectedPost.id
          ? {
              ...post,
              commentsList: [...post.commentsList, newComment],
              comments: post.comments + 1,
            }
          : post,
      ),
    );
    // 선택된 post의 commentsList도 업데이트
    setSelectedPost((prev) =>
      prev
        ? {
            ...prev,
            commentsList: [...prev.commentsList, newComment],
            comments: prev.comments + 1,
          }
        : prev,
    );
    setCommentText("");
  };

  const toggleCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  return (
    <div className="w-full h-full px-4 py-6">
      {/* Post Creation Card */}
      {!isExpanded ? (
        <Card className="mb-6">
          <CardContent className="p-4">
            <Input
              placeholder="자유롭게 얘기해주세요!"
              className="text-lg"
              onClick={() => setIsExpanded(true)}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <Input
              placeholder="무엇이 궁금한가요? (제목)"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="text-lg font-medium"
              autoFocus
            />
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="본문을 입력하세요..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                카테고리 선택
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.slice(1).map((category) => (
                  <option key={category.id} value={category.label}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <BarChart2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Smile className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsExpanded(false)}>
                취소
              </Button>
              <Button
                className="bg-[#2F80ED] hover:bg-[#2F80ED]/90"
                onClick={handlePostSubmit}
                disabled={!postTitle.trim() || !postContent.trim()}
              >
                게시하기
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Category Tabs */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex flex-col">
            <div className="flex flex-wrap gap-1 w-full overflow-visible h-auto py-1 bg-muted rounded-md">
              {visibleCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={category.id === activeCategory ? "default" : "ghost"}
                  size="sm"
                  className={`mb-1 ${category.id === activeCategory ? "bg-[#2F80ED] text-white" : ""}`}
                  onClick={() => {
                    setActiveCategory(category.id);
                    // Handle route navigation based on category
                    if (category.id === "all") {
                      router.push("/");
                    } else if (category.id === "classroom") {
                      router.push("/classroom");
                    } else if (category.id === "calendar") {
                      router.push("/calendar");
                    } else if (category.id === "members") {
                      router.push("/members");
                    } else if (category.id === "about") {
                      router.push("/about");
                    } else {
                      // For other categories, stay on community page with query param
                      router.push(`/?category=${category.id}`);
                    }
                  }}
                >
                  {category.label}
                </Button>
              ))}

              {categories.length > 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 flex items-center gap-1 mb-1"
                  onClick={toggleCategories}
                >
                  {showAllCategories ? (
                    <>
                      <span>접기</span>
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>더보기</span>
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

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
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {getSortedPosts().map((post) => (
          <Card
            key={post.id}
            className={`${post.pinned ? "border-[#2F80ED]" : ""} cursor-pointer hover:shadow-md transition-shadow`}
            onClick={() => handleOpenModal(post)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`/placeholder.svg?text=${post.author.charAt(0)}`}
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{post.author}</div>
                    <div className="text-xs text-muted-foreground">
                      {post.date} • {post.category}
                      {post.pinned && " • 📌 Pinned"}
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold mt-2">{post.title}</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-3">
                {post.content}
              </p>
            </CardContent>
            <CardFooter>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Post Detail Modal */}
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
                  <div>
                    <div className="font-medium">{selectedPost.author}</div>
                    <div className="text-xs text-muted-foreground">
                      {selectedPost.date} • {selectedPost.category}
                      {selectedPost.pinned && " • 📌 Pinned"}
                    </div>
                  </div>
                </div>
                <DialogTitle className="text-2xl font-bold">
                  {selectedPost.title}
                </DialogTitle>
                <DialogDescription className="whitespace-pre-line mt-4">
                  {selectedPost.content}
                </DialogDescription>
              </DialogHeader>

              <div className="flex gap-4 my-4">
                <Button variant="outline" size="sm" className="gap-1">
                  <Heart className="h-4 w-4" />
                  <span>좋아요 {selectedPost.likes}</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>댓글 {selectedPost.comments}</span>
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h4 className="font-medium">댓글 {selectedPost.comments}개</h4>

                <div className="flex gap-2">
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
                      className="bg-[#2F80ED] hover:bg-[#2F80ED]/90"
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  {selectedPost.commentsList.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`/placeholder.svg?text=${comment.author.charAt(0)}`}
                        />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {comment.date}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                          >
                            <Heart className="h-3 w-3 mr-1" />
                            <span>{comment.likes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                          >
                            답글
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
