"use client";

import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f6f9fc",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 12,
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          padding: 32,
          textAlign: "center",
          maxWidth: 360,
        }}
      >
        <h2 style={{ color: "#22c55e", fontWeight: 700, marginBottom: 16 }}>
          🎉 결제 완료!
        </h2>
        <p style={{ marginBottom: 24 }}>결제가 성공적으로 처리되었습니다.</p>
        <button
          onClick={() => router.push("/")}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "10px 24px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          홈으로 이동
        </button>
      </div>
    </div>
  );
}
