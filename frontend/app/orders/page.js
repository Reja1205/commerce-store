import { Suspense } from "react";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic";

export default function OrdersPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
      <OrdersClient />
    </Suspense>
  );
}
