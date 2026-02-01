"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${base}/api/auth/me`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok) setUser(data.user);
      else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const logout = async () => {
    try {
      await fetch(`${base}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    setUser(null);
    router.push("/login");
  };

  return (
    <header
      style={{
        padding: "12px 24px",
        borderBottom: "1px solid #ddd",
        fontFamily: "system-ui",
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        alignItems: "center",
      }}
    >
      <nav style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <Link href="/">Store</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/orders">Orders</Link>
        {user?.role === "admin" ? <Link href="/admin/products">Admin</Link> : null}
      </nav>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {loading ? (
          <span style={{ opacity: 0.7 }}>...</span>
        ) : user ? (
          <>
            <span style={{ opacity: 0.8 }}>
              {user.email} ({user.role})
            </span>
            <button onClick={logout} style={{ padding: "8px 10px" }}>
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </header>
  );
}