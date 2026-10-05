import React from 'react';
import { Story } from '../types';

interface HeroSectionProps {
  stories: Story[];
  onOpenStory: (storyId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ stories, onOpenStory }) => {
  if (!stories || stories.length === 0) return null;

  const leadStory = stories[0];
  const sideStories = stories.slice(1, 4);

  // Derive poster word (e.g. city or theme)
  const posterWord = leadStory.posterWord || (
    leadStory.title.toLowerCase().includes('içara') ? 'IÇARA' :
    leadStory.title.toLowerCase().includes('rio') ? 'RIO' :
    leadStory.title.toLowerCase().includes('bh') ? 'BH' :
    'KURTI'
  );

  const dateBadge = leadStory.dateLabel ? leadStory.dateLabel.split('•')[0].trim() : 'HÁ 25 MIN';

  return (
    <section className="hero-grid" id="inicio">
      <button
        className="lead-story"
        aria-label={`Abrir destaque: ${leadStory.title}`}
        onClick={() => onOpenStory(leadStory.id)}
      >
        <div className="lead-copy">
          <div className="story-meta">
            <span>{leadStory.category}</span>
            <time>{leadStory.dateLabel}</time>
          </div>
          <h1>{leadStory.title}</h1>
          <p>{leadStory.summary}</p>
          <span className="card-cta">
            Abrir destaque{' '}
            <svg viewBox="0 0 24 24" aria-hidden="true" width="14" height="14">
              <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </span>
        </div>
        <div className="lead-art" aria-hidden="true">
          <span className="sun-disc"></span>
          <span className="poster-word">{posterWord}</span>
          <span className="poster-note">
            {leadStory.category}
            <br />
            <b>PLANTÃO 4H</b>
          </span>
          <span className="poster-date">{dateBadge}</span>
        </div>
      </button>

      <aside className="hero-stack" aria-label="Destaques">
        {sideStories.map((story, idx) => {
          const toneClass = story.tone ? `tone-${story.tone}` : idx === 0 ? 'tone-violet' : idx === 1 ? 'tone-green' : 'tone-red';
          const indexNum = String(idx + 1).padStart(2, '0');

          return (
            <button
              key={story.id}
              className={`compact-story ${toneClass}`}
              aria-label={`Abrir ${story.title}`}
              onClick={() => onOpenStory(story.id)}
            >
              <div className="compact-index">{indexNum}</div>
              <div>
                <div className="story-meta">
                  <span>{story.category}</span>
                  <time>{story.dateLabel}</time>
                </div>
                <h2>{story.title}</h2>
                <p>{story.summary}</p>
                <span className="card-cta compact-cta">
                  <svg viewBox="0 0 24 24" aria-hidden="true" width="12" height="12">
                    <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"></path>
                  </svg>
                </span>
              </div>
            </button>
          );
        })}
      </aside>
    </section>
  );
};
