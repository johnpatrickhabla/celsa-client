export default function Loading() {
  return (
    <div className="p-4">
      <div className="celsa-skeleton celsa-skeleton-title mb-4" style={{ width: "30%" }} />
      <div className="row g-3 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="col-md-3">
            <div className="celsa-skeleton celsa-skeleton-card" />
          </div>
        ))}
      </div>
      <div className="celsa-skeleton" style={{ height: "300px", borderRadius: "0.6rem" }} />
    </div>
  );
}
