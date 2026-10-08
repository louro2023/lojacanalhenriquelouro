import React, { useState } from 'react';
import {
  DownloadCloud,
  ExternalLink,
  Play,
  Youtube,
  Sparkles,
  Zap,
  CheckCircle,
} from 'lucide-react';

export const DownloadManagerNotice: React.FC = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="w-full max-w-4xl mb-10 rounded-3xl bg-gradient-to-b from-[#121623] via-[#0d1018] to-[#080a0f] border border-amber-500/30 p-5 sm:p-7 shadow-2xl relative overflow-hidden text-left">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0">
            <DownloadCloud className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/15 px-2 py-0.5 rounded-full mb-0.5">
              <Zap className="w-3 h-3" />
              <span>Dica Importante para Downloads</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight font-sans">
              Recomendação para Downloads Estáveis e Rápidos
            </h3>
          </div>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
        Para ter uma <strong>excelente experiência com os downloads</strong> dos jogos (evitando falhas de conexão, interrupções pelo navegador e garantindo a velocidade máxima da sua internet), é <strong>altamente recomendado que você faça a instalação de um desses gerenciadores de download</strong>:
      </p>

      {/* Download Managers Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {/* AB Download Manager */}
        <a
          href="https://abdownloadmanager.com/#download"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/50 transition-all group flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black text-sm group-hover:scale-105 transition-transform">
              AB
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span>AB Download Manager</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                Moderno, ultra-rápido e com suporte a links diretos
              </p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors shrink-0" />
        </a>

        {/* JDownloader */}
        <a
          href="https://jdownloader.org/download/index"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/50 transition-all group flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-sm group-hover:scale-105 transition-transform">
              JD
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span>JDownloader 2</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                Poderoso gerenciador com reconexão automática
              </p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors shrink-0" />
        </a>
      </div>

      {/* Video Tutorial Section */}
      <div className="rounded-2xl bg-black/60 border border-white/10 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-500 shrink-0" />
            <h4 className="text-xs sm:text-sm font-bold text-white">
              Vídeo Tutorial: Como Utilizar o Gerenciador de Download
            </h4>
          </div>

          <a
            href="https://www.youtube.com/watch?v=Z8e67u9s2T8&t=3s"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 hover:underline font-semibold"
          >
            <span>Abrir no YouTube</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Embedded YouTube Video Player */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shadow-lg">
          <iframe
            src="https://www.youtube.com/embed/Z8e67u9s2T8?start=3"
            title="Como utilizar o gerenciador de download"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};
