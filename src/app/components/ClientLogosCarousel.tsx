'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ClientLogo {
  readonly src: string;
  readonly alt: string;
}

interface ClientLogosCarouselProps {
  logos: ReadonlyArray<ClientLogo>;
}

export default function ClientLogosCarousel({ logos }: ClientLogosCarouselProps) {
  const [visibleCount, setVisibleCount] = useState(4);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calculer le nombre de logos visibles selon la taille d'écran
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(2);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const [canGoPrev, setCanGoPrev] = useState(false);
  const [canGoNext, setCanGoNext] = useState(true);

  // Mettre à jour l'état des boutons lors du scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateButtons = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanGoPrev(scrollLeft > 10); // 10px de tolérance
      setCanGoNext(scrollLeft < scrollWidth - clientWidth - 10);
    };

    updateButtons();
    container.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    
    return () => {
      container.removeEventListener('scroll', updateButtons);
      window.removeEventListener('resize', updateButtons);
    };
  }, [logos.length]);

  const goToPrev = () => {
    if (!scrollContainerRef.current || !canGoPrev) return;
    const container = scrollContainerRef.current;
    const itemWidth = container.children[0]?.clientWidth || 0;
    const gap = parseInt(getComputedStyle(container).gap) || 0;
    const scrollAmount = (itemWidth + gap) * Math.min(visibleCount, 2);
    
    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth',
    });
  };

  const goToNext = () => {
    if (!scrollContainerRef.current || !canGoNext) return;
    const container = scrollContainerRef.current;
    const itemWidth = container.children[0]?.clientWidth || 0;
    const gap = parseInt(getComputedStyle(container).gap) || 0;
    const scrollAmount = (itemWidth + gap) * Math.min(visibleCount, 2);
    
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative px-12 sm:px-16 md:px-20 overflow-visible">
      {/* Bouton précédent - plus visible */}
      <button
        onClick={goToPrev}
        disabled={!canGoPrev}
        aria-label="Logo précédent"
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-orange-500/40 bg-white shadow-xl transition-all duration-200 active:scale-90 sm:hover:scale-110 sm:hover:bg-orange-50 sm:hover:border-orange-500/60 sm:hover:shadow-2xl sm:hover:shadow-orange-500/40 disabled:opacity-20 disabled:cursor-not-allowed group`}
      >
        <svg
          className="h-5 w-5 sm:h-5 sm:w-5 text-orange-600 transition-colors duration-200 group-hover:text-orange-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Conteneur de défilement - optimisé mobile */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory py-2 sm:py-4"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
      >
        {logos.map((logo, index) => (
          <div
            key={logo.alt}
            className="group relative flex items-center justify-center flex-shrink-0 h-20 sm:h-24 md:h-28 w-32 sm:w-40 md:w-48 p-4 sm:p-5 rounded-xl border-2 border-white/70 bg-white/80 backdrop-blur-xl transition-all duration-300 active:scale-95 sm:hover:border-orange-500/50 sm:hover:bg-white sm:hover:shadow-2xl sm:hover:shadow-orange-500/20 sm:hover:scale-105 snap-center animate-fade-up shadow-md"
            style={{ animationDelay: `${300 + index * 50}ms` }}
          >
            {/* Glow effect au hover - desktop only */}
            <div className="hidden sm:block absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/0 to-orange-400/0 opacity-0 group-hover:from-orange-500/15 group-hover:to-orange-400/10 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
            
            <Image
              src={logo.src}
              alt={logo.alt}
              width={140}
              height={90}
              className="max-w-full max-h-full w-auto h-auto object-contain opacity-75 grayscale-[30%] group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300 relative z-10 drop-shadow-sm"
            />
          </div>
        ))}
      </div>

      {/* Bouton suivant - plus visible */}
      <button
        onClick={goToNext}
        disabled={!canGoNext}
        aria-label="Logo suivant"
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-orange-500/40 bg-white shadow-xl transition-all duration-200 active:scale-90 sm:hover:scale-110 sm:hover:bg-orange-50 sm:hover:border-orange-500/60 sm:hover:shadow-2xl sm:hover:shadow-orange-500/40 disabled:opacity-20 disabled:cursor-not-allowed group`}
      >
        <svg
          className="h-5 w-5 sm:h-5 sm:w-5 text-orange-600 transition-colors duration-200 group-hover:text-orange-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

    </div>
  );
}

