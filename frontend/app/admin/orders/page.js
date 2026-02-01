export const dynamic = "force-dynamic";

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminOrdersPage() {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`${base}/api/admin/orders`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) setMsg(data?.message || "Failed to load orders");
      else setOrders(data.orders || []);
    } catch {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    setBusyId(id);
    try {
      const res = await fetch(`${base}/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) alert(data?.message || "Update failed");
      else setOrders((p) => p.map((o) => (o._id === id ? data.order : o)));
    } catch {
      alert("Network error");
    } finally {
      setBusyId("");
    }
  };

  const statuses = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 1000 }}>
      <h1>Admin – Orders</h1>
      <div style={{ marginBottom: 12 }}>
        <Link href="/admin/products">Admin Products</Link>
      </div>

      {loading && <p>Loading orders…</p>}
      {msg && <div style={{ border: "1px solid #ddd", padding: 10 }}>{msg}</div>}

      {!loading && orders.length === 0 && !msg && (
        <p>No orders yet.</p>
      )}

      {!loading && orders.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
          {orders.map((o) => (
            <li key={o._id} style={{ border: "1px solid #ddd", padding: 12 }}>
              <div style={{ fontWeight: 700 }}>Order: {o._id}</div>
              <div>Total: ${o.grandTotalUSD}</div>
              <div style={{ marginTop: 8 }}>
                <select
                  value={o.status}
                  disabled={busyId === o._id}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {busyId === o._id && <span> Updating…</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}