type Status =
  | "pending"
  | "confirmed"
  | "processing"
  | "in-progress"
  | "shipped"
  | "completed"
  | "cancelled";

const CLASS_MAP: Record<Status, string> = {
  pending: "celsa-badge-pending",
  confirmed: "bg-primary bg-opacity-10 text-primary border border-primary",
  processing: "celsa-badge-progress",
  "in-progress": "celsa-badge-progress",
  shipped: "bg-info bg-opacity-10 text-info border border-info",
  completed: "celsa-badge-completed",
  cancelled: "bg-danger bg-opacity-10 text-danger border border-danger",
};

const LABEL_MAP: Record<Status, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "In Production",
  "in-progress": "In Progress",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function StatusBadge({ status }: { status: Status | string }) {
  const normalizedStatus = (status in CLASS_MAP ? status : "pending") as Status;

  return (
    <span className={`badge rounded-pill px-3 py-1 fw-normal ${CLASS_MAP[normalizedStatus]}`}>
      {LABEL_MAP[normalizedStatus] || normalizedStatus}
    </span>
  );
}
