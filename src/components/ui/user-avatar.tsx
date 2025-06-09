import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/utils/lib/utils";

type User = {
  id: string;
  email: string;
  full_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
};

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function UserAvatar({
  user,
  size = "md",
  showName = true,
  className,
}: UserAvatarProps) {
  const displayName = user.username || "사용자명 없음";
  const fallback = user.full_name?.[0] || user.email[0].toUpperCase();

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={user.avatar_url || ""} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      {showName && <span className="font-medium">{displayName}</span>}
    </div>
  );
}
