import React, { useState, useId, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ExternalLink,
  Copy,
  Check,
  Youtube,
  Music,
  Sparkles,
  Search,
  X,
  Loader2,
  BookmarkPlus,
  RefreshCw,
  AlertCircle,
  Headphones,
  Tv,
  Heart,
  Maximize2
} from 'lucide-react';
import { YouTubeTrack, MusicItem } from '../types';
import rawData from '../data/kurtiData.json';
import { RecentlyWatchedVideos } from './RecentlyWatchedVideos';
import { TrendingMusicChart } from './TrendingMusicChart';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { CATEGORIES, SUGGESTED_SEARCHES } from '../data/youtubeTracks';

export { WomenSection } from './WomenSection';

interface KurtiMusicSectionProps {
  onOpenArticle?: (storyId: string) => void;
  musicItems?: MusicItem[];
}

// Helper to extract YouTube video ID from various link formats
function extractYouTubeId(urlOrId: string): string | null {
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export const KurtiMusicSection: React.FC<KurtiMusicSectionProps> = ({
  onOpenArticle,
  musicItems
}) => {
  const editorialItems = musicItems || (rawData.music as unknown as MusicItem[]);
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    progressSec,
    durationSec,
    seekTo,
    pauseBackgroundAudio,
    resumeBackgroundAudio,
    playTrack,
    nextTrack,
    prevTrack,
    tracks,
    recentlyWatched,
    favorites,
    isFavorite,
    toggleFavorite,
    saveAndPersistTrack,
    removeRecentTrack,
    clearRecentHistory,
    openFullPlayer
  } = useMusicPlayer();

  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSearchedQuery, setLastSearchedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<YouTubeTrack[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [embedReloadKey, setEmbedReloadKey] = useState(0);
  const [playbackMode, setPlaybackMode] = useState<'audio' | 'video'>('audio');
  const playerId = useId();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Manage background audio pause/resume when entering/exiting video mode
  useEffect(() => {
    if (playbackMode === 'video') {
      pauseBackgroundAudio();
    } else {
      resumeBackgroundAudio();
    }
    return () => {
      // When unmounting KurtiMusicSection, ensure persistent background audio resumes if playing
      resumeBackgroundAudio();
    };
  }, [playbackMode, pauseBackgroundAudio, resumeBackgroundAudio]);

  // If initial track changes or is refreshed, reset reload key
  useEffect(() => {
    setEmbedReloadKey((k) => k + 1);
  }, [currentTrack.youtubeId]);

  const curatedFilteredTracks = tracks.filter((t) => {
    if (activeCategory === 'Favoritos') return isFavorite(t.youtubeId);
    if (activeCategory === 'Meus Vídeos') return t.category === 'Meus Vídeos';
    if (activeCategory !== 'Todos' && t.category !== activeCategory) return false;
    return true;
  });

  const displayTracks = activeCategory === 'Favoritos' ? favorites : curatedFilteredTracks;

  const handleSelectTrack = (track: YouTubeTrack) => {
    playTrack(track);
    const playerEl = document.getElementById(playerId);
    if (playerEl) {
      playerEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleNextTrack = () => {
    if (searchResults && searchResults.length > 0) {
      const currentIndex = searchResults.findIndex((t) => t.youtubeId === currentTrack.youtubeId);
      const nextIndex = (currentIndex + 1) % searchResults.length;
      playTrack(searchResults[nextIndex]);
    } else {
      nextTrack();
    }
  };

  const handlePrevTrack = () => {
    if (searchResults && searchResults.length > 0) {
      const currentIndex = searchResults.findIndex((t) => t.youtubeId === currentTrack.youtubeId);
      const prevIndex = (currentIndex - 1 + searchResults.length) % searchResults.length;
      playTrack(searchResults[prevIndex]);
    } else {
      prevTrack();
    }
  };

  const handleSearch = async (queryToSearch: string) => {
    const clean = queryToSearch.trim();
    if (!clean) {
      setSearchResults(null);
      setLastSearchedQuery('');
      return;
    }

    // Check if user entered a direct YouTube link or ID
    const directId = extractYouTubeId(clean);
    if (directId) {
      setIsSearching(true);
      setLastSearchedQuery(clean);

      // Fetch metadata from backend for live title & author
      let customTrack: YouTubeTrack = {
        id: `yt-direct-${directId}`,
        title: `Vídeo do YouTube (${directId})`,
        artist: 'YouTube Oficial',
        youtubeId: directId,
        category: 'Busca YouTube',
        year: new Date().getFullYear().toString(),
        description: 'Reproduzido diretamente via link ou ID do YouTube.'
      };

      try {
        const resp = await fetch(`/api/youtube/video/${directId}`);
        if (resp.ok) {
          const meta = await resp.json();
          if (meta && meta.title) {
            customTrack = {
              ...customTrack,
              title: meta.title,
              artist: meta.artist || 'YouTube Oficial'
            };
          }
        }
      } catch {
        // fallback
      }

      setSearchResults([customTrack]);
      playTrack(customTrack);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setLastSearchedQuery(clean);

    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(clean)}`);
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.results) && data.results.length > 0) {
          setSearchResults(data.results);
          playTrack(data.results[0]);
          setIsSearching(false);
          return;
        }
      }
    } catch {
      // fallback to local filter
    }

    // Fallback: search local curated tracks matching title, artist or category
    const localMatches = tracks.filter(
      (t) =>
        t.title.toLowerCase().includes(clean.toLowerCase()) ||
        t.artist.toLowerCase().includes(clean.toLowerCase()) ||
        t.category.toLowerCase().includes(clean.toLowerCase())
    );
    setSearchResults(localMatches);
    if (localMatches.length > 0) {
      playTrack(localMatches[0]);
    }
    setIsSearching(false);
  };

  // Debounce effect (500ms delay) on search input to prevent excessive API calls
  useEffect(() => {
    const trimmed = searchQuery.trim();

    // If query is empty, reset results if previously searched
    if (!trimmed) {
      setIsDebouncing(false);
      if (lastSearchedQuery) {
        setSearchResults(null);
        setLastSearchedQuery('');
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      return;
    }

    // Do not trigger another search if it's identical to the active one
    if (trimmed === lastSearchedQuery) {
      setIsDebouncing(false);
      return;
    }

    setIsDebouncing(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setIsDebouncing(false);
      handleSearch(trimmed);
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, lastSearchedQuery]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setIsDebouncing(false);
    const clean = searchQuery.trim();
    if (clean) {
      handleSearch(clean);
    }
  };

  const handleClearSearch = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setIsDebouncing(false);
    setSearchQuery('');
    setLastSearchedQuery('');
    setSearchResults(null);
  };

  const handleSaveToPlaylist = (track: YouTubeTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    const savedTrack: YouTubeTrack = {
      ...track,
      id: `saved-${track.youtubeId}-${Date.now()}`,
      category: track.category || 'Meus Vídeos'
    };
    saveAndPersistTrack(savedTrack);
  };

  const handleCopyLink = () => {
    const url = `https://www.youtube.com/watch?v=${currentTrack.youtubeId}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Full YouTube embed URL with standard parameters
  const originParam = typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : '';
  const fullEmbedUrl = `https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1&enablejsapi=1&origin=${originParam}&rel=0&controls=1&showinfo=1&playsinline=1&modestbranding=0&iv_load_policy=3`;

  return (
    <section className="editorial-section page-section" id="kurtimusic" style={{ scrollMarginTop: '115px' }}>
      {/* Official Editorial Header from kurti.com.br */}
      <div className="editorial-intro mb-6">
        <div>
          <span className="eyebrow">KurtiMusic · fase inicial</span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[var(--ink)] font-normal mt-2 leading-[0.98]">
            O radar das divas já está ligado.
          </h2>
        </div>
        <p className="text-[var(--muted)] text-xs sm:text-sm leading-relaxed">
          Enquanto o streaming musical não tem catálogo autorizado, a editoria acompanha lançamentos, turnês e cultura pop — com Madonna, Lady Gaga, Anitta e outras vozes.
        </p>
      </div>

      {/* Official 11 Editorial Cards from kurti.com.br (.music-grid) */}
      <div className="music-grid mb-14">
        {editorialItems.map((item, idx) => (
          <button
            key={item.articleId || idx}
            onClick={() => onOpenArticle?.(item.articleId)}
            aria-label={`Ler matéria completa: ${item.title}`}
          >
            <span>{String(idx + 1).padStart(2, '0')} · {item.eyebrow}</span>
            <strong>{item.artist}</strong>
            <h3>{item.title}</h3>
            <p>Fonte: {item.source}</p>
            <i>
              Ler matéria completa{' '}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h13M13 6l6 6-6 6"></path>
              </svg>
            </i>
          </button>
        ))}
      </div>

      {/* Player Kurti Music & Clipes do YouTube */}
      <div className="pt-8 border-t border-[var(--line)] mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
          <div>
            <span className="eyebrow flex items-center gap-1.5 text-[#ed003f] font-bold text-[10px] tracking-widest uppercase">
              <Youtube className="w-3.5 h-3.5 text-[#ed003f]" />
              Player Kurti · YouTube Streaming & Clipes
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl text-[var(--ink)] font-normal mt-1 leading-[0.98]">
              Música LGBT+, divas pop e clipes no YouTube.
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] font-bold">
            <span className="bg-[#fff0f3] text-[#ed003f] px-2.5 py-1 rounded-full border border-[#f0c8d2] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Player Completo do YouTube
            </span>
            <span className="bg-[#e7f3ff] text-[#1665a6] px-2.5 py-1 rounded-full border border-[#c5daea]">
              100% Clipes Verificados
            </span>
          </div>
        </div>
        <p className="text-[var(--muted)] text-xs sm:text-sm leading-relaxed mb-6">
          Pesquise qualquer artista, música ou cole um link do YouTube para assistir no player integrado com controles completos, sem músicas offline.
        </p>
      </div>

      {/* TOP MINIMALIST SEARCH BAR - Pesquise vídeos diretamente no YouTube */}
      <div className="mb-6">
        <form
          onSubmit={handleFormSubmit}
          className="relative flex items-center bg-white border border-[var(--line)] rounded-2xl shadow-xs transition-all focus-within:border-[#ed003f] focus-within:ring-2 focus-within:ring-[#ed003f]/15"
        >
          <div className="pl-4 pr-2 text-[#ed003f] flex items-center justify-center">
            {isSearching || isDebouncing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-[var(--muted)]" />
            )}
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar vídeos ou músicas no YouTube (ex: Pabllo Vittar, Lady Gaga, Chappell Roan... ou cole um link)"
            className="flex-1 py-3.5 px-2 bg-transparent text-[var(--ink)] text-xs sm:text-sm placeholder:text-[var(--muted)]/80 focus:outline-none"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="p-1.5 mr-1 text-[var(--muted)] hover:text-[var(--ink)] rounded-full hover:bg-neutral-100 transition-colors"
              title="Limpar campo"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={isSearching}
            className="m-1.5 px-4 py-2.5 bg-[#ed003f] hover:bg-[#ba0032] disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Youtube className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">Pesquisar</span>
          </button>
        </form>

        {/* Minimalist Suggested Quick Search Chips */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-[11px]">
          <span className="text-[var(--muted)] text-[10px] font-bold uppercase tracking-wider whitespace-nowrap pl-1 mr-1">
            Populares:
          </span>
          {SUGGESTED_SEARCHES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                if (debounceTimerRef.current) {
                  clearTimeout(debounceTimerRef.current);
                }
                setIsDebouncing(false);
                setSearchQuery(item);
                handleSearch(item);
              }}
              className="px-2.5 py-1 rounded-full bg-white text-[var(--muted)] hover:text-[#ed003f] hover:border-[#ed003f] border border-[var(--line)] whitespace-nowrap text-[11px] font-medium transition-colors cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Main Full YouTube Stage / Active Player */}
      <div
        id={playerId}
        className="bg-[#141112] text-white rounded-[26px] border border-[#302628] overflow-hidden shadow-2xl p-4 sm:p-6 mb-8 transition-all"
      >
        {/* Prominent Video Title Bar Above Video */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#292022] gap-3 flex-wrap">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[#ff8cab] uppercase tracking-wider block mb-0.5">
              Reproduzindo Agora no Kurti Music
            </span>
            <h3 className="font-serif text-lg sm:text-2xl text-white font-normal truncate">
              {currentTrack.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Mode vs Video Mode Switch */}
            <div className="flex items-center bg-[#20191b] p-1 rounded-full border border-[#3e2e32]">
              <button
                type="button"
                onClick={() => setPlaybackMode('audio')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  playbackMode === 'audio'
                    ? 'bg-[#ed003f] text-white shadow-xs'
                    : 'text-[#ded7cf] hover:text-white'
                }`}
                title="Modo Só Música (sem o quadro de vídeo)"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Só Música</span>
              </button>
              <button
                type="button"
                onClick={() => setPlaybackMode('video')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  playbackMode === 'video'
                    ? 'bg-[#ed003f] text-white shadow-xs'
                    : 'text-[#ded7cf] hover:text-white'
                }`}
                title="Modo Videoclipe (assistir vídeo)"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Videoclipe</span>
              </button>
            </div>

            <a
              href={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-[#2a1d20] hover:bg-[#3d292d] text-white border border-[#4a343a] transition-colors shadow-xs"
              title="Abrir no app ou site do YouTube"
            >
              <Youtube className="w-4 h-4 fill-current text-[#ed003f]" />
              <span>YouTube</span>
              <ExternalLink className="w-3 h-3 text-[#ff8cab]" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Main Stage: Either Audio Vinyl Deck or 16:9 Video */}
          <div className="lg:col-span-8">
            {playbackMode === 'audio' ? (
              /* PURE AUDIO MODE - TURNTABLE DECK */
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#1c1417] via-[#100c0e] to-[#0a0809] border border-[#3e2e32] shadow-2xl flex flex-col items-center justify-center p-6 text-center group">
                {/* Background ambient glow */}
                <div className="absolute inset-0 bg-radial from-[#ed003f]/25 via-transparent to-transparent pointer-events-none" />

                {/* Rotating Vinyl Turntable with Real Colorful Album Cover */}
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-black via-neutral-900 to-neutral-800 border-4 border-[#ff2b66] shadow-[0_12px_45px_rgba(237,0,63,0.6)] flex items-center justify-center mb-4">
                  {/* Outer grooves spinning */}
                  <div className={`w-full h-full rounded-full flex items-center justify-center p-2.5 ${isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}`}>
                    <div className="w-full h-full rounded-full border-2 border-neutral-700/80 flex items-center justify-center p-2">
                      <div className="w-full h-full rounded-full border border-neutral-600/60 flex items-center justify-center p-2 bg-neutral-950">
                        {/* Center Colorful Album Art */}
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-md relative flex items-center justify-center bg-black">
                          <img
                            src={`https://img.youtube.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`}
                            alt={currentTrack.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${currentTrack.youtubeId}/mqdefault.jpg`;
                            }}
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-[#ed003f] border-2 border-white shadow-xs" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audio Status & Soundwave */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#ed003f] to-[#ff2b66] px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/30">
                      <Headphones className="w-4 h-4 text-white" />
                      {isPlaying ? 'Modo Só Música (Reproduzindo)' : 'Modo Só Música (Pausado)'}
                    </span>
                  </div>

                  {/* High Fidelity Equalizer Bars */}
                  <div className="flex items-end gap-1.5 h-7 my-1.5 px-3 py-1 bg-black/40 rounded-xl border border-white/10">
                    <span className={`w-1.5 bg-[#ed003f] rounded-full transition-all ${isPlaying ? 'h-full animate-[pulse_0.7s_infinite]' : 'h-1.5 opacity-40'}`} />
                    <span className={`w-1.5 bg-[#ff2b66] rounded-full transition-all ${isPlaying ? 'h-3/4 animate-[pulse_0.9s_infinite_100ms]' : 'h-1.5 opacity-40'}`} />
                    <span className={`w-1.5 bg-white rounded-full transition-all ${isPlaying ? 'h-4/5 animate-[pulse_0.6s_infinite_200ms]' : 'h-1.5 opacity-40'}`} />
                    <span className={`w-1.5 bg-[#ff8cab] rounded-full transition-all ${isPlaying ? 'h-2/3 animate-[pulse_0.8s_infinite_150ms]' : 'h-1.5 opacity-40'}`} />
                    <span className={`w-1.5 bg-[#ed003f] rounded-full transition-all ${isPlaying ? 'h-5/6 animate-[pulse_0.75s_infinite_50ms]' : 'h-1.5 opacity-40'}`} />
                    <span className={`w-1.5 bg-white rounded-full transition-all ${isPlaying ? 'h-3/5 animate-[pulse_0.85s_infinite_250ms]' : 'h-1.5 opacity-40'}`} />
                    <span className={`w-1.5 bg-[#ff2b66] rounded-full transition-all ${isPlaying ? 'h-4/5 animate-[pulse_0.65s_infinite_180ms]' : 'h-1.5 opacity-40'}`} />
                  </div>

                  <p className="text-xs text-white/90 font-medium mt-2 max-w-md drop-shadow-sm">
                    Áudio em alta fidelidade contínuo no Kurti Brasil. Para assistir ao vídeo na tela cheia, clique em <strong className="text-[#ff8cab]">Videoclipe</strong> acima.
                  </p>
                </div>
              </div>
            ) : (
              /* VIDEOCLIP MODE - 16:9 VIDEO */
              <>
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner border border-[#332226]">
                  <iframe
                    key={`video-mode-${currentTrack.youtubeId}-${embedReloadKey}`}
                    src={fullEmbedUrl}
                    title={`${currentTrack.title} - ${currentTrack.artist}`}
                    className="w-full h-full border-0 absolute inset-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
                {/* Fallback Notice for videos with embed restrictions */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#a89ea0] px-1">
                  <span className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-[#ff8cab]" />
                    Algum vídeo com restrição da gravadora?
                  </span>
                  <a
                    href={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ff8cab] hover:underline font-bold flex items-center gap-1"
                  >
                    Abrir direto no YouTube <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </>
            )}
          </div>

          {/* Now Playing Info & Complete Controls */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-4">
            <div>
              {/* Badge Tocando Agora */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ed003f]/20 border border-[#ed003f]/40 text-[#ff8cab] text-[10px] font-extrabold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#ed003f] animate-ping" />
                  Player Ativo
                </span>
                <button
                  type="button"
                  onClick={openFullPlayer}
                  className="px-2.5 py-1 bg-gradient-to-r from-[#ed003f] to-[#ff2b66] hover:brightness-110 text-white rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title="Expandir para tela cheia com letras e arte ampliada"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Letra & Imersão</span>
                </button>
              </div>

              {/* Title & Artist */}
              <h4 className="font-serif text-lg sm:text-xl text-white font-normal leading-snug line-clamp-2">
                {currentTrack.title}
              </h4>
              <p className="text-[#ed003f] font-bold text-xs sm:text-sm mt-1">
                {currentTrack.artist}
              </p>

              {/* Description / Lore */}
              {currentTrack.description && (
                <p className="text-[#b5aaa8] text-xs leading-relaxed mt-2.5 border-t border-[#292022] pt-2.5 line-clamp-3">
                  {currentTrack.description}
                </p>
              )}
            </div>

            {/* Controls Bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevTrack}
                    className="p-2 rounded-full bg-[#20191b] hover:bg-[#2e2326] text-white border border-[#3e2e32] cursor-pointer transition-colors"
                    title="Faixa Anterior"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  {/* Play / Pause button */}
                  <button
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-full bg-[#ed003f] hover:bg-[#ba0032] text-white flex items-center justify-center cursor-pointer transition-transform active:scale-95 shadow-md"
                    title={isPlaying ? 'Pausar áudio' : 'Tocar áudio'}
                    aria-label={isPlaying ? 'Pausar' : 'Tocar'}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={handleNextTrack}
                    className="p-2 rounded-full bg-[#20191b] hover:bg-[#2e2326] text-white border border-[#3e2e32] cursor-pointer transition-colors"
                    title="Próxima Faixa"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEmbedReloadKey((k) => k + 1)}
                    className="p-2 rounded-full bg-[#20191b] hover:bg-[#2e2326] text-stone-300 hover:text-white border border-[#3e2e32] cursor-pointer transition-colors"
                    title="Recarregar Player"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full bg-[#20191b] hover:bg-[#2e2326] text-[#ded7cf] border border-[#3e2e32] transition-colors cursor-pointer"
                    title="Copiar link do YouTube"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full bg-[#ed003f] hover:bg-[#ba0032] text-white transition-colors cursor-pointer shadow-md"
                  >
                    <Youtube className="w-3.5 h-3.5 fill-current" />
                    <span>YouTube</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>

              {/* Seekbar in KurtiMusicSection */}
              <div className="mb-2">
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                    seekTo(Math.floor(ratio * (durationSec || 210)));
                  }}
                  className="relative w-full h-2 bg-[#20191b] rounded-full overflow-hidden cursor-pointer border border-[#3e2e32]"
                  role="slider"
                  aria-label="Progresso da música"
                >
                  <div
                    className="h-full bg-[#ed003f] rounded-full transition-all duration-150"
                    style={{ width: `${durationSec > 0 ? (progressSec / durationSec) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#a89ea0] mt-1 px-0.5">
                  <span>{Math.floor(progressSec / 60)}:{progressSec % 60 < 10 ? '0' : ''}{progressSec % 60}</span>
                  <span>{Math.floor(durationSec / 60)}:{durationSec % 60 < 10 ? '0' : ''}{durationSec % 60}</span>
                </div>
              </div>

              <div className="text-[10px] text-[#857b7a] flex items-center justify-between px-1">
                <span>Vídeo ID: {currentTrack.youtubeId}</span>
                <span>{currentTrack.duration ? `Duração: ~${currentTrack.duration}` : 'YouTube Oficial'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPONENTE DE ÚLTIMOS VÍDEOS VISTOS (HISTÓRICO LOCALSTORAGE) */}
      <RecentlyWatchedVideos
        videos={recentlyWatched}
        currentTrackYoutubeId={currentTrack.youtubeId}
        onSelectTrack={handleSelectTrack}
        onRemoveTrack={removeRecentTrack}
        onClearHistory={clearRecentHistory}
      />

      {/* GRÁFICO RECHARTS DE TENDÊNCIAS DE OUVINTES NA SEMANA */}
      <TrendingMusicChart />

      {/* FILTERED RESULTS / CATALOG AREA */}
      <div>
        {searchResults !== null ? (
          /* SEARCH RESULTS VIEW */
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2 border-b border-[var(--line)] pb-3">
              <div>
                <span className="eyebrow text-[#ed003f] text-[9px] font-bold uppercase tracking-wider">
                  Resultados da pesquisa no YouTube
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[var(--ink)] font-normal">
                  {lastSearchedQuery ? `Vídeos para "${lastSearchedQuery}"` : 'Resultados'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--muted)] font-medium">
                  {searchResults.length} {searchResults.length === 1 ? 'resultado' : 'resultados'}
                </span>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-3.5 py-1.5 text-xs font-bold text-[var(--muted)] hover:text-[var(--ink)] bg-white border border-[var(--line)] rounded-full cursor-pointer hover:border-neutral-400 transition-colors shadow-xs"
                >
                  Voltar ao Catálogo Completo
                </button>
              </div>
            </div>

            {searchResults.length === 0 ? (
              <div className="bg-white border border-dashed border-[var(--line)] rounded-2xl p-8 text-center my-6">
                <Youtube className="w-10 h-10 text-[var(--muted)] mx-auto mb-2 opacity-50" />
                <h4 className="font-serif text-lg text-[var(--ink)]">Nenhum vídeo encontrado</h4>
                <p className="text-xs text-[var(--muted)] mt-1 max-w-sm mx-auto">
                  Tente buscar por outro termo, nome de artista ou cole diretamente o link completo do vídeo no YouTube.
                </p>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="mt-4 px-4 py-2 bg-[#ed003f] text-white text-xs font-bold rounded-full cursor-pointer hover:bg-[#ba0032] transition-colors"
                >
                  Ver destaques recomendados
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map((track) => {
                  const isPlaying = track.youtubeId === currentTrack.youtubeId;
                  return (
                    <div
                      key={track.id}
                      onClick={() => handleSelectTrack(track)}
                      className={`group bg-white rounded-2xl border p-3 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden ${
                        isPlaying
                          ? 'border-[#ed003f] ring-2 ring-[#ed003f]/20 shadow-md bg-[#fffbfa]'
                          : 'border-[var(--line)] hover:border-[#ed003f]/50 hover:shadow-lg hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-900 mb-3">
                        <img
                          src={`https://img.youtube.com/vi/${track.youtubeId}/hqdefault.jpg`}
                          alt={`${track.title} - ${track.artist}`}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${track.youtubeId}/mqdefault.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                              isPlaying
                                ? 'bg-[#ed003f] text-white shadow-lg scale-105'
                                : 'bg-white/90 text-[var(--ink)] group-hover:bg-[#ed003f] group-hover:text-white group-hover:scale-110'
                            }`}
                          >
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>

                        {track.duration && (
                          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                            {track.duration}
                          </span>
                        )}

                        {isPlaying && (
                          <span className="absolute top-2 left-2 bg-[#ed003f] text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            No Player
                          </span>
                        )}
                      </div>

                      {/* Info with Full Title Always Visible */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-[var(--muted)] mb-1">
                            <span className="font-bold text-[#ed003f] uppercase tracking-wider text-[9px]">
                              {track.category || 'YouTube'}
                            </span>
                            {track.year && <span>{track.year}</span>}
                          </div>
                          <h4 className="font-serif text-sm sm:text-base text-[var(--ink)] font-normal line-clamp-2 group-hover:text-[#ed003f] transition-colors leading-snug">
                            {track.title || `Vídeo do YouTube (${track.youtubeId})`}
                          </h4>
                          <p className="text-xs text-[var(--muted)] font-medium line-clamp-1 mt-0.5">
                            {track.artist || 'Canal Oficial'}
                          </p>
                        </div>

                        <div className="pt-2.5 mt-2.5 border-t border-[var(--line)]/60 flex items-center justify-between text-[11px] font-bold text-[var(--muted)] group-hover:text-[#ed003f]">
                          <span className="flex items-center gap-1">
                            <Music className="w-3.5 h-3.5" />
                            {isPlaying ? 'Tocando agora' : 'Tocar vídeo'}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleSaveToPlaylist(track, e)}
                            className="p-1 rounded-full hover:bg-neutral-100 text-[var(--muted)] hover:text-[#ed003f]"
                            title="Salvar em Meus Vídeos"
                          >
                            <BookmarkPlus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* CURATED DEFAULT CATALOG VIEW */
          <div>
            {/* Category Filter Strip */}
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all border ${
                      activeCategory === cat
                        ? 'bg-[#ed003f] text-white border-[#ed003f] shadow-sm'
                        : 'bg-white text-[var(--muted)] border-[var(--line)] hover:border-[#ed003f] hover:text-[var(--ink)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Curated YouTube Tracks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {curatedFilteredTracks.map((track) => {
                const isPlaying = track.youtubeId === currentTrack.youtubeId;
                return (
                  <div
                    key={track.id}
                    onClick={() => handleSelectTrack(track)}
                    className={`group bg-white rounded-2xl border p-3 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden ${
                      isPlaying
                        ? 'border-[#ed003f] ring-2 ring-[#ed003f]/20 shadow-md bg-[#fffbfa]'
                        : 'border-[var(--line)] hover:border-[#ed003f]/50 hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Thumbnail Container */}
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-900 mb-3">
                      <img
                        src={`https://img.youtube.com/vi/${track.youtubeId}/hqdefault.jpg`}
                        alt={`${track.title} - ${track.artist}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${track.youtubeId}/mqdefault.jpg`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                            isPlaying
                              ? 'bg-[#ed003f] text-white shadow-lg scale-105'
                              : 'bg-white/90 text-[var(--ink)] group-hover:bg-[#ed003f] group-hover:text-white group-hover:scale-110'
                          }`}
                        >
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>

                      {track.duration && (
                        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                          {track.duration}
                        </span>
                      )}

                      {isPlaying && (
                        <span className="absolute top-2 left-2 bg-[#ed003f] text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          No Player
                        </span>
                      )}
                    </div>

                    {/* Track Info with Full Title */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-[var(--muted)] mb-1">
                          <span className="font-bold text-[#ed003f] uppercase tracking-wider text-[9px]">
                            {track.category}
                          </span>
                          {track.year && <span>{track.year}</span>}
                        </div>
                        <h4 className="font-serif text-sm sm:text-base text-[var(--ink)] font-normal line-clamp-2 group-hover:text-[#ed003f] transition-colors leading-snug">
                          {track.title}
                        </h4>
                        <p className="text-xs text-[var(--muted)] font-medium line-clamp-1 mt-0.5">
                          {track.artist}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-[var(--line)]/60 flex items-center justify-between text-[11px] font-bold text-[var(--muted)] group-hover:text-[#ed003f]">
                        <span className="flex items-center gap-1">
                          <Music className="w-3.5 h-3.5" />
                          {isPlaying ? 'Tocando agora' : 'Ouvir faixa'}
                        </span>
                        <Youtube className="w-4 h-4 text-[#ed003f] opacity-80 group-hover:opacity-100" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
