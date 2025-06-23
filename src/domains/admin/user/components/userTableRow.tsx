import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/ui/user-avatar";
import { RoleBadge } from "@/components/ui/role-badge";
import { Role } from "@/types/auth";
import { User } from "../types";

interface UserTableRowProps {
  user: User;
  canUpdate: boolean;
  isUpdating: boolean;
  onRoleUpdate: (userId: string, role: Role) => void;
}

export function UserTableRow({
  user,
  canUpdate,
  isUpdating,
  onRoleUpdate,
}: UserTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <UserAvatar user={user} size="sm" showName={true} />
      </TableCell>
      <TableCell>
        {user.full_name || (
          <span className="text-muted-foreground">이름 없음</span>
        )}
      </TableCell>
      <TableCell className="font-mono text-sm">{user.email}</TableCell>
      <TableCell>
        <RoleBadge role={user.role} showIcon={true} />
      </TableCell>
      <TableCell>
        {new Date(user.created_at).toLocaleDateString("ko-KR")}
      </TableCell>
      <TableCell className="text-right">
        {canUpdate ? (
          <RoleUpdateDropdown
            user={user}
            isUpdating={isUpdating}
            onRoleUpdate={onRoleUpdate}
          />
        ) : (
          <Button
            variant="ghost"
            size="sm"
            disabled
            className="text-muted-foreground"
          >
            🔒 권한 없음
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}

// 권한 변경 드롭다운 인라인 컴포넌트
function RoleUpdateDropdown({
  user,
  isUpdating,
  onRoleUpdate,
}: {
  user: User;
  isUpdating: boolean;
  onRoleUpdate: (userId: string, role: Role) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isUpdating}>
          {isUpdating ? "업데이트 중..." : "권한 변경"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.values(Role)
          .filter((role) => role !== Role.GUEST)
          .map((role) => (
            <DropdownMenuItem
              key={role}
              onClick={() => onRoleUpdate(user.id, role)}
              disabled={user.role === role || isUpdating}
            >
              {role.toUpperCase()}로 변경
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
