"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "N/A";

  return (
    <div className="container-fluid px-4 py-5 text-center" style={{ maxWidth: 600, margin: "0 auto" }}>
      <div className="mb-4">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10"
          style={{ width: 80, height: 80 }}
        >
          <i className="bi bi-check-lg text-success" style={{ fontSize: "2.5rem" }} />
        </div>
      </div>

      <h3 className="fw-bold mb-2">Order Placed Successfully!</h3>
      <p className="text-muted">
        Thank you for your order. Your order number is:
      </p>

      <div className="border rounded p-3 mb-4 bg-light d-inline-block">
        <span className="fw-bold fs-4 font-monospace">{orderNumber}</span>
      </div>

      <p className="text-muted small">
        You will receive an email confirmation shortly. You can track your order
        status in your account.
      </p>

      <div className="d-flex gap-3 justify-content-center mt-4">
        <Link href="/my-orders" className="btn btn-success">
          View My Orders
        </Link>
        <Link href="/products" className="btn btn-outline-secondary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={<LoadingSkeleton variant="spinner" />}
    >
      <SuccessContent />
    </Suspense>
  );
}
