import DashboardSidebar from "@/components/shared/DashboardSidebar";
import { ADMIN_NAV } from "@/lib/nav-config";

// Route protection for /admin/* is handled in src/middleware.ts (RBAC).
// This layout assumes it only ever renders for an authenticated admin.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="d-flex">
      <DashboardSidebar
        items={ADMIN_NAV}
        variant="admin"
        userName="Admin"
        userSubtitle="Super Administrator"
      />
      <div className="flex-grow-1 bg-light" style={{ minHeight: "100vh" }}>
        {children}
      </div>
    </div>
  );
}
