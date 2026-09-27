"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import type { Order, PaginationInfo } from "@/lib/types";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: "#f4e2b8", text: "#7a5a12" },
  confirmed: { bg: "#dce8f5", text: "#2b5797" },
  processing: { bg: "#d9e6f2", text: "#234b73" },
  shipped: { bg: "#c8e6f5", text: "#0d6efd" },
  completed: { bg: "#d7ead9", text: "#245a2c" },
  cancelled: { bg: "#f5d5d5", text: "#842029" },
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  unpaid: "Unpaid",
  deposit_paid: "Deposit Paid",
  fully_paid: "Fully Paid",
  cod_pending: "COD - Pending",
  paid: "Paid",
};

export default function MyOrdersPage() {
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    async function fetchOrders() {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        const res = await api.get("/orders/mine", {
          params: { page: page.toString(), limit: "10" },
        });
        setOrders(res.data.orders);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [isAuthenticated, page]);

  if (!isAuthenticated) {
    return (
      <div className="container-fluid px-4 py-5">
        <h4 className="fw-bold mb-4">My Orders</h4>
        <div className="text-center py-5">
          <i className="bi bi-lock fs-1 text-muted d-block mb-3" />
          <h5 className="fw-bold text-dark">Log in to view your orders</h5>
          <p className="text-muted small mb-4">
            You need to be logged in to track and view your order history.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <Link href="/login?next=/my-orders" className="btn btn-success px-4 rounded-3 fw-semibold">
              Log In
            </Link>
            <Link href="/signup?next=/my-orders" className="btn btn-outline-secondary px-4 rounded-3">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-5">
      <h4 className="fw-bold mb-4">My Orders</h4>

      {loading ? (
        <LoadingSkeleton variant="orderList" />
      ) : orders.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-receipt fs-1 d-block mb-2" />
          <p>You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="btn btn-success">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          {orders.map((order) => {
            const statusColor = STATUS_COLORS[order.orderStatus] || STATUS_COLORS.pending;
            const isExpanded = expandedOrder === order._id;

            return (
              <div key={order._id} className="border rounded-4 mb-3 overflow-hidden shadow-sm bg-white">
                {/* Order header */}
                <div
                  className="d-flex justify-content-between align-items-center p-3 bg-white"
                  style={{ cursor: "pointer" }}
                  onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                >
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="fw-bold font-monospace text-dark">{order.orderNumber}</span>
                    <span
                      className="badge rounded-pill px-3 py-1 fw-medium"
                      style={{
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                      }}
                    >
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                    {order.orderType === "custom" && (
                      <span className="badge bg-purple text-white rounded-pill px-2 py-1" style={{ backgroundColor: "#6f42c1", fontSize: "0.7rem" }}>
                        Custom Order
                      </span>
                    )}
                    {order.orderType === "pre-order" && (
                      <span className="badge bg-warning text-dark rounded-pill px-2 py-1" style={{ fontSize: "0.65rem" }}>
                        Pre-Order
                      </span>
                    )}
                    {order.customApprovalStatus === "pending" && (
                      <span className="badge bg-warning text-dark border border-warning" style={{ fontSize: "0.7rem" }}>
                        <i className="bi bi-clock-history me-1" /> Review Pending
                      </span>
                    )}
                    {order.customApprovalStatus === "approved" && (
                      <span className="badge bg-success" style={{ fontSize: "0.7rem" }}>
                        <i className="bi bi-check-circle me-1" /> Custom Approved
                      </span>
                    )}
                    {order.customApprovalStatus === "rejected" && (
                      <span className="badge bg-danger" style={{ fontSize: "0.7rem" }}>
                        <i className="bi bi-x-circle me-1" /> Custom Rejected
                      </span>
                    )}
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="text-muted small">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className="fw-bold text-success fs-6">
                      ₱{order.totalAmount.toFixed(2)}
                    </span>
                    <i className={`bi ${isExpanded ? "bi-chevron-up" : "bi-chevron-down"} text-muted`} />
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="p-3 border-top bg-light">
                    {/* Custom Request Review Banner */}
                    {order.customApprovalStatus === "rejected" && (
                      <div className="alert alert-danger py-2 px-3 small mb-3">
                        <strong><i className="bi bi-exclamation-triangle-fill me-1" /> Custom Design Request Rejected:</strong>{" "}
                        {order.customRejectionReason || "Design specifications could not be accommodated."}
                      </div>
                    )}
                    {order.customApprovalStatus === "approved" && (
                      <div className="alert alert-success py-2 px-3 small mb-3">
                        <i className="bi bi-check-circle-fill me-1" />
                        <strong>Approved:</strong> Your custom design specifications have been approved by the Administrator and scheduled for production.
                      </div>
                    )}
                    {order.customApprovalStatus === "pending" && (
                      <div className="alert alert-warning py-2 px-3 small mb-3">
                        <i className="bi bi-hourglass-split me-1" />
                        <strong>Under Review:</strong> The Administrator is currently reviewing your reference image and custom design specifications.
                      </div>
                    )}

                    {/* Live Order Lifecycle Progress Stepper */}
                    {order.orderStatus !== "cancelled" && (
                      <div className="p-3 rounded-3 bg-white border mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="fw-bold small text-dark">
                            <i className="bi bi-diagram-3 me-1 text-success" /> Live Preparation &amp; Fulfillment Progress
                          </span>
                          {order.orderStatus === "processing" && (
                            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary small">
                              <i className="bi bi-gear-fill me-1" /> Artisan is Actively Preparing Your Product
                            </span>
                          )}
                        </div>

                        <div className="d-flex justify-content-between align-items-center position-relative my-2 px-1">
                          {/* Step 1: Placed */}
                          <div className="text-center position-relative" style={{ zIndex: 2 }}>
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1 bg-success text-white shadow-sm"
                              style={{ width: 28, height: 28, fontSize: "0.75rem" }}
                            >
                              <i className="bi bi-check" />
                            </div>
                            <span className="small fw-semibold d-block" style={{ fontSize: "0.75rem" }}>Order Placed</span>
                          </div>

                          {/* Step 2: Confirmed */}
                          <div className="text-center position-relative" style={{ zIndex: 2 }}>
                            <div
                              className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1 shadow-sm ${
                                ["confirmed", "processing", "shipped", "completed"].includes(order.orderStatus)
                                  ? "bg-success text-white"
                                  : "bg-light text-muted border"
                              }`}
                              style={{ width: 28, height: 28, fontSize: "0.75rem" }}
                            >
                              {["confirmed", "processing", "shipped", "completed"].includes(order.orderStatus) ? (
                                <i className="bi bi-check" />
                              ) : (
                                "2"
                              )}
                            </div>
                            <span className="small fw-semibold d-block" style={{ fontSize: "0.75rem" }}>Confirmed</span>
                          </div>

                          {/* Step 3: Preparing / In Production */}
                          <div className="text-center position-relative" style={{ zIndex: 2 }}>
                            <div
                              className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1 shadow-sm ${
                                ["processing", "shipped", "completed"].includes(order.orderStatus)
                                  ? "bg-primary text-white"
                                  : "bg-light text-muted border"
                              }`}
                              style={{ width: 28, height: 28, fontSize: "0.75rem" }}
                            >
                              {["shipped", "completed"].includes(order.orderStatus) ? (
                                <i className="bi bi-check" />
                              ) : order.orderStatus === "processing" ? (
                                <i className="bi bi-gear-fill" />
                              ) : (
                                "3"
                              )}
                            </div>
                            <span className="small fw-semibold d-block" style={{ fontSize: "0.75rem" }}>
                              Preparing
                            </span>
                          </div>

                          {/* Step 4: Shipped */}
                          <div className="text-center position-relative" style={{ zIndex: 2 }}>
                            <div
                              className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1 shadow-sm ${
                                ["shipped", "completed"].includes(order.orderStatus)
                                  ? "bg-info text-white"
                                  : "bg-light text-muted border"
                              }`}
                              style={{ width: 28, height: 28, fontSize: "0.75rem" }}
                            >
                              {order.orderStatus === "completed" ? (
                                <i className="bi bi-check" />
                              ) : order.orderStatus === "shipped" ? (
                                <i className="bi bi-truck" />
                              ) : (
                                "4"
                              )}
                            </div>
                            <span className="small fw-semibold d-block" style={{ fontSize: "0.75rem" }}>Shipped</span>
                          </div>

                          {/* Step 5: Completed */}
                          <div className="text-center position-relative" style={{ zIndex: 2 }}>
                            <div
                              className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1 shadow-sm ${
                                order.orderStatus === "completed" ? "bg-success text-white" : "bg-light text-muted border"
                              }`}
                              style={{ width: 28, height: 28, fontSize: "0.75rem" }}
                            >
                              {order.orderStatus === "completed" ? <i className="bi bi-check-all" /> : "5"}
                            </div>
                            <span className="small fw-semibold d-block" style={{ fontSize: "0.75rem" }}>Delivered</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Shipment Tracking Info */}
                    {(order.trackingNumber || order.orderStatus === "shipped") && (
                      <div className="p-3 rounded-3 bg-white border mb-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <i className="bi bi-truck text-primary fs-5" />
                          <span className="fw-bold small text-dark">Shipment &amp; Delivery Tracking</span>
                          <span className="badge bg-primary ms-auto">Shipped</span>
                        </div>
                        <div className="row g-2 small">
                          <div className="col-sm-6">
                            <span className="text-muted">Courier / Carrier:</span>{" "}
                            <strong>{order.courierName || "Local Courier (Standard Delivery)"}</strong>
                          </div>
                          <div className="col-sm-6">
                            <span className="text-muted">Tracking Number:</span>{" "}
                            <strong className="font-monospace text-primary">
                              {order.trackingNumber || "Assigned upon dispatch"}
                            </strong>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="row g-3 mb-3">
                      <div className="col-md-3">
                        <div className="small text-muted">Payment Method</div>
                        <div className="fw-semibold small text-uppercase">
                          {order.paymentMethod}
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="small text-muted">Payment Status</div>
                        <div className="fw-semibold small">
                          {PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="small text-muted">Delivery Address</div>
                        <div className="small text-muted text-truncate" style={{ maxWidth: 200 }}>
                          {order.shippingAddress?.street}, {order.shippingAddress?.city}
                        </div>
                      </div>
                      {order.orderType === "pre-order" && (
                        <div className="col-md-3">
                          <div className="small text-muted">Balance Due</div>
                          <div className="fw-semibold small text-danger">
                            ₱{order.balanceDue.toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Custom Reference Image & Description */}
                    {(order.referenceImage || order.designDescription) && (
                      <div className="p-3 rounded-3 bg-white border mb-3">
                        <div className="fw-semibold small mb-2 text-dark">
                          <i className="bi bi-palette me-1 text-success" />
                          Custom Design Specifications &amp; Reference
                        </div>
                        <div className="row g-3 align-items-center">
                          {order.referenceImage && (
                            <div className="col-auto">
                              <a href={order.referenceImage} target="_blank" rel="noopener noreferrer">
                                <img
                                  src={order.referenceImage}
                                  alt="Reference Design"
                                  style={{ width: 80, height: 80, objectFit: "cover" }}
                                  className="rounded border shadow-sm"
                                />
                              </a>
                            </div>
                          )}
                          {order.designDescription && (
                            <div className="col">
                              <p className="small text-muted mb-0 fst-italic">
                                &quot;{order.designDescription}&quot;
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="small fw-semibold mb-2 text-dark">Ordered Items</div>
                    {order.items.map((item, i) => (
                      <div key={i} className="d-flex gap-2 mb-2 p-2 rounded bg-white border">
                        <div
                          className="bg-light rounded flex-shrink-0 d-flex align-items-center justify-content-center overflow-hidden"
                          style={{ width: 44, height: 44 }}
                        >
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              style={{ objectFit: "cover", width: "100%", height: "100%" }}
                            />
                          ) : (
                            <i className="bi bi-image text-muted" style={{ fontSize: "0.7rem" }} />
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <div className="small fw-semibold text-dark">{item.productName}</div>
                          {item.customizations?.length > 0 && (
                            <div style={{ fontSize: "0.7rem" }} className="text-muted">
                              {item.customizations.map((c) => `${c.label}: ${c.selectedValue}`).join(" · ")}
                            </div>
                          )}
                        </div>
                        <div className="text-end">
                          <div className="small text-muted">x{item.quantity}</div>
                          <div className="small fw-semibold text-success">₱{(item.unitPrice * item.quantity).toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <nav className="d-flex justify-content-center mt-3">
              <ul className="pagination pagination-sm">
                <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)}>‹</button>
                </li>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                  </li>
                ))}
                <li className={`page-item ${page >= (pagination?.pages || 1) ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)}>›</button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
