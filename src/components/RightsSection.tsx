import React from 'react';
import { RightsItem } from '../types';

interface RightsSectionProps {
  rights: RightsItem[];
  onOpenContact?: () => void;
}

export const RightsSection: React.FC<RightsSectionProps> = ({ rights }) => {
  return (
    <section className="rights-section page-section" id="direitos">
      <div className="rights-heading">
        <span className="eyebrow" style={{ color: '#1665a6' }}>Cidadania e leis</span>
        <h2>Direitos garantidos no Brasil.</h2>
        <p>
          Decisões judiciais, resoluções e avanços legais que protegem a comunidade LGBT+, com linguagem acessível e fontes oficiais.
        </p>
      </div>

      <div className="rights-grid">
        {rights.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              if (item.url) window.open(item.url, '_blank');
            }}
          >
            <span>{String(idx + 1).padStart(2, '0')} · Decisão</span>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
            <strong>
              Fonte: {item.source}{' '}
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
