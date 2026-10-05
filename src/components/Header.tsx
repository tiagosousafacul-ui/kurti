import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Home,
  Music,
  Film,
  Calendar,
  Newspaper,
  Heart,
  ShoppingBag,
  BookOpen,
  Scale,
  Sparkles,
  MapPin,
  Share2,
  Shield,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Search,
  Flame,
  Radio
} from 'lucide-react';
import { CartItem, User } from '../types';
import { getCurrentCycleInfo } from '../utils/fourHourCycle';
import { useMusicPlayer } from '../context/MusicPlayerContext';

interface HeaderProps {
  onOpenLocation: () => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenContact: () => void;
  onOpenKurtiIA: () => void;
  onOpenOrders: () => void;
  onOpenDbStatus: () => void;
  onOpenAdmin: () => void;
  onOpenShare?: () => void;
  user?: User | null;
  selectedLocation: string;
  cartItems: CartItem[];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLocation,
  onOpenSearch,
  onOpenCart,
  onOpenAdmin,
  onOpenShare,
  user,
  selectedLocation,
  cartItems,
  activeSection,
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [culturaOpen, setCulturaOpen] = useState(false);
  const [kurtiPlusOpen, setKurtiPlusOpen] = useState(false);
  const { currentTrack, isPlaying, hasStartedPlayback, isMiniPlayerOpen, openMiniPlayer } = useMusicPlayer();

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      {/* Top Editorial Bar */}
      <div className="edition-bar" id="edition-bar">
        <span>
          <i></i>
          {selectedLocation || 'Identificando sua região'}
        </span>
        <p>Plantão 24h · Atualizações de 4 em 4 horas. Jornalismo LGBT+ independente em tempo real.</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifySelf: 'end' }}>
          {onOpenShare && (
            <button
              type="button"
              onClick={onOpenShare}
              style={{
                background: 'transparent',
                border: '1px solid #4a4140',
                color: '#fff',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '9px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Compartilhar Link Público do Kurti"
            >
              <Share2 className="w-3 h-3 text-[#ff8cab]" />
              Link Público
            </button>
          )}
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
            title="Ciclo editorial contínuo a cada 4 horas"
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#34d399',
                display: 'inline-block'
              }}
            />
            {getCurrentCycleInfo().editionLabel.toUpperCase()} · {getCurrentCycleInfo().formattedDate}
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className="site-header" id="main-header">
        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-button"
          aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-[#ed003f]" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        {/* Brand Logo - Centered on Mobile */}
        <button
          className="brand"
          aria-label="Kurti — página inicial"
          onClick={() => handleNavClick('inicio')}
        >
          <img
            src="/kurti-logo.png"
            alt="Kurti"
            width="619"
            height="289"
            loading="eager"
            decoding="async"
          />
        </button>

        {/* Desktop Primary Nav */}
        <nav className="primary-nav hidden lg:flex" aria-label="Navegação principal">
          <button
            className={activeSection === 'inicio' ? 'active' : ''}
            onClick={() => handleNavClick('inicio')}
          >
            Início
          </button>

          <button
            className={activeSection === 'eventos' || activeSection === 'balada' ? 'active' : ''}
            onClick={() => handleNavClick('eventos')}
          >
            Eventos
          </button>

          <div className="nav-group">
            <button onClick={() => handleNavClick('cultura')}>
              Cultura<span aria-hidden="true">⌄</span>
            </button>
            <div className="nav-popover">
              <strong>Cultura</strong>
              <button onClick={() => handleNavClick('cultura-cinema')}>
                Cinema
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h13M13 6l6 6-6 6"></path>
                </svg>
              </button>
              <button onClick={() => handleNavClick('cultura-teatro')}>
                Teatro
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h13M13 6l6 6-6 6"></path>
                </svg>
              </button>
              <button onClick={() => handleNavClick('cultura-literatura')}>
                Literatura
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h13M13 6l6 6-6 6"></path>
                </svg>
              </button>
            </div>
          </div>

          <button
            className={activeSection === 'kurtflix' ? 'active' : ''}
            onClick={() => handleNavClick('kurtflix')}
          >
            Kurtflix
          </button>

          <button
            className={activeSection === 'kurtimusic' || activeSection === 'kurti-music' ? 'active' : ''}
            onClick={() => handleNavClick('kurtimusic')}
          >
            Kurti Music
          </button>

          <button
            className={activeSection === 'espaco-delas' ? 'active' : ''}
            onClick={() => handleNavClick('espaco-delas')}
          >
            Espaço Delas
          </button>

          <button
            className={activeSection === 'noticias' ? 'active' : ''}
            onClick={() => handleNavClick('noticias')}
          >
            Notícias
          </button>

          <div className="nav-group">
            <button onClick={() => handleNavClick('kurti-mais')}>
              Kurti+<span aria-hidden="true">⌄</span>
            </button>
            <div className="nav-popover">
              <strong>Kurti+</strong>
              <button onClick={() => handleNavClick('cabelos')}>Cabelos</button>
              <button onClick={() => handleNavClick('celebridades')}>Celebridades</button>
              <button onClick={() => handleNavClick('culinaria')}>Culinária</button>
              <button onClick={() => handleNavClick('dicionario')}>Dicionário da Kurti</button>
              <button onClick={() => handleNavClick('direitos')}>Direitos LGBT</button>
              <button onClick={() => handleNavClick('esportes')}>Esportes</button>
              <button onClick={() => handleNavClick('moda')}>Moda</button>
              <button onClick={() => handleNavClick('saude')}>Saúde</button>
            </div>
          </div>

          <button className="nav-alert" onClick={() => handleNavClick('denuncie')}>
            Denuncie
          </button>

          <button
            className={activeSection === 'loja' ? 'active' : ''}
            onClick={() => handleNavClick('loja')}
          >
            Loja
          </button>

          <button
            className={activeSection === 'admin' ? 'active' : ''}
            onClick={onOpenAdmin}
            title="Administração e Login"
          >
            {user ? (user.role === 'admin' ? 'Admin' : 'Conta') : 'Admin'}
          </button>
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions">
          {hasStartedPlayback && !isMiniPlayerOpen && activeSection !== 'kurtimusic' && currentTrack && (
            <button
              type="button"
              onClick={openMiniPlayer}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#141112] hover:bg-[#ed003f] text-white rounded-full text-[11px] font-bold border border-[#ed003f]/50 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title={`Reabrir player de música: ${currentTrack.title}`}
            >
              <div className="w-4 h-4 rounded-full bg-[#ed003f] flex items-center justify-center">
                <Music className="w-2.5 h-2.5 text-white animate-pulse" />
              </div>
              <span className="max-w-[110px] truncate">{currentTrack.title}</span>
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-2.5">
                  <span className="w-0.5 bg-[#ff8cab] rounded-full h-full animate-pulse" />
                  <span className="w-0.5 bg-[#ed003f] rounded-full h-2/3 animate-pulse delay-75" />
                </div>
              )}
            </button>
          )}

          {onOpenShare && (
            <button
              className="share-header-button hidden sm:inline-flex"
              type="button"
              aria-label="Link Público do Kurti"
              onClick={onOpenShare}
              title="Copiar e compartilhar o link público do Kurti"
              style={{
                border: '1px solid var(--line)',
                background: '#fff',
                borderRadius: '20px',
                height: '39px',
                padding: '0 12px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--ink)'
              }}
            >
              <Share2 className="w-3.5 h-3.5 text-[#ed003f]" />
              <span>Link Público</span>
            </button>
          )}

          <button
            className="location-button"
            aria-label={`Localidade atual: ${selectedLocation}. Escolher outra localidade.`}
            onClick={onOpenLocation}
          >
            <span>Localidade</span>
            <strong>{selectedLocation || 'Localizando…'}</strong>
          </button>

          <button className="search-button" aria-label="Buscar no Kurti" onClick={onOpenSearch}>
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Buscar</span>
          </button>
        </div>
      </header>

      {/* =========================================================
          FAST, INTUITIVE & ELEGANT MOBILE MENU DRAWER
          ========================================================= */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed top-0 left-0 bottom-0 w-[84vw] max-w-[340px] bg-[#faf8f7] border-r border-[var(--line)] shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Top Header */}
            <div className="p-4 bg-white border-b border-[var(--line)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#ed003f] flex items-center justify-center p-1 shadow-xs">
                  <img src="/kurti-logo.png" alt="Kurti" className="w-full h-auto object-contain" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[var(--ink)] leading-none">
                    Kurti
                  </h3>
                  <span className="text-[10px] text-[var(--muted)] font-medium">
                    Revista & Cultura LGBT+
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-[#fff0f3] text-[var(--muted)] hover:text-[#ed003f] flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Fechar menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search Shortcut inside Mobile Menu */}
            <div className="p-3 bg-white border-b border-[var(--line)]">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-full py-2.5 px-3 bg-[#faf8f7] hover:bg-neutral-100 rounded-xl border border-[var(--line)] flex items-center gap-2 text-xs text-[var(--muted)] cursor-pointer transition-colors"
              >
                <Search className="w-4 h-4 text-[#ed003f]" />
                <span>Buscar notícias, clipes, eventos...</span>
              </button>
            </div>

            {/* Scrollable Navigation Items - Matches Desktop Primary Nav Exactly */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
              {/* 1. Início */}
              <button
                onClick={() => handleNavClick('inicio')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSection === 'inicio'
                    ? 'bg-[#ed003f] text-white shadow-xs'
                    : 'text-[var(--ink)] hover:bg-white hover:text-[#ed003f]'
                }`}
              >
                <span>Início</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              {/* 2. Eventos */}
              <button
                onClick={() => handleNavClick('eventos')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSection === 'eventos' || activeSection === 'balada'
                    ? 'bg-[#ed003f] text-white shadow-xs'
                    : 'text-[var(--ink)] hover:bg-white hover:text-[#ed003f]'
                }`}
              >
                <span>Eventos</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              {/* 3. Cultura (Dropdown / Accordion) */}
              <div>
                <button
                  type="button"
                  onClick={() => setCulturaOpen(!culturaOpen)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSection.startsWith('cultura')
                      ? 'bg-rose-50 text-[#ed003f]'
                      : 'text-[var(--ink)] hover:bg-white hover:text-[#ed003f]'
                  }`}
                >
                  <span>Cultura</span>
                  {culturaOpen ? (
                    <ChevronDown className="w-4 h-4 text-[#ed003f]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  )}
                </button>

                {culturaOpen && (
                  <div className="pl-4 pr-2 py-1 space-y-1 mt-1 bg-white/80 rounded-xl border border-[var(--line)]/60">
                    <button
                      onClick={() => handleNavClick('cultura-cinema')}
                      className={`w-full text-left py-2 px-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        activeSection === 'cultura-cinema'
                          ? 'text-[#ed003f] font-bold bg-rose-50'
                          : 'text-[var(--ink)] hover:text-[#ed003f]'
                      }`}
                    >
                      <span>Cinema</span>
                      <ChevronRight className="w-3 h-3 opacity-40" />
                    </button>
                    <button
                      onClick={() => handleNavClick('cultura-teatro')}
                      className={`w-full text-left py-2 px-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        activeSection === 'cultura-teatro'
                          ? 'text-[#ed003f] font-bold bg-rose-50'
                          : 'text-[var(--ink)] hover:text-[#ed003f]'
                      }`}
                    >
                      <span>Teatro</span>
                      <ChevronRight className="w-3 h-3 opacity-40" />
                    </button>
                    <button
                      onClick={() => handleNavClick('cultura-literatura')}
                      className={`w-full text-left py-2 px-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        activeSection === 'cultura-literatura'
                          ? 'text-[#ed003f] font-bold bg-rose-50'
                          : 'text-[var(--ink)] hover:text-[#ed003f]'
                      }`}
                    >
                      <span>Literatura</span>
                      <ChevronRight className="w-3 h-3 opacity-40" />
                    </button>
                  </div>
                )}
              </div>

              {/* 4. Kurtflix */}
              <button
                onClick={() => handleNavClick('kurtflix')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSection === 'kurtflix'
                    ? 'bg-[#ed003f] text-white shadow-xs'
                    : 'text-[var(--ink)] hover:bg-white hover:text-[#ed003f]'
                }`}
              >
                <span>Kurtflix</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              {/* 5. Kurti Music */}
              <button
                onClick={() => handleNavClick('kurtimusic')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSection === 'kurtimusic' || activeSection === 'kurti-music'
                    ? 'bg-[#ed003f] text-white shadow-xs'
                    : 'text-[var(--ink)] hover:bg-white hover:text-[#ed003f]'
                }`}
              >
                <span>Kurti Music</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              {/* 6. Espaço Delas */}
              <button
                onClick={() => handleNavClick('espaco-delas')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSection === 'espaco-delas'
                    ? 'bg-[#ed003f] text-white shadow-xs'
                    : 'text-[var(--ink)] hover:bg-white hover:text-[#ed003f]'
                }`}
              >
                <span>Espaço Delas</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              {/* 7. Notícias */}
              <button
                onClick={() => handleNavClick('noticias')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSection === 'noticias'
                    ? 'bg-[#ed003f] text-white shadow-xs'
                    : 'text-[var(--ink)] hover:bg-white hover:text-[#ed003f]'
                }`}
              >
                <span>Notícias</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              {/* 8. Kurti+ (Dropdown / Accordion) */}
              <div>
                <button
                  type="button"
                  onClick={() => setKurtiPlusOpen(!kurtiPlusOpen)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSection.startsWith('kurti-mais') ||
                    ['cabelos', 'celebridades', 'culinaria', 'dicionario', 'direitos', 'esportes', 'moda', 'saude'].includes(activeSection)
                      ? 'bg-rose-50 text-[#ed003f]'
                      : 'text-[var(--ink)] hover:bg-white hover:text-[#ed003f]'
                  }`}
                >
                  <span>Kurti+</span>
                  {kurtiPlusOpen ? (
                    <ChevronDown className="w-4 h-4 text-[#ed003f]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  )}
                </button>

                {kurtiPlusOpen && (
                  <div className="pl-4 pr-2 py-1 space-y-1 mt-1 bg-white/80 rounded-xl border border-[var(--line)]/60">
                    <button
                      onClick={() => handleNavClick('cabelos')}
                      className={`w-full text-left py-2 px-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        activeSection === 'cabelos' ? 'text-[#ed003f] font-bold bg-rose-50' : 'text-[var(--ink)] hover:text-[#ed003f]'
                      }`}
                    >
                      <span>Cabelos</span>
                      <ChevronRight className="w-3 h-3 opacity-40" />
                    </button>
                    <button
                      onClick={() => handleNavClick('celebridades')}
                      className={`w-full text-left py-2 px-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        activeSection === 'celebridades' ? 'text-[#ed003f] font-bold bg-rose-50' : 'text-[var(--ink)] hover:text-[#ed003f]'
                      }`}
                    >
                      <span>Celebridades</span>
                      <ChevronRight className="w-3 h-3 opacity-40" />
                    </button>
                    <button
                      onClick={() => handleNavClick('culinaria')}
                      className={`w-full text-left py-2 px-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        activeSection === 'culinaria' ? 'text-[#ed003f] font-bold bg-rose-50' : 'text-[var(--ink)] hover:text-[#ed003f]'
                      }`}
                    >
                      <span>Culinária</span>
                      <ChevronRight className="w-3 h-3 opacity-40" />
                    </button>
                    <button
                      onClick={() => handleNavClick('dicionario')}
                      className={`w-full text-left py-2 px-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        activeSection === 'dicionario' ? 'text-[#ed003f] font-bold bg-rose-50' : 'text-[var(--ink)] hover:text-[#ed003f]'
                      }`}
                    >
                      <span>Dicionário da Kurti</span>
                      <ChevronRight className="w-3 h-3 opacity-40" />
                    </button>
                    <button
                      onClick={() => handleNavClick('direitos')}
                      className={`w-full text-left py-2 px-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        activeSection === 'direitos' ? 'text-[#ed003f] font-bold bg-rose-50' : 'text-[var(--ink)] hover:text-[#ed003f]'
                      }`}
                    >
                      <span>Direitos LGBT</span>
                      <ChevronRight className="w-3 h-3 opacity-40" />
                    </button>
                    <button
                      onClick={() => handleNavClick('esportes')}
                      className={`w-full text-left py-2 px-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        activeSection === 'esportes' ? 'text-[#ed003f] font-bold bg-rose-50' : 'text-[var(--ink)] hover:text-[#ed003f]'
                      }`}
                    >
                      <span>Esportes</span>
                      <ChevronRight className="w-3 h-3 opacity-40" />
                    </button>
                    <button
                      onClick={() => handleNavClick('moda')}
                      className={`w-full text-left py-2 px-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        activeSection === 'moda' ? 'text-[#ed003f] font-bold bg-rose-50' : 'text-[var(--ink)] hover:text-[#ed003f]'
                      }`}
                    >
                      <span>Moda</span>
                      <ChevronRight className="w-3 h-3 opacity-40" />
                    </button>
                    <button
                      onClick={() => handleNavClick('saude')}
                      className={`w-full text-left py-2 px-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        activeSection === 'saude' ? 'text-[#ed003f] font-bold bg-rose-50' : 'text-[var(--ink)] hover:text-[#ed003f]'
                      }`}
                    >
                      <span>Saúde</span>
                      <ChevronRight className="w-3 h-3 opacity-40" />
                    </button>
                  </div>
                )}
              </div>

              {/* 9. Denuncie */}
              <button
                onClick={() => handleNavClick('denuncie')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSection === 'denuncie'
                    ? 'bg-[#ed003f] text-white shadow-xs'
                    : 'bg-[#fff0f3] text-[#ed003f] hover:bg-[#ed003f] hover:text-white border border-[#f0c8d2]'
                }`}
              >
                <span>Denuncie</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* 10. Loja */}
              <button
                onClick={() => handleNavClick('loja')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSection === 'loja'
                    ? 'bg-[#ed003f] text-white shadow-xs'
                    : 'text-[var(--ink)] hover:bg-white hover:text-[#ed003f]'
                }`}
              >
                <span>Loja</span>
                {totalCartCount > 0 ? (
                  <span className="text-[10px] font-bold bg-[#ed003f] text-white px-2 py-0.5 rounded-full">
                    {totalCartCount}
                  </span>
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                )}
              </button>

              {/* 11. Admin / Conta */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSection === 'admin'
                    ? 'bg-[#ed003f] text-white shadow-xs'
                    : 'text-[var(--ink)] hover:bg-white hover:text-[#ed003f]'
                }`}
              >
                <span>{user ? (user.role === 'admin' ? 'Admin' : 'Conta') : 'Admin'}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              {/* Music Player Reopen Button in Mobile Drawer */}
              {hasStartedPlayback && currentTrack && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openMiniPlayer();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#141112] text-white hover:bg-[#ed003f] transition-colors cursor-pointer border border-[#ff2b66]/50 shadow-xs"
                  >
                    <span className="flex items-center gap-2 truncate min-w-0">
                      <Music className="w-4 h-4 text-[#ff2b66] shrink-0 animate-pulse" />
                      <span className="truncate">{isPlaying ? 'Tocando:' : 'Música:'} {currentTrack.title}</span>
                    </span>
                    <span className="text-[10px] text-[#ff8cab] font-bold shrink-0 ml-2">Abrir Player</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar in Mobile Menu */}
            <div className="p-3 bg-white border-t border-[var(--line)] space-y-2">
              <div className="flex items-center gap-2">
                {/* Location Quick Button */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLocation();
                  }}
                  className="flex-1 py-2 px-2.5 bg-[#faf8f7] hover:bg-neutral-100 rounded-xl border border-[var(--line)] text-left flex items-center gap-2 text-xs cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#ed003f] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] text-[var(--muted)] block leading-none">Região</span>
                    <strong className="text-xs text-[var(--ink)] truncate block">
                      {selectedLocation || 'Brasil'}
                    </strong>
                  </div>
                </button>

                {/* Share Quick Button */}
                {onOpenShare && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenShare();
                    }}
                    className="p-2.5 bg-[#faf8f7] hover:bg-neutral-100 rounded-xl border border-[var(--line)] text-[var(--ink)] cursor-pointer"
                    title="Compartilhar Link Público"
                  >
                    <Share2 className="w-4 h-4 text-[#ed003f]" />
                  </button>
                )}
              </div>

              {/* Admin / Login */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2 px-3 text-xs font-bold text-[var(--muted)] hover:text-[var(--ink)] rounded-xl hover:bg-[#faf8f7] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-[#ed003f]" />
                <span>{user ? (user.role === 'admin' ? 'Painel Admin' : 'Minha Conta') : 'Acessar Conta / Admin'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
