import { memo } from 'react';
import { GUARANTEES } from '../data/constants';
import CalendlyButton from '../components/CalendlyButton';
import { ArrowRightIcon } from '../components/Icons';

function HeroSection() {
  return (
    <section id="hero" className="relative px-4 pt-8 pb-16 sm:px-5 sm:pt-16 sm:pb-20 md:px-6 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28 section scroll-mt-16 sm:scroll-mt-28 md:scroll-mt-32 overflow-hidden">
      {/* Gradients stratégiquement placés derrière les éléments UI */}
      
      {/* Glow principal parfaitement positionné derrière le titre */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[12%] w-[85%] max-w-3xl h-[180px] sm:h-[220px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(253,89,4,0.15),_transparent_70%)] blur-3xl opacity-85 animate-breathing" style={{ animationDuration: '10s' }} />
      
      {/* Glow secondaire précisément placé derrière le CTA */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[62%] sm:top-[58%] w-[250px] h-[120px] sm:h-[140px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(253,89,4,0.2),_transparent_70%)] blur-2xl opacity-90 animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      {/* Glow secondaire plus large derrière le bouton principal */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[62%] sm:top-[58%] w-[450px] h-[180px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(253,89,4,0.08),_transparent_75%)] blur-3xl opacity-80 animate-breathing" style={{ animationDuration: '12s' }} />
      
      {/* Glow subtile précisément derrière les badges de garantie */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 bottom-[5%] w-[90%] max-w-2xl h-[100px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.06),_rgba(255,237,213,0.08)_40%,_transparent_80%)] blur-3xl opacity-70 animate-float-slow" style={{ animationDuration: '15s' }} />

      {/* Glow d'accentuation violet/orange positionné stratégiquement */}
      <div aria-hidden className="pointer-events-none absolute right-[20%] top-[35%] w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(124,58,237,0.06),_transparent_70%)] blur-3xl opacity-60 animate-float-slow" style={{ animationDelay: '1s', animationDuration: '18s' }} />
      
      {/* Particules flottantes - visibles sur mobile aussi */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[15%] top-[20%] h-2 w-2 rounded-full bg-orange-400/40 animate-float-slow" />
        <div className="absolute right-[20%] top-[30%] h-1.5 w-1.5 rounded-full bg-orange-500/30 animate-float-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute left-[25%] bottom-[25%] h-1 w-1 rounded-full bg-orange-300/40 animate-float-slow" style={{ animationDelay: '4s' }} />
        <div className="hidden sm:block absolute right-[15%] bottom-[30%] h-2.5 w-2.5 rounded-full bg-orange-400/30 animate-float-slow" style={{ animationDelay: '1s' }} />
        <div className="hidden sm:block absolute left-[35%] top-[15%] h-1.5 w-1.5 rounded-full bg-orange-500/35 animate-float-slow" style={{ animationDelay: '3s' }} />
        <div className="hidden md:block absolute right-[30%] top-[40%] h-2 w-2 rounded-full bg-orange-300/30 animate-float-slow" style={{ animationDelay: '5s' }} />
      </div>
      
      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge - avec animations plus vivantes */}
        <div className="group glass-badge inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 mx-auto animate-fade-up transition-all duration-300 active:scale-95 sm:hover:scale-105 sm:hover:shadow-lg relative overflow-hidden" style={{ animationDelay: '0ms' }}>
          {/* Effet shimmer qui traverse le badge */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ animationDuration: '3s', animationDelay: '1s' }} />
          <span className="relative glass-base rounded-full px-2 sm:px-2.5 py-1 sm:py-1 text-xs font-bold uppercase tracking-wide text-[var(--accent)] shadow-sm flex-shrink-0 animate-pulse-subtle">CH</span>
          <span className="relative text-xs font-semibold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-gray-700 leading-tight">Agence suisse experte en vidéos verticales</span>
        </div>
        
        {/* Titre principal - hiérarchie optimisée mobile */}
        <h1 className="mt-6 sm:mt-6 text-[2rem] leading-[1.1] sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.25rem] font-extrabold tracking-tight text-gray-900 animate-fade-up px-1 sm:px-0" style={{ animationDelay: '100ms' }}>
          <span className="block bg-gradient-to-r from-[var(--orange-600)] via-[var(--orange-500)] to-[var(--orange-400)] bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">Votre histoire mérite d&apos;être vue</span>
          <span className="block mt-4 sm:mt-3 text-[1.375rem] sm:text-2xl md:text-3xl lg:text-4xl leading-[1.25] font-bold">Des vidéos qui transforment vos vues en clients</span>
        </h1>
        
        {/* Sous-titre - condensé pour mobile */}
        <p className="mx-auto mt-5 sm:mt-6 max-w-2xl text-base sm:text-base md:text-lg leading-[1.6] text-gray-600 px-2 sm:px-0 animate-fade-up font-medium" style={{ animationDelay: '200ms' }}>
          <span className="font-bold text-gray-800">+20 entreprises locales. 100% satisfaites.</span>
        </p>
        
        {/* CTA - optimisé mobile avec micro-promesse */}
        <div className="relative mt-9 sm:mt-12 flex flex-wrap items-center justify-center gap-4 px-2 sm:px-0 animate-fade-up" style={{ animationDelay: '300ms' }}>
          {/* CTA glow effects multiples */}
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-64 sm:h-40 sm:w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--orange-alpha-25)] blur-2xl sm:blur-3xl animate-breathing" />
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-48 sm:h-28 sm:w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--orange-alpha-20)] blur-xl sm:blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          
          <CalendlyButton className="group relative btn-primary text-base sm:text-lg px-8 py-5 sm:px-9 sm:py-5 w-full sm:w-auto max-w-[360px] min-h-[64px] shadow-2xl shadow-orange-500/30 transition-all duration-300 active:scale-[0.97] sm:hover:scale-[1.05] sm:hover:shadow-[0_20px_60px_rgba(253,89,4,0.5)] overflow-hidden">
            <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="relative whitespace-nowrap font-bold flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              Je veux plus de clients
            </span>
            <ArrowRightIcon className="relative h-5 w-5 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-2 group-active:translate-x-3" />
          </CalendlyButton>
        </div>
        
        {/* Badges de garantie - optimisés mobile avec icônes */}
        <div className="mt-6 sm:mt-7 flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-3.5 px-2 sm:px-0">
          {GUARANTEES.map((guarantee, index) => (
            <span
              key={guarantee}
              className="group relative glass-badge px-4 sm:px-5 py-2.5 sm:py-2.5 text-sm sm:text-sm uppercase tracking-[0.05em] sm:tracking-[0.1em] text-gray-700 font-bold whitespace-nowrap animate-fade-up transition-all duration-300 active:scale-95 sm:hover:scale-110 sm:hover:shadow-lg sm:hover:bg-white/90 overflow-hidden flex items-center gap-2"
              style={{ animationDelay: `${400 + index * 100}ms` }}
            >
              <div className="hidden sm:block absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <svg className="relative h-4 w-4 text-orange-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="relative">{guarantee}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(HeroSection);

