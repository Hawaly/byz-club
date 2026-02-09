'use client';

import { memo, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { FORMAT_CARDS, ADDITIONAL_VIDEOS, FORMATS } from '../data/constants';
import VideoPlayer from '../components/VideoPlayer';
import { SparkleIcon, ArrowRightIcon } from '../components/Icons';

function SocialBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="glass-base inline-block cursor-pointer rounded-full px-4 py-2 text-[var(--accent)] glass-hover-accent transition-all duration-200 active:scale-95 sm:hover:scale-105 sm:hover:shadow-lg relative overflow-hidden group">
      {/* Effet shimmer au hover - desktop only */}
      <div className="hidden sm:block absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <span className="relative z-10">{children}</span>
    </span>
  );
}

function FormatsSection() {
  const allVideos = [...FORMAT_CARDS, ...ADDITIONAL_VIDEOS];
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canGoPrev, setCanGoPrev] = useState(false);
  const [canGoNext, setCanGoNext] = useState(true);

  // Mettre à jour l'état des boutons lors du scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateButtons = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanGoPrev(scrollLeft > 10);
      setCanGoNext(scrollLeft < scrollWidth - clientWidth - 10);
      
      // Calculer l'index actuel
      const itemWidth = container.children[0]?.clientWidth || 0;
      const gap = parseInt(getComputedStyle(container).gap) || 0;
      const itemWithGap = itemWidth + gap;
      const newIndex = Math.round(scrollLeft / itemWithGap);
      setCurrentIndex(newIndex);
    };

    updateButtons();
    container.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', updateButtons);
      window.removeEventListener('resize', updateButtons);
    };
  }, []);

  const goToPrev = () => {
    if (!scrollContainerRef.current || !canGoPrev) return;
    const container = scrollContainerRef.current;
    const itemWidth = container.children[0]?.clientWidth || 0;
    const gap = parseInt(getComputedStyle(container).gap) || 0;
    
    container.scrollBy({
      left: -(itemWidth + gap),
      behavior: 'smooth',
    });
  };

  const goToNext = () => {
    if (!scrollContainerRef.current || !canGoNext) return;
    const container = scrollContainerRef.current;
    const itemWidth = container.children[0]?.clientWidth || 0;
    const gap = parseInt(getComputedStyle(container).gap) || 0;
    
    container.scrollBy({
      left: itemWidth + gap,
      behavior: 'smooth',
    });
  };

  const goToSlide = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const itemWidth = container.children[0]?.clientWidth || 0;
    const gap = parseInt(getComputedStyle(container).gap) || 0;
    
    container.scrollTo({
      left: (itemWidth + gap) * index,
      behavior: 'smooth',
    });
  };

  return (
    <section id="cases" className="relative overflow-hidden px-4 py-14 sm:px-5 sm:py-20 md:px-6 md:py-24 section scroll-mt-16 sm:scroll-mt-28 md:scroll-mt-32">
      {/* Gradients précisément placés derrière les éléments interactifs */}

      {/* Glow précis derrière le titre de section */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[8%] -translate-x-1/2 w-[70%] max-w-2xl h-[150px] md:h-[170px] bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.08),_rgba(255,237,213,0.12)_40%,_transparent_80%)] blur-2xl opacity-75 animate-breathing" style={{ animationDuration: '12s' }} />
      
      {/* Glow derrière les filtres/tags (plateformes) */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2 w-[400px] h-[90px] bg-[radial-gradient(ellipse_at_center,_rgba(253,89,4,0.07),_transparent_75%)] blur-2xl opacity-60 animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Glow derrière la grille de vidéos - 1er card */}
      <div aria-hidden className="pointer-events-none absolute left-[30%] top-[42%] w-[280px] h-[350px] md:h-[380px] bg-[radial-gradient(ellipse_at_center,_rgba(253,89,4,0.08),_transparent_70%)] blur-3xl opacity-60 animate-float-slow" style={{ animationDuration: '15s', animationDelay: '1s' }} />
      
      {/* Glow derrière la grille de vidéos - 2e card */}
      <div aria-hidden className="pointer-events-none hidden md:block absolute right-[30%] top-[45%] w-[280px] h-[320px] bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.06),_rgba(255,237,213,0.08)_40%,_transparent_75%)] blur-3xl opacity-50 animate-float-slow" style={{ animationDuration: '18s', animationDelay: '3s' }} />
      
      {/* Glow précis derrière le CTA final */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 bottom-[8%] -translate-x-1/2 w-[300px] h-[100px] bg-[radial-gradient(ellipse_at_center,_rgba(253,89,4,0.15),_transparent_70%)] blur-2xl opacity-80 animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      <div className="relative mx-auto max-w-4xl text-center px-1 sm:px-2 md:px-0">
        <h2 className="text-[1.75rem] leading-[1.15] sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-gray-900 animate-fade-up" style={{ animationDelay: '100ms' }}>
          L&apos;accompagnement vidéo qui performe vraiment en <span className="bg-gradient-to-r from-[var(--orange-600)] to-[var(--orange-500)] bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">2025</span> 🏅
        </h2>
        <p className="mt-5 sm:mt-6 text-base sm:text-base md:text-lg leading-[1.7] text-gray-700 px-1 font-semibold animate-fade-up" style={{ animationDelay: '200ms' }}>
          Elles ont augmenté la visibilité, l&apos;engagement et les ventes de nos clients.
        </p>
        {/* Filtres - Hiérarchie claire Plateformes vs Styles */}
        <div className="mt-8 sm:mt-10 space-y-5 sm:space-y-6">
          {/* Plateformes */}
          <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
            <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">Plateformes utilisées</p>
            <div className="flex flex-wrap justify-center gap-3 text-xs sm:text-xs font-bold uppercase tracking-wide">
              <SocialBadge>Instagram</SocialBadge>
              <SocialBadge>TikTok</SocialBadge>
            </div>
          </div>
          
          {/* Styles de vidéos */}
          <div className="animate-fade-up" style={{ animationDelay: '400ms' }}>
            <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">Styles de vidéos</p>
            <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 text-xs sm:text-xs px-1">
              {FORMATS.slice(1).map((format, index) => (
                <span key={format.id} className="inline-flex items-center gap-2 sm:gap-2 rounded-full border-2 border-orange-500/30 bg-gradient-to-r from-orange-50 to-white px-3.5 sm:px-4 py-2 sm:py-2 font-semibold text-orange-700 shadow-sm backdrop-blur-md transition-all duration-200 active:scale-95 sm:hover:scale-105 sm:hover:border-orange-500/50 sm:hover:shadow-md animate-fade-up" style={{ animationDelay: `${500 + index * 50}ms` }}>
                  <SparkleIcon className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 animate-pulse-subtle text-orange-500" />
                  {format.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Vidéos Vimeo - Défilement horizontal sur mobile avec boutons, grid sur tablet+ */}
      <div className="mt-12 sm:mt-16">
        {/* Conteneur avec overflow pour mobile, grid pour tablet+ */}
        <div className="md:mx-auto md:max-w-5xl">
          {/* Mobile: Carousel avec boutons de navigation */}
          <div className="relative md:hidden">
            {/* Bouton précédent */}
            <button
              onClick={goToPrev}
              disabled={!canGoPrev}
              aria-label="Vidéo précédente"
              className={`absolute left-1 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/70 bg-white/95 backdrop-blur-md shadow-lg transition-all duration-200 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed group`}
            >
              <svg className="h-5 w-5 text-gray-700 transition-colors duration-200 group-active:text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Conteneur de défilement */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto px-4 pb-4 pt-2 snap-x snap-mandatory scrollbar-hide -mx-4"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {allVideos.map((card, index) => (
                <div
                  key={card.title}
                  className="flex-shrink-0 w-[82vw] max-w-[300px] snap-center first:ml-4 last:mr-4"
                >
                  <div className="group h-full overflow-hidden rounded-2xl border-2 border-white/50 bg-white/70 shadow-xl backdrop-blur-xl transition-all duration-300 active:scale-[0.99] relative">
                    {/* Glow effect au tap */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/0 to-orange-400/0 opacity-0 group-active:from-orange-500/5 group-active:to-orange-400/5 group-active:opacity-100 transition-all duration-200 pointer-events-none" />
                    <div className="p-4 space-y-4">
                      <VideoPlayer videoId={card.videoId} title={card.videoTitle} size="default" />
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 leading-tight">{card.title}</h3>
                          <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--orange-600)] to-[var(--orange-500)] px-3 py-1.5 text-xs font-bold text-white shadow-md flex-shrink-0">
                            {index < 3 ? 'Premium' : 'Standard'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-1 leading-relaxed font-medium">{card.description}</p>
                        {/* KPI - Exemple */}
                        {index === 0 && <p className="text-sm font-bold text-orange-600">+42% d&apos;engagement en 14 jours</p>}
                        {index === 1 && <p className="text-sm font-bold text-orange-600">+35% de visibilité organique</p>}
                        {index === 2 && <p className="text-sm font-bold text-orange-600">+28% de conversions</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton suivant */}
            <button
              onClick={goToNext}
              disabled={!canGoNext}
              aria-label="Vidéo suivante"
              className={`absolute right-1 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/70 bg-white/95 backdrop-blur-md shadow-lg transition-all duration-200 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed group`}
            >
              <svg className="h-5 w-5 text-gray-700 transition-colors duration-200 group-active:text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Indicateurs de pagination */}
            <div className="mt-5 flex items-center justify-center gap-2">
              {allVideos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  aria-label={`Aller à la vidéo ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-200 active:scale-90 ${
                    index === currentIndex
                      ? 'w-7 bg-gradient-to-r from-orange-500 to-orange-600'
                      : 'w-2.5 bg-gray-300 active:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Compteur */}
            <div className="mt-3 text-center">
              <span className="text-sm font-semibold text-gray-500">
                {currentIndex + 1} / {allVideos.length} vidéos
              </span>
            </div>
          </div>

          {/* Tablet & Desktop: Grid responsive */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {allVideos.map((card, index) => (
              <div
                key={card.title}
                className="group overflow-hidden rounded-[var(--radius-xl)] border border-white/30 bg-white/60 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-[var(--orange-alpha-30)] hover:bg-white/70 hover:shadow-2xl hover:shadow-[var(--orange-alpha-15)] animate-fade-up relative"
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                {/* Glow effect au hover - desktop only */}
                <div className="hidden sm:block absolute inset-0 rounded-[var(--radius-xl)] bg-gradient-to-br from-orange-500/0 to-orange-400/0 opacity-0 group-hover:from-orange-500/5 group-hover:to-orange-400/5 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
                <div className="p-4 space-y-4 relative z-10">
                  <VideoPlayer videoId={card.videoId} title={card.videoTitle} size="default" />
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg lg:text-xl font-bold text-gray-900">{card.title}</h3>
                      <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--orange-600)] to-[var(--orange-500)] px-3 py-1.5 text-xs font-bold text-white shadow-md flex-shrink-0">
                        {index < 3 ? 'Premium' : 'Standard'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{card.description}</p>
                    {/* KPI - Exemple */}
                    {index === 0 && <p className="text-sm font-bold text-orange-600">+42% d&apos;engagement en 14 jours</p>}
                    {index === 1 && <p className="text-sm font-bold text-orange-600">+35% de visibilité organique</p>}
                    {index === 2 && <p className="text-sm font-bold text-orange-600">+28% de conversions</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA - Voir les études de cas */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link 
            href="/portfolio" 
            className="group inline-flex items-center gap-2.5 rounded-full border-2 border-orange-500/30 bg-gradient-to-r from-white to-orange-50 px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-base font-semibold text-gray-800 shadow-lg backdrop-blur-xl transition-all duration-200 active:scale-[0.98] sm:hover:scale-105 sm:hover:shadow-xl sm:hover:border-orange-500/50 animate-fade-up relative overflow-hidden"
            style={{ animationDelay: '800ms' }}
          >
            {/* Effet shimmer au hover - desktop only */}
            <div className="hidden sm:block absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="relative z-10">Découvrir les résultats concrets</span>
            <ArrowRightIcon className="h-5 w-5 text-orange-500 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default memo(FormatsSection);

