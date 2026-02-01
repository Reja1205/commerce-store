import { Suspense } from "react";
import CartClient from "./CartClient";
import SuccessParam from "./SuccessParam";

export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <Suspense fallback={<div>Loading Cart...</div>}>
      <SuccessParam>
        {(success) => <CartClient success={success} />}
      </SuccessParam>
    </Suspense>
  );
}
