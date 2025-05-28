// src/app/api/create-checkout/route.ts
import { NextResponse } from "next/server";
import { createLemonSqueezyCheckoutUrl } from "@/utils/lib/lemonsqueezy";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // 1. 환경변수 검증
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // 2. Supabase 클라이언트 생성
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          cookieStore.set(name, value, options);
        },
        remove: (name: string) => {
          cookieStore.delete(name);
        },
      },
    });

    // 3. 세션 확인
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Session error:", sessionError);
      return NextResponse.json(
        { error: "Authentication error" },
        { status: 401 },
      );
    }

    if (!session?.user) {
      console.error("No session or user found");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    console.log("Authenticated user:", {
      id: session.user.id,
      email: session.user.email,
    });

    // 4. 요청 바디 파싱 및 검증
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("JSON parsing error:", error);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const variantId = Number(body.variantId);
    if (!variantId || isNaN(variantId) || variantId <= 0) {
      console.error("Invalid variant ID:", body.variantId);
      return NextResponse.json(
        { error: "Valid variant ID is required" },
        { status: 400 },
      );
    }

    console.log("Creating checkout with variant ID:", variantId);

    // 5. 체크아웃 URL 생성
    const checkoutUrl = await createLemonSqueezyCheckoutUrl(
      variantId,
      session.user.id,
      session.user.email,
    );

    if (!checkoutUrl) {
      console.error("Failed to create checkout URL - function returned null");
      return NextResponse.json(
        { error: "Failed to create checkout URL" },
        { status: 500 },
      );
    }

    console.log("Successfully created checkout URL");
    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
