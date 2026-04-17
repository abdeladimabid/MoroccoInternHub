"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, Code, RefreshCw } from "lucide-react";

export default function FilterSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [region, setRegion] = useState(searchParams.get("region") || "");
  const [contract, setContract] = useState(searchParams.get("contract") || "");
  const [tech, setTech] = useState(searchParams.get("q") || ""); // Sync tech with q initially
  const [language, setLanguage] = useState(searchParams.get("lang") || "All");

  // Sync state with URL params for back/forward navigation
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
    setRegion(searchParams.get("region") || "");
    setContract(searchParams.get("contract") || "");
    setLanguage(searchParams.get("lang") || "All");
  }, [searchParams]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  // Live search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== (searchParams.get("q") || "")) {
        updateFilters("q", searchQuery);
      }
    }, 350); // 350ms debounce for snappier feel

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    updateFilters("q", searchQuery);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 -mt-24 relative z-20">
      <div className="bg-[#161822]/90 backdrop-blur-2xl border border-white/5 p-6 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Poste, entreprise ou technologie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-[#0f111a]/50 border border-white/5 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-[#0f111a] transition-all"
            />
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* City Selector */}
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <select
              value={region}
              onChange={(e) => { setRegion(e.target.value); updateFilters("region", e.target.value); }}
              className="w-full pl-11 pr-4 py-4 bg-[#0f111a]/50 border border-white/5 rounded-2xl text-sm text-slate-300 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer hover:bg-slate-800/30 transition-colors [&>option]:bg-[#161822] [&>option]:text-white"
            >
              <option value="">Toutes les régions</option>
              <option value="Casablanca">Casablanca</option>
              <option value="Rabat">Rabat</option>
              <option value="Tanger">Tanger</option>
              <option value="Marrakech">Marrakech</option>
            </select>
          </div>

          {/* Type Selector */}
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <select
              value={contract}
              onChange={(e) => { setContract(e.target.value); updateFilters("contract", e.target.value); }}
              className="w-full pl-11 pr-4 py-4 bg-[#0f111a]/50 border border-white/5 rounded-2xl text-sm text-slate-300 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer hover:bg-slate-800/30 transition-colors [&>option]:bg-[#161822] [&>option]:text-white"
            >
              <option value="">Contrat</option>
              <option value="Stage">Stage</option>
              <option value="Télétravail">Télétravail</option>
            </select>
          </div>

          {/* Tech Selector */}
          <div className="relative">
            <Code className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <select
              value={tech}
              onChange={(e) => {
                const val = e.target.value;
                setTech(val);
                setSearchQuery(val);
                updateFilters("q", val);
              }}
              className="w-full pl-11 pr-4 py-4 bg-[#0f111a]/50 border border-white/5 rounded-2xl text-sm text-slate-300 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer hover:bg-slate-800/30 transition-colors [&>option]:bg-[#161822] [&>option]:text-white"
            >
              <option value="">Stacks</option>
              <option value="React">React</option>
              <option value="Laravel">Laravel</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="Node">Node.js</option>
              <option value="Flutter">Flutter</option>
            </select>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center bg-[#0f111a]/50 border border-white/5 p-1 rounded-2xl">
            {["All", "FR", "EN"].map((l) => (
              <button
                key={l}
                onClick={() => { setLanguage(l); updateFilters("lang", l === "All" ? "" : l); }}
                className={`flex-1 px-2 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                  language === l ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Actualiser Button */}
          <button 
            onClick={() => handleSearch()}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm transition-all active:scale-95 shadow-lg shadow-indigo-600/20 font-heading"
          >
            <Search className="h-4 w-4" /> Chercher
          </button>
        </div>
      </div>
    </div>
  );
}
