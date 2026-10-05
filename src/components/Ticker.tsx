import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const Ticker: React.FC = () => {
  return (
    <section className="ticker" aria-label="Compromissos editoriais">
      <span>Atualização de 4 em 4 horas</span>
      <p>Edição contínua 24h</p>
      <i>✦</i>
      <p>Fontes checadas</p>
      <i>✦</i>
      <p>Agendas por localidade</p>
      <i>✦</i>
      <p>Direitos e serviço</p>
      <i>✦</i>
      <p>Conteúdo original</p>
    </section>
  );
};

interface AppInstallCardProps {
  onOpenStore?: () => void;
}

export const AppInstallCard: React.FC<AppInstallCardProps> = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const handleInstall = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // In normal desktop browser or already installed
      alert('Para instalar o aplicativo Kurti no seu dispositivo, utilize o menu do navegador e selecione "Instalar Kurti" ou "Adicionar à tela de início".');
    }
  };

  return (
    <>
      <section className="app-install-card" aria-labelledby="app-install-title">
        <img
          src="/kurti-icon.png"
          alt=""
          width="70"
          height="70"
          loading="lazy"
          decoding="async"
          aria-hidden="true"
        />
        <div>
          <span>Aplicativo Kurti</span>
          <h2 id="app-install-title">Leve a Kurti com você.</h2>
          <p>Instale no celular e abra em tela cheia. O app usa o mesmo conteúdo público do site e recebe cada nova edição automaticamente.</p>
        </div>
        <button type="button" onClick={handleInstall}>
          {isInstalled ? 'Aplicativo instalado' : 'Instalar aplicativo'}
        </button>
      </section>

      {showIOSGuide && (
        <div className="dialog-backdrop" onClick={() => setShowIOSGuide(false)}>
          <div className="location-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 450 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 20 }}>Como instalar no iOS</h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--muted)' }}>
              1. Toque no botão de <strong>Compartilhar</strong> (ícone de quadrado com seta para cima) na barra inferior do Safari.<br />
              2. Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.<br />
              3. Toque em <strong>Adicionar</strong> no canto superior direito.
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              style={{
                marginTop: 16,
                width: '100%',
                background: 'var(--red)',
                color: '#fff',
                border: 0,
                borderRadius: 20,
                padding: '10px 0',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
