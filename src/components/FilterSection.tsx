"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, Code, MousePointer2, RefreshCw, FileCheck2, Timer, AlertTriangle } from "lucide-react";

export default function FilterSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [region, setRegion] = useState(searchParams.get("region") || "");
  const [contract, setContract] = useState(searchParams.get("contract") || "");
  const [tech, setTech] = useState(""); // Tech filter not yet in backend logic but UI needs it
  const [language, setLanguage] = useState(searchParams.get("lang") || "All");

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("q", searchQuery);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 -mt-32 relative z-20">
      <div className="bg-[#161822]/80 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Rechercher un poste, entreprise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-[#0f111a]/50 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-[2px] focus:outline-indigo-500/50 focus:bg-[#0f111a] transition-all shadow-inner"
            />
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-4">
          {/* City Selector */}
          <div className="flex-1 min-w-[200px] relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <select
              value={region}
              onChange={(e) => { setRegion(e.target.value); updateFilters("region", e.target.value); }}
              className="w-full pl-11 pr-4 py-3 bg-[#0f111a]/50 border border-slate-800 rounded-2xl text-sm text-slate-300 appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer"
            >
              <option value="">Toutes les villes</option>
              <option value="Casablanca">Casablanca</option>
              <option value="Rabat">Rabat</option>
              <option value="Tangier">Tangier</option>
              <option value="Marrakech">Marrakech</option>
            </select>
          </div>

          {/* Type Selector */}
          <div className="flex-1 min-w-[180px] relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <select
              value={contract}
              onChange={(e) => { setContract(e.target.value); updateFilters("contract", e.target.value); }}
              className="w-full pl-11 pr-4 py-3 bg-[#0f111a]/50 border border-slate-800 rounded-2xl text-sm text-slate-300 appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer"
            >
              <option value="">Tous types</option>
              <option value="Stage">Stage</option>
              <option value="Télétravail">Télétravail</option>
              <option value="Sur site">Sur site</option>
            </select>
          </div>

          {/* Tech Selector */}
          <div className="flex-1 min-w-[180px] relative">
            <Code className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <select
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#0f111a]/50 border border-slate-800 rounded-2xl text-sm text-slate-300 appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer"
            >
              <option value="">Toutes les techs</option>
              <option value="React">React</option>
              <option value="Laravel">Laravel</option>
              <option value="Python">Python</option>
            </select>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center bg-[#0f111a]/50 border border-slate-800 p-1 rounded-2xl">
            {["All", "FR", "EN"].map((l) => (
              <button
                key={l}
                onClick={() => { setLanguage(l); updateFilters("lang", l === "All" ? "" : l); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  language === l ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Actualiser Button */}
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-bold rounded-2xl text-sm transition-all border border-slate-700/50 active:scale-95"
          >
            <RefreshCw className="h-4 w-4" /> Actualiser
          </button>
        </div>
      </div>

      {/* Info Badges */}
      <div className="flex flex-wrap gap-4 mt-6 ml-4">
         <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black tracking-widest text-indigo-400">
            <FileCheck2 className="h-3 w-3" /> VERIFIED OFFERS
         </div>
         <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black tracking-widest text-emerald-400">
            <Timer className="h-3 w-3" /> SCANNED LIVE
         </div>
         <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full text-[10px] font-black tracking-widest text-rose-400">
            <AlertTriangle className="h-3 w-3" /> SYSTEM STABLE
         </div>
      </div>
    </div>
  );
}
