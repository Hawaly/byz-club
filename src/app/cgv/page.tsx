'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, FileText, Scale, Shield, Clock, AlertCircle, Lock, Users, Zap, Globe } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <motion.div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16 sm:py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />Retour à l'accueil
          </Link>
          <motion.div {...fadeInUp}>
            <div className="flex items-center gap-3 mb-4"><Scale className="w-10 h-10" /><h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Conditions Générales de Vente</h1></div>
            <p className="text-lg text-white/90 max-w-2xl">Conditions applicables aux prestations fournies par <strong>BYZCLUB</strong></p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/80">
              <span>Entrée en vigueur : 22 octobre 2025</span><span>•</span><span>Droit suisse</span><span>•</span><span>For : Canton de Neuchâtel</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>

          {/* Sommaire */}
          <div className="bg-gradient-to-r from-orange-50 to-white p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-orange-500" />Sommaire</h2>
            <nav className="grid sm:grid-cols-2 lg:grid-cols-3 gap-1.5 text-sm">
              {["Préambule","Chap. I — Dispositions générales","Chap. II — Commande, tarifs et paiements","Chap. III — Exécution des prestations","Chap. IV — Propriété intellectuelle","Chap. V — Données et cybersécurité","Chap. VI — Collaboration et communication","Chap. VII — Partenaires et sous-traitants","Chap. VIII — Performance et garanties","Chap. IX — Conformité et déontologie","Chap. X — Éthique, image et réputation","Chap. XI — Sécurité numérique avancée","Chap. XII — Cessions et continuité","Chap. XIII — Résiliation et suspension","Chap. XIV — Litiges et droit applicable","Chap. XV — Clauses finales","Annexe A — Plans et formules","Annexe B — Conformité publicitaire","Annexe C — Tarifs de référence"].map((l, i) => (
                <a key={i} href={`#s${i}`} className="text-gray-600 hover:text-orange-600 hover:underline transition-colors py-0.5">{l}</a>
              ))}
            </nav>
          </div>

          {/* Mentions légales */}
          <div className="bg-gray-900 text-white p-6 sm:p-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-orange-400 mb-4">Mentions légales</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-300">
              {[["Agence","BYZCLUB"],["Forme juridique","Entreprise individuelle enregistrée en Suisse"],["Siège","Neuchâtel, Suisse"],["Groupe","HUSTLE GROUP SARL (en cours de création)"],["Droit applicable","Droit suisse"],["For juridique","Tribunaux du Canton de Neuchâtel"],["Site","www.byzclub.ch"]].map(([k,v]) => (
                <div key={k}><span className="font-bold text-white">{k} :</span> {k === "Site" ? <a href="https://byzclub.ch" className="text-orange-400 hover:underline">{v}</a> : v}</div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 space-y-12">

            {/* PRÉAMBULE */}
            <Section id="s0" title="Préambule" icon={<Zap className="w-6 h-6" />}>
              <p className="text-gray-700 leading-relaxed mb-3"><strong>BYZCLUB</strong> est une agence créative, digitale et stratégique spécialisée dans la construction, le positionnement et la communication des marques à travers des expériences sociales, visuelles et numériques à fort impact. L'Agence fait partie du groupe <strong>HUSTLE GROUP SARL</strong> (en cours de création), un groupe suisse dédié à la croissance et à l'innovation dans les domaines du digital, de la mode, du sport et de la communication.</p>
              <p className="text-gray-700 leading-relaxed mb-3">Ces CGV régissent l'ensemble des relations contractuelles entre BYZCLUB et ses Clients pour toutes prestations ponctuelles, récurrentes ou sur mesure, réalisées en Suisse ou à l'étranger.</p>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <p className="text-sm font-bold text-gray-800 mb-1">Elles ont pour objectif :</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                  <li>d'établir un cadre contractuel clair, équilibré et juridiquement opposable ;</li>
                  <li>de protéger les deux parties selon le CO, la LDA et la revDSG ;</li>
                  <li>de garantir la transparence, la confiance et la qualité d'exécution.</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed mt-3 text-sm italic">Toute commande, signature de devis, validation électronique ou paiement d'un acompte implique acceptation pleine et entière des présentes CGV.</p>
            </Section>

            {/* CHAPITRE I */}
            <ChapterHeader id="s1" number="I" title="Dispositions générales" />
            <Section id="art1" title="Art. 1 – Objet et champ d'application">
              <p className="text-gray-700 leading-relaxed mb-3">Les présentes CGV définissent les modalités contractuelles applicables à toutes les prestations de BYZCLUB : créatives (branding, identité visuelle, shooting), digitales (réseaux sociaux, publicité, sites web, hébergement), stratégiques (consulting, coaching, stratégie de marque) et techniques (développement, maintenance, intégration). Elles s'appliquent à toutes les ventes et prestations, en Suisse et à l'étranger.</p>
            </Section>
            <Section id="art2" title="Art. 2 – Définitions" icon={<FileText className="w-6 h-6" />}>
              <dl className="space-y-2">
                {[["Agence / BYZCLUB","La société prestataire, incluant ses représentants, collaborateurs et sous-traitants."],["Client","Toute personne physique ou morale contractant les services de l'Agence."],["Livrable","Toute création, document, fichier ou œuvre remis au Client dans le cadre du projet."],["Licence","Droit d'exploitation limité accordé par l'Agence, défini dans le devis ou contrat."],["Engagement minimum","Durée contractuelle minimale pendant laquelle les Parties s'engagent à collaborer."],["Force majeure","Événement extérieur, imprévisible et irrésistible au sens de l'art. 103 CO suisse."]].map(([t,d]) => <Term key={t} term={t} definition={d} />)}
              </dl>
            </Section>
            <Section id="art3" title="Art. 3 – Acceptation des conditions">
              <p className="text-gray-700 leading-relaxed">Toute commande implique la pleine acceptation des présentes CGV, disponibles sur <strong>www.byzclub.ch</strong>. Aucune condition émise par le Client ne peut prévaloir sur ces CGV, sauf acceptation écrite et signée de BYZCLUB. Le paiement d'un acompte, la validation d'un devis ou la signature d'un contrat valent engagement contractuel ferme.</p>
            </Section>
            <Section id="art4" title="Art. 4 – Intégralité, entrée en vigueur et langue">
              <p className="text-gray-700 leading-relaxed mb-2">Les présentes CGV, accompagnées des devis, factures et échanges écrits, constituent l'accord complet entre les Parties. Aucune condition orale ne peut être invoquée. En cas de contradiction, le devis signé prévaut.</p>
              <p className="text-gray-700 leading-relaxed mb-2">Entrée en vigueur : <strong>22 octobre 2025</strong>. BYZCLUB se réserve le droit de modifier ses CGV à tout moment ; la nouvelle version sera publiée sur www.byzclub.ch.</p>
              <p className="text-gray-700 leading-relaxed">Les présentes CGV sont rédigées en <strong>français</strong>, langue unique de référence. En cas de divergence avec une traduction, la version française fait foi.</p>
            </Section>

            {/* CHAPITRE II */}
            <ChapterHeader id="s2" number="II" title="Commande, tarifs et paiements" />
            <Section id="art7" title="Art. 7 – Processus de commande et devis">
              <p className="text-gray-700 leading-relaxed mb-3">Toute collaboration débute par un devis détaillant la nature des prestations, le périmètre, la durée et le tarif. Une commande est valide dès : signature du devis, validation écrite par e-mail, ou versement d'un acompte. Les devis ont une validité de <strong>30 jours</strong>.</p>
            </Section>
            <Section id="art9" title="Art. 9 – Acomptes et facturation">
              <p className="text-gray-700 leading-relaxed">Un acompte minimum de <strong>50 %</strong> est exigé pour confirmer toute commande. Pour les prestations récurrentes, la facturation est mensuelle et anticipée.</p>
            </Section>
            <Section id="art10" title="Art. 10 – Modalités de paiement">
              <p className="text-gray-700 leading-relaxed mb-3">Paiements en <strong>CHF</strong> par virement bancaire, carte (Stripe, Revolut, TWINT) ou exceptionnellement en espèces jusqu'à CHF 3'000.–.</p>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-sm font-bold mb-2">Tout retard entraîne :</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                  <li>Intérêts moratoires de 5 %/an (art. 104 CO)</li>
                  <li>Frais de rappel CHF 20.– par notification</li>
                  <li>Suspension des prestations au-delà de 30 jours</li>
                </ul>
              </div>
            </Section>
            <Section id="art11" title="Art. 11 – Retard et pénalités">
              <p className="text-gray-700 leading-relaxed mb-3">Délai de paiement : <strong>15 jours</strong> à compter de la date d'émission de la facture.</p>
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr><th className="text-left p-3 font-bold text-gray-700">Étape</th><th className="text-left p-3 font-bold text-gray-700">Action</th><th className="text-left p-3 font-bold text-gray-700">Frais</th></tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr><td className="p-3 text-gray-700">Jour 16</td><td className="p-3 text-gray-700">1ère relance e-mail</td><td className="p-3 text-green-700 font-semibold">Gratuite</td></tr>
                    <tr><td className="p-3 text-gray-700">Jour 23</td><td className="p-3 text-gray-700">2ème relance formelle</td><td className="p-3 text-orange-700 font-semibold">CHF 50.–</td></tr>
                    <tr><td className="p-3 text-gray-700">Jour 30+</td><td className="p-3 text-gray-700">Majoration forfaitaire</td><td className="p-3 text-red-700 font-semibold">5 % valeur annuelle</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-orange-50"><tr><th className="text-left p-3 font-bold text-gray-700">Formule</th><th className="text-left p-3 font-bold text-gray-700">Mensuel</th><th className="text-left p-3 font-bold text-gray-700">Majoration (5 % annuel)</th></tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr><td className="p-3 text-gray-700">Pack 1 — Local Visibility</td><td className="p-3">CHF 900.–</td><td className="p-3 font-semibold text-red-700">CHF 540.–</td></tr>
                    <tr><td className="p-3 text-gray-700">Pack 2 — Business Growth</td><td className="p-3">CHF 1'600.–</td><td className="p-3 font-semibold text-red-700">CHF 960.–</td></tr>
                    <tr><td className="p-3 text-gray-700">Pack 3 — Content Authority</td><td className="p-3">CHF 2'200.–</td><td className="p-3 font-semibold text-red-700">CHF 1'320.–</td></tr>
                    <tr><td className="p-3 text-gray-700">Pack 4 — Enterprise</td><td className="p-3">&gt; CHF 2'500.–</td><td className="p-3 font-semibold text-red-700">Plafonné CHF 1'500.–</td></tr>
                  </tbody>
                </table>
              </div>
            </Section>
            <Section id="art12" title="Art. 12 à 14 – Autres dispositions tarifaires">
              <ul className="space-y-3 text-gray-700 text-sm">
                <li><strong>Refus de paiement :</strong> Le Client ne peut retenir ni compenser une facture pour prestation déjà livrée. Toute contestation doit être formulée par écrit dans les <strong>5 jours ouvrables</strong>.</li>
                <li><strong>Révisions tarifaires :</strong> BYZCLUB peut réviser ses tarifs à tout moment. Les contrats en cours ne sont pas affectés sauf renouvellement. Indexation annuelle possible selon l'IPC suisse.</li>
                <li><strong>Offres sur mesure :</strong> Outre les formules standard, BYZCLUB propose des offres personnalisées pouvant inclure des SLA, intégrations HUSTLE GROUP SARL et options exclusives.</li>
              </ul>
            </Section>

            {/* CHAPITRE III */}
            <ChapterHeader id="s3" number="III" title="Exécution des prestations" />
            <Section id="art15" title="Art. 15 – Nature et périmètre des prestations">
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
                {["Branding et identité visuelle","Direction artistique et design","Gestion de réseaux sociaux","Campagnes publicitaires (Meta, Google, TikTok)","Production photo et vidéo","Création de sites web et e-commerce","Consulting et accompagnement digital","Packaging et communication visuelle","Coaching et stratégie de marque","Communication événementielle et influence"].map(s => (
                  <li key={s} className="flex items-start gap-2"><span className="text-orange-500 mt-0.5 shrink-0">•</span>{s}</li>
                ))}
              </ul>
            </Section>
            <Section id="art16" title="Art. 16 – Engagements et durées" icon={<Clock className="w-6 h-6" />}>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr><th className="text-left p-3 font-bold text-gray-700">Prestation</th><th className="text-left p-3 font-bold text-gray-700">Durée min.</th><th className="text-left p-3 font-bold text-gray-700">Préavis</th></tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr><td className="p-3 text-gray-700">Social Media</td><td className="p-3 text-gray-700">3 mois, reconduction 12 mois</td><td className="p-3 text-gray-700">90 jours</td></tr>
                    <tr><td className="p-3 text-gray-700">Sites Web / Hébergements</td><td className="p-3 text-gray-700">24 mois, reconduction 5 ans</td><td className="p-3 text-gray-700">180 jours</td></tr>
                    <tr><td className="p-3 text-gray-700">Prestations ponctuelles</td><td className="p-3 text-gray-700">1 mois</td><td className="p-3 text-gray-700">Non annulable après validation</td></tr>
                    <tr><td className="p-3 text-gray-700">Pack Enterprise</td><td className="p-3 text-gray-700">Selon contrat SLA</td><td className="p-3 text-gray-700">Selon contrat</td></tr>
                  </tbody>
                </table>
              </div>
            </Section>
            <Section id="art17" title="Art. 17 à 23 – Délais, livrables, reporting et publicité">
              <ul className="space-y-3 text-sm text-gray-700">
                <li><strong>Délais :</strong> Les plannings peuvent être ajustés en cas de retard du Client. Aucun retard ne peut être reproché à l'Agence si le Client n'a pas fourni les éléments requis.</li>
                <li><strong>Validation des livrables :</strong> 5 jours ouvrables pour valider ou demander des corrections. Passé ce délai, livraison réputée acceptée. Corrections supplémentaires : CHF 120.–/h.</li>
                <li><strong>Révisions incluses :</strong> Branding : 2 allers-retours · Photo/Vidéo : 1 série · Web : pendant la recette · Social Media : 2/mois.</li>
                <li><strong>Réunions de suivi :</strong> Pack 1 → trimestriel · Pack 2 → mensuel · Pack 3 → hebdomadaire · Pack 4 → sur mesure.</li>
                <li><strong>Reporting :</strong> Pack 1 → trimestriel · Pack 2 → mensuel · Pack 3 → hebdomadaire · Pack 4 → dashboard sur mesure.</li>
                <li><strong>Budgets publicitaires :</strong> Distincts des honoraires. Le Client reste propriétaire de ses comptes publicitaires et données.</li>
              </ul>
            </Section>

            {/* CHAPITRE IV */}
            <ChapterHeader id="s4" number="IV" title="Propriété intellectuelle" />
            <Section id="art24" title="Art. 24 à 28 – Droits d'auteur, licences et portfolio" icon={<Shield className="w-6 h-6" />}>
              <ul className="space-y-3 text-sm text-gray-700">
                <li><strong>Avant paiement complet :</strong> tous les livrables restent propriété de BYZCLUB. Aucune exploitation commerciale sans paiement intégral.</li>
                <li><strong>Après paiement complet :</strong> licence d'exploitation limitée, non exclusive, non transférable accordée au Client (durée : 12 mois par défaut, territoire : Suisse). Toute extension nécessite un accord écrit supplémentaire.</li>
                <li><strong>Fichiers sources</strong> (Photoshop, Premiere, etc.) : propriété exclusive de l'Agence, sauf rachat explicite.</li>
                <li><strong>Concepts non retenus :</strong> toutes ébauches et pistes créatives restent propriété de l'Agence. Toute réutilisation constitue une atteinte au droit d'auteur.</li>
                <li><strong>Droit de portfolio :</strong> sauf opposition écrite, BYZCLUB peut utiliser les réalisations comme références commerciales dans le respect de la confidentialité.</li>
              </ul>
            </Section>

            {/* CHAPITRE V */}
            <ChapterHeader id="s5" number="V" title="Données, hébergements et cybersécurité" />
            <Section id="art29" title="Art. 29 à 35 – Hébergement, RGPD et sécurité" icon={<Lock className="w-6 h-6" />}>
              <ul className="space-y-3 text-sm text-gray-700">
                <li><strong>Hébergement :</strong> Serveurs en Suisse ou en Europe, conformes ISO 27001, RGPD et revDSG. Le risque zéro n'existant pas, le Client dégage l'Agence de toute responsabilité en cas d'incident externe.</li>
                <li><strong>Noms de domaine :</strong> Propriété de l'Agence jusqu'à paiement intégral. Transfert complet : dès CHF 1'250.– · Location annuelle : CHF 350.–/an.</li>
                <li><strong>Sauvegarde :</strong> Durée du projet + 6 mois. Le Client doit assurer ses propres copies de sécurité.</li>
                <li><strong>Accès admin :</strong> Transfert complet uniquement après paiement intégral et clôture officielle du projet.</li>
                <li><strong>RGPD / revDSG :</strong> BYZCLUB agit comme sous-traitant et ne revend ni ne partage les données à des tiers non autorisés.</li>
                <li><strong>Violations de données :</strong> BYZCLUB informe le Client sans délai et coopère à la résolution conformément à l'art. 24 revDSG.</li>
              </ul>
            </Section>

            {/* CHAPITRE VI */}
            <ChapterHeader id="s6" number="VI" title="Collaboration et communication" />
            <Section id="art36" title="Art. 36 à 41 – Collaboration, rôles et confidentialité" icon={<Users className="w-6 h-6" />}>
              <ul className="space-y-3 text-sm text-gray-700">
                <li><strong>Devoir de collaboration :</strong> Le Client fournit toutes informations et accès nécessaires. Tout manquement peut entraîner un décalage du planning sans que cela soit reproché à BYZCLUB.</li>
                <li><strong>Interlocuteurs :</strong> BYZCLUB désigne un chef de projet référent. Le Client désigne un contact unique disposant de l'autorité pour valider.</li>
                <li><strong>Canaux officiels :</strong> E-mail ou plateformes professionnelles (Slack, Asana, Notion). Les messages WhatsApp/SMS ne constituent pas une preuve formelle de validation contractuelle.</li>
                <li><strong>Validation tacite :</strong> Absence de contestation dans les 48h suivant réception d'un compte-rendu vaut validation. Les validations par e-mail équivalent à une signature électronique (art. 13 CO).</li>
                <li><strong>Confidentialité :</strong> Obligation stricte pendant toute la durée du contrat et <strong>5 ans</strong> après sa fin.</li>
              </ul>
              <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr><th className="text-left p-3 font-bold text-gray-700">Domaine</th><th className="text-left p-3 font-bold text-gray-700">Responsabilité principale</th></tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {[["Stratégie & création","BYZCLUB"],["Validation du contenu final","Client"],["Hébergement & maintenance","Agence (selon contrat)"],["Campagnes publicitaires","Agence (gestion) + Client (budget)"],["Protection des données","Client (propriétaire)"],["Conformité légale","Client"]].map(([d,r]) => (
                      <tr key={d}><td className="p-3 text-gray-700">{d}</td><td className="p-3 font-medium text-gray-700">{r}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* CHAPITRE VII */}
            <ChapterHeader id="s7" number="VII" title="Partenaires, sous-traitants et fournisseurs" />
            <Section id="art42" title="Art. 42 à 45 – Sous-traitance et coordination">
              <ul className="space-y-3 text-sm text-gray-700">
                <li><strong>Partenaires externes :</strong> BYZCLUB peut faire appel à des freelances, studios, développeurs, photographes, etc. agissant sous sa supervision.</li>
                <li><strong>Responsabilité :</strong> BYZCLUB reste seule responsable vis-à-vis du Client de la bonne exécution des prestations sous-traitées.</li>
                <li><strong>Tiers :</strong> Toute commande passée directement par le Client à un prestataire externe relève de sa seule responsabilité.</li>
              </ul>
            </Section>

            {/* CHAPITRE VIII */}
            <ChapterHeader id="s8" number="VIII" title="Performance, indicateurs et garanties" />
            <Section id="art46" title="Art. 46 à 49 – Objectifs, KPI et période de rodage" icon={<AlertCircle className="w-6 h-6" />}>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-3">
                <p className="text-sm font-bold text-gray-800 mb-1">Obligation de moyens — pas de résultats garantis</p>
                <p className="text-sm text-gray-700">BYZCLUB met en œuvre tous les moyens nécessaires sans garantir un résultat chiffré (ventes, abonnés, ROAS, SEO, etc.).</p>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>KPI :</strong> Les indicateurs convenus ont une valeur indicative et non contractuelle.</li>
                <li><strong>Période de rodage :</strong> Tout lancement nécessite 30 à 60 jours d'optimisation. Aucun objectif quantitatif ne peut être exigé avant la fin de cette période.</li>
                <li><strong>Responsabilité limitée :</strong> au montant payé par le Client sur les 3 derniers mois précédant l'événement dommageable, sauf faute grave.</li>
              </ul>
            </Section>

            {/* CHAPITRE IX */}
            <ChapterHeader id="s9" number="IX" title="Conformité et déontologie" />
            <Section id="art50" title="Art. 50 à 53 – Éthique, lois et plateformes">
              <ul className="space-y-3 text-sm text-gray-700">
                <li><strong>Respect des lois :</strong> BYZCLUB exerce dans le respect du CO, de la LCD, de la LDA, de la revDSG/RGPD et des réglementations des plateformes numériques.</li>
                <li><strong>Contenus illicites :</strong> L'Agence peut refuser ou suspendre toute prestation si le contenu fourni viole les lois ou politiques des plateformes. Les sommes versées restent acquises.</li>
                <li><strong>Code éthique :</strong> BYZCLUB refuse tout faux avis, manipulation de résultats ou achat de followers.</li>
                <li><strong>Politiques plateformes :</strong> BYZCLUB n'a aucun contrôle sur les suspensions décidées par Meta, Google, TikTok, etc.</li>
              </ul>
            </Section>

            {/* CHAPITRE X */}
            <ChapterHeader id="s10" number="X" title="Éthique, image et réputation" />
            <Section id="art54" title="Art. 54 à 57 – Comportement, discrétion et non-dénigrement">
              <ul className="space-y-3 text-sm text-gray-700">
                <li><strong>Comportement :</strong> Propos insultants, attitudes agressives ou tentatives d'ingérence dans la gestion interne non tolérés. BYZCLUB peut résilier immédiatement et facturer les montants dus.</li>
                <li><strong>Communication publique :</strong> Aucune partie ne divulgue d'informations relatives au contrat ou aux désaccords sans autorisation écrite.</li>
                <li><strong>Protection de l'image :</strong> BYZCLUB refuse les projets liés à la pornographie, la promotion d'armes, de tabac, d'alcool, ou aux discours discriminatoires.</li>
                <li><strong>Non-dénigrement :</strong> Pendant le contrat et <strong>2 ans</strong> après, aucune partie ne diffuse de contenu visant à nuire à l'autre.</li>
              </ul>
            </Section>

            {/* CHAPITRE XI */}
            <ChapterHeader id="s11" number="XI" title="Données et sécurité numérique avancée" />
            <Section id="art58" title="Art. 58 à 61 – Hébergement, cyberattaques et obligations" icon={<Lock className="w-6 h-6" />}>
              <ul className="space-y-3 text-sm text-gray-700">
                <li><strong>Hébergement sécurisé :</strong> Conformité ISO 27001. Mise en œuvre de SSL, HTTPS, 2FA et surveillance proactive.</li>
                <li><strong>Limites de responsabilité :</strong> En cas de cyberattaque, responsabilité limitée au coût de restauration des données disponibles dans les dernières sauvegardes. Pas de dédommagement pour pertes indirectes.</li>
                <li><strong>Obligations du Client :</strong> Prévenir immédiatement BYZCLUB en cas d'incident, ne pas communiquer publiquement sans concertation, collaborer à la résolution.</li>
              </ul>
            </Section>

            {/* CHAPITRE XII */}
            <ChapterHeader id="s12" number="XII" title="Cessions, transferts et continuité" />
            <Section id="art62" title="Art. 62 à 65 – Cessions et continuité de service">
              <ul className="space-y-3 text-sm text-gray-700">
                <li><strong>Cession :</strong> Aucune cession sans accord écrit préalable. BYZCLUB peut transférer ses obligations à toute société affiliée du groupe HUSTLE GROUP SARL.</li>
                <li><strong>Continuité :</strong> En cas de restructuration ou fusion, les contrats en cours continuent sans interruption. Le Client sera informé par écrit de tout changement de structure.</li>
                <li><strong>Marque :</strong> La marque "BYZCLUB" et ses déclinaisons appartiennent à l'Agence et seront transférées au groupe HUSTLE GROUP SARL à la finalisation de son enregistrement.</li>
              </ul>
            </Section>

            {/* CHAPITRE XIII */}
            <ChapterHeader id="s13" number="XIII" title="Résiliation et suspension" />
            <Section id="art66" title="Art. 66 à 70 – Résiliation, suspension et pénalités">
              <ul className="space-y-3 text-sm text-gray-700">
                <li><strong>Préavis :</strong> Social Media : 90 jours · Sites Web/Hébergement : 180 jours · Contrats ponctuels : 30 jours. Toute résiliation doit être formulée par écrit.</li>
                <li><strong>Résiliation pour manquement :</strong> Mise en demeure avec délai de 10 jours. En cas de non-régularisation, résiliation immédiate. Les prestations déjà exécutées restent dues intégralement.</li>
                <li><strong>Suspension :</strong> En cas de non-paiement au-delà de 30 jours, BYZCLUB peut suspendre accès, campagnes et maintenance sans préavis. La suspension n'est pas une résiliation.</li>
                <li><strong>Résiliation anticipée :</strong> Paiement des mois restants + pénalité forfaitaire de <strong>15 %</strong> (art. 160 CO). Solde exigible dans les 10 jours.</li>
              </ul>
            </Section>

            {/* CHAPITRE XIV */}
            <ChapterHeader id="s14" number="XIV" title="Litiges, médiation et droit applicable" />
            <Section id="art71" title="Art. 71 à 75 – Médiation, for juridique et droit suisse" icon={<Scale className="w-6 h-6" />}>
              <ul className="space-y-3 text-sm text-gray-700">
                <li><strong>Médiation préalable :</strong> Les parties cherchent une solution amiable avant toute procédure judiciaire. Si aucun accord dans les 30 jours, la partie la plus diligente peut saisir les tribunaux.</li>
                <li><strong>Protection juridique :</strong> BYZCLUB est couverte par une assurance AXA Protection Juridique Entreprises (assistance avocat, prise en charge des frais de défense).</li>
                <li><strong>For juridique exclusif :</strong> Tribunaux du <strong>canton de Neuchâtel</strong>.</li>
                <li><strong>Droit applicable :</strong> Code des Obligations suisse (CO), LDA, revDSG, RGPD (si applicable).</li>
                <li><strong>Divisibilité :</strong> Si une clause est jugée invalide, les autres restent pleinement applicables.</li>
              </ul>
            </Section>

            {/* CHAPITRE XV */}
            <ChapterHeader id="s15" number="XV" title="Clauses finales" />
            <Section id="art76" title="Art. 76 à 80 – Communications, force majeure et entrée en vigueur">
              <ul className="space-y-3 text-sm text-gray-700">
                <li><strong>Valeur probante :</strong> Les échanges électroniques (e-mails, signatures numériques, validations en ligne) ont la même valeur juridique que les communications écrites traditionnelles.</li>
                <li><strong>Archivage :</strong> Documents contractuels conservés pendant <strong>5 ans</strong> à compter de la fin du mandat.</li>
                <li><strong>Force majeure :</strong> Aucune responsabilité en cas de catastrophe naturelle, pandémie, panne réseau, incendie, grève, ou suspension des plateformes (Meta, Google, TikTok, etc.). Si la durée dépasse 60 jours, chaque partie peut résilier sans indemnité.</li>
                <li><strong>Entrée en vigueur :</strong> 22 octobre 2025. Remplace toute version précédente.</li>
                <li><strong>Version faisant foi :</strong> La version française prévaut en cas de contradiction avec une traduction.</li>
              </ul>
            </Section>

            {/* ANNEXE A */}
            <ChapterHeader id="s16" number="A" title="Annexe A — Plans et formules de service" annexe />
            <Section id="annexeA" title="Détail des quatre packs BYZCLUB" icon={<FileText className="w-6 h-6" />}>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { name: "Pack 1 — Local Visibility", freq: "Trimestriel", color: "from-blue-500 to-indigo-600", items: ["Gestion de 2 plateformes sociales","6 à 8 publications/mois","1 shooting par trimestre (1h)","Stratégie de contenu initiale","Reporting trimestriel","Durée min. 3 mois, reconduction 12 mois"] },
                  { name: "Pack 2 — Business Growth", freq: "Mensuel", color: "from-orange-500 to-red-500", items: ["Gestion de 3 plateformes sociales","8 à 12 publications/mois","1 shooting/mois","Création graphique + vidéo légère","Reporting mensuel détaillé","Réunion de suivi mensuelle"] },
                  { name: "Pack 3 — Content Authority", freq: "Hebdomadaire", color: "from-purple-500 to-pink-600", items: ["Gestion 360° du contenu","Campagnes publicitaires continues","Shooting toutes les 2 semaines","Stratégie + Ads Manager + Budget","Reporting hebdomadaire","Réunion hebdo de performance"] },
                  { name: "Pack 4 — Enterprise", freq: "Sur mesure", color: "from-gray-700 to-gray-900", items: ["Audit complet et stratégie globale","Contrat SLA spécifique","Dashboard live, IA, API","Suivi quotidien / interlocuteur dédié","Facturation selon devis et calendrier"] },
                ].map(pack => (
                  <div key={pack.name} className="border-2 border-gray-100 rounded-2xl overflow-hidden">
                    <div className={`bg-gradient-to-r ${pack.color} text-white p-4`}>
                      <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-0.5">{pack.freq}</p>
                      <h4 className="text-base font-black">{pack.name}</h4>
                    </div>
                    <ul className="p-4 space-y-2">
                      {pack.items.map(item => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-orange-500 shrink-0 mt-0.5">✓</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>

            {/* ANNEXE B */}
            <ChapterHeader id="s17" number="B" title="Annexe B — Conformité publicitaire" annexe />
            <Section id="annexeB" title="Conformité Meta Ads / Google Ads / TikTok Ads / LCD suisse">
              <p className="text-gray-700 leading-relaxed mb-3">Les campagnes publicitaires réalisées par BYZCLUB respectent : les politiques publicitaires de Meta, Google, TikTok, LinkedIn, etc. ; la Loi fédérale contre la concurrence déloyale (LCD) ; et les règles de transparence imposées par le droit suisse et européen.</p>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <p className="text-sm text-gray-700">Toute annonce refusée ou suspendue pour cause de non-conformité du contenu fourni par le Client ne saurait engager la responsabilité de l'Agence. Les frais d'Ads restent dus.</p>
              </div>
            </Section>

            {/* ANNEXE C */}
            <ChapterHeader id="s18" number="C" title="Annexe C — Tarifs de référence" annexe />
            <Section id="annexeC" title="Tarifs indicatifs (non contractuels, HT)">
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr><th className="text-left p-3 font-bold text-gray-700">Type de service</th><th className="text-left p-3 font-bold text-gray-700">Base tarifaire HT</th></tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ["Gestion Social Media (mensuel)","dès CHF 900.–"],
                      ["Shooting photo/vidéo (1h)","CHF 350.– à 600.–"],
                      ["Création de logo / identité","CHF 400.– à 2'500.–"],
                      ["Site vitrine","dès CHF 800.–"],
                      ["E-commerce complet","dès CHF 1'400.–"],
                      ["Maintenance & hébergement","dès CHF 150.–/mois"],
                      ["Licence d'exploitation (+12 mois)","+20 % du montant initial"],
                      ["Transfert de domaine","dès CHF 1'250.–"],
                      ["Location annuelle de domaine","CHF 350.–/an"],
                    ].map(([s, t]) => (
                      <tr key={s}><td className="p-3 text-gray-700">{s}</td><td className="p-3 font-semibold text-orange-700">{t}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-3 italic">Ces tarifs sont fournis à titre indicatif. Le tarif applicable est celui mentionné dans le devis signé.</p>
            </Section>

            {/* Signature */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
              <p className="text-sm font-bold text-gray-700 mb-2">Les présentes CGV sont disponibles en permanence sur</p>
              <a href="https://byzclub.ch" className="text-orange-600 font-bold hover:underline text-lg">www.byzclub.ch</a>
              <p className="text-xs text-gray-500 mt-3">Le Client reconnaît avoir lu, compris et accepté les présentes Conditions Générales de Vente dans leur intégralité.</p>
            </div>

          </div>
        </motion.div>

        <motion.div className="mt-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <p className="text-gray-600 mb-4">Des questions sur nos conditions générales ?</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105">
            Contactez-nous
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function ChapterHeader({ id, number, title, annexe }: { id: string; number: string; title: string; annexe?: boolean }) {
  return (
    <div id={id} className="scroll-mt-24 flex items-center gap-4 py-3 border-y border-orange-100">
      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white ${annexe ? 'bg-gray-700' : 'bg-gradient-to-br from-orange-500 to-red-500'}`}>
        {annexe ? number : `${number}`}
      </div>
      <h2 className="text-lg sm:text-xl font-black text-gray-900 uppercase tracking-wide">{title}</h2>
    </div>
  );
}

function Section({
  id,
  title,
  icon,
  children
}: {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      className="scroll-mt-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start gap-3 mb-4">
        {icon && <div className="text-orange-500 mt-0.5 shrink-0">{icon}</div>}
        <h3 className="text-base sm:text-lg font-bold text-gray-800">{title}</h3>
      </div>
      <div className="ml-0 sm:ml-9">
        {children}
      </div>
    </motion.section>
  );
}

function Term({ term, definition }: { term: string; definition: string }) {
  return (
    <div className="border-l-2 border-orange-200 pl-4 py-1">
      <dt className="font-bold text-gray-900 text-sm mb-0.5">{term}</dt>
      <dd className="text-gray-600 text-sm">{definition}</dd>
    </div>
  );
}
