import React, { useState } from 'react';
import { WolverineBoxCover } from './components/WolverineBoxCover';
import { BondBoxCover } from './components/BondBoxCover';
import { OnimushaBoxCover } from './components/OnimushaBoxCover';
import { PurchaseModal } from './components/PurchaseModal';
import { NoticeModal } from './components/NoticeModal';
import { DonationModal } from './components/DonationModal';
import { ShoppingCart, Heart, Sparkles, Server, Info, Coins, QrCode } from 'lucide-react';

const WOLVERINE_URL =
  'https://drive.google.com/drive/folders/1b-JKWAcrRU0s9nAE1dWqW_Y40ZOBNfrN?usp=drive_link';

const BOND_URL =
  'https://drive.google.com/drive/folders/1_QpKgLa5mL-2ojdQHV8DgpBua2PLtUAt?usp=drive_link';

const ONIMUSHA_URL =
  'https://drive.google.com/drive/folders/1oEzSNKLzjXiBosNs-1TLVxBQvNbYbbas?usp=drive_link';

const DONATION_URL =
  'https://nubank.com.br/cobrar/3a4h2/6ac3a284-c7d1-419a-8d8c-17364a2251c7';

const CUSTOM_DONATION_URL =
  'https://nubank.com.br/cobrar/3a4h2/6ac1eb8d-5603-425a-9724-34655040d351';

interface SelectedGame {
  name: string;
  driveUrl: string;
}

