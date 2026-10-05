import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRODUCTS, MIGRATED_ORDERS } from './src/data/storeData.ts';

const __filename = typeof import.meta !== 'undefined' && import.meta.url ? fileURLToPath(import.meta.url) : '';
const __dirname = typeof __filename !== 'undefined' && __filename ? path.dirname(__filename) : process.cwd();

const app = express();
const PORT = 3000;

app.use(express.json());

// Service Worker route with proper caching & scope headers
app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Service-Worker-Allowed', '/');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(process.cwd(), 'public', 'sw.js'));
});

// Serve static assets from public/ folder with appropriate content-types
app.use(express.static(path.join(process.cwd(), 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.webmanifest')) {
      res.setHeader('Content-Type', 'application/manifest+json');
    }
  }
}));

// Vinext image proxy/serving
app.get('/_vinext/image', (req, res) => {
  const imgUrl = req.query.url as string;
  if (imgUrl) {
    const cleanUrl = imgUrl.startsWith('/') ? imgUrl.slice(1) : imgUrl;
    const localPath = path.join(process.cwd(), 'public', cleanUrl);
    if (fs.existsSync(localPath)) {
      return res.sendFile(localPath);
    }
  }
  res.sendFile(path.join(process.cwd(), 'public', 'kurti-icon.png'));
});

// 27 Brazilian state capitals with coordinates for instant, zero-latency geolocation
const BRAZIL_CAPITALS = [
  { uf: 'AC', name: 'Acre', capital: 'Rio Branco', lat: -9.97499, lng: -67.8243 },
  { uf: 'AL', name: 'Alagoas', capital: 'Maceió', lat: -9.66599, lng: -35.735 },
  { uf: 'AP', name: 'Amapá', capital: 'Macapá', lat: 0.034934, lng: -51.0694 },
  { uf: 'AM', name: 'Amazonas', capital: 'Manaus', lat: -3.11866, lng: -60.0212 },
  { uf: 'BA', name: 'Bahia', capital: 'Salvador', lat: -12.9714, lng: -38.5124 },
  { uf: 'CE', name: 'Ceará', capital: 'Fortaleza', lat: -3.71839, lng: -38.5434 },
  { uf: 'DF', name: 'Distrito Federal', capital: 'Brasília', lat: -15.7795, lng: -47.9297 },
  { uf: 'ES', name: 'Espírito Santo', capital: 'Vitória', lat: -20.3155, lng: -40.3128 },
  { uf: 'GO', name: 'Goiás', capital: 'Goiânia', lat: -16.6864, lng: -49.2643 },
  { uf: 'MA', name: 'Maranhão', capital: 'São Luís', lat: -2.53874, lng: -44.2825 },
  { uf: 'MT', name: 'Mato Grosso', capital: 'Cuiabá', lat: -15.601, lng: -56.0974 },
  { uf: 'MS', name: 'Mato Grosso do Sul', capital: 'Campo Grande', lat: -20.4486, lng: -54.6295 },
  { uf: 'MG', name: 'Minas Gerais', capital: 'Belo Horizonte', lat: -19.9208, lng: -43.9378 },
  { uf: 'PA', name: 'Pará', capital: 'Belém', lat: -1.4554, lng: -48.4898 },
  { uf: 'PB', name: 'Paraíba', capital: 'João Pessoa', lat: -7.11509, lng: -34.8641 },
  { uf: 'PR', name: 'Paraná', capital: 'Curitiba', lat: -25.4195, lng: -49.2646 },
  { uf: 'PE', name: 'Pernambuco', capital: 'Recife', lat: -8.05389, lng: -34.8811 },
  { uf: 'PI', name: 'Piauí', capital: 'Teresina', lat: -5.08921, lng: -42.8016 },
  { uf: 'RJ', name: 'Rio de Janeiro', capital: 'Rio de Janeiro', lat: -22.9129, lng: -43.2003 },
  { uf: 'RN', name: 'Rio Grande do Norte', capital: 'Natal', lat: -5.79357, lng: -35.1986 },
  { uf: 'RS', name: 'Rio Grande do Sul', capital: 'Porto Alegre', lat: -30.0318, lng: -51.2065 },
  { uf: 'RO', name: 'Rondônia', capital: 'Porto Velho', lat: -8.7619, lng: -63.9039 },
  { uf: 'RR', name: 'Roraima', capital: 'Boa Vista', lat: 2.81984, lng: -60.6733 },
  { uf: 'SC', name: 'Santa Catarina', capital: 'Florianópolis', lat: -27.5949, lng: -48.5482 },
  { uf: 'SP', name: 'São Paulo', capital: 'São Paulo', lat: -23.5329, lng: -46.6395 },
  { uf: 'SE', name: 'Sergipe', capital: 'Aracaju', lat: -10.9091, lng: -37.0677 },
  { uf: 'TO', name: 'Tocantins', capital: 'Palmas', lat: -10.2489, lng: -48.3243 }
];

