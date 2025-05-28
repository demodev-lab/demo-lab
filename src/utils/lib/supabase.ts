// utils/lib/supabase.ts
import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

// 🎯 클라이언트 사이드용 (브라우저)
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabase() {
  if (!browserClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    browserClient = createBrowserClient(supabaseUrl, supabaseKey);
  }

  return browserClient;
}

// 🚀 서버 사이드용 - Request와 Response 객체를 받는 방식
export function createServerSupabaseClient(req?: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get: (name: string) => {
        // Request 객체에서 쿠키 읽기
        if (req) {
          const cookieHeader = req.headers.get?.("cookie") || "";
          const cookies = cookieHeader.split(";").reduce(
            (acc, cookie) => {
              const [key, value] = cookie.trim().split("=");
              if (key) acc[key] = value;
              return acc;
            },
            {} as Record<string, string>,
          );
          return cookies[name];
        }
        return undefined;
      },
    },
  });
}

// 🔧 관리자용 (서버에서 RLS 우회)
export function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing admin Supabase environment variables");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}
