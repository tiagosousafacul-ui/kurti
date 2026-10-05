import { Product, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-krt-001',
    name: 'Camiseta Kurti "Orgulho & Luta"',
    category: 'Vestuário',
    price: 89.9,
    originalPrice: 119.9,
    rating: 4.9,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 48,
    description: 'Camiseta oficial Kurti confeccionada em algodão 100% penteado fio 30.1. Modelagem unissex confortável com estampa silk screen de alta durabilidade e cores vibrantes da bandeira do orgulho.',
    details: [
      '100% Algodão penteado sustentável BCI',
      'Gola canelada reforçada e costura ombro a ombro',
      'Estampa resistente a lavagens, não desbota',
      'Produzido no Brasil com remuneração justa'
    ],
    sizes: ['PP', 'P', 'M', 'G', 'GG', 'XG'],
    badge: 'Mais Vendido'
  },
  {
    id: 'prod-krt-002',
    name: 'Moletom Canguru Kurti LGBT Clássico',
    category: 'Vestuário',
    price: 189.9,
    originalPrice: 229.0,
    rating: 5.0,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 26,
    description: 'Moletom 3 cabos felpado super macio e quentinho. Capuz forrado com cordão regulador e bordado sutil com a tipografia e o arco-íris da Kurti no peito.',
    details: [
      'Algodão 50% e Poliéster 50% com felpa interna',
      'Bolso canguru frontal e punhos elásticos',
      'Capuz duplo ajustável',
      'Bordado de alta precisão'
    ],
    sizes: ['P', 'M', 'G', 'GG'],
    badge: 'Destaque'
  },
  {
    id: 'prod-krt-003',
    name: 'Boné Strapback "Amor é Amor"',
    category: 'Acessórios',
    price: 69.9,
    originalPrice: 85.0,
    rating: 4.8,
    reviewsCount: 67,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 35,
    description: 'Boné aba curva em sarja 100% algodão premium na cor preta, com fecho strapback em fivela de metal antioxidante e bordado exclusivo.',
    details: [
      'Tecido sarja peletizada 100% algodão',
      'Regulagem traseira fita e fivela metálica',
      'Circunferência ajustável de 54cm a 62cm',
      'Design minimalista de alta elegância'
    ],
    badge: 'Novo'
  },
  {
    id: 'prod-krt-004',
    name: 'Ecobag Algodão Cru "Orgulho Não Cabe no Armário"',
    category: 'Acessórios',
    price: 45.0,
    rating: 4.9,
    reviewsCount: 110,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 75,
    description: 'Ecobag ecológica em lona de algodão cru 100% reciclado com alça resistente de 60cm, perfeita para o dia a dia, faculdade, compras e eventos.',
    details: [
      'Lona 100% algodão natural sem alvejantes químicos',
      'Dimensões: 40cm x 38cm com fundo sanfonado de 8cm',
      'Suporta até 12kg com segurança',
      'Estampa à base de água ecológica'
    ],
    badge: 'Ecológico'
  },
  {
    id: 'prod-krt-005',
    name: 'Pin Colecionável Metal Esmaltado Kurti Rainbow',
    category: 'Colecionáveis',
    price: 24.9,
    rating: 5.0,
    reviewsCount: 204,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 120,
    description: 'Pin metálico esmaltado artesanalmente com banho niquelado brilhante e tarraxa de silicone antialérgica. Perfeito para jaquetas, mochilas e cordões.',
    details: [
      'Metal zamac fundido e banho niquelado',
      'Esmaltação colorida vítrea polida à mão',
      'Fecho duplo de silicone para maior fixação',
      'Tamanho: 32mm x 25mm'
    ],
    badge: 'Coleção'
  },
  {
    id: 'prod-krt-006',
    name: 'Pin Metal Esmaltado Bandeira Transgender',
    category: 'Colecionáveis',
    price: 24.9,
    rating: 4.9,
    reviewsCount: 95,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 88,
    description: 'Pin colecionável com as cores azul claro, rosa e branco da bandeira trans, esmaltado com bordas douradas e alta definição.',
    details: [
      'Metal nobre com banho ouro brilhante',
      'Tarraxa emborrachada de segurança',
      'Resistente à oxidação e umidade',
      'Tamanho: 30mm x 20mm'
    ]
  },
  {
    id: 'prod-krt-007',
    name: 'Caneca Cerâmica 350ml "Café com Orgulho"',
    category: 'Acessórios',
    price: 42.0,
    originalPrice: 52.0,
    rating: 4.8,
    reviewsCount: 78,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 42,
    description: 'Caneca de cerâmica resinada classe AAA com alça ergonômica. Pode ir ao micro-ondas e lava-louças mantendo o brilho e a nitidez das cores.',
    details: [
      'Capacidade: 350ml',
      'Material: Cerâmica AAA de alto brilho',
      'Sublimação térmica de alta fidelidade',
      'Acompanha caixinha de presente personalizada'
    ]
  },
  {
    id: 'prod-krt-008',
    name: 'Livro: Guia Histórico e Direitos LGBT+ no Brasil',
    category: 'Papelaria & Livros',
    price: 59.9,
    originalPrice: 75.0,
    rating: 5.0,
    reviewsCount: 63,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 30,
    description: 'Obra essencial e documentada com marcos históricos, decisões judiciais históricas (casamento civil, retificação de nome, criminalização da homofobia) e cronologia do movimento queer brasileiro.',
    details: [
      '280 páginas em papel Pólen Soft 80g',
      'Capa com orelhas e acabamento fosco com verniz localizado',
      'Prefácio com lideranças e ativistas nacionais',
      'Edição revisada e ampliada 2026'
    ],
    badge: 'Essencial'
  },
  {
    id: 'prod-krt-009',
    name: 'Bandeira do Orgulho LGBT+ Progressiva (90x150cm)',
    category: 'Acessórios',
    price: 49.9,
    originalPrice: 65.0,
    rating: 4.9,
    reviewsCount: 154,
    image: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 65,
    description: 'Bandeira em poliéster acetinado de alta densidade com ilhoses metálicos para mastro ou decoração de ambientes. Design Progress Pride com chevron trans e antirracista.',
    details: [
      'Tamanho padrão: 90cm x 150cm',
      'Tecido 100% poliéster resistente a ventos e intempéries',
      '2 Ilhoses de latão antioxidante reforçados',
      'Cores vibrantes com dupla face visível'
    ]
  },
  {
    id: 'prod-krt-010',
    name: 'Caderno Pautado Capa Dura "Vozes Livres" + Caneta',
    category: 'Papelaria & Livros',
    price: 38.0,
    rating: 4.7,
    reviewsCount: 44,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 50,
    description: 'Caderno artesanal tamanho A5 (14x21cm) com capa dura revestida, fita marcadora em cetim e elástico de fechamento. 160 páginas para estudos, diários e poesias.',
    details: [
      'Miolo pautado em papel marfim 90g (não vaza caneta)',
      'Bolso interno porta-documentos',
      'Acompanha caneta em gel preta com clip metálico',
      'Cantos arredondados elegantes'
    ]
  },
  {
    id: 'prod-krt-011',
    name: 'Garrafa Térmica Inox 500ml Pride Edition',
    category: 'Acessórios',
    price: 79.9,
    originalPrice: 99.0,
    rating: 4.9,
    reviewsCount: 52,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 28,
    description: 'Garrafa térmica com parede dupla de aço inoxidável e isolamento a vácuo. Mantém bebidas geladas por até 24 horas ou quentes por até 12 horas sem transpirar externamente.',
    details: [
      'Aço inox 304 livre de BPA e toxinas',
      'Tampa hermética com anel de vedação de silicone',
      'Acabamento fosco soft-touch antiderrapante',
      'Capacidade: 500ml'
    ]
  },
  {
    id: 'prod-krt-012',
    name: 'Cropped Kurti "Resistir & Florescer"',
    category: 'Vestuário',
    price: 74.9,
    originalPrice: 89.0,
    rating: 4.8,
    reviewsCount: 71,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 38,
    description: 'Cropped em malha canelada de algodão com elastano, com caimento perfeito, gola alta estilizada e bordado tipográfico floral exclusivo Kurti.',
    details: [
      '96% Algodão e 4% Elastano toque macio',
      'Modelagem moderna e flexível',
      'Não deforma após as lavagens',
      'Fabricação sustentável e nacional'
    ],
    sizes: ['PP', 'P', 'M', 'G', 'GG']
  }
];

