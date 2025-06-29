import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePostDetail } from "../hooks/usePost";

interface PostRemoveConfirmModalProps {
  isOpen: boolean;
  postId: number;
  onClose: () => void;
  onConfirm: () => void;
}

export function PostRemoveConfirmModal({
  isOpen,
  postId,
  onClose,
  onConfirm,
}: PostRemoveConfirmModalProps) {
  const { data: post } = usePostDetail(postId);

  if (!post) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            정말로 &quot;{post.title}&quot; 게시글을 삭제하시겠습니까? 이 작업은
            되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>취소</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>삭제</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
