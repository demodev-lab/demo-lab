import { NextResponse } from "next/server";
import crypto from "crypto"; // Node.js 내장 암호화 모듈
import { getAdminSupabase } from "@/utils/lib/supabase"; // Supabase 클라이언트 임포트

// Next.js App Router에서 POST 요청을 처리하는 함수
export async function POST(req) {
  // 1. 요청의 Raw Body 가져오기 (시그니처 검증에 필요)
  // req.json()을 사용하면 body가 파싱되어 시그니처 검증에 사용할 수 없습니다.
  // req.text()를 사용하여 원본 문자열을 가져옵니다.
  const rawBody = await req.text();
  const signature = req.headers.get("X-Signature"); // Lemon Squeezy 웹훅 시그니처 헤더

  // 2. 시그니처 및 시크릿 키 유효성 검사
  if (!signature) {
    console.error("Webhook: Missing X-Signature header");
    return NextResponse.json(
      { error: "Missing X-Signature header" },
      { status: 400 },
    );
  }

  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("Webhook: LEMON_SQUEEZY_WEBHOOK_SECRET is not set.");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  // 3. Lemon Squeezy 웹훅 시그니처 검증
  try {
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(rawBody);
    const digest = hmac.digest("hex");

    if (digest !== signature) {
      console.warn("Webhook: Invalid Lemon Squeezy signature!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } catch (error) {
    console.error("Webhook: Signature verification failed:", error);
    return NextResponse.json(
      { error: "Signature verification failed" },
      { status: 500 },
    );
  }

  // 4. 웹훅 페이로드 파싱
  const payload = JSON.parse(rawBody);
  const { meta, data } = payload;
  const eventName = meta.event_name; // Lemon Squeezy 이벤트 타입 (예: 'subscription_created')

  console.log(`Received Lemon Squeezy event: ${eventName}`);

  try {
    switch (eventName) {
      case "subscription_created":
      case "subscription_updated":
      case "subscription_cancelled":
      case "subscription_resumed":
      case "subscription_expired":
      case "subscription_payment_success": {
        const {
          id: lemonsqueezy_subscription_id, // Lemon Squeezy 구독 ID
          attributes: {
            status, // 구독 상태 (active, cancelled 등)
            renews_at, // 다음 갱신일
            product_id,
            variant_id,
            customer_id,
            order_id,
            test_mode,
          },
        } = data;

        // Custom Data에서 user_id 가져오기 (체크아웃 시 전달했다면)
        // Lemon Squeezy 체크아웃 URL 생성 시 `custom_data: { user_id: 'your-supabase-user-id' }` 를 포함해야 함
        // 참고: Lemon Squeezy 웹훅 페이로드 구조는 업데이트될 수 있으므로,
        // 실제 페이로드 구조를 확인하여 정확한 경로를 찾아야 합니다.
        // 현재 버전에서는 `data.attributes.first_subscription_item.attributes.custom_data.user_id` 또는
        // `data.attributes.custom_data.user_id` 와 같이 올 수 있습니다.
        const custom_data =
          data.attributes.first_subscription_item?.attributes?.custom_data ||
          data.attributes.custom_data ||
          {};
        const user_id = custom_data.user_id || null;

        // 5. Supabase DB에 구독 정보 Upsert (Update or Insert)
        const { error } = await getAdminSupabase().from("subscriptions").upsert(
          {
            lemonsqueezy_subscription_id: lemonsqueezy_subscription_id,
            user_id: user_id, // Supabase 사용자 ID와 연결
            status: status,
            current_period_end: renews_at,
            product_id: product_id,
            variant_id: variant_id,
            lemon_squeezy_customer_id: customer_id,
            lemon_squeezy_order_id: order_id,
            test_mode: test_mode,
            updated_at: new Date().toISOString(), // 마지막 업데이트 시간
          },
          {
            onConflict: "lemonsqueezy_subscription_id", // `lemonsqueezy_subscription_id`가 중복되면 기존 레코드를 업데이트
            ignoreDuplicates: false, // 중복 시 업데이트하도록 설정
          },
        );

        if (error) {
          console.error(
            "Webhook: Error upserting subscription to Supabase:",
            error,
          );
          return NextResponse.json(
            { error: "Failed to update subscription" },
            { status: 500 },
          );
        }

        console.log(
          `Successfully processed subscription event for ID: ${lemonsqueezy_subscription_id}`,
        );
        break;
      }
      // 필요한 경우 다른 이벤트 (예: order_created, refund_created 등)를 여기에 추가
      case "order_created":
        // 주문 생성 이벤트 처리 로직
        console.log("Order created event received:", payload);
        break;
      default:
        console.warn(
          `Webhook: Unhandled Lemon Squeezy event type: ${eventName}`,
        );
        break;
    }

    // 6. 성공 응답 반환
    return NextResponse.json(
      { message: "Webhook received successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Webhook: Error processing Lemon Squeezy webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
