// Types pour la page calendrier

export interface User {
  id: number;
  email: string;
  role_code: string;
  role_name: string;
  role_id: number; 
  client_id?: number;
  client_name?: string;
}

// Interface principale pour les événements du calendrier
export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  type: 'video' | 'contenu' | 'reunion' | 'reporting' | 'autre' | 'editorial';
  description?: string;
  location?: string;
  videoTitle?: string;
  videoThumbnail?: string;
  mandatId?: number;
  mandatTitle?: string;
  status?: string;
  color: string;
  createdAt: Date;
  // Pour les posts éditoriaux
  platform?: string;
  contentType?: string;
  source: 'task' | 'editorial' | 'mock';
}

// Interface pour les tâches du mandat depuis la base de données
export interface MandatTask {
  id: number;
  mandat_id: number;
  title: string;
  details?: string;
  type: 'contenu' | 'video' | 'reunion' | 'reporting' | 'autre';
  status: 'a_faire' | 'en_cours' | 'terminee';
  due_date?: string;
  created_at: string;
  updated_at: string;
  mandat?: {
    id: number;
    title: string;
    client_id: number;
  };
}

// Interface pour les posts éditoriaux depuis la base de données
export interface EditorialPost {
  id: number;
  calendar_id: number;
  publication_date: string;
  platform: string;
  content_type?: string;
  title: string;
  description?: string;
  status: 'draft' | 'scheduled' | 'published' | 'cancelled';
  scheduled_time?: string;
  notes?: string;
  created_at: string;
  calendar?: {
    id: number;
    strategy_id: number;
  };
  strategy?: {
    id: number;
    client_id: number;
  };
}
