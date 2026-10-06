import React, { useState, useEffect, useCallback, useMemo } from 'react';
import rawData from './data/kurtiData.json';
import { INITIAL_PRODUCTS, MIGRATED_ORDERS } from './data/storeData';
import {
  Story,
  FullArticle,
  Product,
  Order,
  CartItem,
  Film,
  Club,
  CultureGuides,
  MusicItem,
  WomenSpaceItem,
  GlossaryTuple,
  RightsItem,
  BrazilState
} from './types';

// Components
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { Ticker, AppInstallCard } from './components/Ticker';
import { LatestStories } from './components/LatestStories';
import { EventsSection } from './components/EventsSection';
import { CultureSection } from './components/CultureSection';
import { KurtflixSection } from './components/KurtflixSection';
import { KurtiMusicSection, WomenSection } from './components/KurtiMusicSection';
import { KurtiPlusSection } from './components/KurtiPlusSection';
import { GlossarySection } from './components/GlossarySection';
import { RightsSection } from './components/RightsSection';
import { HelpSection } from './components/HelpSection';
import { KurtiIASection } from './components/KurtiIASection';
import { StoreSection } from './components/StoreSection';
import { ArticleModal } from './components/ArticleModal';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { OrdersModal } from './components/OrdersModal';
import { ContactModal } from './components/ContactModal';
import { KurtiIAModal } from './components/KurtiIAModal';
import { DatabaseMigrationModal } from './components/DatabaseMigrationModal';
import { FilmModal } from './components/FilmModal';
import { LocationModal } from './components/LocationModal';
import { SearchModal } from './components/SearchModal';
import { AdminModal } from './components/AdminModal';
import { ShareModal } from './components/ShareModal';
import { Footer } from './components/Footer';
import { AnalyticsConsent } from './components/AnalyticsConsent';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { MiniPlayer } from './components/MiniPlayer';
import { FullPlayerOverlay } from './components/FullPlayerOverlay';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import { useAuth } from './hooks/useAuth';
import { apply4HourCycleToStories } from './utils/fourHourCycle';

