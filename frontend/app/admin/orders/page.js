"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminOrdersPage() {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${base}/api/admin/orders`, {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        if (res.ok) setOrders(data.orders || []);
        else setMsg(data?.message || "Failed");
      } catch {
        setMsg("Network error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [base]);

  return (
    <main style={{ padding: 24 }}>
      <h1>Admin Orders</h1>
      <Link href="/admin/products">Products</Link>
      {loading && <p>Loading...</p>}
      {msg && <p>{msg}</p>}
    </main>
  );
}
