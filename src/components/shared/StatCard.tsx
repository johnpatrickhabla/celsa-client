import Link from "next/link";

interface Props {
  icon: string;
  label: string;
  value: string | number;
  hint?: string;
  bgColor?: "bg-primary" | "bg-success" | "bg-warning" | "bg-danger" | "bg-info";
  href?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  hint,
  bgColor = "bg-success",
  href,
}: Props) {
  return (
    <div className={`small-box ${bgColor} text-white rounded-3 shadow-sm p-3 position-relative overflow-hidden flex-fill`}>
      <div className="inner position-relative" style={{ zIndex: 2 }}>
        <h3 className="fw-bold mb-1">{value}</h3>
        <p className="mb-0 fw-semibold opacity-90" style={{ fontSize: "0.875rem" }}>
          {label}
        </p>
        {hint && (
          <small className="d-block mt-1 opacity-75" style={{ fontSize: "0.75rem" }}>
            {hint}
          </small>
        )}
      </div>

      <div
        className="icon position-absolute top-50 end-0 translate-middle-y me-3 opacity-25"
        style={{ fontSize: "4rem", zIndex: 1 }}
      >
        <i className={`bi ${icon}`} />
      </div>

      {href && (
        <Link
          href={href}
          className="small-box-footer d-block text-white text-opacity-75 text-decoration-none small text-center mt-3 pt-2 border-top border-white border-opacity-25"
          style={{ zIndex: 2, position: "relative" }}
        >
          More info <i className="bi bi-arrow-right-circle ms-1" />
        </Link>
      )}
    </div>
  );
}
