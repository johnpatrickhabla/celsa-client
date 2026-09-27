export default function Loading() {
  return (
    <div className="container py-5">
      <div className="celsa-skeleton celsa-skeleton-title mb-4" style={{ width: "25%" }} />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="celsa-skeleton celsa-skeleton-row" />
      ))}
    </div>
  );
}
