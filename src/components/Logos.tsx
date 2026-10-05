import React from 'react';

// =========================================================================
// 1. KURTI OFICIAL - LOGO PRINCIPAL (BADGE CARMESIM #e4004c + K ORIGAMI 3D + 'urti' SLAB SERIF)
// Calibrado 1:1 com a imagem oficial 'logo_beta_1_oficial_png cópiaarestado_OFICIAL_RECORTADO_PRONTO.png'
// =========================================================================
export const KurtiLogo: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'badge' | 'square' | 'clean';
  className?: string;
}> = ({
  size = 'md',
  showSubtitle = true,
  variant = 'badge',
  className = ''
}) => {
  // Proporções exatas 2.05:1 do badge recortado oficial
  const badgeHeights = {
    sm: 'h-8 sm:h-9',
    md: 'h-11 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24'
  };

  const squareSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-11 h-11 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-20 h-20 rounded-2xl'
  };

  if (variant === 'square') {
    return (
      <div
        className={`relative ${squareSizes[size]} bg-[#e4004c] flex items-center justify-center shadow-md shadow-red-600/30 overflow-hidden select-none border border-white/20 shrink-0 ${className}`}
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-2.5 object-contain"
        >
          <defs>
            <filter id="kSqOrigamiShadow2" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="-6" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.5" />
            </filter>
            <filter id="kSqGroundBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <linearGradient id="kSqFoldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="75%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>

          {/* Sombra de chão */}
          <ellipse cx="95" cy="182" rx="72" ry="7" fill="#000000" opacity="0.35" filter="url(#kSqGroundBlur)" />

          {/* 1. Haste Vertical Esquerda */}
          <rect x="26" y="20" width="46" height="152" fill="#ffffff" />

          {/* 2. Braço Superior Direito */}
          <polygon points="72,96 122,20 166,20 90,108" fill="#ffffff" />

          {/* 3. Braço Inferior Direito */}
          <polygon points="72,94 168,172 118,172 50,102" fill="#ffffff" />

          {/* 4. Dobra Origami Frontal 3D */}
          <polygon
            points="26,96 72,20 72,172"
            fill="url(#kSqFoldGrad2)"
            filter="url(#kSqOrigamiShadow2)"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Kurti Cropped Badge SVG (Proporção 2.05:1 idêntico ao arquivo OFICIAL_RECORTADO_PRONTO) */}
      <div
        className={`relative ${badgeHeights[size]} aspect-[512/250] bg-[#e4004c] rounded-[18px] sm:rounded-[22px] overflow-hidden shadow-md shadow-red-600/30 border border-white/20 group hover:shadow-lg hover:shadow-red-500/40 transition-all shrink-0`}
      >
        <svg
          viewBox="0 0 512 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Sombra 3D da folha origami do K (projetada para a esquerda sobre a haste) */}
            <filter id="kOrigamiCutShadow" x="-50%" y="-30%" width="180%" height="160%">
              <feDropShadow dx="-8" dy="3.5" stdDeviation="6" floodColor="#000000" floodOpacity="0.52" />
            </filter>
            {/* Sombra realista esfumada no piso abaixo do K */}
            <filter id="kGroundCutBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
            {/* Gradiente sutil do papel origami do K */}
            <linearGradient id="kFoldCutGrad" x1="10%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>

          {/* Fundo Carmesim Recortado com Cantos Arredondados */}
          <rect width="512" height="250" rx="30" fill="#e4004c" />

          {/* ========================================================================= */}
          {/* SOMBRA DE CHÃO NO PISO ABAIXO DO 'K' (ORIGINAL DO ARQUIVO RECORTADO) */}
          {/* ========================================================================= */}
          <ellipse
            cx="158"
            cy="234"
            rx="85"
            ry="7.5"
            fill="#000000"
            opacity="0.38"
            filter="url(#kGroundCutBlur)"
          />

          {/* ========================================================================= */}
          {/* LETRA 'K' (ORIGAMI 3D OFICIAL KURTI) */}
          {/* ========================================================================= */}
          {/* 1. Haste Vertical Esquerda (Retângulo branco sólido) */}
          <rect x="64" y="18" width="54" height="194" fill="#ffffff" />

          {/* 2. Braço Superior Direito (Diagonal para Cima) */}
          <polygon
            points="118,114 174,18 226,18 140,128"
            fill="#ffffff"
          />

          {/* 3. Braço Inferior Direito (Diagonal para Baixo com base na linha de base) */}
          <polygon
            points="118,112 226,212 168,212 94,124"
            fill="#ffffff"
          />

          {/* 4. Dobra Triangular Origami Frontal (Projeta sombra realista sobre a haste) */}
          <polygon
            points="64,114 118,18 118,212"
            fill="url(#kFoldCutGrad)"
            filter="url(#kOrigamiCutShadow)"
          />

          {/* ========================================================================= */}
          {/* LETRAS 'urti' (SLAB SERIF OFICIAL DA MARCA KURTI) */}
          {/* Linha de base = 212px | Altura x = 138px a 212px */}
          {/* ========================================================================= */}

          {/* --- LETRA 'u' --- */}
          <g fill="#ffffff">
            {/* Haste esquerda com serifa no topo */}
            <rect x="222" y="138" width="18" height="48" />
            <polygon points="214,138 232,138 232,143 214,143" />
            {/* Curva inferior da base */}
            <path d="M222 178 C222 205 235 213 254 213 C273 213 286 205 286 178 V138 H268 V178 C268 190 263 197 254 197 C245 197 240 190 240 178 V138 H222 Z" />
            {/* Haste direita com serifa no topo */}
            <polygon points="268,138 292,138 292,143 268,143" />
          </g>

          {/* --- LETRA 'r' --- */}
          <g fill="#ffffff">
            {/* Haste vertical principal */}
            <rect x="300" y="138" width="18" height="74" />
            {/* Serifa topo esquerdo */}
            <polygon points="293,138 310,138 310,143 293,143" />
            {/* Serifa base inferior */}
            <polygon points="293,207 325,207 325,212 293,212" />
            {/* Arco do 'r' curvado para a direita com gota/terminal encorpado */}
            <path d="M318 152 C325 142 336 137 350 138 V155 C340 154 324 156 324 170 V212 H306 V152 Z" />
            <circle cx="348" cy="147" r="7.5" />
          </g>

          {/* --- LETRA 't' --- */}
          <g fill="#ffffff">
            {/* Haste vertical que sobe acima da linha de altura x */}
            <path d="M380 120 H398 V138 H411 V149 H398 V186 C398 193 402 196 408 196 C411.5 196 414 195 416 193.5 V207.5 C411.5 211 405.5 212 398 212 C384 212 380 203 380 188 V149 H372 V138 H380 V120 Z" />
          </g>

          {/* --- LETRA 'i' --- */}
          <g fill="#ffffff">
            {/* Haste vertical */}
            <rect x="426" y="138" width="18" height="74" />
            {/* Serifa topo */}
            <polygon points="419,138 436,138 436,143 419,143" />
            {/* Serifa base */}
            <polygon points="419,207 451,207 451,212 419,212" />
            {/* Ponto do 'i' levemente inclinado e encorpado */}
            <ellipse cx="435" cy="119" rx="9" ry="8.5" transform="rotate(-6 435 119)" />
          </g>
        </svg>
      </div>

      {/* Subtítulo Institucional */}
      {showSubtitle && (
        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-100 text-[#e4004c] border border-pink-200 shadow-xs">
              Portal BH
            </span>
          </div>
          <p className="text-[11px] text-neutral-600 font-medium tracking-wide">
            Cultura • Noite • Música LGBTQIA+
          </p>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 2. KURTI MUSIC - LOGO OFICIAL (FONE DE OUVIDO DEGRADÊ LARANJA/PINK + 4 BARRAS DE EQUALIZADOR)
// Idêntico aos arquivos: FAVICON.icon.png, 150x70_2022.png, logo 1.jpg, logo 2 PNG.png, icone.jpg
// =========================================================================
export const KurtMusicLogo: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTag?: boolean;
  variant?: 'full' | 'icon' | 'dark';
  className?: string;
}> = ({
  size = 'md',
  showTag = true,
  variant = 'full',
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Símbolo Oficial do Fone Kurti Music */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            {/* Gradiente Oficial: Laranja Vivo (#ff5926 / #ff6d00) até Rosa Pink/Magenta (#ff007f / #e4004c) */}
            <linearGradient id="kmHeadbandGrad" x1="15%" y1="10%" x2="85%" y2="90%">
              <stop offset="0%" stopColor="#ff5926" />
              <stop offset="45%" stopColor="#ff1493" />
              <stop offset="100%" stopColor="#e4004c" />
            </linearGradient>

            {/* Gradiente do Círculo Central */}
            <linearGradient id="kmCircleGrad" x1="30%" y1="10%" x2="70%" y2="90%">
              <stop offset="0%" stopColor="#ff5533" />
              <stop offset="45%" stopColor="#ff007a" />
              <stop offset="100%" stopColor="#d80045" />
            </linearGradient>
          </defs>

          {/* Arco Superior do Fone de Ouvido */}
          <path
            d="M20 54 C20 28 36 14 60 14 C84 14 100 28 100 54"
            stroke="url(#kmHeadbandGrad)"
            strokeWidth="7.5"
            strokeLinecap="round"
          />

          {/* Almofadas / Cápsulas Laterais do Fone (2 segmentos arredondados em cada lado) */}
          {/* Lado Esquerdo - Cápsula Externa */}
          <rect
            x="11"
            y="50"
            width="8"
            height="24"
            rx="4"
            fill="url(#kmHeadbandGrad)"
          />
          {/* Lado Esquerdo - Cápsula Interna */}
          <rect
            x="21"
            y="46"
            width="8.5"
            height="32"
            rx="4.25"
            fill="url(#kmHeadbandGrad)"
          />

          {/* Lado Direito - Cápsula Interna */}
          <rect
            x="90.5"
            y="46"
            width="8.5"
            height="32"
            rx="4.25"
            fill="url(#kmHeadbandGrad)"
          />
          {/* Lado Direito - Cápsula Externa */}
          <rect
            x="101"
            y="50"
            width="8"
            height="24"
            rx="4"
            fill="url(#kmHeadbandGrad)"
          />

          {/* Círculo Central Preenchido com Degradê Laranja-Pink */}
          <circle
            cx="60"
            cy="62"
            r="31"
            fill="url(#kmCircleGrad)"
          />

          {/* 4 Barras Verticais Brancas do Equalizador / Onda Sonora (Extremidades Arredondadas) */}
          {/* Barra 1 (Esquerda - Média Baixa) */}
          <rect
            x="40"
            y="52"
            width="7.5"
            height="20"
            rx="3.75"
            fill="#ffffff"
          />
          {/* Barra 2 (Centro-Esquerda - Média Alta) */}
          <rect
            x="50"
            y="43"
            width="7.5"
            height="38"
            rx="3.75"
            fill="#ffffff"
          />
          {/* Barra 3 (Centro - Mais Alta) */}
          <rect
            x="60"
            y="35"
            width="7.5"
            height="54"
            rx="3.75"
            fill="#ffffff"
          />
          {/* Barra 4 (Centro-Direita - Média Alta) */}
          <rect
            x="70"
            y="43"
            width="7.5"
            height="38"
            rx="3.75"
            fill="#ffffff"
          />
          {/* Barra 5 (Direita - Média Baixa) */}
          <rect
            x="80"
            y="52"
            width="7.5"
            height="20"
            rx="3.75"
            fill="#ffffff"
          />
        </svg>
      </div>

      {/* Tipografia Oficial: KURTI MUSIC */}
      {variant !== 'icon' && (
        <div>
          <div className="flex items-center gap-1.5">
            <span className={`${titleSizes[size]} font-black tracking-wide ${variant === 'dark' ? 'text-white' : 'text-neutral-950'} leading-none`}>
              KURTI <span className="bg-gradient-to-r from-[#ff1493] to-[#ff4500] bg-clip-text text-transparent">MUSIC</span>
            </span>
            {showTag && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-pink-100 text-[#e4004c] font-bold border border-pink-200">
                SELO & PLAYER
              </span>
            )}
          </div>
          <p className={`text-[11px] ${variant === 'dark' ? 'text-neutral-300' : 'text-neutral-500'} font-medium tracking-wide`}>
            Streaming & Apoio à Música Independente
          </p>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 3. KURTI MUSIC APP ICON (FAVICON & APP STORE ICON SQUIRCLE)
// Idêntico a FAVICON.icon.png e icone.jpg
// =========================================================================
export const KurtMusicFaviconIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = ''
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-2xl bg-white p-1 border-2 border-pink-500/80 shadow-md shadow-pink-500/20 flex items-center justify-center select-none overflow-hidden ${className}`}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="favHeadbandGrad" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#ff5926" />
            <stop offset="45%" stopColor="#ff1493" />
            <stop offset="100%" stopColor="#e4004c" />
          </linearGradient>
          <linearGradient id="favCircleGrad" x1="30%" y1="10%" x2="70%" y2="90%">
            <stop offset="0%" stopColor="#ff5533" />
            <stop offset="45%" stopColor="#ff007a" />
            <stop offset="100%" stopColor="#d80045" />
          </linearGradient>
        </defs>

        <path
          d="M20 54 C20 28 36 14 60 14 C84 14 100 28 100 54"
          stroke="url(#favHeadbandGrad)"
          strokeWidth="8"
          strokeLinecap="round"
        />

        <rect x="11" y="50" width="8" height="24" rx="4" fill="url(#favHeadbandGrad)" />
        <rect x="21" y="46" width="8.5" height="32" rx="4.25" fill="url(#favHeadbandGrad)" />
        <rect x="90.5" y="46" width="8.5" height="32" rx="4.25" fill="url(#favHeadbandGrad)" />
        <rect x="101" y="50" width="8" height="24" rx="4" fill="url(#favHeadbandGrad)" />

        <circle cx="60" cy="62" r="31" fill="url(#favCircleGrad)" />

        <rect x="40" y="52" width="7.5" height="20" rx="3.75" fill="#ffffff" />
        <rect x="50" y="43" width="7.5" height="38" rx="3.75" fill="#ffffff" />
        <rect x="60" y="35" width="7.5" height="54" rx="3.75" fill="#ffffff" />
        <rect x="70" y="43" width="7.5" height="38" rx="3.75" fill="#ffffff" />
        <rect x="80" y="52" width="7.5" height="20" rx="3.75" fill="#ffffff" />
      </svg>
    </div>
  );
};

// =========================================================================
// 4. CIA DA BALADA LOGO (BARES, FESTAS & FERVO DE BH)
// =========================================================================
export const CiaDaBaladaLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-2xl bg-gradient-to-br from-[#ff1493] via-[#e4004c] to-[#ff4500] p-2 text-white shadow-md shadow-pink-500/25 flex items-center justify-center border border-white/20`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
          <circle cx="50" cy="46" r="32" stroke="#ffffff" strokeWidth="4" />
          <path d="M22 46 H78 M50 14 V78 M30 26 C40 38 40 54 30 66 M70 26 C60 38 60 54 70 66" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.85" />
          <circle cx="74" cy="22" r="4.5" fill="#fef08a" />
          <path d="M74 14 V30 M66 22 H82" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
            Cia da <span className="bg-gradient-to-r from-[#ff1493] to-[#ff4500] bg-clip-text text-transparent">Balada</span>
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold border border-rose-200">
            BH
          </span>
        </div>
        <p className="text-[11px] text-neutral-500 font-medium tracking-wide">
          Bares, Baladas & Fervos em Beagá
        </p>
      </div>
    </div>
  );
};

// =========================================================================
// 5. KURTFLIX LOGO (CINEMA & STREAMING LGBTQIA+)
// =========================================================================
export const KurtflixLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-2xl bg-gradient-to-br from-[#e4004c] via-rose-600 to-[#ff4500] p-2 text-white shadow-md shadow-red-500/25 flex items-center justify-center border border-white/20`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
          <rect x="18" y="24" width="64" height="52" rx="8" fill="#ffffff" fillOpacity="0.25" stroke="#ffffff" strokeWidth="3.5" />
          <path d="M43 38 L67 50 L43 62 Z" fill="#ffffff" />
          <rect x="24" y="16" width="9" height="6" rx="1.5" fill="#ffffff" />
          <rect x="39" y="16" width="9" height="6" rx="1.5" fill="#ffffff" />
          <rect x="54" y="16" width="9" height="6" rx="1.5" fill="#ffffff" />
          <rect x="69" y="16" width="9" height="6" rx="1.5" fill="#ffffff" />
        </svg>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 uppercase">
            KURT<span className="text-[#e4004c]">FLIX</span>
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold border border-rose-200">
            STREAMING
          </span>
        </div>
        <p className="text-[11px] text-neutral-500 font-medium tracking-wide">
          Cinema Queer & Produções Nacionais
        </p>
      </div>
    </div>
  );
};

// =========================================================================
// 6. ESPAÇO DELAS LOGO (SÁFICA & VISIBILIDADE LÉSBICA/BI)
// =========================================================================
export const EspacoDelasLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-2xl bg-gradient-to-br from-[#ff1493] via-rose-500 to-amber-400 p-2 text-white shadow-md shadow-pink-400/25 flex items-center justify-center border border-white/20`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
          <circle cx="38" cy="38" r="18" stroke="#ffffff" strokeWidth="4" />
          <path d="M38 56 V76 M28 66 H48" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
          <circle cx="62" cy="38" r="18" stroke="#ffffff" strokeWidth="4" />
          <path d="M62 56 V76 M52 66 H72" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
          <path d="M50 36 C50 30 45 26 40 28 C35 30 35 36 50 48 C65 36 65 30 60 28 C55 26 50 30 50 36 Z" fill="#ffffff" />
        </svg>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
            Espaço <span className="bg-gradient-to-r from-[#ff1493] to-rose-600 bg-clip-text text-transparent">Delas</span>
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold border border-pink-200">
            Sáfica
          </span>
        </div>
        <p className="text-[11px] text-neutral-500 font-medium tracking-wide">
          Cultura Lésbica, Bissexual & Encontros
        </p>
      </div>
    </div>
  );
};

// =========================================================================
// 7. KURTI+ LOGO (LIFESTYLE, ESPORTES & MODA)
// =========================================================================
export const KurtiPlusLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-[#ff1493] p-2 text-white shadow-md shadow-amber-500/25 flex items-center justify-center border border-white/20`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
          <circle cx="50" cy="50" r="38" stroke="#ffffff" strokeWidth="4.5" />
          <path d="M50 24 V76 M24 50 H76" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
            Kurti<span className="bg-gradient-to-r from-amber-500 to-[#ff1493] bg-clip-text text-transparent">+</span>
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
            LIFESTYLE
          </span>
        </div>
        <p className="text-[11px] text-neutral-500 font-medium tracking-wide">
          Esportes • Moda • Pajubá • Culinária
        </p>
      </div>
    </div>
  );
};

// =========================================================================
// 8. CULTURA LOGO (TEATRO, CINEMA & LITERATURA)
// =========================================================================
export const CulturaLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-[#ff1493] p-2 text-white shadow-md shadow-purple-500/25 flex items-center justify-center border border-white/20`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
          <path d="M22 35 C22 22 42 22 42 35 C42 55 22 55 22 35 Z" stroke="#ffffff" strokeWidth="3.5" />
          <circle cx="30" cy="32" r="2.5" fill="#ffffff" />
          <circle cx="36" cy="32" r="2.5" fill="#ffffff" />
          <path d="M28 42 Q32 46 36 42" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

          <path d="M58 48 C58 35 78 35 78 48 C78 68 58 68 58 48 Z" stroke="#ffffff" strokeWidth="3.5" />
          <circle cx="66" cy="45" r="2.5" fill="#ffffff" />
          <circle cx="72" cy="45" r="2.5" fill="#ffffff" />
          <path d="M66 57 Q70 53 74 57" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
            Cultura <span className="bg-gradient-to-r from-purple-600 to-[#ff1493] bg-clip-text text-transparent">BH</span>
          </span>
        </div>
        <p className="text-[11px] text-neutral-500 font-medium tracking-wide">
          Cinema • Teatro • Literatura em Cartaz
        </p>
      </div>
    </div>
  );
};

// =========================================================================
// 9. NOTÍCIAS LOGO (JORNALISMO & ATUALIZAÇÃO DIÁRIA)
// =========================================================================
export const NoticiasLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-2xl bg-gradient-to-br from-amber-500 via-[#e4004c] to-indigo-600 p-2 text-white shadow-md shadow-amber-500/25 flex items-center justify-center border border-white/20`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
          <rect x="20" y="24" width="60" height="52" rx="8" stroke="#ffffff" strokeWidth="4" fill="#ffffff" fillOpacity="0.25" />
          <rect x="28" y="32" width="20" height="16" rx="3" fill="#ffffff" />
          <path d="M54 34 H72 M54 42 H72 M28 56 H72 M28 64 H60" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
            Kurti <span className="bg-gradient-to-r from-amber-600 via-[#e4004c] to-[#ff1493] bg-clip-text text-transparent">Notícias</span>
          </span>
          <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Diário
          </span>
        </div>
        <p className="text-[11px] text-neutral-500 font-medium tracking-wide">
          Direitos, Cultura Pop & Famosos
        </p>
      </div>
    </div>
  );
};

// =========================================================================
// 10. DENUNCIE LOGO (DIREITOS & SOS CONTRA HOMOFOBIA/TRANSFOBIA)
// =========================================================================
export const DenuncieLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-2xl bg-gradient-to-br from-red-600 to-[#e4004c] p-2 text-white shadow-md shadow-red-500/30 flex items-center justify-center border border-white/20`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
          <path d="M50 16 L80 28 V52 C80 72 50 86 50 86 C50 86 20 72 20 52 V28 L50 16 Z" stroke="#ffffff" strokeWidth="4" fill="#ffffff" fillOpacity="0.25" />
          <path d="M50 36 V54 M50 64 H50.02" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
            Canal <span className="text-red-600">Denuncie</span>
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold border border-red-200">
            ACOLHIMENTO
          </span>
        </div>
        <p className="text-[11px] text-neutral-500 font-medium tracking-wide">
          Apoio Jurídico & Proteção Comunitária
        </p>
      </div>
    </div>
  );
};

