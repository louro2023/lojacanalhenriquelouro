import React from 'react';
import { X, Heart, ShieldCheck } from 'lucide-react';
import { QRCodeDonationView } from './QRCodeDonationView';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  donationUrl: string;
  customDonationUrl: string;
  initialMode?: 'fixed' | 'custom';
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  donationUrl,
  customDonationUrl,
  initialMode = 'fixed',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-2xl bg-[#0e121a] border border-purple-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_35px_rgba(168,85,247,0.2)] p-6 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Fechar"
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-2 shadow-inner">
            <Heart className="w-6 h-6 fill-purple-400 text-purple-400" />
          </div>

          <h3 className="text-xl font-black text-white uppercase tracking-tight font-sans">
            Apoiar o Projeto
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xs">
            Escaneie o QR Code abaixo pelo app do seu banco para doar e ajudar a manter o servidor no ar!
          </p>
        </div>

        {/* QR Code Component */}
        <QRCodeDonationView
          donationUrl={donationUrl}
          customDonationUrl={customDonationUrl}
          defaultMode={initialMode}
        />

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Pagamento seguro via Nubank / Pix</span>
        </div>

      </div>
    </div>
  );
};
