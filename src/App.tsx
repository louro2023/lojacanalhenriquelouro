import React, { useState, useEffect } from 'react';
import { GameCard } from './components/GameCard';
import { DownloadModal } from './components/DownloadModal';
import { PasswordPromptModal } from './components/PasswordPromptModal';
import { SupportModal } from './components/SupportModal';
import { DownloadManagerNotice } from './components/DownloadManagerNotice';
import { RealtimeSupporterBoard } from './components/RealtimeSupporterBoard';
import { SiteAccessGate } from './components/SiteAccessGate';
import {
  Gamepad2,
  Sparkles,
  Heart,
  Lock,
} from 'lucide-react';
import {
  GameItem,
  INITIAL_GAMES,
  subscribeGames,
  testFirebaseConnection,
} from './lib/firebase';

export default function App() {
  const [games, setGames] = useState<GameItem[]>(INITIAL_GAMES);
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [pendingPasswordGame, setPendingPasswordGame] = useState<GameItem | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Controle de bloqueio do site (solicita senha ao entrar)
  const [isSiteUnlocked, setIsSiteUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('hg_site_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  // Listen to games catalog in real-time
  useEffect(() => {
    testFirebaseConnection();
    const unsubscribe = subscribeGames((liveGames) => {
      setGames(liveGames);
    });
    return () => unsubscribe();
  }, []);

  // Quando o usuário desbloqueia o site com a senha correta (leigo)
  const handleUnlockSite = () => {
    try {
      sessionStorage.setItem('hg_site_unlocked', 'true');
    } catch {
      // ignore
    }
    setIsSiteUnlocked(true);
    // Abre a mensagem de apoio assim que o usuário entrar no site
    setIsSupportModalOpen(true);
  };

  // Permite bloquear o acesso novamente se desejar
  const handleLockSite = () => {
    try {
      sessionStorage.removeItem('hg_site_unlocked');
    } catch {
      // ignore
    }
    setIsSiteUnlocked(false);
  };

  // Se o site ainda não foi desbloqueado, exibe a tela de solicitação de senha
  if (!isSiteUnlocked) {
    return <SiteAccessGate onUnlock={handleUnlockSite} />;
  }

  // Ao clicar em qualquer jogo, solicita a senha (LEIGO, Leigo ou leigo)
  const handleGameAction = (game: GameItem) => {
    setPendingPasswordGame(game);
    setIsPasswordModalOpen(true);
  };

  // Quando a senha correta for digitada, abre a página/modal de download do jogo
  const handlePasswordSuccess = (game: GameItem) => {
    setIsPasswordModalOpen(false);
    setPendingPasswordGame(null);
    setSelectedGame(game);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      
      {/* Top Header */}
      <header className="w-full border-b border-white/10 bg-[#06080d]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 flex items-center justify-center text-black font-black text-base shadow-md shadow-amber-500/20">
              HG
            </div>
            <span className="text-xl font-black tracking-tight text-white uppercase font-sans">
              Henrique <span className="text-amber-400">Games</span>
            </span>

            {/* PS5 Brand Pill */}
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-black font-black text-[11px] tracking-tight uppercase">
              PS5™
            </span>
          </div>

          {/* Controls & Support Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botão de Apoiar o Projeto (PIX) */}
            <button
              type="button"
              onClick={() => setIsSupportModalOpen(true)}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 active:scale-95 text-black font-black text-xs uppercase tracking-wider shadow-md shadow-amber-400/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-black text-black" />
              <span>Apoiar Canal (PIX)</span>
            </button>

            {/* Botão de Bloquear Acesso */}
            <button
              type="button"
              onClick={handleLockSite}
              title="Bloquear Acesso ao Site"
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-slate-400 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Bloquear</span>
            </button>
          </div>

        </div>
      </header>

      {/* Notice Banner */}
      <div className="w-full bg-gradient-to-r from-slate-900/60 via-amber-950/30 to-slate-900/60 border-b border-white/5 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-slate-300">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Catálogo de jogos liberado! Recomendamos instalar um gerenciador de download para velocidade máxima.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsSupportModalOpen(true)}
            className="text-amber-400 hover:text-amber-300 hover:underline font-bold text-xs cursor-pointer shrink-0"
          >
            Apoiar o Canal (R$ 5) →
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-blue-600/10 to-red-600/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="w-full max-w-6xl flex flex-col items-center text-center relative z-10">
          
          {/* Tag & Section Header */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold mb-4 text-slate-300">
            <Gamepad2 className="w-4 h-4 text-amber-400" />
            <span>Catálogo Oficial de Jogos</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-white font-bold">PlayStation 5</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-sans drop-shadow-sm mb-3">
            Jogos <span className="text-amber-400">PS5</span> Disponíveis
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mb-8 leading-relaxed">
            Confira abaixo os lançamentos disponíveis no catálogo. Selecione o jogo desejado para abrir a página de download oficial.
          </p>

          {/* SESSÃO: GERENCIADORES DE DOWNLOAD RECOMENDADOS E VÍDEO TUTORIAL */}
          <DownloadManagerNotice />

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
      <footer className="w-full border-t border-white/5 py-6 bg-[#06080d] text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Henrique Games</span>
            <span>•</span>
            <span>Jogos para PlayStation 5</span>
          </div>
          <button
            type="button"
            onClick={() => setIsSupportModalOpen(true)}
            className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
          >
            Apoie o Canal via PIX (R$ 5)
          </button>
        </div>
      </footer>

      {/* Modal de Solicitação de Apoio (Abre automaticamente ao entrar na página) */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      {/* Modal de Solicitação de Senha (LEIGO / Leigo / leigo) ao clicar no jogo */}
      <PasswordPromptModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPendingPasswordGame(null);
        }}
        game={pendingPasswordGame}
        onSuccess={handlePasswordSuccess}
      />

      {/* Modal de Download (Abre após o usuário digitar a senha com sucesso) */}
      {selectedGame && (
        <DownloadModal
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          targetGameName={selectedGame.realName}
          targetGameId={selectedGame.id}
          targetDriveUrl={selectedGame.driveUrl}
          onOpenSupport={() => setIsSupportModalOpen(true)}
        />
      )}

    </div>
  );
}
