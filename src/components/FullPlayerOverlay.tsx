import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  Share2,
  Copy,
  Check,
  Music,
  ExternalLink,
  Type,
  Disc3
} from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { getTrackLyrics } from '../data/trackLyrics';

interface FullPlayerOverlayProps {
  onNavigateToMusic?: () => void;
}

export const FullPlayerOverlay: React.FC<FullPlayerOverlayProps> = ({
  onNavigateToMusic
}) => {
  const {
    currentTrack,
    isPlaying,
    isFullPlayerOpen,
    closeFullPlayer,
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
    isFavorite,
    toggleFavorite
  } = useMusicPlayer();

  const [activeTab, setActiveTab] = useState<'player' | 'lyrics'>('player');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copied, setCopied] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullPlayerOpen) return;
      if (e.key === 'Escape') {
        closeFullPlayer();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullPlayerOpen, closeFullPlayer, togglePlay]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (isFullPlayerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullPlayerOpen]);

  if (!isFullPlayerOpen || !currentTrack) {
    return null;
  }

  // Formatting mm:ss
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

  const currentRatio = durationSec > 0 ? Math.min(100, (progressSec / durationSec) * 100) : 0;
  const trackLyrics = getTrackLyrics(currentTrack.youtubeId, currentTrack.title, currentTrack.artist);

  const handleCopyLyrics = () => {
    const fullText = `${trackLyrics.title} - ${trackLyrics.artist}\n\n${trackLyrics.stanzas.join('\n\n')}\n\nLetra via Kurti Brasil`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/?section=kurtimusic`;
    if (navigator.share) {
      navigator.share({
        title: `${currentTrack.title} — Kurti Brasil`,
        text: `Ouvindo ${currentTrack.title} de ${currentTrack.artist} no Kurti Brasil`,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Experiência imersiva da música ${currentTrack.title}`}
      className="fixed inset-0 z-[100] bg-[#0c090a] text-white flex flex-col overflow-y-auto animate-in fade-in zoom-in-95 duration-200 select-none"
    >
      {/* Background Ambient Glow utilizing Album Colors */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full blur-[120px] transition-all duration-1000"
          style={{
            background: 'radial-gradient(circle, rgba(237,0,63,0.35) 0%, rgba(255,43,102,0.15) 50%, transparent 70%)'
          }}
        />
        <div
          className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full blur-[140px] transition-all duration-1000"
          style={{
            background: 'radial-gradient(circle, rgba(138,43,226,0.25) 0%, rgba(237,0,63,0.15) 50%, transparent 70%)'
          }}
        />
      </div>

      {/* TOP BAR / NAVIGATION */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/10 backdrop-blur-md bg-black/30 shrink-0">
        {/* Collapse Button */}
        <button
          type="button"
          onClick={closeFullPlayer}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer group"
          title="Recolher player (Esc)"
        >
          <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          <span className="hidden sm:inline">Recolher Player</span>
        </button>

        {/* Center Brand / Mobile Tab Switcher */}
        <div className="flex items-center gap-2">
          {/* Mobile Tab Toggle */}
          <div className="flex lg:hidden bg-white/10 p-1 rounded-full border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('player')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'player'
                  ? 'bg-[#ed003f] text-white shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Música
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lyrics')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'lyrics'
                  ? 'bg-[#ed003f] text-white shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Letra
            </button>
          </div>

          {/* Desktop Brand Note */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70">
            <Disc3 className={`w-4 h-4 text-[#ed003f] ${isPlaying ? 'animate-spin' : ''}`} />
            <span>Kurti Music · Experiência Imersiva</span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleFavorite(currentTrack)}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              isFavorite(currentTrack.youtubeId)
                ? 'bg-[#ed003f] border-[#ed003f] text-white shadow-[0_0_12px_rgba(237,0,63,0.5)]'
                : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
            }`}
            title={isFavorite(currentTrack.youtubeId) ? 'Remover dos favoritos' : 'Favoritar música'}
          >
            <Heart className={`w-4 h-4 ${isFavorite(currentTrack.youtubeId) ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors cursor-pointer"
            title="Compartilhar música"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={closeFullPlayer}
            className="p-2 rounded-full bg-[#ed003f] hover:bg-[#ba0032] text-white transition-all cursor-pointer shadow-md active:scale-95"
            title="Fechar (Esc)"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER: TWO COLUMNS ON DESKTOP, TABBED ON MOBILE */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* =============================================================
              LEFT COLUMN: ARTWORK & TRACK CONTROLS
              ============================================================= */}
          <div
            className={`lg:col-span-6 flex flex-col items-center justify-center text-center ${
              activeTab === 'lyrics' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Giant Vinyl Record Turntable */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-black via-neutral-900 to-neutral-800 border-4 border-[#ff2b66] shadow-[0_20px_60px_rgba(237,0,63,0.5)] flex items-center justify-center mb-6 group">
              {/* Outer Vinyl Grooves */}
              <div
                className={`w-full h-full rounded-full flex items-center justify-center p-3.5 transition-transform ${
                  isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''
                }`}
              >
                <div className="w-full h-full rounded-full border-2 border-neutral-700/70 flex items-center justify-center p-3">
                  <div className="w-full h-full rounded-full border border-neutral-600/50 flex items-center justify-center p-3 bg-neutral-950">
                    {/* High-Resolution Center Album Cover */}
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-xl relative flex items-center justify-center bg-black">
                      <img
                        src={`https://img.youtube.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`}
                        alt={`${currentTrack.title} - ${currentTrack.artist}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${currentTrack.youtubeId}/mqdefault.jpg`;
                        }}
                      />
                      {/* Center Spindle Hole */}
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-[#ed003f] border-2 border-white shadow-md flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-black" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Song Meta Information */}
            <div className="max-w-md w-full mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#ed003f] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                  {isPlaying ? 'Tocando Agora' : 'Pausado'}
                </span>
                {currentTrack.category && (
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-stone-300 text-[10px] font-bold border border-white/10">
                    {currentTrack.category} {currentTrack.year ? `· ${currentTrack.year}` : ''}
                  </span>
                )}
              </div>

              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-white font-normal leading-tight drop-shadow-md line-clamp-2">
                {currentTrack.title}
              </h2>
              <p className="text-[#ed003f] font-bold text-sm sm:text-base mt-1 drop-shadow-sm">
                {currentTrack.artist}
              </p>
            </div>

            {/* Progress Bar & Scrubber */}
            <div className="w-full max-w-md mb-4">
              <div
                onClick={handleSeek}
                className="group/seek relative w-full h-4 flex items-center cursor-pointer"
                role="slider"
                aria-label="Barra de progresso interativa"
                aria-valuenow={progressSec}
                aria-valuemin={0}
                aria-valuemax={durationSec}
              >
                <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden group-hover/seek:h-2.5 transition-all">
                  <div
                    className="h-full bg-gradient-to-r from-[#ba0032] via-[#ed003f] to-[#ff2b66] rounded-full shadow-[0_0_12px_rgba(237,0,63,0.9)] transition-all duration-150"
                    style={{ width: `${currentRatio}%` }}
                  />
                </div>
                {/* Drag Scrubber */}
                <div
                  className="absolute w-4 h-4 rounded-full bg-white border-2 border-[#ed003f] shadow-[0_0_10px_white,0_2px_4px_rgba(0,0,0,0.8)] transform -translate-x-1/2 transition-transform group-hover/seek:scale-125"
                  style={{ left: `${currentRatio}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-400 mt-1">
                <span className="text-[#ffd9e3]">{formatTime(progressSec)}</span>
                <span>{formatTime(durationSec)}</span>
              </div>
            </div>

            {/* Master Track Playback Controls */}
            <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
              {/* Shuffle */}
              <button
                type="button"
                onClick={handleShuffleToggle}
                className={`p-2.5 rounded-full transition-all cursor-pointer ${
                  isShuffle
                    ? 'text-white bg-[#ed003f] shadow-[0_0_12px_#ed003f]'
                    : 'text-stone-300 hover:text-white hover:bg-white/10'
                }`}
                title={isShuffle ? 'Aleatório ligado' : 'Ligar aleatório'}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              {/* Prev */}
              <button
                type="button"
                onClick={prevTrack}
                className="p-3 rounded-full text-white bg-white/10 hover:bg-[#ed003f] transition-all cursor-pointer active:scale-90 border border-white/10 shadow-sm"
                title="Faixa anterior"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              {/* Central Big Play/Pause Button */}
              <button
                type="button"
                onClick={togglePlay}
                className="w-16 h-16 rounded-full text-white bg-gradient-to-br from-[#ff2b66] to-[#ed003f] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-[0_8px_30px_rgba(237,0,63,0.8)] border-2 border-white/50"
                title={isPlaying ? 'Pausar reprodução' : 'Tocar música'}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-current" />
                ) : (
                  <Play className="w-7 h-7 fill-current ml-1" />
                )}
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={nextTrack}
                className="p-3 rounded-full text-white bg-white/10 hover:bg-[#ed003f] transition-all cursor-pointer active:scale-90 border border-white/10 shadow-sm"
                title="Próxima faixa"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              {/* Repeat */}
              <button
                type="button"
                onClick={() => setIsRepeat(!isRepeat)}
                className={`p-2.5 rounded-full transition-all cursor-pointer ${
                  isRepeat
                    ? 'text-white bg-[#ed003f] shadow-[0_0_12px_#ed003f]'
                    : 'text-stone-300 hover:text-white hover:bg-white/10'
                }`}
                title={isRepeat ? 'Repetição ligada' : 'Ligar repetição'}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Volume & Studio Link */}
            <div className="flex items-center gap-4 text-xs text-stone-300">
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="hover:text-white transition-colors cursor-pointer"
                  title={isMuted ? 'Desmutar som' : 'Mutar som'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : volume < 50 ? (
                    <Volume1 className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseInt(e.target.value, 10))}
                  className="w-20 sm:w-24 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#ed003f]"
                  aria-label="Ajustar volume"
                />
              </div>

              {onNavigateToMusic && (
                <button
                  type="button"
                  onClick={() => {
                    closeFullPlayer();
                    onNavigateToMusic();
                  }}
                  className="flex items-center gap-1 text-[#ff8cab] hover:text-white transition-colors font-bold cursor-pointer"
                >
                  <span>Abrir no Kurti Music</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* =============================================================
              RIGHT COLUMN: IMMERSIVE LYRICS PANEL
              ============================================================= */}
          <div
            className={`lg:col-span-6 flex flex-col h-[70vh] sm:h-[75vh] bg-black/45 rounded-3xl border border-white/10 backdrop-blur-xl p-5 sm:p-8 shadow-2xl relative ${
              activeTab === 'player' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Lyrics Header Controls */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#ed003f] flex items-center justify-center text-white">
                  <Music className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Letra da Música</h3>
                  {trackLyrics.composer && (
                    <p className="text-[11px] text-stone-400">Composição: {trackLyrics.composer}</p>
                  )}
                </div>
              </div>

              {/* Font Size & Copy Buttons */}
              <div className="flex items-center gap-2">
                {/* Font Size Toggle */}
                <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setFontSize('normal')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                      fontSize === 'normal' ? 'bg-[#ed003f] text-white' : 'text-stone-300'
                    }`}
                    title="Tamanho padrão de fonte"
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize('large')}
                    className={`px-2 py-0.5 rounded text-[12px] font-bold transition-colors cursor-pointer ${
                      fontSize === 'large' ? 'bg-[#ed003f] text-white' : 'text-stone-300'
                    }`}
                    title="Tamanho grande de fonte"
                  >
                    A+
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize('xlarge')}
                    className={`px-2 py-0.5 rounded text-[13px] font-bold transition-colors cursor-pointer ${
                      fontSize === 'xlarge' ? 'bg-[#ed003f] text-white' : 'text-stone-300'
                    }`}
                    title="Tamanho extra grande de fonte"
                  >
                    A++
                  </button>
                </div>

                {/* Copy Lyrics Button */}
                <button
                  type="button"
                  onClick={handleCopyLyrics}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer border border-white/10"
                  title="Copiar letra completa"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiada!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Scrollable Lyrics Text */}
            <div
              ref={lyricsContainerRef}
              className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar"
            >
              {trackLyrics.stanzas.map((stanza, idx) => {
                const isHeading = stanza.startsWith('[');
                return (
                  <div
                    key={idx}
                    className={`transition-colors duration-200 ${
                      isHeading
                        ? 'text-xs font-mono font-bold tracking-wider text-[#ff8cab] uppercase pt-2'
                        : fontSize === 'xlarge'
                        ? 'text-lg sm:text-xl font-medium text-white/90 leading-relaxed font-sans'
                        : fontSize === 'large'
                        ? 'text-base sm:text-lg font-medium text-white/90 leading-relaxed font-sans'
                        : 'text-sm sm:text-base font-normal text-white/85 leading-relaxed font-sans'
                    }`}
                  >
                    {stanza.split('\n').map((line, lineIdx) => (
                      <p key={lineIdx} className="hover:text-white transition-colors">
                        {line}
                      </p>
                    ))}
                  </div>
                );
              })}

              <div className="pt-8 pb-4 text-center border-t border-white/10 text-stone-400 text-xs">
                <p>Letra conferida para a comunidade · Kurti Brasil</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
