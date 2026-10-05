import React, { useState } from 'react';

export const KurtiLogo: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  useImage?: boolean;
}> = ({ size = 'md', className = '' }) => {
  // Use a imagem original exata fornecida pelo usuário, com fallback local garantido
  const [imgSrc, setImgSrc] = useState('https://kurti-lgbt.vegetadeath.chatgpt.site/kurti-logo.png');

  const heights = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24'
  };

  return (
    <img
      src={imgSrc}
      alt="Kurti"
      width={619}
      height={289}
      decoding="async"
      loading="eager"
      onError={() => {
        if (imgSrc !== '/kurti-logo.png') {
          setImgSrc('/kurti-logo.png');
        }
      }}
      className={`${heights[size]} w-auto object-contain shrink-0 select-none ${className}`}
    />
  );
};
