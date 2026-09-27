"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "@/lib/nav-config";
import { useSidebarStore } from "@/stores/sidebarStore";

interface Props {
  items: NavItem[];
  variant: "admin" | "staff";
  userName: string;
  userSubtitle: string;
}

export default function DashboardSidebar({ items, variant, userName, userSubtitle }: Props) {
  const pathname = usePathname();
  const { isOpen } = useSidebarStore();

  return (
    <aside
      className="app-sidebar shadow bg-dark text-white"
      style={{
        width: isOpen ? 250 : 0,
        minWidth: isOpen ? 250 : 0,
        maxWidth: isOpen ? 250 : 0,
        minHeight: "100vh",
        backgroundColor: "#1e293b",
        borderRight: isOpen ? "1px solid rgba(255,255,255,0.08)" : "none",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        flexShrink: 0,
        visibility: isOpen ? "visible" : "hidden",
        opacity: isOpen ? 1 : 0,
      }}
      data-bs-theme="dark"
    >
      <div style={{ width: 250 }}>
        {/* Brand Header */}
        <div className="brand-link px-4 py-3 d-flex align-items-center gap-2 border-bottom border-secondary border-opacity-25">
          <i className="bi bi-flower1 fs-3 text-warning" />
          <div>
            <span className="brand-text fw-bold fs-5 text-uppercase" style={{ letterSpacing: 1 }}>
              CELSA
            </span>
            <span className="d-block text-muted" style={{ fontSize: "0.65rem", marginTop: "-3px" }}>
              {variant === "admin" ? "Admin Portal" : "Staff Operations"}
            </span>
          </div>
        </div>

        {/* Sidebar User Panel */}
        <div className="user-panel px-3 py-3 d-flex align-items-center gap-3 border-bottom border-secondary border-opacity-25">
          <div
            className="rounded-circle bg-success bg-opacity-25 text-success d-flex align-items-center justify-content-center fw-bold"
            style={{ width: 38, height: 38, fontSize: "0.9rem" }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="info overflow-hidden">
            <span className="d-block fw-semibold text-truncate small mb-0 text-white">{userName}</span>
            <small className="text-muted" style={{ fontSize: "0.7rem" }}>
              {userSubtitle}
            </small>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="sidebar-wrapper p-2 flex-grow-1">
          <nav className="mt-2">
            <ul className="nav nav-pills flex-column gap-1">
              <li className="nav-header text-uppercase px-3 py-1 text-muted fw-bold" style={{ fontSize: "0.65rem" }}>
                MAIN NAVIGATION
              </li>
              {items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin" && item.href !== "/staff" && pathname.startsWith(item.href));
                return (
                  <li key={item.href} className="nav-item">
                    <Link
                      href={item.href}
                      className={`nav-link d-flex align-items-center gap-3 rounded-3 px-3 py-2 text-decoration-none transition-all ${
                        active
                          ? "active bg-success text-white shadow-sm fw-semibold"
                          : "text-light opacity-75 hover-opacity-100"
                      }`}
                      style={{ fontSize: "0.875rem" }}
                    >
                      <i className={`bi ${item.icon} fs-6`} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
}
