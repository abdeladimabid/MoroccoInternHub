import { Sparkles, ArrowLeft, Gavel, Scale, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-8">
            <Scale className="h-3 w-3" /> Cadre Juridique
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-8 font-heading">
            Conditions <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">d'Utilisation</span>
          </h1>
          <p className="text-slate-400 text-xl leading-relaxed">
            Veuillez lire attentivement ces conditions avant d'utiliser notre plateforme agrégative.
          </p>
        </header>

        <section className="space-y-12">
          <div className="bg-amber-500/5 border border-amber-500/20 p-8 rounded-[2rem] flex gap-6 items-start">
            <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 shrink-0">
               <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-amber-500 font-bold mb-2">Avertissement Important</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Morocco InternHub n'est pas l'auteur des offres publiées. Nous déclinons toute responsabilité en cas de fraude, d'annulation d'offre ou de problème découlant d'une candidature effectuée sur un site tiers.
              </p>
            </div>
          </div>

          <div className="bg-[#161822]/40 backdrop-blur-md border border-white/5 p-10 rounded-[2.5rem] prose prose-invert max-w-none text-slate-400 space-y-6">
            <h3 className="text-white text-xl font-bold flex items-center gap-3">
              <Gavel className="w-5 h-5 text-indigo-400" /> 1. Objet
            </h3>
            <p>
              Le présent document a pour but de définir les conditions dans lesquelles vous pouvez utiliser Morocco InternHub. En accédant au site, vous acceptez sans réserve ces conditions.
            </p>

            <h3 className="text-white text-xl font-bold flex items-center gap-3">
              <Gavel className="w-5 h-5 text-indigo-400" /> 2. Exactitude des Données
            </h3>
            <p>
              Bien que nous fassions de notre mieux pour filtrer les offres (pertinence IT, détection de fraude), nous ne pouvons garantir l'exactitude des informations fournies par les sites tiers. Il appartient à l'utilisateur de vérifier la fiabilité de l'employeur.
            </p>

            <h3 className="text-white text-xl font-bold flex items-center gap-3">
              <Gavel className="w-5 h-5 text-indigo-400" /> 3. Propriété Intellectuelle
            </h3>
            <p>
              Tous les logos, noms d'entreprises et contenus des offres appartiennent à leurs propriétaires respectifs. Morocco InternHub n'en revendique aucune propriété et ne fait que faciliter leur découverte par les étudiants.
            </p>

            <h3 className="text-white text-xl font-bold flex items-center gap-3">
              <Gavel className="w-5 h-5 text-indigo-400" /> 4. Responsabilité
            </h3>
            <p>
               L'utilisation du site se fait sous votre entière responsabilité. Morocco InternHub ne pourra être tenu responsable des dommages directs ou indirects résultant de l'utilisation des informations présentes ou de l'impossibilité d'y accéder.
            </p>

            <h3 className="text-white text-xl font-bold flex items-center gap-3">
              <Gavel className="w-5 h-5 text-indigo-400" /> 5. Modifications
            </h3>
            <p>
              Nous nous réservons le droit de modifier ces conditions à tout moment. La version en ligne est celle qui fait foi.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
