"use client";

import { useState } from "react";
import DashboardTopbar from "@/components/shared/DashboardTopbar";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <>
      <DashboardTopbar title="System Settings" roleLabel="Admin" />
      <div className="p-4" style={{ maxWidth: 720 }}>
        <div className="celsa-stat-card bg-white p-4">
          <h6 className="fw-bold mb-3">Business &amp; System Configuration</h6>

          {saved && (
            <div className="alert alert-success py-2 small mb-3">
              Settings updated successfully!
            </div>
          )}

          <form onSubmit={handleSave}>
            <div className="mb-3">
              <label className="form-label small">Store / Business Name</label>
              <input className="form-control form-control-sm" defaultValue="Celsa Handicrafts" />
            </div>

            <div className="mb-3">
              <label className="form-label small">Contact Email</label>
              <input className="form-control form-control-sm" defaultValue="celsahandicrafts@gmail.com" />
            </div>

            <div className="mb-3">
              <label className="form-label small">Contact Phone</label>
              <input className="form-control form-control-sm" defaultValue="+63 912 345 6789" />
            </div>

            <div className="mb-4">
              <label className="form-label small">Physical Store Address</label>
              <input className="form-control form-control-sm" defaultValue="Poblacion Centro, Barangay, Alcala, Philippines" />
            </div>

            <h6 className="fw-bold mb-3 border-top pt-3">Payment Gateways &amp; Methods</h6>

            <div className="form-check form-switch mb-2">
              <input className="form-check-input" type="checkbox" id="codCheck" defaultChecked />
              <label className="form-check-label small" htmlFor="codCheck">
                Enable Cash on Delivery (COD) for regular full-payment purchases
              </label>
            </div>

            <div className="form-check form-switch mb-2">
              <input className="form-check-input" type="checkbox" id="gcashCheck" defaultChecked />
              <label className="form-check-label small" htmlFor="gcashCheck">
                Enable GCash Payment (via PayMongo/Xendit)
              </label>
            </div>

            <div className="form-check form-switch mb-2">
              <input className="form-check-input" type="checkbox" id="stripeCheck" defaultChecked />
              <label className="form-check-label small" htmlFor="stripeCheck">
                Enable Stripe (Credit/Debit Card)
              </label>
            </div>

            <div className="form-check form-switch mb-4">
              <input className="form-check-input" type="checkbox" id="paypalCheck" defaultChecked />
              <label className="form-check-label small" htmlFor="paypalCheck">
                Enable PayPal Integration
              </label>
            </div>

            <button type="submit" className="btn btn-success btn-sm">
              Save Configuration
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
