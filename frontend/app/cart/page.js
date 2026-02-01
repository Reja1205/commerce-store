"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import the client component to ensure it only runs on the client
const CartClient = dynamic(() => import("./CartClient"), { 
  ssr: false,
  loading: () => <p>Loading Cart...</p> 
});

export default function CartPage() {
  return (
    <Suspense fallback={<p>Loading search parameters...</p>}>
      <CartClient />
    </Suspense>
  );
}
