"use client";

import { useEffect, useState } from "react";
import DashboardTopbar from "@/components/shared/DashboardTopbar";
import StatusBadge from "@/components/shared/StatusBadge";
import api from "@/lib/api";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import type { Order } from "@/lib/types";

export default function StaffCustomizationPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  async function fetchCustomOrders() {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      const all: Order[] = res.data.orders || [];
      const custom = all.filter(
        (o) =>
          o.orderType === "custom" ||
          o.customApprovalStatus === "approved" ||
          o.referenceImage ||
          o.designDescription ||
          o.orderType === "pre-order" ||
          o.items.some((i) => i.customizations?.length > 0)
      );
      setOrders(custom);
    } catch (err) {
      console.error("Failed to load staff customization tasks:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomOrders();
  }, []);

  async function updateStatus(orderId: string, status: string) {
    try {
      await api.patch(`/orders/${orderId}/status`, { orderStatus: status });
      fetchCustomOrders();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  return (
    <>
      <DashboardTopbar title="Staff Customization Queue &amp; Instructions" roleLabel="Staff" />
      <div className="p-4">
        {loading ? (
          <LoadingSkeleton variant="cardGrid" />
        ) : orders.length === 0 ? (
          <div className="celsa-stat-card bg-white p-5 text-center text-muted">
            <i className="bi bi-palette fs-1 d-block mb-2" />
            <p>No active customization tasks in production queue.</p>
          </div>
        ) : (
          <div className="row g-4">
            {orders.map((o) => {
              const custName = typeof o.user === "object" && o.user !== null ? o.user.name : "Customer";

              return (
                <div className="col-12" key={o._id}>
                  <div className="celsa-stat-card bg-white p-4 border shadow-sm rounded-4">
                    <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom flex-wrap gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold font-monospace fs-6">{o.orderNumber}</span>
                        {o.customApprovalStatus === "approved" && (
                          <span className="badge bg-success">
                            <i className="bi bi-check-circle me-1" /> Approved for Production
                          </span>
                        )}
                        {o.customApprovalStatus === "pending" && (
                          <span className="badge bg-warning text-dark">
                            <i className="bi bi-clock me-1" /> Awaiting Admin Approval
                          </span>
                        )}
                        <span className="text-muted small ms-2">Customer: <strong>{custName}</strong></span>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <StatusBadge
                          status={
                            o.orderStatus === "completed"
                              ? "completed"
                              : o.orderStatus === "processing"
                              ? "in-progress"
                              : "pending"
                          }
                        />
                        <select
                          className="form-select form-select-sm w-auto"
                          value={o.orderStatus}
                          onChange={(e) => updateStatus(o._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">In Production</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="fw-semibold small text-dark mb-1">
                          <i className="bi bi-palette me-1 text-success" /> Reference Image &amp; Design Description:
                        </div>
                        <div className="d-flex gap-3 align-items-start p-3 bg-light rounded-3 border">
                          {o.referenceImage ? (
                            <img
                              src={o.referenceImage}
                              alt="Reference preview"
                              className="rounded border shadow-sm cursor-pointer flex-shrink-0"
                              style={{ width: 80, height: 80, objectFit: "cover", cursor: "pointer" }}
                              onClick={() => setPreviewImage(o.referenceImage || null)}
                              title="Click to zoom image"
                            />
                          ) : (
                            <div
                              className="rounded bg-white border d-flex align-items-center justify-content-center flex-shrink-0 text-muted"
                              style={{ width: 80, height: 80, fontSize: "0.7rem" }}
                            >
                              No Image
                            </div>
                          )}
                          <div>
                            <p className="small text-muted mb-0">
                              {o.designDescription || "Follow custom options specified in the order item choices."}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="fw-semibold small text-dark mb-1">
                          <i className="bi bi-list-check me-1 text-success" /> Crafting Specifications:
                        </div>
                        {o.items.map((it, idx) => (
                          <div key={idx} className="p-2 border rounded-3 bg-light mb-2 small">
                            <strong className="text-dark">{it.productName} (x{it.quantity})</strong>
                            {it.customizations?.length > 0 && (
                              <div className="text-muted mt-1" style={{ fontSize: "0.75rem" }}>
                                {it.customizations.map((c) => `${c.label}: ${c.selectedValue}`).join(" | ")}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* High-res Image Preview Modal */}
      {previewImage && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          tabIndex={-1}
          onClick={() => setPreviewImage(null)}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-transparent border-0 text-center position-relative">
              <button
                type="button"
                className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2"
                onClick={() => setPreviewImage(null)}
              >
                <i className="bi bi-x fs-5" />
              </button>
              <img
                src={previewImage}
                alt="Reference preview"
                className="img-fluid rounded-4 shadow-lg"
                style={{ maxHeight: "80vh", objectFit: "contain", margin: "0 auto" }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
