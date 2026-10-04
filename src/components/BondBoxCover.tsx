import React, { useState, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';

interface BondBoxCoverProps {
  driveUrl: string;
  onClick?: () => void;
  className?: string;
}

export const BondBoxCover: React.FC<BondBoxCoverProps> = ({
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
      {/* Outer Ambient Glow - Gold / Cyan 007 Secret Agent lighting */}
      <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-sky-600/15 to-slate-400/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

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
        className="relative block w-full max-w-[320px] sm:max-w-[360px] aspect-[1/1.38] rounded-2xl p-[3px] bg-gradient-to-b from-amber-400/40 via-slate-700/60 to-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(245,158,11,0.15)] cursor-pointer overflow-hidden transform-gpu"
        title="Clique na capa para comprar 007"
        aria-label="Capa do jogo 007"
      >
        <div className="relative w-full h-full rounded-[14px] bg-[#06080d] overflow-hidden flex flex-col justify-between border border-amber-500/25">
          
          {/* Top Brand Bar */}
          <div className="relative z-10 w-full px-4 py-3 flex items-center justify-between bg-gradient-to-b from-black/85 to-transparent">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase">
                MI6 CLASSIFIED
              </span>
            </div>
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Edição Especial
            </div>
          </div>

          {/* MAIN 007 ARTWORK - Gun Barrel & Secret Agent Silhouette */}
          <div className="relative flex-1 w-full overflow-hidden flex flex-col items-center justify-center">
            
            {/* Ambient Radial Lights */}
            <div className="absolute inset-0 opacity-80 pointer-events-none">
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-6 w-36 h-36 bg-blue-600/15 rounded-full blur-2xl" />
            </div>

            {/* Gun Barrel SVG Artwork */}
            <div className="relative z-10 w-full h-[210px] flex items-center justify-center px-4">
              <svg className="w-full h-full filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]" viewBox="0 0 300 240" fill="none">
                <defs>
                  <radialGradient id="barrelGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="25%" stopColor="#e2e8f0" stopOpacity="0.8" />
                    <stop offset="60%" stopColor="#334155" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </radialGradient>

                  <linearGradient id="goldGun" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="40%" stopColor="#f59e0b" />
                    <stop offset="70%" stopColor="#b45309" />
                    <stop offset="100%" stopColor="#fef08a" />
                  </linearGradient>

                  <linearGradient id="metallic007" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="30%" stopColor="#cbd5e1" />
                    <stop offset="70%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#f8fafc" />
                  </linearGradient>
                </defs>

                {/* Gun Barrel Spiraling Rifling Lines */}
                <g opacity="0.45" stroke="#94a3b8" strokeWidth="1.2">
                  <path d="M 40 40 Q 150 70 170 120" />
                  <path d="M 80 20 Q 170 80 180 140" />
                  <path d="M 160 15 Q 190 100 170 160" />
                  <path d="M 230 40 Q 210 130 150 170" />
                  <path d="M 260 90 Q 210 160 120 170" />
                  <path d="M 250 160 Q 180 180 100 150" />
                  <path d="M 200 220 Q 130 180 90 120" />
                  <path d="M 120 230 Q 90 160 100 90" />
                  <path d="M 50 190 Q 80 110 130 80" />
                </g>

                {/* Outer Target Aperture Rings */}
                <circle cx="150" cy="120" r="85" stroke="#475569" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
                <circle cx="150" cy="120" r="70" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" />
                <circle cx="150" cy="120" r="55" fill="url(#barrelGlow)" />

                {/* Crosshairs */}
                <line x1="150" y1="20" x2="150" y2="220" stroke="#ef4444" strokeWidth="0.8" opacity="0.6" strokeDasharray="3 3" />
                <line x1="50" y1="120" x2="250" y2="120" stroke="#ef4444" strokeWidth="0.8" opacity="0.6" strokeDasharray="3 3" />

                {/* Agent 007 Silhouette inside the aperture */}
                <g className="transition-transform duration-300 group-hover:scale-105 origin-center">
                  {/* Tuxedo Body */}
                  <path
                    d="M 134 165 L 140 128 L 144 116 L 156 116 L 160 128 L 166 165 Z"
                    fill="#020408"
                  />
                  {/* Shirt White V */}
                  <polygon points="146,116 154,116 150,130" fill="#ffffff" />
                  {/* Bowtie */}
                  <polygon points="147,118 153,118 151,121 153,124 147,124 149,121" fill="#020408" />
                  {/* Head */}
                  <circle cx="150" cy="106" r="8" fill="#020408" />
                  
                  {/* Gun Arm Raised */}
                  <path
                    d="M 160 126 L 176 118 L 184 118"
                    stroke="#020408"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* Pistol Walther PPK Silencer */}
                  <rect x="182" y="115" width="16" height="3" fill="url(#goldGun)" />
                  <rect x="180" y="117" width="5" height="5" fill="#020408" />

                  {/* Bullet muzzle flash spark */}
                  <circle cx="199" cy="116.5" r="2.5" fill="#fef08a" filter="drop-shadow(0 0 4px #f59e0b)" />
                </g>
              </svg>
            </div>

            {/* 007 ICONIC LOGO ON COVER */}
            <div className="relative z-10 w-full px-4 pt-1 pb-4 text-center bg-gradient-to-t from-[#090b10] via-[#090b10]/95 to-transparent">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className="text-[10px] tracking-[0.3em] uppercase font-black text-amber-400">
                  JAMES BOND
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white font-sans drop-shadow-lg flex items-center justify-center gap-1">
                <span>00</span>
                <span className="text-amber-400 relative inline-block">
                  7
                  {/* Gun barrel on top of the 7 */}
                  <span className="absolute -top-1 right-full w-5 h-1.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-l" />
                </span>
              </h2>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="relative z-10 px-4 py-2.5 bg-black/70 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Jogo Completo</span>
            <span className="text-amber-400 font-bold uppercase tracking-wider">Original</span>
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

        {/* Hover State Action */}
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 p-4 text-center z-20">
          <div className="w-12 h-12 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <span className="text-white font-extrabold text-sm uppercase tracking-wider">
            Comprar 007
          </span>
        </div>
      </a>
    </div>
  );
};
