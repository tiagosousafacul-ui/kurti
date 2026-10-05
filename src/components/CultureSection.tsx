import React from 'react';

interface CultureSectionProps {
  onSelectArea: (area: string) => void;
  subArea?: string;
}

export const CultureSection: React.FC<CultureSectionProps> = ({ onSelectArea, subArea }) => {
  return (
    <section className="channels-section section-landing" id="cultura">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Cultura {subArea ? `· ${subArea}` : ''}</span>
          <h2>{subArea ? `Cultura: ${subArea.toUpperCase()}` : 'Escolha uma área cultural'}</h2>
        </div>
        <p>Abra uma página própria para consultar todo o conteúdo publicado nessa área.</p>
      </div>
      <div className="channel-grid">
        <button
          className="channel-card tone-blue"
          onClick={() => onSelectArea('cultura-cinema')}
        >
          <span>Salas e mostras</span>
          <strong>Cinema</strong>
          <p>Filmes em cartaz, mostras de cinema e lançamentos com temática LGBT+.</p>
          <span className="card-cta">
            Abrir página{' '}
            <svg viewBox="0 0 24 24" aria-hidden="true" width="12" height="12">
              <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </span>
        </button>

        <button
          className="channel-card tone-violet"
          onClick={() => onSelectArea('cultura-teatro')}
        >
          <span>Palco e cena</span>
          <strong>Teatro</strong>
          <p>Espetáculos, peças e performances nos palcos da sua região.</p>
          <span className="card-cta">
            Abrir página{' '}
            <svg viewBox="0 0 24 24" aria-hidden="true" width="12" height="12">
              <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </span>
        </button>

        <button
          className="channel-card tone-amber"
          onClick={() => onSelectArea('cultura-literatura')}
        >
          <span>Leituras e livros</span>
          <strong>Literatura</strong>
          <p>Lançamentos, autores, livrarias e eventos literários LGBT+.</p>
          <span className="card-cta">
            Abrir página{' '}
            <svg viewBox="0 0 24 24" aria-hidden="true" width="12" height="12">
              <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </span>
        </button>
      </div>
    </section>
  );
};
