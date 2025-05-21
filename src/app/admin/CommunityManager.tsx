import React from "react";

// 더미 게시글 데이터
const dummyPosts = [
  {
    id: 1,
    author: "홍길동",
    email: "hong@email.com",
    date: "2024-06-01",
    title: "첫 번째 게시글",
    content: "이것은 첫 번째 게시글입니다.",
    comments: [
      {
        id: 1,
        author: "김댓글",
        email: "kimc@email.com",
        date: "2024-06-01",
        content: "댓글1",
      },
      {
        id: 2,
        author: "이댓글",
        email: "leec@email.com",
        date: "2024-06-02",
        content: "댓글2",
      },
    ],
  },
  {
    id: 2,
    author: "김관리",
    email: "kim@email.com",
    date: "2024-06-02",
    title: "두 번째 게시글",
    content: "이것은 두 번째 게시글입니다.",
    comments: [
      {
        id: 3,
        author: "박댓글",
        email: "park@email.com",
        date: "2024-06-02",
        content: "댓글3",
      },
    ],
  },
];

export default function CommunityManager() {
  const [posts, setPosts] = React.useState(dummyPosts);
  const [selectedPost, setSelectedPost] = React.useState(null);
  // 검색 상태
  const [searchType, setSearchType] = React.useState<
    "title" | "author" | "email"
  >("title");
  const [searchValue, setSearchValue] = React.useState("");

  // 게시글 삭제
  const handleDeletePost = (id: number) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setSelectedPost(null);
    }
  };
  // 댓글 삭제
  const handleDeleteComment = (postId: number, commentId: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
          : p,
      ),
    );
  };

  // 검색 필터링
  const filteredPosts = posts.filter((post) => {
    const value = searchValue.trim().toLowerCase();
    if (!value) return true;
    if (searchType === "title") return post.title.toLowerCase().includes(value);
    if (searchType === "author")
      return post.author.toLowerCase().includes(value);
    if (searchType === "email") return post.email.toLowerCase().includes(value);
    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* 검색 영역 */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <select
          className="border rounded px-2 py-1 text-sm"
          value={searchType}
          onChange={(e) =>
            setSearchType(e.target.value as "title" | "author" | "email")
          }
        >
          <option value="title">제목</option>
          <option value="author">이름</option>
          <option value="email">이메일</option>
        </select>
        <input
          className="border rounded px-2 py-1 text-sm flex-1 min-w-0"
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <h3 className="text-lg font-semibold mb-4">게시글 목록</h3>
      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-center">번호</th>
            <th className="text-center">제목</th>
            <th className="text-center">작성자</th>
            <th className="text-center">이메일</th>
            <th className="text-center">작성일</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((post, idx) => (
            <tr
              key={post.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedPost(post)}
            >
              <td className="py-2 text-center">{idx + 1}</td>
              <td className="text-center font-medium">{post.title}</td>
              <td className="text-center">{post.author}</td>
              <td className="text-center">{post.email}</td>
              <td className="text-center">{post.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 게시글 상세 모달 */}
      {selectedPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-10 min-w-[480px] max-w-2xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setSelectedPost(null)}
            >
              &times;
            </button>
            <h4 className="text-2xl font-bold mb-4">{selectedPost.title}</h4>
            <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500">
              <div>
                <span className="font-semibold">작성자:</span>{" "}
                {selectedPost.author} ({selectedPost.email})
              </div>
              <div>
                <span className="font-semibold">작성일:</span>{" "}
                {selectedPost.date}
              </div>
            </div>
            <div className="mb-6 text-base whitespace-pre-line border rounded-lg p-4 bg-gray-50 min-h-[80px]">
              {selectedPost.content}
            </div>
            <div className="mb-6">
              <h5 className="font-semibold mb-3">댓글</h5>
              {selectedPost.comments.length === 0 && (
                <div className="text-gray-400 text-sm">댓글 없음</div>
              )}
              <div className="space-y-4">
                {selectedPost.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start gap-3 border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                      {comment.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-xs text-gray-400">
                          ({comment.email})
                        </span>
                        <span className="text-xs text-gray-400">
                          {comment.date}
                        </span>
                      </div>
                      <div className="mt-1 text-gray-700">
                        {comment.content}
                      </div>
                    </div>
                    <button
                      className="text-red-500 text-xs ml-2 mt-1"
                      onClick={() =>
                        handleDeleteComment(selectedPost.id, comment.id)
                      }
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded w-full mt-2"
              onClick={() => handleDeletePost(selectedPost.id)}
            >
              게시글 삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
