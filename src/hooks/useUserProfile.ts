"use client";

import { useQuery } from "@tanstack/react-query";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { getUserProfile } from "@/utils/supabase/profiles";
import type { UserProfile } from "@/utils/supabase/profiles";

export function useUserProfile() {
  return useQuery<UserProfile, Error>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const supabase = createBrowserSupabaseClient();
      return getUserProfile(supabase);
    },
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
  });
}
