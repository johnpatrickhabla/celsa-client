export default function Loading() {
  return (
    <div className="container py-5">
      <div className="celsa-skeleton celsa-skeleton-title mb-4" style={{ width: "20%" }} />
      <div className="row g-4">
        <div className="col-lg-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="celsa-skeleton celsa-skeleton-row mb-3" style={{ height: "5rem" }} />
          ))}
        </div>
        <div className="col-lg-4">
          <div className="celsa-skeleton celsa-skeleton-card" style={{ height: "180px" }} />
        </div>
      </div>
    </div>
  );
}
