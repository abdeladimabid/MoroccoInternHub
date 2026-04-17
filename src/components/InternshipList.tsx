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

          return (
            <div key={offer.id} className="group relative flex flex-col bg-[#161822]/40 backdrop-blur-md border border-white/5 rounded-[2.25rem] overflow-hidden transition-all duration-500 hover:border-indigo-500/20 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)] hover:-translate-y-1">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-indigo-600/10 transition-all duration-700"></div>
              
              <div className="p-6 pb-4 flex-1 flex flex-col relative z-20">
                {/* Top Bar: Location and Badges */}
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    <MapPin className="h-3 w-3 text-indigo-500/60" />
                    <span className="truncate max-w-[100px]">{offer.location}</span>
                  </div>
                  
                  <div className="flex gap-1.5 items-center">
                    {isNew && (
                      <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Nouveau
                      </span>
                    )}
                    <span className="text-[9px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5 backdrop-blur-sm">
                      {offer.source}
                    </span>
                  </div>
                </div>

                {/* Company & Title */}
                <div className="mb-4">
                  <div className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 opacity-90 truncate">
                    {offer.company}
                  </div>
                  <h3 className="font-bold text-white text-lg leading-snug font-heading group-hover:text-indigo-300 transition-colors line-clamp-2" title={offer.title}>
                    {offer.title}
                  </h3>
                </div>

                {/* Tags Row */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                   <div className="text-[9px] font-bold px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
                     {offer.contract}
                   </div>
                   {offer.tags?.slice(0, 3).map((tag, idx) => (
                     <div key={idx} className="text-[9px] font-bold px-2.5 py-1 bg-white/5 text-slate-300 border border-white/5 rounded-lg backdrop-blur-sm">
                        {tag}
                     </div>
                   ))}
                </div>

                {/* Description Snippet */}
                {offer.description && (
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    {offer.description}
                  </p>
                )}
              </div>

              {/* Action Area & Date */}
              <div className="px-6 pb-6 pt-4 flex flex-col gap-4 relative z-20">
                <div className="flex items-center justify-between text-[10px] text-slate-500/60 font-medium px-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {offer.dateStr}
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[8px] font-black uppercase">Active</div>
                </div>

                <a 
                  href={offer.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-2xl flex items-center justify-center transition-all active:scale-[0.97] shadow-lg shadow-indigo-600/30 group/btn font-heading relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Voir l'offre 
                    <ExternalLink className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
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
