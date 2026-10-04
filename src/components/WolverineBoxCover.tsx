import React, { useState, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';

interface WolverineBoxCoverProps {
  driveUrl: string;
  onClick?: () => void;
  className?: string;
}

export const WolverineBoxCover: React.FC<WolverineBoxCoverProps> = ({
  driveUrl,
  onClick,
  className = '',
}) => {
  const boxRef = useRef<HTMLAnchorElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rY = ((x - centerX) / centerX) * 10;
    const rX = -((y - centerY) / centerY) * 10;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={`relative perspective-1000 select-none group ${className}`}>
      {/* Outer Ambient Glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-orange-600/15 to-red-600/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Clickable Cover Box */}
      <a
        href={driveUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        ref={boxRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
        }}
        className="relative block w-full max-w-[320px] sm:max-w-[360px] aspect-[1/1.38] rounded-2xl p-[3px] bg-gradient-to-b from-amber-500/40 via-slate-800/60 to-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(245,158,11,0.2)] cursor-pointer overflow-hidden transform-gpu"
        title="Clique na capa para comprar Wolverine"
        aria-label="Capa do jogo Wolverine"
      >
        <div className="relative w-full h-full rounded-[14px] bg-[#07090e] overflow-hidden flex flex-col justify-between border border-amber-500/20">
          
          {/* Top Brand Bar */}
          <div className="relative z-10 w-full px-4 py-3 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase">
                ORIGINAL
              </span>
            </div>
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Edição Especial
            </div>
          </div>

          {/* MAIN WOLVERINE ARTWORK */}
          <div className="relative flex-1 w-full overflow-hidden flex flex-col items-center justify-center">
            
            {/* Atmospheric light slashes & particles */}
            <div className="absolute inset-0 opacity-70 pointer-events-none">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-4 w-40 h-40 bg-red-600/20 rounded-full blur-2xl" />
            </div>

            {/* Wolverine Silhouette with Adamantium Claws */}
            <div className="relative z-10 w-full h-[210px] flex items-center justify-center px-4">
              <svg className="w-full h-full filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]" viewBox="0 0 300 240" fill="none">
                <defs>
                  <linearGradient id="clawMetallicClean" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="30%" stopColor="#e2e8f0" />
                    <stop offset="60%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>

                  <linearGradient id="clawHighlight" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
                  </linearGradient>

                  <radialGradient id="emberRadial" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                    <stop offset="70%" stopColor="#dc2626" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <circle cx="150" cy="120" r="90" fill="url(#emberRadial)" />

                {/* Character Torso */}
                <g opacity="0.95">
                  <path
                    d="M 65 240 Q 85 175 110 155 Q 150 145 190 155 Q 215 175 235 240 Z"
                    fill="#0e131d"
                    stroke="#1e293b"
                    strokeWidth="2"
                  />
                  {/* Yellow suit accents */}
                  <path
                    d="M 115 160 L 140 240 L 160 240 L 185 160 Q 150 150 115 160 Z"
                    fill="#eab308"
                    opacity="0.85"
                  />
                  {/* Cowl head */}
                  <ellipse cx="150" cy="115" rx="32" ry="40" fill="#0c1018" />
                  {/* Left fin */}
                  <path d="M 125 125 C 110 85 90 50 75 30 C 100 45 120 70 135 100 Z" fill="#090d16" />
                  {/* Right fin */}
                  <path d="M 175 125 C 190 85 210 50 225 30 C 200 45 180 70 165 100 Z" fill="#090d16" />
                  {/* Mask brow */}
                  <path d="M 130 105 Q 150 117 170 105 Q 150 97 130 105 Z" fill="#eab308" />
                  {/* Eyes */}
                  <polygon points="135,108 144,111 142,114 135,112" fill="#ffffff" filter="drop-shadow(0 0 2px #fff)" />
                  <polygon points="165,108 156,111 158,114 165,112" fill="#ffffff" filter="drop-shadow(0 0 2px #fff)" />
                </g>

                {/* 3 ADAMANTIUM CLAWS */}
                <g className="transition-transform duration-300 group-hover:scale-105 origin-center">
                  {/* Claw 1 */}
                  <path d="M 85 230 Q 95 130 108 40 Q 102 130 76 230 Z" fill="url(#clawMetallicClean)" stroke="#cbd5e1" strokeWidth="1.2" />
                  <path d="M 87 220 Q 96 130 108 40 Q 105 130 85 220 Z" fill="url(#clawHighlight)" />

                  {/* Claw 2 */}
                  <path d="M 144 235 Q 148 120 150 20 Q 140 120 134 235 Z" fill="url(#clawMetallicClean)" stroke="#f8fafc" strokeWidth="1.5" />
                  <path d="M 145 225 Q 149 120 150 20 Q 144 120 141 225 Z" fill="url(#clawHighlight)" />

                  {/* Claw 3 */}
                  <path d="M 195 230 Q 200 130 192 40 Q 205 130 205 230 Z" fill="url(#clawMetallicClean)" stroke="#cbd5e1" strokeWidth="1.2" />
                  <path d="M 196 220 Q 200 130 192 40 Q 202 130 200 220 Z" fill="url(#clawHighlight)" />

                  {/* Slash lines */}
                  <line x1="30" y1="35" x2="270" y2="175" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 4" opacity="0.6" />
                </g>
              </svg>
            </div>

            {/* TITLE ON COVER */}
            <div className="relative z-10 w-full px-4 pt-1 pb-4 text-center bg-gradient-to-t from-[#090b10] via-[#090b10]/90 to-transparent">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-sans drop-shadow-md">
                <span className="text-amber-400">WOLVERINE</span>
              </h2>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="relative z-10 px-4 py-2.5 bg-black/60 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Jogo Completo</span>
            <span className="text-amber-400 font-bold uppercase">Original</span>
          </div>

        </div>

        {/* Dynamic Specular Glare */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 mix-blend-overlay"
          style={{
            background: isHovered
              ? `radial-gradient(circle 260px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.35), transparent 70%)`
              : 'none',
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Hover State Prompt */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 p-4 text-center z-20">
          <div className="w-12 h-12 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <span className="text-white font-extrabold text-sm uppercase tracking-wider">
            Comprar Agora
          </span>
        </div>
      </a>
    </div>
  );
};