export const MIGRATED_ORDERS: Order[] = [
  {
    id: 'ord-1082',
    orderNumber: 'KRT-1082',
    customerName: 'Lucas Albuquerque Souza',
    customerEmail: 'lucas.albuquerque@gmail.com',
    customerPhone: '(31) 99841-2290',
    shippingAddress: {
      street: 'Rua Sergipe',
      number: '840',
      neighborhood: 'Savassi',
      city: 'Belo Horizonte',
      state: 'MG',
      cep: '30130-171'
    },
    items: [
      {
        productId: 'prod-krt-001',
        productName: 'Camiseta Kurti "Orgulho & Luta"',
        price: 89.9,
        quantity: 1,
        size: 'M',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'
      },
      {
        productId: 'prod-krt-005',
        productName: 'Pin Colecionável Metal Esmaltado Kurti Rainbow',
        price: 24.9,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 139.7,
    shipping: 14.9,
    total: 154.6,
    paymentMethod: 'PIX',
    status: 'Entregue',
    trackingCode: 'BR849201934MG',
    createdAt: '2026-09-02T14:22:00-03:00',
    updatedAt: '2026-09-06T11:15:00-03:00'
  },
  {
    id: 'ord-1081',
    orderNumber: 'KRT-1081',
    customerName: 'Beatriz Martins Nogueira',
    customerEmail: 'bia.martins@outlook.com',
    customerPhone: '(11) 98712-4433',
    shippingAddress: {
      street: 'Alameda Santos',
      number: '1205',
      neighborhood: 'Cerqueira César',
      city: 'São Paulo',
      state: 'SP',
      cep: '01419-001'
    },
    items: [
      {
        productId: 'prod-krt-002',
        productName: 'Moletom Canguru Kurti LGBT Clássico',
        price: 189.9,
        quantity: 1,
        size: 'G',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80'
      },
      {
        productId: 'prod-krt-004',
        productName: 'Ecobag Algodão Cru "Orgulho Não Cabe no Armário"',
        price: 45.0,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 234.9,
    shipping: 0.0,
    total: 234.9,
    paymentMethod: 'Cartão de Crédito',
    status: 'Em transporte',
    trackingCode: 'BR910248591SP',
    createdAt: '2026-09-05T09:41:00-03:00',
    updatedAt: '2026-09-08T16:00:00-03:00'
  },
  {
    id: 'ord-1080',
    orderNumber: 'KRT-1080',
    customerName: 'Mariana Duarte Costa',
    customerEmail: 'mari.costa@gmail.com',
    customerPhone: '(21) 97155-8092',
    shippingAddress: {
      street: 'Rua Visconde de Pirajá',
      number: '310',
      neighborhood: 'Ipanema',
      city: 'Rio de Janeiro',
      state: 'RJ',
      cep: '22410-000'
    },
    items: [
      {
        productId: 'prod-krt-008',
        productName: 'Livro: Guia Histórico e Direitos LGBT+ no Brasil',
        price: 59.9,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
      },
      {
        productId: 'prod-krt-007',
        productName: 'Caneca Cerâmica 350ml "Café com Orgulho"',
        price: 42.0,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 101.9,
    shipping: 12.0,
    total: 113.9,
    paymentMethod: 'PIX',
    status: 'Processando',
    trackingCode: 'BR740192847RJ',
    createdAt: '2026-09-08T18:10:00-03:00',
    updatedAt: '2026-09-09T08:30:00-03:00'
  },
  {
    id: 'ord-1079',
    orderNumber: 'KRT-1079',
    customerName: 'Gabriel Ferreira Mendes',
    customerEmail: 'gabriel.mendes@uol.com.br',
    customerPhone: '(41) 99120-7764',
    shippingAddress: {
      street: 'Rua XV de Novembro',
      number: '920',
      neighborhood: 'Centro',
      city: 'Curitiba',
      state: 'PR',
      cep: '80020-310'
    },
    items: [
      {
        productId: 'prod-krt-003',
        productName: 'Boné Strapback "Amor é Amor"',
        price: 69.9,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80'
      },
      {
        productId: 'prod-krt-009',
        productName: 'Bandeira do Orgulho LGBT+ Progressiva (90x150cm)',
        price: 49.9,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=800&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 119.8,
    shipping: 15.0,
    total: 134.8,
    paymentMethod: 'Cartão de Crédito',
    status: 'Entregue',
    trackingCode: 'BR661029348PR',
    createdAt: '2026-08-28T11:05:00-03:00',
    updatedAt: '2026-09-01T15:20:00-03:00'
  }
];
