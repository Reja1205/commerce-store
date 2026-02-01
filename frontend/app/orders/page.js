export const dynamic = "force-dynamic";
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`${base}/api/orders`, {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        setMsg(data?.message || "Failed to load orders");
      } else {
        setOrders(data.orders || []);
      }
    } catch (err) {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 900 }}>
      <h1>My Orders</h1>

      <div style={{ marginBottom: 12 }}>
        <Link href="/">← Back to store</Link>
      </div>

      {loading && <p>Loading orders…</p>}

      {msg && (
        <div style={{ border: "1px solid #ddd", padding: 10 }}>
          {msg}
        </div>
      )}

      {!loading && orders.length === 0 && !msg && (
        <div>
          <p>You don’t have any orders yet.</p>
          <Link
            href="/"
            style={{ padding: "10px 12px", border: "1px solid #ddd" }}
          >
            Browse products
          </Link>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
          {orders.map((o) => (
            <li key={o._id} style={{ border: "1px solid #ddd", padding: 12 }}>
              <div style={{ fontWeight: 700 }}>Order: {o._id}</div>
              <div>Status: {o.status}</div>
              <div>Total: ${o.grandTotalUSD}</div>
              <Link href={`/orders/${o._id}`}>View details</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
