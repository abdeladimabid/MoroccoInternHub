"use client";

export function SkeletonCard() {
  return (
    <div
      className="glass-card"
      style={{ padding: "20px" }}
      aria-hidden="true"
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          marginBottom: "14px",
        }}
      >
        <div
          className="skeleton"
          style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <div
            className="skeleton"
            style={{ height: 16, width: "70%", marginBottom: 8 }}
          />
          <div className="skeleton" style={{ height: 12, width: "45%" }} />
        </div>
      </div>

      {/* Badges row */}
      <div
        style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}
      >
        <div
          className="skeleton"
          style={{ height: 22, width: 72, borderRadius: 100 }}
        />
        <div
          className="skeleton"
          style={{ height: 22, width: 80, borderRadius: 100 }}
        />
        <div
          className="skeleton"
          style={{ height: 22, width: 50, borderRadius: 100 }}
        />
      </div>

      {/* Meta row */}
      <div
        style={{ display: "flex", gap: 14, marginBottom: 14 }}
      >
        <div
          className="skeleton"
          style={{ height: 12, width: 90, borderRadius: 6 }}
        />
        <div
          className="skeleton"
          style={{ height: 12, width: 60, borderRadius: 6 }}
        />
      </div>

      {/* Stack row */}
      <div
        style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}
      >
        {[50, 60, 40].map((w, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: 20, width: w, borderRadius: 100 }}
          />
        ))}
      </div>

      {/* Apply button skeleton */}
      <div
        className="skeleton"
        style={{ height: 36, borderRadius: 8 }}
      />
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "16px",
      }}
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
