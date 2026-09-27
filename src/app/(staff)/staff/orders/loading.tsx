export default function Loading() {
  return (
    <div className="p-4">
      <div className="celsa-skeleton celsa-skeleton-title mb-4" style={{ width: "20%" }} />
      <div className="celsa-skeleton celsa-skeleton-row" style={{ width: "100%" }} />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="celsa-skeleton celsa-skeleton-row" />
      ))}
    </div>
  );
}
