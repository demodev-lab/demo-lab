import type { UserRole } from "@/types/auth";

export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  postCount: number;
  min_role_required?: UserRole | null;
}
