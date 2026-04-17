import { Suspense } from "react";
import { fetchInternshipsAction } from "@/lib/actions";
import { FilterOptions } from "@/lib/scrapers/types";
import InternshipList from "@/components/InternshipList";
import FilterSection from "@/components/FilterSection";
import { Github, Sparkles } from "lucide-react";

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
    <div className="max-w-7xl mx-auto px-4 pb-32 mt-16">
      <InternshipList initialOffers={initialOffers} filters={filters} />
    </div>
  );
}

export default function Dashboard({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  return (
    <main className="min-h-screen relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.08)_0,transparent_70%)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_20%_80%,rgba(139,92,246,0.05)_0,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5 bg-[#0f111a]/60">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/40">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight font-heading">
              Morocco <span className="text-indigo-500">InternHub</span>
            </span>
          </div>

          <div className="flex gap-4 items-center">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Live Scanning
            </div>
            <a
              href="https://github.com/abdeladimabid/MoroccoInternHub"
              target="_blank"
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        {/* Hero Section */}
        <header className="pt-24 pb-40 text-center px-4 overflow-hidden">

          <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9] mb-8 font-heading animate-fade-in" style={{ animationDelay: "200ms" }}>
            Ton futur stage <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-500 to-purple-500">IT commence ici.</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
            Nous scannons en temps réel plus de 10 plateformes d'emploi <br className="hidden md:block" />
            pour centraliser toutes les opportunités tech du Maroc en un seul endroit.
          </p>
        </header>

        {/* Filters Area */}
        <div className="animate-fade-in opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
          <Suspense fallback={<div className="h-32 bg-[#161822] rounded-[2.5rem] animate-pulse max-w-6xl mx-auto"></div>}>
            <FilterSection />
          </Suspense>
        </div>

        {/* Grid Content */}
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-16 pb-32">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-8 bg-[#161822] rounded-[2.5rem] border border-white/5 animate-pulse h-80">
                <div className="flex gap-4 mb-8">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-white/5 rounded w-3/4"></div>
                    <div className="h-3 bg-white/5 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-3 bg-white/5 rounded w-full"></div>
                  <div className="h-3 bg-white/5 rounded w-5/6"></div>
                  <div className="h-10 bg-white/5 rounded-xl w-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        }>
          <InternshipStream searchParams={searchParams} />
        </Suspense>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0f111a] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-sm">
            © 2026 Morocco InternHub. Plateforme agrégative indépendante.
          </div>
          <div className="flex gap-8 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-400 transition-colors">À propos</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
