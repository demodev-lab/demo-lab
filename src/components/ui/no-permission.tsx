import { cn } from "@/utils/lib/utils";

interface NoPermissionProps {
  message?: string;
  icon?: string;
  className?: string;
}

export function NoPermission({
  message = "권한이 없습니다.",
  icon = "🔒",
  className,
}: NoPermissionProps) {
  return (
    <div className={cn("text-muted-foreground", className)}>
      {icon} {message}
    </div>
  );
}
