import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Send,
  Sparkles,
  CheckCircle2,
  User,
  Flame,
  PlusCircle,
} from 'lucide-react';
import {
  SupporterMessageItem,
  subscribeSupporterMessages,
  addSupporterMessage,
} from '../lib/firebase';

const SAMPLE_REQUESTS: SupporterMessageItem[] = [
  {
    id: 'sample-1',
    name: 'Carlos_PS5',
    message: 'Por favor tragam God of War Ragnarök com dublagem em PT-BR!',
    gameRequested: 'God of War Ragnarök (PT-BR)',
    createdAt: 'Hoje',
  },
  {
    id: 'sample-2',
    name: 'GamerRJ_99',
    message: 'Adicionem Marvel\'s Spider-Man 2 para compra no console.',
    gameRequested: 'Marvel\'s Spider-Man 2',
    createdAt: 'Hoje',
  },
  {
    id: 'sample-3',
    name: 'Lucas_Souls',
    message: 'Testem Demon\'s Souls Remake funcionando 100% no PS5!',
    gameRequested: 'Demon\'s Souls Remake',
    createdAt: 'Ontem',
  },
];

export const RealtimeSupporterBoard: React.FC = () => {
  const [messages, setMessages] = useState<SupporterMessageItem[]>([]);
  const [name, setName] = useState('');
  const [gameTitle, setGameTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeSupporterMessages((msgs) => {
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !gameTitle.trim() || submitting) return;

    setSubmitting(true);
    const fullMessage = notes.trim()
      ? `Jogo pedido: ${gameTitle.trim()} — ${notes.trim()}`
      : `Jogo pedido: ${gameTitle.trim()}`;

    const ok = await addSupporterMessage(name, fullMessage, gameTitle.trim());
    setSubmitting(false);

    if (ok) {
      setGameTitle('');
      setNotes('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    }
  };

  const displayedList = messages.length > 0 ? messages : SAMPLE_REQUESTS;

  return (
    <div className="w-full max-w-4xl mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#10141f] via-[#0c0f17] to-[#07090e] border border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.15)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mural de Pedidos da Comunidade</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans flex items-center gap-2.5">
            <span>Peça seu Game Aqui!!</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
            Escreva o nome do jogo que você quer que seja adicionado ao catálogo para <strong className="text-amber-400">&quot;compra&quot;</strong> testado e funcionando no PS5!
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 shrink-0">
          <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>Pedidos ao Vivo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Container */}
        <div className="lg:col-span-5 bg-black/50 border border-white/10 rounded-2xl p-5 shadow-inner">
          <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Gamepad2 className="w-4 h-4" />
            <span>Peça seu Jogo para o Catálogo</span>
          </h4>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Seu Nome ou Nick Gamer:
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ex: Pedro_PS5"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  required
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Nome do Jogo Desejado:
              </label>
              <div className="relative">
                <Gamepad2 className="w-3.5 h-3.5 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ex: God of War Ragnarök, GTA VI, Spider-Man 2..."
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  maxLength={80}
                  required
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Observações (Opcional):
              </label>
              <textarea
                placeholder="Ex: com dublagem PT-BR, com DLCs, versão especial..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={200}
                rows={2}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 active:scale-95 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md shadow-amber-400/25"
            >
              {submitting ? (
                <span>Enviando seu pedido...</span>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                  <span>Pedido Enviado ao Mural!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Pedir Game para &quot;Compra&quot;</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Messages List */}
        <div className="lg:col-span-7 flex flex-col gap-2.5 max-h-[360px] overflow-y-auto pr-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between pb-1">
            <span>Últimos Pedidos dos Usuários</span>
            <span className="text-[10px] text-amber-400">Total: {displayedList.length} pedidos</span>
          </div>

          {displayedList.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 transition-colors text-left group"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>{item.name}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[9px] font-black uppercase text-amber-300">
                    PS5
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">
                  {item.createdAt || 'Agora mesmo'}
                </span>
              </div>

              {item.gameRequested && (
                <div className="mb-1 flex items-center gap-1.5 text-xs font-black text-amber-400">
                  <PlusCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Jogo solicitado: {item.gameRequested}</span>
                </div>
              )}

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {item.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
