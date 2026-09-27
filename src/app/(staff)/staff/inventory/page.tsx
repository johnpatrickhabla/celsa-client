"use client";

import { useEffect, useState } from "react";
import DashboardTopbar from "@/components/shared/DashboardTopbar";
import api from "@/lib/api";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import type { Product } from "@/lib/types";

export default function StaffInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [stockInput, setStockInput] = useState("");

  async function fetchInventory() {
    setLoading(true);
    try {
      const res = await api.get("/inventory");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to load inventory for staff:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInventory();
  }, []);

  async function handleAdjust(productId: string) {
    const val = parseInt(stockInput);
    if (isNaN(val)) return;
    try {
      await api.patch(`/inventory/${productId}`, { stock: val });
      setAdjustingId(null);
      setStockInput("");
      fetchInventory();
    } catch (err) {
      console.error("Failed to adjust stock:", err);
    }
  }

  return (
    <>
      <DashboardTopbar title="Staff Stock Update" roleLabel="Staff" />
      <div className="p-4">
        {loading ? (
          <LoadingSkeleton variant="table" />
        ) : products.length === 0 ? (
          <div className="celsa-stat-card bg-white p-5 text-center text-muted">
            <i className="bi bi-clipboard-data fs-1 d-block mb-2" />
            <p>No inventory records found.</p>
          </div>
        ) : (
          <div className="celsa-stat-card bg-white p-3">
            <table className="table table-hover align-middle mb-0">
              <thead className="text-muted small border-bottom">
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th className="text-end">Update Stock Level</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const isLow = p.stock <= p.lowStockThreshold;
                  const catName = typeof p.category === "object" ? p.category.name : "";
                  return (
                    <tr key={p._id} className={isLow ? "table-warning bg-opacity-10" : ""}>
                      <td>
                        <div className="fw-semibold small">{p.name}</div>
                        {isLow && (
                          <span className="badge bg-warning text-dark" style={{ fontSize: "0.65rem" }}>
                            Low Stock Alert
                          </span>
                        )}
                      </td>
                      <td className="small">{catName}</td>
                      <td className="fw-bold fs-6">{p.stock}</td>
                      <td className="text-end">
                        {adjustingId === p._id ? (
                          <div className="d-inline-flex gap-1 align-items-center">
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              style={{ width: 80 }}
                              value={stockInput}
                              onChange={(e) => setStockInput(e.target.value)}
                              placeholder={p.stock.toString()}
                            />
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleAdjust(p._id)}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => setAdjustingId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              setAdjustingId(p._id);
                              setStockInput(p.stock.toString());
                            }}
                          >
                            <i className="bi bi-pencil me-1" /> Update Stock
                          </button>
                        )}
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
