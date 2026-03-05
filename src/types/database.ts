// Types de la base de données Supabase

export type ClientType = 'oneshot' | 'mensuel';
export type ClientStatus = 'actif' | 'pause' | 'termine' | 'potentiel';
export type MandatStatus = 'en_cours' | 'termine' | 'annule';
export type InvoiceStatus = 'brouillon' | 'envoyee' | 'payee' | 'annulee';
export type InvoiceRecurrence = 'oneshot' | 'mensuel' | 'trimestriel' | 'annuel';
export type ExpenseType = 'client_mandat' | 'BYZCLUB';
export type RecurrenceType = 'oneshot' | 'mensuel';
export type TaskStatus = 'a_faire' | 'en_cours' | 'terminee';
export type TaskType = 'contenu' | 'video' | 'reunion' | 'reporting' | 'autre';

// Interface Client
export interface Client {
  id: number;
  name: string;
  type: ClientType;
  status: ClientStatus;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  address: string | null;
  zip_code: string | null;
  locality: string | null;
  represented_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Interface CompanySettings
export interface CompanySettings {
  id: number;
  agency_name: string;
  address: string | null;
  zip_code: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  tva_number: string | null;
  represented_by: string | null;
  iban: string | null;
  qr_iban: string | null;
}

// Type pour créer un client (sans id, created_at, updated_at)
export type ClientInsert = Omit<Client, 'id' | 'created_at' | 'updated_at'>;

// Type pour mettre à jour un client (tous les champs optionnels sauf id)
export type ClientUpdate = Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>;

// Interface Mandat
export interface Mandat {
  id: number;
  client_id: number;
  title: string;
  description: string | null;
  mandat_type: string | null;
  status: MandatStatus;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

// Type pour créer un mandat
export type MandatInsert = Omit<Mandat, 'id' | 'created_at' | 'updated_at'>;

// Type pour mettre à jour un mandat
export type MandatUpdate = Partial<Omit<Mandat, 'id' | 'created_at' | 'updated_at'>>;

// Interface MandatTask
export interface MandatTask {
  id: number;
  mandat_id: number;
  title: string;
  details: string | null;
  type: TaskType;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

// Type pour créer une tâche
export type MandatTaskInsert = Omit<MandatTask, 'id' | 'created_at' | 'updated_at'>;

// Type pour mettre à jour une tâche
export type MandatTaskUpdate = Partial<Omit<MandatTask, 'id' | 'created_at' | 'updated_at'>>;

// Labels pour les statuts de mandat
export const MANDAT_STATUS_LABELS: Record<MandatStatus, string> = {
  en_cours: 'En cours',
  termine: 'Terminé',
  annule: 'Annulé',
};

// Couleurs pour les statuts de mandat
export const MANDAT_STATUS_COLORS: Record<MandatStatus, string> = {
  en_cours: 'bg-white text-black font-black border-[3px] border-blue-600 shadow-sm',
  termine: 'bg-white text-black font-black border-[3px] border-green-600 shadow-sm',
  annule: 'bg-white text-black font-black border-[3px] border-red-600 shadow-sm',
};

// Labels pour les types de tâche
export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  contenu: 'Contenu',
  video: 'Vidéo',
  reunion: 'Réunion',
  reporting: 'Reporting',
  autre: 'Autre',
};

// Labels pour les statuts de tâche
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  a_faire: 'À faire',
  en_cours: 'En cours',
  terminee: 'Terminée',
};

// Couleurs pour les statuts de tâche
export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  a_faire: 'bg-white text-black font-black border-[3px] border-gray-600 shadow-sm',
  en_cours: 'bg-white text-black font-black border-[3px] border-blue-600 shadow-sm',
  terminee: 'bg-white text-black font-black border-[3px] border-green-600 shadow-sm',
};

// Interface Invoice
export interface Invoice {
  id: number;
  client_id: number;
  mandat_id: number | null;
  invoice_number: string;
  issue_date: string;
  due_date: string | null;
  payment_date: string | null; // Date de paiement effectif (pour CA réel)
  total_ht: number;
  total_tva: number;
  total_ttc: number;
  status: InvoiceStatus;
  pdf_path: string | null;
  qr_bill_path: string | null;
  qr_additional_info: string | null;
  
