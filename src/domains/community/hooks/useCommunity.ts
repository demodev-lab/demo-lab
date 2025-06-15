import { useAtom } from "jotai";
import { usePost } from "@/domains/post/hooks/usePost";
import { useComment } from "@/domains/comment/hooks/useComment";
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
  const { mutate: createPost } = usePost().create();
  const { mutate: updatePost } = usePost().update();
  const { mutate: removePost } = usePost().remove();

  // 댓글 관련 mutations
  const { mutate: createComment } = useComment().create();
  const { mutate: updateComment } = useComment().update();
  const { mutate: removeComment } = useComment().remove();

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
