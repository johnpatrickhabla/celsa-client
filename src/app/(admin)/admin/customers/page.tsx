"use client";

import { useEffect, useState } from "react";
import DashboardTopbar from "@/components/shared/DashboardTopbar";
import api from "@/lib/api";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import type { User, PaginationInfo } from "@/lib/types";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        const res = await api.get("/users", {
          params: { role: "customer", page, limit: 15, search },
        });
        setCustomers(res.data.users || []);
        setPagination(res.data.pagination || null);
      } catch (err) {
        console.error("Failed to load customers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, [page, search]);

  return (
    <>
      <DashboardTopbar title="Customer Management" roleLabel="Admin" />
      <div className="p-4">
        <div className="celsa-stat-card bg-white p-3 mb-4">
          <div className="input-group" style={{ maxWidth: 320 }}>
            <input
              className="form-control form-control-sm"
              placeholder="Search customer name or email..."
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
        </div>

        {loading ? (
          <LoadingSkeleton variant="table" />
        ) : customers.length === 0 ? (
          <div className="celsa-stat-card bg-white p-5 text-center text-muted">
            <i className="bi bi-people fs-1 d-block mb-2" />
            <p>No registered customers found.</p>
          </div>
        ) : (
          <div className="celsa-stat-card bg-white p-3">
            <table className="table table-hover align-middle mb-0">
              <thead className="text-muted small border-bottom">
                <tr>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Registered Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div className="fw-semibold small">{c.name}</div>
                    </td>
                    <td className="small text-muted">{c.email}</td>
                    <td className="small text-muted">{c.phone || "—"}</td>
                    <td className="small text-muted">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className={`badge rounded-pill ${
                          c.isActive ? "bg-success bg-opacity-10 text-success" : "bg-secondary"
                        }`}
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination && pagination.pages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage(page - 1)}>‹</button>
                  </li>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                    </li>
                  ))}
                  <li className={`page-item ${page >= pagination.pages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage(page + 1)}>›</button>
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
