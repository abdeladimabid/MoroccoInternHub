"use client";

import { Database, Globe, Clock, CheckCircle } from "lucide-react";

interface StatsBarProps {
  total: number;
  sources: string[];
  scrapedAt: string | null;
  cached: boolean;
  errors: string[];
}

function timeAgoFromISO(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  return `il y a ${Math.floor(hours / 24)}j`;
}

export function StatsBar({ total, sources, scrapedAt, cached, errors }: StatsBarProps) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        alignItems: "center",
      }}
    >
      {/* Total jobs */}
      <span className="stat-pill">
        <Database size={13} style={{ color: "#818cf8" }} />
        <strong style={{ color: "var(--text-primary)" }}>{total}</strong>
        &nbsp;offres trouvées
      </span>

      {/* Sources */}
      {sources.length > 0 && !sources.includes("cache") && (
        <span className="stat-pill">
          <Globe size={13} style={{ color: "#34d399" }} />
          {sources.filter(s => !s.includes("cache")).join(", ")}
        </span>
      )}

      {/* Last updated */}
      {scrapedAt && (
        <span className="stat-pill">
          <Clock size={13} style={{ color: "#fcd34d" }} />
          {timeAgoFromISO(scrapedAt)}
        </span>
      )}

      {/* Cached indicator */}
      {cached && (
        <span className="stat-pill" style={{ borderColor: "rgba(16,185,129,0.2)" }}>
          <CheckCircle size={13} style={{ color: "#34d399" }} />
          <span style={{ color: "#34d399" }}>Mis en cache</span>
        </span>
      )}

      {/* Errors (collapsed) */}
      {errors.length > 0 && (
        <span
          className="stat-pill"
          title={errors.join("\n")}
          style={{
            borderColor: "rgba(239,68,68,0.2)",
            cursor: "help",
          }}
        >
          <span style={{ color: "#fca5a5", fontSize: 11 }}>
            ⚠️ {errors.length} source{errors.length > 1 ? "s" : ""} indisponible
          </span>
        </span>
      )}
    </div>
  );
}
