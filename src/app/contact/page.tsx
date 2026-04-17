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

      <div className="relative z-10 max-w-5xl mx-auto px-8 pt-24 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-8">
              <MessageSquare className="h-3 w-3" /> Get in touch
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9] mb-12 font-heading">
              Une idée ? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-500 to-purple-500">Parlons-en.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-md">
              Que ce soit pour un bug, un partenariat ou simplement pour dire bonjour, je suis toujours ouvert aux discussions.
            </p>
          </div>

          <div className="relative">
             {/* Decorative background for the CTA */}
             <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 blur-3xl opacity-30 rounded-[3rem]"></div>
             
             <div className="relative bg-[#161822]/60 backdrop-blur-2xl border border-white/5 p-12 rounded-[3.5rem] shadow-2xl">
               <div className="mb-12">
                 <h3 className="text-2xl font-bold text-white mb-4 font-heading">Coordonnées</h3>
                 <p className="text-slate-500 text-sm">Cliquez sur le lien ci-dessous pour m'envoyer un message directement par email.</p>
               </div>

               <div className="space-y-6">
                 <a 
                   href="mailto:abdeladim.abid1@gmail.com" 
                   className="flex flex-col gap-2 p-8 bg-[#0f111a]/50 border border-white/5 rounded-3xl hover:border-indigo-500/30 hover:bg-[#0f111a] transition-all group"
                 >
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Principal</span>
                   <span className="text-xl md:text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                     abdeladim.abid1@gmail.com
                     <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </span>
                 </a>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white/5 border border-white/5 rounded-[2rem]">
                       <h4 className="text-white font-bold text-xs mb-1">Support</h4>
                       <p className="text-slate-500 text-[10px]">Bug tracking & fixes</p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/5 rounded-[2rem]">
                       <h4 className="text-white font-bold text-xs mb-1">Business</h4>
                       <p className="text-slate-500 text-[10px]">Partnerships & API</p>
                    </div>
                 </div>
               </div>

               <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                 <div className="flex gap-4">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Disponible pour discuter</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
