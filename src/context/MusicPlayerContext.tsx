import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { YouTubeTrack, RecentlyWatchedTrack } from '../types';
import { INITIAL_YOUTUBE_TRACKS } from '../data/youtubeTracks';

function parseDurationToSeconds(duration?: string): number {
  if (!duration) return 210;
  const parts = duration.split(':').map((p) => parseInt(p, 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 210;
}

interface MusicPlayerContextType {
  currentTrack: YouTubeTrack;
  isPlaying: boolean;
  isMiniPlayerOpen: boolean;
  isCollapsedPill: boolean;
  hasStartedPlayback: boolean;
  progressSec: number;
  durationSec: number;
  volume: number;
  isMuted: boolean;
  tracks: YouTubeTrack[];
  recentlyWatched: RecentlyWatchedTrack[];
  favorites: YouTubeTrack[];
  isFavorite: (youtubeId: string) => boolean;
  toggleFavorite: (track: YouTubeTrack) => void;
  playTrack: (track: YouTubeTrack) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  togglePlay: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  closeMiniPlayer: () => void;
  openMiniPlayer: () => void;
  toggleMiniPlayer: () => void;
  toggleCollapsePill: () => void;
  setIsCollapsedPill: (val: boolean) => void;
  setIsMiniPlayerOpen: (val: boolean) => void;
  isFullPlayerOpen: boolean;
  openFullPlayer: () => void;
  closeFullPlayer: () => void;
  toggleFullPlayer: () => void;
  pauseBackgroundAudio: () => void;
  resumeBackgroundAudio: () => void;
  saveAndPersistTrack: (track: YouTubeTrack) => void;
  removeRecentTrack: (youtubeId: string) => void;
  clearRecentHistory: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // 1. Initial tracks (saved custom tracks + verified tracks)
  const [tracks, setTracks] = useState<YouTubeTrack[]>(() => {
    try {
      const saved = localStorage.getItem('kurti-custom-tracks');
      if (saved) {
        const parsed = JSON.parse(saved);
        const validCustom = (Array.isArray(parsed) ? parsed : []).filter(
          (t: any) => t && t.youtubeId && t.youtubeId !== '3kxUo1s_23U' && t.youtubeId !== 'o-w3hY-U51Y'
        );
        const seenIds = new Set<string>();
        const combined: YouTubeTrack[] = [];
        for (const t of validCustom) {
          if (!seenIds.has(t.youtubeId)) {
            seenIds.add(t.youtubeId);
            combined.push(t);
          }
        }
        for (const t of INITIAL_YOUTUBE_TRACKS) {
          if (!seenIds.has(t.youtubeId)) {
            seenIds.add(t.youtubeId);
            combined.push(t);
          }
        }
        return combined;
      }
    } catch {
      // fallback
    }
    return INITIAL_YOUTUBE_TRACKS;
  });

  // 2. Recently watched tracks from localStorage
  const [recentlyWatched, setRecentlyWatched] = useState<RecentlyWatchedTrack[]>(() => {
    try {
      const saved = localStorage.getItem('kurti-recently-watched');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item: any) => item && item.youtubeId && typeof item.watchedAt === 'number'
          );
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  // 3. Favorites tracks from localStorage
  const [favoriteTracks, setFavoriteTracks] = useState<YouTubeTrack[]>(() => {
    try {
      const saved = localStorage.getItem('kurti-favorite-tracks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((t: any) => t && t.youtubeId);
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  const isFavorite = useCallback(
    (youtubeId: string): boolean => {
      return favoriteTracks.some((t) => t.youtubeId === youtubeId);
    },
    [favoriteTracks]
  );

  // 4. Current active track
  const [currentTrack, setCurrentTrack] = useState<YouTubeTrack>(() => {
    try {
      const savedRecent = localStorage.getItem('kurti-recently-watched');
      if (savedRecent) {
        const parsed = JSON.parse(savedRecent);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.youtubeId) {
          return parsed[0];
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_YOUTUBE_TRACKS[0];
  });

  // Track whether playback was ever initiated by the user
  const [hasStartedPlayback, setHasStartedPlayback] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressSec, setProgressSec] = useState<number>(0);
  const [durationSec, setDurationSec] = useState<number>(() =>
    parseDurationToSeconds(INITIAL_YOUTUBE_TRACKS[0]?.duration)
  );
  const [volume, setVolumeState] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [isMiniPlayerOpen, setIsMiniPlayerOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('kurti-miniplayer-open');
      if (saved !== null) {
        return saved === 'true';
      }
    } catch {}
    return false;
  });

  const [isCollapsedPill, setIsCollapsedPill] = useState<boolean>(false);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState<boolean>(false);

  const openFullPlayer = useCallback(() => {
    setIsFullPlayerOpen(true);
  }, []);

  const closeFullPlayer = useCallback(() => {
    setIsFullPlayerOpen(false);
  }, []);

  const toggleFullPlayer = useCallback(() => {
    setIsFullPlayerOpen((prev) => !prev);
  }, []);

  // Helper to post command to the persistent YouTube iframe
  const postIframeCommand = useCallback((func: string, args: any[] = []) => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      }
    } catch {
      // ignore cross-origin safely
    }
  }, []);

  // Automatically save any added / played / searched song with the other tracks permanently
  const saveAndPersistTrack = useCallback((newTrack: YouTubeTrack) => {
    if (!newTrack || !newTrack.youtubeId) return;

    setTracks((prev) => {
      const existsIndex = prev.findIndex((t) => t.youtubeId === newTrack.youtubeId);
      let updated: YouTubeTrack[];
      if (existsIndex >= 0) {
        const existing = prev[existsIndex];
        const rest = prev.filter((_, idx) => idx !== existsIndex);
        updated = [existing, ...rest];
      } else {
        const itemToSave: YouTubeTrack = {
          ...newTrack,
          id: newTrack.id || `custom-${newTrack.youtubeId}-${Date.now()}`
        };
        updated = [itemToSave, ...prev];
      }

      try {
        const initialSet = new Set(INITIAL_YOUTUBE_TRACKS.map((t) => t.youtubeId));
        const customToSave = updated.filter(
          (t) => !initialSet.has(t.youtubeId) || t.id.startsWith('custom-') || t.id.startsWith('saved-') || t.id.startsWith('yt-')
        );
        localStorage.setItem('kurti-custom-tracks', JSON.stringify(customToSave));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // Record into recently watched
  const recordToHistory = useCallback((track: YouTubeTrack) => {
    if (!track || !track.youtubeId) return;
    setRecentlyWatched((prev) => {
      const filtered = prev.filter((item) => item.youtubeId !== track.youtubeId);
      const newEntry: RecentlyWatchedTrack = {
        ...track,
        watchedAt: Date.now()
      };
      const updated = [newEntry, ...filtered].slice(0, 15);
      try {
        localStorage.setItem('kurti-recently-watched', JSON.stringify(updated));
      } catch {
        // storage disabled or full
      }
      return updated;
    });
  }, []);

  const playTrack = useCallback(
    (track: YouTubeTrack) => {
      if (!track || !track.youtubeId) return;
      setCurrentTrack(track);
      setIsPlaying(true);
      setHasStartedPlayback(true);
      setIsMiniPlayerOpen(true);
      setIsCollapsedPill(false);
      setProgressSec(0);
      setDurationSec(parseDurationToSeconds(track.duration));
      saveAndPersistTrack(track);
      recordToHistory(track);

      // Post play command to ensure iframe begins playback
      setTimeout(() => {
        postIframeCommand('playVideo');
      }, 500);
    },
    [saveAndPersistTrack, recordToHistory, postIframeCommand]
  );

  const nextTrack = useCallback(() => {
    setTracks((currentTracks) => {
      const currentIndex = currentTracks.findIndex((t) => t.youtubeId === currentTrack.youtubeId);
      const nextIndex = (currentIndex + 1) % currentTracks.length;
      const next = currentTracks[nextIndex];
      if (next) {
        playTrack(next);
      }
      return currentTracks;
    });
  }, [currentTrack.youtubeId, playTrack]);

  const prevTrack = useCallback(() => {
    setTracks((currentTracks) => {
      const currentIndex = currentTracks.findIndex((t) => t.youtubeId === currentTrack.youtubeId);
      const prevIndex = (currentIndex - 1 + currentTracks.length) % currentTracks.length;
      const prev = currentTracks[prevIndex];
      if (prev) {
        playTrack(prev);
      }
      return currentTracks;
    });
  }, [currentTrack.youtubeId, playTrack]);

  // Update duration whenever currentTrack changes
  useEffect(() => {
    setDurationSec(parseDurationToSeconds(currentTrack?.duration));
    setProgressSec(0);
  }, [currentTrack?.youtubeId, currentTrack?.duration]);

  // Manage YouTube iframe communication & state sync
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        if (typeof e.data === 'string') {
          const parsed = JSON.parse(e.data);
          if (parsed.event === 'onStateChange') {
            if (parsed.info === 1) {
              // Playing
              setIsPlaying(true);
              setHasStartedPlayback(true);
            } else if (parsed.info === 2) {
              // Paused
              setIsPlaying(false);
            } else if (parsed.info === 0) {
              // Ended -> advance to next track
              nextTrack();
            }
          } else if (parsed.event === 'infoDelivery' && parsed.info) {
            if (typeof parsed.info.currentTime === 'number') {
              setProgressSec(Math.floor(parsed.info.currentTime));
            }
            if (typeof parsed.info.duration === 'number' && parsed.info.duration > 0) {
              setDurationSec(Math.floor(parsed.info.duration));
            }
          }
        }
      } catch {
        // ignore non-json messages safely
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [nextTrack]);

  // Synchronized playback progress fallback timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgressSec((prev) => {
        if (prev >= durationSec) {
          nextTrack();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, durationSec, nextTrack]);

  const toggleFavorite = useCallback(
    (track: YouTubeTrack) => {
      if (!track || !track.youtubeId) return;
      setFavoriteTracks((prev) => {
        const exists = prev.some((t) => t.youtubeId === track.youtubeId);
        let updated: YouTubeTrack[];
        if (exists) {
          updated = prev.filter((t) => t.youtubeId !== track.youtubeId);
        } else {
          const itemToSave: YouTubeTrack = {
            ...track,
            id: track.id || `fav-${track.youtubeId}`
          };
          updated = [itemToSave, ...prev];
          saveAndPersistTrack(itemToSave);
        }
        try {
          localStorage.setItem('kurti-favorite-tracks', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    },
    [saveAndPersistTrack]
  );

  const togglePlay = useCallback(() => {
    if (!hasStartedPlayback) {
      // First time playing
      playTrack(currentTrack);
      return;
    }

    setIsPlaying((prev) => {
      const nextState = !prev;
      if (nextState) {
        postIframeCommand('playVideo');
      } else {
        postIframeCommand('pauseVideo');
      }
      return nextState;
    });
  }, [hasStartedPlayback, playTrack, currentTrack, postIframeCommand]);

  const seekTo = useCallback(
    (seconds: number) => {
      const bounded = Math.max(0, Math.min(seconds, durationSec));
      setProgressSec(bounded);
      postIframeCommand('seekTo', [bounded, true]);
    },
    [durationSec, postIframeCommand]
  );

  const setVolume = useCallback(
    (vol: number) => {
      const bounded = Math.max(0, Math.min(100, vol));
      setVolumeState(bounded);
      if (isMuted && bounded > 0) {
        setIsMuted(false);
        postIframeCommand('unMute');
      }
      postIframeCommand('setVolume', [bounded]);
    },
    [isMuted, postIframeCommand]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const nextMute = !prev;
      if (nextMute) {
        postIframeCommand('mute');
      } else {
        postIframeCommand('unMute');
        postIframeCommand('setVolume', [volume]);
      }
      return nextMute;
    });
  }, [volume, postIframeCommand]);

  const pauseBackgroundAudio = useCallback(() => {
    postIframeCommand('pauseVideo');
  }, [postIframeCommand]);

  const resumeBackgroundAudio = useCallback(() => {
    if (isPlaying) {
      postIframeCommand('playVideo');
    }
  }, [isPlaying, postIframeCommand]);

  const closeMiniPlayer = useCallback(() => {
    setIsMiniPlayerOpen(false);
    try {
      localStorage.setItem('kurti-miniplayer-open', 'false');
    } catch {}
  }, []);

  const openMiniPlayer = useCallback(() => {
    setIsMiniPlayerOpen(true);
    setIsCollapsedPill(false);
    try {
      localStorage.setItem('kurti-miniplayer-open', 'true');
    } catch {}
  }, []);

  const toggleMiniPlayer = useCallback(() => {
    setIsMiniPlayerOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('kurti-miniplayer-open', String(next));
      } catch {}
      return next;
    });
    setIsCollapsedPill(false);
  }, []);

  const toggleCollapsePill = useCallback(() => {
    setIsCollapsedPill((prev) => !prev);
  }, []);

  const removeRecentTrack = useCallback((youtubeId: string) => {
    setRecentlyWatched((prev) => {
      const updated = prev.filter((t) => t.youtubeId !== youtubeId);
      try {
        localStorage.setItem('kurti-recently-watched', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const clearRecentHistory = useCallback(() => {
    setRecentlyWatched([]);
    try {
      localStorage.removeItem('kurti-recently-watched');
    } catch {
      // ignore
    }
  }, []);

  const originParam = typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : '';
  const persistentEmbedUrl = currentTrack
    ? `https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=${hasStartedPlayback || isPlaying ? '1' : '0'}&enablejsapi=1&origin=${originParam}&rel=0&controls=0&playsinline=1`
    : '';

  return (
    <MusicPlayerContext.Provider
      value={{
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
        recentlyWatched,
        favorites: favoriteTracks,
        isFavorite,
        toggleFavorite,
        playTrack,
        nextTrack,
        prevTrack,
        togglePlay,
        seekTo,
        setVolume,
        toggleMute,
        closeMiniPlayer,
        openMiniPlayer,
        toggleMiniPlayer,
        toggleCollapsePill,
        setIsCollapsedPill,
        setIsMiniPlayerOpen,
        isFullPlayerOpen,
        openFullPlayer,
        closeFullPlayer,
        toggleFullPlayer,
        pauseBackgroundAudio,
        resumeBackgroundAudio,
        saveAndPersistTrack,
        removeRecentTrack,
        clearRecentHistory
      }}
    >
      {/* 
        Persistent Hidden YouTube Audio Stream Worker
        Mounted once at the root provider; NEVER unmounts during section navigation
      */}
      {currentTrack && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '4px',
            height: '4px',
            opacity: 0.01,
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: -1
          }}
          aria-hidden="true"
        >
          <iframe
            ref={iframeRef}
            id="kurti-persistent-audio-player"
            key={`audio-stream-${currentTrack.youtubeId}`}
            src={persistentEmbedUrl}
            title={`Áudio Kurti - ${currentTrack.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}

      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};

