"use client";

import { useRouter } from "next/navigation";

export default function PaymentCancelPage() {
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
        <h2 style={{ color: "#ef4444", fontWeight: 700, marginBottom: 16 }}>
          ❌ 결제 취소
        </h2>
        <p style={{ marginBottom: 24 }}>
          결제가 취소되었습니다.
          <br />
          다시 시도하실 수 있습니다.
        </p>
        <button
          onClick={() => router.push("/pricing")}
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
          요금제 다시 보기
        </button>
      </div>
    </div>
  );
}
