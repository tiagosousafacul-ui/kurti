import React, { useState, useMemo } from 'react';
import { Story, Product, GlossaryTuple, Club } from '../types';
import { X, Search, ArrowRight, BookOpen, ShoppingBag, Calendar, Newspaper } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
  products: Product[];
  glossary: GlossaryTuple[];
  clubs: Club[];
  onOpenStory: (storyId: string) => void;
  onViewProduct: (product: Product) => void;
  onNavigate: (sectionId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  stories,
  products,
  glossary,
  clubs,
  onOpenStory,
  onViewProduct,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'stories' | 'products' | 'glossary' | 'places'>('all');

  const results = useMemo(() => {
    if (!isOpen || !query.trim()) return { stories: [], products: [], glossary: [], places: [] };

    const q = query.toLowerCase();

    const matchingStories = stories.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );

    const matchingProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );

    const matchingGlossary = glossary.filter(
      ([, term, def]) => term.toLowerCase().includes(q) || def.toLowerCase().includes(q)
    );

    const matchingPlaces = clubs.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
    );

    return {
      stories: matchingStories,
      products: matchingProducts,
      glossary: matchingGlossary,
      places: matchingPlaces
    };
  }, [isOpen, query, stories, products, glossary, clubs]);

  const totalResults =
    results.stories.length +
    results.products.length +
    results.glossary.length +
    results.places.length;

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-[var(--line)] max-h-[85vh] flex flex-col my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="p-5 border-b border-[var(--line)] bg-[#faf8f5]">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-[var(--muted)] absolute left-3.5" />
            <input
              type="text"
              autoFocus
              placeholder="Buscar notícias, eventos, termos do dicionário e produtos da loja..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-full border border-[var(--line)] bg-white text-sm text-[var(--ink)] placeholder-[var(--muted)] focus:outline-hidden focus:border-[#ed003f]"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 text-stone-400 hover:text-[var(--ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type filters */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-full font-bold cursor-pointer ${
                filterType === 'all' ? 'bg-[#ed003f] text-white' : 'bg-stone-100 text-[var(--muted)]'
              }`}
            >
              Todos ({totalResults})
            </button>
            <button
              onClick={() => setFilterType('stories')}
              className={`px-3 py-1 rounded-full font-bold cursor-pointer ${
                filterType === 'stories' ? 'bg-[#ed003f] text-white' : 'bg-stone-100 text-[var(--muted)]'
              }`}
            >
              Reportagens ({results.stories.length})
            </button>
            <button
              onClick={() => setFilterType('products')}
              className={`px-3 py-1 rounded-full font-bold cursor-pointer ${
                filterType === 'products' ? 'bg-[#ed003f] text-white' : 'bg-stone-100 text-[var(--muted)]'
              }`}
            >
              Loja ({results.products.length})
            </button>
            <button
              onClick={() => setFilterType('glossary')}
              className={`px-3 py-1 rounded-full font-bold cursor-pointer ${
                filterType === 'glossary' ? 'bg-[#ed003f] text-white' : 'bg-stone-100 text-[var(--muted)]'
              }`}
            >
              Dicionário ({results.glossary.length})
            </button>
          </div>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {!query.trim() ? (
            <div className="text-center py-12 text-[var(--muted)] text-sm">
              <Search className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p>Digite um termo para pesquisar em toda a plataforma Kurti.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                {['Casamento', 'Retificação de Nome', 'Kurtflix', 'Moletom', 'Belo Horizonte'].map((sug) => (
                  <button
                    key={sug}
                    onClick={() => setQuery(sug)}
                    className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-[var(--ink)] cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-12 text-[var(--muted)] text-sm">
              Nenhum resultado encontrado para "{query}".
            </div>
          ) : (
            <>
              {/* Stories */}
              {(filterType === 'all' || filterType === 'stories') && results.stories.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3 flex items-center gap-1.5">
                    <Newspaper className="w-4 h-4 text-[#ed003f]" />
                    <span>Reportagens ({results.stories.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {results.stories.slice(0, 5).map((story) => (
                      <div
                        key={story.id}
                        onClick={() => {
                          onOpenStory(story.id);
                          onClose();
                        }}
                        className="p-3 rounded-xl border border-[var(--line)] hover:border-[#ed003f] transition-all cursor-pointer flex items-center justify-between group bg-white"
                      >
                        <div>
                          <span className="text-[10px] font-bold text-[#ed003f] uppercase">
                            {story.category}
                          </span>
                          <h4 className="text-sm font-serif font-normal text-[var(--ink)] group-hover:text-[#ed003f]">
                            {story.title}
                          </h4>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[var(--muted)] group-hover:translate-x-1 transition-transform shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {(filterType === 'all' || filterType === 'products') && results.products.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-[#ed003f]" />
                    <span>Produtos da Loja ({results.products.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {results.products.slice(0, 4).map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          onViewProduct(prod);
                          onClose();
                        }}
                        className="p-3 rounded-xl border border-[var(--line)] hover:border-[#ed003f] transition-all cursor-pointer flex items-center gap-3 bg-white"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[var(--ink)] truncate">
                            {prod.name}
                          </h4>
                          <span className="text-xs text-[#ba0032] font-bold">
                            R$ {prod.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Glossary */}
              {(filterType === 'all' || filterType === 'glossary') && results.glossary.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#ed003f]" />
                    <span>Dicionário da Kurti ({results.glossary.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {results.glossary.slice(0, 4).map(([letter, term, def], idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          onNavigate('dicionario');
                          onClose();
                        }}
                        className="p-3 rounded-xl border border-[var(--line)] hover:border-[#ed003f] transition-all cursor-pointer flex gap-3 bg-white"
                      >
                        <span className="w-7 h-7 rounded-full bg-rose-50 text-[#ed003f] font-serif font-bold text-xs flex items-center justify-center shrink-0">
                          {letter}
                        </span>
                        <div>
                          <strong className="text-xs text-[var(--ink)] block">{term}</strong>
                          <p className="text-[11px] text-[var(--muted)] line-clamp-2">{def}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
