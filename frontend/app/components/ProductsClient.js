"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function ProductsClient({ initialProducts }) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [busyId, setBusyId] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return initialProducts;

    return initialProducts.filter((p) => {
      const title = String(p.title || "").toLowerCase();
      const slug = String(p.slug || "").toLowerCase();
      return title.includes(query) || slug.includes(query);
    });
  }, [q, initialProducts]);

  const addToCart = async (productId) => {
    setBusyId(productId);
    setMsg("");

    try {
      const res = await fetch(`${base}/api/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, qty: 1 }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Typical: 401 Not authenticated
        setMsg(data?.message || "Failed to add to cart");
      } else {
        setMsg("Added to cart ✅");
      }
    } catch (e) {
      setMsg("Network error: cannot reach backend");
    } finally {
      setBusyId("");
    }
  };

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ marginTop: 8 }}>Store</h1>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title or slug..."
          style={{
            flex: 1,
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        />
        <Link href="/cart" style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8 }}>
          Go to Cart
        </Link>
      </div>

      {msg ? (
        <div style={{ marginTop: 12, border: "1px solid #ddd", padding: 10, borderRadius: 8 }}>
          {msg}
          {String(msg).toLowerCase().includes("not authenticated") ? (
            <span>
              {" "}
              <Link href="/login">Login</Link>
            </span>
          ) : null}
        </div>
      ) : null}

      <div style={{ marginTop: 12, opacity: 0.75 }}>
        Showing {filtered.length} / {initialProducts.length}
      </div>

      {filtered.length === 0 ? (
        <p style={{ marginTop: 16 }}>No products found.</p>
      ) : (
        <ul
          style={{
            padding: 0,
            listStyle: "none",
            display: "grid",
            gap: 12,
            marginTop: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {filtered.map((p) => (
            <li
              key={p._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 12,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 16 }}>
                <Link href={`/products/${p.slug}`}>{p.title}</Link>
              </div>

              <div style={{ marginTop: 8 }}>Price: ${p.priceUSD}</div>
              <div>Stock: {p.stockQty}</div>
              <div style={{ opacity: 0.7, marginTop: 6 }}>Slug: {p.slug}</div>

              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <Link
                  href={`/products/${p.slug}`}
                  style={{
                    padding: "10px 12px",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                  }}
                >
                  View
                </Link>

                <button
                  onClick={() => addToCart(p._id)}
                  disabled={busyId === p._id || p.stockQty <= 0}
                  style={{
                    padding: "10px 12px",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    cursor: busyId === p._id ? "not-allowed" : "pointer",
                  }}
                >
                  {p.stockQty <= 0 ? "Out of stock" : busyId === p._id ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}