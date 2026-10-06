import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Heart, Coins, Smartphone, QrCode } from 'lucide-react';

interface QRCodeDonationViewProps {
  donationUrl: string;
  customDonationUrl: string;
  defaultMode?: 'fixed' | 'custom';
  onAdvance?: () => void;
  advanceButtonText?: string;
  onSkip?: () => void;
  skipButtonText?: string;
}

export const QRCodeDonationView: React.FC<QRCodeDonationViewProps> = ({
  donationUrl,
  customDonationUrl,
  defaultMode = 'fixed',
  onAdvance,
  advanceButtonText,
  onSkip,
  skipButtonText,
}) => {
  const [mode, setMode] = useState<'fixed' | 'custom'>(defaultMode);
  const [copied, setCopied] = useState(false);

  const activeUrl = mode === 'fixed' ? donationUrl : customDonationUrl;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(activeUrl);
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = activeUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      {/* Selector: R$ 5 vs Outro Valor */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 w-full max-w-xs mb-4">
        <button
          type="button"
          onClick={() => setMode('fixed')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === 'fixed'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>R$ 5,00 (Recomendado)</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('custom')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === 'custom'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>Outro Valor</span>
        </button>
      </div>

      {/* QR Code Card */}
      <div className="relative p-3.5 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-4 border-amber-400/40 flex flex-col items-center">
        <div className="relative">
          <QRCodeSVG
            value={activeUrl}
            size={185}
            level="H"
            includeMargin={false}
            className="w-[185px] h-[185px]"
          />
        </div>
        <div className="mt-2 text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1">
          <Smartphone className="w-3.5 h-3.5 text-purple-700" />
          <span>Aponte a câmera ou app do banco</span>
        </div>
      </div>

      {/* Mode Description & Copy Action */}
      <div className="w-full max-w-xs mt-3.5 flex flex-col items-center gap-2">
        <p className="text-xs text-slate-300">
          {mode === 'fixed' ? (
            <span>
              Chave de cobrança de <strong className="text-amber-400">R$ 5,00</strong> para manter o servidor!
            </span>
          ) : (
            <span>
              Cobrança aberta para você doar <strong className="text-amber-400">qualquer valor</strong>!
            </span>
          )}
        </p>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Link Copiado para Área de Transferência!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copiar Link de Pagamento</span>
            </>
          )}
        </button>
      </div>

      {/* Next Actions (if provided) */}
      {(onAdvance || onSkip) && (
        <div className="w-full max-w-xs mt-4 pt-3 border-t border-white/10 flex flex-col gap-2">
          {onAdvance && (
            <button
              type="button"
              onClick={onAdvance}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>{advanceButtonText || 'Já escaneei / Avançar para Senha'}</span>
            </button>
          )}

          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="w-full py-2 px-3 rounded-lg bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200 text-[11px] font-semibold transition-all cursor-pointer"
            >
              {skipButtonText || 'Seguir sem apoiar pq sou mão de vaca! 😂'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
