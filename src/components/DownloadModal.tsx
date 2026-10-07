import React, { useState } from 'react';
import {
  X,
  AlertCircle,
  Download,
  Sparkles,
  Clock,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Send,
  ShieldCheck,
} from 'lucide-react';
import {
  UserAccount,
  consumeDownloadCredit,
  getDaysRemaining,
} from '../lib/firebase';

const TELEGRAM_SUPPORT_URL = 'https://t.me/+5521981682922';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetGameName: string;
  targetGameId: string;
  targetDriveUrl: string;
  user: UserAccount;
  onCreditConsumed: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  targetGameName,
  targetGameId,
  targetDriveUrl,
  user,
  onCreditConsumed,
}) => {
  const [loading, setLoading] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const daysRemaining = getDaysRemaining(user.licenseExpiresAt);
  const isExpired = user.role !== 'admin' && daysRemaining <= 0;

  const handleDownloadClick = async () => {
    if (isExpired) {
      setErrorMessage('Sua licença de 30 dias expirou. Entre em contato com o suporte para renovar.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // Consume credit / record download event in Firebase
      await consumeDownloadCredit(user.id, targetGameId);
      onCreditConsumed();
    } catch (err) {
      console.warn('Erro ao atualizar estatísticas:', err);
    } finally {
      setLoading(false);
      setDownloadStarted(true);

      // Open Google Drive link in a new tab
      if (targetDriveUrl) {
        window.open(targetDriveUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleCopyLink = () => {
    if (!targetDriveUrl) return;
    navigator.clipboard.writeText(targetDriveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-3xl bg-[#0e121a] border border-amber-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(245,158,11,0.2)] p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 duration-200 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Fechar"
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Download Icon with Glow */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <Download className="w-7 h-7" />
        </div>

        {/* Game Title */}
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{targetGameName}</span>
        </div>

        <h3 className="text-xl font-black text-white uppercase tracking-tight font-sans">
          Download Liberado!
        </h3>

        <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
          Você já está autenticado como apoiador. Clique no botão abaixo para baixar diretamente sem necessidade de senha.
        </p>

        {/* License status badge */}
        <div className="mb-4 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 flex items-center justify-center gap-2">
          {user.role === 'admin' ? (
            <>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <strong className="text-purple-300">Acesso Permanente (Administrador)</strong>
            </>
          ) : isExpired ? (
            <>
              <AlertCircle className="w-4 h-4 text-red-400" />
              <strong className="text-red-400">Licença Expirada (0 dias restantes)</strong>
            </>
          ) : (
            <>
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>
                Acesso Ativo: <strong className="text-blue-400">Faltam {daysRemaining} dias</strong>
              </span>
            </>
          )}
        </div>

        {/* Success Feedback if downloaded */}
        {downloadStarted && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Download iniciado no Google Drive! Bom jogo!</span>
          </div>
        )}

        {/* Error Message Box (e.g. Expired) */}
        {errorMessage && (
          <div className="p-3.5 mb-4 rounded-xl bg-red-950/60 border border-red-500/40 text-left flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-red-200 leading-snug">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="w-full space-y-2.5">
          {isExpired ? (
            <div className="space-y-2">
              <a
                href={TELEGRAM_SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Renovar Licença via Telegram</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="py-2 text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Fechar
              </button>
            </div>
          ) : (
            <>
              {/* Main Download Button */}
              <button
                type="button"
                onClick={handleDownloadClick}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span>Iniciando Download...</span>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Baixar Agora no Google Drive</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </>
                )}
              </button>

              {/* Copy Direct Link Button */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">Link Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copiar Link do Google Drive</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                💡 Após baixar pelo Google Drive, basta seguir o tutorial de instalação no PS5 do canal Henrique Louro.
              </p>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
