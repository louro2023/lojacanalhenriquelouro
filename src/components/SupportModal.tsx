import React, { useState } from 'react';
import {
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Heart,
  X,
} from 'lucide-react';

export const PIX_5_REAIS_LINK = 'https://nubank.com.br/cobrar/3a4h2/6ac3a284-c7d1-419a-8d8c-17364a2251c7';
export const PIX_OUTRO_VALOR_LINK = 'https://nubank.com.br/cobrar/3a4h2/6ac1eb8d-5603-425a-9724-34655040d351';
export const PIX_CHAVE = '2aa7375c-45ab-4318-a3b6-0dad37288e55';
export const PIX_KEY_OR_LINK = PIX_CHAVE;

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
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#101728] via-[#0b101c] to-[#050811] border border-cyan-500/40 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_45px_rgba(0,210,255,0.25)] p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200 text-center max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Fechar"
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Channel Logo */}
        <div className="relative mx-auto mb-3 w-20 h-20 group">
          <div className="absolute -inset-1 rounded-full bg-cyan-400 opacity-60 blur-sm group-hover:opacity-100 transition-opacity" />
          <img
            src="/assets/aistudio/ChatGPT_Image_8_de_out._de_2026__16_49_15_9997978e.png"
            alt="Logo Canal Henrique Louro"
            className="relative w-20 h-20 rounded-full border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,210,255,0.6)] object-cover"
          />
        </div>

        {/* Tagline */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[11px] font-bold text-cyan-300 uppercase tracking-widest mb-2 shadow-[0_0_10px_rgba(0,210,255,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Apoie o Projeto Canal Henrique Louro</span>
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight font-sans drop-shadow-sm mb-2">
          LOJA DE JOGOS CANAL{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
            HENRIQUE LOURO
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
          Para continuarmos trazendo novos jogos de <strong>PlayStation 5</strong> testados e funcionando prontos para instalação no console, pedimos o seu apoio voluntário para fortalecer o projeto!
        </p>

        {/* Donation Options Container */}
        <div className="p-5 rounded-2xl bg-black/75 border border-cyan-500/35 text-center mb-5 space-y-4 shadow-[0_0_20px_rgba(0,210,255,0.15)]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
              Valor Sugerido de Apoio:
            </span>
            <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 font-sans block">
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
              onClick={() => {
                setTimeout(() => {
                  onClose();
                }, 50);
              }}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:brightness-110 active:scale-95 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-400/25 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Doar R$ 5,00 (PIX)</span>
            </a>

            {/* Opção 2: Outro Valor */}
            <a
              href={PIX_OUTRO_VALOR_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setTimeout(() => {
                  onClose();
                }, 50);
              }}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/30 cursor-pointer"
            >
              <Heart className="w-4 h-4" />
              <span>Doar Outro Valor</span>
            </a>
          </div>

          {/* Copiar Chave PIX */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleCopyPix}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copiedPix ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Chave PIX Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-300" />
                  <span>Copiar Chave PIX</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Botão para fechar sem apoiar */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <span>Prefiro ser mão de vaca e não apoiar o canal</span>
        </button>
      </div>
    </div>
  );
};
