import React, { useState } from 'react';
import { X, Copy, Check, Globe, Share2, MessageCircle, Send, Twitter, Facebook, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, activeSection = 'inicio' }) => {
  const [copied, setCopied] = useState(false);
  const [copyType, setCopyType] = useState<'main' | 'section'>('main');

  if (!isOpen) return null;

  // Prefer the permanent shared pre-release URL, fallback to window.location
  const canonicalSharedUrl = 'https://ais-pre-sag7hyeybtk5sbzspvq7se-670433906253.us-west2.run.app';
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : canonicalSharedUrl;
  const currentPublicUrl = baseUrl.includes('localhost') ? canonicalSharedUrl : baseUrl;
  const sectionPublicUrl = `${currentPublicUrl}/?section=${activeSection}`;

  const targetUrl = copyType === 'section' ? sectionPublicUrl : currentPublicUrl;

  const handleCopy = (urlToCopy: string) => {
    navigator.clipboard?.writeText(urlToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = encodeURIComponent(
    'Kurti — Conteúdo, música, agenda cultural e notícias LGBT+ para todo o Brasil:'
  );
  const encodedUrl = encodeURIComponent(targetUrl);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[var(--line)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#141112] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#ed003f] flex items-center justify-center text-white shadow-md">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-normal text-white">Link Público Oficial</h3>
              <p className="text-[11px] text-stone-300">Compartilhe o Kurti com amigos e nas redes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Target URL Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[var(--cream)] rounded-xl mb-4 border border-[var(--line)] text-xs font-bold">
            <button
              type="button"
              onClick={() => setCopyType('main')}
              className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer ${
                copyType === 'main'
                  ? 'bg-white text-[#ed003f] shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              Início do Kurti
            </button>
            <button
              type="button"
              onClick={() => setCopyType('section')}
              className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer truncate ${
                copyType === 'section'
                  ? 'bg-white text-[#ed003f] shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              Aba Atual ({activeSection})
            </button>
          </div>

          {/* URL Box */}
          <div className="relative mb-5">
            <div className="flex items-center bg-[#faf8f5] border border-[var(--line)] rounded-xl p-2.5 focus-within:border-[#ed003f] focus-within:ring-2 focus-within:ring-[#ed003f]/15 transition-all">
              <Globe className="w-4 h-4 text-[#ed003f] ml-1 mr-2 shrink-0" />
              <input
                type="text"
                readOnly
                value={targetUrl}
                className="w-full bg-transparent text-xs text-[var(--ink)] font-mono font-medium outline-none select-all truncate"
              />
              <button
                type="button"
                onClick={() => handleCopy(targetUrl)}
                className={`ml-2 shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#ed003f] hover:bg-[#ba0032] text-white active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
            {copied && (
              <p className="text-[11px] font-bold text-emerald-600 mt-1 pl-1 flex items-center gap-1">
                <Check className="w-3 h-3" /> Link público copiado para a área de transferência!
              </p>
            )}
          </div>

          {/* Quick Social Share Buttons */}
          <div className="mb-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] block mb-2.5">
              Compartilhar direto via:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-xs border border-[#25D366]/30 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] font-bold text-xs border border-[#0088cc]/30 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Telegram</span>
              </a>

              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-black/5 hover:bg-black/10 text-black font-bold text-xs border border-black/15 transition-colors"
              >
                <Twitter className="w-4 h-4" />
                <span>X / Twitter</span>
              </a>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] font-bold text-xs border border-[#1877F2]/30 transition-colors"
              >
                <Facebook className="w-4 h-4" />
                <span>Facebook</span>
              </a>
            </div>
          </div>

          {/* Kurti Identity Card */}
          <div className="p-3.5 bg-[var(--cream)] rounded-2xl border border-[var(--line)] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <img
                src="/kurti-icon.png"
                alt="Kurti"
                className="w-10 h-10 rounded-xl object-cover shadow-xs border border-[#f0c8d2]"
              />
              <div>
                <strong className="font-serif text-sm text-[var(--ink)] block">Kurti — Conteúdo LGBT+</strong>
                <span className="text-[11px] text-[var(--muted)]">O portal de cultura, notícias e música</span>
              </div>
            </div>
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ed003f] hover:underline font-bold text-[11px] flex items-center gap-1 shrink-0"
            >
              Abrir <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
