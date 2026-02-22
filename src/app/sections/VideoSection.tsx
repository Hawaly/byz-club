import { memo } from 'react';
import { SparkleIcon } from '../components/Icons';

function VideoSection() {
  return (
    <section className="px-4 py-10 sm:px-5 sm:py-12 md:px-6 md:py-14 animate-fade-up" style={{ animationDelay: '500ms' }}>
      <div className="group mx-auto max-w-5xl overflow-hidden rounded-2xl sm:rounded-[var(--radius-xl)] border-2 border-white/40 bg-gradient-to-br from-white/40 via-orange-50/30 to-white/40 backdrop-blur-xl sm:backdrop-blur-2xl shadow-xl sm:shadow-2xl transition-all duration-300 sm:duration-500 active:scale-[0.99] sm:hover:border-orange-500/50 sm:hover:shadow-[0_20px_60px_rgba(253,89,4,0.2)] sm:hover:scale-[1.01] relative">
        {/* Border gradient animé - desktop only */}
        <div className="hidden sm:block absolute inset-0 rounded-[var(--radius-xl)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-[var(--radius-xl)] bg-gradient-to-r from-orange-500/20 via-orange-400/20 to-orange-500/20 animate-gradient-x bg-[length:200%_auto]" />
        </div>
        
        {/* Placeholder vidéo en attente */}
        <div className="relative aspect-video flex flex-col items-center justify-center p-8 sm:p-12 md:p-16">
          {/* Effet de fond animé avec breathing */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-orange-500/10 via-orange-400/5 to-transparent blur-2xl sm:blur-3xl animate-breathing" />
            {/* Particules flottantes - desktop only */}
            <div className="hidden sm:block absolute left-1/4 top-1/4 h-2 w-2 rounded-full bg-orange-400/30 animate-float-slow" />
            <div className="hidden sm:block absolute right-1/3 top-2/3 h-1.5 w-1.5 rounded-full bg-orange-500/40 animate-float-slow" style={{ animationDelay: '1s' }} />
            <div className="hidden sm:block absolute right-1/4 top-1/3 h-1 w-1 rounded-full bg-orange-300/30 animate-float-slow" style={{ animationDelay: '2s' }} />
          </div>
          
          {/* Contenu */}
          <div className="relative z-10 text-center space-y-5 sm:space-y-6">
            {/* Icône vidéo - avec animations et glow */}
            <div className="relative mx-auto">
              {/* Glow animé en arrière-plan */}
              <div className="absolute inset-0 rounded-full bg-orange-500/40 blur-2xl animate-pulse-slow scale-150" />
              <div className="absolute inset-0 rounded-full bg-orange-400/30 blur-xl animate-breathing scale-125" />
              
              {/* Icône principale */}
              <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-xl shadow-orange-500/30 transition-all duration-300 active:scale-95 sm:group-hover:scale-110 sm:group-hover:shadow-2xl sm:group-hover:shadow-orange-500/50">
                <svg 
                  className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white ml-1 transition-transform duration-300 sm:group-hover:scale-110" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            
            {/* Texte avec meilleure lisibilité mobile */}
            <div className="space-y-3 sm:space-y-3">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                Vidéo en préparation
              </h3>
              <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto px-2 sm:px-2 leading-relaxed">
                Notre showreel arrive bientôt. En attendant, découvrez nos réalisations ci-dessous.
              </p>
            </div>
            
            {/* Badge - avec animation shimmer */}
            <div className="relative inline-flex items-center gap-2.5 rounded-full border border-orange-500/30 bg-white/80 px-5 py-2.5 text-sm sm:text-sm font-semibold text-orange-600 backdrop-blur-md shadow-sm overflow-hidden transition-all duration-200 active:scale-95 sm:hover:scale-105 sm:hover:border-orange-500/50 sm:hover:shadow-md">
              {/* Effet shimmer - desktop only */}
              <div className="hidden sm:block absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ animationDuration: '3s' }} />
              <SparkleIcon className="h-4 w-4 sm:h-4 sm:w-4 animate-pulse-subtle" />
              <span>Bientôt disponible</span>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-5 sm:mt-5 text-center text-sm sm:text-sm text-gray-600 px-4 sm:px-0 animate-fade-up font-medium" style={{ animationDelay: '600ms' }}>Nous avons déjà fait exploser <span className="font-bold text-[var(--accent)]">+20 entreprises</span>.</p>
    </section>
  );
}

export default memo(VideoSection);

