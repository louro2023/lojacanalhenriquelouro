import React, { useState, useEffect } from 'react';
import { GameCard } from './components/GameCard';
import { DownloadModal } from './components/DownloadModal';
import { SupportModal } from './components/SupportModal';
import { RealtimeSupporterBoard } from './components/RealtimeSupporterBoard';
import { SiteAccessGate } from './components/SiteAccessGate';
import { TelegramPromoBanner, TELEGRAM_GROUP_URL } from './components/TelegramPromoBanner';
import {
  Gamepad2,
  Sparkles,
  Heart,
  Lock,
  Youtube,
  ShieldCheck,
  Send,
} from 'lucide-react';
import {
  GameItem,
  INITIAL_GAMES,
  subscribeGames,
  testFirebaseConnection,
} from './lib/firebase';

export const LOGO_PATH = '/assets/aistudio/ChatGPT_Image_8_de_out._de_2026__16_49_15_9997978e.png';
const SUB4UNLOCK_KEY = 'hg_mandatory_sub4unlock_v4';

export default function App() {
  const [games, setGames] = useState<GameItem[]>(INITIAL_GAMES);
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Controle estrito de acesso via Sub4Unlock (Inscrição Obrigatória para Desbloquear)
  const [isSiteUnlocked, setIsSiteUnlocked] = useState<boolean>(() => {
    try {
      // Limpa chaves legadas para garantir que o fluxo de inscrição obrigatória seja sempre acionado
      sessionStorage.removeItem('hg_site_unlocked');
      sessionStorage.removeItem('hg_channel_subscribed_v3');
      return sessionStorage.getItem(SUB4UNLOCK_KEY) === 'true';
    } catch {
      return false;
    }
  });


  // Escuta os jogos cadastrados no Firebase em tempo real
  useEffect(() => {
    testFirebaseConnection();
    const unsubscribe = subscribeGames((liveGames) => {
      setGames(liveGames);
    });
    return () => unsubscribe();
  }, []);

  // Quando o fluxo de Sub4Unlock e tela de apoio for concluído
  const handleUnlockSite = () => {
    try {
      sessionStorage.setItem(SUB4UNLOCK_KEY, 'true');
    } catch {
      // ignore
    }
    setIsSiteUnlocked(true);
    setIsSupportModalOpen(false);
  };

  // Permite trancar o acesso novamente para testar a tela Sub4Unlock
  const handleLockSite = () => {
    try {
      sessionStorage.removeItem(SUB4UNLOCK_KEY);
      sessionStorage.removeItem('hg_site_unlocked');
      sessionStorage.removeItem('hg_channel_subscribed_v3');
    } catch {
      // ignore
    }
    setIsSiteUnlocked(false);
  };

  // Se o site ainda não foi desbloqueado pela inscrição obrigatória, exibe a tela de Sub4Unlock
  if (!isSiteUnlocked) {
    return <SiteAccessGate onUnlock={handleUnlockSite} />;
  }

  // Ao clicar em qualquer jogo: a senha leigo não é mais necessária! Abre direto o download
  const handleGameAction = (game: GameItem) => {
    setSelectedGame(game);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-cyan-400 selection:text-black">
      
      {/* Top Header */}
      <header className="w-full border-b border-cyan-500/20 bg-[#070c18]/90 backdrop-blur-md sticky top-0 z-30 shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-cyan-400 opacity-60 blur-sm group-hover:opacity-100 transition-opacity" />
              <img
                src={LOGO_PATH}
                alt="Logo Canal Henrique Louro"
                className="relative w-11 h-11 rounded-full border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.6)] object-cover shrink-0 hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white uppercase font-sans leading-tight">
                LOJA DE JOGOS CANAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">HENRIQUE LOURO</span>
              </span>
            </div>

            {/* PS5 Brand Pill */}
            <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-black font-black text-[11px] tracking-tight uppercase shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.4)]">
              PS5™
            </span>
          </div>

          {/* Controls & Support Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Status da Inscrição */}
            <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inscrito Verificado</span>
            </div>

            {/* Botão Grupo VIP Telegram */}
            <a
              href={TELEGRAM_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 sm:px-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:brightness-110 active:scale-95 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(14,165,233,0.35)] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 fill-white text-white" />
              <span className="hidden sm:inline">Grupo Telegram (Ofertas)</span>
              <span className="sm:hidden">Telegram</span>
            </a>

            {/* Botão de Apoiar o Projeto (PIX) */}
            <button
              type="button"
              onClick={() => setIsSupportModalOpen(true)}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:brightness-110 active:scale-95 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,210,255,0.35)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-black text-black" />
              <span>Apoiar Canal (PIX)</span>
            </button>

            {/* Botão de Trancar Acesso (Sub4Unlock) */}
            <button
              type="button"
              onClick={handleLockSite}
              title="Trancar Acesso para testar tela Sub4Unlock"
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-cyan-500/10 active:scale-95 text-cyan-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-cyan-500/30 shadow-[0_0_10px_rgba(0,210,255,0.15)]"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Trancar</span>
            </button>
          </div>

        </div>
      </header>

      {/* Notice Banner */}
      <div className="w-full bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 border-b border-cyan-500/15 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-slate-300">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
            <span>
              Catálogo de jogos liberado para inscritos! Aproveite os lançamentos testados e funcionando no PS5.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsSupportModalOpen(true)}
            className="text-cyan-400 hover:text-cyan-300 hover:underline font-bold text-xs cursor-pointer shrink-0"
          >
            Apoiar o Canal (R$ 5) →
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="w-full max-w-6xl flex flex-col items-center text-center relative z-10">
          
          {/* Logo Showcase Header Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#0c1427]/90 via-[#0a1122]/95 to-[#070c18]/90 border border-cyan-500/35 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(0,210,255,0.18)] max-w-2xl w-full">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-cyan-400 opacity-60 blur-sm group-hover:opacity-100 transition-opacity" />
              <img
                src={LOGO_PATH}
                alt="Canal Henrique Louro Logo Oficial"
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,210,255,0.65)] object-cover shrink-0"
              />
            </div>
            <div className="text-center sm:text-left">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-[10px] font-black uppercase tracking-wider text-cyan-300 mb-1">
                Dúvidas PS5 • Inscritos Oficiais
              </div>
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight font-sans">
                Jogos Testados &amp; Prontos para PS5
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Acesse os melhores jogos testados com suporte direto do Canal Henrique Louro!
              </p>
            </div>
          </div>

          {/* Tag & Section Header */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold mb-4 text-cyan-200 shadow-[0_0_15px_rgba(0,210,255,0.15)]">
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            <span>LOJA DE JOGOS CANAL HENRIQUE LOURO</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-white font-bold">PlayStation 5</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-sans drop-shadow-sm mb-3">
            Jogos <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">PS5</span> Disponíveis
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mb-8 leading-relaxed">
            Confira abaixo os lançamentos disponíveis no catálogo da <strong>LOJA DE JOGOS CANAL HENRIQUE LOURO</strong>. Clique no jogo desejado para iniciar o download oficial.
          </p>

          {/* BANNER OFERTAS & ACESSÓRIOS TELEGRAM */}
          <TelegramPromoBanner />

          {/* GAMES SHOWCASE GRID */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch justify-items-center mb-6">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onDownload={handleGameAction}
              />
            ))}
          </div>

          {/* Real-time Community Board */}
          <RealtimeSupporterBoard />

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-cyan-500/15 py-6 bg-[#04060d] text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src={LOGO_PATH}
              alt="Logo"
              className="w-6 h-6 rounded-full border border-cyan-400/50 object-cover"
            />
            <span className="font-bold text-slate-300">LOJA DE JOGOS CANAL HENRIQUE LOURO</span>
            <span>•</span>
            <span className="text-cyan-400 font-semibold">Jogos para PlayStation 5</span>
          </div>
          <button
            type="button"
            onClick={() => setIsSupportModalOpen(true)}
            className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer transition-colors"
          >
            Apoie o Canal via PIX (R$ 5)
          </button>
        </div>
      </footer>

      {/* Modal de Solicitação de Apoio (Abre automaticamente sempre que alguém entrar no site) */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        isSubscribedConfirmed={isSiteUnlocked}
      />

      {/* Modal de Download Direto (Abre diretamente ao clicar no jogo, sem senha!) */}
      {selectedGame && (
        <DownloadModal
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          targetGameName={selectedGame.realName}
          targetGameId={selectedGame.id}
          targetDriveUrl={selectedGame.driveUrl}
          partnerCredit={selectedGame.partnerCredit}
          extraLinks={selectedGame.extraLinks}
          onOpenSupport={() => setIsSupportModalOpen(true)}
        />
      )}

    </div>
  );
}
