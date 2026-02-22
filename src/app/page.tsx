'use client';

import LogoPremium from '@/components/LogoPremium';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5">
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
            <a href="#offres" className="px-6 py-2.5 bg-[#FF6633] hover:bg-[#FF5522] text-white text-sm font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#FF6633]/50 hover:scale-105 whitespace-nowrap">
              Rejoindre BYZCLUB CORE
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1a1520] to-[#0A0A0A]"></div>
        <div className="absolute inset-0 opacity-[0.015]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\\"200\\" height=\\"200\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cfilter id=\\"noise\\"%3E%3CfeTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.9\\" numOctaves=\\"4\\" /%3E%3C/filter%3E%3Crect width=\\"100%25\\" height=\\"100%25\\" filter=\\"url(%23noise)\\" /%3E%3C/svg%3E")'}}></div>
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-t from-[#FF6633] via-[#FF6633]/40 to-transparent opacity-20 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF6633]/10 backdrop-blur-xl border border-[#FF6633]/30 mb-8">
              <span className="text-[#FF6633] text-sm font-bold">100% local</span>
              <span className="text-white/50 text-sm">—</span>
              <span className="text-white/80 text-sm font-medium">Neuchâtel & environs</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-[1.05]">
              Visibilité locale.<br />
              Réseau.<br />
              <span className="font-serif italic text-[#FF6633]">Actions concrètes.</span>
            </h1>

            <p className="text-xl text-white/70 mb-10 leading-relaxed max-w-2xl">
              Chaque mois : <strong className="text-white">1 networking</strong> + <strong className="text-white">1 workshop</strong> + <strong className="text-white">1 Q&A</strong>.<br />
              Tu repars avec un plan simple et tu avances avec les bons contacts.
            </p>

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
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6633] opacity-10 blur-[60px] rounded-full"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-white font-bold text-2xl tracking-wider">CE MOIS-CI</h3>
                  <div className="px-3 py-1 rounded-full bg-[#FF6633]/20 text-[#FF6633] text-xs font-medium">Aperçu</div>
                </div>
                
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[#FF6633]"></div>
                      <p className="text-white/50 text-xs font-bold tracking-wider">NETWORKING</p>
                    </div>
                    <p className="text-white font-medium">12 février, 18h30</p>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-white/40"></div>
                      <p className="text-white/50 text-xs font-bold tracking-wider">WORKSHOP</p>
                    </div>
                    <p className="text-white font-medium">Créer une offre qui génère des demandes</p>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-white/40"></div>
                      <p className="text-white/50 text-xs font-bold tracking-wider">OFFICE HOURS</p>
                    </div>
                    <p className="text-white font-medium">26 février, 17h00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: 4 Cards - 1/mois */}
      <section className="relative py-20 px-6 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="text-7xl font-bold text-[#FF6633] mb-4">1</div>
              <h3 className="text-white text-base font-bold mb-2 uppercase tracking-wide">NETWORKING / MOIS</h3>
              <p className="text-white/50 text-sm">→ connexions locales</p>
            </div>
            <div className="p-8 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="text-7xl font-bold text-[#FF6633] mb-4">1</div>
              <h3 className="text-white text-base font-bold mb-2 uppercase tracking-wide">WORKSHOP / MOIS</h3>
              <p className="text-white/50 text-sm">→ compétence + application</p>
            </div>
            <div className="p-8 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="text-7xl font-bold text-[#FF6633] mb-4">1</div>
              <h3 className="text-white text-base font-bold mb-2 uppercase tracking-wide">Q&A / MOIS</h3>
              <p className="text-white/50 text-sm">→ blocages réglés</p>
            </div>
            <div className="p-8 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-white text-base font-bold mb-2 uppercase tracking-wide">RESSOURCES + ANNUAIRE</h3>
              <p className="text-white/50 text-sm">→ exécution plus rapide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: BYZCLUB = */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
            BYZCLUB = du terrain + du réseau +<br />
            <span className="font-serif italic text-[#FF6633]">du momentum.</span>
          </h2>
        </div>
      </section>

      {/* Section: Plan mensuel */}
      <section id="le-club" className="relative py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
              Un plan mensuel.<br />
              <span className="font-serif italic text-[#FF6633]">Trois rendez-vous obligatoires.</span>
            </h2>
            <p className="text-white/60 text-lg">
              Chaque mois, tu sais où tu vas. Chaque mois, tu rencontres les bonnes personnes.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="grid gap-8">
              <div className="flex items-start gap-6">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#FF6633] flex items-center justify-center text-white font-bold text-sm">1</div>
                </div>
                <div>
                  <p className="text-[#FF6633] text-xs font-bold uppercase tracking-wider mb-3">SEMAINE 1-2</p>
                  <h3 className="text-white text-2xl font-bold mb-3">NETWORKING</h3>
                  <p className="text-white/60">
                    20-30 entrepreneurs locaux. Format simple : présentation + échanges libres + follow-up.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#3a3a3a] flex items-center justify-center text-white/60 font-bold text-sm">2</div>
                </div>
                <div>
                  <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-3">SEMAINE 2-3</p>
                  <h3 className="text-white text-2xl font-bold mb-3">WORKSHOP</h3>
                  <p className="text-white/60">
                    1 compétence concrète. Format : théorie rapide + exercice pratique + retours en live.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#3a3a3a] flex items-center justify-center text-white/60 font-bold text-sm">3</div>
                </div>
                <div>
                  <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-3">SEMAINE 4</p>
                  <h3 className="text-white text-2xl font-bold mb-3">OFFICE HOURS (Q&A)</h3>
                  <p className="text-white/60">
                    Tu viens avec tes blocages. On règle ça ensemble. Hot seat ouvert.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-10 rounded-3xl bg-gradient-to-br from-[#3d2618] to-[#2a1810] border border-[#FF6633]/20">
              <h3 className="text-white text-2xl font-bold mb-8 uppercase tracking-wide">RÉSULTAT ATTENDU</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-[#FF6633] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white text-lg">Plus de demandes entrantes</p>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-[#FF6633] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white text-lg">Plus de contacts pertinents</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Événements prochains */}
      <section id="evenements" className="relative py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
              On se voit en vrai.<br />
              <span className="font-serif italic text-[#FF6633]">C&apos;est là que ça accélère.</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Pas de formats compliqués. Pas de blabla théorique. Des rendez-vous simples, efficaces, utiles.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="p-10 rounded-3xl bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#FF6633] text-white text-xs font-bold uppercase tracking-wider mb-8">
                PROCHAIN ÉVÈNEMENT
              </div>
              <h3 className="text-white text-3xl font-bold mb-8">NETWORKING FÉVRIER</h3>
              <div className="space-y-5 mb-10">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white font-medium"><strong>12 février, 18h30</strong></p>
                  <p className="text-white/60">Durée : env. 2h</p>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white font-medium"><strong>Neuchâtel (lieu confirmé par email)</strong></p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#FF6633] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <p className="text-white font-medium"><strong>Format : présentations courtes + échanges libres</strong></p>
                </div>
              </div>
              <a href="#offres" className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#FF6633] hover:bg-[#FF5522] text-white font-bold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#FF6633]/50">
                Rejoindre pour participer
              </a>
            </div>

            <div className="p-10 rounded-3xl bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#3a3a3a] text-white/60 text-xs font-bold uppercase tracking-wider mb-8">
                WORKSHOP DU MOIS
              </div>
              <h3 className="text-white text-3xl font-bold mb-6">CRÉER UNE OFFRE QUI GÉNÈRE DES DEMANDES</h3>
              <p className="text-white/60 mb-8 leading-relaxed">
                Arrête de proposer &quot;tout ce que tu fais&quot;. Construis une offre claire, concrète, qui attire les bonnes personnes.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-white/70">
                  <svg className="w-5 h-5 text-[#FF6633] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Définir ton offre principale</span>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <svg className="w-5 h-5 text-[#FF6633] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Formuler le problème que tu règles</span>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <svg className="w-5 h-5 text-[#FF6633] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Créer une présentation efficace</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#FF6633]/10 to-transparent border border-[#FF6633]/20">
            <p className="text-white/70 flex items-center justify-center gap-3 text-center">
              <span className="text-2xl">💡</span>
              <span>Les events servent aussi à créer du contenu (stories, reels, photos).</span>
            </p>
          </div>
        </div>
      </section>

      {/* Section: Offres CORE + PREMIUM */}
      <section id="offres" className="relative py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1.5 rounded-full bg-[#FF6633] text-white text-xs font-bold uppercase tracking-wider mb-6">
              OFFRES
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4">
              Rejoins le club.<br />
              <span className="font-serif italic text-[#FF6633]">Crée du momentum local.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* BYZCLUB CORE */}
            <div className="relative p-10 rounded-3xl bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <h3 className="text-white text-sm font-bold uppercase tracking-wider">BYZCLUB CORE</h3>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-green-600 text-white text-xs font-bold uppercase">
                  OFFERT
                </div>
              </div>

              <div className="mb-8">
                <div className="text-6xl font-bold text-white mb-2">59</div>
                <p className="text-white/60 text-lg">CHF / mois</p>
              </div>

              <div className="mb-8">
                <p className="text-white mb-6">
                  <strong>Engagement minimum : 3 mois</strong>
                </p>
                <p className="text-white font-bold mb-4">CORE, c&apos;est pour toi si :</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-white/70">
                    <span className="text-[#FF6633]">✓</span>
                    <span>tu veux une structure simple</span>
                  </li>
                  <li className="flex items-start gap-2 text-white/70">
                    <span className="text-[#FF6633]">✓</span>
                    <span>tu veux rencontrer les bonnes personnes localement</span>
                  </li>
                  <li className="flex items-start gap-2 text-white/70">
                    <span className="text-[#FF6633]">✓</span>
                    <span>tu veux arrêter de communiquer au hasard</span>
                  </li>
                </ul>
              </div>

              <a href="#contact" className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FF6633] hover:bg-[#FF5522] text-white font-bold rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-[#FF6633]/50">
                Rejoindre CORE
              </a>
            </div>

            {/* BYZCLUB PREMIUM */}
            <div className="relative p-10 rounded-3xl bg-[#1a1a1a]/40 border border-[#2a2a2a]/40 opacity-50">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/30"></div>
                  <h3 className="text-white/50 text-sm font-bold uppercase tracking-wider">BYZCLUB PREMIUM</h3>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-white/10 text-white/40 text-xs font-bold uppercase">
                  COMING SOON
                </div>
              </div>

              <div className="mb-8">
                <div className="text-6xl font-bold text-white/50 mb-2">179</div>
                <p className="text-white/40 text-lg">CHF / mois</p>
              </div>

              <div className="mb-8">
                <p className="text-white/50 font-bold mb-6">BYZCLUB PREMIUM arrive bientôt.</p>
                <p className="text-white/40 text-sm mb-4">
                  Une offre limitée orientée opportunités, connexions stratégiques et croissance.
                </p>
                <p className="text-white/40 text-sm">Ouverture après 3 mois</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Section: Contact */}
      <section id="contact" className="relative py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Une question ?<br />
            <span className="font-serif italic text-[#FF6633]">On en parle.</span>
          </h2>
          <p className="text-lg text-white/60 mb-10">
            Envoie un message ou réserve un call de 15 minutes pour voir si BYZCLUB correspond à ce que tu cherches.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="mailto:contact@byzclub.ch" className="px-8 py-3 bg-[#FF6633] hover:bg-[#FF5522] text-white font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#FF6633]/50">
              contact@byzclub.ch
            </a>
            <a href="tel:+41791234567" className="px-8 py-3 text-white/80 hover:text-white transition-all duration-300 rounded-full hover:bg-white/5 border border-white/10">
              +41 79 123 45 67
            </a>
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
