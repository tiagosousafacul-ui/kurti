import React from 'react';
import { WomenSpaceItem } from '../types';

interface WomenSectionProps {
  womenItems: WomenSpaceItem[];
  onOpenArticle: (articleId: string) => void;
}

export const WomenSection: React.FC<WomenSectionProps> = ({
  womenItems,
  onOpenArticle
}) => {
  return (
    <section className="women-section page-section" id="espaco-delas">
      <div className="women-title">
        <span>Espaço Delas</span>
        <h2>Notícia, cultura e agenda com protagonismo lésbico.</h2>
        <p>
          Um espaço permanente para histórias, serviços, referências e eventos do Brasil e do mundo — não apenas em datas comemorativas.
        </p>
      </div>

      <div className="women-cards">
        {womenItems.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onOpenArticle(item.articleId)}
          >
            <span>{item.eyebrow}</span>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
            <strong>
              Ler matéria completa{' '}
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
