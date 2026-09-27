export default function Loading() {
  return (
    <div className="container py-5">
      <div className="celsa-skeleton celsa-skeleton-title mb-4" style={{ width: "35%" }} />
      <div className="celsa-skeleton celsa-skeleton-line" style={{ width: "70%" }} />
      <div className="celsa-skeleton celsa-skeleton-line mb-4" style={{ width: "50%" }} />
      <div className="celsa-skeleton celsa-skeleton-card mb-3" style={{ height: "200px" }} />
      <div className="row g-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="col-md-4">
            <div className="celsa-skeleton celsa-skeleton-card" />
          </div>
        ))}
      </div>
    </div>
  );
}