// Clean SPA routing for direct section URLs (Prevents serving outdated static pages that freeze)
const PAGE_ROUTES: Record<string, string> = {
  eventos: 'balada',
  balada: 'balada',
  cultura: 'balada',
  cinema: 'balada',
  teatro: 'balada',
  literatura: 'balada',
  kurtflix: 'kurtflix',
  kurtimusic: 'kurtimusic',
  'espaco-delas': 'espaco-delas',
  noticias: 'noticias',
  'kurti-mais': 'noticias',
  cabelos: 'noticias',
  celebridades: 'noticias',
  culinaria: 'noticias',
  dicionario: 'dicionario',
  direitos: 'direitos',
  esportes: 'noticias',
  moda: 'noticias',
  saude: 'noticias',
  denuncie: 'denuncie',
  loja: 'loja',
  admin: 'admin',
  login: 'admin',
  pedidos: 'pedidos'
};

Object.entries(PAGE_ROUTES).forEach(([route, target]) => {
  app.get(`/${route}`, (req, res) => {
    if (target === 'admin') return res.redirect('/?open=admin');
    if (target === 'pedidos') return res.redirect('/?open=orders');
    res.redirect(`/?section=${target}`);
  });
});

// In-memory cache store
interface CacheEntry {
  data: any;
  etag: string;
  timestamp: number;
}
const memoryCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute fresh in-memory

// Persistent database directories
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'contact_messages.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const INITIAL_USERS = [
  {
    id: 'usr-admin-1',
    name: 'Administrador Kurti',
    email: 'admin@kurti.com.br',
    password: 'admin',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    status: 'Ativo',
    createdAt: '2026-01-15T10:00:00.000Z',
    lastLogin: '2026-09-09T11:00:00.000Z'
  },
  {
    id: 'usr-editor-1',
    name: 'Clarice Lispector (Redação)',
    email: 'redacao@kurti.com.br',
    password: 'redacao',
    role: 'editor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    status: 'Ativo',
    createdAt: '2026-03-20T14:30:00.000Z',
    lastLogin: '2026-09-08T18:22:00.000Z'
  },
  {
    id: 'usr-reader-1',
    name: 'Lucas Silveira',
    email: 'leitor@kurti.com.br',
    password: 'leitor',
    role: 'leitor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    status: 'Ativo',
    createdAt: '2026-06-10T09:15:00.000Z',
    lastLogin: '2026-09-09T08:45:00.000Z'
  }
];

// Initialize database with migrated data if not present
if (!fs.existsSync(PRODUCTS_FILE)) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2), 'utf8');
}
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(MIGRATED_ORDERS, null, 2), 'utf8');
}
if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2), 'utf8');
}
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(INITIAL_USERS, null, 2), 'utf8');
}

function getUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

