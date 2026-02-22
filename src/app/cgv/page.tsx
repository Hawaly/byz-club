'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, FileText, Scale, Shield, Clock, AlertCircle } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <motion.div 
        className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16 sm:py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Retour à l'accueil
          </Link>
          <motion.div {...fadeInUp}>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-10 h-10" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                Conditions Générales de Vente
              </h1>
            </div>
            <p className="text-lg text-white/90 max-w-2xl">
              Conditions applicables aux prestations fournies par Your Story
            </p>
            <p className="text-sm text-white/80 mt-4">
              Dernière mise à jour : Janvier 2026
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Table of Contents */}
          <div className="bg-gradient-to-r from-orange-50 to-white p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              Sommaire
            </h2>
            <nav className="grid sm:grid-cols-2 gap-2 text-sm">
              {[
                "1. Identité du prestataire",
                "2. Définitions",
                "3. Champ d'application",
                "4. Formation du contrat",
                "5. Prestations proposées",
                "6. Durée — Abonnements",
                "7. Brief et collaboration",
                "8. Organisation des tournages",
                "9. Révisions et validations",
                "10. Publication et plateformes",
                "11. Prix et paiement",
                "12. Budgets publicitaires",
                "13. Sous-traitance",
                "14. Propriété intellectuelle",
                "15. Confidentialité",
                "16. Protection des données",
                "17. Responsabilité",
                "18. Force majeure",
                "19. Résiliation",
                "20. Réclamations",
                "21. Droit applicable",
                "22. Dispositions finales"
              ].map((item) => (
                <a
                  key={item}
                  href={`#section-${item.split('.')[0].trim()}`}
                  className="text-gray-600 hover:text-orange-600 hover:underline transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-8 lg:p-10 space-y-10">
            {/* Section 1 */}
            <Section id="1" title="1. Identité du prestataire" icon={<Shield className="w-6 h-6" />}>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les présentes CGV régissent les prestations fournies par <strong>Your Story</strong> (ci-après « l'Agence »).
              </p>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <h4 className="font-bold text-gray-900 mb-3">Coordonnées légales :</h4>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Raison sociale :</strong> Mohamad Hawaley</li>
                  <li><strong>Forme juridique :</strong> Statut indépendant</li>
                  <li><strong>E-mail :</strong> contact@urstory.ch</li>
                  <li><strong>Site :</strong> <a href="https://urstory.ch" className="text-orange-600 hover:underline">https://urstory.ch</a></li>
                </ul>
              </div>
            </Section>

            {/* Section 2 */}
            <Section id="2" title="2. Définitions" icon={<FileText className="w-6 h-6" />}>
              <dl className="space-y-3">
                <Term term="Client" definition="Toute personne (professionnelle ou particulière) commandant une prestation à l'Agence." />
                <Term term="Offre / Devis" definition="Document décrivant la prestation, le prix, le planning, les livrables et conditions particulières." />
                <Term term="Packs" definition="Abonnements mensuels décrits sur le site et/ou dans l'Offre." />
                <Term term="Livrables" definition="Contenus produits (vidéos, carrousels, scripts, calendrier éditorial, reporting, etc.)." />
                <Term term="Plateformes" definition="Réseaux sociaux et services tiers (Meta, Instagram, TikTok, YouTube, Google, etc.)." />
              </dl>
            </Section>

            {/* Section 3 */}
            <Section id="3" title="3. Champ d'application et hiérarchie des documents">
              <p className="text-gray-700 leading-relaxed mb-4">
                Les présentes CGV s'appliquent à toute commande de prestations de l'Agence, sauf accord écrit contraire.
              </p>
              <p className="text-gray-700 leading-relaxed">
                En cas de contradiction, l'ordre de priorité est :
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 mt-3 ml-4">
                <li>Contrat signé / conditions particulières</li>
                <li>Devis/Offre</li>
                <li>CGV</li>
                <li>Documents commerciaux du site</li>
              </ol>
            </Section>

            {/* Section 4 */}
            <Section id="4" title="4. Formation du contrat / commande">
              <p className="text-gray-700 leading-relaxed mb-4">
                Le contrat est réputé conclu dès le premier des événements suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Signature (manuscrite ou électronique) du devis/Offre ; ou</li>
                <li>Validation écrite (e-mail, message, plateforme) indiquant l'accord ; ou</li>
                <li>Paiement (total ou partiel) de la prestation, du premier mois ou de l'acompte.</li>
              </ul>
            </Section>

            {/* Section 5 */}
            <Section id="5" title="5. Prestations proposées">
              <p className="text-gray-700 leading-relaxed mb-4">
                L'Agence propose notamment : stratégie de contenu, pré-production, tournage, montage, sous-titres, scripts, publication, optimisation, reporting, conseil.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Les prestations exactes, limites, volumes (nombre de contenus), formats et délais sont ceux indiqués dans l'Offre et/ou le Pack choisi.
              </p>
            </Section>

            {/* Section 6 */}
            <Section id="6" title="6. Durée — Abonnements (Packs)" icon={<Clock className="w-6 h-6" />}>
              <p className="text-gray-700 leading-relaxed mb-4">
                Sauf mention contraire, les Packs sont conclus pour une durée minimale d'un (1) mois, renouvelables tacitement de mois en mois.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Toute fonctionnalité ou livrable non inclus dans le Pack peut faire l'objet d'un devis complémentaire.
              </p>
            </Section>

            {/* Section 7 */}
            <Section id="7" title="7. Brief, accès et collaboration du Client">
              <p className="text-gray-700 leading-relaxed mb-4">
                Le Client s'engage à :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                <li>Fournir un brief clair et toutes informations utiles (charte, messages clés, offres, contraintes, exemples)</li>
                <li>Fournir les accès nécessaires (comptes réseaux sociaux, Business Manager, droits d'admin, drive, etc.)</li>
                <li>Obtenir les autorisations nécessaires (droit à l'image, droits musicaux, lieux de tournage, etc.)</li>
                <li>Répondre dans des délais raisonnables aux demandes de validation</li>
              </ul>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <p className="text-sm text-gray-700">
                  <strong>Conséquence des retards Client :</strong> Tout retard de réponse, de validation, de fourniture de contenus ou d'accès peut entraîner un décalage du planning, sans engager la responsabilité de l'Agence.
                </p>
              </div>
            </Section>

            {/* Section 8 */}
            <Section id="8" title="8. Organisation des tournages / logistique">
              <p className="text-gray-700 leading-relaxed mb-4">
                Les dates de tournage sont planifiées d'un commun accord.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Le Client garantit la disponibilité des personnes filmées et des lieux, et s'assure de disposer des autorisations nécessaires.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Les frais spécifiques (déplacements hors zone convenue, location studio, comédiens, accessoires, etc.) sont facturés en sus si non inclus dans le Pack/Offre.
              </p>
            </Section>

            {/* Section 9 */}
            <Section id="9" title="9. Révisions, modifications et validations">
              <p className="text-gray-700 leading-relaxed mb-4">
                Le nombre de cycles de révisions inclus est celui prévu dans le Pack/Offre.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Une « révision » correspond à des ajustements raisonnables sur un livrable (ex : texte, timing léger, sous-titres, recadrage simple).
              </p>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Sont hors révisions (donc facturables) :</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                  <li>Changement de direction créative après validation</li>
                  <li>Réécriture complète</li>
                  <li>Remontage total</li>
                  <li>Tournage additionnel</li>
                  <li>Ajout de scènes non prévues</li>
                  <li>Demandes urgentes hors planning</li>
                  <li>Déclinaisons supplémentaires non prévues</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                <strong>Validation :</strong> Sauf mention contraire, le Client valide par écrit (message/e-mail). À défaut de retour dans le délai convenu (ou à défaut : 5 jours ouvrables), le livrable peut être considéré comme validé afin de respecter le planning (validation tacite), sauf si le Client a signalé un blocage légitime.
              </p>
            </Section>

            {/* Section 10 */}
            <Section id="10" title="10. Publication, modération et règles des plateformes">
              <p className="text-gray-700 leading-relaxed mb-4">
                L'Agence peut publier sur les comptes du Client si les accès sont fournis.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les plateformes appliquent leurs propres règles (publicité, musique, contenus). L'Agence ne garantit pas l'absence de retrait, restriction, limitation de portée, suspension ou bannissement d'un compte.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Le Client reste responsable de ses produits/services, de ses mentions légales, de ses offres et de la conformité de ses contenus au droit applicable et aux règles des plateformes.
              </p>
            </Section>

            {/* Section 11 */}
            <Section id="11" title="11. Prix, TVA et paiement">
              <p className="text-gray-700 leading-relaxed mb-4">
                Les prix sont indiqués en <strong>CHF</strong>. La TVA est ajoutée si l'Agence y est assujettie (mention explicite sur l'Offre/facture).
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Sauf accord contraire, les Packs sont facturés mensuellement et d'avance.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                En cas de retard de paiement, l'Agence peut :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Suspendre les prestations et livraisons</li>
                <li>Refuser toute nouvelle demande tant que la situation n'est pas régularisée</li>
                <li>Facturer des frais de rappel et intérêts de retard dans la mesure permise par le droit applicable</li>
              </ul>
            </Section>

            {/* Section 12 */}
            <Section id="12" title="12. Budgets publicitaires et achats médias">
              <p className="text-gray-700 leading-relaxed mb-4">
                Les budgets publicitaires (Meta Ads, Google Ads, TikTok Ads, etc.) ne sont pas inclus sauf mention contraire.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Sauf accord écrit, le budget est payé directement par le Client à la plateforme.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Si l'Agence avance des frais (exceptionnel), le Client rembourse immédiatement sur facture.
              </p>
            </Section>

            {/* Section 13 */}
            <Section id="13" title="13. Sous-traitance et outils tiers">
              <p className="text-gray-700 leading-relaxed">
                L'Agence peut recourir à des sous-traitants (ex : cadreur, monteur, voice-over, graphiste) et à des outils tiers (hébergement, plugins, IA, banques d'images/musiques), tout en restant l'interlocuteur principal du Client. Les conditions et limitations des outils tiers s'appliquent.
              </p>
            </Section>

            {/* Section 14 */}
            <Section id="14" title="14. Propriété intellectuelle et droits d'utilisation">
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Avant paiement complet</strong>, tous les Livrables et fichiers restent la propriété de l'Agence.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Après paiement complet</strong>, l'Agence concède au Client une licence (ou cession, selon mention dans l'Offre) d'utilisation des Livrables pour un usage commercial, sur les supports et territoires prévus dans l'Offre.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Restent la propriété de l'Agence : méthodes, gabarits, modèles, presets, éléments techniques réutilisables, savoir-faire, et tout élément préexistant.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Fichiers sources</strong> (Premiere/After Effects/PSD/AI, etc.) : fournis uniquement si expressément inclus dans l'Offre, sinon facturables.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Droit de portfolio :</strong> Sauf refus écrit du Client, l'Agence peut présenter des extraits/visuels des Livrables à des fins de promotion (site, réseaux, showreel, étude de cas), en respectant la confidentialité convenue.
              </p>
            </Section>

            {/* Section 15 */}
            <Section id="15" title="15. Confidentialité">
              <p className="text-gray-700 leading-relaxed">
                Chaque partie s'engage à garder confidentielles les informations commerciales, techniques et financières reçues de l'autre partie, sauf obligation légale ou accord écrit.
              </p>
            </Section>

            {/* Section 16 */}
            <Section id="16" title="16. Protection des données">
              <p className="text-gray-700 leading-relaxed mb-4">
                Chaque partie s'engage à respecter la législation applicable en matière de protection des données (notamment la LPD révisée).
              </p>
              <p className="text-gray-700 leading-relaxed">
                Si, dans le cadre des prestations, l'Agence traite des données personnelles pour le compte du Client (ex : gestion d'une communauté, accès CRM, listes clients), les parties peuvent conclure une annexe de traitement (DPA) précisant : finalités, mesures de sécurité, sous-traitants, durée, assistance et restitution/suppression.
              </p>
            </Section>

            {/* Section 17 */}
            <Section id="17" title="17. Responsabilité — Obligation de moyens" icon={<AlertCircle className="w-6 h-6" />}>
              <p className="text-gray-700 leading-relaxed mb-4">
                L'Agence est tenue à une <strong>obligation de moyens</strong> : elle met en œuvre les ressources et compétences raisonnables, sans garantir un résultat chiffré (ventes, abonnés, portée, ROAS, etc.).
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                L'Agence n'est pas responsable notamment :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                <li>Des décisions, algorithmes, pannes, restrictions ou sanctions des plateformes</li>
                <li>Des performances dépendant du budget, de l'offre du Client, de la concurrence, du marché, du tracking ou du site du Client</li>
                <li>Des dommages indirects (perte de chiffre d'affaires, perte de données, manque à gagner), dans la mesure permise par le droit applicable</li>
              </ul>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="text-sm text-gray-700">
                  En toute hypothèse, la responsabilité de l'Agence est limitée (dans la mesure permise) au montant effectivement payé par le Client au titre des prestations concernées sur les trois (3) derniers mois précédant l'événement dommageable, sauf faute grave ou disposition impérative contraire.
                </p>
              </div>
            </Section>

            {/* Section 18 */}
            <Section id="18" title="18. Force majeure">
              <p className="text-gray-700 leading-relaxed">
                Aucune partie ne sera responsable d'un retard ou manquement dû à un événement échappant à son contrôle raisonnable (panne majeure, catastrophe, grève, maladie, décision administrative, interruption plateformes, etc.). Les obligations sont suspendues pendant la durée de l'événement.
              </p>
            </Section>

            {/* Section 19 */}
            <Section id="19" title="19. Résiliation">
              <p className="text-gray-700 leading-relaxed mb-4">
                Sauf conditions particulières différentes, chaque partie peut résilier un Pack avec préavis de <strong>7 jours avant la fin du mois en cours</strong> (notification écrite).
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Tout mois entamé est dû, sauf accord écrit.
              </p>
              <p className="text-gray-700 leading-relaxed">
                En cas de non-paiement, manquement grave, ou impossibilité de collaborer, l'Agence peut résilier avec effet immédiat après mise en demeure restée sans effet dans un délai raisonnable.
              </p>
            </Section>

            {/* Section 20 */}
            <Section id="20" title="20. Réclamations">
              <p className="text-gray-700 leading-relaxed">
                Toute réclamation doit être notifiée par écrit dans un délai de <strong>10 jours après livraison</strong> du Livrable concerné, en décrivant précisément le problème. À défaut, la prestation est réputée acceptée.
              </p>
            </Section>

            {/* Section 21 */}
            <Section id="21" title="21. Droit applicable et for" icon={<Scale className="w-6 h-6" />}>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les CGV sont soumises au <strong>droit suisse</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Le for est au siège de l'Agence, sous réserve des règles impératives applicables aux consommateurs.
              </p>
            </Section>

            {/* Section 22 */}
            <Section id="22" title="22. Dispositions finales">
              <p className="text-gray-700 leading-relaxed mb-4">
                Si une clause est jugée nulle, les autres restent valables.
              </p>
              <p className="text-gray-700 leading-relaxed">
                L'Agence peut mettre à jour les CGV ; la version applicable est celle acceptée lors de la commande (ou communiquée au renouvellement si modification substantielle).
              </p>
            </Section>

            {/* Annexe - Packs */}
            <Section id="annexe" title="ANNEXE — Packs mensuels" icon={<FileText className="w-6 h-6" />}>
              <p className="text-gray-700 leading-relaxed mb-6">
                Les packs peuvent être décrits dans l'Offre/Devis. Exemple (selon votre offre commerciale) :
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <PackCard 
                  name="Local Visibility"
                  price="900"
                  color="from-blue-500 to-indigo-600"
                />
                <PackCard 
                  name="Business Growth"
                  price="1'500"
                  color="from-orange-500 to-red-500"
                />
                <PackCard 
                  name="Content Authority"
                  price="2'000"
                  color="from-purple-500 to-pink-600"
                />
              </div>
            </Section>
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-gray-600 mb-4">
            Des questions sur nos conditions générales ?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            Contactez-nous
          </Link>
        </motion.div>
      </div>
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
      id={`section-${id}`}
      className="scroll-mt-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start gap-3 mb-4">
        {icon && <div className="text-orange-500 mt-1">{icon}</div>}
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h3>
      </div>
      <div className="ml-0 sm:ml-9">
        {children}
      </div>
    </motion.section>
  );
}

function Term({ term, definition }: { term: string; definition: string }) {
  return (
    <div className="border-l-2 border-orange-200 pl-4">
      <dt className="font-bold text-gray-900 mb-1">{term}</dt>
      <dd className="text-gray-700">{definition}</dd>
    </div>
  );
}

function PackCard({ name, price, color }: { name: string; price: string; color: string }) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-orange-300 hover:shadow-lg transition-all">
      <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${color} text-white text-xs font-bold mb-3`}>
        Pack
      </div>
      <h4 className="text-lg font-bold text-gray-900 mb-2">{name}</h4>
      <p className="text-3xl font-bold text-gray-900">
        {price} <span className="text-base font-normal text-gray-600">CHF/mois</span>
      </p>
    </div>
  );
}
