import React, { useMemo } from 'react';
import { Story } from '../types';

interface LatestStoriesProps {
  stories: Story[];
  onOpenStory: (storyId: string) => void;
  isArchive?: boolean;
}

export const LatestStories: React.FC<LatestStoriesProps> = ({
  stories,
  onOpenStory,
  isArchive = false
}) => {
  // If not archive, take the stories that follow the hero stories
  const displayedStories = useMemo(() => {
    if (stories.length <= 4) return stories;
    if (!isArchive) {
      // In the original site, the latest section on homepage has 9 stories
      return stories.slice(4, 13);
    }
    return stories;
  }, [stories, isArchive]);

  return (
    <section className={`latest-section ${isArchive ? 'page-archive' : ''}`} id="noticias">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            {isArchive ? 'Arquivo Editorial · Notícias e Destaques' : 'Página inicial · atualizações recentes'}
          </span>
          <h2>{isArchive ? 'Todas as Notícias' : 'Pra ficar por dentro'}</h2>
        </div>
        <div className="ai-stamp">
          <svg viewBox="0 0 24 24" aria-hidden="true" width="21" height="21">
            <path d="m12 2 1.4 5.6L19 9l-5.6 1.4L12 16l-1.4-5.6L5 9l5.6-1.4L12 2Z" fill="currentColor"></path>
            <path d="m18.5 15 .7 2.8 2.8.7-2.8.7-.7 2.8-.7-2.8-2.8-.7 2.8-.7.7-2.8Z" fill="currentColor"></path>
          </svg>
          <span>
            <b>Curadoria Kurti IA</b>Checada em 9 set, 12h
          </span>
        </div>
      </div>

      <div className="story-grid">
        {displayedStories.map((story, idx) => {
          const defaultTone =
            idx % 6 === 0 ? 'violet' :
            idx % 6 === 1 ? 'red' :
            idx % 6 === 2 ? 'green' :
            idx % 6 === 3 ? 'blue' :
            idx % 6 === 4 ? 'amber' : 'coral';

          const toneClass = `tone-${story.tone || defaultTone}`;
          const indexNum = String(idx + 1).padStart(2, '0');
          const artMark = story.artMark || (
            story.category === 'KurtiMusic' ? '7 EMMYS' :
            story.category === 'Culinária' ? '12 MIN' :
            story.category === 'Espaço Delas' ? 'LESBOS' :
            story.category === 'Celebridades' ? 'AMOR' :
            story.category === 'Cabelos' ? 'COR' :
            'KURTI'
          );

          return (
            <button
              key={story.id}
              className={`story-card ${toneClass}`}
              onClick={() => onOpenStory(story.id)}
              aria-label={`Abrir matéria: ${story.title}`}
            >
              <div className="card-art" aria-hidden="true">
                <span>{artMark}</span>
                <i>{indexNum}</i>
              </div>
              <div className="card-body">
                <div className="story-meta">
                  <span>{story.category}</span>
                  <time>{story.dateLabel}</time>
                </div>
                <h3>{story.title}</h3>
                <p>{story.summary}</p>
                <span className="card-cta">
                  Abrir matéria{' '}
                  <svg viewBox="0 0 24 24" aria-hidden="true" width="12" height="12">
                    <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"></path>
                  </svg>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
