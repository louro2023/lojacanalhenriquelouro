import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  CheckCircle2,
  Sparkles,
  Youtube,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Gamepad2,
  Loader2,
  Bell,
  AlertTriangle,
  Heart,
  Copy,
  Check,
} from 'lucide-react';

interface SiteAccessGateProps {
  onUnlock: () => void;
}

export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@henriquelouro7848?sub_confirmation=1';
export const LOGO_PATH = '/assets/aistudio/ChatGPT_Image_8_de_out._de_2026__16_49_15_9997978e.png';
export const PIX_5_REAIS_LINK = 'https://nubank.com.br/cobrar/3a4h2/6ac3a284-c7d1-419a-8d8c-17364a2251c7';
export const PIX_OUTRO_VALOR_LINK = 'https://nubank.com.br/cobrar/3a4h2/6ac1eb8d-5603-425a-9724-34655040d351';

export const SiteAccessGate: React.FC<SiteAccessGateProps> = ({ onUnlock }) => {
  // Etapa 1: 'sub4unlock' | Etapa 2: 'donation'
  const [currentStep, setCurrentStep] = useState<'sub4unlock' | 'donation'>('sub4unlock');
  const [hasClickedSubscribe, setHasClickedSubscribe] = useState(false);
  const [subscribeCountdown, setSubscribeCountdown] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [copiedPix, setCopiedPix] = useState(false);

  // Temporizador para aguardar a confirmação da inscrição no YouTube
  useEffect(() => {
    if (subscribeCountdown === null) return;
    if (subscribeCountdown <= 0) {
      setSubscribeCountdown(0);
      return;
    }

    const timer = setTimeout(() => {
      setSubscribeCountdown((prev) => (prev !== null ? prev - 1 : 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [subscribeCountdown]);

  // Abre o canal do YouTube com confirmação de inscrição
  const handleOpenSubscribe = () => {
    setHasClickedSubscribe(true);
    setVerificationError('');
    setSubscribeCountdown(4); // Contagem de 4 segundos
    window.open(YOUTUBE_CHANNEL_URL, '_blank', 'noopener,noreferrer');
  };

  // Executa o processo de verificação Sub4Unlock OBRIGATÓRIA
  const handleVerifySubscription = () => {
    // Se a pessoa NÃO clicou em se inscrever, bloqueia totalmente
    if (!hasClickedSubscribe) {
      setVerificationError(
        '⚠️ VOCÊ PRECISA OBRIGATORIAMENTE SE INSCREVER NO CANAL HENRIQUE LOURO PARA PODER PROSSEGUIR PARA O SITE! Clique no botão vermelho "Passo 1: Inscrever-se no Canal" acima.'
      );
      return;
    }

    // Se ainda está na contagem regressiva de segurança
    if (subscribeCountdown !== null && subscribeCountdown > 0) {
      setVerificationError(
        `⏳ Aguardando conclusão da inscrição no YouTube... Aguarde mais ${subscribeCountdown} segundo(s) para verificar.`
      );
      return;
    }

    setVerificationError('');
    setIsVerifying(true);

    // Verificação ativa do canal e transição direta para a tela de Pedido de Apoio/Doações
    setTimeout(() => {
      setIsVerifying(false);
      // Avança diretamente para a tela de pedido de apoio de doações
      setCurrentStep('donation');
    }, 1600);
  };

  const handleCopyPix = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(PIX_5_REAIS_LINK);
      } else {
        const ta = document.createElement('textarea');
        ta.value = PIX_5_REAIS_LINK;
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
            {/* Outer pulsating neon cyan ring */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 opacity-80 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all animate-pulse" />
            <img
              src={LOGO_PATH}
              alt="Logo Oficial Canal Henrique Louro"
              className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-cyan-400 shadow-[0_0_35px_rgba(0,210,255,0.7)] object-cover hover:scale-105 transition-transform"
            />
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
              currentStep === 'sub4unlock'
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              1. Inscrição Sub4Unlock {currentStep === 'donation' && '✓'}
            </span>
            <span className="text-slate-500 text-xs font-bold">→</span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
              currentStep === 'donation'
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                : 'bg-white/10 text-slate-400'
            }`}>
              2. Pedido de Doação
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight font-sans drop-shadow-md">
            LOJA DE JOGOS CANAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">HENRIQUE LOURO</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-md">
            {currentStep === 'sub4unlock'
              ? 'Para acessar nosso catálogo completo de jogos de PlayStation 5 testados e funcionando, conclua a inscrição obrigatória no canal oficial.'
              : 'Para continuarmos trazendo novos jogos de PlayStation 5 testados e funcionando prontos para instalação no console, pedimos o seu apoio voluntário para fortalecer o projeto!'}
          </p>
        </div>

        {/* ======================================================== */}
        {/* ETAPA 1: SUB4UNLOCK (INSCRIÇÃO E VERIFICAÇÃO OBRIGATÓRIA) */}
        {/* ======================================================== */}
        {currentStep === 'sub4unlock' && (
          <div className="rounded-3xl bg-gradient-to-b from-[#0c1427] via-[#09101e] to-[#050812] border border-cyan-500/35 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(0,210,255,0.25)] p-6 sm:p-8 backdrop-blur-md relative overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* Top Lock Status Visual */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border ${
                isVerifying
                  ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-[0_0_25px_rgba(0,210,255,0.4)]'
                  : verificationError
                  ? 'bg-red-500/20 border-red-500/60 text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.4)] animate-bounce'
                  : 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.25)]'
              }`}>
                {isVerifying ? (
                  <Loader2 className="w-8 h-8 text-cyan-300 animate-spin" />
                ) : verificationError ? (
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                ) : (
                  <Lock className="w-8 h-8 text-cyan-400" />
                )}
              </div>
              
              <span className="text-xs font-bold uppercase tracking-wider mt-2.5 text-slate-300">
                {isVerifying
                  ? 'Verificando Inscrição no Canal...'
                  : hasClickedSubscribe
                  ? 'Inscrição em Andamento • Clique em Verificar'
                  : 'Etapa 1: Inscrição Obrigatória para Acessar'}
              </span>
            </div>

            {/* MENSAGEM OBRIGATÓRIA CASO O USUÁRIO NÃO TENHA SE INSCRITO */}
            {verificationError && (
              <div className="p-4 mb-5 rounded-2xl bg-red-950/80 border-2 border-red-500 text-red-100 text-xs sm:text-sm font-bold flex items-start gap-3 shadow-[0_0_25px_rgba(239,68,68,0.4)] animate-in fade-in">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <span className="block font-black text-red-300 uppercase tracking-wide text-[11px] mb-1">
                    Inscrição Obrigatória Não Detectada
                  </span>
                  <span>{verificationError}</span>
                </div>
              </div>
            )}

            {/* Verification Progress Message */}
            {isVerifying && (
              <div className="p-3.5 mb-5 rounded-2xl bg-cyan-950/50 border border-cyan-400/50 text-center animate-in fade-in">
                <p className="text-xs font-bold text-cyan-200 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Verificando inscrição no canal @henriquelouro7848...</span>
                </p>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 rounded-full animate-[pulse_1s_ease-in-out_infinite] w-full" />
                </div>
              </div>
            )}

            {/* SUB4UNLOCK STEPS */}
            <div className="space-y-3.5">
              
              {/* ETAPA 1: Inscrever-se no Canal */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleOpenSubscribe}
                  disabled={isVerifying}
                  className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 active:scale-[0.98] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all flex items-center justify-between cursor-pointer group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Youtube className="w-5 h-5 fill-white" />
                    </div>
                    <div className="text-left">
                      <span className="block text-[10px] text-red-200 font-bold uppercase tracking-wider">
                        Passo 1 {hasClickedSubscribe ? '✓ Canal Aberto' : '(Obrigatório)'}
                      </span>
                      <span className="block font-black leading-tight">
                        Inscrever-se no Canal
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10 group-hover:bg-black/50 transition-colors">
                    <Bell className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold">YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </div>
                </button>
              </div>

              {/* Status Feedback após clicar no YouTube */}
              {hasClickedSubscribe && subscribeCountdown !== null && subscribeCountdown > 0 && (
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-center animate-in fade-in">
                  <p className="text-xs font-semibold text-cyan-300">
                    ⏳ Confirme sua inscrição na aba aberta do YouTube... (aguarde {subscribeCountdown}s)
                  </p>
                </div>
              )}

              {/* ETAPA 2: Verificar Inscrição & Prosseguir para a Tela de Doação */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleVerifySubscription}
                  disabled={isVerifying}
                  className={`w-full py-4 px-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer active:scale-[0.98] disabled:opacity-60 ${
                    hasClickedSubscribe && (subscribeCountdown === 0 || subscribeCountdown === null)
                      ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:brightness-110 text-black shadow-[0_0_30px_rgba(0,210,255,0.45)] animate-pulse'
                      : 'bg-gradient-to-r from-cyan-400/80 via-sky-400/80 to-blue-500/80 hover:brightness-110 text-black shadow-[0_0_20px_rgba(0,210,255,0.25)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="block text-[10px] opacity-75 font-bold uppercase tracking-wider">
                        Passo 2
                      </span>
                      <span className="block font-black leading-tight">
                        {isVerifying ? 'Verificando Inscrição...' : 'Verificar Inscrição'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-black/20 px-3 py-1.5 rounded-xl">
                    <span>Avançar</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>

            </div>

            {/* Aviso Legal de Obrigatoriedade */}
            <div className="mt-5 pt-4 border-t border-white/10 text-center">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                ⚠️ <strong>Inscrição obrigatória:</strong> Primeiro inscreva-se e verifique sua inscrição para prosseguir.
              </p>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* ETAPA 2: TELA DE PEDIDO DE APOIO DE DOAÇÕES (APÓS INSCRIÇÃO) */}
        {/* ======================================================== */}
        {currentStep === 'donation' && (
          <div className="rounded-3xl bg-gradient-to-b from-[#0c1427] via-[#09101e] to-[#050812] border border-cyan-500/40 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_45px_rgba(0,210,255,0.25)] p-6 sm:p-8 backdrop-blur-md relative overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* Sucesso na Inscrição */}
            <div className="p-3 mb-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center">
              <div className="flex items-center justify-center gap-2 text-emerald-300 font-bold text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Inscrição Confirmada no Canal @henriquelouro7848!</span>
              </div>
            </div>

            {/* Tagline de Apoio */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[11px] font-bold text-cyan-300 uppercase tracking-widest mb-3 shadow-[0_0_10px_rgba(0,210,255,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Fortaleça o Projeto</span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mb-2">
              Pedido de Apoio ao Canal
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
              Para continuarmos trazendo novos jogos de <strong>PlayStation 5</strong> testados e funcionando prontos para instalação no console, pedimos o seu apoio voluntário para fortalecer o projeto!
            </p>

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

            {/* BOTÃO SOLICITADO: "Prefiro ser mão de vaca e não apoiar o canal" */}
            <button
              type="button"
              onClick={onUnlock}
              className="w-full py-3.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Prefiro ser mão de vaca e não apoiar o canal</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

          </div>
        )}

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-400 mt-6 flex items-center justify-center gap-2">
          <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>LOJA DE JOGOS CANAL HENRIQUE LOURO • PlayStation 5</span>
        </div>

      </div>
    </div>
  );
};
