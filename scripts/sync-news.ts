const FEEDS = [
  {
    url: 'https://agenciabrasil.ebc.com.br/feed/ultimasnoticias/feed.xml',
    source: 'Agência Brasil',
    sourceUrl: 'https://agenciabrasil.ebc.com.br/'
  },
  {
    url: 'https://www.theguardian.com/world/lgbt-rights/rss',
    source: 'The Guardian',
    sourceUrl: 'https://www.theguardian.com/world/lgbt-rights'
  },
  {
    url: 'https://news.google.com/rss/search?q=LGBTQ%20Brasil&hl=pt-BR&gl=BR&ceid=BR:pt-419',
    source: 'Google News',
    sourceUrl: 'https://news.google.com/'
  }
];

const KEYWORDS = [
  'lgbt', 'lgbtq', 'lgbtqia', 'gay', 'lésb', 'lesbian', 'transgêner',
  'transexual', 'travesti', 'trans', 'queer', 'homofobia', 'transfobia',
  'casamento homoafetivo', 'orgulho', 'pride', 'drag queen', 'intersexo',
  'intersex', 'diversidade sexual', 'identidade de gênero', 'gênero'
];

const escapeHtml = (value: string) =>
  value.replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();

const decode = (value: string) => escapeHtml(value);

const tag = (xml: string, name: string) => {
  const match = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return match ? decode(match[1]) : '';
};

const attr = (xml: string, name: string) => {
  const match = xml.match(new RegExp(`<source[^>]*\\b${name}="([^"]+)"`, 'i'));
  return match?.[1] ?? '';
};

const itemsFromFeed = async (feed: typeof FEEDS[number]) => {
  const response = await fetch(feed.url, { headers: { 'user-agent': 'KURTI-News-Sync/1.0' } });
  if (!response.ok) throw new Error(`${feed.source}: HTTP ${response.status}`);
  const xml = await response.text();
  return [...xml.matchAll(/<item[\s>]([\s\S]*?)<\/item>/gi)].map((m) => m[1]).map((item) => ({
    title: tag(item, 'title'),
    description: tag(item, 'description'),
    link: tag(item, 'link'),
    pubDate: tag(item, 'pubDate') || tag(item, 'published'),
    source: tag(item, 'source') || feed.source,
    sourceUrl: attr(item, 'url') || feed.sourceUrl
  }));
};

const now = Date.now();
const cutoff = now - 48 * 60 * 60 * 1000;
const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

const all = [];
for (const feed of FEEDS) {
  try {
    all.push(...await itemsFromFeed(feed));
  } catch (error) {
    console.warn(String(error));
  }
}

const seen = new Set<string>();
const stories = all
  .map((item) => {
    const published = new Date(item.pubDate || now);
    return { ...item, published };
  })
  .filter((item) => Number.isFinite(item.published.getTime()) && item.published.getTime() >= cutoff)
  .filter((item) => KEYWORDS.some((keyword) => `${item.title} ${item.description}`.toLowerCase().includes(keyword)))
  .sort((a, b) => b.published.getTime() - a.published.getTime())
  .filter((item) => {
    const key = item.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })
  .slice(0, 12)
  .map((item, index) => {
    const d = item.published;
    const category = /celebr|ator|cantor|atriz|filme|série|música|novela/i.test(item.title) ? 'Celebridades' : 'Notícias';
    const tone = index % 4 === 0 ? 'violet' : index % 4 === 1 ? 'blue' : index % 4 === 2 ? 'green' : 'red';
    const location = /brasil|brasileir|são paulo|rio de janeiro|minas gerais|natal|câmara|congresso/i.test(item.title) ? 'BRASIL' : 'MUNDO';
    const sourceName = item.source.replace(/^Google News$/i, 'Google News');
    return {
      id: `live-${d.toISOString().slice(0, 10)}-${index}-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}`,
      publishedAt: d.toISOString(),
      category,
      sectionId: 'noticias',
      title: item.title,
      summary: item.description || 'Notícia selecionada automaticamente pelo monitoramento editorial da Kurti.',
      dateLabel: `${d.getDate()} ${months[d.getMonth()]} • ${location}`,
      source: sourceName,
      sourceUrl: item.link || item.sourceUrl,
      tone,
      artMark: location
    };
  });

if (stories.length === 0) {
  throw new Error('Nenhuma notícia LGBT+ recente foi encontrada; o arquivo existente será preservado.');
}

await Bun.write('public/news-updates.json', JSON.stringify(stories, null, 2) + '\\n');
console.log(`Sincronizadas ${stories.length} notícias em ${new Date().toISOString()}`);
