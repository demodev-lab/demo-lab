import { NextResponse } from "next/server";
import crypto from "crypto"; // Node.js 내장 암호화 모듈
import { createServerSupabaseAdminClient } from "@/utils/supabase/server"; // Supabase 클라이언트 임포트

// Next.js App Router에서 POST 요청을 처리하는 함수
export async function POST(req: Request) {
  // 1. 요청의 Raw Body 가져오기 (시그니처 검증에 필요)
  // req.json()을 사용하면 body가 파싱되어 시그니처 검증에 사용할 수 없습니다.
  // req.text()를 사용하여 원본 문자열을 가져옵니다.
  console.log("000");
  const rawBody = await req.text();
  const signature = req.headers.get("X-Signature"); // Lemon Squeezy 웹훅 시그니처 헤더

  console.log("111", signature);

  // 2. 시그니처 및 시크릿 키 유효성 검사
  if (!signature) {
    console.error("Webhook: Missing X-Signature header");
    return NextResponse.json(
      { error: "Missing X-Signature header" },
      { status: 400 },
    );
  }

  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

  console.log("222");

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
  let payload;
  try {
    payload = JSON.parse(rawBody);
    console.log("payload", payload);
  } catch (error) {
    console.error("Webhook: Failed to parse JSON payload:", error);
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const { meta, data } = payload;
  const eventName = meta?.event_name; // Lemon Squeezy 이벤트 타입 (예: 'subscription_created')

  if (!eventName) {
    console.error("Webhook: Missing event_name in payload");
    return NextResponse.json(
      { error: "Invalid webhook payload" },
      { status: 400 },
    );
  }

  console.log(`Received Lemon Squeezy event: ${eventName}`);

  // Custom Data에서 user_id 가져오기
  // 실제 웹훅에서는 meta.custom_data에 위치함
  //   const user_id = meta?.custom_data?.user_id || null;

  try {
    switch (eventName) {
      case "subscription_payment_success": {
        // 결제 성공 이벤트 처리 - subscription-invoices 타입
        const {
          id: invoice_id,
          attributes: {
            subscription_id, // 연결된 구독 ID
            // status,
            // total,
            // currency,
            // test_mode,
            // created_at,
            // customer_id,
          },
        } = data;

        console.log(
          `Payment success for subscription ID: ${subscription_id}, Invoice ID: ${invoice_id}`,
        );

        // 구독 상태 업데이트 (결제 성공 시 active로 변경)
        const adminSupabase = await createServerSupabaseAdminClient();

        // 먼저 해당 구독이 존재하는지 확인하고 업데이트
        const { error: updateError } = await adminSupabase
          .from("subscriptions")
          .update({
            status: "active", // 결제 성공 시 active 상태로 변경
            updated_at: new Date().toISOString(),
          })
          .eq("lemonsqueezy_subscription_id", subscription_id);

        if (updateError) {
          console.error(
            "Webhook: Error updating subscription status after payment:",
            updateError,
          );
          return NextResponse.json(
            { error: "Failed to update subscription status" },
            { status: 500 },
          );
        }

        console.log(
          `Successfully updated subscription ${subscription_id} status to active after payment`,
        );
        break;
      }

      // 필요한 경우 다른 이벤트 (예: order_created, refund_created 등)를 여기에 추가
      //   case "order_created":
      //     // 주문 생성 이벤트 처리 로직
      //     console.log("Order created event received:", payload);
      //     break;

      //   case "subscription_created":
      //   case "subscription_updated":
      //   case "subscription_cancelled":
      //   case "subscription_resumed":
      //   case "subscription_expired": {
      //     const {
      //       id: lemonsqueezy_subscription_id, // Lemon Squeezy 구독 ID
      //       attributes: {
      //         status, // 구독 상태 (active, cancelled 등)
      //         renews_at, // 다음 갱신일
      //         product_id,
      //         variant_id,
      //         customer_id,
      //         order_id,
      //         test_mode,
      //       },
      //     } = data;

      //     const adminSupabase = await createServerSupabaseAdminClient();
      //     const { error } = await adminSupabase.from("subscriptions").upsert(
      //       {
      //         lemonsqueezy_subscription_id: lemonsqueezy_subscription_id,
      //         user_id: user_id, // Supabase 사용자 ID와 연결
      //         status: status,
      //         current_period_end: renews_at,
      //         product_id: product_id,
      //         variant_id: variant_id,
      //         lemon_squeezy_customer_id: customer_id,
      //         lemon_squeezy_order_id: order_id,
      //         test_mode: test_mode,
      //         updated_at: new Date().toISOString(), // 마지막 업데이트 시간
      //       },
      //       {
      //         onConflict: "lemonsqueezy_subscription_id", // `lemonsqueezy_subscription_id`가 중복되면 기존 레코드를 업데이트
      //         ignoreDuplicates: false, // 중복 시 업데이트하도록 설정
      //       },
      //     );

      //     if (error) {
      //       console.error(
      //         "Webhook: Error upserting subscription to Supabase:",
      //         error,
      //       );
      //       return NextResponse.json(
      //         { error: "Failed to update subscription" },
      //         { status: 500 },
      //       );
      //     }

      //     console.log(
      //       `Successfully processed subscription event for ID: ${lemonsqueezy_subscription_id}`,
      //     );
      //     break;
      //   }
      //   default:
      //     console.warn(
      //       `Webhook: Unhandled Lemon Squeezy event type: ${eventName}`,
      //     );
      //     break;
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
