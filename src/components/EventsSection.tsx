import React, { useState } from 'react';
import { Club, CultureGuides } from '../types';

interface EventsSectionProps {
  clubs: Club[];
  cultureGuides: CultureGuides;
  selectedLocation: string;
  onOpenLocation: () => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  clubs,
  cultureGuides,
  selectedLocation,
  onOpenLocation
}) => {
  const [activeTab, setActiveTab] = useState<'baladas' | 'cinema' | 'teatro'>('baladas');

  return (
    <section className="editorial-section page-section" id="eventos">
      <div className="editorial-intro">
        <div>
          <span className="eyebrow">Agendas locais · {selectedLocation || 'Belo Horizonte · MG'}</span>
          <h2>Onde ir e o que fazer</h2>
        </div>
        <p>
          Espaços seguros, baladas checadas, salas de cinema e espetáculos teatrais com curadoria e acolhimento LGBT+.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <button
          type="button"
          onClick={onOpenLocation}
          className="location-button"
          style={{ height: 36 }}
        >
          <span>Localidade</span>
          <strong>{selectedLocation || 'Localizando…'}</strong>
        </button>

        <div style={{ display: 'inline-flex', background: 'var(--line)', borderRadius: 20, padding: 3, gap: 4 }}>
          <button
            type="button"
            onClick={() => setActiveTab('baladas')}
            style={{
              background: activeTab === 'baladas' ? '#fff' : 'transparent',
              border: 0,
              borderRadius: 16,
              padding: '6px 14px',
              fontSize: 10,
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'baladas' ? 'var(--ink)' : 'var(--muted)'
            }}
          >
            Casas & Baladas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cinema')}
            style={{
              background: activeTab === 'cinema' ? '#fff' : 'transparent',
              border: 0,
              borderRadius: 16,
              padding: '6px 14px',
              fontSize: 10,
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'cinema' ? 'var(--ink)' : 'var(--muted)'
            }}
          >
            Cinema
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('teatro')}
            style={{
              background: activeTab === 'teatro' ? '#fff' : 'transparent',
              border: 0,
              borderRadius: 16,
              padding: '6px 14px',
              fontSize: 10,
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'teatro' ? 'var(--ink)' : 'var(--muted)'
            }}
          >
            Teatro
          </button>
        </div>
      </div>

      {activeTab === 'baladas' && (
        <div className="club-grid">
          {clubs.map((club, idx) => (
            <div key={idx} className="club-card">
              <header>
                <span>0{idx + 1}</span>
                <i>Checado</i>
              </header>
              <h3>{club.name}</h3>
              <p className="club-address">
                <b>{club.address}</b>
                {club.city} · {club.state}
              </p>
              <div className="event-list" style={{ margin: '14px 0 0', flex: 1 }}>
                <div>
                  <time>PROGRAMAÇÃO</time>
                  <strong>{club.programming}</strong>
                </div>
              </div>
              <a
                href={club.instagram ? `https://instagram.com/${club.instagram.replace('@', '')}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="club-card-cta"
              >
                <span>{club.instagram || 'Ver agenda'}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true" width="12" height="12">
                  <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"></path>
                </svg>
              </a>
            </div>
          ))}

          <div className="club-card club-callout">
            <span className="eyebrow">Rede colaborativa</span>
            <h3>Sua cidade tem espaço seguro?</h3>
            <p>
              Indique uma casa, coletivo ou evento que acolhe a comunidade LGBT+ com respeito e responsabilidade.
            </p>
            <strong>Envie uma indicação ✦</strong>
          </div>
        </div>
      )}

      {activeTab === 'cinema' && (
        <div className="club-grid">
          {cultureGuides.cinema.map((item, idx) => (
            <div key={idx} className="club-card">
              <header>
                <span>0{idx + 1}</span>
                <i>Cinema</i>
              </header>
              <h3>{item.title}</h3>
              <p className="club-address">
                <b>{item.venue}</b>
                {item.city}
              </p>
              <p style={{ fontSize: 9, color: 'var(--muted)', marginTop: 10, lineHeight: 1.5 }}>
                {item.synopsis}
              </p>
              <div className="club-card-cta" style={{ marginTop: 'auto' }}>
                <span>{item.dates}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true" width="12" height="12">
                  <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"></path>
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'teatro' && (
        <div className="club-grid">
          {cultureGuides.theatre.map((item, idx) => (
            <div key={idx} className="club-card">
              <header>
                <span>0{idx + 1}</span>
                <i>Teatro</i>
              </header>
              <h3>{item.title}</h3>
              <p className="club-address">
                <b>{item.theatre}</b>
                {item.city}
              </p>
              <p style={{ fontSize: 9, color: 'var(--muted)', marginTop: 10, lineHeight: 1.5 }}>
                {item.synopsis}
              </p>
              <div className="club-card-cta" style={{ marginTop: 'auto' }}>
                <span>{item.dates}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true" width="12" height="12">
                  <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"></path>
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
