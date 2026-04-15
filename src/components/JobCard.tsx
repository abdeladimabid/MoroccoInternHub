"use client";

import { JobListing } from "@/lib/types";
import {
  MapPin,
  Building2,
  Clock,
  ExternalLink,
  Zap,
  Globe,
} from "lucide-react";

interface JobCardProps {
  job: JobListing;
  index: number;
}

const CONTRACT_LABELS: Record<string, string> = {
  remote: "🌐 Remote",
  hybrid: "⚡ Hybrid",
  onsite: "🏢 On-site",
  unknown: "📍 TBD",
};

const CONTRACT_CLASS: Record<string, string> = {
  remote: "badge-remote",
  hybrid: "badge-hybrid",
  onsite: "badge-onsite",
  unknown: "badge-onsite",
};

const SOURCE_CLASS: Record<string, string> = {
  "Stage.ma": "source-stage",
  Rekrute: "source-rekrute",
  "Khdma.ma": "source-khdma",
  "Emploi.ma": "source-emploi",
  Indeed: "source-indeed",
};

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}j`;
  if (hours > 0) return `${hours}h`;
  return `${mins}min`;
}

function getCompanyInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #667eea, #764ba2)",
  "linear-gradient(135deg, #f093fb, #f5576c)",
  "linear-gradient(135deg, #4facfe, #00f2fe)",
  "linear-gradient(135deg, #43e97b, #38f9d7)",
  "linear-gradient(135deg, #fa709a, #fee140)",
  "linear-gradient(135deg, #a18cd1, #fbc2eb)",
  "linear-gradient(135deg, #ffecd2, #fcb69f)",
  "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
];

function getGradient(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

export function JobCard({ job, index }: JobCardProps) {
  const staggerClass = `stagger-${Math.min(index + 1, 6)}`;
  const sourceClass = SOURCE_CLASS[job.source] || "source-stage";

  return (
    <article
      className={`glass-card animate-fade-in-up ${staggerClass}`}
      style={{ padding: "20px", opacity: 0 }}
      aria-label={`Offre: ${job.title} chez ${job.company}`}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
        {/* Company avatar */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: getGradient(job.company),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 15,
            color: "white",
            flexShrink: 0,
            letterSpacing: "0.05em",
          }}
        >
          {getCompanyInitials(job.company)}
        </div>

        {/* Title + company */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: 1.3,
              marginBottom: 4,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={job.title}
          >
            {job.title}
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "var(--text-secondary)",
              fontSize: 13,
            }}
          >
            <Building2 size={12} />
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 160,
              }}
            >
              {job.company}
            </span>
          </div>
        </div>

        {/* NEW badge */}
        {job.isNew && (
          <span className="badge badge-new" style={{ flexShrink: 0 }}>
            <Zap size={10} />
            NEW
          </span>
        )}
      </div>

      {/* Meta chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 14,
        }}
      >
        <span className="badge badge-source" style={{ fontSize: 11 }}>
          <span
            className={`badge ${sourceClass}`}
            style={{ padding: "2px 8px", border: "none", background: "transparent" }}
          >
            {job.source}
          </span>
        </span>

        <span
          className={`badge ${CONTRACT_CLASS[job.contractType]}`}
          style={{ fontSize: 11 }}
        >
          {CONTRACT_LABELS[job.contractType]}
        </span>

        <span
          className={`badge ${job.language === "fr" ? "badge-fr" : job.language === "en" ? "badge-en" : "badge-onsite"}`}
          style={{ fontSize: 11 }}
        >
          <Globe size={10} />
          {job.language === "fr" ? "🇫🇷 FR" : job.language === "en" ? "🇬🇧 EN" : "—"}
        </span>
      </div>

      {/* Location + time */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 14,
          color: "var(--text-muted)",
          fontSize: 12,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <MapPin size={12} />
          {job.location}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Clock size={12} />
          {timeAgo(job.postedAt)} ago
        </span>
      </div>

      {/* Stack tags */}
      {job.stack.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            marginBottom: 16,
          }}
        >
          {job.stack.slice(0, 4).map((tech) => (
            <span key={tech} className="badge badge-stack" style={{ fontSize: 10 }}>
              {tech}
            </span>
          ))}
          {job.stack.length > 4 && (
            <span className="badge badge-onsite" style={{ fontSize: 10 }}>
              +{job.stack.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Apply button */}
      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="apply-btn"
        id={`apply-${job.id}`}
        aria-label={`Postuler à ${job.title}`}
        style={{ width: "100%", justifyContent: "center" }}
      >
        Postuler <ExternalLink size={13} />
      </a>
    </article>
  );
}
