import { Suspense } from "react";
import CartClient from "./CartClient";

// This tells Next.js to skip static generation for this page
export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <Suspense fallback={<div>Loading Cart...</div>}>
      <CartClient />
    </Suspense>
  );
}
