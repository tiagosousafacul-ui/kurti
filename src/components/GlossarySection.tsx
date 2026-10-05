import React from 'react';
import { GlossaryTuple } from '../types';

interface GlossarySectionProps {
  glossary: GlossaryTuple[];
}

export const GlossarySection: React.FC<GlossarySectionProps> = ({ glossary }) => {
  return (
    <section className="editorial-section glossary-section page-section" id="dicionario">
      <div className="editorial-intro">
        <div>
          <span className="eyebrow">Dicionário da Kurti</span>
          <h2>Termos explicados com rigor e afeto.</h2>
        </div>
        <p>
          Conceitos sobre gênero, sexualidade e vivências da comunidade LGBT+, com linguagem acessível e fontes especializadas.
        </p>
      </div>

      <div className="glossary-grid">
        {glossary.map(([letter, term, def], idx) => (
          <article key={idx}>
            <span>{letter}</span>
            <div>
              <h3>{term}</h3>
              <p>{def}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
