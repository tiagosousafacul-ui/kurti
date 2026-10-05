import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ShoppingBag, Star, ShieldCheck, Truck, RotateCcw, Search, Eye, Plus, Database } from 'lucide-react';

interface StoreSectionProps {
  products: Product[];
  onAddToCart: (product: Product, size?: string) => void;
  onViewProduct: (product: Product) => void;
  onOpenOrders: () => void;
  onOpenDbStatus: () => void;
}

export const StoreSection: React.FC<StoreSectionProps> = ({
  products,
  onAddToCart,
  onViewProduct,
  onOpenOrders,
  onOpenDbStatus
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Todos', 'Vestuário', 'Acessórios', 'Colecionáveis', 'Papelaria & Livros'];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <section className="store-section my-16 p-6 sm:p-12 rounded-3xl bg-[#fcf9f5] border border-[var(--line)]" id="loja">
      {/* Header of Store */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ed003f] mb-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Loja Oficial Kurti · Produtos & Pedidos Integrados</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[var(--ink)]">
            Vestuário & Coleção Oficial
          </h2>
          <p className="text-sm text-[var(--muted)] mt-1 max-w-xl">
            Moda sustentável, pins de coleção, livros e acessórios com renda revertida para a manutenção do jornalismo independente LGBT+.
          </p>
        </div>

        {/* Quick Database and Orders Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenOrders}
            className="px-4 py-2 rounded-full border border-[var(--line)] bg-white hover:border-[#ed003f] hover:text-[#ed003f] text-xs font-bold text-[var(--ink)] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>📦</span>
            <span>Meus Pedidos</span>
          </button>

          <button
            onClick={onOpenDbStatus}
            className="px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Inspecionar estado do banco de dados migrado"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Status do BD</span>
          </button>
        </div>
      </div>

      {/* Trust Badges Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 p-4 rounded-2xl bg-white border border-[var(--line)] text-xs text-[var(--muted)]">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-[#ed003f] shrink-0" />
          <span><strong>Frete Grátis</strong> para todo Brasil em compras acima de R$ 150</span>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#ed003f] shrink-0" />
          <span><strong>Compra Segura</strong> com checkout criptografado e banco integrado</span>
        </div>
        <div className="flex items-center gap-2.5">
          <RotateCcw className="w-4 h-4 text-[#ed003f] shrink-0" />
          <span><strong>Troca sem complicação</strong> em até 30 dias após o recebimento</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#ed003f] text-white shadow-xs'
                  : 'bg-white border border-[var(--line)] text-[var(--muted)] hover:border-[#ed003f] hover:text-[#ed003f]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar na loja..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full border border-[var(--line)] bg-white text-xs text-[var(--ink)] placeholder-[var(--muted)] focus:outline-hidden focus:border-[#ed003f]"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="product-card bg-white border border-[var(--line)] rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all group"
          >
            <div className="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onViewProduct(product)}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-[#ed003f] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                  {product.badge}
                </span>
              )}
              {product.originalPrice && (
                <span className="absolute top-3 right-3 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewProduct(product);
                }}
                className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>Ver Detalhes</span>
              </button>
            </div>

            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[11px] text-[var(--muted)] font-medium uppercase tracking-wide">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-[10px] text-[var(--muted)]">({product.reviewsCount})</span>
                </div>
              </div>

              <h3
                onClick={() => onViewProduct(product)}
                className="font-serif text-lg font-normal text-[var(--ink)] line-clamp-1 group-hover:text-[#ed003f] transition-colors cursor-pointer mb-2"
                title={product.name}
              >
                {product.name}
              </h3>

              <div className="mt-auto pt-2">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xl font-bold text-[#ba0032]">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-[var(--muted)] line-through">
                      R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAddToCart(product, product.sizes?.[0])}
                    className="flex-1 cursor-pointer py-2.5 px-3 rounded-full bg-[#ed003f] hover:bg-[#ba0032] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                  <button
                    onClick={() => onViewProduct(product)}
                    className="p-2.5 rounded-full border border-[var(--line)] hover:border-[#ed003f] hover:text-[#ed003f] text-[var(--ink)] transition-colors cursor-pointer"
                    title="Ver detalhes do produto"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 text-[var(--muted)] text-sm">
          Nenhum produto encontrado para sua busca.
        </div>
      )}
    </section>
  );
};