  // Champs pour les factures récurrentes (DEPRECATED - utiliser ClientContract à la place)
  is_recurring: InvoiceRecurrence;
  recurrence_day: number | null; // Jour du mois (1-31) pour la génération automatique
  parent_invoice_id: number | null; // Référence à la facture parente si générée automatiquement
  next_generation_date: string | null; // Prochaine date de génération
  auto_send: boolean; // Envoi automatique lors de la génération
  
  // Gestion de la durée limitée (DEPRECATED)
  max_occurrences: number | null; // Nombre maximum de factures à générer (null = illimité)
  occurrences_count: number; // Nombre de factures déjà générées
  end_date: string | null; // Date de fin de la récurrence (optionnel)
  
  // Nouveaux champs: Lien vers le système de contrats
  source_contract_id: number | null; // Référence au contrat source
  source_schedule_id: number | null; // Référence à l'échéance source
  
  created_at: string;
  updated_at: string;
}

// Type pour créer une facture
export type InvoiceInsert = Omit<Invoice, 'id' | 'created_at' | 'updated_at'>;

// Type pour mettre à jour une facture
export type InvoiceUpdate = Partial<Omit<Invoice, 'id' | 'created_at' | 'updated_at'>>;

// Interface InvoiceItem
export interface InvoiceItem {
  id: number;
  invoice_id: number;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

// Type pour créer un item de facture
export type InvoiceItemInsert = Omit<InvoiceItem, 'id'>;

// Labels pour les statuts de facture
export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  brouillon: 'Brouillon',
  envoyee: 'Envoyée',
  payee: 'Payée',
  annulee: 'Annulée',
};

// Couleurs pour les statuts de facture
export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  brouillon: 'bg-white text-black font-black border-[3px] border-gray-600 shadow-sm',
  envoyee: 'bg-white text-black font-black border-[3px] border-orange-600 shadow-sm',
  payee: 'bg-white text-black font-black border-[3px] border-green-600 shadow-sm',
  annulee: 'bg-white text-black font-black border-[3px] border-red-600 shadow-sm',
};

// Interface Contrat
export interface Contrat {
  id: number;
  client_id: number;
  mandat_id: number | null;
  contrat_number: string;
  file_path: string;
  signed_date: string | null;
  created_at: string;
}

// Type pour créer un contrat
export type ContratInsert = Omit<Contrat, 'id' | 'created_at'>;

// Interface ExpenseCategory
export interface ExpenseCategory {
  id: number;
  name: string;
  is_recurring: boolean;
}

// Interface Expense
export interface Expense {
  id: number;
  type: ExpenseType;
  mandat_id: number | null;
  client_id: number | null;
  category_id: number | null;
  label: string;
  amount: number;
  date: string;
  is_recurring: RecurrenceType;
  notes: string | null;
  receipt_path: string | null;
  created_at: string;
}

// Type pour créer une dépense
export type ExpenseInsert = Omit<Expense, 'id' | 'created_at'>;

// Type pour mettre à jour une dépense
export type ExpenseUpdate = Partial<Omit<Expense, 'id' | 'created_at'>>;

// Labels pour les types de dépense
export const EXPENSE_TYPE_LABELS: Record<ExpenseType, string> = {
  client_mandat: 'Client/Mandat',
  BYZCLUB: 'BYZCLUB',
};

// Couleurs pour les types de dépense
export const EXPENSE_TYPE_COLORS: Record<ExpenseType, string> = {
  client_mandat: 'bg-white text-black font-black border-[3px] border-purple-600 shadow-sm',
  BYZCLUB: 'bg-white text-black font-black border-[3px] border-blue-600 shadow-sm',
};

// Labels pour la récurrence
export const RECURRENCE_LABELS: Record<RecurrenceType, string> = {
  oneshot: 'Ponctuelle',
  mensuel: 'Mensuelle',
};

// Labels pour la récurrence des factures
export const INVOICE_RECURRENCE_LABELS: Record<InvoiceRecurrence, string> = {
  oneshot: 'Unique',
  mensuel: 'Mensuelle',
  trimestriel: 'Trimestrielle',
  annuel: 'Annuelle',
};

// Labels pour les enums
export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  oneshot: 'One-shot',
  mensuel: 'Mensuel',
};

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  actif: 'Actif',
  pause: 'Pause',
  termine: 'Terminé',
  potentiel: 'Potentiel',
};

// Couleurs pour les status (texte NOIR sur fond BLANC)
export const CLIENT_STATUS_COLORS: Record<ClientStatus, string> = {
  actif: 'bg-white text-black font-black border-[3px] border-green-600 shadow-sm',
  pause: 'bg-white text-black font-black border-[3px] border-orange-500 shadow-sm',
  termine: 'bg-white text-black font-black border-[3px] border-gray-600 shadow-sm',
  potentiel: 'bg-white text-black font-black border-[3px] border-blue-600 shadow-sm',
};

