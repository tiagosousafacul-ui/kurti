import React, { useState, useEffect } from 'react';
import { Story, FullArticle } from '../types';
import { X, ExternalLink, Clock, Share2, Check, BookOpen } from 'lucide-react';

interface ArticleModalProps {
  story: Story | null;
  fullArticle?: FullArticle;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ story, fullArticle, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!story) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={`bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-[var(--line)] max-h-[90vh] flex flex-col my-auto relative tone-${story.tone || 'red'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[#faf8f5]">
          <div className="flex items-center gap-3">
            <span className="font-bold text-xs uppercase tracking-wider text-[var(--tone)]">
              {story.category}
            </span>
            <span className="text-xs text-[var(--muted)] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {fullArticle?.readingTime || '3 min de leitura'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
              className="p-1.5 rounded-lg border border-[var(--line)] text-xs font-bold hover:bg-white text-[var(--ink)] cursor-pointer"
              title="Ajustar tamanho da fonte"
            >
              {fontSize === 'normal' ? 'A+' : 'A-'}
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg border border-[var(--line)] text-xs font-medium hover:bg-white text-[var(--ink)] cursor-pointer flex items-center gap-1"
              title="Copiar link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-200 text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer ml-1"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Reader Body */}
        <div className="overflow-y-auto p-6 sm:p-10 custom-scrollbar">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <time className="text-xs text-[var(--muted)] font-mono">
              {story.dateLabel}
            </time>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Ciclo 4h
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-normal text-[var(--ink)] leading-tight mb-4">
            {story.title}
          </h1>

          <div className="p-4 rounded-xl bg-[var(--cream)] border border-[var(--line)] mb-6 text-sm text-[var(--ink)] font-medium leading-relaxed">
            {story.summary}
          </div>

          {/* Source Attribution Box */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-[var(--line)] mb-8 text-xs">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#ed003f]" />
              <span className="text-[var(--muted)]">Fonte checada:</span>
              <strong className="text-[var(--ink)]">{story.source}</strong>
            </div>
            {story.sourceUrl && (
              <a
                href={story.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ed003f] hover:underline font-bold flex items-center gap-1"
              >
                Ver publicação original
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Full Article Text Body */}
          <div className={`space-y-5 text-[var(--ink)] ${fontSize === 'large' ? 'text-lg leading-relaxed' : 'text-base leading-relaxed'}`}>
            {fullArticle?.body?.map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}

            {/* Additional Sub-sections if available */}
            {fullArticle?.sections?.map((section, sIdx) => (
              <div key={sIdx} className="pt-4 border-t border-[var(--line)]">
                <h3 className="text-xl font-serif font-bold text-[var(--ink)] mb-3">
                  {section.heading}
                </h3>
                {section.paragraphs?.map((p, pIdx) => (
                  <p key={pIdx} className="mb-3 leading-relaxed">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="list-disc pl-5 space-y-2 mt-2">
                    {section.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="text-sm sm:text-base text-[var(--muted)]">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Article Footer */}
          <div className="mt-10 pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--muted)] gap-4">
            <span>© 2026 Kurti — Jornalismo, Direitos e Cultura LGBT+. Todos os direitos reservados.</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-[var(--ink)] text-white text-xs font-bold uppercase tracking-wider hover:bg-black cursor-pointer"
            >
              Concluir leitura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