function MainApp() {
  const { user } = useAuth();
  // Extracted datasets with 4-hour continuous update cycle applied
  const rawStories = rawData.stories as unknown as Story[];
  const [liveNews, setLiveNews] = useState<Story[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/news-updates.json', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setLiveNews(data as Story[]);
      })
      .catch(() => {
        // Keep the embedded news when the live feed is unavailable.
      });
    return () => { cancelled = true; };
  }, []);

  const stories = useMemo(() => {
    const fallbackNonNews = rawStories.filter((story) => story.sectionId !== 'noticias');
    const source = liveNews.length > 0 ? [...liveNews, ...fallbackNonNews] : rawStories;
    return apply4HourCycleToStories(source);
  }, [rawStories, liveNews]);
  const fullArticles = rawData.fullArticles as unknown as Record<string, FullArticle>;
  const clubs = rawData.clubs as unknown as Club[];
  const cultureGuides = rawData.cultureGuides as unknown as CultureGuides;
  const films = rawData.films as unknown as Film[];
  const music = rawData.music as unknown as MusicItem[];
  const womenSpace = rawData.womenSpace as unknown as WomenSpaceItem[];
  const glossary = rawData.glossary as unknown as GlossaryTuple[];
  const rights = rawData.rights as unknown as RightsItem[];
  const brazilStates = rawData.brazilStates as unknown as BrazilState[];

  // Dynamic store and orders state (loaded from API with fallbacks)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MIGRATED_ORDERS);

  // Cart state persisted to localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kurti-cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kurti-cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Location state persisted to localStorage
  const [selectedLocation, setSelectedLocation] = useState<string>(() => {
    try {
      return localStorage.getItem('kurti-location') || 'Belo Horizonte · MG';
    } catch {
      return 'Belo Horizonte · MG';
    }
  });

  const handleSelectLocation = (loc: string) => {
    setSelectedLocation(loc);
    try {
      localStorage.setItem('kurti-location', loc);
    } catch {
      // ignore
    }
  };

  // Modals & Navigation state
  const [activeSection, setActiveSection] = useState<string>('inicio');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isKurtiIAOpen, setIsKurtiIAOpen] = useState(false);
  const [isDbStatusOpen, setIsDbStatusOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Fetch live products and orders from server API on boot
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setProducts(data);
      } catch {
        // Uses INITIAL_PRODUCTS as an offline-safe fallback.
      }
    };

    const loadOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setOrders(data);
      } catch {
        // Uses MIGRATED_ORDERS as an offline-safe fallback.
      }
    };

    void loadProducts();
    void loadOrders();
  }, []);

  // Read URL query parameters for direct links (e.g. ?open=cart, ?section=loja)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const openParam = params.get('open');
      const sectionParam = params.get('section');
      const ufParam = params.get('uf');

      if (openParam === 'cart') {
        setIsCartOpen(true);
      } else if (openParam === 'pedidos') {
        setIsOrdersOpen(true);
      } else if (openParam === 'contato') {
        setIsContactOpen(true);
      } else if (openParam === 'kurti-ia') {
        setIsKurtiIAOpen(true);
      } else if (openParam === 'location') {
        setIsLocationOpen(true);
      } else if (openParam === 'admin') {
        setIsAdminOpen(true);
      } else if (openParam === 'share' || openParam === 'link') {
        setIsShareOpen(true);
      }

      if (sectionParam) {
        handleNavigate(sectionParam);
      }

      if (ufParam) {
        const matching = brazilStates.find((s) => s.uf.toLowerCase() === ufParam.toLowerCase());
        if (matching) {
          handleSelectLocation(`${matching.capital} · ${matching.uf}`);
        }
      }
    } catch {
      // ignore
    }

    // Safe background location check if not previously chosen
    const hasSavedLoc = localStorage.getItem('kurti-location');
    if (!hasSavedLoc) {
      fetch('/api/location', { signal: AbortSignal.timeout(2500) })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.location) {
            setSelectedLocation(data.location);
            localStorage.setItem('kurti-location', data.location);
          }
        })
        .catch(() => {
          // Defaults to Belo Horizonte · MG
        });
    }
  }, []);

  // Story click handler
  const handleOpenStory = useCallback((storyId: string) => {
    const story = stories.find((s) => s.id === storyId);
    if (story) {
      setSelectedStory(story);
    }
  }, [stories]);

  // Cart operations
  const handleAddToCart = (product: Product, size?: string, quantity: number = 1) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.productId === product.id && item.size === size
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity,
          size,
          image: product.image
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId, size);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string, size?: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.size === size))
    );
  };

  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
  };

  // Smooth navigation handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Header */}
      <Header
        onOpenLocation={() => setIsLocationOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenKurtiIA={() => setIsKurtiIAOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenDbStatus={() => setIsDbStatusOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        user={user}
        selectedLocation={selectedLocation}
        cartItems={cartItems}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Content Container matching original layout */}
      <main id="conteudo">
        {/* HOMEPAGE VIEW: exact order of kurti-lgbt */}
        {activeSection === 'inicio' && (
          <>
            <HeroSection stories={stories} onOpenStory={handleOpenStory} />
            <Ticker />
            <AppInstallCard onOpenStore={() => handleNavigate('loja')} />
            <LatestStories stories={stories} onOpenStory={handleOpenStory} />
          </>
        )}

        {/* EVENTOS / BALADA VIEW */}
        {(activeSection === 'eventos' || activeSection === 'balada') && (
          <EventsSection
            clubs={clubs}
            cultureGuides={cultureGuides}
            selectedLocation={selectedLocation}
            onOpenLocation={() => setIsLocationOpen(true)}
          />
        )}

        {/* CULTURA CHANNELS VIEW */}
        {activeSection.startsWith('cultura') && (
          <CultureSection
            subArea={activeSection === 'cultura' ? undefined : activeSection.replace('cultura-', '')}
            onSelectArea={handleNavigate}
          />
        )}

        {/* KURTFLIX AUDIVISUAL VIEW */}
        {activeSection === 'kurtflix' && (
          <KurtflixSection films={films} onOpenFilm={(f) => setSelectedFilm(f)} />
        )}

        {/* KURTIMUSIC VIEW */}
        {(activeSection === 'kurtimusic' || activeSection === 'kurti-music') && (
          <KurtiMusicSection
            onOpenArticle={handleOpenStory}
            musicItems={music}
          />
        )}

        {/* ESPAÇO DELAS VIEW */}
        {activeSection === 'espaco-delas' && (
          <WomenSection womenItems={womenSpace} onOpenArticle={handleOpenStory} />
        )}

        {/* NOTÍCIAS / ARQUIVO VIEW */}
        {activeSection === 'noticias' && (
          <LatestStories stories={stories} onOpenStory={handleOpenStory} isArchive={true} />
        )}

        {/* KURTI+ CHANNELS VIEW */}
        {activeSection === 'kurti-mais' && (
          <KurtiPlusSection onSelectCategory={handleNavigate} />
        )}

        {/* KURTI+ SUB-EDITORIAL FILTER VIEWS */}
        {['cabelos', 'celebridades', 'culinaria', 'esportes', 'moda', 'saude'].includes(activeSection) && (
          <LatestStories
            stories={stories.filter((s) => s.category.toLowerCase().includes(activeSection))}
            onOpenStory={handleOpenStory}
            isArchive={true}
          />
        )}

        {/* DICIONÁRIO DA KURTI VIEW */}
        {activeSection === 'dicionario' && (
          <GlossarySection glossary={glossary} />
        )}

        {/* DIREITOS LGBT VIEW */}
        {activeSection === 'direitos' && (
          <RightsSection rights={rights} />
        )}

        {/* DENUNCIE VIEW */}
        {activeSection === 'denuncie' && (
          <HelpSection onOpenContact={() => setIsContactOpen(true)} />
        )}

        {/* LOJA OFICIAL KURTI VIEW */}
        {activeSection === 'loja' && (
          <StoreSection
            products={products}
            onAddToCart={(p, sz) => handleAddToCart(p, sz, 1)}
            onViewProduct={(p) => setSelectedProduct(p)}
            onOpenOrders={() => setIsOrdersOpen(true)}
            onOpenDbStatus={() => setIsDbStatusOpen(true)}
          />
        )}

        {/* KURTI IA VIEW */}
        {activeSection === 'kurti-ia' && (
          <KurtiIASection onOpenModal={() => setIsKurtiIAOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenDbStatus={() => setIsDbStatusOpen(true)}
        onOpenKurtiIA={() => setIsKurtiIAOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenKurtiIA={() => setIsKurtiIAOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        user={user}
        cartItems={cartItems}
      />

      {/* Persistent Mini Player at bottom of site */}
      <MiniPlayer
        activeSection={activeSection}
        onNavigateToMusic={() => handleNavigate('kurtimusic')}
      />

      {/* Immersive Full Page Player & Lyrics Overlay */}
      <FullPlayerOverlay onNavigateToMusic={() => handleNavigate('kurtimusic')} />

      {/* Cookies & Analytics Consent */}
      <AnalyticsConsent />

      {/* MODALS */}
      {/* 1. Article Reader Modal */}
      {selectedStory && (
        <ArticleModal
          story={selectedStory}
          fullArticle={fullArticles[selectedStory.id]}
          onClose={() => setSelectedStory(null)}
        />
      )}

      {/* 2. Product Details Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* 3. Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onOrderCreated={handleOrderCreated}
      />

      {/* 4. Orders History Modal */}
      {isOrdersOpen && (
        <OrdersModal
          orders={orders}
          onClose={() => setIsOrdersOpen(false)}
        />
      )}

      {/* 5. Contact / Email Dispatcher Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* 6. Kurti IA Assistant Modal */}
      <KurtiIAModal
        isOpen={isKurtiIAOpen}
        onClose={() => setIsKurtiIAOpen(false)}
      />

      {/* 7. Database Migration & Integrity Modal */}
      <DatabaseMigrationModal
        isOpen={isDbStatusOpen}
        onClose={() => setIsDbStatusOpen(false)}
        onOpenOrders={() => {
          setIsDbStatusOpen(false);
          setIsOrdersOpen(true);
        }}
      />

      {/* 8. Kurtflix Film Player Modal */}
      {selectedFilm && (
        <FilmModal
          film={selectedFilm}
          onClose={() => setSelectedFilm(null)}
        />
      )}

      {/* 9. Location Picker Modal */}
      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        states={brazilStates}
        selectedLocation={selectedLocation}
        onSelectLocation={handleSelectLocation}
      />

      {/* 10. Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        stories={stories}
        products={products}
        glossary={glossary}
        clubs={clubs}
        onOpenStory={handleOpenStory}
        onViewProduct={(p) => {
          setIsSearchOpen(false);
          setSelectedProduct(p);
        }}
        onNavigate={handleNavigate}
      />

      {/* 11. Administration & User Management Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        orders={orders}
        onUpdateProducts={setProducts}
        onUpdateOrders={setOrders}
      />

      {/* 12. Public Link & Social Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        activeSection={activeSection}
      />

      {/* 13. Offline Connectivity Indicator */}
      <OfflineIndicator />
    </>
  );
}

export default function App() {
  return (
    <MusicPlayerProvider>
      <MainApp />
    </MusicPlayerProvider>
  );
}
