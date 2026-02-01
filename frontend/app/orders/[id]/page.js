import { Suspense } from "react";
import OrderDetailsClient from "./OrderDetailsClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderDetailsClient />
    </Suspense>
  );
}
