import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Role } from "@/types/auth";
import { UserTableRow } from "./userTableRow";
import { User } from "../types";

interface UserTableProps {
  users: User[];
  canUpdate: boolean;
  roleUpdateLoading: string | null;
  onRoleUpdate: (userId: string, role: Role) => void;
}

export function UserTable({
  users,
  canUpdate,
  roleUpdateLoading,
  onRoleUpdate,
}: UserTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>사용자</TableHead>
            <TableHead>이름</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>권한</TableHead>
            <TableHead>가입일</TableHead>
            <TableHead className="text-right">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                사용자가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                canUpdate={canUpdate}
                isUpdating={roleUpdateLoading === user.id}
                onRoleUpdate={onRoleUpdate}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
