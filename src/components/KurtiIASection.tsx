import React from 'react';

interface KurtiIASectionProps {
  onOpenModal?: () => void;
}

export const KurtiIASection: React.FC<KurtiIASectionProps> = ({ onOpenModal }) => {
  return (
    <section className="ai-section page-section" id="kurti-ia">
      <div className="ai-copy">
        <span className="ai-kicker">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m12 2 1.4 5.6L19 9l-5.6 1.4L12 16l-1.4-5.6L5 9l5.6-1.4L12 2Z" fill="currentColor"></path>
            <path d="m18.5 15 .7 2.8 2.8.7-2.8.7-.7 2.8-.7-2.8-2.8-.7 2.8-.7.7-2.8Z" fill="currentColor"></path>
          </svg>
          Inteligência editorial
        </span>
        <h2>Edição contínua com atualização de 4 em 4 horas.</h2>
        <p>A Kurti IA monitora fontes primárias e publica novos blocos de conteúdo a cada 4 horas, sem defasagem mensal. Ela não copia textos ou imagens — e mantém a referência consultada visível dentro de cada card.</p>
        <div className="ai-live">
          <i></i>
          <span>
            <b>Plantão contínuo a cada 4 horas</b>Atualização automática 24h
          </span>
        </div>
      </div>

      <div className="ai-flow">
        <article>
          <span>01</span>
          <strong>Descobrir</strong>
          <p>Busca agendas, notícias, serviços e valores recentes.</p>
        </article>
        <article>
          <span>02</span>
          <strong>Checar</strong>
          <p>Prioriza canais oficiais e confirma data, local e contexto.</p>
        </article>
        <article>
          <span>03</span>
          <strong>Redigir</strong>
          <p>Escreve um resumo factual novo; não reproduz artigo nem fotografia.</p>
        </article>
        <article>
          <span>04</span>
          <strong>Atualizar</strong>
          <p>Publica a edição com fonte, horário da checagem e histórico.</p>
        </article>
      </div>

      <div className="ai-rules">
        <strong>Regras que a IA não pode quebrar</strong>
        <span>Sem rumores</span>
        <span>Sem copiar matéria ou imagem</span>
        <span>Sem exposição de vítimas</span>
        <span>Sem aconselhamento médico ou jurídico</span>
        <span>Publicidade identificada</span>
      </div>
    </section>
  );
};
