'use client';

import LogoPremium from '@/components/LogoPremium';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <LogoPremium />
          
          <div className="hidden lg:flex items-center gap-1">
            <a href="#le-club" className="text-white/60 hover:text-white transition-all duration-300 text-sm font-medium px-4 py-2">
              Le club
            </a>
            <span className="text-white/20">•</span>
            <a href="#evenements" className="text-white/60 hover:text-white transition-all duration-300 text-sm font-medium px-4 py-2">
              Événements
            </a>
            <span className="text-white/20">•</span>
            <a href="#ressources" className="text-white/60 hover:text-white transition-all duration-300 text-sm font-medium px-4 py-2">
              Ressources
            </a>
            <span className="text-white/20">•</span>
            <a href="#offres" className="text-white/60 hover:text-white transition-all duration-300 text-sm font-medium px-4 py-2">
              Offres
            </a>
            <span className="text-white/20">•</span>
            <a href="#contact" className="text-white/60 hover:text-white transition-all duration-300 text-sm font-medium px-4 py-2">
              Contact
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-white/50">
              <span>📍</span>
              <span>Neuchâtel & environs</span>
            </div>
            <a href="#offres" className="px-6 py-2.5 bg-[#FF6633] hover:bg-[#FF5522] text-white text-sm font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#FF6633]/50 hover:scale-105 animate-pulse-slow whitespace-nowrap">
              Rejoindre BYZCLUB CORE
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6 pt-32 pb-20 overflow-hidden">
        {/* Background Gradient - Local Sunset */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1a1520] to-[#0A0A0A]"></div>
        <div className="absolute inset-0 opacity-[0.015]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)" /%3E%3C/svg%3E")'}}></div>
        
        {/* Orange Glow */}
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-t from-[#FF6633] via-[#FF6633]/40 to-transparent opacity-20 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Badge Local */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF6633]/10 backdrop-blur-xl border border-[#FF6633]/30 mb-8">
              <span className="text-[#FF6633] text-sm font-bold">100% local</span>
              <span className="text-white/50 text-sm">—</span>
              <span className="text-white/80 text-sm font-medium">Neuchâtel & environs</span>
            </div>

            {/* H1 */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-[1.05]">
              Visibilité locale.<br />
              Réseau.<br />
              <span className="font-seasons italic text-[#FF6633]">Actions concrètes.</span>
            </h1>

            {/* Sous-titre */}
            <p className="text-xl text-white/70 mb-10 leading-relaxed max-w-2xl">
              Chaque mois : <strong className="text-white">1 networking</strong> + <strong className="text-white">1 workshop</strong> + <strong className="text-white">1 Q&A</strong>.<br />
              Tu repars avec un plan simple et tu avances avec les bons contacts.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
              <a href="#offres" className="inline-flex items-center gap-2 px-10 py-4 bg-[#FF6633] hover:bg-[#FF5522] text-white text-base font-medium rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-[#FF6633]/50 hover:scale-105">
                Rejoindre CORE (CHF 59.–/mois)
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a href="#contact" className="px-10 py-4 text-white/80 hover:text-white transition-all duration-300 text-base rounded-full hover:bg-white/5 border border-white/10">
                Demander un audit express (15 min)
              </a>
            </div>

            {/* Micro-réassurance */}
            <div className="flex flex-wrap items-center gap-4 text-white/40 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Engagement 3 mois</span>
              </div>
              <span className="text-white/20">•</span>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Ensuite mensuel</span>
              </div>
              <span className="text-white/20">•</span>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Places limitées</span>
              </div>
            </div>
          </div>

          {/* Right - Ce mois-ci Card */}
          <div className="hidden lg:block">
            <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6633] opacity-10 blur-[60px] rounded-full"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-white font-bebas text-2xl tracking-wider">CE MOIS-CI</h3>
                  <div className="px-3 py-1 rounded-full bg-[#FF6633]/20 text-[#FF6633] text-xs font-medium">Aperçu</div>
                </div>
                
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[#FF6633]"></div>
                      <p className="text-white/50 text-xs font-bebas tracking-wider">NETWORKING</p>
                    </div>
                    <p className="text-white font-medium">12 février, 18h30</p>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-white/40"></div>
                      <p className="text-white/50 text-xs font-bebas tracking-wider">WORKSHOP</p>
                    </div>
                    <p className="text-white font-medium">Créer une offre qui génère des demandes</p>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-white/40"></div>
                      <p className="text-white/50 text-xs font-bebas tracking-wider">OFFICE HOURS</p>
                    </div>
                    <p className="text-white font-medium">26 février, 17h00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bandeau Preuves - Bento Grid */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1 networking */}
            <div className="group relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-[#FF6633]/30 transition-all duration-300">
              <div className="text-6xl font-bebas text-[#FF6633] mb-4">1</div>
              <h3 className="text-white font-bebas text-lg tracking-wider mb-2">NETWORKING / MOIS</h3>
              <p className="text-white/60 text-sm">→ connexions locales</p>
            </div>

            {/* 1 workshop */}
            <div className="group relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-[#FF6633]/30 transition-all duration-300">
              <div className="text-6xl font-bebas text-[#FF6633] mb-4">1</div>
              <h3 className="text-white font-bebas text-lg tracking-wider mb-2">WORKSHOP / MOIS</h3>
              <p className="text-white/60 text-sm">→ compétence + application</p>
            </div>

            {/* 1 Q&A */}
            <div className="group relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-[#FF6633]/30 transition-all duration-300">
              <div className="text-6xl font-bebas text-[#FF6633] mb-4">1</div>
              <h3 className="text-white font-bebas text-lg tracking-wider mb-2">Q&A / MOIS</h3>
              <p className="text-white/60 text-sm">→ blocages réglés</p>
            </div>

            {/* Ressources */}
            <div className="group relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-[#FF6633]/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#FF6633]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#FF6633]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-white font-bebas text-lg tracking-wider mb-2">RESSOURCES + ANNUAIRE</h3>
              <p className="text-white/60 text-sm">→ exécution plus rapide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Le club */}
      <section id="le-club" className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A1E2E]/20 to-[#0F0F0F]"></div>
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#FF6633] opacity-[0.03] blur-[150px] rounded-full"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 leading-[1.1]">
              BYZCLUB = du terrain + du réseau +<br />
              <span className="font-seasons italic text-[#FF6633]">du momentum.</span>
            </h2>
          </div>

          {/* 3 Piliers */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Clarté */}
            <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center hover:border-[#FF6633]/30 transition-all duration-300">
              <div className="text-8xl font-bebas text-[#FF6633]/20 mb-6">01</div>
              <h3 className="text-white font-bebas text-5xl tracking-wider mb-6">CLARTÉ</h3>
              <p className="text-white/70 text-base">Message, offre, contenu, priorités</p>
            </div>

            {/* Cadence */}
            <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center hover:border-[#FF6633]/30 transition-all duration-300">
              <div className="text-8xl font-bebas text-[#FF6633]/20 mb-6">02</div>
              <h3 className="text-white font-bebas text-5xl tracking-wider mb-6">CADENCE</h3>
              <p className="text-white/70 text-base">3 rendez-vous/mois (non négociable)</p>
            </div>

            {/* Opportunités */}
            <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center hover:border-[#FF6633]/30 transition-all duration-300">
              <div className="text-8xl font-bebas text-[#FF6633]/20 mb-6">03</div>
              <h3 className="text-white font-bebas text-5xl tracking-wider mb-6">OPPORTUNITÉS</h3>
              <p className="text-white/70 text-base">Communauté + annuaire + partenaires</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Cadence mensuelle CORE */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F] to-[#0A0A0A]"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
              Un plan mensuel.<br />
              <span className="font-seasons italic text-[#FF6633]">Trois rendez-vous obligatoires.</span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Chaque mois, tu sais où tu vas. Chaque mois, tu rencontres les bonnes personnes.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Timeline verticale */}
            <div className="space-y-8">
              <div className="relative pl-8 border-l-2 border-[#FF6633]/30">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#FF6633]"></div>
                <div className="mb-2">
                  <span className="text-[#FF6633] text-sm font-bebas tracking-wider">SEMAINE 1-2</span>
                </div>
                <h3 className="text-white text-2xl font-bebas tracking-wider mb-2">NETWORKING</h3>
                <p className="text-white/70">20-30 entrepreneurs locaux. Format simple : présentation + échanges libres + follow-up.</p>
              </div>

              <div className="relative pl-8 border-l-2 border-white/10">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white/40"></div>
                <div className="mb-2">
                  <span className="text-white/50 text-sm font-bebas tracking-wider">SEMAINE 2-3</span>
                </div>
                <h3 className="text-white text-2xl font-bebas tracking-wider mb-2">WORKSHOP</h3>
                <p className="text-white/70">1 compétence concrète. Format : théorie rapide + exercice pratique + retours en live.</p>
              </div>

              <div className="relative pl-8 border-l-2 border-white/10">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white/40"></div>
                <div className="mb-2">
                  <span className="text-white/50 text-sm font-bebas tracking-wider">SEMAINE 4</span>
                </div>
                <h3 className="text-white text-2xl font-bebas tracking-wider mb-2">OFFICE HOURS (Q&A)</h3>
                <p className="text-white/70">Tu viens avec tes blocages. On règle ça ensemble. Hot seat ouvert.</p>
              </div>
            </div>

            {/* Résultat attendu */}
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#FF6633]/10 to-[#FF6633]/5 backdrop-blur-xl border border-[#FF6633]/30 rounded-3xl p-10">
                <h3 className="text-white font-bebas text-3xl tracking-wider mb-6">RÉSULTAT ATTENDU</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-[#FF6633] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-white text-lg">Plus de demandes entrantes</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-[#FF6633] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-white text-lg">Plus de contacts pertinents</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Événements */}
      <section id="evenements" className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] to-[#0F0F0F]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#FF6633] opacity-[0.03] blur-[150px] rounded-full"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
              On se voit en vrai.<br />
              <span className="font-seasons italic text-[#FF6633]">C&#39;est là que ça accélère.</span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Pas de formats compliqués. Pas de blabla théorique. Des rendez-vous simples, efficaces, utiles.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Prochain événement */}
            <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-10 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6633] opacity-10 blur-[60px] rounded-full"></div>
              
              <div className="relative z-10">
                <div className="inline-block px-3 py-1 rounded-full bg-[#FF6633]/20 text-[#FF6633] text-xs font-bebas tracking-wider mb-6">PROCHAIN ÉVÉNEMENT</div>
                
                <h3 className="text-white text-3xl font-bebas tracking-wider mb-6">NETWORKING FÉVRIER</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#FF6633] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-white font-medium">12 février, 18h30</p>
                      <p className="text-white/60 text-sm">Durée : env. 2h</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#FF6633] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-white font-medium">Neuchâtel (lieu confirmé par email)</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#FF6633] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-white font-medium">Format : présentations courtes + échanges libres</p>
                  </div>
                </div>
                
                <a href="#contact" className="block w-full text-center bg-[#FF6633] hover:bg-[#FF5522] text-white py-3 rounded-full transition-all duration-300 font-medium">
                  Rejoindre pour participer
                </a>
              </div>
            </div>

            {/* Workshop du mois */}
            <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-10">
              <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-bebas tracking-wider mb-6">WORKSHOP DU MOIS</div>
              
              <h3 className="text-white text-2xl font-bebas tracking-wider mb-6">Créer une offre qui génère des demandes</h3>
              
              <p className="text-white/70 mb-6">
                Arrête de proposer &quot;tout ce que tu fais&quot;. Construis une offre claire, concrète, qui attire les bonnes personnes.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <svg className="w-4 h-4 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Définir ton offre principale</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <svg className="w-4 h-4 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Formuler le problème que tu règles</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <svg className="w-4 h-4 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Créer une présentation efficace</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mini bonus */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10">
              <span className="text-2xl">🎥</span>
              <span className="text-white/70 text-sm">Les events servent aussi à créer du contenu (stories, reels, photos).</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section Offres */}
      <section id="offres" className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F] to-[#0A0A0A]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF6633] opacity-[0.03] blur-[150px] rounded-full"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[#FF6633] text-sm font-bebas tracking-[0.3em] mb-4">OFFRES</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight">
              Rejoins le club.<br />
              <span className="font-seasons italic text-[#FF6633]">Crée du momentum local.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* BYZCLUB CORE */}
            <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:border-[#FF6633]/30 transition-all duration-500">
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-xs font-bebas tracking-wider">OUVERT</div>
              
              <div className="mb-8">
                <h3 className="text-white/80 text-sm font-bebas tracking-[0.2em] mb-4">🔵 BYZCLUB CORE</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-light text-white">59</span>
                  <span className="text-white/50">CHF / mois</span>
                </div>
                <p className="text-white/60 mb-4">Engagement minimum : <strong className="text-white">3 mois</strong></p>
              </div>

              <div className="mb-8">
                <p className="text-white font-medium mb-4">CORE, c&apos;est pour toi si :</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FF6633]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white/80 text-sm">tu veux une structure simple</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FF6633]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white/80 text-sm">tu veux rencontrer les bonnes personnes localement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FF6633]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white/80 text-sm">tu veux arrêter de communiquer au hasard</span>
                  </li>
                </ul>
              </div>

              <a href="#contact" className="block w-full text-center bg-[#FF6633] hover:bg-[#FF5522] text-white py-4 rounded-full transition-all duration-300 font-medium hover:shadow-xl hover:shadow-[#FF6633]/50">
                Rejoindre CORE
              </a>
            </div>

            {/* BYZCLUB PREMIUM - Coming Soon */}
            <div className="relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/10 rounded-3xl p-10 opacity-60">
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-white/10 text-white/50 text-xs font-bebas tracking-wider flex items-center gap-2">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                COMING SOON
              </div>
              
              <div className="mb-8">
                <h3 className="text-white/50 text-sm font-bebas tracking-[0.2em] mb-4">🟨 BYZCLUB PREMIUM</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-light text-white/50">179</span>
                  <span className="text-white/30">CHF / mois</span>
                </div>
              </div>

              <p className="text-white/60 mb-6 leading-relaxed">
                <strong className="text-white/80">BYZCLUB PREMIUM arrive bientôt.</strong><br />
                Une offre limitée orientée opportunités, connexions stratégiques et croissance.
              </p>

              <div className="px-4 py-2 rounded-full bg-white/5 text-white/50 text-sm text-center">
                Ouverture après 3 mois
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Bêta PREMIUM */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] to-[#0F0F0F]"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6">
                Bêta contrôlée : on construit la légitimité<br />
                <span className="font-seasons italic text-[#FF6633]">avant d&apos;ouvrir.</span>
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="mb-10">
                <h3 className="text-white font-bebas text-xl tracking-wider mb-6">COMMENT ÇA MARCHE :</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#FF6633]/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-[#FF6633] font-bebas">1</span>
                    </div>
                    <p className="text-white/80">Chaque mois, <strong className="text-white">1 membre CORE est sélectionné</strong></p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#FF6633]/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-[#FF6633] font-bebas">2</span>
                    </div>
                    <p className="text-white/80">Upgrade <strong className="text-white">PREMIUM gratuit 1 mois</strong></p>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                <h4 className="text-white font-bebas text-lg tracking-wider mb-4">CRITÈRES (pas un tirage au sort)</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/80 text-sm">Implication</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/80 text-sm">Projet clair</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/80 text-sm">Besoin réel</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/80 text-sm">Potentiel de synergie</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/80 text-sm">Attitude pro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section PREMIUM (après ouverture) */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F] to-[#0A0A0A]"></div>
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#FF6633] opacity-[0.03] blur-[150px] rounded-full"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
              PREMIUM = proximité +<br />
              <span className="font-seasons italic text-[#FF6633]">opportunités réelles.</span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-4">
              Prix cible : <strong className="text-white">CHF 179.– / mois</strong> (min. 3 mois)
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-[#FF6633]/10 to-[#FF6633]/5 backdrop-blur-xl border border-[#FF6633]/30 rounded-3xl p-10 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF6633] opacity-10 blur-[60px] rounded-full"></div>
              
              <div className="relative z-10">
                <div className="mb-10">
                  <h3 className="text-white font-bebas text-2xl tracking-wider mb-6">INCLUT CORE +</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-white">1 event VIP / mois (places limitées)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-white">1 mastermind / mois (6–10)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-white">2 introductions qualifiées / mois</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-white">1 Hot Seat / mois (analyse + plan d&apos;action)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-white">Audit express trimestriel</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-white">Priorité opportunités</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Introductions qualifiées */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] to-[#0F0F0F]"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6">
                1 introduction qualifiée =<br />
                <span className="font-seasons italic text-[#FF6633]">1 action concrète.</span>
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <p className="text-white/70 text-lg mb-8 text-center">
                C&apos;est :
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF6633]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Besoin clair</p>
                    <p className="text-white/60 text-sm">On sait pourquoi on connecte</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF6633]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Personne pertinente</p>
                    <p className="text-white/60 text-sm">Compétence + disponibilité</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF6633]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Intro cadrée</p>
                    <p className="text-white/60 text-sm">Objectif + next step</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF6633]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Suivi minimum</p>
                    <p className="text-white/60 text-sm">On vérifie que ça avance</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/80 text-sm">Action promise</span>
                </div>
                <span className="text-white/20">•</span>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/80 text-sm">Pas de promesse de résultat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Boutique de services */}
      <section id="ressources" className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F] to-[#0A0A0A]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
              Besoin d&apos;accélérer ?<br />
              <span className="font-seasons italic text-[#FF6633]">Packs réservés membres.</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-sm">
              Pas de sur-mesure infini • Pas de négociation permanente
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: 'Social Setup', duration: '2 semaines', result: 'Présence pro' },
              { name: 'Content Sprint', duration: '1 mois', result: '12 contenus' },
              { name: 'Ads Kickstart', duration: '2 semaines', result: 'Premières demandes' },
              { name: 'Brand Refresh', duration: '3 semaines', result: 'Identité claire' },
              { name: 'Landing Page Express', duration: '1 semaine', result: 'Page qui convertit' },
            ].map((pack, index) => (
              <div key={index} className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-[#FF6633]/30 transition-all duration-300">
                <h3 className="text-white font-bebas text-lg tracking-wider mb-3">{pack.name}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{pack.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{pack.result}</span>
                  </div>
                </div>
                <a href="#contact" className="block w-full text-center py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-all duration-300">
                  Infos
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final simplifié */}
      <section id="contact" className="relative py-32 px-6 overflow-hidden bg-gradient-to-b from-[#0A0A0A] to-[#0F0F0F]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FF6633] opacity-10 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight">
            Rejoins le club.<br />
            <span className="font-seasons italic text-[#FF6633]">Crée du momentum local.</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a href="#offres" className="inline-flex items-center gap-2 px-10 py-5 bg-[#FF6633] hover:bg-[#FF5522] text-white text-lg font-medium rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-[#FF6633]/50 hover:scale-105">
              Rejoindre CORE
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a href="#contact" className="px-10 py-5 text-white/80 hover:text-white transition-all duration-300 text-lg rounded-full hover:bg-white/5 border border-white/10">
              Audit express 15 min
            </a>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>3 mois minimum</span>
            </div>
            <span className="text-white/20">•</span>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Ensuite mensuel</span>
            </div>
            <span className="text-white/20">•</span>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Places limitées</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <LogoPremium />
            <p className="text-white/40 mt-6 leading-relaxed max-w-2xl mx-auto">
              BYZCLUB — Réseau local pour entrepreneurs & commerçants à Neuchâtel.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 mb-8 text-white/40 text-sm">
            <a href="#le-club" className="hover:text-[#FF6633] transition-colors">Le club</a>
            <a href="#evenements" className="hover:text-[#FF6633] transition-colors">Événements</a>
            <a href="#ressources" className="hover:text-[#FF6633] transition-colors">Ressources</a>
            <a href="#offres" className="hover:text-[#FF6633] transition-colors">Offres</a>
            <a href="#contact" className="hover:text-[#FF6633] transition-colors">Contact</a>
            <span className="text-white/20">|</span>
            <a href="#" className="hover:text-[#FF6633] transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-[#FF6633] transition-colors">Politique de confidentialité</a>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-[#FF6633]/20 hover:text-[#FF6633] transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-[#FF6633]/20 hover:text-[#FF6633] transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>

          <div className="pt-6 border-t border-white/5 text-center">
            <p className="text-white/30 text-sm mb-2">
              © 2025 BYZCLUB · Tous droits réservés
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
