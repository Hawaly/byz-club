'use client';

import { useState } from 'react';

export default function AnimatedLogo() {
  const [isAnimating, setIsAnimating] = useState(true);

  return (
    <div className="relative group cursor-pointer" onClick={() => setIsAnimating(!isAnimating)}>
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative flex items-center gap-1">
        {/* B */}
        <span 
          className={`text-2xl font-black bg-gradient-to-br from-violet-600 to-fuchsia-600 bg-clip-text text-transparent transition-all duration-500 ${
            isAnimating ? 'animate-bounce-slow' : ''
          }`}
          style={{ animationDelay: '0ms' }}
        >
          B
        </span>
        {/* Y */}
        <span 
          className={`text-2xl font-black bg-gradient-to-br from-fuchsia-600 to-pink-600 bg-clip-text text-transparent transition-all duration-500 ${
            isAnimating ? 'animate-bounce-slow' : ''
          }`}
          style={{ animationDelay: '100ms' }}
        >
          Y
        </span>
        {/* Z */}
        <span 
          className={`text-2xl font-black bg-gradient-to-br from-pink-600 to-orange-600 bg-clip-text text-transparent transition-all duration-500 ${
            isAnimating ? 'animate-bounce-slow' : ''
          }`}
          style={{ animationDelay: '200ms' }}
        >
          Z
        </span>
        {/* Dot */}
        <div className="w-2 h-2 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 animate-pulse ml-0.5"></div>
        {/* CLUB */}
        <span 
          className={`text-2xl font-light bg-gradient-to-br from-orange-600 to-amber-600 bg-clip-text text-transparent transition-all duration-500 ${
            isAnimating ? 'animate-bounce-slow' : ''
          }`}
          style={{ animationDelay: '300ms' }}
        >
          CLUB
        </span>
      </div>
      {/* Creative geometric shapes */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full animate-float opacity-60"></div>
      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-br from-pink-500 to-orange-500 rotate-45 animate-float-delayed opacity-60"></div>
    </div>
  );
}
