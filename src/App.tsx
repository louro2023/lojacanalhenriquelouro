import React from 'react';
import {
  AlertTriangle,
  ServerOff,
  Heart,
  ExternalLink,
  Youtube,
  MessageCircle,
  Send,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

const SUPPORTERS_URL = 'https://ajudeocanal.vercel.app/';

export default function App() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      
      {/* Top Header - Henrique Games */}
      <header className="w-full border-b border-white/10 bg-[#06080d]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 flex items-center justify-center text-black font-black text-base shadow-md shadow-amber-500/20">
              HG
            </div>
            <span className="text-xl font-black tracking-tight text-white uppercase font-sans">
              Henrique <span className="text-amber-400">Games</span>
            </span>
          </div>

          {/* Status Badge in Header */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Fora do Ar</span>
            </div>
            <a
              href={SUPPORTERS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-sm shadow-purple-600/20 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Página de Apoiadores</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Announcement Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-red-600/10 via-amber-600/10 to-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-3xl flex flex-col items-center text-center relative z-10">
          
          {/* Status Alert Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <span>Aviso aos Visitantes e Apoiadores</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-sans drop-shadow-sm mb-4">
            Página da Loja <span className="text-amber-400">Desativada</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-8">
            Precisamos retirar a página da loja temporariamente do ar para reestruturar a forma de distribuição dos jogos. Confira os motivos e os próximos passos abaixo.
          </p>

          {/* Detailed Announcement Cards */}
          <div className="w-full space-y-4 text-left mb-10">
            
            {/* Card 1: Problemas com o Google & Doações Insuficientes */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0e121b] border border-red-500/25 shadow-xl">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wide">
                    Problemas com o Google e Servidor
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    Estamos enfrentando <strong>muitos problemas relacionados ao Google</strong> (bloqueios constantes, limitações severas de download e cotas esgotadas que prejudicam a experiência de todos).
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    Infelizmente, <strong>as doações recebidas foram insuficientes para a aquisição de um servidor próprio e dedicado</strong>, o que inviabiliza manter a loja no ar com essa infraestrutura atual.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Soluções em Estudo (Grupo Privado WhatsApp / Telegram) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0e121b] border border-amber-500/25 shadow-xl">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wide">
                    Novas Soluções em Avaliação
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    Para contornar esses bloqueios, estamos pensando em alternativas seguras e diretas, como a criação de um <strong>grupo privado no WhatsApp ou Telegram exclusivo com os apoiadores</strong> do canal.
                  </p>
                  <p className="text-xs sm:text-sm text-amber-200/90 font-medium mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 leading-relaxed">
                    💬 <strong>Concorda com essa ideia?</strong> Deixe um comentário em qualquer vídeo do nosso canal no YouTube pedindo a criação do grupo! Sua opinião é fundamental para decidirmos juntos.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                      <MessageCircle className="w-3.5 h-3.5" />
                      Grupo Privado no WhatsApp
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-300 font-semibold">
                      <Send className="w-3.5 h-3.5" />
                      Grupo Exclusivo no Telegram
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Avisos no YouTube */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0e121b] border border-red-600/25 shadow-xl">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-600/30 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wide">
                    Fique Ligado no Canal do YouTube!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    Em breve teremos <strong>mais informações e comunicados oficiais</strong> sobre a criação do grupo privado ou outro método seguro de disponibilização dos jogos diretamente nos vídeos e na comunidade do <strong>canal do YouTube (Henrique Louro)</strong>!
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Prominent Callout to Supporters Page */}
          <div className="w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#181328] via-[#100e1c] to-[#0a0812] border-2 border-purple-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(168,85,247,0.25)] flex flex-col items-center text-center">
            
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center mb-4 shadow-inner">
              <Heart className="w-7 h-7 fill-purple-400 text-purple-400 animate-pulse" />
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Espaço Exclusivo</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans">
              Página Exclusiva de Apoiadores
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 mb-6 max-w-md leading-relaxed">
              Quer continuar acompanhando as novidades e apoiando o canal? Acesse agora a nossa página dedicada para apoiadores!
            </p>

            {/* Main Action Button */}
            <a
              href={SUPPORTERS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-md py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Heart className="w-5 h-5 fill-white text-white" />
              <span>Acessar Página de Apoiadores</span>
              <ExternalLink className="w-4 h-4 opacity-90" />
            </a>

            <span className="text-[11px] text-slate-400 mt-3 font-mono">
              ajudeocanal.vercel.app
            </span>
          </div>

        </div>

      </main>

      {/* Minimalist Footer */}
      <footer className="w-full border-t border-white/10 py-6 text-center text-xs text-slate-500 bg-[#06080d]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold text-slate-400">Henrique Games</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500">
            <a
              href={SUPPORTERS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Página de Apoiadores
            </a>
            <span>•</span>
            <p className="text-[11px]">Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
