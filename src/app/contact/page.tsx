import { Sparkles, ArrowLeft, Mail, MessageSquare, Send } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
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
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-8">
            <MessageSquare className="h-3 w-3" /> Une suggestion ou une question ?
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-8 font-heading">
            Entrer en <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Contact</span>
          </h1>
          <p className="text-slate-400 text-xl leading-relaxed max-w-2xl mx-auto">
            Vous avez trouvé un bug ? Vous voulez ajouter une nouvelle source ? Nous sommes à votre écoute.
          </p>
        </header>

        <section className="flex flex-col items-center gap-8">
           <div className="w-full max-w-md bg-[#161822]/40 backdrop-blur-md border border-white/5 p-12 rounded-[3rem] text-center">
             <div className="w-20 h-20 bg-indigo-600/20 border border-indigo-500/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/20">
               <Mail className="w-8 h-8 text-indigo-400" />
             </div>
             
             <h2 className="text-2xl font-bold text-white mb-2 font-heading">Direct Email</h2>
             <p className="text-slate-500 mb-8">Nous essayons de répondre en moins de 24h.</p>
             
             <a 
               href="mailto:abdeladim.abid1@gmail.com" 
               className="inline-flex items-center gap-3 px-8 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95 group"
             >
               abdeladim.abid1@gmail.com
               <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
             </a>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="p-8 bg-[#161822]/40 border border-white/5 rounded-[2rem]">
                 <h3 className="text-white font-bold mb-2">Support Technique</h3>
                 <p className="text-slate-500 text-sm">Pour tout problème d'affichage ou erreur de recherche.</p>
              </div>
              <div className="p-8 bg-[#161822]/40 border border-white/5 rounded-[2rem]">
                 <h3 className="text-white font-bold mb-2">Partenariats</h3>
                 <p className="text-slate-500 text-sm">Vous êtes une plateforme d'emploi et voulez être intégré ?</p>
              </div>
           </div>
        </section>
      </div>
    </main>
  );
}