export const CLIENT_TYPE_COLORS: Record<ClientType, string> = {
  oneshot: 'bg-white text-black font-black border-[3px] border-purple-600 shadow-sm',
  mensuel: 'bg-white text-black font-black border-[3px] border-indigo-600 shadow-sm',
};

// =========================================================
// SOCIAL MEDIA STRATEGY
// =========================================================

export type StrategyStatus = 'brouillon' | 'actif' | 'valide' | 'archive';

// Persona pour l'audience
export interface Persona {
  id: number;
  strategy_id: number;
  nom: string;
  age_range: string | null;
  profession: string | null;
  besoins: string | null;
  problemes: string | null;
  attentes: string | null;
  comportements: string | null;
  canaux_preferes: string[] | null;
  created_at: string;
  updated_at: string;
}

export type PersonaInsert = Omit<Persona, 'id' | 'created_at' | 'updated_at'>;
export type PersonaUpdate = Partial<Omit<Persona, 'id' | 'strategy_id' | 'created_at' | 'updated_at'>>;

// Pilier de contenu
export interface PilierContenu {
  id: number;
  strategy_id: number;
  titre: string;
  description: string | null;
  exemples: string | null;
  pourcentage_cible: number | null; // 0-100
  ordre: number;
  created_at: string;
  updated_at: string;
}

export type PilierContenuInsert = Omit<PilierContenu, 'id' | 'created_at' | 'updated_at'>;
export type PilierContenuUpdate = Partial<Omit<PilierContenu, 'id' | 'strategy_id' | 'created_at' | 'updated_at'>>;

// KPI
export interface KPI {
  id: number;
  strategy_id: number;
  nom: string;
  objectif: string | null;
  valeur_cible: number | null;
  unite: string | null; // followers, %, CHF, etc.
  periodicite: string | null; // mensuel, hebdomadaire, annuel
  created_at: string;
  updated_at: string;
}

export type KPIInsert = Omit<KPI, 'id' | 'created_at' | 'updated_at'>;
export type KPIUpdate = Partial<Omit<KPI, 'id' | 'strategy_id' | 'created_at' | 'updated_at'>>;

// KPI Mesure (pour le tracking dans le temps)
export interface KPIMesure {
  id: number;
  kpi_id: number;
  date: string; // YYYY-MM-DD
  valeur_mesuree: number;
  commentaire: string | null;
  created_at: string;
}

export type KPIMesureInsert = Omit<KPIMesure, 'id' | 'created_at'>;

// =========================================================
// TYPES LEGACY (pour compatibilité JSONB pendant migration)
// =========================================================

export interface PersonaLegacy {
  nom: string;
  age?: string;
  besoins: string;
  problemes: string;
  attentes: string;
}

export interface PilierContenuLegacy {
  titre: string;
  description: string;
  exemples: string;
}

export interface KPILegacy {
  nom: string;
  objectif: string;
  periodicite: string;
}

// Post du calendrier éditorial (entité complète)
export interface EditorialPost {
  id: number;
  calendar_id: number;
  pilier_id: number | null; // Lien vers pilier_contenu (optionnel)
  
  // Informations du post
  publication_date: string; // YYYY-MM-DD
  platform: string;
  content_type: string | null;
  title: string;
  description: string | null;
  
  // Contenu
  caption: string | null;
  hashtags: string[] | null;
  mentions: string[] | null;
  media_urls: string[] | null;
  
  // Statut et suivi
  status: 'draft' | 'scheduled' | 'published' | 'cancelled';
  scheduled_time: string | null; // HH:MM:SS
  published_at: string | null;
  
  // Métriques
  likes: number;
  comments: number;
  shares: number;
  views: number;
  reach: number;
  engagement_rate: number | null;
  
