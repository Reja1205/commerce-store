"use client";
import { useSearchParams } from "next/navigation";

export default function SuccessParam({ children }) {
  const sp = useSearchParams();
  return children(sp.get("success") === "1");
}
