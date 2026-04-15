"use client";

import { MapPin, Briefcase, Code2, RefreshCw } from "lucide-react";

const CITIES = [
  { value: "all", label: "🇲🇦 Toutes les villes" },
  { value: "casablanca", label: "📍 Casablanca" },
  { value: "rabat", label: "📍 Rabat" },
  { value: "tangier", label: "📍 Tanger" },
  { value: "marrakech", label: "📍 Marrakech" },
  { value: "agadir", label: "📍 Agadir" },
  { value: "fès", label: "📍 Fès" },
  { value: "oujda", label: "📍 Oujda" },
  { value: "salé", label: "📍 Salé" },
  { value: "meknès", label: "📍 Meknès" },
];

const CONTRACTS = [
  { value: "all", label: "Tous types" },
  { value: "remote", label: "🌐 Remote" },
  { value: "hybrid", label: "⚡ Hybride" },
  { value: "onsite", label: "🏢 Présentiel" },
];

const STACKS = [
  { value: "all", label: "Toutes les techs" },
  { value: "react", label: "⚛️ React" },
  { value: "vue", label: "💚 Vue.js" },
  { value: "angular", label: "🔴 Angular" },
  { value: "next.js", label: "▲ Next.js" },
  { value: "node.js", label: "🟢 Node.js" },
  { value: "php", label: "🐘 PHP" },
  { value: "laravel", label: "🎭 Laravel" },
  { value: "python", label: "🐍 Python" },
  { value: "javascript", label: "🟨 JavaScript" },
  { value: "typescript", label: "🔵 TypeScript" },
  { value: "java", label: "☕ Java" },
  { value: ".net", label: "🟣 .NET / C#" },
  { value: "flutter", label: "💙 Flutter" },
  { value: "docker", label: "🐳 Docker/DevOps" },
  { value: "sql", label: "🗄️ SQL" },
  { value: "mongodb", label: "🍃 MongoDB" },
  { value: "wordpress", label: "📝 WordPress" },
];

interface FilterBarProps {
  city: string;
  lang: string;
  contract: string;
  stack: string;
  onCityChange: (v: string) => void;
  onLangChange: (v: string) => void;
  onContractChange: (v: string) => void;
  onStackChange: (v: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function FilterBar({
  city,
  lang,
  contract,
  stack,
  onCityChange,
  onLangChange,
  onContractChange,
  onStackChange,
  onRefresh,
  isLoading,
}: FilterBarProps) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        padding: "16px 20px",
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "center",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* City */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "1 1 160px" }}>
        <MapPin size={15} color="var(--text-muted)" />
        <select
          id="filter-city"
          className="filter-input"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          style={{ flex: 1 }}
          aria-label="Filtrer par ville"
        >
          {CITIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Contract */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "1 1 150px" }}>
        <Briefcase size={15} color="var(--text-muted)" />
        <select
          id="filter-contract"
          className="filter-input"
          value={contract}
          onChange={(e) => onContractChange(e.target.value)}
          style={{ flex: 1 }}
          aria-label="Filtrer par type de contrat"
        >
          {CONTRACTS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stack */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "1 1 160px" }}>
        <Code2 size={15} color="var(--text-muted)" />
        <select
          id="filter-stack"
          className="filter-input"
          value={stack}
          onChange={(e) => onStackChange(e.target.value)}
          style={{ flex: 1 }}
          aria-label="Filtrer par technologie"
        >
          {STACKS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Language toggle */}
      <div className="lang-toggle" aria-label="Filtrer par langue">
        <button
          id="lang-all"
          className={lang === "all" ? "active" : ""}
          onClick={() => onLangChange("all")}
        >
          All
        </button>
        <button
          id="lang-fr"
          className={lang === "fr" ? "active" : ""}
          onClick={() => onLangChange("fr")}
        >
          🇫🇷 FR
        </button>
        <button
          id="lang-en"
          className={lang === "en" ? "active" : ""}
          onClick={() => onLangChange("en")}
        >
          🇬🇧 EN
        </button>
      </div>

      {/* Refresh */}
      <button
        id="refresh-btn"
        className="btn-secondary"
        onClick={onRefresh}
        disabled={isLoading}
        aria-label="Actualiser les offres"
        style={{ flexShrink: 0 }}
      >
        <RefreshCw
          size={15}
          style={{
            animation: isLoading ? "spin 0.8s linear infinite" : "none",
          }}
        />
        {isLoading ? "Scraping..." : "Actualiser"}
      </button>
    </div>
  );
}