  // Métadonnées
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

// Calendrier éditorial (entité)
export interface EditorialCalendar {
  id: number;
  strategy_id: number;
  name: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

// Types pour insertion
export type EditorialPostInsert = Omit<EditorialPost, 'id' | 'created_at' | 'updated_at' | 'likes' | 'comments' | 'shares' | 'views' | 'reach'>;
export type EditorialPostUpdate = Partial<Omit<EditorialPost, 'id' | 'calendar_id' | 'created_at' | 'updated_at'>>;

export type EditorialCalendarInsert = Omit<EditorialCalendar, 'id' | 'created_at' | 'updated_at'>;
export type EditorialCalendarUpdate = Partial<Omit<EditorialCalendar, 'id' | 'strategy_id' | 'created_at' | 'updated_at'>>;

// Interface SocialMediaStrategy (avec client_id au lieu de mandat_id)
export interface SocialMediaStrategy {
  id: number;
  client_id: number; // Changé de mandat_id à client_id
  version: number;
  status: StrategyStatus;
  
  // 1. Contexte & objectifs business
  contexte_general: string | null;
  objectifs_business: string | null;
  objectifs_reseaux: string | null;
  
  // 2. Audience & Personas
  cibles: string | null;
  personas: Persona[] | null;
  plateformes: string[] | null;
  
  // 3. Positionnement & identité
  ton_voix: string | null;
  guidelines_visuelles: string | null;
  valeurs_messages: string | null;
  
  // 4. Piliers de contenu
  piliers_contenu: PilierContenu[] | null;
  
  // 5. Formats & rythme
  formats_envisages: string[] | null;
  frequence_calendrier: string | null;
  workflow_roles: string | null;
  
  // 6. Audit & concurrence
  audit_profils: string | null;
  benchmark_concurrents: string | null;
  
  // 7. KPIs & suivi
  kpis: KPI[] | null;
  cadre_suivi: string | null;
  
  // 8. Canaux & mix média (PESO)
  owned_media: string | null;
  shared_media: string | null;
  paid_media: string | null;
  earned_media: string | null;
  
  // 9. Budget & ressources
  temps_humain: string | null;
  outils: string | null;
  budget_pub: string | null;
  
  // 10. Planning & optimisation
  planning_global: string | null;
  processus_iteration: string | null;
  mise_a_jour: string | null;
  
