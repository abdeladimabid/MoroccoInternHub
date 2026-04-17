"use client";

import { useState, useEffect } from "react";
import { InternshipOffer, FilterOptions } from "@/lib/scrapers/types";
import { ExternalLink, MapPin, Clock, Loader2, RefreshCw } from "lucide-react";
import { fetchInternshipsAction } from "@/lib/actions";

export default function InternshipList({ initialOffers, filters }: { initialOffers: InternshipOffer[], filters: FilterOptions }) {
  const [offers, setOffers] = useState<InternshipOffer[]>(initialOffers);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Sync state when server-side initialOffers change (e.g. after a search URL update)
  useEffect(() => {
    setOffers(initialOffers);
    setPage(1);
  }, [initialOffers]);

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    const newOffers = await fetchInternshipsAction(nextPage, filters);
    
    setOffers(prev => {
      const existingUrls = new Set(prev.map(o => o.url));
      const filteredNew = newOffers.filter(o => !existingUrls.has(o.url));
      return [...prev, ...filteredNew];
    });
    
    setPage(nextPage);
    setLoading(false);
  };

  if (offers.length === 0) {
    return (
       <div className="flex flex-col items-center justify-center p-16 text-center border border-white/5 rounded-[2.5rem] bg-[#161822]/50 backdrop-blur-xl shadow-2xl">
          <div className="bg-slate-800/30 p-4 rounded-full mb-6 ring-1 ring-white/10">
             <Clock className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-heading">Aucune offre trouvée</h3>
          <p className="text-slate-500 text-sm max-w-sm">Ajustez vos filtres ou revenez plus tard.</p>
       </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 [grid-auto-rows:1fr]">
        {offers.map((offer) => {
          const isNew = offer.ageInDays <= 3;
          const initial = offer.company.charAt(0).toUpperCase();

          return (
            <div key={offer.id} className="group relative flex flex-col bg-[#161822]/40 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-indigo-500/30 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6),0_0_20px_rgba(79,70,229,0.05)] hover:-translate-y-1.5">
              {/* Decorative gradient spot */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 blur-[70px] rounded-full pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-700"></div>
              
              <div className="p-7 flex-1 flex flex-col relative z-20">
                {/* Header: Company Icon and Source */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-white/10 flex items-center justify-center font-bold text-indigo-400 text-lg shadow-xl group-hover:scale-105 transition-transform duration-500">
                    {initial}
                  </div>
                  
                  <div className="flex flex-col items-end gap-1.5">
                    {isNew && (
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full animate-pulse">
                        Nouveau
                      </span>
                    )}
                    <div className="text-[9px] font-bold px-2.5 py-0.5 bg-white/5 text-slate-400 border border-white/5 rounded-full backdrop-blur-sm">
                      {offer.source}
                    </div>
                  </div>
                </div>

                {/* Content: Company and Title */}
                <div className="mb-4">
                  <div className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.15em] mb-1.5 opacity-90">
                    {offer.company}
                  </div>
                  <h3 className="font-bold text-white text-base leading-[1.3] font-heading group-hover:text-indigo-300 transition-colors line-clamp-2" title={offer.title}>
                    {offer.title}
                  </h3>
                </div>

                {/* Badges row */}
                <div className="flex flex-wrap gap-2 mb-5">
                   <div className="text-[9px] font-bold px-2.5 py-1 bg-white/5 text-slate-400 border border-white/5 rounded-lg backdrop-blur-sm">
                     {offer.source}
                   </div>
                   <div className="text-[9px] font-bold px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
                     {offer.contract}
                   </div>
                   <div className="text-[9px] font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                     {offer.language}
                   </div>
                   {offer.tags?.slice(0, 3).map((tag, idx) => (
                     <div key={idx} className="text-[9px] font-bold px-2.5 py-1 bg-slate-800/50 text-slate-300 border border-white/5 rounded-lg">
                        {tag}
                     </div>
                   ))}
                </div>

                {/* Description Snippet */}
                {offer.description && (
                  <div className="mb-5">
                    <div className="bg-[#0f111a]/50 p-3.5 rounded-xl border border-white/5 group-hover:bg-[#0f111a]/80 transition-colors">
                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                        {offer.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer Metadata */}
                <div className="mt-auto flex justify-between items-center text-[10px] text-slate-500 pt-5 border-t border-white/5">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-indigo-500/60" /> 
                    <span className="truncate max-w-[110px]">{offer.location}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-indigo-500/60" /> {offer.dateStr}
                  </span>
                </div>
              </div>

              {/* Action Area */}
              <div className="px-7 pb-7 pt-0">
                <a 
                  href={offer.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-bold rounded-xl flex items-center justify-center transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/30 group/btn font-heading"
                >
                  Voir l'offre 
                  <ExternalLink className="h-3.5 w-3.5 ml-1.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pt-8 pb-20">
         <button 
           onClick={loadMore} 
           disabled={loading}
           className="group px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 text-sm font-heading shadow-xl"
         >
           {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
             <>
               Plus d'offres
               <span className="p-1 bg-indigo-600 rounded-lg">
                 <RefreshCw className="h-3 w-3" />
               </span>
             </>
           )}
         </button>
      </div>
    </div>
  );
}
