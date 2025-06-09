import { cn } from "@/utils/lib/utils";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({
  message = "로딩 중...",
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      {message && <span className="ml-2">{message}</span>}
    </div>
  );
}
