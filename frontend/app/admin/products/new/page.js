"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [title, setTitle] = useState("");
  const [priceUSD, setPriceUSD] = useState("");
  const [stockQty, setStockQty] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`${base}/api/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          priceUSD: Number(priceUSD),
          stockQty: Number(stockQty),
        }),
      });

      if (res.ok) router.push("/admin/products");
      else setMsg("Failed to create product");
    } catch {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <Link href="/admin/products">← Back</Link>
      <h1>Add Product</h1>

      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="number" placeholder="Price" value={priceUSD} onChange={(e) => setPriceUSD(e.target.value)} />
        <input type="number" placeholder="Stock" value={stockQty} onChange={(e) => setStockQty(e.target.value)} />

        <button disabled={loading}>{loading ? "Saving..." : "Create"}</button>
      </form>

      {msg && <p>{msg}</p>}
    </main>
  );
}
