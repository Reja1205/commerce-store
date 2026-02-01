export const dynamic = "force-dynamic";
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("Password123");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      const res = await fetch(`${base}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // IMPORTANT: receive cookie
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data?.message || "Login failed");
      } else {
        setMsg("Logged in ✅");
        router.push("/");
      }
    } catch (err) {
      setMsg("Network error: cannot reach backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 420 }}>
      <h1>Login</h1>

      <form onSubmit={login} style={{ display: "grid", gap: 10 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          style={{ padding: 10 }}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          type="password"
          style={{ padding: 10 }}
        />
        <button disabled={loading} style={{ padding: "10px 14px" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {msg ? <p style={{ marginTop: 12 }}>{msg}</p> : null}
    </main>
  );
}