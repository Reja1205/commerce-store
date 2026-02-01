"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function AdminEditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [priceUSD, setPriceUSD] = useState("");
  const [stockQty, setStockQty] = useState("");
  const [active, setActive] = useState(true);

  const load = async () => {
    if (!id) return;

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`${base}/api/admin/products/${id}`, {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data?.message || "Failed to load product");
      } else {
        const p = data.product;
        setTitle(p.title || "");
        setSlug(p.slug || "");
        setPriceUSD(String(p.priceUSD ?? ""));
        setStockQty(String(p.stockQty ?? ""));
        setActive(Boolean(p.active));
      }
    } catch {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    try {
      const res = await fetch(`${base}/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          slug,
          priceUSD: Number(priceUSD),
          stockQty: Number(stockQty),
          active: Boolean(active),
        }),
      });

      const data = await res.json();
      if (!res.ok) setMsg(data?.message || "Failed to save");
      else router.push("/admin/products");
    } catch {
      setMsg("Network error");
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    if (!confirm("Delete this product?")) return;

    setDeleting(true);
    try {
      await fetch(`${base}/api/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      router.push("/admin/products");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <Link href="/admin/products">← Back</Link>
      <h1>Edit Product</h1>

      {loading && <p>Loading...</p>}
      {msg && <p>{msg}</p>}

      {!loading && (
        <form onSubmit={save} style={{ display: "grid", gap: 10 }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <input value={slug} onChange={(e) => setSlug(e.target.value)} />
          <input type="number" value={priceUSD} onChange={(e) => setPriceUSD(e.target.value)} />
          <input type="number" value={stockQty} onChange={(e) => setStockQty(e.target.value)} />

          <label>
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            Active
          </label>

          <button disabled={saving}>Save</button>
          <button type="button" onClick={del} disabled={deleting}>Delete</button>
        </form>
      )}
    </main>
  );
}
