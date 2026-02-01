import AddToCartButton from "./AddToCartButton";

export default async function ProductDetails({ params }) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const slug = String(params.slug || "").toLowerCase();

  let product = null;
  let error = "";

  try {
    const res = await fetch(`${base}/api/products/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      error = `Product not found (status ${res.status})`;
    } else {
      const data = await res.json();
      product = data.product;
      if (!product) error = "Product not found (empty response)";
    }
  } catch (e) {
    error = `Network error: cannot reach API at ${base}`;
  }

  if (error) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Product not found</h1>
        <p style={{ opacity: 0.8 }}>{error}</p>
        <p style={{ opacity: 0.7 }}>Tried slug: {slug}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>{product.title}</h1>
      <p style={{ opacity: 0.8 }}>{product.description || "No description"}</p>

      <div style={{ marginTop: 12 }}>Price: ${product.priceUSD}</div>
      <div>Stock: {product.stockQty}</div>
      <div style={{ opacity: 0.7 }}>Slug: {product.slug}</div>

      <div style={{ marginTop: 16 }}>
        <AddToCartButton productId={product._id} />
      </div>
    </main>
  );
}