export const dynamic = "force-dynamic";
import ProductsClient from "./components/ProductsClient";

export default async function Home() {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const res = await fetch(`${base}/api/products?sort=newest`, {
    cache: "no-store",
  });

  const data = await res.json();
  const products = data.products || [];

  return <ProductsClient initialProducts={products} />;
}