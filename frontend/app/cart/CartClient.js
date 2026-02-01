"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function CartClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);

  const loadCart = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`${base}/api/cart`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok) {
        setMsg(data?.message || "Failed to load cart");
        setCart(null);
      } else {
        setCart(data.cart);
      }
    } catch {
      setMsg("Network error: cannot reach backend");
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Correct way to read search parameters in Next.js
    if (searchParams.get("success") === "1") {
      setMsg("Checkout successful ✅ Your order has been placed.");
    }
    loadCart();
  }, [searchParams]);

  const updateQty = async (productId, qty) => {
    if (!Number.isFinite(qty) || qty < 1) {
      setMsg("Qty must be 1 or more.");
      return;
    }
    setMsg("");
    try {
      const res = await fetch(`${base}/api/cart/items/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ qty }),
      });
      const data = await res.json();
      if (!res.ok) setMsg(data?.message || "Failed to update quantity");
      else setCart(data.cart);
    } catch {
      setMsg("Network error");
    }
  };

  const removeItem = async (productId) => {
    setMsg("");
    try {
      const res = await fetch(`${base}/api/cart/items/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) setMsg(data?.message || "Failed to remove item");
      else setCart(data.cart);
    } catch {
      setMsg("Network error");
    }
  };

  const checkout = async () => {
    setCheckingOut(true);
    setMsg("");
    try {
      const res = await fetch(`${base}/api/checkout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) setMsg(data?.message || "Checkout failed");
      else router.push("/orders");
    } catch {
      setMsg("Network error");
    } finally {
      setCheckingOut(false);
    }
  };

  const items = cart?.items || [];
  const itemsTotal = items.reduce((sum, i) => sum + i.priceSnapshotUSD * i.qty, 0);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 700 }}>
      <h1>Cart</h1>
      <div style={{ marginBottom: 12, display: "flex", gap: 12 }}>
        <Link href="/">← Continue shopping</Link>
        <Link href="/orders">My orders</Link>
      </div>

      {loading && <p>Loading...</p>}
      {msg && (
        <div style={{ marginTop: 12, border: "1px solid #ddd", padding: 10, borderRadius: 8 }}>
          {msg}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div style={{ marginTop: 16 }}>
          <p>Your cart is empty.</p>
          <Link href="/" style={{ display: "inline-block", marginTop: 10, padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8 }}>
            Browse products
          </Link>
        </div>
      )}

      {!loading && items.length > 0 && (
        <>
          <ul style={{ padding: 0, listStyle: "none", display: "grid", gap: 12, marginTop: 16 }}>
            {items.map((i) => (
              <li key={i.productId} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
                <div style={{ fontWeight: 700 }}>{i.titleSnapshot}</div>
                <div style={{ opacity: 0.7 }}>Slug: {i.slugSnapshot}</div>
                <div>Price: ${i.priceSnapshotUSD}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
                  <label>Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={i.qty}
                    onChange={(e) => updateQty(i.productId, Number(e.target.value))}
                    style={{ width: 80, padding: 8 }}
                  />
                  <button onClick={() => removeItem(i.productId)} style={{ padding: "8px 10px" }}>Remove</button>
                </div>
                <div style={{ marginTop: 10, fontWeight: 600 }}>Line total: ${(i.priceSnapshotUSD * i.qty).toFixed(2)}</div>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 16, fontSize: 18, fontWeight: 700 }}>Items total: ${itemsTotal.toFixed(2)}</div>
          <div style={{ marginTop: 16 }}>
            <button onClick={checkout} disabled={checkingOut} style={{ padding: "10px 14px" }}>
              {checkingOut ? "Checking out..." : "Checkout (Mock Payment)"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
