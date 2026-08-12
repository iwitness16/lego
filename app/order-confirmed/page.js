import { Suspense } from "react";
import OrderConfirmedContent from "./OrderConfirmedContent";

// Suspense wrapper required by Next.js 14 whenever useSearchParams is used
export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center bg-paper" />}>
      <OrderConfirmedContent />
    </Suspense>
  );
}
