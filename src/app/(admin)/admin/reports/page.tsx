"use client";

import { useEffect, useState } from "react";
import DashboardTopbar from "@/components/shared/DashboardTopbar";
import api from "@/lib/api";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import type { DashboardReportData } from "@/lib/types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#1f3320", "#b8863b", "#2b5797", "#245a2c", "#842029", "#6f42c1"];

export default function AdminReportsPage() {
  const [reports, setReports] = useState<DashboardReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"sales" | "inventory" | "production" | "customers">("sales");
  const [period, setPeriod] = useState<"monthly" | "weekly" | "daily">("monthly");

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      try {
        const res = await api.get("/dashboard/admin/reports", { params: { period } });
        setReports(res.data);
      } catch (err) {
        console.error("Failed to load reports:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [period]);

  function handlePrint() {
    window.print();
  }

  const totalRevenue = reports?.revenueData?.reduce((acc, curr) => acc + curr.revenue, 0) || 0;
  const totalOrders = reports?.revenueData?.reduce((acc, curr) => acc + curr.orders, 0) || 0;

  return (
    <>
      <DashboardTopbar title="Business Reports &amp; Analytics" roleLabel="Admin" />
      <div className="p-4">
        {/* Top Action Bar & Tabs */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2 print-hide">
          <ul className="nav nav-pills bg-white p-1 rounded-4 shadow-sm border">
            <li className="nav-item">
              <button
                className={`nav-link rounded-3 px-3 py-2 small fw-semibold ${
                  activeTab === "sales" ? "active bg-success text-white" : "text-dark"
                }`}
                onClick={() => setActiveTab("sales")}
              >
                <i className="bi bi-graph-up-arrow me-1" /> Sales &amp; Revenue
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link rounded-3 px-3 py-2 small fw-semibold ${
                  activeTab === "inventory" ? "active bg-success text-white" : "text-dark"
                }`}
                onClick={() => setActiveTab("inventory")}
              >
                <i className="bi bi-box-seam me-1" /> Inventory Status
                {reports?.inventoryReport?.lowStockCount ? (
                  <span className="badge bg-danger ms-2 rounded-pill">
                    {reports.inventoryReport.lowStockCount}
                  </span>
                ) : null}
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link rounded-3 px-3 py-2 small fw-semibold ${
                  activeTab === "production" ? "active bg-success text-white" : "text-dark"
                }`}
                onClick={() => setActiveTab("production")}
              >
                <i className="bi bi-gear me-1" /> Production Activity
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link rounded-3 px-3 py-2 small fw-semibold ${
                  activeTab === "customers" ? "active bg-success text-white" : "text-dark"
                }`}
                onClick={() => setActiveTab("customers")}
              >
                <i className="bi bi-people me-1" /> Customer Activity
              </button>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {activeTab === "sales" && (
              <div className="btn-group btn-group-sm bg-white border rounded-3 p-1 shadow-sm">
                <button
                  className={`btn rounded-2 ${period === "daily" ? "btn-success" : "btn-light border-0"}`}
                  onClick={() => setPeriod("daily")}
                >
                  Daily
                </button>
                <button
                  className={`btn rounded-2 ${period === "weekly" ? "btn-success" : "btn-light border-0"}`}
                  onClick={() => setPeriod("weekly")}
                >
                  Weekly
                </button>
                <button
                  className={`btn rounded-2 ${period === "monthly" ? "btn-success" : "btn-light border-0"}`}
                  onClick={() => setPeriod("monthly")}
                >
                  Monthly
                </button>
              </div>
            )}

            <button className="btn btn-sm btn-outline-dark rounded-3 px-3 shadow-sm" onClick={handlePrint}>
              <i className="bi bi-printer me-1" /> Print Report
            </button>
          </div>
        </div>

        {/* Printable Header (Visible during print) */}
        <div className="d-none d-print-block mb-4 text-center border-bottom pb-3">
          <h3 className="fw-bold mb-1">Celsa Handicrafts Sales Management System</h3>
          <h5 className="text-muted text-uppercase mb-1">
            {activeTab === "sales" && "Sales & Revenue Performance Report"}
            {activeTab === "inventory" && "Inventory Valuation & Low-Stock Status Report"}
            {activeTab === "production" && "Production Workflow & Staff Assignment Report"}
            {activeTab === "customers" && "Customer Activity & Top Buyers Report"}
          </h5>
          <div className="small text-muted">
            Generated on: {new Date().toLocaleString()} | Period: {period}
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton variant="dashboard" />
        ) : (
          <>
            {/* 1. SALES & REVENUE TAB */}
            {activeTab === "sales" && (
              <div>
                {/* Metric summary */}
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="celsa-stat-card bg-white p-4 rounded-4 shadow-sm border">
                      <span className="text-muted small">Total Recorded Revenue</span>
                      <h3 className="fw-bold text-success mt-1 mb-0">₱{totalRevenue.toLocaleString()}</h3>
                      <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                        Across {period} period filter
                      </span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="celsa-stat-card bg-white p-4 rounded-4 shadow-sm border">
                      <span className="text-muted small">Total Paid Transactions</span>
                      <h3 className="fw-bold text-dark mt-1 mb-0">{totalOrders} Orders</h3>
                      <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                        Completed &amp; paid orders
                      </span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="celsa-stat-card bg-white p-4 rounded-4 shadow-sm border">
                      <span className="text-muted small">Average Order Value</span>
                      <h3 className="fw-bold text-dark mt-1 mb-0">
                        ₱{totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00"}
                      </h3>
                      <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                        Per transaction average
                      </span>
                    </div>
                  </div>
                </div>

                <div className="row g-4 mb-4">
                  {/* Revenue Growth Chart */}
                  <div className="col-lg-7">
                    <div className="celsa-stat-card bg-white p-4 h-100 rounded-4 shadow-sm border">
                      <h6 className="fw-bold mb-3">Revenue Over Time</h6>
                      {reports?.revenueData && reports.revenueData.length > 0 ? (
                        <div style={{ width: "100%", height: 300 }}>
                          <ResponsiveContainer>
                            <AreaChart data={reports.revenueData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="_id" style={{ fontSize: "0.75rem" }} />
                              <YAxis style={{ fontSize: "0.75rem" }} />
                              <Tooltip formatter={(val: number) => [`₱${val.toLocaleString()}`, "Revenue"]} />
                              <Area type="monotone" dataKey="revenue" stroke="#1f3320" fill="#1f3320" fillOpacity={0.2} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="text-center text-muted py-5">No revenue records found for this period.</div>
                      )}
                    </div>
                  </div>

                  {/* Best Sellers Chart */}
                  <div className="col-lg-5">
                    <div className="celsa-stat-card bg-white p-4 h-100 rounded-4 shadow-sm border">
                      <h6 className="fw-bold mb-3">Top Selling Handicrafts</h6>
                      {reports?.bestSellers && reports.bestSellers.length > 0 ? (
                        <div style={{ width: "100%", height: 300 }}>
                          <ResponsiveContainer>
                            <BarChart data={reports.bestSellers} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                              <XAxis type="number" style={{ fontSize: "0.75rem" }} />
                              <YAxis dataKey="_id" type="category" width={100} style={{ fontSize: "0.7rem" }} />
                              <Tooltip formatter={(val: number) => [`${val} units sold`, "Volume"]} />
                              <Bar dataKey="totalSold" fill="#b8863b" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="text-center text-muted py-5">No sales volume data available.</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Best Sellers Breakdown Table */}
                <div className="celsa-stat-card bg-white p-4 rounded-4 shadow-sm border">
                  <h6 className="fw-bold mb-3">Best-Selling Products Breakdown</h6>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 small">
                      <thead className="table-light">
                        <tr>
                          <th>Rank</th>
                          <th>Product Name</th>
                          <th>Units Sold</th>
                          <th className="text-end">Total Revenue Generated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports?.bestSellers?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="fw-bold">#{idx + 1}</td>
                            <td>{item._id}</td>
                            <td>{item.totalSold} pcs</td>
                            <td className="text-end fw-bold text-success">₱{item.revenue.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. INVENTORY REPORT TAB */}
            {activeTab === "inventory" && (
              <div>
                <div className="row g-3 mb-4">
                  <div className="col-md-3">
                    <div className="celsa-stat-card bg-white p-3 rounded-4 shadow-sm border">
                      <span className="text-muted small">Total Catalog Products</span>
                      <h4 className="fw-bold text-dark mt-1 mb-0">{reports?.inventoryReport?.totalProducts || 0}</h4>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="celsa-stat-card bg-white p-3 rounded-4 shadow-sm border">
                      <span className="text-muted small">Total Stock Units on Hand</span>
                      <h4 className="fw-bold text-dark mt-1 mb-0">{reports?.inventoryReport?.totalInventoryUnits || 0} units</h4>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="celsa-stat-card bg-white p-3 rounded-4 shadow-sm border">
                      <span className="text-muted small">Total Stock Inventory Value</span>
                      <h4 className="fw-bold text-success mt-1 mb-0">
                        ₱{reports?.inventoryReport?.totalInventoryValue?.toLocaleString() || "0.00"}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="celsa-stat-card bg-white p-3 rounded-4 shadow-sm border">
                      <span className="text-muted small">Low-Stock Alert Items</span>
                      <h4 className="fw-bold text-danger mt-1 mb-0">
                        {reports?.inventoryReport?.lowStockCount || 0} Products
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="celsa-stat-card bg-white p-4 rounded-4 shadow-sm border">
                  <h6 className="fw-bold mb-3">Inventory Status &amp; Stock Levels</h6>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 small">
                      <thead className="table-light">
                        <tr>
                          <th>Product Name</th>
                          <th>Category</th>
                          <th>Current Stock</th>
                          <th>Threshold</th>
                          <th>Unit Price</th>
                          <th>Stock Valuation</th>
                          <th>Stock Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports?.inventoryReport?.items?.map((item) => (
                          <tr key={item._id} className={item.isLowStock ? "table-warning" : ""}>
                            <td className="fw-semibold text-dark">{item.name}</td>
                            <td>{item.categoryName}</td>
                            <td className="fw-bold">{item.stock} pcs</td>
                            <td className="text-muted">{item.lowStockThreshold} pcs</td>
                            <td>₱{item.basePrice.toFixed(2)}</td>
                            <td className="fw-bold text-success">₱{item.totalValue.toFixed(2)}</td>
                            <td>
                              {item.isLowStock ? (
                                <span className="badge bg-danger">
                                  <i className="bi bi-exclamation-triangle me-1" /> Low Stock
                                </span>
                              ) : (
                                <span className="badge bg-success">Optimal</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. PRODUCTION REPORT TAB */}
            {activeTab === "production" && (
              <div>
                <div className="row g-3 mb-4">
                  <div className="col-md-3">
                    <div className="celsa-stat-card bg-white p-3 rounded-4 shadow-sm border">
                      <span className="text-muted small">Pending Confirmation</span>
                      <h4 className="fw-bold text-warning mt-1 mb-0">{reports?.productionReport?.totalPending || 0}</h4>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="celsa-stat-card bg-white p-3 rounded-4 shadow-sm border">
                      <span className="text-muted small">Currently in Production</span>
                      <h4 className="fw-bold text-primary mt-1 mb-0">{reports?.productionReport?.totalInProduction || 0}</h4>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="celsa-stat-card bg-white p-3 rounded-4 shadow-sm border">
                      <span className="text-muted small">Shipped / Dispatched</span>
                      <h4 className="fw-bold text-info mt-1 mb-0">{reports?.productionReport?.totalShipped || 0}</h4>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="celsa-stat-card bg-white p-3 rounded-4 shadow-sm border">
                      <span className="text-muted small">Completed Deliveries</span>
                      <h4 className="fw-bold text-success mt-1 mb-0">{reports?.productionReport?.totalCompleted || 0}</h4>
                    </div>
                  </div>
                </div>

                <div className="row g-4">
                  {/* Staff Task Assignment */}
                  <div className="col-lg-8">
                    <div className="celsa-stat-card bg-white p-4 rounded-4 shadow-sm border h-100">
                      <h6 className="fw-bold mb-3">Staff Production &amp; Fulfillment Workload</h6>
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0 small">
                          <thead className="table-light">
                            <tr>
                              <th>Staff Artisan</th>
                              <th>Email</th>
                              <th>Active Tasks</th>
                              <th>Completed Tasks</th>
                              <th>Workload Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reports?.productionReport?.staffWorkload?.map((s) => (
                              <tr key={s.staffId}>
                                <td className="fw-semibold text-dark">{s.name}</td>
                                <td className="text-muted">{s.email}</td>
                                <td>
                                  <span className="badge bg-warning text-dark font-monospace">
                                    {s.activeCount} active
                                  </span>
                                </td>
                                <td>
                                  <span className="badge bg-success font-monospace">
                                    {s.completedCount} done
                                  </span>
                                </td>
                                <td>
                                  {s.activeCount > 5 ? (
                                    <span className="badge bg-danger">Heavy Load</span>
                                  ) : s.activeCount > 0 ? (
                                    <span className="badge bg-primary">Normal</span>
                                  ) : (
                                    <span className="badge bg-secondary">Available</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Orders Status Distribution */}
                  <div className="col-lg-4">
                    <div className="celsa-stat-card bg-white p-4 rounded-4 shadow-sm border h-100">
                      <h6 className="fw-bold mb-3">Orders by Status Distribution</h6>
                      <div style={{ width: "100%", height: 260 }}>
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={reports?.productionReport?.ordersByStatus || []}
                              dataKey="count"
                              nameKey="_id"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                              style={{ fontSize: "0.7rem" }}
                            >
                              {reports?.productionReport?.ordersByStatus?.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. CUSTOMER REPORT TAB */}
            {activeTab === "customers" && (
              <div>
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="celsa-stat-card bg-white p-4 rounded-4 shadow-sm border">
                      <span className="text-muted small">Registered Customers</span>
                      <h3 className="fw-bold text-dark mt-1 mb-0">{reports?.customerReport?.totalCustomersCount || 0}</h3>
                      <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                        Active accounts
                      </span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="celsa-stat-card bg-white p-4 rounded-4 shadow-sm border">
                      <span className="text-muted small">Top Spender Value</span>
                      <h3 className="fw-bold text-success mt-1 mb-0">
                        ₱{reports?.customerReport?.topCustomers?.[0]?.totalSpent?.toLocaleString() || "0.00"}
                      </h3>
                      <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                        Leading customer total
                      </span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="celsa-stat-card bg-white p-4 rounded-4 shadow-sm border">
                      <span className="text-muted small">Top Customer Orders</span>
                      <h3 className="fw-bold text-dark mt-1 mb-0">
                        {reports?.customerReport?.topCustomers?.[0]?.orderCount || 0} Orders
                      </h3>
                      <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                        Most frequent buyer
                      </span>
                    </div>
                  </div>
                </div>

                <div className="celsa-stat-card bg-white p-4 rounded-4 shadow-sm border">
                  <h6 className="fw-bold mb-3">Top Customers &amp; Purchasing Activity</h6>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 small">
                      <thead className="table-light">
                        <tr>
                          <th>Rank</th>
                          <th>Customer Name</th>
                          <th>Email Address</th>
                          <th>Phone</th>
                          <th>Total Orders</th>
                          <th>Last Purchase</th>
                          <th className="text-end">Total Spending</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports?.customerReport?.topCustomers?.map((c, idx) => (
                          <tr key={c._id || idx}>
                            <td className="fw-bold">#{idx + 1}</td>
                            <td className="fw-semibold text-dark">{c.name}</td>
                            <td className="text-muted">{c.email}</td>
                            <td className="text-muted">{c.phone || "N/A"}</td>
                            <td>
                              <span className="badge bg-light text-dark border">{c.orderCount} orders</span>
                            </td>
                            <td>{c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : "N/A"}</td>
                            <td className="text-end fw-bold text-success">₱{c.totalSpent.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .print-hide,
          .celsa-sidebar,
          .celsa-topbar {
            display: none !important;
          }
          body {
            background-color: #fff !important;
            color: #000 !important;
          }
          .celsa-stat-card {
            box-shadow: none !important;
            border: 1px solid #ccc !important;
          }
          .table {
            font-size: 11px !important;
          }
        }
      `}</style>
    </>
  );
}
