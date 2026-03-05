'use client';

import LogoPremium from '@/components/LogoPremium';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <LogoPremium />
          
          <div className="hidden lg:flex items-center gap-1">
            <a href="#le-club" className="group relative text-white/60 hover:text-white transition-all duration-300 text-sm font-medium px-4 py-2">
              <span className="relative z-10">Le club</span>
              <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/5 transition-all duration-300"></span>
            </a>
            <span className="text-white/20">•</span>
            <a href="#evenements" className="group relative text-white/60 hover:text-white transition-all duration-300 text-sm font-medium px-4 py-2">
              <span className="relative z-10">Événements</span>
              <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/5 transition-all duration-300"></span>
            </a>
            <span className="text-white/20">•</span>
            <a href="#ressources" className="group relative text-white/60 hover:text-white transition-all duration-300 text-sm font-medium px-4 py-2">
              <span className="relative z-10">Ressources</span>
              <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/5 transition-all duration-300"></span>
            </a>
            <span className="text-white/20">•</span>
            <a href="#offres" className="group relative text-white/60 hover:text-white transition-all duration-300 text-sm font-medium px-4 py-2">
              <span className="relative z-10">Offres</span>
              <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/5 transition-all duration-300"></span>
            </a>
            <span className="text-white/20">•</span>
            <a href="#services" className="group relative text-white/60 hover:text-white transition-all duration-300 text-sm font-medium px-4 py-2">
              <span className="relative z-10">Services</span>
              <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/5 transition-all duration-300"></span>
            </a>
            <span className="text-white/20">•</span>
            <a href="#contact" className="group relative text-white/60 hover:text-white transition-all duration-300 text-sm font-medium px-4 py-2">
              <span className="relative z-10">Contact</span>
              <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/5 transition-all duration-300"></span>
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-white/50">
              <span>📍</span>
              <span>Neuchâtel & environs</span>
            </div>
            <a href="/client-portal" className="group relative px-5 py-2.5 text-white/70 hover:text-white transition-all duration-300 text-sm font-medium rounded-full hover:bg-white/10 border border-white/10 hover:border-white/30 backdrop-blur-sm overflow-hidden flex items-center gap-2">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              <svg className="relative w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span className="relative">Espace Client</span>
            </a>
            <a href="#offres" className="group relative px-6 py-2.5 bg-gradient-to-r from-[#FF6633] to-[#FF5522] hover:from-[#FF5522] hover:to-[#FF6633] text-white text-sm font-bold rounded-full transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF6633]/60 hover:scale-105 whitespace-nowrap overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
              <span className="relative">Rejoindre BYZCLUB CORE</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1a1520] to-[#0A0A0A]"></div>
        <div className="absolute inset-0 opacity-[0.015]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"200\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulance type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" /%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\" /%3E%3C/svg%3E")'}}></div>
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-t from-[#FF6633] via-[#FF6633]/40 to-transparent opacity-20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-l from-[#FF6633]/10 to-transparent opacity-30 blur-[100px] rounded-full"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF6633]/10 via-[#FF6633]/5 to-transparent backdrop-blur-xl border border-[#FF6633]/30 mb-8 hover:border-[#FF6633]/50 transition-all duration-500 hover:shadow-lg hover:shadow-[#FF6633]/20 group">
              <span className="text-[#FF6633] text-sm font-bold group-hover:scale-110 transition-transform">100% local</span>
              <span className="text-white/50 text-sm">—</span>
              <span className="text-white/80 text-sm font-medium">Neuchâtel & environs</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-[1.05]">
              <span className="inline-block hover:text-[#FF6633]/80 transition-colors duration-300">Visibilité locale.</span><br />
              <span className="inline-block hover:text-[#FF6633]/80 transition-colors duration-300">Réseau.</span><br />
              <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#FF6633] via-[#FF8855] to-[#FF6633] animate-gradient-x">Actions concrètes.</span>
            </h1>

            <p className="text-xl text-white/70 mb-10 leading-relaxed max-w-2xl">
              Chaque mois : <strong className="text-white">1 networking</strong> + <strong className="text-white">1 workshop</strong> + <strong className="text-white">1 Q&A</strong>.<br />
              Tu repars avec un plan simple et tu avances avec les bons contacts.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
              <a href="#offres" className="group inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[#FF6633] to-[#FF5522] hover:from-[#FF5522] hover:to-[#FF6633] text-white text-base font-bold rounded-full transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF6633]/60 hover:scale-105 relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                <span className="relative">Rejoindre CORE (CHF 59.–/mois)</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a href="#contact" className="group px-10 py-4 text-white/80 hover:text-white transition-all duration-300 text-base rounded-full hover:bg-white/10 border border-white/10 hover:border-white/30 backdrop-blur-sm relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                <span className="relative">Demander un audit express (15 min)</span>
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
                    <p className="text-white font-medium">Bientôt disponible</p>
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
                    <p className="text-white font-medium">Bientôt disponible</p>
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
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] hover:border-[#FF6633]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF6633]/20 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6633]/0 to-[#FF6633]/0 group-hover:from-[#FF6633]/5 group-hover:to-transparent transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="text-7xl font-bold text-[#FF6633] mb-4 group-hover:scale-110 transition-transform duration-500">1</div>
                <h3 className="text-white text-base font-bold mb-2 uppercase tracking-wide">NETWORKING / MOIS</h3>
                <p className="text-white/50 text-sm group-hover:text-white/70 transition-colors">→ connexions locales</p>
              </div>
            </div>
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] hover:border-[#FF6633]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF6633]/20 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6633]/0 to-[#FF6633]/0 group-hover:from-[#FF6633]/5 group-hover:to-transparent transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="text-7xl font-bold text-[#FF6633] mb-4 group-hover:scale-110 transition-transform duration-500">1</div>
                <h3 className="text-white text-base font-bold mb-2 uppercase tracking-wide">WORKSHOP / MOIS</h3>
                <p className="text-white/50 text-sm group-hover:text-white/70 transition-colors">→ compétence + application</p>
              </div>
            </div>
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] hover:border-[#FF6633]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF6633]/20 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6633]/0 to-[#FF6633]/0 group-hover:from-[#FF6633]/5 group-hover:to-transparent transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="text-7xl font-bold text-[#FF6633] mb-4 group-hover:scale-110 transition-transform duration-500">1</div>
                <h3 className="text-white text-base font-bold mb-2 uppercase tracking-wide">Q&A / MOIS</h3>
                <p className="text-white/50 text-sm group-hover:text-white/70 transition-colors">→ blocages réglés</p>
              </div>
            </div>
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] hover:border-[#FF6633]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF6633]/20 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6633]/0 to-[#FF6633]/0 group-hover:from-[#FF6633]/5 group-hover:to-transparent transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">📋</div>
                <h3 className="text-white text-base font-bold mb-2 uppercase tracking-wide">RESSOURCES + ANNUAIRE</h3>
                <p className="text-white/50 text-sm group-hover:text-white/70 transition-colors">→ exécution plus rapide</p>
              </div>
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
            <div className="group p-10 rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] hover:border-[#FF6633]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF6633]/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6633]/0 to-[#FF6633]/0 group-hover:from-[#FF6633]/5 group-hover:to-transparent transition-all duration-500"></div>
              <div className="relative z-10">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#FF6633] text-white text-xs font-bold uppercase tracking-wider mb-8">
                PROCHAIN ÉVÈNEMENT
              </div>
              <h3 className="text-white text-3xl font-bold mb-8">NETWORKING FÉVRIER</h3>
              <div className="space-y-5 mb-10">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#FF6633]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white font-medium"><strong>Bientôt disponible</strong></p>
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
              <a href="#offres" className="group/btn relative w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#FF6633] to-[#FF5522] hover:from-[#FF5522] hover:to-[#FF6633] text-white font-bold rounded-full transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF6633]/60 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></span>
                <span className="relative">Rejoindre pour participer</span>
              </a>
              </div>
            </div>

            <div className="group p-10 rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] hover:border-white/20 transition-all duration-500 hover:shadow-xl hover:shadow-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/[0.02] group-hover:to-transparent transition-all duration-500"></div>
              <div className="relative z-10">
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
            <div className="group relative p-10 rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] hover:border-[#FF6633]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF6633]/20 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6633]/0 to-[#FF6633]/0 group-hover:from-[#FF6633]/5 group-hover:to-transparent transition-all duration-500"></div>
              <div className="relative z-10">
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

              <a href="#contact" className="group/btn relative w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF6633] to-[#FF5522] hover:from-[#FF5522] hover:to-[#FF6633] text-white font-bold rounded-full transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF6633]/60 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></span>
                <span className="relative">Rejoindre CORE</span>
              </a>
              </div>
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


      {/* ═══════════════════════════════════════════════════════════
           SECTION : ACCOMPAGNEMENT MARKETING
      ══════════════════════════════════════════════════════════════ */}
      <section id="services" className="relative py-28 px-6 bg-gradient-to-b from-[#0A0A0A] to-[#060606] overflow-hidden">
        {/* Bg glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF6633]/8 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-900/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF6633]/10 border border-[#FF6633]/30 text-[#FF6633] text-xs font-bold uppercase tracking-widest mb-6">
              / Les abonnements /
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-[1.05]">
              Gestion Réseaux<br />
              <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#FF6633] via-[#FF8855] to-[#FF6633]">Sociaux.</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Un accompagnement marketing complet pour booster ta présence en ligne et transformer ton audience en clients.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-6 items-start">

            {/* Starter */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-[#161616] to-[#0f0f0f] border border-[#2a2a2a] hover:border-[#FF6633]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF6633]/10 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6633]/0 group-hover:from-[#FF6633]/5 to-transparent transition-all duration-500"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.02] rounded-bl-full"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                <p className="text-white/50 text-sm mb-6">Idéal pour une présence en ligne régulière et pro</p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Gestion de 1 Plateforme',
                    '10 posts/mois (graphismes + captions)',
                    'Analyse trimestrielle de la performance',
                    'Contenus cohérents pour renforcer ton image',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/70 text-sm">
                      <span className="text-[#FF6633] mt-0.5 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="group/btn relative w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[#FF6633]/50 text-[#FF6633] text-sm font-bold hover:bg-[#FF6633] hover:text-white transition-all duration-300 overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></span>
                  <svg className="relative w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  <span className="relative">Demander un Devis</span>
                </a>
              </div>
            </div>

            {/* Growth — Populaire */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-[#1e1e1e] to-[#141414] border-2 border-[#FF6633]/50 shadow-2xl shadow-[#FF6633]/20 hover:-translate-y-3 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6633]/8 to-transparent pointer-events-none"></div>
              {/* Badge populaire */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF6633] to-[#FF5522] rounded-full blur-lg opacity-60"></div>
                  <span className="relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FF6633] to-[#FF5522] text-white text-xs font-black uppercase tracking-widest shadow-lg">
                    ★ Populaire
                  </span>
                </div>
              </div>
              <div className="relative z-10 mt-2">
                <h3 className="text-2xl font-bold text-white mb-2">Growth</h3>
                <p className="text-[#FF6633] text-sm font-semibold mb-6">Notre BestSeller pour booster ton engagement</p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Gestion jusqu\'à 2 plateformes',
                    'Gestion des commentaires & messages',
                    '15 à 20 contenus/mois (graphismes, captions, vidéos courtes)',
                    'Analyse mensuelle + conseils stratégiques',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/80 text-sm">
                      <span className="text-[#FF6633] mt-0.5 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="group/btn relative w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#FF6633] to-[#FF5522] hover:from-[#FF5522] hover:to-[#FF6633] text-white text-sm font-bold transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF6633]/60 overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></span>
                  <svg className="relative w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  <span className="relative">Demander un Devis</span>
                </a>
              </div>
            </div>

            {/* Accelerate */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-[#161616] to-[#0f0f0f] border border-[#2a2a2a] hover:border-[#FF6633]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF6633]/10 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6633]/0 group-hover:from-[#FF6633]/5 to-transparent transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/[0.02] rounded-tr-full"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">Accelerate</h3>
                <p className="text-white/50 text-sm mb-6">La formule complète pour une croissance maximale</p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Gestion multi-plateformes avec +25 contenus/mois (premium vidéos)',
                    'Stratégie d\'influence et collaborations',
                    'Publicité payante (budget à part)',
                    'Analytics hebdomadaires & coaching personnalisé',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/70 text-sm">
                      <span className="text-[#FF6633] mt-0.5 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="group/btn relative w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[#FF6633]/50 text-[#FF6633] text-sm font-bold hover:bg-[#FF6633] hover:text-white transition-all duration-300 overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></span>
                  <svg className="relative w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  <span className="relative">Demander un Devis</span>
                </a>
              </div>
            </div>

          </div>

          {/* Portail client CTA */}
          <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1a1a1a] via-[#161616] to-[#1a1a1a] border border-white/10 p-8 md:p-10">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#FF6633]/10 blur-[80px] pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-purple-600/10 blur-[60px] pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Déjà client
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Accède à ton espace client</h3>
                <p className="text-white/60 text-base max-w-lg">
                  Suis tes projets, consulte tes stratégies, approuve tes concepts et télécharge tes documents — tout en un seul endroit.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <a href="/client-portal" className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#FF6633] to-[#FF5522] hover:from-[#FF5522] hover:to-[#FF6633] text-white font-bold rounded-full transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF6633]/60 hover:scale-105 whitespace-nowrap overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                  <svg className="relative w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span className="relative">Accéder à mon espace</span>
                </a>
                <a href="/login" className="group relative inline-flex items-center justify-center gap-2 px-6 py-4 text-white/70 hover:text-white rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 whitespace-nowrap overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  <span className="relative text-sm font-medium">Se connecter</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Section: Contact */}
      <section id="contact" className="relative py-24 px-6 bg-gradient-to-b from-[#0A0A0A] to-[#050505] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF6633]/20 blur-[100px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Une question ?<br />
            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#FF6633] via-[#FF8855] to-[#FF6633]">On en parle.</span>
          </h2>
          <p className="text-lg text-white/60 mb-10">
            Envoie un message ou réserve un call de 15 minutes pour voir si BYZCLUB correspond à ce que tu cherches.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="mailto:contact@byzclub.ch" className="group relative px-8 py-3 bg-gradient-to-r from-[#FF6633] to-[#FF5522] hover:from-[#FF5522] hover:to-[#FF6633] text-white font-bold rounded-full transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF6633]/60 hover:scale-105 overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
              <span className="relative">contact@byzclub.ch</span>
            </a>
            <a href="tel:+41791234567" className="group relative px-8 py-3 text-white/80 hover:text-white transition-all duration-300 rounded-full hover:bg-white/10 border border-white/10 hover:border-white/30 backdrop-blur-sm overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              <span className="relative">+41 79 123 45 67</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-6 bg-gradient-to-b from-[#050505] to-[#0A0A0A] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block hover:scale-110 transition-transform duration-300">
              <LogoPremium />
            </div>
            <p className="text-white/40 mt-6 leading-relaxed max-w-2xl mx-auto">
              BYZCLUB — Réseau local pour entrepreneurs & commerçants à Neuchâtel.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 mb-10 text-white/40 text-sm">
            <a href="#le-club" className="group relative hover:text-[#FF6633] transition-all duration-300">
              <span className="relative z-10">Le club</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6633] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#evenements" className="group relative hover:text-[#FF6633] transition-all duration-300">
              <span className="relative z-10">Événements</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6633] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#ressources" className="group relative hover:text-[#FF6633] transition-all duration-300">
              <span className="relative z-10">Ressources</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6633] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#offres" className="group relative hover:text-[#FF6633] transition-all duration-300">
              <span className="relative z-10">Offres</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6633] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#services" className="group relative hover:text-[#FF6633] transition-all duration-300">
              <span className="relative z-10">Services</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6633] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#contact" className="group relative hover:text-[#FF6633] transition-all duration-300">
              <span className="relative z-10">Contact</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6633] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="/client-portal" className="group relative hover:text-[#FF6633] transition-all duration-300 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span className="relative z-10">Espace Client</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6633] group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>

          <div className="pt-8 border-t border-white/5 text-center">
            <p className="text-white/30 text-sm">
              © 2025 BYZCLUB · Tous droits réservés
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
