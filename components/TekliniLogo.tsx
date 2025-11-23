import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const TekliniLogo: React.FC<LogoProps> = ({ className = "w-10 h-10", showText = true }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
      >
        <defs>
          <linearGradient id="silverGrad" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          <linearGradient id="blueGrad" x1="100" y1="0" x2="0" y2="100">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="1" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        {/* Abstract "K" / "X" shape inspired by the uploaded logo */}
        <g filter="url(#dropShadow)">
          {/* Dark Blue Left Chevron */}
          <path 
            d="M 20 25 L 45 25 L 30 50 L 15 75 L -10 75 L 5 50 Z" 
            fill="url(#blueGrad)" 
            transform="translate(10,0)"
          />
          {/* Top Right Blue Element */}
          <path 
            d="M 50 25 L 75 25 L 90 50 L 75 75 L 50 75 L 65 50 Z" 
            fill="url(#blueGrad)" 
            transform="rotate(180 50 50) translate(10, 0)"
          />
          
          {/* Silver Intersecting Element */}
          <path 
            d="M 40 40 L 65 40 L 85 75 L 60 75 Z" 
            fill="url(#silverGrad)" 
          />
          <path 
             d="M 40 40 L 60 40 L 40 75 L 20 75 Z"
             fill="#CBD5E1"
             opacity="0.8"
          />
        </g>
      </svg>
      
      {showText && (
        <div className="flex flex-col justify-center">
          <h1 className="text-xl font-bold tracking-tight text-white leading-none font-sans">
            TEKLINI
          </h1>
          <p className="text-[10px] text-teklini-300 tracking-[0.2em] uppercase font-medium mt-1">
            Technologies
          </p>
        </div>
      )}
    </div>
  );
};