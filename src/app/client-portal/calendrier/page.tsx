"use client";

import { useState, useEffect } from 'react';
import { useRequireClient } from '@/contexts/SimpleAuthContext';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { 
  Loader2, Calendar as CalendarIcon, Video, 
  MapPin, Clock, X, Briefcase, ExternalLink, 
  CheckCircle, FileText 
} from 'lucide-react';
import { mockEvents } from './mockData';
import { ClientCalendar } from '@/components/client-portal/calendar/ClientCalendar';

// Définitions des types directement dans le fichier pour éviter les problèmes d'importation
interface User {
  id: number;
  email: string;
  role_code: string;
  role_name: string;
  role_id: number; 
  client_id?: number;
  client_name?: string;
}

interface CalendarEvent {
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
  platform?: string;
  contentType?: string;
  source: 'task' | 'editorial' | 'mock';
}

// Fonction pour mapper le statut de tâche en statut d'événement
const mapTaskStatus = (status: string): string => {
  switch (status) {
    case 'a_faire':
      return 'pending';
    case 'en_cours':
      return 'scheduled';
    case 'terminee':
      return 'completed';
    default:
      return 'scheduled';
  }
};

// Couleurs pour les plateformes social media
const PLATFORM_COLORS: Record<string, string> = {
  Instagram: '#E1306C',
  Facebook: '#4267B2',
  LinkedIn: '#0077B5',
  TikTok: '#000000',
  'Twitter/X': '#1DA1F2',
  YouTube: '#FF0000',
};

// Fonction pour obtenir la couleur d'une plateforme
const getPlatformColor = (platform: string): string => {
  return PLATFORM_COLORS[platform] || '#6366F1'; // Indigo par défaut
};

// Composant pour le modal de détails d'un événement
interface EventDetailModalProps {
  event: CalendarEvent;
  onClose: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
  // Formater les dates pour l'affichage
  const formatEventDate = (date: Date) => {
    return format(date, 'EEEE d MMMM yyyy', { locale: fr });
  };
  
