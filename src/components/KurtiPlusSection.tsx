import React from 'react';

interface KurtiPlusSectionProps {
  onSelectCategory: (category: string) => void;
}

export const KurtiPlusSection: React.FC<KurtiPlusSectionProps> = ({ onSelectCategory }) => {
  return (
    <section className="channels-section section-landing" id="kurti-mais">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Kurti+</span>
          <h2>Escolha uma editoria</h2>
        </div>
        <p>Abra uma página própria para consultar todo o conteúdo publicado nessa área.</p>
      </div>

      <div className="channel-grid">
        <button
          className="channel-card tone-coral"
          onClick={() => onSelectCategory('cabelos')}
        >
          <span>Cuidado e expressão</span>
          <strong>Cabelos</strong>
          <p>Cortes, tinturas e cuidados capilares com linguagem direta e dicas práticas.</p>
          <span className="card-cta">
            Abrir página{' '}
            <svg viewBox="0 0 24 24" aria-hidden="true" width="12" height="12">
              <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </span>
        </button>

        <button
          className="channel-card tone-violet"
          onClick={() => onSelectCategory('celebridades')}
        >
          <span>Fatos confirmados</span>
          <strong>Celebridades</strong>
          <p>Acontecimentos públicos, relacionamentos e marcos da cultura pop sem fofoca inventada.</p>
          <span className="card-cta">
            Abrir página{' '}
            <svg viewBox="0 0 24 24" aria-hidden="true" width="12" height="12">
              <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </span>
        </button>

        <button
          className="channel-card tone-green"
          onClick={() => onSelectCategory('culinaria')}
        >
          <span>Cozinha prática</span>
          <strong>Culinária</strong>
          <p>Receitas rápidas, saborosas e com rendimento pensado para o dia a dia.</p>
          <span className="card-cta">
            Abrir página{' '}
            <svg viewBox="0 0 24 24" aria-hidden="true" width="12" height="12">
              <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </span>
        </button>

        <button
          className="channel-card tone-blue"
          onClick={() => onSelectCategory('dicionario')}
        >
          <span>Termos e memória</span>
          <strong>Dicionário da Kurti</strong>
          <p>Significados, origens e uso respeitoso de expressões da comunidade LGBT+.</p>
          <span className="card-cta">
            Abrir página{' '}
            <svg viewBox="0 0 24 24" aria-hidden="true" width="12" height="12">
              <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </span>
        </button>

        <button
          className="channel-card tone-red"
          onClick={() => onSelectCategory('direitos')}
        >
          <span>Cidadania e leis</span>
          <strong>Direitos LGBT</strong>
          <p>Decisões judiciais, direitos conquistados e canais de proteção e apoio.</p>
          <span className="card-cta">
            Abrir página{' '}
            <svg viewBox="0 0 24 24" aria-hidden="true" width="12" height="12">
              <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </span>
        </button>

        <button
          className="channel-card tone-green"
          onClick={() => onSelectCategory('esportes')}
        >
          <span>Quadras e pistas</span>
          <strong>Esportes</strong>
          <p>Competições, atletas LGBT+ e iniciativas de inclusão no esporte amador e profissional.</p>
          <span className="card-cta">
            Abrir página{' '}
            <svg viewBox="0 0 24 24" aria-hidden="true" width="12" height="12">
              <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </span>
        </button>

        <button
          className="channel-card tone-amber"
          onClick={() => onSelectCategory('moda')}
        >
          <span>Estilo e corpo</span>
          <strong>Moda</strong>
          <p>Tendências, expressão de gênero e marcas com responsabilidade e diversidade.</p>
          <span className="card-cta">
            Abrir página{' '}
            <svg viewBox="0 0 24 24" aria-hidden="true" width="12" height="12">
              <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </span>
        </button>

        <button
          className="channel-card tone-coral"
          onClick={() => onSelectCategory('saude')}
        >
          <span>Bem-estar e prevenção</span>
          <strong>Saúde</strong>
          <p>Informações de saúde física e mental com responsabilidade e fontes médicas.</p>
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
