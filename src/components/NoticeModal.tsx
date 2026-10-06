import React, { useState } from 'react';
import { X, Server, AlertTriangle, Heart, Clock, Coins, QrCode } from 'lucide-react';
import { QRCodeDonationView } from './QRCodeDonationView';

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  donationUrl: string;
  customDonationUrl: string;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({
  isOpen,
  onClose,
  donationUrl,
  customDonationUrl,
}) => {
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'fixed' | 'custom'>('fixed');

  if (!isOpen) return null;

  const handleOpenQR = (mode: 'fixed' | 'custom') => {
    setSelectedMode(mode);
    setShowQRCode(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0d1017] border border-amber-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(245,158,11,0.2)] p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Fechar comunicado"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
              Comunicado Oficial
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight font-sans">
              Henrique Games
            </h2>
          </div>
        </div>

        {/* If QR Code is requested in notice */}
        {showQRCode ? (
          <div className="my-4 animate-in fade-in duration-200 flex flex-col items-center">
            <QRCodeDonationView
              donationUrl={donationUrl}
              customDonationUrl={customDonationUrl}
              defaultMode={selectedMode}
            />
            <button
              type="button"
              onClick={() => setShowQRCode(false)}
              className="mt-4 text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
            >
              ← Voltar para o comunicado
            </button>
          </div>
        ) : (
          /* Content Sections */
          <div className="space-y-4 my-4">
            
            {/* Card 1: Ajuda para o Servidor */}
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 shrink-0 mt-0.5">
                  <Heart className="w-5 h-5 fill-purple-400 text-purple-400" />
                </div>
                <div className="text-left w-full">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                    <span>Não deixe de apoiar o projeto!</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    Estamos nos organizando para <strong className="text-purple-300 font-semibold">adquirir um servidor próprio</strong> para hospedar todos os jogos com download rápido e ilimitado. Sua colaboração de <span className="text-amber-400 font-bold">R$ 5</span> ou qualquer outro valor é fundamental para tornar isso realidade!
                  </p>
                  
                  {/* In-Modal QR Code Triggers (Does not open external page) */}
                  <div className="mt-3.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenQR('fixed')}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-purple-500/25 transition-all text-center cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 text-white" />
                      <span>QR Code (R$ 5)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenQR('custom')}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all text-center cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>QR Code (Outro Valor)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Aviso de Cota Google Drive */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Aviso sobre Cota do Google Drive</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    Atualmente os arquivos estão hospedados no <strong className="text-white">Google Drive</strong>. Por conta disso e da alta demanda, o Drive pode eventualmente exibir a mensagem de <strong className="text-amber-300">"cota de download esgotada"</strong>.
                  </p>
                  <p className="text-xs text-amber-200/90 mt-2 font-medium bg-black/40 p-2.5 rounded-lg border border-amber-500/20">
                    💡 <strong>O que fazer?</strong> Caso a mensagem de cota apareça, basta aguardar e tentar o download novamente algumas horas depois!
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Action Button to Close */}
        <div className="mt-5 pt-3 border-t border-white/10 flex flex-col sm:flex-row gap-2.5 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all text-center cursor-pointer shadow-md"
          >
            Entendi, ir para a loja
          </button>
        </div>

      </div>
    </div>
  );
};
