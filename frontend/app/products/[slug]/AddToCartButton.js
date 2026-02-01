"use client";

import { useState } from "react";

export default function AddToCartButton({ productId }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const add = async () => {
    setLoading(true);
    setMsg("");

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      const res = await fetch(`${base}/api/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // IMPORTANT: send cookies
        body: JSON.stringify({ productId, qty: 1 }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data?.message || "Failed to add to cart");
      } else {
        setMsg("Added to cart ✅");
      }
    } catch (e) {
      setMsg("Network error: cannot reach backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={add} disabled={loading} style={{ padding: "10px 14px" }}>
        {loading ? "Adding..." : "Add to Cart"}
      </button>
      {msg ? <div style={{ marginTop: 10 }}>{msg}</div> : null}
    </div>
  );
}