import React from 'react';

interface ZenPayLogoProps {
  size?: number;
  className?: string;
}

export const ZenPayLogo: React.FC<ZenPayLogoProps> = ({ size = 48, className = '' }) => {
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="w-full h-full bg-[#0a0a0b] rounded-2xl flex items-center justify-center shadow-lg">
        <span 
          className="font-black text-[#bff45d] italic tracking-tighter"
          style={{ fontSize: size * 0.28 }}
        >
          ZP
        </span>
      </div>
    </div>
  );
};
