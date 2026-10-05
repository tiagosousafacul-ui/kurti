import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, size?: string) => void;
  onRemoveItem: (productId: string, size?: string) => void;
  onOrderCreated: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onOrderCreated
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Checkout Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Cartão de Crédito' | 'Boleto Bancário'>('PIX');

  if (!isOpen) return null;

  const rawSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = rawSubtotal * (discountPercent / 100);
  const subtotal = rawSubtotal - discountAmount;
  const shipping = subtotal > 150 || cartItems.length === 0 ? 0 : 15.0;
  const total = Math.round((subtotal + shipping) * 100) / 100;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'ORGULHO10' || couponCode.trim().toUpperCase() === 'KURTI') {
      setDiscountPercent(10);
      setCouponApplied(true);
    } else {
      alert('Cupom inválido. Experimente usar: ORGULHO10');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !cep) {
      alert('Por favor, preencha os campos obrigatórios (Nome, E-mail e CEP).');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerName: name,
        customerEmail: email,
        customerPhone: phone || '(11) 98765-4321',
        shippingAddress: {
          street: street || 'Avenida Paulista',
          number: number || '1578',
          neighborhood: neighborhood || 'Bela Vista',
          city: city || 'São Paulo',
          state: state || 'SP',
          cep: cep
        },
        items: cartItems,
        paymentMethod
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCreatedOrder(data.order);
        onOrderCreated(data.order);
        setStep('success');
      } else {
        throw new Error(data.error || 'Erro ao processar pedido.');
      }
    } catch (err: any) {
      alert(`Falha ao registrar pedido: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[#faf8f5]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#ed003f]" />
            <h2 className="font-serif text-lg font-normal text-[var(--ink)]">
              {step === 'cart' && `Sacola (${cartItems.length})`}
              {step === 'checkout' && 'Finalizar Compra Segura'}
              {step === 'success' && 'Pedido Confirmado!'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-stone-200 text-[var(--muted)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {step === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="text-center py-16 text-[var(--muted)] flex flex-col items-center">
                  <ShoppingBag className="w-12 h-12 text-stone-300 mb-3" />
                  <p className="font-serif text-lg text-[var(--ink)] mb-1">Sua sacola está vazia</p>
                  <p className="text-xs max-w-xs mb-6">
                    Aproveite para garantir camisetas, moletons, livros e pins da coleção oficial Kurti.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-full bg-[#ed003f] text-white font-bold text-xs uppercase tracking-wider"
                  >
                    Ver Produtos na Loja
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, idx) => (
                    <div
                      key={`${item.productId}-${item.size || ''}-${idx}`}
                      className="flex gap-3 p-3 rounded-xl border border-[var(--line)] bg-stone-50/50"
                    >
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-16 h-16 rounded-lg object-cover bg-white shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-bold text-[var(--ink)] line-clamp-1">
                            {item.productName}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.productId, item.size)}
                            className="text-stone-400 hover:text-red-600 p-1"
                            title="Remover item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.size && (
                          <span className="text-[11px] text-[var(--muted)]">Tamanho: {item.size}</span>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-bold text-[#ba0032]">
                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                          </span>
                          <div className="flex items-center border border-[var(--line)] rounded-md bg-white">
                            <button
                              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1, item.size)}
                              className="p-1 hover:bg-stone-100"
                            >
                              <Minus className="w-3 h-3 text-[var(--ink)]" />
                            </button>
                            <span className="px-2 text-xs font-bold">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1, item.size)}
                              className="p-1 hover:bg-stone-100"
                            >
                              <Plus className="w-3 h-3 text-[var(--ink)]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Coupon input */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Cupom (ex: ORGULHO10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-[var(--line)] rounded-lg uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-xs font-bold rounded-lg text-[var(--ink)]"
                    >
                      Aplicar
                    </button>
                  </form>
                  {couponApplied && (
                    <p className="text-xs text-emerald-600 font-bold">
                      ✓ Cupom aplicado: 10% de desconto!
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
                1. Dados de Contato e Entrega
              </h3>
              <div>
                <label className="text-xs font-bold block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Maria Clara Santos"
                  className="w-full px-3 py-2 text-xs border border-[var(--line)] rounded-lg focus:outline-hidden focus:border-[#ed003f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold block mb-1">E-mail *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full px-3 py-2 text-xs border border-[var(--line)] rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 text-xs border border-[var(--line)] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold block mb-1">CEP *</label>
                  <input
                    type="text"
                    required
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="01310-100"
                    className="w-full px-3 py-2 text-xs border border-[var(--line)] rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold block mb-1">Logradouro</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Rua / Avenida"
                    className="w-full px-3 py-2 text-xs border border-[var(--line)] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold block mb-1">Número</label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="123"
                    className="w-full px-3 py-2 text-xs border border-[var(--line)] rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Cidade</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Cidade"
                    className="w-full px-3 py-2 text-xs border border-[var(--line)] rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">UF</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-2 py-2 text-xs border border-[var(--line)] rounded-lg bg-white"
                  >
                    {['SP', 'RJ', 'MG', 'BA', 'RS', 'PR', 'PE', 'CE', 'DF', 'SC', 'GO'].map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] pt-3 mb-2">
                2. Forma de Pagamento
              </h3>

              <div className="grid grid-cols-3 gap-2">
                {(['PIX', 'Cartão de Crédito', 'Boleto Bancário'] as const).map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-1 text-center rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                      paymentMethod === method
                        ? 'border-[#ed003f] bg-rose-50 text-[#ba0032]'
                        : 'border-[var(--line)] hover:bg-stone-50 text-[var(--ink)]'
                    }`}
                  >
                    {method === 'PIX' && '⚡ '}
                    {method}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-stone-50 border border-[var(--line)] rounded-xl text-xs text-[var(--muted)] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dados protegidos por criptografia de ponta a ponta e integrados ao banco de dados oficial Kurti.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-[#ed003f] hover:bg-[#ba0032] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md mt-4 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Processando e Gravando Pedido...' : `Confirmar Pedido • R$ ${total.toFixed(2).replace('.', ',')}`}
              </button>

              <button
                type="button"
                onClick={() => setStep('cart')}
                className="w-full py-2 text-xs text-[var(--muted)] hover:text-[var(--ink)]"
              >
                ← Voltar para Sacola
              </button>
            </form>
          )}

          {step === 'success' && createdOrder && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-serif font-normal text-[var(--ink)] mb-1">
                Pedido Criado com Sucesso!
              </h3>
              <p className="text-xs text-[var(--muted)] mb-4">
                Seu pedido foi registrado no banco de dados e as informações foram despachadas para seu e-mail.
              </p>

              <div className="p-4 rounded-xl bg-stone-50 border border-[var(--line)] text-left mb-6 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Número do Pedido:</span>
                  <strong className="font-mono text-[#ed003f]">{createdOrder.orderNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Código de Rastreio:</span>
                  <strong className="font-mono">{createdOrder.trackingCode}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Total Pago:</span>
                  <strong>R$ {createdOrder.total.toFixed(2).replace('.', ',')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Forma de Pagamento:</span>
                  <span>{createdOrder.paymentMethod}</span>
                </div>
              </div>

              {createdOrder.paymentMethod === 'PIX' && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 mb-6 text-center">
                  <QrCode className="w-24 h-24 mx-auto text-emerald-800 mb-2" />
                  <p className="text-xs font-bold text-emerald-900 mb-1">
                    Código PIX Copia e Cola Gerado
                  </p>
                  <p className="text-[10px] text-emerald-700 font-mono break-all bg-white p-2 rounded border border-emerald-200">
                    00020126580014br.gov.bcb.pix0136krt-{createdOrder.id}5204000053039865802BR
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  setStep('cart');
                  onClose();
                }}
                className="w-full py-3 rounded-full bg-[var(--ink)] hover:bg-black text-white text-xs font-bold uppercase tracking-wider"
              >
                Concluir e Fechar
              </button>
            </div>
          )}
        </div>

        {/* Footer Summary for 'cart' step */}
        {step === 'cart' && cartItems.length > 0 && (
          <div className="p-6 border-t border-[var(--line)] bg-[#faf8f5]">
            <div className="space-y-1.5 text-xs text-[var(--muted)] mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {rawSubtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Desconto ({discountPercent}%):</span>
                  <span>- R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Frete:</span>
                <span>{shipping === 0 ? <strong className="text-emerald-600 font-bold">GRÁTIS</strong> : `R$ ${shipping.toFixed(2).replace('.', ',')}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[var(--ink)] pt-2 border-t border-[var(--line)]">
                <span>Total:</span>
                <span className="text-[#ba0032]">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <button
              onClick={() => setStep('checkout')}
              className="w-full py-3.5 rounded-full bg-[#ed003f] hover:bg-[#ba0032] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>Fechar Pedido</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
