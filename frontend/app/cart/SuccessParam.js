"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessParam({ children }) {
  const sp = useSearchParams();
  const success = sp.get("success") === "1";
  return children(success);
}
