import { useEffect } from "react";
import { useCommunityStore } from "../store";

export const useCommunityPosts = () => {
  const {
    posts,
    pagination,
    loading,
    fetchPosts,
    addPost,
    updatePost,
    deletePost,
    toggleLikePost,
    categories,
    tags,
    fetchCategories,
    fetchTags,
  } = useCommunityStore();

  // 초기 데이터 로드
  useEffect(() => {
    fetchPosts(1);
    fetchCategories();
    fetchTags();
  }, [fetchPosts, fetchCategories, fetchTags]);

  const handleAddPost = async (formData: FormData) => {
    try {
      await addPost(formData);
      return { success: true };
    } catch (error) {
      console.error("Failed to add post:", error);
      return { success: false, error };
    }
  };

  const handleUpdatePost = async (postId: number, formData: FormData) => {
    try {
      await updatePost(postId, formData);
      return { success: true };
    } catch (error) {
      console.error("Failed to update post:", error);
      return { success: false, error };
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePost(postId);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete post:", error);
      return { success: false, error };
    }
  };

  const handleToggleLike = async (postId: number, isLiked: boolean) => {
    try {
      await toggleLikePost(postId, isLiked);
      return { success: true };
    } catch (error) {
      console.error("Failed to toggle like:", error);
      return { success: false, error };
    }
  };

  const loadPage = (page: number) => {
    fetchPosts(page);
  };

  return {
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
  };
};
