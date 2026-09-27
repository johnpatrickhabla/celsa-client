export default function Loading() {
  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-md-6">
          <div className="celsa-skeleton" style={{ height: "350px", borderRadius: "0.75rem" }} />
        </div>
        <div className="col-md-6">
          <div className="celsa-skeleton celsa-skeleton-title mb-3" style={{ width: "60%" }} />
          <div className="celsa-skeleton celsa-skeleton-line" style={{ width: "30%" }} />
          <div className="celsa-skeleton celsa-skeleton-line mt-3" style={{ width: "100%" }} />
          <div className="celsa-skeleton celsa-skeleton-line" style={{ width: "90%" }} />
          <div className="celsa-skeleton celsa-skeleton-line" style={{ width: "75%" }} />
          <div className="celsa-skeleton celsa-skeleton-row mt-4" style={{ width: "40%", height: "2.8rem" }} />
        </div>
      </div>
    </div>
  );
}
