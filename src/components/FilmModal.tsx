import React from 'react';
import { Film } from '../types';
import { X, Film as FilmIcon, ShieldCheck } from 'lucide-react';

interface FilmModalProps {
  film: Film | null;
  onClose: () => void;
}

export const FilmModal: React.FC<FilmModalProps> = ({ film, onClose }) => {
  if (!film) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="bg-[#1a1420] text-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-[#493456] max-h-[90vh] flex flex-col my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#352541] bg-[#120e17]">
          <div className="flex items-center gap-2">
            <FilmIcon className="w-5 h-5 text-[#c66aff]" />
            <h2 className="font-serif text-lg text-white font-normal truncate">
              Kurtflix • {film.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-stone-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Embed */}
        <div className="aspect-video w-full bg-black relative">
          <iframe
            src={film.embedUrl}
            title={film.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Info */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between text-xs text-[#cf9cff] mb-2">
            <span className="font-bold uppercase tracking-wider">{film.eyebrow}</span>
            <span className="text-[#b9acbf]">{film.credit}</span>
          </div>

          <h3 className="text-2xl font-serif font-normal text-white mb-3">
            {film.title}
          </h3>

          <p className="text-sm text-[#c6bed0] leading-relaxed mb-6">
            {film.synopsis}
          </p>

          <div className="p-4 rounded-xl bg-[#261c2d] border border-[#3e2c49] flex items-center justify-between text-xs text-[#b9acbf]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#c66aff]" />
              <span>Licença: {film.license}</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
            >
              Fechar Player
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
