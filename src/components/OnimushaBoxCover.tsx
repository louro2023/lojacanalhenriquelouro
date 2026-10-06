import React, { useState, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';

interface OnimushaBoxCoverProps {
  driveUrl: string;
  onClick?: () => void;
  className?: string;
}

export const OnimushaBoxCover: React.FC<OnimushaBoxCoverProps> = ({
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
      {/* Outer Ambient Glow - Crimson Samurai & Oni lightning */}
      <div className="absolute -inset-4 bg-gradient-to-r from-red-600/25 via-amber-500/15 to-purple-600/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

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
        className="relative block w-full max-w-[320px] sm:max-w-[360px] aspect-[1/1.38] rounded-2xl p-[3px] bg-gradient-to-b from-red-500/40 via-amber-700/40 to-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(239,68,68,0.2)] cursor-pointer overflow-hidden transform-gpu"
        title="Clique na capa para comprar Onimusha"
        aria-label="Capa do jogo Onimusha"
      >
        <div className="relative w-full h-full rounded-[14px] bg-[#080509] overflow-hidden flex flex-col justify-between border border-red-500/25">
          
          {/* Top Brand Bar */}
          <div className="relative z-10 w-full px-4 py-3 flex items-center justify-between bg-gradient-to-b from-black/85 to-transparent">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-[10px] font-black tracking-widest text-red-300 uppercase">
                SAMURAI WARLORDS
              </span>
            </div>
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Edição Especial
            </div>
          </div>

          {/* MAIN ARTWORK - Samurai with Katana & Oni Gauntlet */}
          <div className="relative flex-1 w-full overflow-hidden flex flex-col items-center justify-center">
            
            {/* Ambient Red & Blue Oni Glows */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-600/20 rounded-full blur-3xl" />
              <div className="absolute bottom-1/3 left-6 w-32 h-32 bg-purple-600/25 rounded-full blur-2xl" />
              <div className="absolute top-1/2 right-4 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl" />
            </div>

            {/* Samurai Art SVG */}
            <div className="relative z-10 w-full h-[220px] flex items-center justify-center px-2">
              <svg
                className="w-full h-full filter drop-shadow-[0_12px_25px_rgba(0,0,0,0.95)]"
                viewBox="0 0 300 240"
                fill="none"
              >
                <defs>
                  {/* Glowing Katana Blade Gradient */}
                  <linearGradient id="katanaBlade" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="35%" stopColor="#ffffff" />
                    <stop offset="60%" stopColor="#bae6fd" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>

                  {/* Demon Oni Gauntlet Glow */}
                  <radialGradient id="oniEye" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="30%" stopColor="#ef4444" />
                    <stop offset="80%" stopColor="#7f1d1d" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>

                  {/* Sun / Moon Background Circle */}
                  <radialGradient id="bloodMoon" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                    <stop offset="60%" stopColor="#991b1b" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </radialGradient>

                  {/* Gold Armor Gradient */}
                  <linearGradient id="goldArmor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#78350f" />
                  </linearGradient>
                </defs>

                {/* Blood Moon / Demon Portal in background */}
                <circle cx="150" cy="115" r="85" fill="url(#bloodMoon)" />
                <circle cx="150" cy="115" r="75" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />

                {/* Embers and Cherry Blossom Petals */}
                <g opacity="0.6">
                  <circle cx="90" cy="60" r="1.5" fill="#f87171" />
                  <circle cx="210" cy="70" r="2" fill="#fbbf24" />
                  <circle cx="70" cy="140" r="1.5" fill="#ef4444" />
                  <circle cx="230" cy="130" r="2" fill="#f87171" />
                  <circle cx="120" cy="40" r="1" fill="#fef08a" />
                  <circle cx="180" cy="35" r="1.5" fill="#f87171" />
                  <path d="M 65 90 Q 75 95 70 102 Q 60 98 65 90" fill="#f43f5e" opacity="0.7" />
                  <path d="M 225 95 Q 235 90 238 100 Q 228 102 225 95" fill="#f43f5e" opacity="0.7" />
                </g>

                {/* Katana Slashing Slash Arc (Lightning / Soul Energy) */}
                <path
                  d="M 50 185 Q 150 70 260 45"
                  stroke="url(#katanaBlade)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 8px #38bdf8)"
                />
                <path
                  d="M 55 183 Q 150 75 255 50"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />

                {/* SAMURAI FIGURE SILHOUETTE & DETAILED ARMOR */}
                <g className="transition-transform duration-300 group-hover:scale-105 origin-center">
                  
                  {/* Katana Blade Held */}
                  <line
                    x1="120"
                    y1="130"
                    x2="250"
                    y2="50"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    filter="drop-shadow(0 0 6px #e0f2fe)"
                  />
                  {/* Katana Tsuba (Guard) & Hilt */}
                  <rect x="115" y="128" width="6" height="12" rx="1" fill="url(#goldArmor)" transform="rotate(-32 118 134)" />
                  <line x1="102" y1="144" x2="116" y2="132" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />

                  {/* Samurai Body / Armor (Kabuto & Mengu) */}
                  {/* Torso Armor (Do) */}
                  <path
                    d="M 130 185 L 134 135 L 145 125 L 158 125 L 168 135 L 172 185 Z"
                    fill="#111827"
                  />
                  {/* Chest Armor Plates */}
                  <path d="M 137 142 L 165 142" stroke="url(#goldArmor)" strokeWidth="2" />
                  <path d="M 135 152 L 167 152" stroke="url(#goldArmor)" strokeWidth="2" />
                  <path d="M 133 162 L 169 162" stroke="url(#goldArmor)" strokeWidth="2" />
                  <path d="M 132 172 L 170 172" stroke="url(#goldArmor)" strokeWidth="2" />

                  {/* Shoulder Guards (Sode) */}
                  <path d="M 124 132 L 136 138 L 133 160 L 120 152 Z" fill="#1f2937" stroke="#b45309" strokeWidth="1" />
                  <path d="M 178 132 L 166 138 L 169 160 L 182 152 Z" fill="#1f2937" stroke="#b45309" strokeWidth="1" />

                  {/* ONI GAUNTLET (Left Arm - The Demonic Gauntlet from Onimusha) */}
                  <path d="M 112 148 L 128 142 L 122 165 L 108 160 Z" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" />
                  <circle cx="118" cy="154" r="5" fill="url(#oniEye)" filter="drop-shadow(0 0 6px #ef4444)" />
                  <circle cx="118" cy="154" r="2" fill="#fef08a" />

                  {/* Neck / Armor collar */}
                  <polygon points="144,122 158,122 154,130 148,130" fill="#374151" />

                  {/* Samurai Helmet (Kabuto) */}
                  <path
                    d="M 138 116 C 138 98 164 98 164 116 L 168 122 L 134 122 Z"
                    fill="#0f172a"
                  />
                  {/* Helmet Crest (Maedate - Golden Crescent Horn) */}
                  <path
                    d="M 151 90 Q 140 102 135 106 Q 147 105 151 112 Q 155 105 167 106 Q 162 102 151 90 Z"
                    fill="url(#goldArmor)"
                    filter="drop-shadow(0 0 4px #f59e0b)"
                  />
                  {/* Face Mask (Mengu) with glowing demonic eyes */}
                  <path d="M 143 113 L 159 113 L 155 124 L 147 124 Z" fill="#18181b" />
                  <circle cx="147" cy="116" r="1.5" fill="#ef4444" filter="drop-shadow(0 0 3px #ef4444)" />
                  <circle cx="155" cy="116" r="1.5" fill="#ef4444" filter="drop-shadow(0 0 3px #ef4444)" />
                </g>
              </svg>
            </div>

            {/* ONIMUSHA TITLE LOGO */}
            <div className="relative z-10 w-full px-4 pt-1 pb-4 text-center bg-gradient-to-t from-[#0a060d] via-[#0a060d]/95 to-transparent">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className="text-[10px] tracking-[0.25em] uppercase font-black text-red-500">
                  WARLORDS
                </span>
                <span className="text-slate-500 text-[10px]">•</span>
                <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-amber-400">
                  SAMURAI
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans drop-shadow-[0_4px_12px_rgba(239,68,68,0.5)] flex items-center justify-center gap-1">
                <span className="text-red-500">ONI</span>
                <span className="text-white">MUSHA</span>
              </h2>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="relative z-10 px-4 py-2.5 bg-black/80 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Jogo Completo</span>
            <span className="text-red-400 font-bold uppercase tracking-wider">Original</span>
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
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 p-4 text-center z-20">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <span className="text-white font-extrabold text-sm uppercase tracking-wider">
            Comprar Onimusha
          </span>
        </div>
      </a>
    </div>
  );
};
