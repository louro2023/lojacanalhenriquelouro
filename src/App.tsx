import React, { useState } from 'react';
import { WolverineBoxCover } from './components/WolverineBoxCover';
import { PasswordModal } from './components/PasswordModal';
import { ShoppingCart } from 'lucide-react';

const PURCHASE_URL =
  'https://drive.google.com/drive/folders/1b-JKWAcrRU0s9nAE1dWqW_Y40ZOBNfrN?usp=drive_link';

export default function App() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleOpenPasswordPrompt = () => {
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSuccess = () => {
    setIsPasswordModalOpen(false);
    // Redirect to the provided Google Drive link upon correct password
    window.open(PURCHASE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#090c12] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      
      {/* Top Header - Henrique Games */}
      <header className="w-full border-b border-white/10 bg-[#07090e]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-center sm:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 flex items-center justify-center text-black font-black text-base shadow-md shadow-amber-500/20">
              HG
            </div>
            <span className="text-xl font-black tracking-tight text-white uppercase font-sans">
              Henrique <span className="text-amber-400">Games</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content - Wolverine */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-orange-600/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md flex flex-col items-center text-center relative z-10">
          
          {/* Game Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-sans drop-shadow-sm mb-6">
            <span className="text-amber-400">Wolverine</span>
          </h1>

          {/* Interactive Cover Art (Clickable - Prompts Password) */}
          <div className="flex justify-center w-full mb-6">
            <WolverineBoxCover
              driveUrl={PURCHASE_URL}
              onClick={handleOpenPasswordPrompt}
            />
          </div>

          {/* COMPRAR Button directly underneath the cover */}
          <div className="w-full max-w-[320px] sm:max-w-[360px] flex flex-col items-center">
            <button
              type="button"
              onClick={handleOpenPasswordPrompt}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black font-black text-base uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              id="btn-comprar"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>COMPRAR</span>
            </button>
          </div>

        </div>

      </main>

      {/* Minimalist Footer */}
      <footer className="w-full border-t border-white/10 py-6 text-center text-xs text-slate-500 bg-[#07090e]">
        <div className="max-w-5xl mx-auto px-4">
          <p className="font-semibold text-slate-400">Henrique Games</p>
          <p className="mt-1 text-[11px]">Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Password Modal */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handlePasswordSuccess}
      />

    </div>
  );
}
