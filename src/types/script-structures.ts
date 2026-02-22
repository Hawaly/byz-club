export type ScriptObjective = 
  | "apporter-valeur"
  | "raconter-histoire"
  | "inspirer-motiver"
  | "convaincre-casser-croyance"
  | "montrer-autorite-vendre";

export type ScriptStructure = 
  | "valeur-rapide"
  | "storytelling"
  | "transformation"
  | "mythe"
  | "voyage-inverse";

export type CTAType = 
  | "sauvegarder"
  | "commenter"
  | "abonner"
  | "demander-suite";

export interface ScriptObjectiveOption {
  id: ScriptObjective;
  label: string;
  description: string;
  structure: ScriptStructure;
}

export interface ValeurRapideData {
  hook: string;
  promesse: string;
  point1: string;
  point2: string;
  point3: string;
  benefice: string;
  cta: CTAType;
}

export interface StorytellingData {
  momentIntrigant: string;
  contexte: string;
  tension: string;
  lecon: string;
  cta: CTAType;
}

export interface TransformationData {
  situationCritique: string;
  accumulationProblemes: string;
  priseConscience: string;
  nouvelleSituation: string;
  cta: CTAType;
}

export interface MytheData {
  mytheCourant: string;
  realite: string;
  preuvePersonnelle: string;
  nouvelleCroyance: string;
  cta: CTAType;
}

export interface VoyageInverseData {
  resultatObtenu: string;
  ceQueNestPas: string;
  etapesCles: string;
  principe: string;
  cta: CTAType;
}

export type ScriptFormData = 
  | ValeurRapideData
  | StorytellingData
  | TransformationData
  | MytheData
  | VoyageInverseData;

export interface ScriptValidation {
  hasHook: boolean;
  isComplete: boolean;
  hasCTA: boolean;
  isSimpleLanguage: boolean;
  hasObjective: boolean;
  warnings: string[];
}

export const SCRIPT_OBJECTIVES: ScriptObjectiveOption[] = [
  {
    id: "apporter-valeur",
    label: "Apporter de la valeur",
    description: "Tutoriels, conseils, astuces, erreurs à éviter",
    structure: "valeur-rapide"
  },
  {
    id: "raconter-histoire",
    label: "Raconter une histoire",
    description: "Personal branding, story de client, parcours pro",
    structure: "storytelling"
  },
  {
    id: "inspirer-motiver",
    label: "Inspirer / motiver",
    description: "Motivation, inspiration, preuve de changement réel",
    structure: "transformation"
  },
  {
    id: "convaincre-casser-croyance",
    label: "Convaincre / casser une croyance",
    description: "Lever une objection, se différencier",
    structure: "mythe"
  },
  {
    id: "montrer-autorite-vendre",
    label: "Montrer ton autorité / vendre",
    description: "Vente, expertise, crédibilité",
    structure: "voyage-inverse"
  }
];

export const CTA_OPTIONS: { value: CTAType; label: string }[] = [
  { value: "sauvegarder", label: "Sauvegarder" },
  { value: "commenter", label: "Commenter" },
  { value: "abonner", label: "S'abonner" },
  { value: "demander-suite", label: "Demander la suite" }
];

export const MAX_FIELD_LENGTH = 500;
export const TARGET_DURATION_SECONDS = 60;
