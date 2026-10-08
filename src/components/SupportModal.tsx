import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Heart,
  Gamepad2,
  Youtube,
  Bell,
} from 'lucide-react';

export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@henriquelouro7848?sub_confirmation=1';
export const PIX_5_REAIS_LINK = 'https://nubank.com.br/cobrar/3a4h2/6ac3a284-c7d1-419a-8d8c-17364a2251c7';
export const PIX_OUTRO_VALOR_LINK = 'https://nubank.com.br/cobrar/3a4h2/6ac1eb8d-5603-425a-9724-34655040d351';
export const PIX_KEY_OR_LINK = PIX_5_REAIS_LINK;

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedPix, setCopiedPix] = useState(false);

  if (!isOpen) return null;

  const handleCopyPix = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(PIX_KEY_OR_LINK);
      } else {
        const ta = document.createElement('textarea');
        ta.value = PIX_KEY_OR_LINK;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2500);
    } catch (err) {
      console.warn('Falha ao copiar:', err);
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
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#131724] via-[#0e121b] to-[#07090e] border border-amber-500/40 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_45px_rgba(245,158,11,0.25)] p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200 text-center max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Fechar"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-inner shadow-amber-500/10">
          <Heart className="w-8 h-8 fill-amber-400 text-amber-400 animate-pulse" />
        </div>

        {/* Tagline */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] font-bold text-amber-300 uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Apoie o Projeto Henrique Games</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans drop-shadow-sm mb-2">
          Apoie o Canal Henrique Games
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
          Para continuarmos trazendo novos jogos de <strong>PlayStation 5</strong> testados e funcionando prontos para instalação no console, pedimos o seu apoio voluntário para fortalecer o projeto!
        </p>

        {/* YOUTUBE SUBSCRIBE BANNER */}
        <div className="mb-5 p-4 rounded-2xl bg-gradient-to-b from-red-950/30 via-red-900/15 to-black/60 border border-red-500/40 text-center shadow-lg shadow-red-950/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-[#FF0000] flex items-center justify-center text-white shadow-md shadow-red-600/30">
              <Youtube className="w-4 h-4 fill-white" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-red-400">
              Canal Oficial @henriquelouro7848
            </span>
          </div>

          <p className="text-xs sm:text-sm font-bold text-white mb-3 leading-snug">
            Não deixe de se inscrever no canal para não perder nenhum conteúdo!
          </p>

          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#FF0000] hover:bg-[#CC0000] active:scale-95 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/35 hover:shadow-red-600/55 transition-all cursor-pointer group"
          >
            <Youtube className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
            <span>Inscrever-se</span>
            <Bell className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
          </a>
        </div>

        {/* Donation Options Container */}
        <div className="p-5 rounded-2xl bg-black/60 border border-amber-500/35 text-center mb-5 space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
              Valor Sugerido de Apoio:
            </span>
            <span className="text-3xl sm:text-4xl font-black text-amber-400 font-sans block">
              R$ 5,00
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              (ou doe qualquer outro valor de coração!)
            </span>
          </div>

          {/* Os dois links na doação: R$ 5,00 ou Outro Valor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* Opção 1: R$ 5,00 */}
            <a
              href={PIX_5_REAIS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 active:scale-95 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-400/20 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Doar R$ 5,00 (PIX)</span>
            </a>

            {/* Opção 2: Outro Valor */}
            <a
              href={PIX_OUTRO_VALOR_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/30 cursor-pointer"
            >
              <Heart className="w-4 h-4" />
              <span>Doar Outro Valor</span>
            </a>
          </div>

          {/* Copiar Link PIX */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleCopyPix}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copiedPix ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Chave / Link PIX Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-300" />
                  <span>Copiar Link do PIX</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Botão solicitado: "Prefiro ser mão de vaca e não apoiar o canal" */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <span>Prefiro ser mão de vaca e não apoiar o canal</span>
        </button>

      </div>
    </div>
  );
};
