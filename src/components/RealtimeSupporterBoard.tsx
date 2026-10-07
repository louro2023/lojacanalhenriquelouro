import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, CheckCircle2, User } from 'lucide-react';
import {
  SupporterMessageItem,
  subscribeSupporterMessages,
  addSupporterMessage,
} from '../lib/firebase';

export const RealtimeSupporterBoard: React.FC = () => {
  const [messages, setMessages] = useState<SupporterMessageItem[]>([]);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
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
    if (!name.trim() || !comment.trim() || submitting) return;

    setSubmitting(true);
    const ok = await addSupporterMessage(name, comment);
    setSubmitting(false);

    if (ok) {
      setComment('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-4xl mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#10141f] via-[#0c0f17] to-[#07090e] border border-white/10 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Comunidade</span>
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight font-sans flex items-center gap-2">
            <span>Mural da Comunidade Gamer</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
          </h3>
        </div>

        <span className="text-xs text-slate-400">
          Comentários ao vivo
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form */}
        <div className="lg:col-span-5 bg-white/[0.02] border border-white/10 rounded-2xl p-5">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Deixe seu comentário</span>
          </h4>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Seu nome ou nick gamer..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                required
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <textarea
                placeholder="O que achou dos jogos? Deixe sua mensagem..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={280}
                rows={3}
                required
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span>Gravando comentário...</span>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Publicado ao Vivo!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar Comentário</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Messages List */}
        <div className="lg:col-span-7 flex flex-col gap-2.5 max-h-[290px] overflow-y-auto pr-1">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Carregando comentários...
            </div>
          ) : (
            messages.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-500/30 transition-colors text-left"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>{item.name}</span>
                  </span>
                  <span className="text-[10px] text-slate-500">{item.createdAt || 'Ao vivo'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
