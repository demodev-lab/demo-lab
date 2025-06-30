import { useAtom } from "jotai";
import {
  useCreatePost,
  useUpdatePost,
  useRemovePost,
} from "@/domains/post/hooks/usePost";
import {
  useCreateComment,
  useUpdateComment,
  useRemoveComment,
} from "@/domains/comment/hooks/useComment";
import {
  selectedCategoryIdAtom,
  selectedTagIdsAtom,
  sortOptionAtom,
  searchQueryAtom,
  currentPageAtom,
} from "../atoms/communityAtoms";

export function useCommunity() {
  // 클라이언트 상태 atoms (selectedPost 등 객체 상태 제거)
  const [selectedCategoryId, setSelectedCategoryId] = useAtom(
    selectedCategoryIdAtom,
  );
  const [selectedTagIds, setSelectedTagIds] = useAtom(selectedTagIdsAtom);
  const [sortOption, setSortOption] = useAtom(sortOptionAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);

  // mutations만 남김
  const { mutate: createPost } = useCreatePost();
  const { mutate: updatePost } = useUpdatePost();
  const { mutate: removePost } = useRemovePost();

  // 댓글 관련 mutations
  const { mutate: createComment } = useCreateComment();
  const { mutate: updateComment } = useUpdateComment();
  const { mutate: removeComment } = useRemoveComment();

  return {
    selectedCategoryId,
    setSelectedCategoryId,
    selectedTagIds,
    setSelectedTagIds,
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    createPost,
    updatePost,
    removePost,
    createComment,
    updateComment,
    removeComment,
  };
}