export default function App() {
  const [selectedGame, setSelectedGame] = useState<SelectedGame | null>(null);
  const [isNoticeOpen, setIsNoticeOpen] = useState(true);
  const [donationModalState, setDonationModalState] = useState<{
    isOpen: boolean;
    mode: 'fixed' | 'custom';
  }>({
    isOpen: false,
    mode: 'fixed',
  });

  const handleOpenPurchase = (name: string, driveUrl: string) => {
    setSelectedGame({ name, driveUrl });
  };

  const handleClosePurchaseModal = () => {
    setSelectedGame(null);
  };

  const handleOpenDonation = (mode: 'fixed' | 'custom' = 'fixed') => {
    setDonationModalState({ isOpen: true, mode });
  };

  return (
    <div className="min-h-screen bg-[#090c12] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      
      {/* Top Header - Henrique Games */}
      <header className="w-full border-b border-white/10 bg-[#07090e]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 flex items-center justify-center text-black font-black text-base shadow-md shadow-amber-500/20">
              HG
            </div>
            <span className="text-xl font-black tracking-tight text-white uppercase font-sans">
              Henrique <span className="text-amber-400">Games</span>
            </span>
          </div>

          {/* Header Action Buttons (Open in-app QR Code modals without external pages) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setIsNoticeOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              title="Avisos sobre o servidor e downloads"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Avisos</span>
            </button>

            {/* Quick Support QR Button (R$ 5) */}
            <button
              type="button"
              onClick={() => handleOpenDonation('fixed')}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/70 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
              <span>Apoiar (R$ 5)</span>
            </button>

            {/* Quick Support QR Button (Outro Valor) */}
            <button
              type="button"
              onClick={() => handleOpenDonation('custom')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Outro Valor</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notice Banner */}
      <div className="w-full bg-gradient-to-r from-purple-950/40 via-amber-950/30 to-purple-950/40 border-b border-white/5 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Meta do Servidor:</strong> Apoie para adquirirmos um servidor próprio e evitar cotas do Google Drive!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsNoticeOpen(true)}
            className="text-amber-400 hover:underline font-semibold cursor-pointer shrink-0"
          >
            Ler comunicado completo →
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-purple-600/10 to-red-600/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="w-full max-w-6xl flex flex-col items-center text-center relative z-10">
          
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-amber-400 font-semibold mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Catálogo de Jogos</span>
          </div>

          {/* Games Showcase Grid (Wolverine, 007, Onimusha) */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8 items-start justify-items-center">
            
            {/* GAME 1: WOLVERINE */}
            <div className="w-full max-w-sm flex flex-col items-center text-center bg-white/[0.02] border border-white/5 p-6 rounded-3xl hover:border-amber-500/20 transition-colors">
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans drop-shadow-sm mb-5">
                <span className="text-amber-400">Wolverine</span>
              </h2>

              {/* Wolverine 3D Cover */}
              <div className="flex justify-center w-full mb-6">
                <WolverineBoxCover
                  driveUrl={WOLVERINE_URL}
                  onClick={() => handleOpenPurchase('Wolverine', WOLVERINE_URL)}
                />
              </div>

              {/* COMPRAR Button */}
              <button
                type="button"
                onClick={() => handleOpenPurchase('Wolverine', WOLVERINE_URL)}
                className="w-full max-w-[320px] py-4 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black font-black text-base uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>COMPRAR</span>
              </button>
            </div>

            {/* GAME 2: 007 */}
            <div className="w-full max-w-sm flex flex-col items-center text-center bg-white/[0.02] border border-white/5 p-6 rounded-3xl hover:border-amber-500/20 transition-colors">
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans drop-shadow-sm mb-5">
                <span className="text-amber-400">007</span>
              </h2>

              {/* 007 3D Cover */}
              <div className="flex justify-center w-full mb-6">
                <BondBoxCover
                  driveUrl={BOND_URL}
                  onClick={() => handleOpenPurchase('007', BOND_URL)}
                />
              </div>

              {/* COMPRAR Button */}
              <button
                type="button"
                onClick={() => handleOpenPurchase('007', BOND_URL)}
                className="w-full max-w-[320px] py-4 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black font-black text-base uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>COMPRAR</span>
              </button>
            </div>

            {/* GAME 3: ONIMUSHA */}
            <div className="w-full max-w-sm flex flex-col items-center text-center bg-white/[0.02] border border-white/5 p-6 rounded-3xl hover:border-red-500/20 transition-colors">
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans drop-shadow-sm mb-5">
                <span className="text-red-400">Onimusha</span>
              </h2>

              {/* Onimusha 3D Cover */}
              <div className="flex justify-center w-full mb-6">
                <OnimushaBoxCover
                  driveUrl={ONIMUSHA_URL}
                  onClick={() => handleOpenPurchase('Onimusha', ONIMUSHA_URL)}
                />
              </div>

              {/* COMPRAR Button */}
              <button
                type="button"
                onClick={() => handleOpenPurchase('Onimusha', ONIMUSHA_URL)}
                className="w-full max-w-[320px] py-4 px-6 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-black font-black text-base uppercase tracking-wider shadow-[0_0_25px_rgba(239,68,68,0.35)] hover:shadow-[0_0_35px_rgba(239,68,68,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>COMPRAR</span>
              </button>
            </div>

          </div>

          {/* Apoiar o Projeto Card (Opens in-modal QR code without new page) */}
          <div className="w-full max-w-lg mt-14 p-6 rounded-2xl bg-gradient-to-b from-[#161224] to-[#0f0e17] border border-purple-500/30 shadow-lg text-center flex flex-col items-center">
            <div className="w-11 h-11 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mb-3 shadow-inner">
              <Heart className="w-5 h-5 fill-purple-400 text-purple-400" />
            </div>

            <h3 className="text-base font-bold text-white uppercase tracking-wide">
              Apoie o Servidor & Novos Jogos
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 mb-5 leading-relaxed max-w-md">
              É somente 5 reais para manter o projeto funcionando, adquirir nosso servidor e adicionar novos jogos! Escaneie o QR Code diretamente na tela.
            </p>

            <div className="w-full max-w-sm flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => handleOpenDonation('fixed')}
                className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-white" />
                <span>Exibir QR Code (R$ 5)</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenDonation('custom')}
                className="w-full py-2.5 px-5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>QR Code (Outro Valor)</span>
              </button>
            </div>
          </div>

        </div>

      </main>

      {/* Minimalist Footer */}
      <footer className="w-full border-t border-white/10 py-6 text-center text-xs text-slate-500 bg-[#07090e]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold text-slate-400">Henrique Games</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500">
            <button
              onClick={() => setIsNoticeOpen(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Avisos sobre downloads & servidor
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenDonation('custom')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Apoiar com Outro Valor
            </button>
            <span>•</span>
            <p className="text-[11px]">Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Initial Announcement Modal */}
      <NoticeModal
        isOpen={isNoticeOpen}
        onClose={() => setIsNoticeOpen(false)}
        donationUrl={DONATION_URL}
        customDonationUrl={CUSTOM_DONATION_URL}
      />

      {/* Standalone Donation QR Modal */}
      <DonationModal
        isOpen={donationModalState.isOpen}
        onClose={() => setDonationModalState((prev) => ({ ...prev, isOpen: false }))}
        donationUrl={DONATION_URL}
        customDonationUrl={CUSTOM_DONATION_URL}
        initialMode={donationModalState.mode}
      />

      {/* Purchase & Support Modal with Embedded QR Code */}
      {selectedGame && (
        <PurchaseModal
          isOpen={!!selectedGame}
          onClose={handleClosePurchaseModal}
          targetGameName={selectedGame.name}
          targetDriveUrl={selectedGame.driveUrl}
          donationUrl={DONATION_URL}
          customDonationUrl={CUSTOM_DONATION_URL}
        />
      )}

    </div>
  );
}
