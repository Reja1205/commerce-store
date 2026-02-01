"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrdersClient() {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setMsg("");
      try {
        const res = await fetch(`${base}/api/orders`, {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) {
          setMsg(data?.message || "Failed to load orders");
          setOrders([]);
        } else {
          setOrders(data.orders || []);
        }
      } catch {
        setMsg("Network error");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [base]);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 800 }}>
      <h1>My Orders</h1>

      {loading && <p>Loading...</p>}
      {msg && <p>{msg}</p>}

      {!loading && !msg && orders.length === 0 && <p>No orders yet.</p>}

      {!loading && orders.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
          {orders.map((o) => (
            <li key={o._id} style={{ border: "1px solid #ddd", padding: 12 }}>
              <Link href={`/orders/${o._id}`}>
                Order {o._id} – ${o.grandTotalUSD}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
