export default function Loading() {
  return (
    <div className="container py-5">
      <div className="celsa-skeleton celsa-skeleton-title mb-4" style={{ width: "30%" }} />
      <div className="celsa-skeleton celsa-skeleton-line" style={{ width: "100%" }} />
      <div className="celsa-skeleton celsa-skeleton-line" style={{ width: "90%" }} />
      <div className="celsa-skeleton celsa-skeleton-line" style={{ width: "95%" }} />
      <div className="celsa-skeleton celsa-skeleton-line mb-4" style={{ width: "60%" }} />
      <div className="celsa-skeleton" style={{ height: "250px", borderRadius: "0.75rem" }} />
    </div>
  );
}
