import { getUsers } from "@/domains/admin/user/actions/getUsers";
import { UserManagement } from "./UserManagement";

export async function UserManagementServer() {
  const users = await getUsers();

  return <UserManagement initialData={users} />;
}
