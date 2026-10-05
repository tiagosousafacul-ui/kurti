import React, { useState } from 'react';
import { Product } from '../types';
import { X, Star, ShieldCheck, Truck, Plus, Minus, ShoppingBag, Check } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string, quantity?: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes?.[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-[var(--line)] max-h-[90vh] flex flex-col my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-xs text-[var(--muted)] hover:text-[var(--ink)] shadow-xs transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden aspect-square bg-stone-100 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-[#ed003f] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-[#ba0032] tracking-wider">
                  {product.category}
                </span>
                <h2 className="text-2xl font-serif font-normal text-[var(--ink)] mt-1 mb-2">
                  {product.name}
                </h2>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[var(--muted)] font-bold">
                    {product.rating.toFixed(1)} ({product.reviewsCount} avaliações)
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-[#ba0032]">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-[var(--muted)] line-through">
                      R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[var(--muted)] leading-relaxed mb-4">
                  {product.description}
                </p>

                {/* Size Selector if clothing */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-4">
                    <label className="text-xs font-bold text-[var(--ink)] block mb-1.5">
                      Tamanho: <span className="text-[#ed003f]">{selectedSize}</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {product.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            selectedSize === sz
                              ? 'bg-[#ed003f] text-white'
                              : 'bg-stone-100 text-[var(--ink)] hover:bg-stone-200'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <label className="text-xs font-bold text-[var(--ink)] block mb-1.5">
                    Quantidade:
                  </label>
                  <div className="inline-flex items-center border border-[var(--line)] rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-stone-100 text-[var(--ink)]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold text-[var(--ink)]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-stone-100 text-[var(--ink)]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={handleAdd}
                disabled={added}
                className={`w-full py-3.5 px-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#ed003f] hover:bg-[#ba0032] text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Adicionado com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Adicionar à Sacola • R$ {(product.price * quantity).toFixed(2).replace('.', ',')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Details list */}
          <div className="mt-8 pt-6 border-t border-[var(--line)]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-3">
              Especificações e Sustentabilidade
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--muted)]">
              {product.details.map((detail, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
