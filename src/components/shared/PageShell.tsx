import DashboardTopbar from "@/components/shared/DashboardTopbar";

interface Props {
  title: string;
  roleLabel: "Admin" | "Staff";
  description: string;
  children?: React.ReactNode;
}

/**
 * Scaffold shell for a module page. Swap the placeholder body for the
 * real table/form/chart once the matching Express endpoint exists.
 */
export default function PageShell({ title, roleLabel, description, children }: Props) {
  return (
    <>
      <DashboardTopbar title={title} roleLabel={roleLabel} />
      <div className="p-4">
        {children ?? (
          <div className="celsa-stat-card bg-white p-4 text-muted">
            {description}
          </div>
        )}
      </div>
    </>
  );
}
