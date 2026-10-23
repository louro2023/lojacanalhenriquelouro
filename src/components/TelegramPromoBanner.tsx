import React, { useState } from 'react';
import { Send, QrCode, ExternalLink, Sparkles, ShoppingBag, Tag, Check, X, Smartphone } from 'lucide-react';

export const TELEGRAM_GROUP_URL = 'https://t.me/+VLztuPp9D4BlM2Fh';
export const TELEGRAM_QR_IMAGE = '/assets/aistudio/image_4a358390.png';

export const TelegramPromoBanner: React.FC = () => {
  const [showQrModal, setShowQrModal] = useState(false);

  return (
    <>
      <div className="w-full mb-10 rounded-3xl bg-gradient-to-r from-[#07172c] via-[#091f3b] to-[#071324] border-2 border-sky-500/40 shadow-[0_15px_45px_rgba(0,0,0,0.85),0_0_35px_rgba(14,165,233,0.22)] p-5 sm:p-7 relative overflow-hidden backdrop-blur-md">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-[11px] font-black uppercase tracking-wider text-sky-300 mb-3 shadow-[0_0_12px_rgba(56,189,248,0.25)]">
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>Grupo VIP no Telegram • Ofertas &amp; Acessórios PS5</span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight font-sans mb-2">
              Economize em Acessórios para seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400">PlayStation 5</span> e Apoie o Canal!
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl mb-4">
              Participe do nosso <strong>Grupo de Recomendações e Vendas no Telegram</strong>! Postamos diariamente produtos com desconto para melhorar o desempenho do seu PS5 (como pendrives ideais, SSDs NVMe de alta velocidade, cabos de alta performance, controles e cases).
            </p>

            <div className="p-3 rounded-2xl bg-black/40 border border-sky-500/25 mb-5 inline-flex items-center gap-2.5 text-xs text-sky-200 font-semibold max-w-xl">
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
              <span>
                Ao adquirir qualquer produto pelos links recomendados no grupo, <strong>você paga mais barato e apoia diretamente o canal</strong> a continuar trazendo novos jogos e atualizações!
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <a
                href={TELEGRAM_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 hover:brightness-110 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(14,165,233,0.4)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 fill-white" />
                <span>Entrar no Grupo do Telegram</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-slate-100 hover:text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-sm"
              >
                <QrCode className="w-4 h-4 text-sky-300" />
                <span>Escanear QR Code</span>
              </button>
            </div>

          </div>

          {/* QR Code Card Showcase */}
          <div
            onClick={() => setShowQrModal(true)}
            className="w-44 sm:w-48 p-3 rounded-2xl bg-white/5 border border-sky-400/30 hover:border-sky-400/70 shadow-[0_0_25px_rgba(14,165,233,0.15)] flex flex-col items-center text-center cursor-pointer group transition-all shrink-0 hover:scale-105"
            title="Clique para ampliar o QR Code do Telegram"
          >
            <div className="relative w-36 h-48 rounded-xl overflow-hidden bg-black/60 border border-sky-500/30 mb-2">
              <img
                src={TELEGRAM_QR_IMAGE}
                alt="QR Code Grupo Telegram Canal Henrique Louro"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="p-1.5 rounded-full bg-black/80 text-sky-300 text-[10px] font-black uppercase tracking-wider border border-sky-400/50">
                  Ampliar
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-300 uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
              <span>Aponte a Câmera</span>
            </div>
            <span className="text-[10px] text-slate-400">QR Code Oficial do Canal</span>
          </div>

        </div>

      </div>

      {/* Modal para Visualização Ampliada do QR Code */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowQrModal(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-sm rounded-3xl bg-[#081224] border border-sky-500/40 p-5 z-10 text-center shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(14,165,233,0.3)] animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-[10px] font-black uppercase tracking-wider text-sky-300 mb-3">
              <Send className="w-3 h-3 text-sky-400" />
              <span>Grupo Telegram</span>
            </div>

            <h4 className="text-lg font-black text-white uppercase tracking-tight mb-1">
              Grupo de Recomendações &amp; Vendas
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              Aponte a câmera do celular para entrar no grupo e economizar nos melhores produtos para PS5 apoiando o canal!
            </p>

            {/* Imagem Completa do QR Code */}
            <div className="rounded-2xl overflow-hidden border-2 border-sky-500/40 shadow-xl max-h-[55vh] flex items-center justify-center bg-black mb-4">
              <img
                src={TELEGRAM_QR_IMAGE}
                alt="QR Code do Grupo de Vendas Telegram"
                className="w-full h-auto max-h-[55vh] object-contain"
              />
            </div>

            <a
              href={TELEGRAM_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-sky-500/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4 fill-white" />
              <span>Abrir no Telegram Direto</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </>
  );
};
