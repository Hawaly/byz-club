import { memo } from 'react';
import { OFFERS } from '../data/constants';
import CalendlyButton from '../components/CalendlyButton';
import { ArrowRightIcon, SparkleIcon } from '../components/Icons';

function OffersSection() {
  return (
    <section id="offers" className="relative overflow-hidden px-4 py-14 sm:px-5 sm:py-20 md:px-6 md:py-24 section-premium scroll-mt-16 sm:scroll-mt-28 md:scroll-mt-32">
      {/* Section gradient divider */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-16 sm:h-32 md:h-40 bg-gradient-to-b from-white to-transparent -z-10" />
      
      {/* Accent circles - Plus petits sur mobile */}
      <div aria-hidden className="pointer-events-none absolute right-0 top-20 h-[120px] w-[120px] sm:h-[300px] sm:w-[300px] md:h-[400px] md:w-[400px] rounded-full bg-orange-500/5 blur-2xl sm:blur-3xl -z-10" />
      <div aria-hidden className="pointer-events-none absolute left-0 bottom-20 h-[100px] w-[100px] sm:h-[250px] sm:w-[250px] md:h-[350px] md:w-[350px] rounded-full bg-orange-500/5 blur-2xl sm:blur-3xl -z-10" />
      
      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:gap-6 text-center mb-10 sm:mb-12 md:mb-16">
          <div className="mx-auto space-y-4 sm:space-y-4 px-1 sm:px-2 md:px-0">
            <span className="inline-flex items-center gap-2 sm:gap-2 rounded-full border border-[var(--orange-alpha-30)] bg-white/80 px-4 sm:px-4 py-2 sm:py-2 text-xs sm:text-xs font-semibold text-[var(--accent)] shadow-sm backdrop-blur-md">
              <SparkleIcon className="h-4 w-4 sm:h-4 sm:w-4" />
              <span>Offres BYZCLUB</span>
            </span>
            <h2 className="text-[1.75rem] leading-[1.15] sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 max-w-4xl mx-auto">
              Des packs <span className="bg-gradient-to-r from-[var(--orange-600)] to-[var(--orange-500)] bg-clip-text text-transparent">tout-en-un</span> pour votre contenu vidéo
            </h2>
            <p className="text-base sm:text-base text-gray-600 max-w-2xl mx-auto leading-[1.7] font-medium">
              Stratégie, production, montage et publication. Tout ce dont vous avez besoin pour booster votre présence en ligne.
            </p>
          </div>
        </div>
        
        <div className="mt-8 sm:mt-10 md:mt-12 grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 px-0">
          {OFFERS.map((offer, index) => {
            const isPopular = index === 1;
            const packNum = index + 1;
            return (
              <div
                key={offer.title}
                className={`group relative flex h-full flex-col rounded-3xl transition-all duration-300 active:scale-[0.99] sm:hover:-translate-y-2 ${
                  isPopular
                    ? 'border-2 border-orange-500/60 bg-gradient-to-b from-orange-500/[0.07] to-white shadow-2xl shadow-orange-500/20 sm:hover:shadow-[0_40px_80px_rgba(253,89,4,0.22)]'
                    : 'border-2 border-gray-100 bg-white shadow-lg shadow-gray-200/80 sm:hover:border-orange-500/25 sm:hover:shadow-xl'
                } backdrop-blur-xl`}
              >
                {/* Badge populaire */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full blur-md opacity-60" />
                      <span className="relative inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-1.5 text-[11px] font-bold text-white shadow-lg tracking-wide uppercase">
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Meilleure valeur
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col h-full px-6 sm:px-7 md:px-8 pt-8 sm:pt-10 pb-7 sm:pb-8">

                  {/* Numéro + titre */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl text-lg font-black ${
                      isPopular
                        ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {packNum}
                    </div>
                    <div className="pt-1 min-w-0">
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${isPopular ? 'text-orange-500' : 'text-gray-400'}`}>Pack</p>
                      <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight truncate">{offer.title.replace(/^PACK \d+ — /, '')}</h3>
                    </div>
                  </div>

                  {/* Objectif */}
                  <div className={`rounded-2xl p-4 mb-6 ${isPopular ? 'bg-orange-500/8 border border-orange-500/15' : 'bg-gray-50 border border-gray-100'}`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${isPopular ? 'text-orange-600' : 'text-gray-400'}`}>Objectif</p>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed italic">"{offer.objective}"</p>
                  </div>

                  {/* Séparateur */}
                  <div className={`h-px mb-6 ${isPopular ? 'bg-gradient-to-r from-transparent via-orange-300/50 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-200 to-transparent'}`} />

                  {/* Inclusions */}
                  <ul className="space-y-3 flex-1 mb-6">
                    {offer.inclusions.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className={`mt-0.5 shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-full ${
                          isPopular
                            ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-sm shadow-orange-500/30'
                            : 'bg-gray-800'
                        }`}>
                          <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Cible */}
                  <div className={`flex items-center gap-2 mb-6 px-3 py-2.5 rounded-xl ${isPopular ? 'bg-orange-500/8' : 'bg-gray-50'}`}>
                    <svg className={`h-3.5 w-3.5 shrink-0 ${isPopular ? 'text-orange-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className={`text-xs font-bold ${isPopular ? 'text-orange-700' : 'text-gray-500'}`}>{offer.target}</p>
                  </div>

                  {/* CTA */}
                  <CalendlyButton className={`w-full inline-flex items-center justify-center gap-2.5 rounded-2xl px-5 py-4 text-sm sm:text-base font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 min-h-[52px] active:scale-[0.98] ${
                    isPopular
                      ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/30 sm:hover:shadow-xl sm:hover:shadow-orange-500/40 sm:hover:scale-[1.02] focus-visible:ring-orange-500'
                      : 'bg-gray-900 text-white sm:hover:bg-gray-800 sm:hover:scale-[1.02] focus-visible:ring-gray-700 shadow-md'
                  }`}>
                    <span>Choisir ce pack</span>
                    <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </CalendlyButton>

                  {isPopular && (
                    <p className="mt-3 text-center text-xs text-orange-500/80 font-semibold">
                      🔥 Pack le plus demandé · Réponse sous 24h
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Trust section - optimisée pour mobile */}
        <div className="mt-10 sm:mt-12 md:mt-16 text-center px-0">
          <div className="inline-flex flex-wrap items-center justify-center gap-5 sm:gap-6 md:gap-8 rounded-2xl border-2 border-white/50 bg-white/50 px-5 sm:px-6 md:px-8 py-5 sm:py-5 md:py-6 shadow-lg sm:shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/30">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">100% Satisfait</p>
                <p className="text-xs text-gray-500 font-medium">Garantie qualité</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/30">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">+200 Projets</p>
                <p className="text-xs text-gray-500 font-medium">Déjà réalisés</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/30">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">Réponse 24h</p>
                <p className="text-xs text-gray-500 font-medium">Service rapide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(OffersSection);

