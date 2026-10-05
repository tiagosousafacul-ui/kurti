import React, { useState } from 'react';
import { BrazilState } from '../types';
import { X, MapPin, Check, Compass, Navigation, Loader2, Sparkles } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  states: BrazilState[];
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
}

const POPULAR_LOCATIONS = [
  'Nacional (Todo o Brasil)',
  'Belo Horizonte · MG',
  'São Paulo · SP',
  'Rio de Janeiro · RJ',
  'Salvador · BA',
  'Brasília · DF',
  'Porto Alegre · RS',
  'Curitiba · PR',
  'Recife · PE',
  'Fortaleza · CE'
];

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  states,
  selectedLocation,
  onSelectLocation
}) => {
  const [search, setSearch] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionMessage, setDetectionMessage] = useState<string | null>(null);
  const [detectionError, setDetectionError] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredStates = states.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.capital.toLowerCase().includes(search.toLowerCase()) ||
      s.uf.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (locString: string) => {
    onSelectLocation(locString);
    onClose();
  };

  // Safe, non-blocking automatic location detector
  const handleAutoDetect = async () => {
    setIsDetecting(true);
    setDetectionMessage('Detectando sua localização com segurança...');
    setDetectionError(null);

    const resolveWithServer = async (lat?: number, lng?: number) => {
      try {
        const query = lat !== undefined && lng !== undefined ? `?lat=${lat}&lng=${lng}` : '';
        const res = await fetch(`/api/location${query}`, {
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(3500)
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.location) {
            setDetectionMessage(`Localizado: ${data.location}`);
            setTimeout(() => {
              onSelectLocation(data.location);
              setIsDetecting(false);
              onClose();
            }, 600);
            return true;
          }
        }
      } catch {
        // Continue to fallback
      }
      return false;
    };

    // Try browser geolocation with a strict 3-second timeout
    if ('geolocation' in navigator) {
      let resolved = false;

      const timer = setTimeout(async () => {
        if (!resolved) {
          resolved = true;
          setDetectionMessage('Tentando aproximação por rede...');
          const ok = await resolveWithServer();
          if (!ok) {
            setDetectionError('Não foi possível obter a posição exata. Escolha seu estado na lista abaixo.');
            setIsDetecting(false);
          }
        }
      }, 3000);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (resolved) return;
          resolved = true;
          clearTimeout(timer);
          const { latitude, longitude } = position.coords;
          const ok = await resolveWithServer(latitude, longitude);
          if (!ok) {
            setDetectionError('Não foi possível sincronizar com o mapa. Escolha seu estado na lista.');
            setIsDetecting(false);
          }
        },
        async () => {
          if (resolved) return;
          resolved = true;
          clearTimeout(timer);
          setDetectionMessage('Permissão negada. Detectando por conexão...');
          const ok = await resolveWithServer();
          if (!ok) {
            setDetectionError('Permissão de localização negada. Selecione seu estado ou capital abaixo.');
            setIsDetecting(false);
          }
        },
        { enableHighAccuracy: false, timeout: 3000, maximumAge: 300000 }
      );
    } else {
      // Geolocation not in navigator, use server fallback
      const ok = await resolveWithServer();
      if (!ok) {
        setDetectionError('Geolocalização não disponível no navegador. Escolha seu estado abaixo.');
        setIsDetecting(false);
      }
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-[var(--line)] max-h-[88vh] flex flex-col my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[#faf8f5]">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#ed003f]" />
            <div>
              <h2 className="font-serif text-xl font-normal text-[var(--ink)]">
                Escolher Localidade
              </h2>
              <p className="text-[11px] text-[var(--muted)]">
                Programação de eventos, baladas e cultura LGBT+ da sua região
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-[var(--muted)] transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auto-detect button */}
        <div className="px-6 pt-4 pb-2 bg-gradient-to-r from-rose-50/70 to-orange-50/50 border-b border-[var(--line)]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              onClick={handleAutoDetect}
              disabled={isDetecting}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#ed003f] hover:bg-[#ba0032] text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-75"
              id="btn-auto-detect-location"
            >
              {isDetecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Detectando cidade...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>Detectar Minha Localização (GPS)</span>
                </>
              )}
            </button>

            <span className="text-[11px] text-stone-600 text-center sm:text-right">
              Atual: <strong className="text-[var(--ink)]">{selectedLocation}</strong>
            </span>
          </div>

          {detectionMessage && (
            <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{detectionMessage}</span>
            </div>
          )}

          {detectionError && (
            <div className="mt-2 text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/60 animate-fadeIn">
              <span>{detectionError}</span>
            </div>
          )}

          {/* Quick popular pills */}
          <div className="mt-3 pt-3 border-t border-rose-100/80">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
              Acesso Rápido às Principais Capitais:
            </span>
            <div className="flex flex-wrap gap-1.5 pb-1">
              {POPULAR_LOCATIONS.map((loc) => {
                const isCurrent = selectedLocation === loc;
                return (
                  <button
                    key={loc}
                    onClick={() => handleSelect(loc)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                      isCurrent
                        ? 'bg-[#ed003f] text-white border-[#ed003f] font-bold shadow-xs'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-[#ed003f] hover:text-[#ed003f]'
                    }`}
                  >
                    {loc}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[var(--line)] bg-stone-50">
          <input
            type="text"
            placeholder="Buscar estado, sigla (ex: SP, MG, RJ) ou capital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-white text-xs text-[var(--ink)] focus:outline-hidden focus:border-[#ed003f] transition-all"
          />

          <div className="flex items-center justify-between mt-2 px-1">
            <button
              onClick={() => handleSelect('Nacional (Todo o Brasil)')}
              className="text-xs font-bold text-[#ed003f] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Ver edição de Todo o Brasil</span>
            </button>
            <span className="text-[11px] text-[var(--muted)]">27 Estados e DF</span>
          </div>
        </div>

        {/* States List */}
        <div className="overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 custom-scrollbar flex-1">
          {filteredStates.map((st) => {
            const locLabel = `${st.capital} · ${st.uf}`;
            const isSelected = selectedLocation === locLabel;
            return (
              <button
                key={st.uf}
                onClick={() => handleSelect(locLabel)}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#ed003f] bg-rose-50 text-[#ba0032] shadow-xs'
                    : 'border-[var(--line)] hover:border-stone-400 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-md bg-stone-100 font-mono text-xs font-bold flex items-center justify-center text-[var(--ink)]">
                      {st.uf}
                    </span>
                    <strong className="text-xs text-[var(--ink)]">{st.name}</strong>
                  </div>
                  <span className="text-[11px] text-[var(--muted)] pl-9 block">
                    Capital: {st.capital}
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#ed003f] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
