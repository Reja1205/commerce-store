

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminProductsPage() {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [products, setProducts] = useState([]);
  const [msg, setMsg] = useState("Loading...");

  const load = async () => {
    try {
      const res = await fetch(`${base}/api/products`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();a

      if (!res.ok) {
        setMsg(data?.message || "Failed to load products");
        setProducts([]);
      } else {
        setProducts(data.products || []);
        setMsg("");
      }
    } catch (e) {
      setMsg("Network error");
      setProducts([]);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 1000 }}>
      <h1>Admin – Products</h1>

      <div style={{ marginBottom: 12, display: "flex", gap: 12 }}>
        <Link href="/admin/products/new">+ Add Product</Link>
        <Link href="/admin/orders">Admin Orders</Link>
        <button onClick={load} style={{ padding: "8px 10px" }}>
          Refresh
        </button>
      </div>

      {msg ? <p>{msg}</p> : null}

      {products.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
          {products.map((p) => (
            <li
              key={p._id}
              style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{p.title}</div>
                  <div style={{ opacity: 0.75 }}>Slug: {p.slug}</div>
                  <div>Price: ${p.priceUSD}</div>
                  <div>Stock: {p.stockQty}</div>
                  <div>Status: {p.active ? "Active" : "Inactive"}</div>
                </div>

                <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
                  <Link href={`/admin/products/${p._id}`}>Edit</Link>
                  <Link href={`/products/${p.slug}`}>View</Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}