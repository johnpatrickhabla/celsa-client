import DashboardSidebar from "@/components/shared/DashboardSidebar";
import { STAFF_NAV } from "@/lib/nav-config";

// /staff/* is gated in src/middleware.ts. Staff has no Reports or
// Staff-Account-Management access, so those items are simply absent
// from STAFF_NAV rather than shown-and-disabled.
export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="d-flex">
      <DashboardSidebar
        items={STAFF_NAV}
        variant="staff"
        userName="Staff User"
        userSubtitle="Production Staff"
      />
      <div className="flex-grow-1 bg-light" style={{ minHeight: "100vh" }}>
        {children}
      </div>
    </div>
  );
}
