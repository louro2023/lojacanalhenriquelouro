import React, { useState } from 'react';
import {
  X,
  Lock,
  KeyRound,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { GameItem } from '../lib/firebase';

interface PasswordPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: GameItem | null;
  onSuccess: (game: GameItem) => void;
}

export const PasswordPromptModal: React.FC<PasswordPromptModalProps> = ({
  isOpen,
  onClose,
  game,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !game) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = password.trim().toLowerCase();

    // Aceita 'LEIGO', 'Leigo' ou 'leigo'
    if (clean === 'leigo') {
      setError('');
      setPassword('');
      onSuccess(game);
    } else {
      setError('Senha incorreta! Digite a senha correta para prosseguir.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0c1424] via-[#090f1a] to-[#050811] border border-cyan-500/35 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(0,210,255,0.25)] p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 duration-200 text-center">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          type="button"
          aria-label="Fechar"
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Channel Logo Icon */}
        <div className="relative mx-auto mb-3 w-14 h-14">
          <img
            src="/logo_canal.png"
            alt="Logo Canal Henrique Louro"
            className="w-14 h-14 rounded-full border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.5)] object-cover"
          />
        </div>

        {/* Game Title Tag */}
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-300 uppercase tracking-widest mb-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{game.realName}</span>
        </div>

        <h3 className="text-xl font-black text-white uppercase tracking-tight font-sans">
          Liberar Download do Jogo
        </h3>

        <p className="text-xs text-slate-300 mt-1 mb-5 leading-relaxed">
          Digite a senha para abrir a página de download oficial deste jogo:
        </p>

        {/* Error Alert */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <KeyRound className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              placeholder="Digite a senha de acesso..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              className="w-full text-sm pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-medium text-center shadow-inner"
            />
          </div>

          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-200 font-medium">
            💡 Digite a senha informada no canal Henrique Louro para desbloquear o link.
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:brightness-110 active:scale-95 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-400/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Desbloquear Download</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
