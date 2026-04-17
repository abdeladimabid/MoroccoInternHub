"use client";

import { useState } from "react";
import { InternshipOffer, FilterOptions } from "@/lib/scrapers/types";
import { ExternalLink, MapPin, Clock, Loader2, Zap, CheckCircle2, Code2, Building2 } from "lucide-react";
import { fetchInternshipsAction } from "@/lib/actions";

export default function InternshipList({ initialOffers, filters }: { initialOffers: InternshipOffer[], filters: FilterOptions }) {
  const [offers, setOffers] = useState<InternshipOffer[]>(initialOffers);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

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
       <div className="flex flex-col items-center justify-center p-12 text-center border border-slate-800 rounded-3xl bg-[#0f111a] shadow-xl h-60">
          <div className="bg-slate-800/50 p-3 rounded-full mb-3 ring-1 ring-slate-700">
             <Clock className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-200 mb-1">No internships found</h3>
          <p className="text-slate-500 text-sm max-w-sm">Try adjusting your filters or checking back later.</p>
       </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 [grid-auto-rows:1fr]">
        {offers.map((offer) => {
          const isNew = offer.ageInDays <= 3;
          const initial = offer.company.charAt(0).toUpperCase();
          const hasTags = offer.tags && offer.tags.length > 0;

          return (
            <div key={offer.id} className="group flex flex-col h-full p-5 bg-[#161822] border border-slate-800/60 rounded-[1.5rem] shadow-lg transition-all hover:bg-[#1a1c29] hover:border-indigo-500/30 hover:shadow-indigo-500/10 hover:-translate-y-1 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-[40px] rounded-full pointer-events-none -mr-12 -mt-12 group-hover:bg-indigo-500/10 transition-colors"></div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-300 flex items-center justify-center font-bold text-base shrink-0 ring-1 ring-white/10">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-base leading-tight line-clamp-2 group-hover:text-indigo-300 transition-colors" title={offer.title}>
                        {offer.title}
                      </h3>
                      <div className="flex items-center text-slate-400 text-xs mt-1">
                        <Building2 className="h-3 w-3 mr-1 text-slate-500" />
                        <span className="truncate">{offer.company}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1 shrink-0">
                     <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded-full">
                       VERIFIED
                    </span>
                    {isNew && (
                      <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 px-1.5 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
                   <div className="text-[9px] font-black px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-md">
                     {offer.source}
                   </div>
                   <div className="text-[9px] font-black px-2 py-0.5 bg-slate-800/80 text-slate-300 border border-slate-700/50 rounded-md">
                     {offer.contract}
                   </div>
                   <div className="text-[9px] font-black px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md">
                     {offer.language}
                   </div>
                </div>

                <div className="mb-4 h-[4.8rem] overflow-hidden">
                  {offer.description && (
                    <p 
                      className="text-slate-400 text-[13px] leading-[1.6] bg-slate-900/40 p-2.5 rounded-xl border border-white/5 h-full overflow-hidden"
                      style={{ 
                        display: '-webkit-box', 
                        WebkitLineClamp: 3, 
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {offer.description}
                    </p>
                  )}
                </div>

                {hasTags && (
                  <div className="flex flex-wrap gap-1 mb-4 relative z-10">
                    {offer.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center text-[10px] text-slate-500 mb-5 border-t border-white/5 pt-4 mt-auto">
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-indigo-400/50" /> {offer.location}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-indigo-400/50" /> {offer.dateStr}
                  </span>
                </div>
              </div>

              <a href={offer.url} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-bold rounded-xl flex items-center justify-center transition-all active:scale-[0.98]">
                Postuler <ExternalLink className="h-3.5 w-3.5 ml-2" />
              </a>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pt-4 pb-12">
         <button 
           onClick={loadMore} 
           disabled={loading}
           className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 text-sm"
         >
           {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Afficher plus d'offres"}
         </button>
      </div>
    </div>
  );
}