  // Métadonnées
  notes_internes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

// Type pour créer une stratégie
export type SocialMediaStrategyInsert = Omit<
  SocialMediaStrategy, 
  'id' | 'created_at' | 'updated_at' | 'version'
>;

// Type pour mettre à jour une stratégie
export type SocialMediaStrategyUpdate = Partial<
  Omit<SocialMediaStrategy, 'id' | 'created_at' | 'updated_at' | 'mandat_id'>
>;

// Labels pour les statuts de stratégie
export const STRATEGY_STATUS_LABELS: Record<StrategyStatus, string> = {
  brouillon: 'Brouillon',
  actif: 'Actif',
  valide: 'Validé',
  archive: 'Archivé',
};

// Couleurs pour les statuts de stratégie
export const STRATEGY_STATUS_COLORS: Record<StrategyStatus, string> = {
  brouillon: 'bg-white text-black font-black border-[3px] border-gray-600 shadow-sm',
  actif: 'bg-white text-black font-black border-[3px] border-green-600 shadow-sm',
  valide: 'bg-white text-black font-black border-[3px] border-green-600 shadow-sm',
  archive: 'bg-white text-black font-black border-[3px] border-orange-600 shadow-sm',
};

// Plateformes sociales disponibles
export const SOCIAL_PLATFORMS = [
  'Facebook',
  'Instagram',
  'LinkedIn',
  'Twitter/X',
  'TikTok',
  'YouTube',
  'Pinterest',
  'Snapchat',
  'WhatsApp',
  'Telegram',
  'Discord',
  'Twitch',
  'Reddit',
] as const;

// Formats de contenu disponibles
export const CONTENT_FORMATS = [
  'Photos',
  'Carrousels',
  'Vidéos courtes (Reels/Shorts)',
  'Vidéos longues',
  'Stories',
  'Infographies',
  'Lives',
  'Podcasts',
  'Articles de blog',
  'Newsletters',
  'Webinaires',
  'UGC (User Generated Content)',
] as const;

// =========================================================
// VIDEO SCRIPT
// =========================================================

export interface VideoScript {
  id: number;
  title: string;
  content: string;
  client_id: number | null;
  mandat_id: number | null;
  editorial_post_id: number | null;
  created_at: string;
  updated_at: string;
}

export type VideoScriptInsert = Omit<VideoScript, 'id' | 'created_at' | 'updated_at'>;
export type VideoScriptUpdate = Partial<Omit<VideoScript, 'id' | 'created_at' | 'updated_at'>>;

// =========================================================
// CLIENT KPI TRACKING
// =========================================================

export type ClientKPICategorie = 'social_media' | 'website' | 'sales' | 'engagement' | 'autre';
export type ClientKPIPeriodicite = 'hebdomadaire' | 'mensuel' | 'trimestriel' | 'annuel';

// Interface ClientKPI
export interface ClientKPI {
  id: number;
  client_id: number;
  nom: string;
  description: string | null;
  categorie: ClientKPICategorie | null;
  unite: string | null;
  valeur_cible: number | null;
  periodicite: ClientKPIPeriodicite | null;
  ordre: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Interface ClientKPIValue
export interface ClientKPIValue {
  id: number;
  kpi_id: number;
  date: string;
  valeur_mesuree: number;
  commentaire: string | null;
  created_at: string;
  created_by: string | null;
}

// Types pour insertion
export type ClientKPIInsert = Omit<ClientKPI, 'id' | 'created_at' | 'updated_at'>;
export type ClientKPIUpdate = Partial<Omit<ClientKPI, 'id' | 'client_id' | 'created_at' | 'updated_at'>>;

export type ClientKPIValueInsert = Omit<ClientKPIValue, 'id' | 'created_at'>;
export type ClientKPIValueUpdate = Partial<Omit<ClientKPIValue, 'id' | 'kpi_id' | 'created_at'>>;

// Labels pour les catégories de KPI
export const CLIENT_KPI_CATEGORIE_LABELS: Record<ClientKPICategorie, string> = {
  social_media: 'Réseaux Sociaux',
  website: 'Site Web',
  sales: 'Ventes',
  engagement: 'Engagement',
  autre: 'Autre',
};

// Couleurs pour les catégories de KPI
export const CLIENT_KPI_CATEGORIE_COLORS: Record<ClientKPICategorie, string> = {
  social_media: 'bg-blue-100 text-blue-700',
  website: 'bg-purple-100 text-purple-700',
  sales: 'bg-green-100 text-green-700',
  engagement: 'bg-orange-100 text-orange-700',
  autre: 'bg-gray-100 text-gray-700',
};

// Labels pour les périodicités
export const CLIENT_KPI_PERIODICITE_LABELS: Record<ClientKPIPeriodicite, string> = {
  hebdomadaire: 'Hebdomadaire',
  mensuel: 'Mensuel',
  trimestriel: 'Trimestriel',
  annuel: 'Annuel',
};

// =========================================================
// BILLING SYSTEM - CONTRACTS & PAYMENTS
// =========================================================

// Types pour le système de contrats
export type ContractStatus = 'draft' | 'active' | 'suspended' | 'completed' | 'cancelled';
export type BillingCycle = 'one_time' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
export type ScheduleStatus = 'planned' | 'invoiced' | 'paid' | 'cancelled' | 'skipped';
export type PaymentMethod = 'bank_transfer' | 'qr_bill' | 'card' | 'cash' | 'other';
export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'refunded';

// Interface ClientContract (Contrat virtuel)
export interface ClientContract {
  id: number;
  client_id: number;
  mandat_id: number | null;
  
  // Informations du contrat
  contract_name: string;
  description: string | null;
  
  // Montants
  monthly_amount: number; // Montant mensuel de base
  setup_fee: number; // Frais d'installation/setup
  
  // Période contractuelle
  start_date: string;
  end_date: string | null; // NULL = durée indéterminée
  duration_months: number | null; // Durée en mois (alternative à end_date)
  
  // Configuration de facturation
  billing_cycle: BillingCycle;
  invoice_day: number; // Jour du mois (1-31)
  payment_terms_days: number; // Délai de paiement (ex: 30 jours)
  
  // Génération automatique
  auto_generate_invoices: boolean;
  auto_send_invoices: boolean;
  
  // Statut
  status: ContractStatus;
  
  // Métadonnées
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

// Type pour créer un contrat
export type ClientContractInsert = Omit<ClientContract, 'id' | 'created_at' | 'updated_at'>;

// Type pour mettre à jour un contrat
export type ClientContractUpdate = Partial<Omit<ClientContract, 'id' | 'created_at' | 'updated_at'>>;

// Interface ContractSchedule (Échéances attendues)
export interface ContractSchedule {
  id: number;
  contract_id: number;
  
  // Dates de l'échéance
  period_start_date: string;
  period_end_date: string;
  expected_issue_date: string; // Date prévue d'émission de la facture
  expected_due_date: string | null; // Date d'échéance de paiement
  
  // Montant attendu
  expected_amount: number;
  
