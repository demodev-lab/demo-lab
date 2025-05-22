import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Comment {
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

export interface Post {
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

export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  postCount: number;
}

export interface Tag {
  id: number;
  name: string;
  postCount: number;
}

// 초기 데이터
const initialPosts: Post[] = [
  {
    id: 1,
    pinned: true,
    isPinned: true,
    author: "Hyungwoo Park",
    authorUsername: "hyungwoo",
    email: "hyungwoo@classhive.io",
    date: "May 18, 2025",
    category: "Announcements",
    categoryId: 1,
    title: "ClassHive 커뮤니티에 오신 것을 환영합니다!",
    content:
      "안녕하세요! 이 공간은 학습하고, 나누고, 함께 성장하는 커뮤니티입니다. 혼자였다면 어려웠을 여정도, 함께라서 훨씬 즐겁고 빠르게 나아갈 수 있어요.\n\n이 커뮤니티에서 누릴 수 있는 것들:\n✔ 커뮤니티 전용 독점 콘텐츠 공유\n✔ 실전 프로젝트 및 튜토리얼\n✔ 최신 학습 자료와 실전 사례 소개\n✔ 다양한 분야의 전문가들과 교류\n\n함께해주셔서 정말 감사합니다. 그리고, 더 재밌게, 더 유익하게 만들어가요!",
    comments: 5,
    commentCount: 5,
    likes: 24,
    likeCount: 24,
    viewCount: 250,
    isLiked: false,
    status: "published",
    tags: ["프로그래밍", "프로젝트"],
    commentsList: [
      {
        id: 1,
        author: "Sunghyun Ko",
        authorUsername: "sunghyun-ko",
        email: "sunghyun@example.com",
        date: "May 18, 2025",
        content: "환영합니다! 좋은 커뮤니티가 될 것 같아요.",
        status: "visible",
        likes: 3,
        isSpam: false,
        replies: [],
      },
      {
        id: 2,
        author: "Tim Nelms",
        authorUsername: "timothy-nelms",
        email: "tim@example.com",
        date: "May 18, 2025",
        content: "기대가 큽니다. 함께 성장해요!",
        status: "visible",
        likes: 2,
        isSpam: false,
        replies: [],
      },
      {
        id: 3,
        author: "Sean Yoo",
        authorUsername: "sean-yoo",
        email: "sean@example.com",
        date: "May 19, 2025",
        content: "안녕하세요! 잘 부탁드립니다.",
        status: "visible",
        likes: 1,
        isSpam: false,
        replies: [],
      },
      {
        id: 4,
        author: "호영 정",
        authorUsername: "hoyoung",
        email: "hoyoung@example.com",
        date: "May 19, 2025",
        content: "좋은 커뮤니티네요. 열심히 참여하겠습니다!",
        status: "visible",
        likes: 0,
        isSpam: false,
        replies: [],
      },
      {
        id: 5,
        author: "Andrew Choi",
        authorUsername: "andrew-choi",
        email: "andrew@example.com",
        date: "May 19, 2025",
        content: "반갑습니다! 함께 배워가요.",
        status: "visible",
        likes: 1,
        isSpam: false,
        replies: [],
      },
    ],
  },
  {
    id: 2,
    pinned: false,
    isPinned: false,
    author: "Sunghyun Ko",
    authorUsername: "sunghyun-ko",
    email: "sunghyun@example.com",
    date: "May 19, 2025",
    category: "Questions",
    categoryId: 2,
    title: "학습 로드맵에 대해 질문이 있습니다",
    content:
      "안녕하세요, 처음 시작하는 입장에서 어떤 순서로 강의를 들어야 할지 추천해주실 수 있을까요? 효율적인 학습 로드맵이 궁금합니다.\n\n현재 기초 지식은 있지만, 체계적으로 학습하고 싶습니다. 추천해주시면 정말 감사하겠습니다!",
    comments: 3,
    commentCount: 3,
    likes: 7,
    likeCount: 7,
    viewCount: 85,
    isLiked: false,
    status: "published",
    tags: ["프로그래밍", "취업"],
    commentsList: [
      {
        id: 1,
        author: "Hyungwoo Park",
        authorUsername: "hyungwoo",
        email: "hyungwoo@classhive.io",
        date: "May 19, 2025",
        content:
          "안녕하세요! 기초 강의부터 시작하시는 것을 추천드립니다. 'ClassHive 입문자를 위한 필수 가이드'를 먼저 수강하시고, 그 다음에 관심 있는 분야의 강의를 들으시면 좋을 것 같아요.",
        status: "visible",
        likes: 2,
        isSpam: false,
        replies: [],
      },
      {
        id: 2,
        author: "Tim Nelms",
        authorUsername: "timothy-nelms",
        email: "tim@example.com",
        date: "May 19, 2025",
        content:
          "저도 Hyungwoo님 의견에 동의합니다. 기초 강의 후에 실습 위주의 강의를 들으시면 효과적일 거예요.",
        status: "visible",
        likes: 1,
        isSpam: false,
        replies: [],
      },
      {
        id: 3,
        author: "Andrew Choi",
        authorUsername: "andrew-choi",
        email: "andrew@example.com",
        date: "May 20, 2025",
        content:
          "저는 로드맵을 따라가면서 작은 프로젝트를 병행했을 때 가장 효과적이었어요. 강의만 듣기보다는 배운 내용을 바로 적용해보세요!",
        status: "visible",
        likes: 3,
        isSpam: false,
        replies: [],
      },
    ],
  },
  {
    id: 3,
    pinned: false,
    isPinned: false,
    author: "Tim Nelms",
    authorUsername: "timothy-nelms",
    email: "tim@example.com",
    date: "May 17, 2025",
    category: "Resources",
    categoryId: 3,
    title: "유용한 학습 자료 공유합니다",
    content:
      "최근에 발견한 좋은 학습 자료들을 공유합니다. 특히 입문자분들에게 도움이 될 것 같아요.\n\n1. 기초 개념 정리 문서: [링크]\n2. 실전 예제 모음: [링크]\n3. 유용한 툴 소개: [링크]\n4. 커뮤니티 추천 자료: [링크]\n\n다들 학습에 도움이 되셨으면 좋겠습니다!",
    comments: 8,
    commentCount: 8,
    likes: 15,
    likeCount: 15,
    viewCount: 130,
    isLiked: false,
    status: "published",
    tags: ["디자인", "프로그래밍"],
    commentsList: [
      {
        id: 1,
        author: "Sunghyun Ko",
        authorUsername: "sunghyun-ko",
        email: "sunghyun@example.com",
        date: "May 17, 2025",
        content: "정말 유용한 자료네요! 감사합니다.",
        status: "visible",
        likes: 2,
        isSpam: false,
        replies: [],
      },
      {
        id: 2,
        author: "Sean Yoo",
        authorUsername: "sean-yoo",
        email: "sean@example.com",
        date: "May 17, 2025",
        content:
          "특히 실전 예제 모음이 정말 도움이 됐어요. 추가 자료도 있으면 공유해주세요!",
        status: "visible",
        likes: 1,
        isSpam: false,
        replies: [],
      },
      {
        id: 3,
        author: "호영 정",
        authorUsername: "hoyoung",
        email: "hoyoung@example.com",
        date: "May 18, 2025",
        content:
          "좋은 자료 감사합니다. 저도 유용한 자료가 있으면 공유하겠습니다.",
        status: "visible",
        likes: 0,
        isSpam: false,
        replies: [],
      },
      {
        id: 4,
        author: "Kim Jeong ryul",
        authorUsername: "kim-jeong-ryul",
        email: "jrkim@example.com",
        date: "May 18, 2025",
        content:
          "자료 잘 보고 있습니다. 특히 기초 개념 정리 문서가 체계적이어서 좋네요.",
        status: "visible",
        likes: 1,
        isSpam: false,
        replies: [],
      },
      {
        id: 5,
        author: "Ibra Ryz",
        authorUsername: "ibra-ryz",
        email: "ibra@example.com",
        date: "May 18, 2025",
        content: "감사합니다! 많은 도움이 되고 있어요.",
        status: "visible",
        likes: 0,
        isSpam: false,
        replies: [],
      },
      {
        id: 6,
        author: "Andrew Choi",
        authorUsername: "andrew-choi",
        email: "andrew@example.com",
        date: "May 19, 2025",
        content:
          "좋은 자료 공유 감사합니다. 저도 몇 가지 추천하고 싶은 자료가 있는데, 나중에 별도 포스트로 공유할게요.",
        status: "visible",
        likes: 2,
        isSpam: false,
        replies: [],
      },
      {
        id: 7,
        author: "현택 이",
        authorUsername: "hyuntaek-lee",
        email: "hyuntaek@example.com",
        date: "May 19, 2025",
        content:
          "정말 유용한 자료네요. 특히 3번 유용한 툴 소개가 실무에 많은 도움이 됩니다.",
        status: "visible",
        likes: 1,
        isSpam: false,
        replies: [],
      },
      {
        id: 8,
        author: "Hyungwoo Park",
        authorUsername: "hyungwoo",
        email: "hyungwoo@classhive.io",
        date: "May 20, 2025",
        content:
          "좋은 자료 공유 감사합니다! 커뮤니티 자료실에도 추가해두었습니다.",
        status: "visible",
        likes: 3,
        isSpam: false,
        replies: [],
      },
    ],
  },
];

const initialCategories: Category[] = [
  {
    id: 1,
    name: "Announcements",
    description: "관리자의 공지사항",
    color: "#FF5722",
    postCount: 1,
  },
  {
    id: 2,
    name: "Questions",
    description: "회원들의 질문",
    color: "#2196F3",
    postCount: 1,
  },
  {
    id: 3,
    name: "Resources",
    description: "학습 자료 공유",
    color: "#4CAF50",
    postCount: 1,
  },
  {
    id: 4,
    name: "Discussions",
    description: "자유 토론",
    color: "#9C27B0",
    postCount: 0,
  },
  {
    id: 5,
    name: "Events",
    description: "이벤트 및 모임",
    color: "#FFC107",
    postCount: 0,
  },
];

const initialTags: Tag[] = [
  { id: 1, name: "프로그래밍", postCount: 3 },
  { id: 2, name: "디자인", postCount: 1 },
  { id: 3, name: "마케팅", postCount: 0 },
  { id: 4, name: "취업", postCount: 1 },
  { id: 5, name: "프로젝트", postCount: 1 },
];

interface CommunityState {
  posts: Post[];
  categories: Category[];
  tags: Tag[];
  setPosts: (posts: Post[]) => void;
  setCategories: (categories: Category[]) => void;
  setTags: (tags: Tag[]) => void;
  addPost: (post: Post) => void;
  updatePost: (postId: number, post: Partial<Post>) => void;
  deletePost: (postId: number) => void;
  togglePinPost: (postId: number) => void;
  toggleLikePost: (postId: number) => void;
  addComment: (postId: number, comment: Comment) => void;
  updateComment: (
    postId: number,
    commentId: number,
    commentUpdate: Partial<Comment>,
  ) => void;
  deleteComment: (postId: number, commentId: number) => void;
  toggleLikeComment: (postId: number, commentId: number) => void;
  addCategory: (category: Category) => void;
  updateCategory: (categoryId: number, category: Partial<Category>) => void;
  deleteCategory: (categoryId: number) => void;
  addTag: (tag: Tag) => void;
  updateTag: (tagId: number, tag: Partial<Tag>) => void;
  deleteTag: (tagId: number) => void;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set) => ({
      posts: initialPosts,
      categories: initialCategories,
      tags: initialTags,

      setPosts: (posts) => set({ posts }),
      setCategories: (categories) => set({ categories }),
      setTags: (tags) => set({ tags }),

      addPost: (post) =>
        set((state) => ({
          posts: [post, ...state.posts],
        })),

      updatePost: (postId, updatedPost) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId ? { ...post, ...updatedPost } : post,
          ),
        })),

      deletePost: (postId) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== postId),
        })),

      togglePinPost: (postId) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? { ...post, isPinned: !post.isPinned, pinned: !post.pinned }
              : post,
          ),
        })),

      toggleLikePost: (postId) =>
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id === postId) {
              const isLiked = !post.isLiked;
              const likeCount = isLiked
                ? (post.likeCount || 0) + 1
                : (post.likeCount || 0) - 1;
              const likes = likeCount;

              return {
                ...post,
                isLiked,
                likeCount,
                likes,
              };
            }
            return post;
          }),
        })),

      addComment: (postId, comment) =>
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id === postId) {
              const commentsList = [...(post.commentsList || []), comment];
              return {
                ...post,
                commentsList,
                comments: commentsList.length,
                commentCount: commentsList.length,
              };
            }
            return post;
          }),
        })),

      updateComment: (postId, commentId, commentUpdate) =>
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id === postId) {
              const commentsList = post.commentsList?.map((comment) =>
                comment.id === commentId
                  ? { ...comment, ...commentUpdate }
                  : comment,
              );
              return { ...post, commentsList };
            }
            return post;
          }),
        })),

      deleteComment: (postId, commentId) =>
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id === postId) {
              const commentsList =
                post.commentsList?.filter(
                  (comment) => comment.id !== commentId,
                ) || [];
              return {
                ...post,
                commentsList,
                comments: commentsList.length,
                commentCount: commentsList.length,
              };
            }
            return post;
          }),
        })),

      toggleLikeComment: (postId, commentId) =>
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id === postId) {
              const commentsList = post.commentsList?.map((comment) => {
                if (comment.id === commentId) {
                  // 좋아요가 이미 있는지 확인
                  const isLiked = true; // 실제로는 사용자 ID와 비교해서 결정해야 함
                  const likes = isLiked
                    ? (comment.likes || 0) + 1
                    : (comment.likes || 0) - 1;

                  return { ...comment, likes };
                }
                return comment;
              });
              return { ...post, commentsList };
            }
            return post;
          }),
        })),

      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
        })),

      updateCategory: (categoryId, updatedCategory) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === categoryId
              ? { ...category, ...updatedCategory }
              : category,
          ),
          // 관련 게시글의 카테고리 이름도 업데이트
          posts: state.posts.map((post) =>
            post.categoryId === categoryId && updatedCategory.name
              ? { ...post, category: updatedCategory.name }
              : post,
          ),
        })),

      deleteCategory: (categoryId) =>
        set((state) => ({
          categories: state.categories.filter(
            (category) => category.id !== categoryId,
          ),
          // 연결된 게시글의 카테고리를 '미분류'로 변경
          posts: state.posts.map((post) =>
            post.categoryId === categoryId
              ? { ...post, category: "미분류", categoryId: 0 }
              : post,
          ),
        })),

      addTag: (tag) =>
        set((state) => ({
          tags: [...state.tags, tag],
        })),

      updateTag: (tagId, updatedTag) =>
        set((state) => {
          const oldTag = state.tags.find((t) => t.id === tagId);
          const oldName = oldTag?.name || "";
          const newName = updatedTag.name || oldName;

          return {
            tags: state.tags.map((tag) =>
              tag.id === tagId ? { ...tag, ...updatedTag } : tag,
            ),
            // 연결된 게시글의 태그도 업데이트
            posts: state.posts.map((post) => ({
              ...post,
              tags: post.tags?.map((t) => (t === oldName ? newName : t)),
            })),
          };
        }),

      deleteTag: (tagId) =>
        set((state) => {
          const tagToDelete = state.tags.find((t) => t.id === tagId);
          if (!tagToDelete) return state;

          return {
            tags: state.tags.filter((tag) => tag.id !== tagId),
            // 연결된 게시글에서 태그 제거
            posts: state.posts.map((post) => ({
              ...post,
              tags: post.tags?.filter((t) => t !== tagToDelete.name),
            })),
          };
        }),
    }),
    {
      name: "community-storage",
    },
  ),
);
