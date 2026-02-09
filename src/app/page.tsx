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
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1a1520] to-[#0A0A0A]"></div>
        <div className="absolute inset-0 opacity-[0.015]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\\"200\\" height=\\"200\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cfilter id=\\"noise\\"%3E%3CfeTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.9\\" numOctaves=\\"4\\" /%3E%3C/filter%3E%3Crect width=\\"100%25\\" height=\\"100%25\\" filter=\\"url(%23noise)\\" /%3E%3C/svg%3E")'}}></div>
        
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-t from-[#FF6633] via-[#FF6633]/40 to-transparent opacity-20 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
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

      {/* Section: Le Club */}
      <section id="le-club" className="relative py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
              On se voit en vrai.<br />
              <span className="font-serif italic text-[#FF6633]">C&apos;est là que ça accélère.</span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Pas de formats compliqués. Pas de blabla théorique. Des rendez-vous simples, efficaces, utiles.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Événements */}
      <section id="evenements" className="relative py-24 px-6 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6">
              Chaque mois, 3 formats.<br />
              <span className="font-serif italic text-[#FF6633]">Zéro bullshit.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Networking */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-white text-2xl font-bold mb-4">Networking</h3>
              <p className="text-white/60 mb-6">
                Des rencontres mensuelles pour étendre ton réseau local. Entrepreneurs, commerçants, porteurs de projets : tu te connectes avec ceux qui bougent dans la région.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-white/60">
                  <span className="text-[#FF6633] mt-1">✓</span>
                  <span>Format court & efficace</span>
                </li>
                <li className="flex items-start gap-2 text-white/60">
                  <span className="text-[#FF6633] mt-1">✓</span>
                  <span>Ambiance décontractée</span>
                </li>
                <li className="flex items-start gap-2 text-white/60">
                  <span className="text-[#FF6633] mt-1">✓</span>
                  <span>Contacts qualifiés</span>
                </li>
              </ul>
            </div>

            {/* Workshop */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-white text-2xl font-bold mb-4">Workshop</h3>
              <p className="text-white/60 mb-6">
                Un sujet concret, actionnable. On décortique un point qui fait avancer : offre, positionnement, acquisition client, prix...
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-white/60">
                  <span className="text-[#FF6633] mt-1">✓</span>
                  <span>Thèmes business concrets</span>
                </li>
                <li className="flex items-start gap-2 text-white/60">
                  <span className="text-[#FF6633] mt-1">✓</span>
                  <span>Framework applicable direct</span>
                </li>
                <li className="flex items-start gap-2 text-white/60">
                  <span className="text-[#FF6633] mt-1">✓</span>
                  <span>Groupe limité</span>
                </li>
              </ul>
            </div>

            {/* Q&A */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-white text-2xl font-bold mb-4">Office Hours</h3>
              <p className="text-white/60 mb-6">
                Tu viens avec tes questions, tes blocages, tes défis. On débrief en direct, sans filtre, avec des réponses pragmatiques.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-white/60">
                  <span className="text-[#FF6633] mt-1">✓</span>
                  <span>Sessions live & interactives</span>
                </li>
                <li className="flex items-start gap-2 text-white/60">
                  <span className="text-[#FF6633] mt-1">✓</span>
                  <span>Réponses à tes questions</span>
                </li>
                <li className="flex items-start gap-2 text-white/60">
                  <span className="text-[#FF6633] mt-1">✓</span>
                  <span>Accès aux replays</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Offres CORE */}
      <section id="offres" className="relative py-24 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6633]/10 border border-[#FF6633]/30 mb-6">
              <span className="text-[#FF6633] text-sm font-bold">OFFRE CORE</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
              CHF 59.–/mois.<br />
              <span className="font-serif italic text-[#FF6633]">Tout compris.</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-10">
            <h3 className="text-white text-3xl font-bold mb-8 text-center">BYZCLUB CORE</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FF6633]/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white text-lg">1 Networking mensuel (présentiel)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FF6633]/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white text-lg">1 Workshop thématique par mois</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FF6633]/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white text-lg">Accès aux Office Hours (Q&A live)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FF6633]/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white text-lg">Groupe WhatsApp privé des membres</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FF6633]/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white text-lg">Ressources & templates exclusifs</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-8">
              <p className="text-white/60 text-center">
                <strong className="text-white">Engagement 3 mois</strong>, puis mensuel sans engagement
              </p>
            </div>

            <div className="text-center">
              <a href="#contact" className="inline-flex items-center gap-2 px-10 py-4 bg-[#FF6633] hover:bg-[#FF5522] text-white text-lg font-medium rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-[#FF6633]/50 hover:scale-105">
                Rejoindre BYZCLUB CORE
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <p className="text-white/40 text-sm mt-4">Places limitées · Bêta contrôlée</p>
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
