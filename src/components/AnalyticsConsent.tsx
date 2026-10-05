import React, { useState, useEffect } from 'react';

export const AnalyticsConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('kurti-consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('kurti-consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('kurti-consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      className="analytics-consent"
      role="dialog"
      aria-label="Preferências de métricas"
      aria-live="polite"
    >
      <div>
        <strong>Métricas e privacidade</strong>
        <p>
          Com sua autorização, a Kurti usa o Google Analytics para entender visitas, páginas acessadas e desempenho do site. A medição não é usada para publicidade personalizada.
        </p>
      </div>
      <div className="analytics-consent-actions">
        <button type="button" className="analytics-decline" onClick={handleDecline}>
          Recusar
        </button>
        <button type="button" className="analytics-accept" onClick={handleAccept}>
          Aceitar métricas
        </button>
      </div>
    </aside>
  );
};
