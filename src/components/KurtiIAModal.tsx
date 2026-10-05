import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, ShieldCheck } from 'lucide-react';

interface KurtiIAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const KurtiIAModal: React.FC<KurtiIAModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Olá! Eu sou o Kurti IA, seu guia inteligente em direitos LGBT+, cultura queer, agendas locais e acolhimento. Como posso te ajudar hoje?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    'Como funciona a retificação de nome e gênero em cartório?',
    'Quais os direitos garantidos pelo casamento civil homoafetivo?',
    'Como registrar denúncia de homofobia no Disque 100?',
    'O que significa o termo cisgênero e interseccionalidade?'
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || input;
    if (!prompt.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/kurti-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || 'Desculpe, ocorreu uma instabilidade temporária.' }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'A rede de direitos LGBT+ no Brasil conta com decisões vinculantes do STF: casamento civil (ADI 4277), criminalização da homotransfobia (ADO 26) e retificação extrajudicial de nome (ADI 4275). Em caso de violações, ligue para o Disque 100.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-[var(--line)] max-h-[85vh] flex flex-col my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[#faf8f5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-normal text-[var(--ink)]">
                Kurti IA • Assistente Oficial
              </h2>
              <p className="text-[11px] text-[var(--muted)]">
                Orientação em direitos, termos e cultura com respaldo jurídico
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-200 text-[var(--muted)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-rose-100 text-[#ed003f] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#ed003f] text-white rounded-br-none'
                    : 'bg-stone-100 text-[var(--ink)] rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[var(--muted)] pl-11">
              <div className="w-2 h-2 rounded-full bg-[#ed003f] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#ed003f] animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-[#ed003f] animate-bounce [animation-delay:0.4s]" />
              <span>Kurti IA consultando bases jurídicas e culturais...</span>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="px-6 py-2 border-t border-[var(--line)] bg-[#faf8f5] flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <span className="text-[10px] uppercase font-bold text-[var(--muted)] shrink-0">
            Sugestões:
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1 rounded-full bg-white border border-[var(--line)] hover:border-[#ed003f] text-[11px] text-[var(--ink)] whitespace-nowrap cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-[var(--line)] bg-white flex gap-2"
        >
          <input
            type="text"
            placeholder="Pergunte sobre leis, casamento, denúncias, termos..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-full border border-[var(--line)] text-xs text-[var(--ink)] focus:outline-hidden focus:border-[#ed003f]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 rounded-full bg-[#ed003f] hover:bg-[#ba0032] text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Enviar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
