"use client";

import { useState } from "react";
import { getSupabase } from "@/utils/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error } = await getSupabase().auth.signUp({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      alert("회원가입 성공! 이메일을 확인하세요.");
      router.push("/login");
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      style={{ maxWidth: 320, margin: "40px auto" }}
    >
      <h2>회원가입</h2>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ width: "100%", marginBottom: 8 }}
      />
      <button type="submit" style={{ width: "100%" }}>
        회원가입
      </button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </form>
  );
}
