import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Providers from "./providers";
import { Header } from "@/components/header";
import { TabNavigation } from "@/components/tab-navigation";
import { ConditionalSidebar } from "@/components/conditional-sidebar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "demo-lab",
  description: "A community platform for learning and collaboration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen bg-[#F2F2F2]">
            {/* 상단 헤더 */}
            <Header />

            {/* 탭 네비게이션 */}
            <TabNavigation />

            {/* 메인 콘텐츠 영역 */}
            <div className="flex flex-1 w-full">
              {/* 각 페이지별 탭 콘텐츠 */}
              <main className="flex-1 w-full">{children}</main>

              {/* 조건부 사이드바 렌더링 */}
              <ConditionalSidebar />
            </div>
          </div>
          <Toaster />
        </Providers>
        <Script
          src="https://assets.lemonsqueezy.com/lemon.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