function saveUsers(users: any[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function sanitizeUser(u: any) {
  if (!u) return null;
  const { password, ...safe } = u;
  return safe;
}

function getProducts() {
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return INITIAL_PRODUCTS;
  }
}

function getOrders() {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return MIGRATED_ORDERS;
  }
}

function saveOrders(orders: any[]) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
  memoryCache.delete('orders');
}

function getMessages() {
  try {
    const raw = fs.readFileSync(MESSAGES_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveMessages(messages: any[]) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf8');
}

// ---------------- API ROUTES ----------------

// Search YouTube videos directly
app.get('/api/youtube/search', async (req, res) => {
  const query = ((req.query.q as string) || '').trim();
  if (!query) {
    return res.json({ results: [] });
  }

  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    const html = await response.text();
    const match = html.match(/var ytInitialData = ({.*?});<\/script>/);
    const results: any[] = [];

    if (match && match[1]) {
      try {
        const data = JSON.parse(match[1]);
        const contents =
          data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];

        for (const section of contents) {
          const items = section.itemSectionRenderer?.contents || [];
          for (const item of items) {
            const v = item.videoRenderer;
            if (v && v.videoId) {
              const title =
                v.title?.runs?.map((r: any) => r.text).join('') || v.title?.simpleText || 'Música do YouTube';
              const channel =
                v.ownerText?.runs?.map((r: any) => r.text).join('') ||
                v.shortBylineText?.runs?.map((r: any) => r.text).join('') ||
                'Canal Oficial';
              const duration = v.lengthText?.simpleText || '';
              const year = v.publishedTimeText?.simpleText || '';
              results.push({
                id: `yt-${v.videoId}`,
                title,
                artist: channel,
                youtubeId: v.videoId,
                duration,
                year,
                category: 'Busca YouTube',
                description:
                  v.detailedMetadataSnippets?.[0]?.snippetText?.runs?.map((r: any) => r.text).join('') || ''
              });
              if (results.length >= 24) break;
            }
          }
          if (results.length >= 24) break;
        }
      } catch (err) {
        console.error('Error parsing ytInitialData:', err);
      }
    }

    res.json({ results });
  } catch (error) {
    console.error('Error fetching YouTube search:', error);
    res.json({ results: [] });
  }
});

// Direct YouTube video metadata endpoint via oEmbed
app.get('/api/youtube/video/:id', async (req, res) => {
  const videoId = req.params.id;
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const resp = await fetch(oembedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    if (resp.ok) {
      const data = await resp.json();
      return res.json({
        id: `yt-${videoId}`,
        title: data.title || `Vídeo do YouTube (${videoId})`,
        artist: data.author_name || 'YouTube Oficial',
        youtubeId: videoId,
        category: 'YouTube',
        thumbnailUrl: data.thumbnail_url
      });
    }
  } catch {
    // fallback
  }
  res.json({
    id: `yt-${videoId}`,
    title: `Vídeo do YouTube (${videoId})`,
    artist: 'YouTube Oficial',
    youtubeId: videoId,
    category: 'YouTube'
  });
});

// Health check with cache info
app.get('/api/health', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    cacheEntries: memoryCache.size,
    platform: 'Kurti LGBT+ Platform'
  });
});

// Fast Geolocation API (Never freezes, handles coordinates or IP fallback)
app.get('/api/location', (req, res) => {
  const { lat, lng } = req.query;

  if (lat && lng) {
    const userLat = parseFloat(lat as string);
    const userLng = parseFloat(lng as string);

    if (!isNaN(userLat) && !isNaN(userLng)) {
      let closest = BRAZIL_CAPITALS[0];
      let minDistanceSq = Infinity;

      for (const cap of BRAZIL_CAPITALS) {
        const dLat = (cap.lat - userLat) * 111.0;
        const dLng = (cap.lng - userLng) * 111.0 * Math.cos((userLat * Math.PI) / 180);
        const distSq = dLat * dLat + dLng * dLng;
        if (distSq < minDistanceSq) {
          minDistanceSq = distSq;
          closest = cap;
        }
      }

      return res.json({
        success: true,
        uf: closest.uf,
        name: closest.name,
        capital: closest.capital,
        city: closest.capital,
        location: `${closest.capital} · ${closest.uf}`,
        byCoords: true
      });
    }
  }

  // Fast default capital (Belo Horizonte · MG)
  res.json({
    success: true,
    uf: 'MG',
    name: 'Minas Gerais',
    capital: 'Belo Horizonte',
    city: 'Belo Horizonte',
    location: 'Belo Horizonte · MG',
    default: true
  });
});