  // Statut de l'échéance
  status: ScheduleStatus;
  
  // Lien vers la facture générée
  invoice_id: number | null;
  
  // Métadonnées
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Type pour créer une échéance
export type ContractScheduleInsert = Omit<ContractSchedule, 'id' | 'created_at' | 'updated_at'>;

// Type pour mettre à jour une échéance
export type ContractScheduleUpdate = Partial<Omit<ContractSchedule, 'id' | 'created_at' | 'updated_at'>>;

// Interface Payment (Paiements reçus)
export interface Payment {
  id: number;
  
  // Relations
  invoice_id: number;
  client_id: number;
  
  // Informations du paiement
  payment_date: string;
  amount: number;
  payment_method: PaymentMethod;
  
  // Référence
  reference: string | null; // Référence bancaire, numéro de transaction, etc.
  
  // Statut
  status: PaymentStatus;
  
  // Métadonnées
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

// Type pour créer un paiement
export type PaymentInsert = Omit<Payment, 'id' | 'created_at' | 'updated_at'>;

// Type pour mettre à jour un paiement
export type PaymentUpdate = Partial<Omit<Payment, 'id' | 'created_at' | 'updated_at'>>;

// Labels pour les statuts de contrat
export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  draft: 'Brouillon',
  active: 'Actif',
  suspended: 'Suspendu',
  completed: 'Terminé',
  cancelled: 'Annulé',
};

// Couleurs pour les statuts de contrat
export const CONTRACT_STATUS_COLORS: Record<ContractStatus, string> = {
  draft: 'bg-white text-black font-black border-[3px] border-gray-600 shadow-sm',
  active: 'bg-white text-black font-black border-[3px] border-green-600 shadow-sm',
  suspended: 'bg-white text-black font-black border-[3px] border-orange-600 shadow-sm',
  completed: 'bg-white text-black font-black border-[3px] border-blue-600 shadow-sm',
  cancelled: 'bg-white text-black font-black border-[3px] border-red-600 shadow-sm',
};

// Labels pour les cycles de facturation
export const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
  one_time: 'Unique',
  monthly: 'Mensuel',
  quarterly: 'Trimestriel',
  semi_annual: 'Semestriel',
  annual: 'Annuel',
};

// Labels pour les statuts d'échéance
export const SCHEDULE_STATUS_LABELS: Record<ScheduleStatus, string> = {
  planned: 'Planifiée',
  invoiced: 'Facturée',
  paid: 'Payée',
  cancelled: 'Annulée',
  skipped: 'Sautée',
};

// Couleurs pour les statuts d'échéance
export const SCHEDULE_STATUS_COLORS: Record<ScheduleStatus, string> = {
  planned: 'bg-white text-black font-black border-[3px] border-blue-600 shadow-sm',
  invoiced: 'bg-white text-black font-black border-[3px] border-orange-600 shadow-sm',
  paid: 'bg-white text-black font-black border-[3px] border-green-600 shadow-sm',
  cancelled: 'bg-white text-black font-black border-[3px] border-red-600 shadow-sm',
  skipped: 'bg-white text-black font-black border-[3px] border-gray-600 shadow-sm',
};

// Labels pour les méthodes de paiement
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  bank_transfer: 'Virement bancaire',
  qr_bill: 'QR-facture',
  card: 'Carte bancaire',
  cash: 'Espèces',
  other: 'Autre',
};

// Labels pour les statuts de paiement
export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  failed: 'Échoué',
  refunded: 'Remboursé',
};

// Couleurs pour les statuts de paiement
export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  pending: 'bg-white text-black font-black border-[3px] border-yellow-600 shadow-sm',
  confirmed: 'bg-white text-black font-black border-[3px] border-green-600 shadow-sm',
  failed: 'bg-white text-black font-black border-[3px] border-red-600 shadow-sm',
  refunded: 'bg-white text-black font-black border-[3px] border-purple-600 shadow-sm',
};

// Interface pour les vues agrégées
export interface ContractSummary extends ClientContract {
  client_name: string;
  total_schedules: number;
  planned_schedules: number;
  invoiced_schedules: number;
  paid_schedules: number;
  expected_amount: number;
  invoiced_amount: number;
  paid_amount: number;
}

export interface InvoicePaymentStatus extends Invoice {
  total_paid: number;
  remaining_amount: number;
  payment_status: 'fully_paid' | 'partially_paid' | 'unpaid';
  payment_count: number;
}

