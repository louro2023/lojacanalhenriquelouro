import React from 'react';
import {
  X,
  User,
  Calendar,
  Clock,
  LogOut,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Send,
} from 'lucide-react';
import { UserAccount, getDaysRemaining } from '../lib/firebase';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
}) => {
  if (!isOpen) return null;

  const daysRemaining = getDaysRemaining(user.licenseExpiresAt);
  const isExpired = user.role !== 'admin' && daysRemaining <= 0;
  const expirationDateFormatted = user.licenseExpiresAt
    ? new Date(user.licenseExpiresAt).toLocaleDateString('pt-BR')
    : 'Não definida';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-3xl bg-[#0e121b] border border-amber-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(245,158,11,0.2)] p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Fechar perfil"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center pb-5 border-b border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 text-black font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 mb-3">
            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>

          <h3 className="text-xl font-black text-white uppercase tracking-tight font-sans">
            {user.username}
          </h3>
          <p className="text-xs text-slate-400">{user.email}</p>

          <div className="mt-2.5">
            {user.role === 'admin' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Administrador do Sistema</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Apoiador Ativo</span>
              </span>
            )}
          </div>
        </div>

        {/* Card: Dias Restantes de Licença */}
        <div className="my-5 p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/30 flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
            <Clock className="w-5 h-5" />
          </div>
          
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Tempo de Acesso Restante
          </span>
          
          <span className="text-3xl sm:text-4xl font-black text-white font-sans mt-1">
            {user.role === 'admin' ? 'Ilimitado' : isExpired ? 'Expirado' : `${daysRemaining} dias`}
          </span>

          <span className="text-xs text-blue-300 font-medium mt-1.5">
            {user.role === 'admin'
              ? 'Licença Permanente de Administrador'
              : isExpired
              ? 'Sua licença de 30 dias terminou'
              : `Faltam ${daysRemaining} dias para seu acesso terminar`}
          </span>
        </div>

        {/* Expiration date details */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Validade do Acesso:</span>
          </div>
          <span className="font-bold text-white">{expirationDateFormatted}</span>
        </div>

        {/* Warning if expired */}
        {user.role !== 'admin' && isExpired && (
          <div className="p-3.5 mb-5 rounded-xl bg-red-950/50 border border-red-500/30 flex flex-col gap-2.5 text-xs text-red-200 text-left">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>
                Sua licença de 30 dias terminou. Para renovar seu acesso, realize o PIX e envie o comprovante no suporte Telegram.
              </span>
            </div>
            <a
              href="https://t.me/+5521981682922"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Falar no Suporte Telegram</span>
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onLogout}
            className="flex-1 py-3 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair da Conta</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
