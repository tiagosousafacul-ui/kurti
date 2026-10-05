import React, { useState } from 'react';
import { Order } from '../types';
import { X, Search, PackageCheck, Truck, Clock, CheckCircle2, MapPin } from 'lucide-react';

interface OrdersModalProps {
  orders: Order[];
  onClose: () => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({ orders, onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredOrders = orders.filter((order) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(term) ||
      order.customerEmail.toLowerCase().includes(term) ||
      order.customerName.toLowerCase().includes(term) ||
      order.trackingCode.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Entregue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Entregue
          </span>
        );
      case 'Em transporte':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <Truck className="w-3.5 h-3.5" />
            Em transporte
          </span>
        );
      case 'Processando':
      case 'Confirmado':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-[var(--line)] max-h-[90vh] flex flex-col my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[#faf8f5]">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-[#ed003f]" />
            <h2 className="font-serif text-xl font-normal text-[var(--ink)]">
              Meus Pedidos & Histórico Migrado
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-200 text-[var(--muted)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-[var(--line)] bg-stone-50">
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por número do pedido (ex: KRT-1082), e-mail ou código de rastreio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-full border border-[var(--line)] bg-white text-[var(--ink)] focus:outline-hidden focus:border-[#ed003f]"
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] text-[var(--muted)] px-2">
            <span>Mostrando {filteredOrders.length} pedidos persistidos no banco de dados</span>
            <span className="text-emerald-700 font-bold">✓ Migração segura de pedidos ativa</span>
          </div>
        </div>

        {/* Orders List */}
        <div className="overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-[var(--muted)] text-sm">
              Nenhum pedido encontrado com esse termo.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="border border-[var(--line)] rounded-2xl p-5 bg-white hover:shadow-xs transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--line)]">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#ba0032] mr-3">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-[var(--muted)]">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Items */}
                <div className="py-3 space-y-2">
                  {order.items.map((item, iIdx) => (
                    <div key={iIdx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-[var(--ink)] line-clamp-1">{item.productName}</p>
                          <p className="text-[11px] text-[var(--muted)]">
                            Qtd: {item.quantity} {item.size ? `• Tam: ${item.size}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-[var(--ink)]">
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer and Tracking */}
                <div className="pt-3 border-t border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                  <div className="text-[var(--muted)]">
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#ed003f]" />
                      <span>
                        Entrega: {order.shippingAddress.city} - {order.shippingAddress.state} ({order.customerName})
                      </span>
                    </p>
                    <p className="mt-0.5">
                      Rastreio Correios: <strong className="font-mono text-[var(--ink)]">{order.trackingCode}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[var(--muted)] block">Total Pago:</span>
                    <strong className="text-base text-[#ba0032]">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
