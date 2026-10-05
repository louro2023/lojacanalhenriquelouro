import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Lock, KeyRound, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetGameName: string;
  targetDriveUrl: string;
  donationUrl: string;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  targetGameName,
  targetDriveUrl,
  donationUrl,
}) => {
  // Step 1: 'support' prompt; Step 2: 'password' entry
  const [step, setStep] = useState<'support' | 'password'>('support');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('support');
      setPassword('');
      setErrorMessage('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (step === 'password') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [step]);

  if (!isOpen) return null;

  const handleSupportAndContinue = () => {
    // Open Nubank donation link in new tab
    window.open(donationUrl, '_blank', 'noopener,noreferrer');
    // Proceed to password step
    setStep('password');
  };

  const handleSkipSupport = () => {
    // "seguir sem apoiar pq sou mão de vaca!" -> proceed to password step
    setStep('password');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = password.trim().toLowerCase();

    // Check case-insensitive password "leigo" (Leigo, leigo, LEIGO, LeigO, etc.)
    if (cleanInput === 'leigo') {
      setErrorMessage('');
      onClose();
      // Redirect to the respective game's Google Drive link
      window.open(targetDriveUrl, '_blank', 'noopener,noreferrer');
    } else {
      setErrorMessage(
        'Assista o video completo do Youtube do canal Henrique Louro e aproveite para se inscrever!!!'
      );
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-2xl bg-[#0e121a] border border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_35px_rgba(245,158,11,0.2)] p-6 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Fechar"
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: SOLICITAÇÃO DE APOIO */}
        {step === 'support' && (
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-amber-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center mb-4 shadow-inner">
              <Heart className="w-7 h-7 fill-purple-400 text-purple-400 animate-pulse" />
            </div>

            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{targetGameName}</span>
            </span>

            <h3 className="text-xl font-black text-white uppercase tracking-tight font-sans">
              Apoie o Projeto!
            </h3>

            {/* Exact requested support message */}
            <p className="text-sm text-slate-200 mt-3 mb-6 leading-relaxed font-medium bg-white/5 p-3.5 rounded-xl border border-white/10">
              É somente <span className="text-amber-400 font-bold">5 reais</span> para manter o projeto funcionando e adicionando novos jogos!
            </p>

            <div className="w-full flex flex-col gap-3">
              {/* Button: Apoiar */}
              <button
                type="button"
                onClick={handleSupportAndContinue}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-purple-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white text-white" />
                <span>Apoiar</span>
              </button>

              {/* Button: Seguir sem apoiar pq sou mão de vaca! */}
              <button
                type="button"
                onClick={handleSkipSupport}
                className="w-full py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white font-semibold text-xs tracking-wide transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Seguir sem apoiar pq sou mão de vaca! 😂</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DIGITE A SENHA */}
        {step === 'password' && (
          <div className="flex flex-col items-center text-center animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-white uppercase tracking-tight font-sans">
              Digite a Senha
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              Insira a senha para liberar o acesso a <span className="text-amber-400 font-semibold">{targetGameName}</span>
            </p>

            <form onSubmit={handlePasswordSubmit} className="w-full space-y-4">
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="purchase-modal-password"
                  className="text-xs font-semibold text-slate-300 block"
                >
                  Senha:
                </label>
                <div className="relative">
                  <input
                    id="purchase-modal-password"
                    ref={inputRef}
                    type="text"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Digite a palavra aqui..."
                    className={`w-full rounded-xl bg-slate-900/90 border px-4 py-3 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                      errorMessage
                        ? 'border-red-500 focus:border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                        : 'border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50'
                    }`}
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Error Message Box */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-left flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-semibold text-red-200 leading-snug">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Submit Action */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black font-extrabold text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Confirmar Senha</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep('support')}
                className="text-xs text-slate-400 hover:text-slate-200 underline pt-1"
              >
                Voltar
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
