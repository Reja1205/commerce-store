export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminGuard({ children }) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const router = useRouter();
  const pathname = usePathname();

  const [state, setState] = useState({ loading: true, allowed: false, message: "" });

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${base}/api/auth/me`, {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();

        if (!res.ok || !data?.user) {
          // not logged in
          router.push(`/login`);
          return;
        }

        if (data.user.role !== "admin") {
          setState({ loading: false, allowed: false, message: "Admin access required" });
          return;
        }

        setState({ loading: false, allowed: true, message: "" });
      } catch (e) {
        router.push(`/login`);
      }
    };

    setState({ loading: true, allowed: false, message: "" });
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (state.loading) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <p>Checking access...</p>
      </main>
    );
  }

  if (!state.allowed) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Not allowed</h1>
        <p style={{ opacity: 0.8 }}>{state.message}</p>
      </main>
    );
  }

  return children;
}