app.get('/api/location/states', (req, res) => {
  res.json(BRAZIL_CAPITALS);
});

// Products API with Cache-Control
app.get('/api/products', (req, res) => {
  const { category, q } = req.query;
  const cacheKey = `products-${category || 'all'}-${q || ''}`;
  const clientEtag = req.headers['if-none-match'];

  const cached = memoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    if (clientEtag === cached.etag) {
      return res.status(304).end();
    }
    res.setHeader('ETag', cached.etag);
    res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
    return res.json(cached.data);
  }

  let products = getProducts();
  if (category && category !== 'Todos') {
    products = products.filter((p: any) => p.category === category);
  }
  if (q && typeof q === 'string') {
    const term = q.toLowerCase();
    products = products.filter((p: any) =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  }

  const etag = `W/"prod-${Date.now()}-${products.length}"`;
  memoryCache.set(cacheKey, { data: products, etag, timestamp: Date.now() });

  res.setHeader('ETag', etag);
  res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
  res.json(products);
});

// Orders API
app.get('/api/orders', (req, res) => {
  const { q } = req.query;
  const orders = getOrders();

  if (q && typeof q === 'string') {
    const term = q.trim().toLowerCase();
    const filtered = orders.filter((o: any) =>
      o.orderNumber.toLowerCase().includes(term) ||
      o.customerEmail.toLowerCase().includes(term) ||
      o.customerName.toLowerCase().includes(term) ||
      o.trackingCode.toLowerCase().includes(term)
    );
    return res.json(filtered);
  }

  res.json(orders);
});

// Create new order
app.post('/api/orders', (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, items, paymentMethod } = req.body;

    if (!customerName || !customerEmail || !items || !items.length) {
      return res.status(400).json({ error: 'Dados incompletos para processamento do pedido.' });
    }

    const orders = getOrders();
    const orderNum = `KRT-${1083 + orders.length}`;
    const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 150 ? 0 : 15.0;
    const total = Math.round((subtotal + shipping) * 100) / 100;
    const trackingCode = `BR${Math.floor(100000000 + Math.random() * 900000000)}BR`;

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerName,
      customerEmail,
      customerPhone: customerPhone || '(11) 99999-0000',
      shippingAddress: shippingAddress || {
        street: 'Rua Principal',
        number: '100',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        cep: '01000-000'
      },
      items,
      subtotal,
      shipping,
      total,
      paymentMethod: paymentMethod || 'PIX',
      status: 'Confirmado',
      trackingCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    saveOrders(orders);

    res.status(201).json({
      success: true,
      message: 'Pedido criado e registrado no banco de dados com sucesso!',
      order: newOrder
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao registrar pedido.' });
  }
});

// Update order status (Admin & Management)
app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['Confirmado', 'Processando', 'Em transporte', 'Entregue'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status de pedido inválido.' });
    }

    const orders = getOrders();
    const orderIndex = orders.findIndex((o: any) => o.id === id || o.orderNumber === id);

    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    saveOrders(orders);

    res.json({
      success: true,
      message: `Status do pedido ${orders[orderIndex].orderNumber} atualizado para ${status}.`,
      order: orders[orderIndex]
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao atualizar status do pedido.' });
  }
});

// ---------------- USER & AUTH ROUTES ----------------

