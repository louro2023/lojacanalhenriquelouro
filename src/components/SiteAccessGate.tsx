import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Youtube,
  CheckCircle2,
  Gamepad2,
  Eye,
  EyeOff,
} from 'lucide-react';

interface SiteAccessGateProps {
  onUnlock: () => void;
}

export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@henriquelouro7848';

export const SiteAccessGate: React.FC<SiteAccessGateProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = password.trim().toLowerCase();

    // Aceita 'LEIGO', 'Leigo' ou 'leigo'
    if (clean === 'leigo') {
      setError('');
      setIsSuccess(true);
      setTimeout(() => {
        onUnlock();
      }, 400);
    } else {
      setError('Senha incorreta! Digite a senha informada no canal Henrique Games para abrir o site.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-amber-400 selection:text-black">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-amber-500/15 via-blue-600/10 to-red-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 p-0.5 shadow-xl shadow-amber-500/20 mb-4 flex items-center justify-center text-black font-black text-2xl">
            HG
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] font-bold text-amber-300 uppercase tracking-widest mb-2">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Acesso Restrito ao Canal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
            Henrique <span className="text-amber-400">Games</span> PS5
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-sm">
            Para garantir que somente pessoas do canal consigam abrir a página e acessar os jogos de PS5 testados e funcionando, digite a senha de acesso:
          </p>
        </div>

        {/* Lock Card Container */}
        <div className="rounded-3xl bg-gradient-to-b from-[#131724] via-[#0e121b] to-[#07090e] border border-amber-500/35 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(245,158,11,0.2)] p-6 sm:p-8 backdrop-blur-md">
          
          {/* Status Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
            {isSuccess ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-400 animate-bounce" />
            ) : (
              <Lock className="w-7 h-7 text-amber-400" />
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <KeyRound className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                placeholder="Digite a senha de acesso..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="w-full text-sm pl-10 pr-10 py-3.5 rounded-xl bg-black/70 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors font-medium text-center shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSuccess}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 active:scale-95 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-400/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSuccess ? 'Liberando Acesso...' : 'Abrir Página do Catálogo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* YouTube Channel Redirect Helper */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400 mb-3">
              Não sabe a senha? A palavra-chave é informada nos vídeos do canal!
            </p>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-200 hover:text-white text-xs font-bold transition-all group"
            >
              <Youtube className="w-4 h-4 text-[#FF0000] fill-[#FF0000] group-hover:scale-110 transition-transform" />
              <span>Acessar Canal Henrique Games</span>
            </a>
          </div>

        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-500 mt-6">
          Henrique Games • Jogos PlayStation 5 testados e funcionando
        </p>

      </div>
    </div>
  );
};
