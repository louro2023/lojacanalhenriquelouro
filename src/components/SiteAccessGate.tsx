import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  Gamepad2,
  Heart,
  Copy,
  Check,
} from 'lucide-react';

interface SiteAccessGateProps {
  onUnlock: () => void;
}

export const LOGO_PATH = '/assets/aistudio/ChatGPT_Image_8_de_out._de_2026__16_49_15_9997978e.png';
export const PIX_5_REAIS_LINK = 'https://nubank.com.br/cobrar/3a4h2/6ac3a284-c7d1-419a-8d8c-17364a2251c7';
export const PIX_OUTRO_VALOR_LINK = 'https://nubank.com.br/cobrar/3a4h2/6ac1eb8d-5603-425a-9724-34655040d351';
export const PIX_CHAVE = '2aa7375c-45ab-4318-a3b6-0dad37288e55';

export const SiteAccessGate: React.FC<SiteAccessGateProps> = ({ onUnlock }) => {
  const [copiedPix, setCopiedPix] = useState(false);

  const handleCopyPix = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(PIX_CHAVE);
      } else {
        const ta = document.createElement('textarea');
        ta.value = PIX_CHAVE;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2500);
    } catch (err) {
      console.warn('Falha ao copiar chave pix:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-cyan-400 selection:text-black">
      {/* Background Neon Glows inspirados na logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-sky-400/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-cyan-500/15 via-blue-600/5 to-transparent pointer-events-none" />

      {/* Decorative PlayStation neon shapes in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
        <div className="absolute top-12 left-10 text-cyan-400 text-6xl font-black select-none">▲</div>
        <div className="absolute bottom-16 left-16 text-cyan-400 text-6xl font-black select-none">●</div>
        <div className="absolute top-20 right-14 text-cyan-400 text-6xl font-black select-none">✖</div>
        <div className="absolute bottom-20 right-20 text-cyan-400 text-6xl font-black select-none">■</div>
      </div>

      <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Brand Header with Channel Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative group mb-3">
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 opacity-80 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all" />
            <img
              src={LOGO_PATH}
              alt="Logo Oficial Canal Henrique Louro"
              className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-cyan-400 shadow-[0_0_35px_rgba(0,210,255,0.7)] object-cover hover:scale-105 transition-transform"
            />
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight font-sans drop-shadow-md">
            LOJA DE JOGOS CANAL{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
              HENRIQUE LOURO
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-md">
            Para continuarmos trazendo novos jogos de <strong>PlayStation 5</strong> testados e funcionando prontos para instalação no console, pedimos o seu apoio voluntário para fortalecer o projeto!
          </p>
        </div>

        {/* TELA DE PEDIDO DE APOIO / DOAÇÃO */}
        <div className="rounded-3xl bg-gradient-to-b from-[#0c1427] via-[#09101e] to-[#050812] border border-cyan-500/40 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_45px_rgba(0,210,255,0.25)] p-6 sm:p-8 backdrop-blur-md relative overflow-hidden text-center animate-in fade-in zoom-in-95">
          {/* Tagline de Apoio */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[11px] font-bold text-cyan-300 uppercase tracking-widest mb-3 shadow-[0_0_10px_rgba(0,210,255,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Fortaleça o Projeto</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mb-4">
            Pedido de Apoio ao Canal
          </h2>

          {/* Container das Opções de Doação */}
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

            {/* Links PIX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* Opção 1: R$ 5,00 */}
              <a
                href={PIX_5_REAIS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setTimeout(() => {
                    onUnlock();
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
                    onUnlock();
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

          {/* Botão para prosseguir sem doar */}
          <button
            type="button"
            onClick={onUnlock}
            className="w-full py-3.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Prefiro ser mão de vaca e não apoiar o canal</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-400 mt-6 flex items-center justify-center gap-2">
          <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>LOJA DE JOGOS CANAL HENRIQUE LOURO • PlayStation 5</span>
        </div>
      </div>
    </div>
  );
};
