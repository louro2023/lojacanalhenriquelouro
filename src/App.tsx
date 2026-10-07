import React, { useState, useEffect } from 'react';
import { GameCard } from './components/GameCard';
import { DownloadModal } from './components/DownloadModal';
import { LoginPage } from './components/LoginPage';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { RealtimeSupporterBoard } from './components/RealtimeSupporterBoard';
import {
  Gamepad2,
  Info,
  ShieldCheck,
  Clock,
  Radio,
  LogOut,
  Lock,
  ArrowRight,
  X,
  Sparkles,
  Send,
  ExternalLink,
} from 'lucide-react';
import {
  GameItem,
  UserAccount,
  INITIAL_GAMES,
  subscribeGames,
  subscribeUser,
  testFirebaseConnection,
  getDaysRemaining,
  subscribeSystemSettings,
  SystemSettings,
  DEFAULT_SYSTEM_SETTINGS,
} from './lib/firebase';

const CURRENT_USER_KEY = 'henrique_games_logged_user_id';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [guestPromptGame, setGuestPromptGame] = useState<GameItem | null>(null);
  const [games, setGames] = useState<GameItem[]>(INITIAL_GAMES);
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(DEFAULT_SYSTEM_SETTINGS);

  // Subscribe to license settings
  useEffect(() => {
    const unsub = subscribeSystemSettings(setSystemSettings);
    return () => unsub();
  }, []);

  // Restore saved session if any
  useEffect(() => {
    testFirebaseConnection();

    const savedUserId = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUserId) {
      const unsub = subscribeUser(savedUserId, (u) => {
        if (u && u.status === 'active') {
          setCurrentUser(u);
        } else {
          localStorage.removeItem(CURRENT_USER_KEY);
          setCurrentUser(null);
        }
      });
      return () => unsub();
    }
  }, []);

  // Listen to games catalog in real-time
  useEffect(() => {
    const unsubscribe = subscribeGames((liveGames) => {
      setGames(liveGames);
    });
    return () => unsubscribe();
  }, []);

  // Sync current user in real-time when logged in
  useEffect(() => {
    if (!currentUser) return;
    const unsub = subscribeUser(currentUser.id, (updated) => {
      if (updated) {
        setCurrentUser(updated);
      }
    });
    return () => unsub();
  }, [currentUser?.id]);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setIsGuestMode(false);
    localStorage.setItem(CURRENT_USER_KEY, user.id);
  };

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
    setIsGuestMode(false);
    setIsProfileOpen(false);
    setIsAdminOpen(false);
  };

  const handleGameAction = (game: GameItem) => {
    if (!currentUser) {
      // Guest mode: restrict download and prompt to login
      setGuestPromptGame(game);
    } else {
      setSelectedGame(game);
    }
  };

  // If not logged in and not in guest preview, show login screen
  if (!currentUser && !isGuestMode) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onViewCatalog={() => setIsGuestMode(true)}
      />
    );
  }

  const daysRemaining = currentUser ? getDaysRemaining(currentUser.licenseExpiresAt) : 0;
  const isLicenseExpired = currentUser ? currentUser.role !== 'admin' && daysRemaining <= 0 : false;
  const isGuest = !currentUser;

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

          {/* User Controls & Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Suporte Telegram */}
            <a
              href="https://t.me/+5521981682922"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 hover:text-white font-bold text-xs transition-all cursor-pointer"
              title="Suporte direto no Telegram"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Suporte Telegram</span>
              <span className="md:hidden">Suporte</span>
            </a>

            {/* Badge de Licenças no Header (quando convidado) */}
            {isGuest && systemSettings.noticeEnabled && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-[11px]">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{systemSettings.availableLicenses} licenças restantes</span>
              </span>
            )}

            {/* If in Guest Mode: Button to Login / Request Access */}
            {isGuest ? (
              <button
                type="button"
                onClick={() => setIsGuestMode(false)}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 active:scale-95 text-black font-black text-xs uppercase tracking-wider shadow-md shadow-amber-400/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Entrar / Solicitar Acesso</span>
              </button>
            ) : (
              <>
                {/* Admin Area Button (if admin) */}
                {currentUser.role === 'admin' && (
                  <button
                    type="button"
                    onClick={() => setIsAdminOpen(true)}
                    className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-purple-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">Painel Admin</span>
                    <span className="sm:hidden">Admin</span>
                  </button>
                )}

                {/* User Profile Pill */}
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition-all cursor-pointer text-left group"
                  title="Clique para ver seus dias restantes de acesso"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 text-black font-black text-xs flex items-center justify-center shadow">
                    {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
                  </div>

                  <div className="hidden sm:flex flex-col">
                    <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors leading-none">
                      {currentUser.username}
                    </span>

                    <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                      <span className={`${isLicenseExpired ? 'text-red-400' : 'text-blue-400'} font-bold flex items-center gap-0.5`}>
                        <Clock className="w-2.5 h-2.5" />
                        <span>{currentUser.role === 'admin' ? 'Acesso Admin' : `${daysRemaining} dias`}</span>
                      </span>
                    </div>
                  </div>
                </button>

                {/* Quick Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  title="Sair da Conta"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}

          </div>

        </div>
      </header>

      {/* Notice Banner */}
      <div className="w-full bg-gradient-to-r from-slate-900/60 via-amber-950/30 to-slate-900/60 border-b border-white/5 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {isGuest ? (
                <>
                  <strong>Modo de Visualização:</strong> Você está explorando os jogos disponíveis na loja. O download é restrito a apoiadores com login.
                </>
              ) : (
                'Ambiente exclusivo para apoiadores. Contas Google Drive ativas com máxima disponibilidade.'
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {isGuest ? (
              <button
                type="button"
                onClick={() => setIsGuestMode(false)}
                className="text-amber-400 hover:underline font-bold cursor-pointer"
              >
                Fazer Login para Baixar →
              </button>
            ) : (
              <>
                <span className="text-slate-400">Validade do Acesso:</span>
                <span className={`font-bold px-2 py-0.5 rounded bg-black/40 border border-white/10 ${isLicenseExpired ? 'text-red-400' : 'text-blue-400'}`}>
                  {currentUser.role === 'admin' ? 'Ilimitado (Admin)' : `${daysRemaining} dias restantes`}
                </span>
              </>
            )}
          </div>
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
          
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mb-10 leading-relaxed">
            {isGuest ? (
              <span>
                Confira abaixo os jogos disponíveis no catálogo. Para liberar o download, faça login ou solicite seu acesso de apoiador.
              </span>
            ) : (
              <span>
                Ambiente exclusivo para apoiadores do canal. Selecione o jogo desejado abaixo e clique em <strong>BAIXAR</strong>.
              </span>
            )}
          </p>

          {/* GAMES SHOWCASE GRID */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch justify-items-center mb-6">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isGuest={isGuest}
                onDownload={handleGameAction}
              />
            ))}
          </div>

          {/* Real-time Community Board */}
          <RealtimeSupporterBoard />

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-4 bg-[#06080d]" />

      {/* Guest Restriction Modal (shown when guest clicks to download a game) */}
      {guestPromptGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setGuestPromptGame(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-md rounded-3xl bg-[#0e121a] border border-amber-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(245,158,11,0.2)] p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 duration-200 text-center">
            <button
              onClick={() => setGuestPromptGame(null)}
              type="button"
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{guestPromptGame.realName}</span>
            </div>

            <h3 className="text-xl font-black text-white uppercase tracking-tight font-sans">
              Download Exclusivo para Apoiadores
            </h3>

            {systemSettings.noticeEnabled && (
              <div className="mt-3 mb-2 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Aviso: No momento temos somente {systemSettings.availableLicenses} licenças disponíveis!</span>
              </div>
            )}

            <p className="text-xs text-slate-300 mt-2 mb-6 leading-relaxed">
              O download deste jogo está disponível apenas para membros e apoiadores com login ativo. Faça login ou solicite seu acesso de 30 dias para baixar!
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setGuestPromptGame(null);
                  setIsGuestMode(false);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 active:scale-95 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Fazer Login / Solicitar Acesso</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://t.me/+5521981682922"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Já me apoiou antes? Chame no Telegram para desconto</span>
              </a>

              <button
                type="button"
                onClick={() => setGuestPromptGame(null)}
                className="py-2.5 px-4 text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Continuar apenas visualizando o catálogo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal (shows remaining license days) */}
      {currentUser && (
        <UserProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* Admin Dashboard Modal (approve users and set license days) */}
      {currentUser && currentUser.role === 'admin' && (
        <AdminDashboardModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Download Modal (liberado diretamente para apoiadores logados sem nenhuma senha) */}
      {currentUser && selectedGame && (
        <DownloadModal
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          targetGameName={selectedGame.realName}
          targetGameId={selectedGame.id}
          targetDriveUrl={selectedGame.driveUrl}
          user={currentUser}
          onCreditConsumed={() => {
            // Stats update via Firebase listener
          }}
        />
      )}

    </div>
  );
}
