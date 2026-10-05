import React, { useState, useRef } from 'react';
import {
  SkipBack,
  SkipForward,
  Maximize2,
  X,
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Shuffle,
  Repeat,
  ExternalLink,
  ChevronUp,
  Minus
} from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

interface MiniPlayerProps {
  activeSection: string;
  onNavigateToMusic: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  activeSection,
  onNavigateToMusic
}) => {
  const {
    currentTrack,
    isPlaying,
    isMiniPlayerOpen,
    isCollapsedPill,
    hasStartedPlayback,
    progressSec,
    durationSec,
    volume,
    isMuted,
    tracks,
    playTrack,
    nextTrack,
    prevTrack,
    togglePlay,
    seekTo,
    setVolume,
    toggleMute,
    closeMiniPlayer,
    openMiniPlayer,
    toggleCollapsePill,
    openFullPlayer
  } = useMusicPlayer();

  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
  const [closeToast, setCloseToast] = useState<boolean>(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Formatting helper mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSec = Math.floor(ratio * (durationSec || 210));
    seekTo(targetSec);
  };

  const handleShuffleToggle = () => {
    setIsShuffle(!isShuffle);
    if (!isShuffle && tracks.length > 1) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      playTrack(tracks[randomIndex]);
    }
  };

  // Close player handler
  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    closeMiniPlayer();
    setCloseToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setCloseToast(false);
    }, 4000);
  };

  // Minimize to pill handler
  const handleMinimize = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toggleCollapsePill();
  };

  // Expand handler
  const handleExpand = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    openMiniPlayer();
    setCloseToast(false);
  };

  // =========================================================================
  // CONDITIONAL RENDERING LOGIC:
  // 1. Hide on dedicated music section (avoids redundant overlapping controls)
  // 2. Hide if no track is loaded
  // 3. Hide if playback has never been started (so it never obscures core navigation)
  // =========================================================================
  const isMusicSection = activeSection === 'kurtimusic' || activeSection === 'kurti-music';
  if (isMusicSection) {
    return null;
  }

  if (!currentTrack) {
    return null;
  }

  if (!hasStartedPlayback && !isPlaying) {
    return null;
  }

  // =========================================================================
  // 1. ESTADO FECHADO: TOAST TEMPORÁRIO
  // =========================================================================
  if (!isMiniPlayerOpen) {
    if (!closeToast) return null;
    return (
      <div
        role="status"
        className="fixed bottom-[68px] sm:bottom-[72px] lg:bottom-6 right-3 lg:right-6 z-45 bg-[#141112] text-white text-xs px-3.5 py-2 rounded-2xl border border-[#ed003f] shadow-[0_12px_40px_rgba(20,17,18,0.8)] animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-[320px]"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ed003f] animate-ping shrink-0" />
            <p className="font-sans leading-tight text-white font-medium text-[11px]">
              Player minimizado. Reabra pelo menu inferior ou cabeçalho.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExpand}
            className="px-2.5 py-1 bg-[#ed003f] hover:bg-[#ba0032] text-white rounded-md text-[10px] font-bold shrink-0 cursor-pointer shadow-xs"
          >
            Reabrir
          </button>
        </div>
      </div>
    );
  }

  // Current track percentage
  const currentRatio = durationSec > 0 ? Math.min(100, (progressSec / durationSec) * 100) : 0;

  // =========================================================================
  // 2. ESTADO MINIMIZADO: DOCK FLUTUANTE DISCRETO (kurti-miniplayer-pill)
  // =========================================================================
  if (isCollapsedPill) {
    return (
      <aside
        aria-label="Player de música minimizado"
        className="kurti-miniplayer-pill fixed z-45 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center gap-2 bg-[#141112] p-1.5 pr-2.5 rounded-full border border-[#ed003f] shadow-[0_12px_35px_rgba(20,17,18,0.85),0_0_12px_rgba(237,0,63,0.25)] backdrop-blur-md">
          {/* Botão de Expandir clicando na miniatura e títulos */}
          <button
            type="button"
            onClick={handleExpand}
            className="flex items-center gap-2 text-left cursor-pointer group pl-1"
            title="Expandir player completo"
          >
            {/* Miniatura com efeito vinil */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#ed003f] shadow-md shrink-0 bg-black">
              <img
                src={`https://img.youtube.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`}
                alt={currentTrack.title}
                className={`w-full h-full object-cover ${isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${currentTrack.youtubeId}/mqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#ed003f] border border-white" />
              </div>
            </div>

            {/* Informações da Faixa */}
            <div className="flex flex-col max-w-[100px] sm:max-w-[150px]">
              <span className="text-[10px] font-bold text-white truncate drop-shadow-sm leading-tight">
                {currentTrack.title}
              </span>
              <span className="text-[9px] font-extrabold text-[#ff8cab] truncate leading-tight">
                {currentTrack.artist}
              </span>
            </div>
          </button>

          {/* Ações Rápidas no Dock */}
          <div className="flex items-center gap-1 pl-1.5 border-l border-white/20">
            <button
              type="button"
              onClick={togglePlay}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#ed003f] hover:bg-[#ba0032] text-white flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer"
              title={isPlaying ? 'Pausar' : 'Tocar'}
              aria-label={isPlaying ? 'Pausar' : 'Tocar'}
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={openFullPlayer}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#24171a] hover:bg-[#ed003f] text-[#ff8cab] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Expandir para tela cheia com letras"
              aria-label="Tela cheia e letras"
            >
              <Maximize2 className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={handleExpand}
              className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#24171a] hover:bg-[#ed003f] text-white rounded-full text-[10px] sm:text-[11px] font-extrabold border border-[#ed003f]/50 transition-all cursor-pointer shadow-xs group"
              title="Expandir player completo"
            >
              <span>Abrir</span>
              <ChevronUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#24171a] hover:bg-[#ed003f] text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Fechar player"
              aria-label="Fechar player"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // =========================================================================
  // 3. ESTADO PRINCIPAL: RESPONSIVO VIA CSS MEDIA QUERIES (kurti-miniplayer-card)
  //    - No Mobile: Slim 58px bar positioned right above MobileBottomNav (z-40)
  //    - No Desktop: Spacious 440px editorial card at bottom right
  // =========================================================================
  return (
    <aside
      aria-label="Mini player de música ativo"
      className="kurti-miniplayer-card fixed z-45 animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      {/* 
        -------------------------------------------------------------
        MOBILE LAYOUT (max-width: 768px via .kurti-miniplayer-mobile-only)
        Compact, single-row, slim 58px height with progress bar at top
        -------------------------------------------------------------
      */}
      <div className="kurti-miniplayer-mobile-only flex flex-col justify-center w-full h-full relative">
        {/* Mobile Scrubber Line at the very top of card */}
        <div
          onClick={handleSeek}
          className="absolute -top-[6px] left-0 right-0 h-2 flex items-center cursor-pointer group"
          role="slider"
          aria-label="Progresso da música"
          aria-valuenow={progressSec}
          aria-valuemin={0}
          aria-valuemax={durationSec}
        >
          <div className="w-full h-1 bg-[#25191c] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ed003f] transition-all duration-150"
              style={{ width: `${currentRatio}%` }}
            />
          </div>
        </div>

        {/* Mobile Controls Row */}
        <div className="flex items-center justify-between gap-2 w-full">
          {/* Left: Thumbnail + Track info */}
          <div
            onClick={onNavigateToMusic}
            className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer"
            title="Ir para Kurti Music"
          >
            {/* Spinning vinyl thumbnail */}
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#ed003f] shadow-sm shrink-0 bg-black">
              <img
                src={`https://img.youtube.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`}
                alt={currentTrack.title}
                className={`w-full h-full object-cover ${isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${currentTrack.youtubeId}/mqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#ed003f] border border-white" />
              </div>
            </div>

            {/* Title & Artist */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-white truncate leading-tight">
                  {currentTrack.title}
                </span>
                {isPlaying && (
                  <div className="flex items-end gap-0.5 h-2 shrink-0">
                    <span className="w-0.5 bg-[#ed003f] rounded-full h-full animate-[pulse_0.6s_infinite]" />
                    <span className="w-0.5 bg-white rounded-full h-2/3 animate-[pulse_0.8s_infinite_100ms]" />
                    <span className="w-0.5 bg-[#ff8cab] rounded-full h-4/5 animate-[pulse_0.7s_infinite_200ms]" />
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold text-[#ed003f] truncate leading-tight">
                {currentTrack.artist}
              </span>
            </div>
          </div>

          {/* Right: Playback Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={prevTrack}
              className="p-1 rounded-full text-white/80 hover:text-white cursor-pointer active:scale-90"
              title="Faixa anterior"
              aria-label="Faixa anterior"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-[#ed003f] hover:bg-[#ba0032] text-white flex items-center justify-center shadow-md active:scale-90 cursor-pointer"
              title={isPlaying ? 'Pausar' : 'Tocar'}
              aria-label={isPlaying ? 'Pausar' : 'Tocar'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={nextTrack}
              className="p-1 rounded-full text-white/80 hover:text-white cursor-pointer active:scale-90"
              title="Próxima faixa"
              aria-label="Próxima faixa"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            {/* Expandir para Tela Cheia & Letras no Mobile */}
            <button
              type="button"
              onClick={openFullPlayer}
              className="p-1 rounded-full text-[#ff8cab] hover:text-white cursor-pointer active:scale-90"
              title="Expandir para tela cheia com letras"
              aria-label="Tela cheia e letras"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleMinimize}
              className="p-1 rounded-full text-white/70 hover:text-white cursor-pointer ml-0.5"
              title="Minimizar para dock"
              aria-label="Minimizar"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="p-1 rounded-full text-white/70 hover:text-white cursor-pointer"
              title="Fechar player"
              aria-label="Fechar player"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 
        -------------------------------------------------------------
        DESKTOP LAYOUT (min-width: 769px via .kurti-miniplayer-desktop-only)
        Full rich editorial card with typography, equalizer, scrubber & volume
        -------------------------------------------------------------
      */}
      <div className="kurti-miniplayer-desktop-only">
        {/* BARRA SUPERIOR: STATUS + CATEGORIA + AÇÕES */}
        <div className="flex items-center justify-between gap-1.5 mb-2.5 pb-2 border-b border-[#382b2e]">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ed003f] text-white text-[9.5px] font-black uppercase tracking-wider shadow-sm shrink-0">
              <span className={`w-1.5 h-1.5 rounded-full bg-white ${isPlaying ? 'animate-ping' : ''}`} />
              {isPlaying ? 'Tocando Agora' : 'Pausado'}
            </span>
            {currentTrack.category && (
              <span className="text-[10px] font-bold text-[#ded7cf] bg-[#22181a] px-2 py-0.5 rounded-md border border-[#4a343a] truncate max-w-[130px]">
                {currentTrack.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Botão Tela Cheia & Letras */}
            <button
              type="button"
              onClick={openFullPlayer}
              className="px-2.5 py-1 bg-gradient-to-r from-[#ed003f] to-[#ff2b66] hover:brightness-110 text-white rounded-full text-[11px] font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Expandir para tela cheia com letras e controles imersivos"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Letra & Imersão</span>
            </button>

            {/* Ir para Página Kurti Music */}
            <button
              type="button"
              onClick={onNavigateToMusic}
              className="px-2 py-1 bg-[#24171a] hover:bg-[#ed003f] text-[#ff8cab] hover:text-white rounded-full text-[11px] font-extrabold flex items-center gap-1 border border-[#ed003f]/40 transition-all cursor-pointer shadow-xs"
              title="Abrir página Kurti Music"
            >
              <span>Kurti Music</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            {/* Botão Minimizar para Dock */}
            <button
              type="button"
              onClick={handleMinimize}
              className="p-1.5 bg-[#24171a] hover:bg-[#ed003f] text-white rounded-full border border-white/20 transition-all cursor-pointer"
              title="Minimizar para dock"
              aria-label="Minimizar"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Botão Fechar */}
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 bg-[#ed003f] hover:bg-[#ba0032] text-white rounded-full shadow-md active:scale-90 transition-transform cursor-pointer"
              title="Fechar player"
              aria-label="Fechar mini player"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* CORPO CENTRAL: CAPA + TÍTULO EM GEORGIA + ARTISTA EM VERMELHO */}
        <div className="flex items-center gap-3">
          {/* Capa do Álbum */}
          <div
            onClick={openFullPlayer}
            className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-[#ed003f]/40 shadow-[0_4px_16px_rgba(237,0,63,0.35)] cursor-pointer group bg-black"
            title="Expandir tela cheia com letras e arte ampliada"
          >
            <img
              src={`https://img.youtube.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`}
              alt={`${currentTrack.title} - ${currentTrack.artist}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-108"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${currentTrack.youtubeId}/mqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-1">
              <span className="w-2 h-2 rounded-full bg-[#ed003f] shadow-[0_0_6px_#ed003f]" />
              <Music className="w-3.5 h-3.5 text-white drop-shadow-sm" />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Textos em Branco e Vermelho */}
          <div className="flex-1 min-w-0">
            <h4
              onClick={onNavigateToMusic}
              className="font-serif text-sm font-normal text-white truncate cursor-pointer hover:text-[#ff8cab] transition-colors leading-snug drop-shadow-sm"
              title={currentTrack.title}
            >
              {currentTrack.title}
            </h4>

            <div className="flex items-center justify-between gap-2 mt-1">
              <p className="text-xs text-[#ed003f] font-bold truncate drop-shadow-xs">
                {currentTrack.artist}
              </p>

              {/* Equalizador Ativo */}
              <div className="flex items-end gap-0.5 h-3.5 shrink-0 px-1 py-0.5 bg-[#20191b] rounded-md border border-[#3e2e32]">
                <span
                  className={`w-0.5 bg-[#ed003f] rounded-full transition-all ${
                    isPlaying ? 'h-full animate-[pulse_0.6s_ease-in-out_infinite]' : 'h-1 opacity-40'
                  }`}
                />
                <span
                  className={`w-0.5 bg-white rounded-full transition-all ${
                    isPlaying ? 'h-3/4 animate-[pulse_0.8s_ease-in-out_infinite_100ms]' : 'h-1 opacity-40'
                  }`}
                />
                <span
                  className={`w-0.5 bg-[#ff8cab] rounded-full transition-all ${
                    isPlaying ? 'h-4/5 animate-[pulse_0.7s_ease-in-out_infinite_200ms]' : 'h-1 opacity-40'
                  }`}
                />
                <span
                  className={`w-0.5 bg-white rounded-full transition-all ${
                    isPlaying ? 'h-1/2 animate-[pulse_0.9s_ease-in-out_infinite_150ms]' : 'h-1 opacity-40'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* BARRA DE PROGRESSO COM INTERAÇÃO E FORMATO DE TEMPO */}
        <div className="mt-2.5">
          <div
            onClick={handleSeek}
            className="group/seek relative w-full h-3 flex items-center cursor-pointer"
            role="slider"
            aria-label="Barra de progresso da música"
            aria-valuenow={progressSec}
            aria-valuemin={0}
            aria-valuemax={durationSec}
          >
            <div className="w-full h-1.5 bg-[#25191c] rounded-full overflow-hidden group-hover/seek:h-2 transition-all border border-white/10">
              <div
                className="h-full bg-[#ed003f] rounded-full shadow-[0_0_10px_rgba(237,0,63,0.8)] transition-all duration-150"
                style={{ width: `${currentRatio}%` }}
              />
            </div>
            {/* Marcador Scrubber */}
            <div
              className="absolute w-3.5 h-3.5 rounded-full bg-white border-2 border-[#ed003f] shadow-[0_0_8px_white,0_2px_4px_rgba(0,0,0,0.8)] transform -translate-x-1/2 transition-transform group-hover/seek:scale-125"
              style={{ left: `${currentRatio}%` }}
            />
          </div>

          {/* Tempos decorrido / total */}
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#a89ea0] px-0.5">
            <span className="text-[#ffd9e3]">{formatTime(progressSec)}</span>
            <span className="text-[#a89ea0]">{formatTime(durationSec)}</span>
          </div>
        </div>

        {/* CONTROLES PRINCIPAIS */}
        <div className="flex items-center justify-between gap-1 mt-1 pt-1.5 border-t border-[#382b2e]">
          {/* Aleatório e Repetição */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleShuffleToggle}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                isShuffle
                  ? 'text-white bg-[#ed003f] shadow-[0_0_10px_#ed003f]'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
              title={isShuffle ? 'Modo aleatório ativado' : 'Ativar modo aleatório'}
              aria-label="Modo aleatório"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsRepeat(!isRepeat)}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                isRepeat
                  ? 'text-white bg-[#ed003f] shadow-[0_0_10px_#ed003f]'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
              title={isRepeat ? 'Repetir faixa ativado' : 'Ativar repetição'}
              aria-label="Repetir música"
            >
              <Repeat className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Botões Centrais */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevTrack}
              className="p-1.5 rounded-full text-white bg-[#20191b] hover:bg-[#ed003f] hover:text-white transition-all cursor-pointer active:scale-90 border border-[#3e2e32] shadow-xs"
              title="Faixa anterior"
              aria-label="Faixa anterior"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* BOTÃO PLAY/PAUSE PRINCIPAL */}
            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 rounded-full text-white bg-[#ed003f] hover:bg-[#ba0032] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-[0_4px_20px_rgba(237,0,63,0.85)] border-2 border-white/40"
              title={isPlaying ? 'Pausar música' : 'Tocar música'}
              aria-label={isPlaying ? 'Pausar' : 'Tocar'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={nextTrack}
              className="p-1.5 rounded-full text-white bg-[#20191b] hover:bg-[#ed003f] hover:text-white transition-all cursor-pointer active:scale-90 border border-[#3e2e32] shadow-xs"
              title="Próxima faixa"
              aria-label="Próxima faixa"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Controle de Volume */}
          <div className="relative flex items-center gap-1">
            <button
              type="button"
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              className="p-1.5 rounded-full text-white bg-[#20191b] hover:bg-[#ed003f] transition-colors cursor-pointer border border-[#3e2e32]"
              title={isMuted ? 'Desmutar som' : 'Mutar som'}
              aria-label="Controle de volume"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-red-400" />
              ) : volume < 50 ? (
                <Volume1 className="w-3.5 h-3.5 text-white" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-white" />
              )}
            </button>

            {/* Slider de Volume */}
            <div
              className={`flex items-center transition-all ${
                showVolumeSlider ? 'w-16 opacity-100' : 'w-0 opacity-0 overflow-hidden'
              }`}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#ed003f]"
                title={`Volume: ${isMuted ? 0 : volume}%`}
                aria-label="Ajustar volume"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
