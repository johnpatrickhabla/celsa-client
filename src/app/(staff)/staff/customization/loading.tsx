export default function Loading() {
  return (
    <div className="p-4">
      <div className="celsa-skeleton celsa-skeleton-title mb-4" style={{ width: "30%" }} />
      <div className="row g-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="col-md-4">
            <div className="celsa-skeleton celsa-skeleton-card" />
          </div>
        ))}
      </div>
    </div>
  );
}
