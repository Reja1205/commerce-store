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
    } catch (e) {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      if (!res.ok) {
        setMsg(data?.message || "Failed to save");
      } else {
        router.push("/admin/products");
      }
    } catch (e) {
      setMsg("Network error");
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    const ok = confirm("Delete this product? This cannot be undone.");
    if (!ok) return;

    setDeleting(true);
    setMsg("");

    try {
      const res = await fetch(`${base}/api/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setMsg(data?.message || "Failed to delete");
      } else {
        router.push("/admin/products");
      }
    } catch (e) {
      setMsg("Network error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 520 }}>
      <Link href="/admin/products">← Back</Link>

      <h1 style={{ marginTop: 12 }}>Edit Product</h1>

      {loading ? <p>Loading...</p> : null}

      {msg ? (
        <div style={{ border: "1px solid #f99", padding: 10, borderRadius: 8 }}>
          {msg}
        </div>
      ) : null}

      {!loading ? (
        <form onSubmit={save} style={{ display: "grid", gap: 10, marginTop: 12 }}>
          <label>
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", padding: 10 }}
            />
          </label>

          <label>
            Slug
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              style={{ width: "100%", padding: 10 }}
            />
          </label>

          <label>
            Price (USD)
            <input
              type="number"
              value={priceUSD}
              onChange={(e) => setPriceUSD(e.target.value)}
              style={{ width: "100%", padding: 10 }}
            />
          </label>

          <label>
            Stock Qty
            <input
              type="number"
              value={stockQty}
              onChange={(e) => setStockQty(e.target.value)}
              style={{ width: "100%", padding: 10 }}
            />
          </label>

          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            Active
          </label>

          <div style={{ display: "flex", gap: 10 }}>
            <button disabled={saving} style={{ padding: "10px 14px" }}>
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={del}
              disabled={deleting}
              style={{ padding: "10px 14px" }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </form>
      ) : null}
    </main>
  );
}