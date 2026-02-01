"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [order, setOrder] = useState(null);
  const [msg, setMsg] = useState("Loading...");

  const load = async () => {
    if (!id || typeof id !== "string") {
      setMsg("Invalid order id in URL");
      setOrder(null);
      return;
    }

    setMsg("Loading...");
    try {
      const res = await fetch(`${base}/api/orders/${id}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data?.message || `Failed to load order (status ${res.status})`);
        setOrder(null);
      } else {
        setOrder(data.order);
        setMsg("");
      }
    } catch (e) {
      setMsg("Network error");
      setOrder(null);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (msg) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <Link href="/orders">← Back to orders</Link>
        <p style={{ marginTop: 12 }}>{msg}</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <Link href="/orders">← Back to orders</Link>
        <p style={{ marginTop: 12 }}>Order not found.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 800 }}>
      <Link href="/orders">← Back to orders</Link>

      <h1 style={{ marginTop: 12 }}>Order Details</h1>
      <div style={{ opacity: 0.7 }}>Order ID: {order._id}</div>
      <div>Status: {order.status}</div>

      <h2 style={{ marginTop: 16 }}>Items</h2>
      <ul style={{ padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
        {order.items.map((i) => (
          <li
            key={`${i.productId}-${i.slugSnapshot}`}
            style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}
          >
            <div style={{ fontWeight: 700 }}>{i.titleSnapshot}</div>
            <div style={{ opacity: 0.7 }}>Slug: {i.slugSnapshot}</div>
            <div>Price: ${i.priceSnapshotUSD}</div>
            <div>Qty: {i.qty}</div>
            <div style={{ fontWeight: 600, marginTop: 6 }}>
              Line: ${(i.priceSnapshotUSD * i.qty).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: 16 }}>Totals</h2>
      <div>Items total: ${Number(order.itemsTotalUSD).toFixed(2)}</div>
      <div>Shipping: ${Number(order.shippingFeeUSD).toFixed(2)}</div>
      <div style={{ fontWeight: 800 }}>
        Grand total: ${Number(order.grandTotalUSD).toFixed(2)}
      </div>
    </main>
  );
}