import { Sparkles, Github, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen relative bg-[#0f111a]">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.08)_0,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150"></div>
      </div>

      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5 bg-[#0f111a]/60">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/40">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight font-heading">
              Morocco <span className="text-indigo-500">InternHub</span>
            </span>
          </Link>
          <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-8 pt-24 pb-32">
        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-8 font-heading">
            À propos de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Morocco InternHub</span>
          </h1>
          <p className="text-slate-400 text-xl leading-relaxed">
            Notre mission est de simplifier la recherche de stages technologiques au Maroc en centralisant toutes les opportunités en un seul endroit.
          </p>
        </header>

        <section className="space-y-12">
          <div className="bg-[#161822]/40 backdrop-blur-md border border-white/5 p-10 rounded-[2.5rem]">
            <h2 className="text-2xl font-bold text-white mb-6 font-heading">Pourquoi avoir créé cette plateforme ?</h2>
            <div className="prose prose-invert max-w-none text-slate-400 space-y-4">
              <p>
                En tant qu'étudiant ou jeune diplômé en informatique, parcourir quotidiennement plus de 10 sites d'emploi différents (LinkedIn, Rekrute, Stagiaires.ma, etc.) est une tâche chronophage et frustrante.
              </p>
              <p>
                <strong>Morocco InternHub</strong> a été conçu comme un agrégateur intelligent. Nous utilisons des technologies de scraping en temps réel pour scanner le web marocain et extraire uniquement les offres pertinentes pour le secteur de l'IT et du Digital.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#161822]/40 backdrop-blur-md border border-white/5 p-8 rounded-[2rem]">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                Transparence Totale
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Nous ne sommes pas un site de recrutement. Nous sommes un index. Chaque offre affichée redirige directement vers sa source originale où vous pouvez postuler en toute sécurité.
              </p>
            </div>
            <div className="bg-[#161822]/40 backdrop-blur-md border border-white/5 p-8 rounded-[2rem]">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Gratuité Absolue
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                L'accès à toutes les opportunités est et restera gratuit pour les étudiants. Notre seul objectif est de faciliter votre premier pas dans le monde professionnel.
              </p>
            </div>
          </div>

          <div className="text-center pt-16">
            <p className="text-slate-500 text-sm mb-6 uppercase tracking-widest font-bold">Le code est open-source</p>
            <a 
              href="https://github.com/abdeladimabid/MoroccoInternHub"
              target="_blank"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all active:scale-95"
            >
              <Github className="w-5 h-5" /> Explorer sur GitHub
            </a>
          </div>
        </section>
      </div>

      <footer className="border-t border-white/5 bg-[#0f111a] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-sm">
            © 2026 Morocco InternHub. Plateforme agrégative indépendante.
          </div>
        </div>
      </footer>
    </main>
  );
}
