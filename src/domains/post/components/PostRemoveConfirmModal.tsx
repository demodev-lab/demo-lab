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
import { usePost } from "../hooks/usePost";
import { DialogTitle } from "@/components/ui/dialog";

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
  const { get } = usePost();
  const { data: post } = get(postId);

  if (!post) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <DialogTitle>게시글 삭제</DialogTitle>
        <AlertDialogHeader>
          <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            정말로 "{post.title}" 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수
            없습니다.
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
