"use client";

import { useEffect, useState } from "react";
import DashboardTopbar from "@/components/shared/DashboardTopbar";
import api from "@/lib/api";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import type { Product, PaginationInfo } from "@/lib/types";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [stockInput, setStockInput] = useState("");

  async function fetchInventory() {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: page.toString(), limit: "15" };
      if (lowStockOnly) params.lowStock = "true";
      if (search) params.search = search;

      const res = await api.get("/inventory", { params });
      setProducts(res.data.products || []);
      setPagination(res.data.pagination || null);
    } catch (err) {
      console.error("Failed to load inventory:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInventory();
  }, [page, lowStockOnly, search]);

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
      <DashboardTopbar title="Inventory &amp; Stock Control" roleLabel="Admin" />
      <div className="p-4">
        {/* Filter bar */}
        <div className="celsa-stat-card bg-white p-3 mb-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="input-group" style={{ maxWidth: 300 }}>
              <input
                className="form-control form-control-sm"
                placeholder="Search stock..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              <button className="btn btn-sm btn-outline-secondary">
                <i className="bi bi-search" />
              </button>
            </div>

            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                id="lowStockCheck"
                checked={lowStockOnly}
                onChange={(e) => {
                  setLowStockOnly(e.target.checked);
                  setPage(1);
                }}
              />
              <label className="form-check-label small fw-semibold text-danger" htmlFor="lowStockCheck">
                Show Low Stock Alerts Only
              </label>
            </div>
          </div>
        </div>

        {/* Table */}
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
                  <th>Base Price</th>
                  <th>Stock Status</th>
                  <th>Current Stock</th>
                  <th className="text-end">Quick Adjust Stock</th>
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
                        <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                          Threshold: {p.lowStockThreshold} units
                        </div>
                      </td>
                      <td className="small">{catName}</td>
                      <td className="small fw-semibold text-success">₱{p.basePrice.toFixed(2)}</td>
                      <td>
                        {isLow ? (
                          <span className="badge bg-warning text-dark fw-normal px-2 py-1">
                            Low Stock Alert ({p.stock})
                          </span>
                        ) : (
                          <span className="badge bg-success text-white fw-normal px-2 py-1">
                            In Stock
                          </span>
                        )}
                      </td>
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
                            <i className="bi bi-pencil me-1" /> Adjust Stock
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {pagination && pagination.pages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage(page - 1)}>
                      ‹
                    </button>
                  </li>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setPage(p)}>
                        {p}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${page >= pagination.pages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage(page + 1)}>
                      ›
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
