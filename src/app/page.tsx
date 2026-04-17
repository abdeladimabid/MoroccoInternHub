import { Suspense } from "react";
import { fetchInternshipsAction } from "@/lib/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterOptions } from "@/lib/scrapers/types";
import InternshipList from "@/components/InternshipList";
import FilterSection from "@/components/FilterSection";
import { MousePointer2, Github } from "lucide-react";

async function InternshipStream({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const params = await searchParams;
  
  const page = parseInt(params.page || "1");
  const filters: FilterOptions = {
    q: params.q,
    region: params.region,
    contract: params.contract as FilterOptions['contract']
  };
  
  const initialOffers = await fetchInternshipsAction(page, filters);
  
  return (
    <div className="max-w-7xl mx-auto px-4 pb-20 mt-12">
      <InternshipList initialOffers={initialOffers} filters={filters} />
    </div>
  );
}

export default function Dashboard({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  return (
    <main className="min-h-screen bg-[#0f111a] font-sans text-slate-300 selection:bg-indigo-500/30">
      {/* Header / Nav */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto relative z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
             <div className="w-5 h-5 border-2 border-white rounded-sm"></div>
          </div>
          <span className="text-xl font-black text-white tracking-tight">
            Morocco <span className="text-indigo-500">InternHub</span>
          </span>
        </div>
        
        <div className="flex gap-4">
           <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-400">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
             Progressive Scrape
           </div>
           <a href="#" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all">
             <Github className="h-4 w-4" /> GitHub
           </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-40 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full pointer-events-none overflow-hidden">
           <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
           <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[11px] font-black tracking-widest text-indigo-400 mb-8 lowercase">
             <MousePointer2 className="h-3 w-3" /> Chargement progressif · Rapide et efficace
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
            Trouve ton <span className="text-indigo-500">stage IT</span> <br />
            au <span className="text-emerald-400">Maroc</span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12">
            Indeed, Rekrute, Emploi.ma, M-Job, et Stage.ma — <br />
            <span className="text-white">Scrapés en temps réel</span> pour une recherche sans compromis.
          </p>
          
          <div className="flex flex-col items-center gap-4 text-slate-500 text-sm">
             <div className="animate-bounce mt-4">
                <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-transparent rounded-full mx-auto"></div>
             </div>
             <span>Scroll pour voir les offres</span>
          </div>
        </div>
      </header>

      {/* Filters Area */}
      <Suspense fallback={<div className="h-32 bg-[#161822] rounded-[2.5rem] animate-pulse"></div>}>
        <FilterSection />
      </Suspense>

      {/* Grid Content */}
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-12 pb-20">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-8 bg-[#161822] rounded-[2rem] border border-slate-800 animate-pulse h-72">
               <div className="flex gap-4 mb-6">
                 <div className="w-12 h-12 bg-slate-800 rounded-2xl"></div>
                 <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-800 rounded w-1/4"></div>
                 </div>
               </div>
               <div className="space-y-3">
                 <div className="h-3 bg-slate-800 rounded w-full"></div>
                 <div className="h-3 bg-slate-800 rounded w-5/6"></div>
               </div>
            </div>
          ))}
        </div>
      }>
         <InternshipStream searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
