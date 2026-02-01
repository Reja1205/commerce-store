import { Suspense } from "react";
import OrderDetailsClient from "./OrderDetailsClient";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
      <OrderDetailsClient />
    </Suspense>
  );
}
