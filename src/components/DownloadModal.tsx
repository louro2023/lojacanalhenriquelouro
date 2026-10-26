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
  Send,
  Youtube,
  ShoppingBag,
} from 'lucide-react';
import {
  incrementDownload,
  PartnerCredit,
  GameExtraLink,
  PARTNER_GAME_IDS,
  RAFAEL_PARTNER_CREDIT,
} from '../lib/firebase';
import { triggerAffiliateLink } from '../lib/affiliate';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetGameName: string;
  targetGameId: string;
  targetDriveUrl: string;
  onOpenSupport?: () => void;
  partnerCredit?: PartnerCredit;
  extraLinks?: GameExtraLink[];
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  targetGameName,
  targetGameId,
  targetDriveUrl,
  onOpenSupport,
  partnerCredit,
  extraLinks,
}) => {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Garante de forma 100% definitiva a exibição do canal parceiro nos 18 novos títulos
  const effectivePartnerCredit =
    partnerCredit || (PARTNER_GAME_IDS.has(targetGameId) ? RAFAEL_PARTNER_CREDIT : undefined);

  // Manipulador de download: contabiliza, dispara link alternado de afiliado e indica início
  const handleDownloadClick = () => {
    setDownloadStarted(true);
    incrementDownload(targetGameId).catch(console.error);
    try {
      triggerAffiliateLink();
    } catch (err) {
      console.warn('Erro ao abrir afiliado:', err);
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

        {/* Crédito Exclusivo do Canal Parceiro (Exibido SOMENTE nos títulos novos fornecidos por ele) */}
        {effectivePartnerCredit && (
          <div className="p-3.5 mb-4 rounded-2xl bg-gradient-to-r from-red-950/70 via-[#180a0e] to-slate-900 border-2 border-red-500/50 text-center animate-in fade-in shadow-[0_0_25px_rgba(239,68,68,0.3)]">
            <div className="flex items-center justify-center gap-1.5 text-rose-300 font-black text-xs uppercase tracking-wider mb-1">
              <Youtube className="w-4 h-4 text-red-500 fill-red-500 shrink-0" />
              <span>Fornecido por Canal Parceiro</span>
            </div>
            <p className="text-xs text-slate-200 mb-2.5 leading-relaxed">
              Este título foi fornecido pelo canal parceiro{' '}
              <strong className="text-red-300 font-extrabold">{effectivePartnerCredit.name}</strong>!
            </p>
            <a
              href={effectivePartnerCredit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:brightness-110 active:scale-95 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 touch-manipulation"
            >
              <Youtube className="w-4 h-4 fill-white shrink-0" />
              <span>Visitar Canal Rafael no YouTube</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
            </a>
          </div>
        )}

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
          {/* Main Download Button (otimizado e 100% funcional no celular) */}
          <a
            href={targetDriveUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDownloadClick}
            className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,210,255,0.35)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation select-none"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Fazer Download Agora (Link Direto)</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70 shrink-0" />
          </a>

          {/* Extra Download Links (Unlocker / Partes Adicionais) */}
          {extraLinks && extraLinks.length > 0 && (
            <div className="space-y-2 pt-1 pb-1">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block text-left">
                📦 Arquivos Adicionais / Desbloqueio:
              </span>
              {extraLinks.map((extra, idx) => (
                <a
                  key={idx}
                  href={extra.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>{extra.name}</span>
                  <ExternalLink className="w-3 h-3 opacity-75" />
                </a>
              ))}
            </div>
          )}

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

          {/* Telegram Promo Banner in Modal */}
          <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-sky-950/60 to-blue-950/60 border border-sky-500/30 text-center shadow-[0_0_15px_rgba(14,165,233,0.15)]">
            <div className="flex items-center justify-center gap-1.5 text-sky-300 font-bold text-xs mb-1">
              <Send className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
              <span>Acessórios &amp; Ofertas PS5</span>
            </div>
            <p className="text-[11px] text-slate-300 mb-2 leading-relaxed">
              Entre no nosso grupo do Telegram! Postamos produtos com desconto para melhorar seu PS5. Ao comprar, você também apoia o canal!
            </p>
            <a
              href="https://t.me/+VLztuPp9D4BlM2Fh"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-3 rounded-lg bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 hover:brightness-110 text-white font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-md shadow-sky-500/25"
            >
              <Send className="w-3 h-3 fill-white" />
              <span>Entrar no Grupo Telegram</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Banner de Oferta Alternada Mercado Livre */}
          <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#18120a] to-slate-900 border border-amber-500/35 text-center shadow-[0_0_15px_rgba(245,158,11,0.12)]">
            <div className="flex items-center justify-center gap-1.5 text-amber-300 font-bold text-xs mb-1">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Oferta Patrocinada • Mercado Livre</span>
            </div>
            <p className="text-[11px] text-slate-300 mb-2 leading-relaxed">
              Ofertas em games, controles e acessórios no Mercado Livre com link oficial parceiro do canal.
            </p>
            <button
              type="button"
              onClick={() => triggerAffiliateLink()}
              className="py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 active:scale-95 text-black font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <span>Ver Oferta Alternada do Dia</span>
              <ExternalLink className="w-3 h-3 text-black" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
            💡 Jogo 100% testado e funcionando pronto para instalação no console PS5.
          </p>
        </div>

      </div>
    </div>
  );
};