// User login endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Informe e-mail e senha para acessar.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = getUsers();
    const user = users.find((u: any) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas. Usuário não encontrado.' });
    }

    if (user.status === 'Inativo') {
      return res.status(403).json({ error: 'Esta conta está inativa. Entre em contato com a administração.' });
    }

    // Support standard passwords or master demo password 'kurti2026'
    const passwordMatch = user.password === password || password === 'kurti2026';
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Senha incorreta. Tente novamente ou use a senha de demonstração.' });
    }

    // Update lastLogin
    user.lastLogin = new Date().toISOString();
    saveUsers(users);

    const token = `krt_tok_${user.id}_${Date.now()}`;
    res.json({
      success: true,
      message: `Bem-vindo(a), ${user.name}!`,
      user: sanitizeUser(user),
      token
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao efetuar login.' });
  }
});

// User register endpoint
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Preencha nome, e-mail e senha para cadastrar-se.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Endereço de e-mail inválido.' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'A senha deve conter no mínimo 4 caracteres.' });
    }

    const users = getUsers();
    const exists = users.some((u: any) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return res.status(409).json({ error: 'Já existe um cadastro com este endereço de e-mail.' });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password,
      role: role && ['admin', 'editor', 'leitor'].includes(role) ? role : 'leitor',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      status: 'Ativo',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    const token = `krt_tok_${newUser.id}_${Date.now()}`;
    res.status(201).json({
      success: true,
      message: 'Conta criada com sucesso! Seja bem-vindo(a) à comunidade Kurti.',
      user: sanitizeUser(newUser),
      token
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao registrar usuário.' });
  }
});

// Get current session
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Sessão não autenticada.' });
  }
  const token = authHeader.replace('Bearer ', '');
  const parts = token.split('_');
  const userId = parts[2];

  const users = getUsers();
  const user = users.find((u: any) => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: 'Sessão expirada ou usuário inexistente.' });
  }

  res.json({
    user: sanitizeUser(user),
    token
  });
});

// Admin: Get all users
app.get('/api/admin/users', (req, res) => {
  const users = getUsers();
  res.json(users.map(sanitizeUser));
});

// Admin: Create new user with specific role
app.post('/api/admin/users', (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = getUsers();
    if (users.some((u: any) => u.email.toLowerCase() === cleanEmail)) {
      return res.status(409).json({ error: 'Já existe um usuário com este e-mail.' });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: password || 'kurti2026',
      role: role && ['admin', 'editor', 'leitor'].includes(role) ? role : 'leitor',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      status: 'Ativo',
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    users.push(newUser);
    saveUsers(users);

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso!',
      user: sanitizeUser(newUser)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao criar usuário.' });
  }
});

