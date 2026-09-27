export default function Loading() {
  return (
    <div className="container py-5">
      <div className="celsa-skeleton celsa-skeleton-title mb-4" style={{ width: "25%" }} />
      <div className="row g-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="col-6 col-md-4 col-lg-3">
            <div className="celsa-skeleton celsa-skeleton-card mb-2" style={{ height: "200px" }} />
            <div className="celsa-skeleton celsa-skeleton-line" style={{ width: "70%" }} />
            <div className="celsa-skeleton celsa-skeleton-line" style={{ width: "40%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
