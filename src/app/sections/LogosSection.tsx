import { memo } from 'react';
import { CLIENT_LOGOS } from '../data/constants';
import ClientLogosCarousel from '../components/ClientLogosCarousel';

function LogosSection() {
  return (
    <section id="portfolio" className="relative overflow-hidden px-4 py-12 sm:px-5 sm:py-16 md:px-6 md:py-20 section scroll-mt-16 sm:scroll-mt-28 md:scroll-mt-32">
      {/* Décor de fond avec orbes animés */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] md:h-[600px] md:w-[600px] bg-gradient-radial from-[var(--orange-alpha-10)] to-transparent blur-2xl sm:blur-3xl animate-pulse-slow" />
      </div>
      
      <div className="mx-auto max-w-6xl">
        {/* Header de la section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Ils nous confient leur <span className="bg-gradient-to-r from-[var(--orange-600)] to-[var(--orange-500)] bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">image</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-semibold max-w-2xl mx-auto px-2">
            Des entreprises locales qui ont transformé leur visibilité grâce à nos vidéos
          </p>
          {/* Badge avec compteur renforcé */}
          <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border-2 border-orange-500/30 bg-gradient-to-r from-orange-50 to-white px-5 py-2 text-sm font-bold text-orange-700 shadow-md backdrop-blur-sm animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span>+20 entreprises locales accompagnées avec succès</span>
          </div>
        </div>
        
        {/* Conteneur pour accommoder le scale au hover */}
        <div className="overflow-hidden animate-fade-up" style={{ animationDelay: '300ms' }}>
          <ClientLogosCarousel logos={CLIENT_LOGOS} />
        </div>
        
        {/* Témoignage */}
        <div className="mt-10 sm:mt-12 text-center animate-fade-up" style={{ animationDelay: '400ms' }}>
          <div className="inline-block max-w-2xl mx-auto px-4">
            {/* Étoiles */}
            <div className="flex items-center justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {/* Citation */}
            <blockquote className="text-base sm:text-lg text-gray-800 font-medium italic">
              « Un vrai impact sur notre communication et nos ventes. »
            </blockquote>
          </div>
        </div>
        
        {/* Mini CTA */}
        <div className="mt-8 sm:mt-10 text-center animate-fade-up" style={{ animationDelay: '500ms' }}>
          <a
            href="#hero"
            className="group inline-flex items-center gap-2.5 rounded-full border-2 border-orange-500/30 bg-gradient-to-r from-white to-orange-50 px-6 py-3 text-sm sm:text-base font-bold text-gray-800 shadow-lg backdrop-blur-xl transition-all duration-300 active:scale-95 sm:hover:scale-105 sm:hover:shadow-xl sm:hover:border-orange-500/50 relative overflow-hidden"
          >
            <div className="hidden sm:block absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="relative">Rejoindre nos clients satisfaits</span>
            <svg className="relative h-5 w-5 text-orange-600 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default memo(LogosSection);

