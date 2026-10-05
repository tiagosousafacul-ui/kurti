import React from 'react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenContact: () => void;
  onOpenOrders: () => void;
  onOpenDbStatus: () => void;
  onOpenKurtiIA: () => void;
  onOpenAdmin?: () => void;
  onOpenShare?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenKurtiIA,
  onOpenAdmin,
  onOpenShare
}) => {
  return (
    <footer className="site-footer" id="rodape">
      <img
        src="/kurti-icon.png"
        alt=""
        width="626"
        height="626"
        loading="lazy"
        decoding="async"
      />
      <div>
        <strong>Kurti</strong>
        <p>Conteúdo LGBT+ com orgulho, cuidado e fonte.</p>
      </div>
      <nav aria-label="Links do rodapé">
        <button type="button" onClick={() => onNavigate('inicio')}>
          Início
        </button>
        {onOpenShare && (
          <button type="button" onClick={onOpenShare} style={{ color: '#ff8cab', fontWeight: 'bold' }}>
            Link Público
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            onNavigate('kurti-ia');
            onOpenKurtiIA();
          }}
        >
          Kurti IA
        </button>
        <button type="button" onClick={() => onNavigate('denuncie')}>
          Ajuda
        </button>
        <button type="button" onClick={() => onNavigate('direitos')}>
          Privacidade
        </button>
        <button type="button" onClick={() => onNavigate('loja')}>
          Loja
        </button>
        <button type="button" onClick={onOpenAdmin}>
          Admin
        </button>
      </nav>
    </footer>
  );
};
