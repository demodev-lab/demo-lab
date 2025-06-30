import { Badge } from "@/components/ui/badge";
import { Role, ROLE_BADGE_VARIANTS, ROLE_ICONS } from "@/types/auth";
import { cn } from "@/utils/lib/utils";

interface RoleBadgeProps {
  role: Role;
  showIcon?: boolean;
  className?: string;
}

export function RoleBadge({
  role,
  showIcon = true,
  className,
}: RoleBadgeProps) {
  const variant = ROLE_BADGE_VARIANTS[role] as
    | "default"
    | "secondary"
    | "destructive"
    | "outline";
  const icon = ROLE_ICONS[role];

  return (
    <Badge variant={variant} className={cn(className)}>
      {showIcon && `${icon} `}
      {role.toUpperCase()}
    </Badge>
  );
}
