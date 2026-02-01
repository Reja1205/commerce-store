"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartClient({ success }) {
  const router = useRouter();
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);

  const loadCart = async () => {
    setLoading(true);
    setMsg((prev) => prev); // keep any existing message
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
      setMsg("Network error");
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      setMsg("Checkout successful ✅ Your order has been placed.");
    }
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  // If you have these functions in your real file, keep them.
  // updateQty, removeItem, checkout, etc. can stay exactly as you had them.

  const items = cart?.items || [];
  const itemsTotal = items.reduce(
    (sum, i) => sum + i.priceSnapshotUSD * i.qty,
    0
  );

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 700 }}>
      <h1>Cart</h1>

      <div style={{ marginBottom: 12, display: "flex", gap: 12 }}>
        <Link href="/">← Continue shopping</Link>
        <Link href="/orders">My orders</Link>
      </div>

      {loading && <p>Loading...</p>}

      {msg && (
        <div
          style={{
            marginTop: 12,
            border: "1px solid #ddd",
            padding: 10,
            borderRadius: 8,
          }}
        >
          {msg}
        </div>
      )}

      {!loading && items.length === 0 && !msg && <p>Your cart is empty.</p>}

      {!loading && items.length > 0 && (
        <>
          <ul
            style={{
              padding: 0,
              listStyle: "none",
              display: "grid",
              gap: 12,
              marginTop: 16,
            }}
          >
            {items.map((i) => (
              <li
                key={i.productId}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <div>
                  <strong>{i.titleSnapshot}</strong> - ${i.priceSnapshotUSD}
                </div>
                <div>Qty: {i.qty}</div>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 16, fontWeight: 700 }}>
            Total: ${itemsTotal.toFixed(2)}
          </div>
        </>
      )}
    </main>
  );
}
