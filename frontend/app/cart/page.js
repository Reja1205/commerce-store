export const dynamic = "force-dynamic";

import dynamic from "next/dynamic";

const CartClient = dynamic(() => import("./CartClient"), { ssr: false });

export default function CartPage() {
  return <CartClient />;
}
