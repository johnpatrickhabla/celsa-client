"use client";

import { useEffect, useState } from "react";
import DashboardTopbar from "@/components/shared/DashboardTopbar";
import api from "@/lib/api";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import type { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await api.get("/categories");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function handleEdit(cat: Category) {
    setEditingId(cat._id);
    setName(cat.name);
    setDescription(cat.description || "");
    setError(null);
  }

  function handleCancel() {
    setEditingId(null);
    setName("");
    setDescription("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, { name, description });
      } else {
        await api.post("/categories", { name, description });
      }
      handleCancel();
      fetchCategories();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: { error: string } } }).response?.data?.error
          : "Failed to save category.";
      setError(msg || "Failed to save category.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Deactivate this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  }

  return (
    <>
      <DashboardTopbar title="Categories Management" roleLabel="Admin" />
      <div className="p-4" style={{ maxWidth: 880 }}>
        <div className="row g-4">
          {/* Category Form */}
          <div className="col-md-5">
            <div className="celsa-stat-card bg-white p-4">
              <h6 className="fw-bold mb-3">
                {editingId ? "Edit Category" : "Add New Category"}
              </h6>

              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small">Category Name *</label>
                  <input
                    className="form-control form-control-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small">Description</label>
                  <textarea
                    className="form-control form-control-sm"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="d-flex gap-2">
                  {editingId && (
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary w-50"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="btn btn-sm btn-success flex-grow-1">
                    {editingId ? "Update Category" : "Add Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Categories List */}
          <div className="col-md-7">
            <div className="celsa-stat-card bg-white p-3">
              <h6 className="fw-bold mb-3">Existing Categories</h6>

              {loading ? (
                <LoadingSkeleton variant="table" />
              ) : categories.length === 0 ? (
                <div className="text-muted small py-3 text-center">No categories created yet.</div>
              ) : (
                <table className="table table-hover align-middle mb-0">
                  <thead className="text-muted small border-bottom">
                    <tr>
                      <th>Name</th>
                      <th>Slug</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c._id}>
                        <td>
                          <div className="fw-semibold small">{c.name}</div>
                          {c.description && <div className="text-muted" style={{ fontSize: "0.7rem" }}>{c.description}</div>}
                        </td>
                        <td className="text-muted small">{c.slug}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-light border me-1"
                            onClick={() => handleEdit(c)}
                          >
                            <i className="bi bi-pencil" />
                          </button>
                          <button
                            className="btn btn-sm btn-light border text-danger"
                            onClick={() => handleDelete(c._id)}
                          >
                            <i className="bi bi-trash" />
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
