import React from 'react';

interface HelpSectionProps {
  onOpenContact?: () => void;
}

export const HelpSection: React.FC<HelpSectionProps> = ({ onOpenContact }) => {
  return (
    <section className="help-section page-section" id="denuncie">
      <div className="help-heading">
        <span>Precisa de ajuda?</span>
        <h2>Denuncie com segurança.</h2>
        <p>A Kurti não coleta relatos sensíveis. A gente leva você diretamente aos canais oficiais que podem acolher, orientar e encaminhar.</p>
      </div>

      <div className="help-grid">
        <a className="emergency" href="tel:190">
          <span>Risco imediato</span>
          <strong>190</strong>
          <p>Polícia Militar</p>
        </a>

        <a href="tel:100">
          <span>Direitos humanos</span>
          <strong>Disque 100</strong>
          <p>Gratuito, 24 horas, todos os dias.</p>
        </a>

        <a href="tel:180">
          <span>Violência contra mulheres</span>
          <strong>Ligue 180</strong>
          <p>Orientação e encaminhamento, 24 horas.</p>
        </a>

        <button type="button" onClick={onOpenContact}>
          <span>Acolhimento</span>
          <strong>CRLGBT</strong>
          <p>Centros de Cidadania e Referência LGBT+</p>
        </button>
      </div>

      <p className="help-note">
        Ao fazer uma ligação, confirme se está em um dispositivo seguro. Se alguém monitora seu aparelho, considere usar outro telefone.
      </p>
    </section>
  );
};
