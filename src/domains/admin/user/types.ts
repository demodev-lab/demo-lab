import { Role } from "@/types/auth";

export type User = {
  id: string;
  email: string;
  full_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  role: Role;
  created_at: string;
};
