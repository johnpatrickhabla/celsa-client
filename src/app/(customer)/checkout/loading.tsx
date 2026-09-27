export default function Loading() {
  return (
    <div className="container py-5">
      <div className="celsa-skeleton celsa-skeleton-title mb-4" style={{ width: "25%" }} />
      <div className="row g-4">
        <div className="col-lg-7">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="celsa-skeleton celsa-skeleton-row" />
          ))}
        </div>
        <div className="col-lg-5">
          <div className="celsa-skeleton celsa-skeleton-card" style={{ height: "220px" }} />
        </div>
      </div>
    </div>
  );
}
