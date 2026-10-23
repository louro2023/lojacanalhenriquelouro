import React, { useState } from 'react';
import {
  X,
  Download,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Heart,
  Gamepad2,
} from 'lucide-react';
import { incrementDownload } from '../lib/firebase';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetGameName: string;
  targetGameId: string;
  targetDriveUrl: string;
  onOpenSupport?: () => void;
}

export const MELI_SPONSOR_URL = 'https://meli.la/1KFizS8';

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  targetGameName,
  targetGameId,
  targetDriveUrl,
  onOpenSupport,
}) => {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    setDownloadStarted(true);
    incrementDownload(targetGameId).catch(console.error);

    // Abre sempre uma nova guia com o link de afiliado / patrocinador
    try {
      window.open(MELI_SPONSOR_URL, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('Erro ao abrir nova guia patrocinador:', err);
    }

    if (!targetDriveUrl) {
      e.preventDefault();
    }
  };

  const handleCopyLink = async () => {
    if (!targetDriveUrl) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(targetDriveUrl);
      } else {
        const ta = document.createElement('textarea');
        ta.value = targetDriveUrl;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);

      // Abre também a nova guia ao copiar o link de download
      try {
        window.open(MELI_SPONSOR_URL, '_blank', 'noopener,noreferrer');
      } catch {
        // ignore
      }
    } catch (err) {
      console.warn('Erro ao copiar:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0c1424] via-[#090f1a] to-[#050811] border border-cyan-500/35 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(0,210,255,0.25)] p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 duration-200 text-center">
        
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
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(0,210,255,0.2)]">
          <Download className="w-7 h-7" />
        </div>

        {/* Game Title */}
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-300 uppercase tracking-widest mb-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{targetGameName}</span>
        </div>

        <h3 className="text-xl font-black text-white uppercase tracking-tight font-sans">
          Download do Jogo Liberado!
        </h3>

        <p className="text-xs text-slate-300 mt-1 mb-5 leading-relaxed">
          Link oficial de alta velocidade no servidor seguro. Clique no botão abaixo para iniciar o download ou copie o link direto.
        </p>

        {/* Informação sobre Senha de Descompactação */}
        <div className="p-3 mb-4 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-center animate-in fade-in shadow-[0_0_15px_rgba(0,210,255,0.15)]">
          <p className="text-xs font-bold text-cyan-200">
            A senha para descompactar podem ser <span className="text-white font-black">&quot;SuperPSX ou DLPSGAME.COM OU [DLPSGAME.COM]&quot;</span>
          </p>
        </div>

        {/* Success Feedback if downloaded */}
        {downloadStarted && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex flex-col items-center justify-center gap-1 animate-in fade-in">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Link aberto em nova guia!</span>
            </div>
            <span className="text-[11px] text-emerald-400/90 font-normal">
              Seu download deve começar automaticamente pelo navegador.
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="w-full space-y-2.5">
          {/* Main Download Button */}
          <a
            href={targetDriveUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDownloadClick}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,210,255,0.35)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Fazer Download Agora (Link Direto)</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

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
                <span>Copiar Link de Download</span>
              </>
            )}
          </button>

          {/* Support prompt banner inside modal */}
          {onOpenSupport && (
            <div className="mt-4 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-center shadow-[0_0_15px_rgba(0,210,255,0.1)]">
              <div className="flex items-center justify-center gap-1.5 text-cyan-300 font-bold text-xs mb-1">
                <Heart className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                <span>Gostou do catálogo?</span>
              </div>
              <p className="text-[11px] text-slate-300 mb-2">
                Ajude o canal Henrique Louro com uma contribuição voluntária no PIX.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSupport();
                }}
                className="py-1.5 px-3 rounded-lg bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:brightness-110 text-black font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1 shadow-md shadow-cyan-400/20"
              >
                <span>Apoiar o Projeto (PIX)</span>
              </button>
            </div>
          )}

          <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
            💡 Após baixar, basta seguir o tutorial de instalação no console PS5.
          </p>
        </div>

      </div>
    </div>
  );
};
