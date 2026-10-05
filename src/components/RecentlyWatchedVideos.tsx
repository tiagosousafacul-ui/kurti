import React from 'react';
import { Play, History, Trash2, X, Clock, RotateCcw, Youtube } from 'lucide-react';
import { RecentlyWatchedTrack, YouTubeTrack } from '../types';

interface RecentlyWatchedVideosProps {
  videos: RecentlyWatchedTrack[];
  currentTrackYoutubeId?: string;
  onSelectTrack: (track: YouTubeTrack) => void;
  onRemoveTrack: (youtubeId: string) => void;
  onClearHistory: () => void;
}

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 45) return 'Agora mesmo';
  if (diffMin < 60) return `Há ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
  if (diffHours < 24) return `Há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `Há ${diffDays} dias`;
  
  const date = new Date(timestamp);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export const RecentlyWatchedVideos: React.FC<RecentlyWatchedVideosProps> = ({
  videos,
  currentTrackYoutubeId,
  onSelectTrack,
  onRemoveTrack,
  onClearHistory
}) => {
  if (videos.length === 0) {
    return (
      <div className="mb-8 bg-white border border-dashed border-[var(--line)] rounded-2xl p-5 sm:p-6 transition-all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fff0f3] border border-[#f0c8d2] flex items-center justify-center shrink-0 text-[#ed003f]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base text-[var(--ink)] font-medium leading-tight">
                Últimos vídeos vistos
              </h4>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Os clipes e músicas que você reproduzir ficarão salvos aqui automaticamente para você retomar quando quiser.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#ed003f] bg-[#fff0f3] px-2.5 py-1 rounded-full border border-[#f0c8d2] self-start sm:self-auto">
            Histórico Salvo no Navegador
          </span>
        </div>
      </div>
    );
  }

  const latestVideo = videos[0];
  const isLatestPlaying = latestVideo && latestVideo.youtubeId === currentTrackYoutubeId;

  return (
    <div className="mb-8 bg-white border border-[var(--line)] rounded-2xl p-4 sm:p-6 shadow-xs transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--line)] flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#fff0f3] border border-[#f0c8d2] flex items-center justify-center text-[#ed003f]">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg sm:text-xl text-[var(--ink)] font-normal leading-tight">
                Últimos vídeos vistos
              </h3>
              <span className="text-[10px] font-bold bg-[#ed003f]/10 text-[#ed003f] px-2 py-0.5 rounded-full">
                {videos.length} {videos.length === 1 ? 'vídeo' : 'vídeos'}
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)] mt-0.5">
              Retome rapidamente o que estava ouvindo ou navegue pelo seu histórico recente
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Resume Button for the most recent video if not currently active */}
          {!isLatestPlaying && latestVideo && (
            <button
              type="button"
              onClick={() => onSelectTrack(latestVideo)}
              className="px-3 py-1.5 bg-[#ed003f] hover:bg-[#ba0032] text-white text-xs font-bold rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              title={`Retomar: ${latestVideo.title}`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retomar Último</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClearHistory}
            className="px-2.5 py-1.5 text-xs text-[var(--muted)] hover:text-[#ed003f] hover:bg-[#fff0f3] rounded-full border border-transparent hover:border-[#f0c8d2] transition-colors flex items-center gap-1 cursor-pointer"
            title="Limpar histórico do navegador"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limpar histórico</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Shelf / Carousel of Recent Tracks */}
      <div className="flex gap-3.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
        {videos.map((track) => {
          const isPlaying = track.youtubeId === currentTrackYoutubeId;
          return (
            <div
              key={`recent-${track.youtubeId}-${track.watchedAt}`}
              onClick={() => onSelectTrack(track)}
              className={`group shrink-0 w-[240px] sm:w-[260px] bg-[#faf8f7] rounded-xl border p-2.5 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden ${
                isPlaying
                  ? 'border-[#ed003f] ring-2 ring-[#ed003f]/20 bg-[#fff5f7] shadow-sm'
                  : 'border-[var(--line)] hover:border-[#ed003f]/50 hover:bg-white hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-neutral-900 mb-2.5">
                <img
                  src={`https://img.youtube.com/vi/${track.youtubeId}/hqdefault.jpg`}
                  alt={`${track.title} - ${track.artist}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${track.youtubeId}/mqdefault.jpg`;
                  }}
                />

                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isPlaying
                        ? 'bg-[#ed003f] text-white shadow-md scale-105'
                        : 'bg-white/95 text-[var(--ink)] group-hover:bg-[#ed003f] group-hover:text-white group-hover:scale-110 shadow-sm'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                {track.duration && (
                  <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                    {track.duration}
                  </span>
                )}

                {/* Active Indicator or Recent Time */}
                {isPlaying ? (
                  <span className="absolute top-1.5 left-1.5 bg-[#ed003f] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    Ouvindo
                  </span>
                ) : (
                  <span className="absolute top-1.5 left-1.5 bg-black/75 text-[#fbf7f5] text-[9px] font-medium px-1.5 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-[#ff8cab]" />
                    {formatRelativeTime(track.watchedAt)}
                  </span>
                )}

                {/* Remove from History Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTrack(track.youtubeId);
                  }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-[#ed003f] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                  title="Remover do histórico"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title & Metadata */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-xs sm:text-sm text-[var(--ink)] font-normal line-clamp-2 leading-snug group-hover:text-[#ed003f] transition-colors">
                    {track.title || `Vídeo (${track.youtubeId})`}
                  </h4>
                  <p className="text-[11px] text-[var(--muted)] font-medium line-clamp-1 mt-0.5">
                    {track.artist || 'YouTube Oficial'}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-[var(--line)]/60 flex items-center justify-between text-[10px] font-bold">
                  <span className={isPlaying ? 'text-[#ed003f] flex items-center gap-1' : 'text-[var(--muted)] group-hover:text-[#ed003f] flex items-center gap-1'}>
                    <RotateCcw className="w-3 h-3" />
                    {isPlaying ? 'Reproduzindo' : 'Retomar'}
                  </span>
                  <Youtube className="w-3.5 h-3.5 text-[#ed003f] opacity-80" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
