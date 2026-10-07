import React, { useState, useEffect } from 'react';
import {
  Lock,
  User,
  Mail,
  KeyRound,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Gamepad2,
  Radio,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Eye,
  Send,
  AlertCircle,
} from 'lucide-react';
import {
  loginUser,
  requestAccess,
  UserAccount,
  subscribeSystemSettings,
  SystemSettings,
  DEFAULT_SYSTEM_SETTINGS,
} from '../lib/firebase';

interface LoginPageProps {
  onLoginSuccess: (user: UserAccount) => void;
  onViewCatalog: () => void;
}

// Chave PIX / Link de Cobrança de R$ 50,00
const PIX_KEY_OR_LINK = 'https://nubank.com.br/cobrar/3a4h2/6ac1eb8d-5603-425a-9724-34655040d351';
const TELEGRAM_SUPPORT_URL = 'https://t.me/+5521981682922';

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onViewCatalog }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [registerStep, setRegisterStep] = useState<'explanation' | 'payment' | 'confirmation'>('explanation');
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(DEFAULT_SYSTEM_SETTINGS);

  // Login form
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Register form
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedData, setCopiedData] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeSystemSettings((settings) => {
      setSystemSettings(settings);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) return;

    setLoading(true);
    setError('');
    const res = await loginUser(identifier, password);
    setLoading(false);

    if (res.user) {
      onLoginSuccess(res.user);
    } else {
      setError(res.error || 'Erro ao realizar login.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername.trim() || !regEmail.trim() || !regPassword.trim()) return;

    setLoading(true);
    setError('');
    const res = await requestAccess(regUsername, regEmail, regPassword);
    setLoading(false);

    if (res.success) {
      setRegisterStep('confirmation');
    } else {
      setError(res.error || 'Erro ao registrar solicitação.');
    }
  };

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
    } catch {
      // ignore
    }
  };

  const handleCopyAccountData = async () => {
    const text = `Olá! Segue o comprovante do PIX de R$ 50,00 para liberação do acesso de 30 dias na loja de jogos PS5.\n\nNome: ${regUsername || 'Apoiador'}\nE-mail: ${regEmail || ''}\nSenha: ${regPassword || ''}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedData(true);
      setTimeout(() => setCopiedData(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between font-sans selection:bg-amber-400 selection:text-black relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-gradient-to-tr from-amber-500/10 via-blue-600/10 to-purple-600/10 rounded-full blur-[170px] pointer-events-none" />

      {/* Top Header */}
      <header className="w-full border-b border-white/10 bg-[#06080d]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 flex items-center justify-center text-black font-black text-base shadow-md shadow-amber-500/20">
            HG
          </div>
          <span className="text-lg font-black tracking-tight text-white uppercase font-sans">
            Henrique <span className="text-amber-400">Games</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white text-black font-black text-[10px] tracking-tight uppercase">
            PS5™
          </span>
        </div>

        <button
          type="button"
          onClick={onViewCatalog}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>Ver Catálogo</span>
        </button>
      </header>

      {/* Main Login / Request Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#121622] via-[#0d1017] to-[#07090e] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.15)] p-6 sm:p-8">
          
          {/* Logo & Headline */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3 shadow-inner">
              <Gamepad2 className="w-7 h-7" />
            </div>

            <h1 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
              Autenticação de Acesso
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Catálogo oficial de jogos para PlayStation 5
            </p>
          </div>

          {/* Aviso de Licenças Disponíveis (Gerenciável pelo Administrador) */}
          {systemSettings.noticeEnabled && (
            <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/40 text-left shadow-lg shadow-amber-500/5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full">
                        Vagas Limitadas
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-black text-white mt-1">
                      {systemSettings.customNoticeMessage || `No momento temos somente ${systemSettings.availableLicenses} licenças disponíveis!`}
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Garanta seu acesso antes que as vagas para novos apoiadores sejam encerradas.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl bg-black/50 border border-amber-500/30 shrink-0">
                  <span className="text-base font-black text-amber-400 font-mono leading-none">
                    {systemSettings.availableLicenses}
                  </span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">
                    Disponíveis
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tabs: Entrar / Solicitar Acesso */}
          <div className="grid grid-cols-2 p-1 bg-black/40 rounded-xl border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError('');
              }}
              className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Entrar
            </button>

            <button
              type="button"
              onClick={() => {
                setTab('register');
                setError('');
              }}
              className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Solicitar Acesso
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 mb-5 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 font-semibold animate-in fade-in duration-200 text-center">
              {error}
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  E-mail ou Usuário:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="ex: seu-email@exemplo.com"
                    className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Senha:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 active:scale-95 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <span>Autenticando...</span>
                ) : (
                  <>
                    <span>Entrar no Sistema</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Suporte para quem já apoiou anteriormente */}
              <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-sky-950/40 to-blue-950/40 border border-sky-500/30 text-left">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div className="space-y-1.5 text-xs">
                    <p className="font-bold text-sky-300">
                      Já me apoiou anteriormente?
                    </p>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      Se você já me apoiou anteriormente, me envie o comprovante através do suporte e eu farei um desconto!
                    </p>
                    <div className="pt-1">
                      <a
                        href={TELEGRAM_SUPPORT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-bold text-[11px] shadow-md shadow-sky-500/20 transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Falar no Suporte Telegram</span>
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: SOLICITAR ACESSO (FLUXO EXPLICATIVO DE APOIO R$ 50) */}
          {tab === 'register' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* MENSAGEM EXPLICATIVA PRINCIPAL */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-purple-950/40 to-slate-900/60 border border-purple-500/30 text-left">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Ambiente Exclusivo para Apoiadores</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black">
                    {systemSettings.availableLicenses} Vagas Disponíveis
                  </span>
                </div>

                {systemSettings.noticeEnabled && (
                  <div className="mb-3 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center gap-2 text-xs text-amber-200 font-semibold">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{systemSettings.customNoticeMessage || `No momento temos somente ${systemSettings.availableLicenses} licenças disponíveis!`}</span>
                  </div>
                )}

                <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                  <p>
                    Este é um ambiente fechado para apoiadores do canal. Para manter o projeto no ar, é necessário cobrar <strong className="text-amber-400 font-bold text-sm">R$ 50,00</strong> para acesso ao site.
                  </p>
                  
                  <p>
                    Esse valor é cobrado exclusivamente para <strong className="text-white">manter as contas do Google Drive funcionando com a melhor disponibilidade e velocidade possível</strong>.
                  </p>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2 text-slate-200">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      Para termos esse funcionamento contínuo, o acesso é limitado a <strong className="text-amber-400">30 dias</strong>. O pagamento equivale a <strong className="text-emerald-400">apenas R$ 1,67 por dia</strong>!
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 pt-1">
                    📌 <strong>Como funciona a liberação:</strong> Após o pagamento, você deverá <strong>enviar o comprovante para o Suporte no Telegram</strong> com o <strong>e-mail e a senha</strong> cadastrados para que seu acesso seja liberado e ativado imediatamente!
                  </p>

                  {/* Mensagem de desconto para quem já apoiou anteriormente */}
                  <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/40 text-left">
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-2 text-xs">
                        <p className="font-bold text-amber-300">
                          Já me apoiou anteriormente?
                        </p>
                        <p className="text-slate-200 leading-relaxed">
                          Se você já me apoiou anteriormente, me envie o comprovante através do suporte e eu farei um desconto!
                        </p>
                        <div>
                          <a
                            href={TELEGRAM_SUPPORT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Suporte no Telegram</span>
                            <ExternalLink className="w-3 h-3 opacity-80" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ETAPA 1: PAGAMENTO DO PIX DE R$ 50 */}
              {registerStep === 'explanation' && (
                <div className="space-y-4 pt-1">
                  <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/30 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                      Valor do Apoio Mensal (30 Dias):
                    </span>
                    <span className="text-3xl font-black text-amber-400 font-sans block mb-3">
                      R$ 50,00
                    </span>

                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <a
                        href={PIX_KEY_OR_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir Link do PIX (R$ 50)</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        {copiedPix ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Link Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Copiar Link PIX</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setRegisterStep('payment')}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 active:scale-95 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Já fiz o PIX / Definir meus dados de Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* ETAPA 2: DEFINIÇÃO DE E-MAIL E SENHA */}
              {registerStep === 'payment' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-1">
                  <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 leading-relaxed text-left">
                    💡 <strong>Defina os dados da sua conta:</strong> Escolha seu nome, e-mail e senha abaixo. Após o pagamento, você deverá enviar o comprovante para o <strong>Suporte no Telegram</strong> com esses dados para ativarmos seu acesso!
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Seu Nome ou Nick:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        placeholder="ex: Lucas Gamer"
                        className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      E-mail para Login:
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="ex: lucas@gmail.com"
                        className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Senha Desejada:
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Crie sua senha de acesso"
                        className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRegisterStep('explanation')}
                      className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
                    >
                      Voltar
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 active:scale-95 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Registrando dados...</span>
                      ) : (
                        <>
                          <span>Continuar para Enviar Comprovante</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* ETAPA 3: ENVIO DO COMPROVANTE VIA TELEGRAM */}
              {registerStep === 'confirmation' && (
                <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-sky-950/40 via-slate-900/70 to-black border border-sky-500/40 text-left">
                    <div className="flex items-center gap-2 text-sky-400 font-black text-xs uppercase tracking-wider mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Dados Pré-Cadastrados com Sucesso!</span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed mb-3">
                      Após o pagamento, você deverá <strong>enviar o comprovante para o suporte no Telegram</strong> junto com os dados da sua conta para ativarmos seu acesso de 30 dias:
                    </p>

                    <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-300 font-mono space-y-1 mb-4">
                      <div>Nome: <strong className="text-white">{regUsername || 'Apoiador'}</strong></div>
                      <div>E-mail: <strong className="text-white">{regEmail || 'Informado'}</strong></div>
                      <div>Senha: <strong className="text-white">{regPassword || 'Informada'}</strong></div>
                      <div>Valor do PIX: <strong className="text-amber-400">R$ 50,00 (30 dias de acesso)</strong></div>
                    </div>

                    {/* Botão Principal: Suporte Telegram */}
                    <a
                      href={TELEGRAM_SUPPORT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer mb-2.5"
                    >
                      <Send className="w-4 h-4" />
                      <span>Enviar Comprovante no Suporte Telegram</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>

                    {/* Copiar Dados */}
                    <button
                      type="button"
                      onClick={handleCopyAccountData}
                      className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copiedData ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Dados Copiados para a Área de Transferência!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copiar Dados p/ Colar no Chat</span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-slate-400 text-center mt-3">
                      Suporte Oficial exclusivo via Telegram • Ativação rápida do seu acesso!
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTab('login');
                      setRegisterStep('explanation');
                    }}
                    className="w-full py-2.5 text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Voltar para a tela de Login
                  </button>
                </div>
              )}

            </div>
          )}

          {/* PARTE INFERIOR: BOTÃO VER CATÁLOGO DISPONÍVEL (SEM BOTÕES DE DEMO) */}
          <div className="mt-8 pt-5 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={onViewCatalog}
              className="w-full py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-amber-400/40 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md group"
            >
              <Eye className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Ver Catálogo Disponível</span>
            </button>
            <span className="text-[10px] text-slate-500 mt-2 block">
              Somente exibição dos jogos disponíveis • Download restrito para apoiadores
            </span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-3" />

    </div>
  );
};
