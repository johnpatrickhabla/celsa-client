"use client";

import { useEffect, useState } from "react";
import DashboardTopbar from "@/components/shared/DashboardTopbar";
import api from "@/lib/api";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import type { User } from "@/lib/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"staff" | "admin">("staff");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function fetchStaffUsers() {
    setLoading(true);
    try {
      const res = await api.get("/users");
      const all: User[] = res.data.users || [];
      // Filter staff and admin users
      setUsers(all.filter((u) => u.role === "staff" || u.role === "admin"));
    } catch (err) {
      console.error("Failed to load staff accounts:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStaffUsers();
  }, []);

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await api.post("/users", { name, email, password, phone, role });
      setSuccess(`Account created for ${name} (${role})`);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      fetchStaffUsers();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: { error: string } } }).response?.data?.error
          : "Failed to create account.";
      setError(msg || "Failed to create account.");
    }
  }

  async function toggleUserActive(user: User) {
    try {
      await api.put(`/users/${user._id}`, { isActive: !user.isActive });
      fetchStaffUsers();
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  }

  return (
    <>
      <DashboardTopbar title="Staff Account Management" roleLabel="Admin" />
      <div className="p-4" style={{ maxWidth: 960 }}>
        <div className="row g-4">
          {/* Create Staff Form */}
          <div className="col-md-5">
            <div className="celsa-stat-card bg-white p-4">
              <h6 className="fw-bold mb-3">Provision Staff / Admin Account</h6>
              <p className="text-muted small">
                Per security rules, staff accounts cannot self-register. Provision them here directly.
              </p>

              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              {success && <div className="alert alert-success py-2 small">{success}</div>}

              <form onSubmit={handleCreateUser}>
                <div className="mb-3">
                  <label className="form-label small">Full Name *</label>
                  <input
                    className="form-control form-control-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small">Email Address *</label>
                  <input
                    type="email"
                    className="form-control form-control-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small">Initial Password *</label>
                  <input
                    type="password"
                    className="form-control form-control-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small">Phone Number</label>
                  <input
                    className="form-control form-control-sm"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small">Role *</label>
                  <select
                    className="form-select form-select-sm"
                    value={role}
                    onChange={(e) => setRole(e.target.value as "staff" | "admin")}
                  >
                    <option value="staff">Production Staff</option>
                    <option value="admin">Super Administrator</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-sm btn-success w-100">
                  Provision Account
                </button>
              </form>
            </div>
          </div>

          {/* Accounts List */}
          <div className="col-md-7">
            <div className="celsa-stat-card bg-white p-3">
              <h6 className="fw-bold mb-3">System Staff &amp; Admins</h6>

              {loading ? (
                <LoadingSkeleton variant="table" />
              ) : users.length === 0 ? (
                <div className="text-muted small py-3 text-center">No staff accounts provisioned yet.</div>
              ) : (
                <table className="table table-hover align-middle mb-0">
                  <thead className="text-muted small border-bottom">
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <div className="fw-semibold small">{u.name}</div>
                          <div className="text-muted" style={{ fontSize: "0.7rem" }}>{u.email}</div>
                        </td>
                        <td>
                          <span
                            className={`badge text-uppercase ${
                              u.role === "admin" ? "bg-success" : "bg-warning text-dark"
                            }`}
                            style={{ fontSize: "0.65rem" }}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge rounded-pill ${
                              u.isActive ? "bg-success bg-opacity-10 text-success" : "bg-secondary"
                            }`}
                          >
                            {u.isActive ? "Active" : "Deactivated"}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            className={`btn btn-sm ${u.isActive ? "btn-outline-danger" : "btn-outline-success"}`}
                            style={{ fontSize: "0.7rem" }}
                            onClick={() => toggleUserActive(u)}
                          >
                            {u.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
