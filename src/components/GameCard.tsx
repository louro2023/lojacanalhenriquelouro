import React, { useState, useRef } from 'react';
import { Download, Heart, Sparkles } from 'lucide-react';
import { GameItem, likeGame } from '../lib/firebase';

interface GameCardProps {
  game: GameItem;
  onDownload: (game: GameItem) => void;
}

export const MELI_SPONSOR_URL = 'https://meli.la/2EBwarN';

export const GameCard: React.FC<GameCardProps> = ({ game, onDownload }) => {
  const [imgError, setImgError] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadTrigger = () => {
    try {
      window.open(MELI_SPONSOR_URL, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('Erro ao abrir nova guia:', err);
    }
    onDownload(game);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rY = ((x - centerX) / centerX) * 8;
    const rX = -((y - centerY) / centerY) * 8;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasLiked) {
      likeGame(game.id);
      setHasLiked(true);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${
          isHovered ? 1.02 : 1
        }, ${isHovered ? 1.02 : 1}, 1)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
      }}
      className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#0e1627] via-[#09101c] to-[#050811] border border-cyan-500/20 hover:border-cyan-400/60 shadow-[0_15px_40px_rgba(0,0,0,0.85),0_0_20px_rgba(0,210,255,0.08)] p-5 flex flex-col items-center text-center transition-all group overflow-hidden"
    >
      {/* Ambient card corner glow */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/25 transition-all" />

      {/* TOP PS5 HEADER BANNER */}
      <div className="w-full flex items-center justify-between mb-4 pb-2.5 border-b border-white/10">
        {/* PS5 Official-style badge */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-md bg-white text-black font-black text-xs tracking-tighter uppercase shadow-[0_0_10px_rgba(255,255,255,0.3)] flex items-center gap-1">
            <span>PS5</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
            {game.developer || 'PlayStation 5'}
          </span>
        </div>

        {/* Live Real-Time Firebase Stats */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <button
            type="button"
            onClick={handleLike}
            title="Curtir"
            className={`flex items-center gap-1 transition-colors cursor-pointer ${
              hasLiked ? 'text-rose-400 font-bold' : 'hover:text-rose-400'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{game.likes + (hasLiked ? 1 : 0)}</span>
          </button>
        </div>
      </div>

      {/* REAL GAME IMAGE COVER CONTAINER */}
      <div
        onClick={handleDownloadTrigger}
        className="relative w-full aspect-[3/4] max-h-[360px] rounded-2xl overflow-hidden bg-black/60 border-2 border-cyan-500/30 group-hover:border-cyan-400/80 shadow-2xl cursor-pointer mb-5"
        title={`Clique para baixar ${game.realName}`}
      >
        {/* Official PS5 Header Bar on Cover */}
        <div className="absolute top-0 inset-x-0 z-20 h-6 bg-white flex items-center justify-between px-3 text-black">
          <span className="text-[10px] font-black tracking-tighter">PS5</span>
          <span className="text-[9px] font-bold tracking-widest uppercase text-slate-600">
            PlayStation 5
          </span>
        </div>

        {/* Real Game Image */}
        {!imgError ? (
          <img
            src={game.coverUrl}
            alt={game.realName}
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover object-center pt-6 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full pt-6 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-black text-slate-400">
            <Sparkles className="w-8 h-8 text-cyan-400 mb-2" />
            <span className="text-sm font-bold text-white uppercase">{game.realName}</span>
            <span className="text-xs text-slate-400">Edição Oficial PS5</span>
          </div>
        )}

        {/* Subtle Dark Gradient at bottom of image for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

        {/* Informação sobre a senha de descompactação na capa */}
        <div className="absolute bottom-0 inset-x-0 z-20 bg-black/90 backdrop-blur-md border-t border-cyan-400/60 px-2.5 py-1.5 text-center shadow-[0_-5px_15px_rgba(0,0,0,0.7)]">
          <p className="text-[10px] sm:text-[11px] font-extrabold text-cyan-300 leading-tight">
            A senha para descompactar podem ser &quot;SuperPSX ou DLPSGAME.COM OU [DLPSGAME.COM]&quot;
          </p>
        </div>

        {/* Overlay Action Prompt on Hover */}
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 z-30">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform bg-cyan-400 text-black">
            <Download className="w-5 h-5" />
          </div>
          <span className="text-white font-extrabold text-xs uppercase tracking-wider bg-black/80 px-3.5 py-1.5 rounded-full border border-white/20">
            Fazer Download
          </span>
          <span className="text-[10px] text-cyan-300 font-bold text-center px-2 mt-1">
            Senha: SuperPSX ou DLPSGAME.COM OU [DLPSGAME.COM]
          </span>
        </div>
      </div>

      {/* REAL GAME NAME & DETAILS */}
      <div className="w-full text-center mb-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-400 block mb-1">
            Jogo Completo Original
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans drop-shadow-sm">
            {game.realName}
          </h3>
        </div>

        {game.description && (
          <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-2 px-1">
            {game.description}
          </p>
        )}

        {/* Informação destacada da senha de descompactação */}
        <div className="mt-3 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center shadow-[0_0_15px_rgba(0,210,255,0.1)]">
          <p className="text-[11px] text-cyan-200 font-semibold leading-snug">
            🔑 A senha para descompactar podem ser <span className="text-white font-bold">&quot;SuperPSX ou DLPSGAME.COM OU [DLPSGAME.COM]&quot;</span>
          </p>
        </div>
      </div>

      {/* DIRECT BUTTON */}
      <button
        type="button"
        onClick={handleDownloadTrigger}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,210,255,0.35)] hover:shadow-[0_0_30px_rgba(0,210,255,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer group"
      >
        <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span>Fazer Download</span>
      </button>
    </div>
  );
};
