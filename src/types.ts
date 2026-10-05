export type ToneType = 'red' | 'violet' | 'blue' | 'green' | 'amber' | 'coral';

export interface Story {
  id: string;
  publishedAt: string;
  category: string;
  sectionId: string;
  title: string;
  summary: string;
  dateLabel: string;
  source: string;
  sourceUrl: string;
  tone: ToneType;
  artMark: string;
  posterWord?: string;
}

export interface ArticleSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface FullArticle {
  readingTime: string;
  body: string[];
  sections?: ArticleSection[];
}

export interface ClubEvent {
  name: string;
  date: string;
  lineup?: string[];
  price?: string;
}

export interface Club {
  name: string;
  area: string;
  address: string;
  status: string;
  source: string;
  sourceUrl: string;
  events?: ClubEvent[];
}

export interface CultureGuideItem {
  publishedAt?: string;
  date: string;
  title: string;
  venue: string;
  price: string;
  note: string;
}

export interface CultureGuides {
  Cinema: CultureGuideItem[];
  Teatro: CultureGuideItem[];
}

export interface Film {
  id: string;
  title: string;
  eyebrow: string;
  synopsis: string;
  license: string;
  credit: string;
  embedUrl: string;
}

export interface MusicItem {
  artist: string;
  eyebrow: string;
  title: string;
  source: string;
  articleId: string;
}

export interface YouTubeTrack {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  category: string;
  duration?: string;
  year?: string;
  description?: string;
}

export interface RecentlyWatchedTrack extends YouTubeTrack {
  watchedAt: number; // Timestamp in milliseconds
}

export interface WomenSpaceItem {
  eyebrow: string;
  title: string;
  copy: string;
  articleId: string;
}

export type GlossaryTuple = [string, string, string]; // [letter, term, definition]

export interface RightsItem {
  title: string;
  copy: string;
  source: string;
  url: string;
}

export interface BrazilState {
  uf: string;
  name: string;
  capital: string;
  capitalSlug: string;
}

export interface CultureCategory {
  title: string;
  kicker: string;
  copy: string;
  mark: string;
  tone: ToneType;
}

export interface KurtiPlusCategory {
  title: string;
  kicker: string;
  copy: string;
  mark: string;
  tone: ToneType;
}

export interface Product {
  id: string;
  name: string;
  category: 'Vestuário' | 'Acessórios' | 'Colecionáveis' | 'Papelaria & Livros';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  inStock: boolean;
  stockCount: number;
  description: string;
  details: string[];
  sizes?: string[];
  badge?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  size?: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: 'PIX' | 'Cartão de Crédito' | 'Boleto Bancário';
  status: 'Entregue' | 'Em transporte' | 'Processando' | 'Confirmado';
  trackingCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem extends OrderItem {}

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  phone?: string;
  department: string;
  message: string;
}

export type UserRole = 'admin' | 'editor' | 'leitor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'Ativo' | 'Inativo';
  createdAt: string;
  lastLogin?: string;
}

export interface AuthSession {
  user: User;
  token: string;
}