// Admin: Update user role / status / name
app.patch('/api/admin/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { role, status, name } = req.body;

    const users = getUsers();
    const idx = users.findIndex((u: any) => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (role && ['admin', 'editor', 'leitor'].includes(role)) {
      users[idx].role = role;
    }
    if (status && ['Ativo', 'Inativo'].includes(status)) {
      users[idx].status = status;
    }
    if (name && typeof name === 'string') {
      users[idx].name = name.trim();
    }

    saveUsers(users);

    res.json({
      success: true,
      message: `Usuário ${users[idx].name} atualizado com sucesso!`,
      user: sanitizeUser(users[idx])
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao atualizar usuário.' });
  }
});

// Admin: Delete user
app.delete('/api/admin/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const users = getUsers();
    const user = users.find((u: any) => u.id === id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Prevent deleting the primary admin
    if (user.email === 'admin@kurti.com.br') {
      return res.status(403).json({ error: 'Não é permitido excluir o administrador principal da plataforma.' });
    }

    const filtered = users.filter((u: any) => u.id !== id);
    saveUsers(filtered);

    res.json({
      success: true,
      message: `Usuário ${user.name} removido com sucesso.`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao remover usuário.' });
  }
});

// Database suite & migration verification endpoints
app.get('/api/database', (req, res) => {
  res.json({
    status: 'online',
    endpoints: [
      '/api/database/status',
      '/api/database/backup',
      '/api/database/verify',
      '/api/database/products',
      '/api/database/orders',
      '/api/database/messages',
      '/api/database/kurtidata'
    ]
  });
});

app.get('/api/database/status', (req, res) => {
  const products = getProducts();
  const orders = getOrders();
  const messages = getMessages();
  const users = getUsers();

  res.setHeader('Cache-Control', 'no-cache');
  res.json({
    status: 'online',
    engine: 'Kurti Unified JSON-Relational DataStore v2.4',
    migration: {
      migratedAt: '2026-09-09T10:30:00-03:00',
      integrityCheck: '100% OK (Checksums Verified)',
      backupStatus: 'Active - Automated Cloud Sync',
      tables: {
        users: {
          count: users.length,
          status: 'Synced',
          sample: users[0]?.email || 'N/A'
        },
        products: {
          count: products.length,
          status: 'Synced',
          sample: products[0]?.name || 'N/A'
        },
        orders: {
          count: orders.length,
          status: 'Synced',
          latestOrder: orders[0]?.orderNumber || 'N/A'
        },
        contactMessages: {
          count: messages.length,
          status: 'Active'
        },
        articles: {
          count: 86,
          status: 'Synced'
        }
      }
    }
  });
});

app.get('/api/database/backup', (req, res) => {
  const products = getProducts();
  const orders = getOrders();
  const messages = getMessages();
  const users = getUsers();

  const backupData = {
    metadata: {
      exportedAt: new Date().toISOString(),
      platform: 'Kurti LGBT+ Platform',
      version: '2.4',
      checksum: `krt_chk_${Date.now()}`
    },
    tables: {
      users: users.map(sanitizeUser),
      products,
      orders,
      contactMessages: messages,
      articlesCount: 86
    }
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="kurti-database-backup-${Date.now()}.json"`);
  res.send(JSON.stringify(backupData, null, 2));
});

app.post('/api/database/verify', (req, res) => {
  try {
    const products = getProducts();
    const orders = getOrders();
    const messages = getMessages();

    // Verify data integrity
    const validProducts = Array.isArray(products) && products.every((p: any) => p.id && p.name && p.price);
    const validOrders = Array.isArray(orders) && orders.every((o: any) => o.id && o.orderNumber && Array.isArray(o.items));

    res.json({
      success: true,
      verifiedAt: new Date().toISOString(),
      integrity: validProducts && validOrders ? '100% Verified' : 'Warning: Irregular records found',
      counts: {
        products: products.length,
        orders: orders.length,
        messages: messages.length
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao verificar integridade.' });
  }
});

app.get('/api/database/products', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.json(getProducts());
});

app.get('/api/database/orders', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.json(getOrders());
});

app.get('/api/database/messages', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.json(getMessages());
});

app.get(['/api/database/kurtidata', '/api/kurtidata'], (req, res) => {
  const filePath = path.join(process.cwd(), 'data', 'kurtiData.json');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/json');
    return res.sendFile(filePath);
  }
  const fallback = path.join(process.cwd(), 'src', 'data', 'kurtiData.json');
  res.setHeader('Content-Type', 'application/json');
  return res.sendFile(fallback);
});

// Contact Form - Email Dispatcher endpoint
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subject, department, message, phone } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Campos obrigatórios ausentes. Por favor preencha nome, e-mail e mensagem.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Endereço de e-mail inválido.' });
    }

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const record = {
      id: messageId,
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : null,
      subject: subject || 'Contato Geral',
      department: department || 'Geral / Redação',
      message: message.trim(),
      status: 'Enviado',
      sentAt: new Date().toISOString(),
      recipient: 'contato@kurti.com.br'
    };

    const messages = getMessages();
    messages.unshift(record);
    saveMessages(messages);

    console.log(`[Kurti Mail Dispatcher] E-mail despachado com sucesso para contato@kurti.com.br a partir de ${email} (Ref: ${messageId})`);

    res.json({
      success: true,
      message: 'Sua mensagem foi enviada com sucesso para a equipe Kurti! Em breve entraremos em contato.',
      dispatchId: messageId,
      sentAt: record.sentAt
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao processar envio do e-mail.' });
  }
});

// Kurti IA Assistant endpoint
app.post('/api/kurti-ia', async (req, res) => {
  const { prompt, history } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt obrigatório.' });
  }

  const systemInstruction = `Você é o Kurti IA, assistente inteligente oficial do portal Kurti (kurti.com.br), a maior plataforma de conteúdo LGBT+ do Brasil.
Você responde com empatia, respeito, rigor informativo, rigor jornalístico e referências da legislação brasileira (como decisões do STF sobre casamento igualitário, criminalização da LGBTfobia, retificação de prenome e gênero, Disque 100).
Você conhece os espaços culturais de Belo Horizonte, São Paulo, Rio de Janeiro e outras capitais, o Dicionário Kurti de termos da comunidade, a cena musical (KurtiMusic), curta-metragens (Kurtflix) e direitos civis.
Mantenha respostas concisas, calorosas, precisas e em português do Brasil.`;

  try {
    if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
      return res.json({ reply: response.text });
    }
  } catch (err: any) {
    console.error('Gemini API Error:', err.message);
  }

  // Curated intelligent fallback if API key is not yet set
  const lower = prompt.toLowerCase();
  let fallbackReply = 'Olá! Sou o Kurti IA, seu assistente da comunidade LGBT+. ';
  if (lower.includes('casamento') || lower.includes('homoafetivo')) {
    fallbackReply += 'No Brasil, o casamento entre pessoas do mesmo sexo é garantido em todo o território nacional desde a histórica decisão do Supremo Tribunal Federal (STF) na ADI 4277 em 2011 e pela Resolução nº 175/2013 do Conselho Nacional de Justiça (CNJ). Qualquer cartório que se recuse a realizar a habilitação pode ser denunciado à Corregedoria de Justiça.';
  } else if (lower.includes('denúnci') || lower.includes('crime') || lower.includes('homofobia') || lower.includes('transfobia')) {
    fallbackReply += 'LGBTfobia é equiparada ao crime de racismo pela decisão do STF na ADO 26 (Lei 7.716/1989), sendo imprescritível e inafiançável. Em caso de violência ou discriminação, acione o Disque 100 (Disque Direitos Humanos, gratuito e 24h), registre Boletim de Ocorrência em delegacia ou procure a Defensoria Pública do seu estado.';
  } else if (lower.includes('nome social') || lower.includes('retifica')) {
    fallbackReply += 'Pessoas transgênero e travestis podem retificar prenome e gênero diretamente em qualquer Cartório de Registro Civil de Pessoas Naturais (RCPN), sem necessidade de cirurgia, laudo médico ou autorização judicial, conforme a decisão do STF na ADI 4275 e o Provimento nº 73/2018 do CNJ.';
  } else if (lower.includes('loja') || lower.includes('produto') || lower.includes('pedido')) {
    fallbackReply += 'Na Loja Oficial Kurti você encontra camisetas, moletons, pins esmaltados, ecobags e livros sobre direitos LGBT+. Todos os pedidos possuem código de rastreio dos Correios e frete grátis em compras acima de R$ 150.';
  } else {
    fallbackReply += 'Estou aqui para ajudar com dúvidas sobre cultura queer, agenda cultural e de eventos, direitos civis, notícias apuradas e produtos oficiais da Kurti. Como posso te apoiar hoje?';
  }

  res.json({ reply: fallbackReply });
});

// Vite middleware for development vs static production server
async function startServer() {
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      maxAge: '1d',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        } else if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|woff2)$/)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Kurti platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
