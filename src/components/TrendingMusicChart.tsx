import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  TrendingUp,
  Play,
  Flame,
  Award,
  Sparkles,
  ArrowUpRight,
  Music2
} from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { INITIAL_YOUTUBE_TRACKS } from '../data/youtubeTracks';
import { YouTubeTrack } from '../types';

interface TrendingTrackData {
  id: string;
  youtubeId: string;
  title: string;
  artist: string;
  category: string;
  growthPct: number;
  totalStreams: number;
  color: string;
  gradientId: string;
  weeklyHistory: { day: string; ouvintes: number; streams: number }[];
}

const TRENDING_TRACKS: TrendingTrackData[] = [
  {
    id: 'good-luck-babe-chappell',
    youtubeId: '1RKqOmSkGgM',
    title: 'Good Luck, Babe!',
    artist: 'Chappell Roan',
    category: 'Hinos LGBT+',
    growthPct: 142,
    totalStreams: 184500,
    color: '#ff2b66',
    gradientId: 'colorChappell',
    weeklyHistory: [
      { day: 'Seg', ouvintes: 8200, streams: 12400 },
      { day: 'Ter', ouvintes: 10400, streams: 15800 },
      { day: 'Qua', ouvintes: 13900, streams: 21300 },
      { day: 'Qui', ouvintes: 17200, streams: 26500 },
      { day: 'Sex', ouvintes: 22800, streams: 35100 },
      { day: 'Sáb', ouvintes: 29400, streams: 44200 },
      { day: 'Dom', ouvintes: 34600, streams: 49200 }
    ]
  },
  {
    id: 'vermelho-gloria',
    youtubeId: 'p4aPlYN6x1Q',
    title: 'VERMELHO',
    artist: 'Gloria Groove',
    category: 'Pop & Drag BR',
    growthPct: 118,
    totalStreams: 162300,
    color: '#ed003f',
    gradientId: 'colorGloria',
    weeklyHistory: [
      { day: 'Seg', ouvintes: 9500, streams: 14300 },
      { day: 'Ter', ouvintes: 11200, streams: 17000 },
      { day: 'Qua', ouvintes: 14100, streams: 21500 },
      { day: 'Qui', ouvintes: 18300, streams: 27900 },
      { day: 'Sex', ouvintes: 24100, streams: 36800 },
      { day: 'Sáb', ouvintes: 28900, streams: 43500 },
      { day: 'Dom', ouvintes: 31200, streams: 46300 }
    ]
  },
  {
    id: 'ko-pabllo',
    youtubeId: '3L5D8by1AtI',
    title: 'K.O.',
    artist: 'Pabllo Vittar',
    category: 'Pop & Drag BR',
    growthPct: 95,
    totalStreams: 138900,
    color: '#a855f7',
    gradientId: 'colorPabllo',
    weeklyHistory: [
      { day: 'Seg', ouvintes: 7900, streams: 11800 },
      { day: 'Ter', ouvintes: 9100, streams: 13800 },
      { day: 'Qua', ouvintes: 11500, streams: 17600 },
      { day: 'Qui', ouvintes: 14800, streams: 22400 },
      { day: 'Sex', ouvintes: 19700, streams: 30100 },
      { day: 'Sáb', ouvintes: 24200, streams: 37200 },
      { day: 'Dom', ouvintes: 26500, streams: 40000 }
    ]
  },
  {
    id: 'baby-95-liniker',
    youtubeId: 'CZwZX-QdJ0E',
    title: 'Baby95',
    artist: 'Liniker',
    category: 'MPB & R&B',
    growthPct: 84,
    totalStreams: 115200,
    color: '#06b6d4',
    gradientId: 'colorLiniker',
    weeklyHistory: [
      { day: 'Seg', ouvintes: 6800, streams: 10200 },
      { day: 'Ter', ouvintes: 7900, streams: 12000 },
      { day: 'Qua', ouvintes: 9800, streams: 14900 },
      { day: 'Qui', ouvintes: 12400, streams: 18800 },
      { day: 'Sex', ouvintes: 16100, streams: 24500 },
      { day: 'Sáb', ouvintes: 19800, streams: 30200 },
      { day: 'Dom', ouvintes: 22400, streams: 34600 }
    ]
  },
  {
    id: 'rush-troye',
    youtubeId: 'b53QJYP-lqY',
    title: 'Rush',
    artist: 'Troye Sivan',
    category: 'Hinos LGBT+',
    growthPct: 76,
    totalStreams: 102400,
    color: '#eab308',
    gradientId: 'colorTroye',
    weeklyHistory: [
      { day: 'Seg', ouvintes: 6200, streams: 9300 },
      { day: 'Ter', ouvintes: 7100, streams: 10800 },
      { day: 'Qua', ouvintes: 8700, streams: 13200 },
      { day: 'Qui', ouvintes: 11100, streams: 16900 },
      { day: 'Sex', ouvintes: 14500, streams: 22100 },
      { day: 'Sáb', ouvintes: 17800, streams: 27100 },
      { day: 'Dom', ouvintes: 20100, streams: 31000 }
    ]
  }
];

