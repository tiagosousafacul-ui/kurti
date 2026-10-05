import React from 'react';
import { Film as FilmType } from '../types';

interface KurtflixSectionProps {
  films: FilmType[];
  onOpenFilm: (film: FilmType) => void;
}

export const KurtflixSection: React.FC<KurtflixSectionProps> = ({ films, onOpenFilm }) => {
  return (
    <section className="streaming-section page-section" id="kurtflix">
      <div className="streaming-copy">
        <span className="stream-status">
          <i></i> Primeiros filmes com licença aberta
        </span>
        <p className="stream-brand">
          KURTI<span>FLIX</span>
        </p>
        <h2>Filmes LGBT+ para assistir sem sair da Kurti.</h2>
        <p>
          O catálogo começa pequeno e seguro: obras publicadas com licença Creative Commons compatível e crédito visível. Conteúdo apenas “gratuito na internet” não entra.
        </p>
        <div className="stream-guard">
          <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
            <path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" strokeWidth="2"></path>
          </svg>
          <span>
            <b>Licença conferida antes do play</b>Cada cópia precisa indicar autorização aberta ou domínio público. Obras comerciais só entram com contrato por escrito.
          </span>
        </div>
      </div>

      <div className="open-film-grid">
        {films.map((film, idx) => (
          <button
            key={film.id}
            className="film-card"
            aria-label={`Assistir ${film.title}`}
            onClick={() => onOpenFilm(film)}
          >
            <span>
              {String(idx + 1).padStart(2, '0')} · {film.eyebrow}
            </span>
            <i aria-hidden="true">▶</i>
            <h3>{film.title}</h3>
            <p>{film.synopsis}</p>
            <strong>
              Assistir dentro da Kurti{' '}
              <svg viewBox="0 0 24 24" aria-hidden="true" width="12" height="12">
                <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"></path>
              </svg>
            </strong>
          </button>
        ))}
      </div>
    </section>
  );
};
