import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PostEditor } from "./PostEditor";
import type { PostFormData } from "../types";
import type { Category } from "@/domains/category/types";
import type { Tag } from "@/domains/tag/types";
import { usePostDetail } from "../hooks/usePost";
import { useProfile } from "@/hooks/use-profile";
import { postPermissions } from "@/config/permissions";
import { useMemo } from "react";

interface PostEditorModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  postId?: number;
  categories?: Category[];
  tags?: Tag[];
  onClose: () => void;
  onSubmit: (formData: PostFormData) => Promise<void>;
}

export function PostEditorModal({
  isOpen,
  mode,
  postId,
  categories,
  tags,
  onClose,
  onSubmit,
}: PostEditorModalProps) {
  const { data: post, isLoading } = usePostDetail(postId, {
    enabled: mode === "edit" && !!postId,
  });
  const { data: userProfile } = useProfile();

  // 사용자가 작성 가능한 카테고리만 필터링
  const availableCategories = useMemo(() => {
    if (!categories || !userProfile) return [];

    return categories.filter((category) =>
      postPermissions.canCreateInCategory(category, userProfile.role),
    );
  }, [categories, userProfile]);

  if (mode === "edit" && (isLoading || !post)) return null;

  const initialData =
    mode === "edit"
      ? post && {
          title: post.title,
          content: post.content,
          categoryId: post.category_id,
          tagIds: post.tags?.map((tag) => tag.id) ?? [],
        }
      : undefined;

  const handleSubmit = async (formData: FormData) => {
    const rawCategoryId = formData.get("categoryId");
    const categoryId =
      rawCategoryId && rawCategoryId !== "" ? Number(rawCategoryId) : null;

    let tagIds: number[] | null = null;
    try {
      const rawTagIds = formData.get("tagIds");
      if (rawTagIds) {
        const parsed = JSON.parse(rawTagIds as string);
        const filtered = Array.isArray(parsed)
          ? parsed.filter((id) => !!id && id !== "")
          : [];
        tagIds = filtered.length > 0 ? filtered : null;
      } else {
        tagIds = null;
      }
    } catch {
      tagIds = null;
    }

    const postFormData: PostFormData = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      categoryId,
      authorId: userProfile?.id ?? null,
      tagIds,
    };
    await onSubmit(postFormData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogTitle>
          {mode === "edit" ? "게시글 수정" : "게시글 작성"}
        </DialogTitle>
        <PostEditor
          initialData={initialData}
          categories={availableCategories}
          tags={tags}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
