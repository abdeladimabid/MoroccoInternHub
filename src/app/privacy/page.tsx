import { Sparkles, ArrowLeft, ShieldCheck, Lock, EyeOff } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-8">
            <ShieldCheck className="h-3 w-3" /> Votre vie privée est protégée
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-8 font-heading">
            Politique de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-500">Confidentialité</span>
          </h1>
          <p className="text-slate-400 text-xl leading-relaxed">
            Nous croyons en une transparence totale sur la manière dont les données sont gérées sur notre plateforme.
          </p>
        </header>

        <section className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-[#161822]/40 border border-white/5 rounded-3xl">
              <Lock className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-white font-bold mb-2">Pas de comptes</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Nous ne vous demandons jamais de créer un compte ou de vous connecter.</p>
            </div>
            <div className="p-6 bg-[#161822]/40 border border-white/5 rounded-3xl">
              <EyeOff className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-white font-bold mb-2">Zéro Tracking</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Nous ne collectons pas de données personnelles identifiables.</p>
            </div>
            <div className="p-6 bg-[#161822]/40 border border-white/5 rounded-3xl">
              <ShieldCheck className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-white font-bold mb-2">Indexation Seule</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Nous ne stockons que les données publiques des offres sources.</p>
            </div>
          </div>

          <div className="bg-[#161822]/40 backdrop-blur-md border border-white/5 p-10 rounded-[2.5rem] prose prose-invert max-w-none text-slate-400 space-y-6">
            <h3 className="text-white text-xl font-bold">1. Nature du Service</h3>
            <p>
              Morocco InternHub est un moteur de recherche agrégatif. Notre rôle se limite à indexer des contenus publics provenant de sites tiers (LinkedIn, Rekrute, etc.) pour aider les étudiants. Nous n'hébergeons pas de CV et ne traitons pas directement les candidatures.
            </p>

            <h3 className="text-white text-xl font-bold">2. Données Collectées</h3>
            <p>
              Nous ne collectons aucune donnée personnelle via des formulaires. Les seules données traitées sont :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Les termes de recherche (anonymisés) pour améliorer les résultats.</li>
              <li>Les statistiques standards de trafic serveur (adresse IP, type de navigateur) sans lien avec votre identité.</li>
            </ul>

            <h3 className="text-white text-xl font-bold">3. Cookies</h3>
            <p>
              Le site peut utiliser des cookies techniques essentiels au fonctionnement de Next.js. Nous n'utilisons pas de cookies publicitaires ou de traçage tiers.
            </p>

            <h3 className="text-white text-xl font-bold">4. Liens Externes</h3>
            <p>
              En cliquant sur "Voir l'offre", vous quittez notre plateforme. Nous ne sommes pas responsables de la politique de confidentialité de ces sites tiers. Nous vous encourageons à la lire attentivement sur chaque site source.
            </p>

            <h3 className="text-white text-xl font-bold">5. Contact</h3>
            <p>
              Pour toute question concernant cette politique, contactez-nous à : <span className="text-indigo-400">abdeladim.abid1@gmail.com</span>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
