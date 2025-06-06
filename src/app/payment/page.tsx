"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

declare global {
  interface Window {
    LemonSqueezy: {
      Url: (url: string) => {
        open: () => void;
      };
    };
  }
}

export default function PaymentPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const router = useRouter();

  const NEXTJS_COURSE_VARIANT_ID: number = Number(
    process.env.NEXT_PUBLIC_LEMON_SQUEEZY_BASIC_DEFAULT_VARIANT_ID,
  );

  const handlePurchase = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키를 포함하여 요청
        body: JSON.stringify({ variantId: NEXTJS_COURSE_VARIANT_ID }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Failed to create checkout.");
      }

      const { checkoutUrl } = await response.json();

      // Lemon Squeezy SDK 사용 시도, 실패하면 직접 리다이렉트
      if (typeof window !== "undefined") {
        try {
          // Lemon Squeezy SDK가 로드되어 있는지 확인
          if (
            window.LemonSqueezy &&
            typeof window.LemonSqueezy.Url === "function"
          ) {
            console.log("Using Lemon Squeezy SDK");
            window.LemonSqueezy.Url(checkoutUrl).open();
          } else {
            console.log(
              "Lemon Squeezy SDK not available, using direct redirect",
            );
            window.location.href = checkoutUrl;
          }
        } catch (error) {
          console.warn(
            "Lemon Squeezy SDK error, falling back to direct redirect:",
            error,
          );
          window.location.href = checkoutUrl;
        }
      }
    } catch (error: any) {
      console.error("Purchase failed:", error);
      alert("결제 페이지를 여는 데 실패했습니다: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Next.js 마스터 클래스</h1>
      <p>강력한 풀스택 웹 개발자가 되어 보세요!</p>

      {!user ? (
        <p>구매를 위해 로그인 해주세요.</p>
      ) : (
        <>
          <p>
            현재 로그인: <strong>{user.email}</strong>
          </p>
          <button
            onClick={handlePurchase}
            disabled={loading}
            style={{
              padding: "10px 20px",
              fontSize: "18px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "결제 준비 중..." : "평생 수강권 구매하기 (₩99,000)"}
          </button>
        </>
      )}

      <p style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        결제 시 Lemon Squeezy의 보안 결제 페이지로 이동합니다.
      </p>
    </div>
  );
}
