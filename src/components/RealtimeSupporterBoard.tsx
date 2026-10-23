import React, { useState, useEffect, useMemo } from 'react';
import {
  Gamepad2,
  Send,
  Sparkles,
  CheckCircle2,
  User,
  Flame,
  ThumbsUp,
  Trophy,
  Clock,
  Search,
  Check,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import {
  GameRequestItem,
  subscribeGameRequests,
  addGameRequest,
  likeGameRequest,
} from '../lib/firebase';

const VOTED_STORAGE_KEY = 'hl_voted_game_requests_v1';

export const RealtimeSupporterBoard: React.FC = () => {
  const [requests, setRequests] = useState<GameRequestItem[]>([]);
  const [votedIds, setVotedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(VOTED_STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [activeTab, setActiveTab] = useState<'ranking' | 'recent'>('ranking');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [userName, setUserName] = useState('');
  const [gameTitle, setGameTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Like debounce / animation tracker
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  // Escuta os pedidos de jogos em tempo real
  useEffect(() => {
    const unsubscribe = subscribeGameRequests((liveRequests) => {
      setRequests(liveRequests);
    });
    return () => unsubscribe();
  }, []);

  // Persiste votos no localStorage
  const saveVotedIds = (newSet: Set<string>) => {
    setVotedIds(newSet);
    try {
      localStorage.setItem(VOTED_STORAGE_KEY, JSON.stringify(Array.from(newSet)));
    } catch {
      // ignore
    }
  };

  // Dar joinha / curtir (ou descurtir) um pedido
  const handleToggleLike = async (item: GameRequestItem) => {
    const isVoted = votedIds.has(item.id);
    const newSet = new Set(votedIds);
    const delta = isVoted ? -1 : 1;

    // Trigger visual animation
    setAnimatingId(item.id);
    setTimeout(() => setAnimatingId(null), 600);

    // Optimistic UI update
    if (isVoted) {
      newSet.delete(item.id);
    } else {
      newSet.add(item.id);
    }
    saveVotedIds(newSet);

    setRequests((prev) =>
      prev.map((req) => (req.id === item.id ? { ...req, likes: Math.max(0, (req.likes || 0) + delta) } : req))
    );

    // Persiste no Firestore
    await likeGameRequest(item.id, delta);
  };

  // Enviar novo pedido de jogo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameTitle.trim() || !userName.trim() || submitting) return;

    // Verifica se já existe um pedido muito parecido para sugerir dar joinha
    const cleanQuery = gameTitle.trim().toLowerCase();
    const existing = requests.find((r) => r.gameTitle.toLowerCase().includes(cleanQuery));

    setSubmitting(true);
    const res = await addGameRequest(gameTitle, userName, notes);
    setSubmitting(false);

    if (res.success && res.id) {
      // Marca como votado pelo autor
      const newSet = new Set(votedIds);
      newSet.add(res.id);
      saveVotedIds(newSet);

      setGameTitle('');
      setNotes('');
      setFormFeedback({
        type: 'success',
        message: existing
          ? `🎉 Seu pedido foi enviado com sucesso e já ganhou seu joinha inicial! Dica: "${existing.gameTitle}" também já estava no ranking.`
          : '🎉 Seu pedido foi registrado com sucesso e já estreou no ranking com seu joinha inicial!',
      });
      setTimeout(() => setFormFeedback(null), 5000);
    } else {
      setFormFeedback({
        type: 'error',
        message: 'Ocorreu um erro ao registrar seu pedido. Tente novamente!',
      });
      setTimeout(() => setFormFeedback(null), 4000);
    }
  };

  // Filtragem e Ordenação por Mais Curtidas (Ranking) ou Recentes
  const processedList = useMemo(() => {
    let list = [...requests];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (r) =>
          r.gameTitle.toLowerCase().includes(q) ||
          r.userName.toLowerCase().includes(q) ||
          (r.notes && r.notes.toLowerCase().includes(q))
      );
    }

    if (activeTab === 'ranking') {
      // Ordena pelos que tem mais curtidas (joinhas)
      list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
      // Ordena por data ou id
      list.sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        if (timeA && timeB) return timeB - timeA;
        return 0;
      });
    }

    return list;
  }, [requests, activeTab, searchTerm]);

  // Total de votos em toda a comunidade
  const totalVotes = useMemo(() => {
    return requests.reduce((acc, curr) => acc + (curr.likes || 0), 0);
  }, [requests]);

  return (
    <section id="peca-seu-game" className="w-full max-w-6xl mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0c1424] via-[#09101c] to-[#050811] border border-cyan-500/35 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(0,210,255,0.18)] relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[11px] font-bold text-cyan-300 uppercase tracking-widest mb-2 shadow-[0_0_12px_rgba(0,210,255,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Votação da Comunidade • PS5</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-sans flex flex-wrap items-center gap-3">
            <span>Peça seu Game Aqui!!</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-black text-emerald-300 uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Ao Vivo
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Dê um <strong>joinha / curtida</strong> nos jogos que você mais quer ver no catálogo! Os pedidos são ranqueados em tempo real e os mais votados têm prioridade para teste e postagem no PS5.
          </p>
        </div>

        {/* Community Stats Pills */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-2xl bg-black/60 border border-cyan-500/30 text-center shadow-inner">
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Total de Pedidos
            </span>
            <span className="text-base sm:text-lg font-black text-cyan-300">
              {requests.length}
            </span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-black/60 border border-cyan-500/30 text-center shadow-inner">
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Joinhas Dados
            </span>
            <span className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">
              {totalVotes} 👍
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* ======================================================== */}
        {/* COLUNA ESQUERDA: FORMULÁRIO PARA PEDIR NOVO JOGO */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#11192e] to-[#0a101f] border border-cyan-500/30 rounded-3xl p-6 shadow-xl sticky top-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span>Pedir um Novo Jogo</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold uppercase">
              PlayStation 5
            </span>
          </div>

          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Quer um jogo que ainda não está na lista de votação? Envie agora para a galera poder curtir e votar nele!
          </p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block mb-1">
                Nome do Jogo Desejado <span className="text-cyan-400">*</span>:
              </label>
              <div className="relative">
                <Gamepad2 className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ex: GTA VI, God of War Ragnarök..."
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  maxLength={90}
                  required
                  className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl bg-black/60 border border-cyan-500/35 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block mb-1">
                Seu Nome ou Nick Gamer <span className="text-cyan-400">*</span>:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ex: Pedro_PS5 ou HenriqueGamer"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  maxLength={40}
                  required
                  className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block mb-1">
                Observações / Detalhes (Opcional):
              </label>
              <textarea
                placeholder="Ex: com dublagem PT-BR, com DLCs, versão do PS5..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={200}
                rows={2}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
              />
            </div>

            {/* Feedback Message */}
            {formFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                  formFeedback.type === 'success'
                    ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-200'
                    : 'bg-red-950/70 border border-red-500/50 text-red-200'
                }`}
              >
                {formFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <span>{formFeedback.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:brightness-110 active:scale-95 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-cyan-400/25"
            >
              {submitting ? (
                <span>Enviando pedido ao ranking...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Cadastrar Pedido &amp; Votar 👍</span>
                </>
              )}
            </button>
          </form>

          {/* Dica rápida */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-start gap-2 text-[11px] text-slate-400">
            <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Ao enviar um pedido, ele entra automaticamente na disputa e você já dá o <strong>1º joinha</strong> nele!
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUNA DIREITA: RANKING E LISTA DE JOGOS PEDIDOS */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Controls Bar: Tabs & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl bg-black/60 border border-cyan-500/20">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80">
              <button
                type="button"
                onClick={() => setActiveTab('ranking')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'ranking'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Mais Curtidos (Ranking)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('recent')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'recent'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Recentes</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          {/* Ranking Header Summary */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-bold uppercase tracking-wider text-[11px]">
              {activeTab === 'ranking' ? '🏆 Ranking Oficial por Curtidas' : '🕒 Pedidos Mais Recentes'}
            </span>
            <span className="text-[11px] text-cyan-400 font-semibold">
              Exibindo {processedList.length} jogos
            </span>
          </div>

          {/* List of Game Requests */}
          <div className="flex flex-col gap-3 max-h-[580px] overflow-y-auto pr-1">
            {processedList.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-black/40 border border-white/10 text-slate-400 text-xs">
                Nenhum jogo encontrado com esse termo. Seja o primeiro a pedir pelo formulário ao lado!
              </div>
            ) : (
              processedList.map((item, index) => {
                const rankNumber = index + 1;
                const isVoted = votedIds.has(item.id);
                const isAnimating = animatingId === item.id;

                // Estilos especiais para o Top 3
                const isTop1 = activeTab === 'ranking' && rankNumber === 1;
                const isTop2 = activeTab === 'ranking' && rankNumber === 2;
                const isTop3 = activeTab === 'ranking' && rankNumber === 3;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 relative group text-left ${
                      isTop1
                        ? 'bg-gradient-to-r from-amber-950/40 via-black/80 to-amber-950/20 border-amber-500/50 shadow-[0_4px_25px_rgba(245,158,11,0.18)] hover:border-amber-400'
                        : isTop2
                        ? 'bg-gradient-to-r from-slate-800/40 via-black/80 to-slate-900/40 border-slate-400/40 shadow-md hover:border-slate-300'
                        : isTop3
                        ? 'bg-gradient-to-r from-orange-950/30 via-black/80 to-orange-950/15 border-orange-500/40 shadow-md hover:border-orange-400'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      
                      {/* Left: Rank Badge + Game Info */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Rank Badge */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-md ${
                            isTop1
                              ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-black shadow-amber-500/40 scale-105'
                              : isTop2
                              ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-black shadow-slate-400/30'
                              : isTop3
                              ? 'bg-gradient-to-br from-amber-700 to-orange-800 text-white shadow-orange-600/30'
                              : 'bg-slate-900 border border-white/15 text-slate-300'
                          }`}
                        >
                          {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : `#${rankNumber}`}
                        </div>

                        {/* Title and Metadata */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className="text-sm sm:text-base font-black text-white tracking-tight truncate">
                              {item.gameTitle}
                            </h4>

                            {isTop1 && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-[9px] font-black uppercase text-amber-300 flex items-center gap-1">
                                <Trophy className="w-3 h-3 text-amber-400" />
                                Mais Votado
                              </span>
                            )}

                            {item.status === 'in_review' && (
                              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/40 text-[9px] font-black uppercase text-sky-300">
                                Em Análise PS5
                              </span>
                            )}
                            {item.status === 'testing' && (
                              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-[9px] font-black uppercase text-purple-300">
                                Em Testes
                              </span>
                            )}
                            {item.status === 'added' && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[9px] font-black uppercase text-emerald-300">
                                Adicionado!
                              </span>
                            )}
                          </div>

                          {/* Notes */}
                          {item.notes && (
                            <p className="text-xs text-slate-300 leading-snug line-clamp-2 mb-2">
                              {item.notes}
                            </p>
                          )}

                          {/* Submitter and Date */}
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span className="flex items-center gap-1 font-semibold text-slate-300">
                              <User className="w-3 h-3 text-cyan-400" />
                              <span>{item.userName}</span>
                            </span>
                            <span>•</span>
                            <span>{item.createdAt || 'Recentemente'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Joinha / Curtida Button */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleLike(item)}
                          title={isVoted ? 'Clique para retirar seu joinha' : 'Dar um joinha / curtir esse pedido'}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-90 ${
                            isVoted
                              ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-black shadow-lg shadow-cyan-400/35 border border-cyan-300 scale-105'
                              : 'bg-white/10 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-white/15 hover:border-cyan-500/40'
                          } ${isAnimating ? 'animate-bounce' : ''}`}
                        >
                          <ThumbsUp
                            className={`w-4 h-4 transition-transform ${
                              isVoted ? 'fill-black scale-110' : 'group-hover:scale-110'
                            }`}
                          />
                          <span className="text-xs font-black">
                            {item.likes || 0}
                          </span>
                        </button>

                        <span className="text-[9px] font-semibold text-slate-400">
                          {isVoted ? (
                            <span className="text-cyan-300 font-bold flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" />
                              Curtido!
                            </span>
                          ) : (
                            'Dar Joinha 👍'
                          )}
                        </span>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note inside board */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/25 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Quanto mais curtidas o pedido tiver, mais rápido ele sobe no ranking!</span>
            </span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">
              Votação em tempo real sincronizada via Firestore
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