  const formatEventTime = (date: Date) => {
    return format(date, 'HH:mm', { locale: fr });
  };
  
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  };
  
  // Obtenir l'icône et la couleur en fonction du type d'événement
  const getEventTypeInfo = () => {
    switch(event.type) {
      case 'video':
        return {
          icon: <Video className="w-5 h-5" />,
          label: 'Vidéo',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-700'
        };
      case 'reunion':
        return {
          icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>,
          label: 'Réunion',
          bgColor: 'bg-green-100',
          textColor: 'text-green-700'
        };
      case 'reporting':
        return {
          icon: <CalendarIcon className="w-5 h-5" />,
          label: 'Échéance',
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-700'
        };
      default:
        return {
          icon: <CalendarIcon className="w-5 h-5" />,
          label: 'Événement',
          bgColor: 'bg-indigo-100',
          textColor: 'text-indigo-700'
        };
    }
  };
  
  // Obtenir l'icône et la couleur en fonction du statut de l'événement
  const getEventStatusInfo = () => {
    switch(event.status) {
      case 'completed':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'Terminé',
          bgColor: 'bg-green-100',
          textColor: 'text-green-700'
        };
      case 'canceled':
        return {
          icon: <X className="w-4 h-4" />,
          label: 'Annulé',
          bgColor: 'bg-red-100',
          textColor: 'text-red-700'
        };
      case 'pending':
        return {
          icon: <Clock className="w-4 h-4" />,
          label: 'En attente',
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-700'
        };
      default:
        return {
          icon: <CalendarIcon className="w-4 h-4" />,
          label: 'Planifié',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-700'
        };
    }
  };
  
  const eventTypeInfo = getEventTypeInfo();
  const eventStatusInfo = getEventStatusInfo();
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-lg w-full"
      >
        {/* Entête */}
        <div 
          className="p-6 text-white"
          style={{ backgroundColor: event.color }}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${eventTypeInfo.bgColor} ${eventTypeInfo.textColor} flex items-center gap-1`}>
                  {eventTypeInfo.icon} {eventTypeInfo.label}
                </span>
                {event.status && (
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${eventStatusInfo.bgColor} ${eventStatusInfo.textColor} flex items-center gap-1`}>
                    {eventStatusInfo.icon} {eventStatusInfo.label}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold">{event.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Date et heure */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Date et heure</h3>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <CalendarIcon className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                {isSameDay(event.start, event.end) ? (
                  <>
                    <p className="font-medium text-gray-900">{formatEventDate(event.start)}</p>
                    {!event.allDay && (
                      <p className="text-sm text-gray-600 mt-1">
                        {formatEventTime(event.start)} - {formatEventTime(event.end)}
                      </p>
                    )}
                    {event.allDay && (
                      <p className="text-sm text-gray-600 mt-1">Toute la journée</p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="font-medium text-gray-900">
                      Du {formatEventDate(event.start)} au {formatEventDate(event.end)}
                    </p>
                    {!event.allDay && (
                      <p className="text-sm text-gray-600 mt-1">
                        {formatEventTime(event.start)} - {formatEventTime(event.end)}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Lieu (si disponible) */}
          {event.location && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Lieu</h3>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                <p className="text-gray-900">{event.location}</p>
              </div>
            </div>
          )}
          
          {/* Description (si disponible) */}
          {event.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Description</h3>
              <p className="p-4 bg-gray-50 rounded-xl text-gray-700">{event.description}</p>
            </div>
          )}
          
          {/* Vidéo associée (si disponible) */}
          {event.videoTitle && event.type === 'video' && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Vidéo planifiée</h3>
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {event.videoThumbnail ? (
                      <img 
                        src={event.videoThumbnail} 
                        alt={event.videoTitle}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-blue-100 rounded-md flex items-center justify-center">
                        <Video className="w-8 h-8 text-blue-500" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{event.videoTitle}</p>
                    <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                      <Video className="w-4 h-4" /> Vidéo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Projet associé (si disponible) */}
          {event.mandatId && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Projet associé</h3>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Briefcase className="w-5 h-5 text-indigo-600" />
                    </div>
                    <p className="font-medium text-gray-900">{event.mandatTitle}</p>
                  </div>
                  <Link href={`/client-portal/mandats`} className="text-sm text-indigo-600 flex items-center gap-1 hover:text-indigo-800">
                    Voir <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="p-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function CalendrierPage() {
  const { user } = useRequireClient() as { user: User, isLoading: boolean };
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // useRequireClient guarantees user exists or redirects
    if (!user || !user.client_id) return;

    const fetchCalendarData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 1. Récupérer les tâches de mandat
        const { data: taskData, error: taskError } = await supabase
          .from('mandat_task')
          .select(`
            *,
            mandat:mandat_id(id, title, client_id)
          `)
          .eq('mandat.client_id', user.client_id)
          .not('due_date', 'is', null);

        if (taskError && taskError.code !== 'PGRST116') {
          console.error('Erreur lors de la récupération des tâches:', taskError);
          setError(`Erreur lors de la récupération des tâches: ${taskError.message || 'Erreur inconnue'}`);
          setIsLoading(false);
          return;
        }

        // 2. Récupérer les publications éditoriales
        let postData: any[] = [];
        
        // Récupérer d'abord les stratégies du client
        const { data: strategies, error: stratError } = await supabase
          .from('social_media_strategy')
          .select('id')
          .eq('client_id', user.client_id);

        if (!stratError && strategies && strategies.length > 0) {
          // Récupérer les calendriers éditoriaux associés aux stratégies
          const strategyIds = strategies.map(s => s.id);
          
          const { data: calendars, error: calError } = await supabase
            .from('editorial_calendar')
            .select('id, strategy_id')
            .in('strategy_id', strategyIds);

          if (!calError && calendars && calendars.length > 0) {
            // Récupérer les posts des calendriers
            const calendarIds = calendars.map(c => c.id);
            
            const { data: posts, error: postError } = await supabase
              .from('editorial_post')
              .select('*')
              .in('calendar_id', calendarIds);

            if (!postError && posts) {
              postData = posts;
            }
          }
        }

        // 3. Convertir les données au format CalendarEvent
        const calendarEvents: CalendarEvent[] = [];
        
        // Ajouter les tâches de mandat
        if (taskData && taskData.length > 0) {
          const taskEvents = taskData.map((task) => {
            // Date de fin = date de début + 1 heure par défaut
            const startDate = task.due_date ? new Date(task.due_date) : new Date();
            const endDate = new Date(startDate);
            endDate.setHours(endDate.getHours() + 1);
            
            return {
              id: task.id,
              title: task.title,
              start: startDate,
              end: endDate,
              allDay: false,
              type: task.type as any,
              description: task.details,
              mandatId: task.mandat_id,
              mandatTitle: task.mandat?.title,
              status: mapTaskStatus(task.status),
              color: getEventColor(task.type, task.status),
              createdAt: new Date(task.created_at),
              source: 'task' as const
            };
          });
          
          calendarEvents.push(...taskEvents);
        }
        
        // Ajouter les posts éditoriaux
        if (postData.length > 0) {
          const postEvents = postData.map((post) => {
            const startDate = post.publication_date ? new Date(post.publication_date) : new Date();
            const endDate = new Date(startDate);
            
            // Si une heure est spécifiée, l'utiliser
            if (post.scheduled_time) {
              const [hours, minutes] = post.scheduled_time.split(':');
              startDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
              endDate.setHours(parseInt(hours, 10) + 1, parseInt(minutes, 10));
            } else {
              // Sinon, considérer comme toute la journée
              endDate.setDate(endDate.getDate() + 1);
            }
            
            return {
              id: post.id + 10000, // Préfixe pour éviter les conflits d'ID avec les tâches
              title: post.title,
              start: startDate,
              end: endDate,
              allDay: !post.scheduled_time,
              type: 'editorial' as const,
              description: post.description,
              status: post.status,
              platform: post.platform,
              contentType: post.content_type,
              color: getPlatformColor(post.platform),
              createdAt: new Date(post.created_at),
              source: 'editorial' as const
            };
          });
          
          calendarEvents.push(...postEvents);
        }

        // Si aucun événement réel n'est trouvé, ajouter des événements fictifs pour la démonstration
        if (calendarEvents.length === 0) {
          const demoEvents = mockEvents.map(e => ({
            ...e,
            source: 'mock' as const
          }));
          setEvents(demoEvents);
        } else {
          setEvents(calendarEvents);
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement des événements:', error);
        setError(`Erreur lors du chargement des événements: ${error.message || 'Erreur inconnue'}`);
        
        // En cas d'erreur, afficher les données fictives
        const demoEvents = mockEvents.map(e => ({
          ...e,
          source: 'mock' as const
        }));
        setEvents(demoEvents);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarData();
  }, [user]);
  
  // Obtenir la couleur en fonction du type d'événement
  const getEventColor = (type: string, status?: string): string => {
    if (status === 'canceled' || status === 'cancelled') return '#EF4444'; // Rouge pour les événements annulés
    
    switch (type) {
      case 'video':
        return '#3B82F6'; // Bleu pour les vidéos
      case 'reunion':
      case 'meeting':
        return '#10B981'; // Vert pour les réunions
      case 'contenu':
        return '#8B5CF6'; // Violet pour les contenus
      case 'reporting':
        return '#F59E0B'; // Ambre pour les rapports
      case 'editorial':
        return '#6366F1'; // Indigo pour les posts éditoriaux
      case 'deadline':
        return '#F59E0B'; // Ambre pour les échéances
      default:
        return '#6366F1'; // Indigo par défaut
    }
  };
  
  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Votre Calendrier</h1>
          <p className="text-gray-600">Consultez vos événements et plannings</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
          <div className="p-1.5 bg-red-100 rounded-full mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div>
            <h3 className="font-medium">Erreur lors du chargement du calendrier</h3>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-xl shadow-lg text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-white/20 rounded-xl">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Votre Calendrier</h1>
            <p className="text-sm text-white/90">Consultez vos événements et plannings</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white/20 px-4 py-2 rounded-lg mt-4 w-fit">
          <div className="text-center">
            <div className="text-2xl font-bold">{events.length}</div>
            <div className="text-xs">Événements</div>
          </div>
        </div>
      </div>
      
      {/* Calendar */}
      {events.length > 0 ? (
        <ClientCalendar
          events={events}
        />
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-md border-2 border-gray-100">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <CalendarIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Aucun événement</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Vous n'avez aucun événement planifié pour le moment.
          </p>
        </div>
      )}
      
      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
}
