import { UserManagementServer } from "@/domains/admin/user/components/UserManagementServer";

export default async function UsersPage() {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">사용자 관리</h2>
      <UserManagementServer />
    </>
  );
}
