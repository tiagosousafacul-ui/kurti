import React from 'react';
import { Home, Music, Search, ShoppingBag, Calendar } from 'lucide-react';
import { CartItem, User } from '../types';
import { useMusicPlayer } from '../context/MusicPlayerContext';

interface MobileBottomNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenKurtiIA: () => void;
  onOpenAdmin?: () => void;
  user?: User | null;
  cartItems: CartItem[];
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeSection,
  onNavigate,
  onOpenSearch,
  onOpenCart,
  cartItems
}) => {
  const { isPlaying, hasStartedPlayback, isMiniPlayerOpen, openMiniPlayer } = useMusicPlayer();
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isMusicActive = activeSection === 'kurtimusic' || activeSection === 'kurti-music';

  const handleMusicClick = () => {
    if (isMusicActive) return;
    if (hasStartedPlayback && !isMiniPlayerOpen) {
      openMiniPlayer();
    } else {
      onNavigate('kurtimusic');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[var(--line)] lg:hidden px-2 py-1 flex items-center justify-around shadow-lg">
      {/* 1. Início */}
      <button
        onClick={() => onNavigate('inicio')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors active:scale-95 ${
          activeSection === 'inicio' ? 'text-[#ed003f]' : 'text-[var(--muted)]'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Início</span>
      </button>

      {/* 2. Kurti Music / Mini Player */}
      <button
        onClick={handleMusicClick}
        className={`relative flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors active:scale-95 ${
          isMusicActive ? 'text-[#ed003f]' : isPlaying ? 'text-[#ed003f]' : 'text-[var(--muted)] hover:text-[#ed003f]'
        }`}
        title={!isMiniPlayerOpen ? 'Reabrir mini player de música' : 'Kurti Music'}
      >
        <div className="relative">
          <Music className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ed003f] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ed003f]" />
            </span>
          )}
        </div>
        <span>{isPlaying && !isMusicActive ? 'Tocando' : 'Música'}</span>
      </button>

      {/* 3. Eventos */}
      <button
        onClick={() => onNavigate('balada')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors active:scale-95 ${
          activeSection === 'balada' || activeSection === 'eventos'
            ? 'text-[#ed003f]'
            : 'text-[var(--muted)]'
        }`}
      >
        <Calendar className="w-5 h-5" />
        <span>Eventos</span>
      </button>

      {/* 4. Buscar */}
      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold text-[var(--muted)] cursor-pointer hover:text-[#ed003f] active:scale-95"
      >
        <Search className="w-5 h-5" />
        <span>Buscar</span>
      </button>

      {/* 5. Loja */}
      <button
        onClick={onOpenCart}
        className={`relative flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors active:scale-95 ${
          activeSection === 'loja' ? 'text-[#ed003f]' : 'text-[var(--ink)]'
        }`}
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-[#ba0032]" />
          {totalCartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#ed003f] text-white text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white shadow-xs">
              {totalCartCount}
            </span>
          )}
        </div>
        <span className="text-[#ba0032]">Loja</span>
      </button>
    </div>
  );
};
