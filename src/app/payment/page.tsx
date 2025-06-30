"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

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
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Next.js 마스터 클래스</CardTitle>
          <CardDescription>
            강력한 풀스택 웹 개발자가 되어 보세요!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-6 space-y-3">
              <h3 className="text-lg font-semibold">코스 주요 특징</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>최신 Next.js 기능 심층 분석</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>실전 프로젝트 기반 학습</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>평생 소장 및 업데이트 제공</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>1:1 코드 리뷰 및 Q&A</span>
                </li>
              </ul>
            </div>

            {!user ? (
              <p className="text-center text-sm text-muted-foreground">
                구매를 위해 로그인 해주세요.
              </p>
            ) : (
              <div className="text-center text-sm">
                <p>
                  현재 로그인:{" "}
                  <strong className="font-medium">{user.email}</strong>
                </p>
              </div>
            )}
            <Button
              onClick={handlePurchase}
              disabled={loading || !user}
              className="w-full"
              size="lg"
            >
              {loading ? "결제 준비 중..." : "평생 수강권 구매하기 (₩99,000)"}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground text-center w-full">
            결제 시 Lemon Squeezy의 보안 결제 페이지로 이동합니다.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
