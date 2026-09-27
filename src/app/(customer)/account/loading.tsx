export default function Loading() {
  return (
    <div className="container py-5" style={{ maxWidth: "720px" }}>
      <div className="celsa-skeleton celsa-skeleton-title mb-4" />
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="celsa-skeleton celsa-skeleton-row" />
          ))}
        </div>
      </div>
    </div>
  );
}
