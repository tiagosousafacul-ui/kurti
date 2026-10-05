import { Story } from '../types';

export interface CycleInfo {
  cycleHour: number;
  nextCycleHour: number;
  formattedDate: string;
  editionLabel: string;
  subHeaderBadge: string;
  updateFrequencyText: string;
}

/**
 * Returns real-time 4-hour cycle metadata based on the user's current clock.
 * Every day is partitioned into six 4-hour publication windows:
 * 00:00, 04:00, 08:00, 12:00, 16:00, 20:00
 */
export function getCurrentCycleInfo(): CycleInfo {
  const now = new Date();
  const currentHour = now.getHours();
  const cycleHour = Math.floor(currentHour / 4) * 4;
  const nextCycleHour = (cycleHour + 4) % 24;

  const day = now.getDate();
  const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  const monthStr = monthNames[now.getMonth()];
  const year = now.getFullYear();

  const formattedDate = `${day} ${monthStr} ${year}`;
  const formattedCycleHour = String(cycleHour).padStart(2, '0');
  const formattedNextHour = String(nextCycleHour).padStart(2, '0');

  return {
    cycleHour,
    nextCycleHour,
    formattedDate,
    editionLabel: `Edição das ${formattedCycleHour}h`,
    subHeaderBadge: `Plantão 24h · Atualização de 4 em 4 horas (próxima às ${formattedNextHour}h)`,
    updateFrequencyText: `Atualizado de 4 em 4 horas • Edição contínua`
  };
}

/**
 * Formats a story's date label and publish time into a continuous 4-hour publishing schedule
 * instead of static monthly dates.
 * 
 * Index 0: Current 4h cycle (e.g. "HÁ 25 MIN • SANTA CATARINA")
 * Index 1: 4 hours ago (e.g. "HÁ 4H • ANIVERSÁRIO")
 * Index 2: 8 hours ago (e.g. "HÁ 8H • 12 MIN")
 * Index 3: 12 hours ago (e.g. "HÁ 12H • PREMIAÇÃO")
 * ...
 */
export function apply4HourCycleToStories(stories: Story[]): Story[] {
  const now = new Date();

  return stories.map((story, index) => {
    // Determine hours ago based on 4-hour intervals
    const hoursAgo = index * 4;
    
    // Extract editorial location/topic tag from original dateLabel (e.g. "8 SET • SANTA CATARINA" -> "SANTA CATARINA")
    let topicTag = '';
    if (story.dateLabel && story.dateLabel.includes('•')) {
      const parts = story.dateLabel.split('•');
      topicTag = parts.slice(1).join('•').trim();
    } else if (story.category) {
      topicTag = story.category.toUpperCase();
    } else {
      topicTag = 'DESTAQUE';
    }

    // Compute dynamic time badge
    let timePrefix = '';
    if (index === 0) {
      timePrefix = 'HÁ 25 MIN';
    } else if (hoursAgo < 24) {
      timePrefix = `HÁ ${hoursAgo}H`;
    } else if (hoursAgo === 24) {
      timePrefix = 'ONTEM (HÁ 24H)';
    } else if (hoursAgo < 48) {
      const extraHours = hoursAgo - 24;
      timePrefix = extraHours > 0 ? `ONTEM (+${extraHours}H)` : 'ONTEM';
    } else {
      const days = Math.floor(hoursAgo / 24);
      timePrefix = `HÁ ${days} DIAS`;
    }

    const newDateLabel = topicTag ? `${timePrefix} • ${topicTag}` : timePrefix;

    // Calculate simulated dynamic ISO publication time
    const storyPublishDate = new Date(now.getTime() - (hoursAgo * 3600 * 1000 + 25 * 60 * 1000));

    return {
      ...story,
      dateLabel: newDateLabel,
      publishedAt: storyPublishDate.toISOString()
    };
  });
}
