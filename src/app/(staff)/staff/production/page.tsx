"use client";

import { useEffect, useState } from "react";
import DashboardTopbar from "@/components/shared/DashboardTopbar";
import StatusBadge from "@/components/shared/StatusBadge";
import api from "@/lib/api";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import type { Order } from "@/lib/types";

export default function StaffProductionPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProduction() {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to load production queue:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProduction();
  }, []);

  async function updateStatus(orderId: string, status: string) {
    try {
      await api.patch(`/orders/${orderId}/status`, { orderStatus: status });
      fetchProduction();
    } catch (err) {
      console.error("Failed to update production status:", err);
    }
  }

  return (
    <>
      <DashboardTopbar title="Production Tasks" roleLabel="Staff" />
      <div className="p-4">
        {loading ? (
          <LoadingSkeleton variant="table" />
        ) : orders.length === 0 ? (
          <div className="celsa-stat-card bg-white p-5 text-center text-muted">
            <i className="bi bi-gear fs-1 d-block mb-2" />
            <p>No production tasks currently assigned.</p>
          </div>
        ) : (
          <div className="celsa-stat-card bg-white p-3">
            <table className="table table-hover align-middle mb-0">
              <thead className="text-muted small border-bottom">
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Craft Items</th>
                  <th>Current Status</th>
                  <th className="text-end">Production Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const custName = typeof o.user === "object" ? o.user.name : "Customer";
                  return (
                    <tr key={o._id}>
                      <td className="fw-bold font-monospace small">{o.orderNumber}</td>
                      <td className="small">{custName}</td>
                      <td className="small">
                        {o.items.map((it) => `${it.productName} (${it.quantity}x)`).join(", ")}
                      </td>
                      <td>
                        <StatusBadge
                          status={
                            o.orderStatus === "completed"
                              ? "completed"
                              : o.orderStatus === "processing"
                              ? "in-progress"
                              : "pending"
                          }
                        />
                      </td>
                      <td className="text-end">
                        <select
                          className="form-select form-select-sm d-inline-block w-auto"
                          value={o.orderStatus}
                          onChange={(e) => updateStatus(o._id, e.target.value)}
                        >
                          <option value="pending">Pending Crafting</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">In Weaving / Crafting</option>
                          <option value="shipped">Ready for Delivery</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
