import { CalendarEvent } from './types';

// Création d'événements fictifs pour le calendrier
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

export const mockEvents: CalendarEvent[] = [
  // Vidéos planifiées
  {
    id: 1,
    title: "Interview avec l'expert marketing",
    start: new Date(currentYear, currentMonth, currentDate.getDate() + 3, 10, 0),
    end: new Date(currentYear, currentMonth, currentDate.getDate() + 3, 11, 0),
    allDay: false,
    type: 'video',
    description: "Préparation de l'interview avec Jean Martin, expert en marketing digital pour discuter des tendances actuelles.",
    videoTitle: "Tendances Marketing 2026",
    videoThumbnail: "https://i.pravatar.cc/300?img=25",
    mandatId: 101,
    mandatTitle: "Stratégie de Contenu Digital",
    status: 'scheduled',
    color: '#3B82F6',
    createdAt: new Date(currentYear, currentMonth, currentDate.getDate() - 10),
    source: 'mock' as const
  },
  {
    id: 2,
    title: "Tournage vidéo présentation produit",
    start: new Date(currentYear, currentMonth, currentDate.getDate() + 5, 9, 0),
    end: new Date(currentYear, currentMonth, currentDate.getDate() + 5, 16, 0),
    allDay: false,
    type: 'video',
    description: "Journée de tournage complète pour la présentation de votre nouvelle gamme de produits.",
    location: "Studio B, 15 Rue de la Création",
    videoTitle: "Lancement Nouvelle Gamme 2026",
    mandatId: 102,
    mandatTitle: "Campagne Produits Innovants",
    status: 'scheduled',
    color: '#3B82F6',
    createdAt: new Date(currentYear, currentMonth, currentDate.getDate() - 15),
    source: 'mock' as const
  },
  {
    id: 3,
    title: "Diffusion vidéo explicative",
    start: new Date(currentYear, currentMonth, currentDate.getDate() - 2, 12, 0),
    end: new Date(currentYear, currentMonth, currentDate.getDate() - 2, 13, 0),
    allDay: false,
    type: 'video',
    description: "Publication de la vidéo explicative sur votre processus de fabrication éco-responsable.",
    videoTitle: "Notre Processus Eco-Responsable",
    videoThumbnail: "https://i.pravatar.cc/300?img=28",
    mandatId: 103,
    mandatTitle: "Communication RSE",
    status: 'completed',
    color: '#3B82F6',
    createdAt: new Date(currentYear, currentMonth, currentDate.getDate() - 20),
    source: 'mock' as const
  },
  
  // Réunions
  {
    id: 4,
    title: "Réunion de briefing stratégique",
    start: new Date(currentYear, currentMonth, currentDate.getDate() + 1, 14, 0),
    end: new Date(currentYear, currentMonth, currentDate.getDate() + 1, 15, 30),
    allDay: false,
    type: 'reunion',
    description: "Réunion pour discuter de la stratégie marketing du prochain trimestre.",
    location: "Salle de conférence A ou en visioconférence",
    mandatId: 101,
    mandatTitle: "Stratégie de Contenu Digital",
    status: 'scheduled',
    color: '#10B981',
    createdAt: new Date(currentYear, currentMonth, currentDate.getDate() - 5),
    source: 'mock' as const
  },
  {
    id: 5,
    title: "Point d'avancement mensuel",
    start: new Date(currentYear, currentMonth, currentDate.getDate() + 8),
    end: new Date(currentYear, currentMonth, currentDate.getDate() + 8),
    allDay: true,
    type: 'reunion',
    description: "Revue mensuelle d'avancement du projet. Nous aborderons les indicateurs de performance, les objectifs atteints et les prochaines étapes.",
    location: "En ligne via Zoom",
    mandatId: 102,
    mandatTitle: "Campagne Produits Innovants",
    status: 'scheduled',
    color: '#10B981',
    createdAt: new Date(currentYear, currentMonth, currentDate.getDate() - 12),
    source: 'mock' as const
  },
  {
    id: 6,
    title: "Réunion annulée",
    start: new Date(currentYear, currentMonth, currentDate.getDate() - 1, 11, 0),
    end: new Date(currentYear, currentMonth, currentDate.getDate() - 1, 12, 0),
    allDay: false,
    type: 'reunion',
    description: "Cette réunion a été annulée en raison d'un imprévu.",
    location: "Bureau 301",
    mandatId: 103,
    mandatTitle: "Communication RSE",
    status: 'canceled',
    color: '#10B981',
    createdAt: new Date(currentYear, currentMonth, currentDate.getDate() - 8),
    source: 'mock' as const
  },
  
  // Échéances
  {
    id: 7,
    title: "Validation des maquettes",
    start: new Date(currentYear, currentMonth, currentDate.getDate() + 2),
    end: new Date(currentYear, currentMonth, currentDate.getDate() + 2),
    allDay: true,
    type: 'reporting',
    description: "Date limite pour la validation des maquettes graphiques du site web.",
    mandatId: 101,
    mandatTitle: "Stratégie de Contenu Digital",
    status: 'scheduled',
    color: '#F59E0B',
    createdAt: new Date(currentYear, currentMonth, currentDate.getDate() - 14),
    source: 'mock' as const
  },
  {
    id: 8,
    title: "Remise du rapport trimestriel",
    start: new Date(currentYear, currentMonth, currentDate.getDate() + 10),
    end: new Date(currentYear, currentMonth, currentDate.getDate() + 10),
    allDay: true,
    type: 'reporting',
    description: "Date limite pour la remise du rapport trimestriel d'analyse de performance.",
    mandatId: 102,
    mandatTitle: "Campagne Produits Innovants",
    status: 'scheduled',
    color: '#F59E0B',
    createdAt: new Date(currentYear, currentMonth, currentDate.getDate() - 30),
    source: 'mock' as const
  },
  {
    id: 9,
    title: "Finalisation du script vidéo",
    start: new Date(currentYear, currentMonth, currentDate.getDate() - 4),
    end: new Date(currentYear, currentMonth, currentDate.getDate() - 4),
    allDay: true,
    type: 'reporting',
    description: "Échéance pour la finalisation du script de la vidéo de présentation.",
    mandatId: 103,
    mandatTitle: "Communication RSE",
    status: 'completed',
    color: '#F59E0B',
    createdAt: new Date(currentYear, currentMonth, currentDate.getDate() - 18),
    source: 'mock' as const
  },
  
  // Autres événements
  {
    id: 10,
    title: "Lancement campagne réseaux sociaux",
    start: new Date(currentYear, currentMonth, currentDate.getDate() + 15),
    end: new Date(currentYear, currentMonth, currentDate.getDate() + 15),
    allDay: true,
    type: 'autre',
    description: "Lancement de la campagne sur les réseaux sociaux pour la nouvelle collection.",
    mandatId: 102,
    mandatTitle: "Campagne Produits Innovants",
    status: 'scheduled',
    color: '#6366F1',
    createdAt: new Date(currentYear, currentMonth, currentDate.getDate() - 25),
    source: 'mock' as const
  }
];
