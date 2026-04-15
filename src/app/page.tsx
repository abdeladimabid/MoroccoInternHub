"use client";

import { useEffect, useState, useCallback } from "react";
import { useJobs } from "@/hooks/useJobs";
import { JobCard } from "@/components/JobCard";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { StatsBar } from "@/components/StatsBar";
import { Briefcase, Sparkles, ChevronDown, Github } from "lucide-react";

const DEBOUNCE_MS = 350;

export default function Home() {
  const { jobs, meta, isLoading, error, hasLoaded, batch, fetchJobs } = useJobs();

  const [city, setCity] = useState("all");
  const [lang, setLang] = useState("all");
  const [contract, setContract] = useState("all");
  const [stack, setStack] = useState("all");
  const [query, setQuery] = useState("");
  const [displayedJobs, setDisplayedJobs] = useState(jobs);

  // Trigger initial fetch on mount
  useEffect(() => {
    fetchJobs({ city, lang, contract, stack });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Client-side search filter on top of API results
  useEffect(() => {
    if (!query) {
      setDisplayedJobs(jobs);
      return;
    }
    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      setDisplayedJobs(
        jobs.filter(
          (j) =>
            j.title.toLowerCase().includes(q) ||
            j.company.toLowerCase().includes(q) ||
            j.stack.some((s) => s.toLowerCase().includes(q))
        )
      );
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, jobs]);

  const handleFilterChange = useCallback(
    (
      newCity = city,
      newLang = lang,
      newContract = contract,
      newStack = stack
    ) => {
      fetchJobs({
        city: newCity,
        lang: newLang,
        contract: newContract,
        stack: newStack,
      });
    },
    [city, lang, contract, stack, fetchJobs]
  );

  const handleCityChange = (v: string) => {
    setCity(v);
    handleFilterChange(v, lang, contract, stack);
  };
  const handleLangChange = (v: string) => {
    setLang(v);
    handleFilterChange(city, v, contract, stack);
  };
  const handleContractChange = (v: string) => {
    setContract(v);
    handleFilterChange(city, lang, v, stack);
  };
  const handleStackChange = (v: string) => {
    setStack(v);
    handleFilterChange(city, lang, contract, v);
  };
  const handleRefresh = () => {
    fetchJobs({ city, lang, contract, stack, batch: 0 }, false);
  };

  const handleLoadMore = () => {
    if (meta?.hasNextBatch && !isLoading) {
      fetchJobs({ city, lang, contract, stack, batch: batch + 1 }, true);
    }
  };

  return (
    <>
      {/* Background orbs */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* ── NAVBAR ── */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 0",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            marginBottom: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Briefcase size={18} color="white" />
            </div>
            <div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 16,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                }}
              >
                Morocco
              </span>
              <span
                className="gradient-text"
                style={{ fontWeight: 800, fontSize: 16, marginLeft: 5 }}
              >
                InternHub
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                padding: "4px 10px",
                background: "rgba(255,255,255,0.04)",
                borderRadius: 100,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              🇲🇦 Progressive Scrape
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ padding: "8px 14px", gap: 6 }}
              aria-label="GitHub"
            >
              <Github size={15} />
              <span style={{ fontSize: 13 }}>GitHub</span>
            </a>
          </div>
        </nav>

        {/* ── HERO ── */}
        <header
          style={{
            textAlign: "center",
            padding: "64px 0 48px",
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 100,
              marginBottom: 24,
              fontSize: 13,
              color: "#a5b4fc",
              fontWeight: 500,
            }}
          >
            <Sparkles size={13} />
            Chargement progressif · Rapide et efficace
          </div>

          <h1 className="hero-headline" style={{ margin: "0 0 16px" }}>
            <span style={{ color: "var(--text-primary)" }}>Trouve ton </span>
            <span className="gradient-text">stage IT</span>
            <br />
            <span style={{ color: "var(--text-primary)" }}>au </span>
            <span className="gradient-text-green">Maroc</span>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "var(--text-secondary)",
              maxWidth: 540,
              margin: "0 auto 40px",
              lineHeight: 1.6,
            }}
          >
            Stage.ma, Rekrute, Khdma.ma, Emploi.ma et Indeed —
            <br />
            <strong style={{ color: "var(--text-primary)" }}>Scrapés par lots</strong> pour plus de rapidité.
          </p>

          {/* Scroll hint */}
          <div
            style={{
              color: "var(--text-muted)",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              animation: "bounce 2s infinite",
            }}
          >
            <ChevronDown size={16} />
            Scroll pour voir les offres
          </div>
        </header>

        {/* ── SEARCH ── */}
        <div style={{ marginBottom: 16 }}>
          <SearchBar value={query} onChange={setQuery} />
        </div>

        {/* ── FILTERS ── */}
        <div style={{ marginBottom: 20 }}>
          <FilterBar
            city={city}
            lang={lang}
            contract={contract}
            stack={stack}
            onCityChange={handleCityChange}
            onLangChange={handleLangChange}
            onContractChange={handleContractChange}
            onStackChange={handleStackChange}
            onRefresh={handleRefresh}
            isLoading={isLoading && batch === 0}
          />
        </div>

        {/* ── STATS ── */}
        {hasLoaded && (
          <div style={{ marginBottom: 24 }}>
            <StatsBar
              total={displayedJobs.length}
              sources={meta?.sources || []}
              scrapedAt={meta?.scrapedAt || null}
              cached={meta?.cached || false}
              errors={meta?.errors || []}
            />
          </div>
        )}

        {/* ── LOADING INDICATOR ── */}
        {isLoading && batch === 0 && (
          <div
            style={{
              textAlign: "center",
              marginBottom: 16,
              color: "var(--text-secondary)",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <div className="spinner" />
            Récupération des premières offres...
          </div>
        )}

        {/* ── ERROR ── */}
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 24,
              color: "#fca5a5",
              fontSize: 14,
            }}
          >
            ⚠️ Erreur lors du scraping: {error}
          </div>
        )}

        {/* ── JOB GRID ── */}
        <main id="jobs-grid" aria-label="Liste des offres de stage">
          {isLoading && batch === 0 ? (
            <SkeletonGrid />
          ) : displayedJobs.length > 0 ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "16px",
                  marginBottom: 32,
                }}
              >
                {displayedJobs.map((job, i) => (
                  <JobCard key={job.id} job={job} index={i % 6} />
                ))}
              </div>

              {/* Load More Button */}
              {meta?.hasNextBatch && (
                <div 
                  style={{ 
                    textAlign: "center", 
                    marginBottom: 80,
                    marginTop: 20
                  }}
                >
                  <button
                    id="load-more-btn"
                    className={`btn-load-more ${isLoading ? 'loading' : ''}`}
                    onClick={handleLoadMore}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="spinner-small" />
                        <span>Recherche en cours...</span>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Sparkles size={16} />
                        <span>Voir plus d&apos;offres</span>
                        <ChevronDown size={16} />
                      </div>
                    )}
                  </button>
                  
                  <p style={{ 
                    marginTop: 16, 
                    color: "var(--text-muted)", 
                    fontSize: 12 
                  }}>
                    {batch + 1} / 3 pages de sources chargées
                  </p>
                </div>
              )}
            </>
          ) : hasLoaded ? (
            <div className="empty-state">
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  margin: "0 0 8px",
                }}
              >
                Aucune offre trouvée
              </h2>
              <p style={{ fontSize: 14, margin: "0 0 24px" }}>
                Essayez de modifier vos filtres ou de charger plus d&apos;offres.
              </p>
              <button
                className="btn-primary"
                onClick={() => {
                  setCity("all");
                  setLang("all");
                  setContract("all");
                  setStack("all");
                  setQuery("");
                  fetchJobs({ batch: 0 }, false);
                }}
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : null}
        </main>

        {/* ── FOOTER ── */}
        <footer
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "32px 0",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: 13,
          }}
        >
          <p style={{ margin: 0 }}>
            Morocco InternHub — Données scrapées en temps réel depuis les
            plateformes d&apos;emploi marocaines.{" "}
            <span style={{ color: "var(--text-muted)" }}>
              Aucune base de données. Aucun compte requis.
            </span>
          </p>
          <p style={{ margin: "8px 0 0", fontSize: 12 }}>
            Built with Next.js · Tailwind CSS · Cheerio · Lucide Icons
          </p>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </>
  );
}
