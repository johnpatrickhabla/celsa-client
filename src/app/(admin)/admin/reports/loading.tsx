export default function Loading() {
  return (
    <div className="p-4">
      <div className="celsa-skeleton celsa-skeleton-title mb-4" style={{ width: "20%" }} />
      <div className="row g-3 mb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="col-md-4">
            <div className="celsa-skeleton celsa-skeleton-card" />
          </div>
        ))}
      </div>
      <div className="celsa-skeleton" style={{ height: "280px", borderRadius: "0.6rem" }} />
    </div>
  );
}