export const TrendingMusicChart: React.FC = () => {
  const { playTrack, currentTrack } = useMusicPlayer();
  const [metricMode, setMetricMode] = useState<'ouvintes' | 'streams'>('ouvintes');
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  // Merge day-by-day points for Recharts
  const chartData = useMemo(() => {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    return days.map((day, idx) => {
      const point: Record<string, string | number> = { day };
      TRENDING_TRACKS.forEach((track) => {
        point[track.id] = track.weeklyHistory[idx]?.[metricMode] || 0;
      });
      return point;
    });
  }, [metricMode]);

  const handlePlayTrending = (youtubeId: string) => {
    const match = INITIAL_YOUTUBE_TRACKS.find((t) => t.youtubeId === youtubeId);
    if (match) {
      playTrack(match);
    } else {
      const fallbackTrack: YouTubeTrack = {
        id: `trend-${youtubeId}`,
        title: TRENDING_TRACKS.find((t) => t.youtubeId === youtubeId)?.title || 'Faixa',
        artist: TRENDING_TRACKS.find((t) => t.youtubeId === youtubeId)?.artist || 'Artista',
        youtubeId,
        category: 'Tendências'
      };
      playTrack(fallbackTrack);
    }
  };

  const activeTracks = useMemo(() => {
    if (selectedTrackId) {
      return TRENDING_TRACKS.filter((t) => t.id === selectedTrackId);
    }
    return TRENDING_TRACKS;
  }, [selectedTrackId]);

  // Formatter for Y axis numbers (e.g. 10k, 25k)
  const formatYAxis = (val: number) => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(0)}k`;
    }
    return String(val);
  };

  return (
    <section
      aria-label="Tendências de ouvintes na semana"
      className="bg-[#141112] text-white rounded-3xl border border-[#382b2e] p-5 sm:p-8 shadow-2xl relative overflow-hidden my-10"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ed003f]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#a855f7]/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ed003f]/20 border border-[#ed003f]/40 text-[#ff8cab] text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-[#ff2b66] animate-pulse" />
              Radar em Alta · 7 Dias
            </span>
            <span className="text-stone-400 text-xs font-mono">
              Atualizado hoje
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-4xl text-white font-normal leading-tight">
            Tendências de Ouvintes da Semana
          </h3>
          <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Acompanhe em tempo real as faixas LGBT+ que registraram a maior aceleração de streams e ouvintes diários no ecossistema do Kurti.
          </p>
        </div>

        {/* METRIC SELECTOR TABS */}
        <div className="flex items-center gap-1.5 bg-[#20191b] p-1.5 rounded-2xl border border-[#3e2e32] shrink-0 self-start md:self-end">
          <button
            type="button"
            onClick={() => setMetricMode('ouvintes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              metricMode === 'ouvintes'
                ? 'bg-[#ed003f] text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Ouvintes Diários
          </button>
          <button
            type="button"
            onClick={() => setMetricMode('streams')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              metricMode === 'streams'
                ? 'bg-[#ed003f] text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Volume de Streams
          </button>
        </div>
      </div>

      {/* RECHARTS VISUALIZATION CONTAINER */}
      <div className="relative z-10 pt-6">
        <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
          <span>Evolução diária de segunda a domingo</span>
          {selectedTrackId && (
            <button
              type="button"
              onClick={() => setSelectedTrackId(null)}
              className="text-[#ff8cab] hover:text-white underline font-bold cursor-pointer"
            >
              Mostrar todas as faixas
            </button>
          )}
        </div>

        <div className="h-[280px] sm:h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                {TRENDING_TRACKS.map((t) => (
                  <linearGradient key={t.gradientId} id={t.gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={t.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={t.color} stopOpacity={0.0} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#2a2225" vertical={false} />

              <XAxis
                dataKey="day"
                stroke="#665b5e"
                tick={{ fill: '#a89ea0', fontSize: 11, fontWeight: 600 }}
                axisLine={{ stroke: '#3a2e32' }}
                tickLine={false}
              />

              <YAxis
                stroke="#665b5e"
                tick={{ fill: '#a89ea0', fontSize: 10, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#3a2e32' }}
                tickLine={false}
                tickFormatter={formatYAxis}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#181315] border border-[#ed003f]/50 rounded-2xl p-3 shadow-2xl backdrop-blur-md text-xs z-50 min-w-[200px]">
                        <p className="font-bold text-white mb-2 border-b border-white/10 pb-1 flex items-center justify-between">
                          <span>{label}-feira</span>
                          <span className="text-[#ff8cab] font-mono text-[10px] uppercase">
                            {metricMode === 'ouvintes' ? 'Ouvintes' : 'Streams'}
                          </span>
                        </p>
                        <div className="space-y-1.5">
                          {payload.map((item: any) => {
                            const trackMeta = TRENDING_TRACKS.find((t) => t.id === item.dataKey);
                            if (!trackMeta) return null;
                            return (
                              <div key={item.dataKey} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-1.5 truncate">
                                  <span
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: trackMeta.color }}
                                  />
                                  <span className="text-stone-300 truncate max-w-[120px]">
                                    {trackMeta.title}
                                  </span>
                                </div>
                                <span className="font-mono font-bold text-white">
                                  {Number(item.value).toLocaleString('pt-BR')}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {activeTracks.map((track) => (
                <Area
                  key={track.id}
                  type="monotone"
                  dataKey={track.id}
                  name={track.title}
                  stroke={track.color}
                  strokeWidth={selectedTrackId === track.id ? 3.5 : 2.5}
                  fill={`url(#${track.gradientId})`}
                  dot={{ r: 3, fill: track.color, strokeWidth: 1, stroke: '#141112' }}
                  activeDot={{ r: 6, fill: '#ffffff', stroke: track.color, strokeWidth: 2 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TRACK CARDS & SPEED GAIN METRICS */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-6 mt-6 border-t border-white/10">
        {TRENDING_TRACKS.map((track, idx) => {
          const isCurrentActive = currentTrack?.youtubeId === track.youtubeId;
          const isFiltered = selectedTrackId === track.id;

          return (
            <div
              key={track.id}
              onClick={() => setSelectedTrackId(isFiltered ? null : track.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                isFiltered
                  ? 'bg-[#25191c] border-[#ed003f] shadow-[0_4px_20px_rgba(237,0,63,0.35)]'
                  : 'bg-[#1b1517] border-[#34272a] hover:border-white/30 hover:bg-[#20181b]'
              }`}
            >
              <div>
                {/* Header Rank + Growth */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-stone-400">
                      #{idx + 1}
                    </span>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: track.color }}
                    />
                  </div>

                  <span className="inline-flex items-center text-[11px] font-bold font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded-md border border-emerald-800/40">
                    <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    +{track.growthPct}%
                  </span>
                </div>

                {/* Track Info */}
                <h4 className="font-serif text-sm font-bold text-white truncate group-hover:text-[#ff8cab] transition-colors leading-tight">
                  {track.title}
                </h4>
                <p className="text-xs text-stone-400 truncate mt-0.5">
                  {track.artist}
                </p>
              </div>

              {/* Action: Play Track */}
              <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-white/10">
                <span className="text-[10px] font-mono text-stone-400">
                  {track.totalStreams.toLocaleString('pt-BR')} streams
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayTrending(track.youtubeId);
                  }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-sm ${
                    isCurrentActive
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'bg-[#ed003f] hover:bg-[#ba0032] text-white'
                  }`}
                  title={`Ouvir ${track.title}`}
                  aria-label={`Tocar ${track.title}`}
                >
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER INSIGHT NOTE */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 mt-4 border-t border-white/10 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#ed003f]" />
          <span>
            <strong className="text-white">Destaque da semana:</strong> Chappell Roan lidera aceleração (+142%) com o hino sáfico <em>Good Luck, Babe!</em>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-stone-400">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Curadoria com base na audiência nacional</span>
        </div>
      </div>
    </section>
  );
};
