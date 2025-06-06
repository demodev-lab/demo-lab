import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import Script from "next/script"; // Next.js Script 컴포넌트 임포트

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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        {/* Lemon Squeezy의 lemon.js 스크립트 추가 */}
        {/* `strategy="afterInteractive"`는 페이지의 주요 콘텐츠가 로드된 후 스크립트를 로드하도록 합니다. */}
        <Script
          src="https://assets.lemonsqueezy.com/lemon.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
