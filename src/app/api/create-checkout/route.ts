// src/app/api/create-checkout/route.ts
import { NextResponse } from "next/server";
import { createLemonSqueezyCheckoutUrl } from "@/utils/lib/lemonsqueezy";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();

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
