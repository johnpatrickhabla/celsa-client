"use client";

import { useEffect, useState } from "react";
import DashboardTopbar from "@/components/shared/DashboardTopbar";
import StatusBadge from "@/components/shared/StatusBadge";
import api from "@/lib/api";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import type { Order, User } from "@/lib/types";

export default function AdminProductionPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    try {
      const [ordRes, staffRes] = await Promise.all([
        api.get("/orders", { params: { limit: 50 } }),
        api.get("/users", { params: { role: "staff" } }),
      ]);
      setOrders(ordRes.data.orders || []);
      setStaffList(staffRes.data.users || []);
    } catch (err) {
      console.error("Failed to load production queue data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAssign(orderId: string, staffId: string) {
    try {
      await api.patch(`/orders/${orderId}/assign`, { staffId: staffId || null });
      loadData();
    } catch (err) {
      console.error("Failed to assign staff:", err);
    }
  }

  async function updateStatus(orderId: string, status: string) {
    try {
      await api.patch(`/orders/${orderId}/status`, { orderStatus: status });
      loadData();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  return (
    <>
      <DashboardTopbar title="Production Queue &amp; Staff Assignment" roleLabel="Admin" />
      <div className="p-4">
        {loading ? (
          <LoadingSkeleton variant="table" />
        ) : orders.length === 0 ? (
          <div className="celsa-stat-card bg-white p-5 text-center text-muted">
            <i className="bi bi-gear fs-1 d-block mb-2" />
            <p>No active production tasks.</p>
          </div>
        ) : (
          <div className="celsa-stat-card bg-white p-3">
            <table className="table table-hover align-middle mb-0">
              <thead className="text-muted small border-bottom">
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Assigned Staff</th>
                  <th>Production Status</th>
                  <th className="text-end">Assign / Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const custName = typeof o.user === "object" ? o.user.name : "Customer";
                  const assignedStaffId =
                    typeof o.assignedTo === "object" && o.assignedTo !== null
                      ? o.assignedTo._id
                      : (o.assignedTo as string) || "";

                  return (
                    <tr key={o._id}>
                      <td className="fw-bold font-monospace small">{o.orderNumber}</td>
                      <td className="small">{custName}</td>
                      <td className="small">
                        {o.items.map((it) => `${it.productName} (${it.quantity}x)`).join(", ")}
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          style={{ maxWidth: 180 }}
                          value={assignedStaffId}
                          onChange={(e) => handleAssign(o._id, e.target.value)}
                        >
                          <option value="">-- Unassigned --</option>
                          {staffList.map((s) => (
                            <option key={s._id} value={s._id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
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
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">In Production</option>
                          <option value="shipped">Shipped</option>
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
