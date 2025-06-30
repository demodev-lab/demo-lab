import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface UserManagementHeaderProps {
  canUpdate: boolean;
  loading: boolean;
  onRefresh: () => void;
}

export function UserManagementHeader({
  canUpdate,
  loading,
  onRefresh,
}: UserManagementHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>사용자 관리</CardTitle>
        {!canUpdate && (
          <p className="text-sm text-muted-foreground mt-1">
            ℹ️ 사용자 관리 권한이 없습니다.
          </p>
        )}
      </div>
      <Button onClick={onRefresh} disabled={loading} size="sm">
        {loading ? "새로고침 중..." : "새로고침"}
      </Button>
    </CardHeader>
  );
}
