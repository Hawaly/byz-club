// @ts-nocheck
"use client";

import { useState, useEffect } from 'react';
import { useRequireClient } from '@/contexts/SimpleAuthContext';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import {
  Video, FileText, Download, Eye, Clock, CheckCircle,
  AlertCircle, Loader2, Calendar, X, Play
} from 'lucide-react';
import { PageHeader } from '@/components/client-portal/PageHeader';
import { StatCard } from '@/components/client-portal/StatCard';
import { ModernCard } from '@/components/client-portal/ModernCard';
import { EmptyState } from '@/components/client-portal/EmptyState';

interface User {
  id: number;
  email: string;
  role_code: string;
  role_name: string;
  role_id: number;
  client_id?: number;
}

interface Script {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface EditorialPost {
  id: number;
  calendar_id: number;
  content_type: string;
  title: string;
  caption?: string;
  platform: string;
  publication_date: string;
  scheduled_time?: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  media_urls?: string[];
  hashtags?: string[];
  created_at: string;
  updated_at?: string;
  script?: Script;
  strategy?: {
    client_id: number;
    client_name: string;
  };
}

export default function VideosPage() {
  const { user } = useRequireClient() as { user: User, isLoading: boolean };
  const [videoPosts, setVideoPosts] = useState<EditorialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<EditorialPost | null>(null);

  useEffect(() => {
    if (user?.client_id) {
      fetchVideoPosts();
    }
  }, [user]);

  const fetchVideoPosts = async () => {
    try {
      setIsLoading(true);

      // 1. Récupérer les stratégies du client
      const { data: strategies, error: stratError } = await supabase
        .from('social_media_strategy')
        .select('id, client_id')
        .eq('client_id', user.client_id);

      if (stratError) {
        console.error('Erreur stratégies:', stratError);
        throw stratError;
      }

      console.log('Stratégies trouvées:', strategies);

      if (!strategies || strategies.length === 0) {
        console.log('Aucune stratégie trouvée pour ce client');
        setVideoPosts([]);
        setIsLoading(false);
        return;
      }

      const strategyIds = strategies.map(s => s.id);

      // 2. Récupérer les calendriers éditoriaux
      const { data: calendars, error: calError } = await supabase
        .from('editorial_calendar')
        .select('id, strategy_id')
        .in('strategy_id', strategyIds);

      if (calError) {
        console.error('Erreur calendriers:', calError);
        throw calError;
      }

      console.log('Calendriers trouvés:', calendars);

      if (!calendars || calendars.length === 0) {
        console.log('Aucun calendrier trouvé');
        setVideoPosts([]);
        setIsLoading(false);
        return;
      }

      const calendarIds = calendars.map(c => c.id);

      // 3. Récupérer les posts de type vidéo
      const { data: posts, error: postError } = await supabase
        .from('editorial_post')
        .select('*')
        .in('calendar_id', calendarIds)
        .order('publication_date', { ascending: true });

      if (postError) throw postError;

      console.log('Posts récupérés:', posts);
      console.log('Nombre de posts:', posts?.length || 0);

      // Filtrer les posts de type vidéo (content_type peut contenir "video", "Vidéo", ou des variations)
      const videoPosts = (posts || []).filter(post => 
        post.content_type && 
        (post.content_type.toLowerCase().includes('video') || 
         post.content_type.toLowerCase().includes('vidéo') ||
         post.content_type.toLowerCase().includes('short') ||
         post.content_type.toLowerCase().includes('reel'))
      );

      console.log('Posts vidéo filtrés:', videoPosts);

      if (videoPosts.length === 0) {
        setVideoPosts([]);
        setIsLoading(false);
        return;
      }

      const postIds = videoPosts.map(p => p.id);

      // 4. Récupérer les scripts associés à ces posts
      const { data: scripts, error: scriptsError } = await supabase
        .from('video_script')
        .select('id, title, content, editorial_post_id, created_at, updated_at')
        .in('editorial_post_id', postIds);

      if (scriptsError) console.error('Error fetching scripts:', scriptsError);

      console.log('Scripts récupérés:', scripts);

      // 5. Associer les scripts aux posts
      const postsWithScripts = videoPosts.map(post => {
        const relatedScript = (scripts || []).find(s => s.editorial_post_id === post.id);
        return {
          ...post,
          script: relatedScript || undefined
        };
      });

      console.log('Posts avec scripts:', postsWithScripts);

      setVideoPosts(postsWithScripts);
    } catch (error) {
      console.error('Error fetching video posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = async (scriptId: number, scriptTitle: string) => {
    try {
      const response = await fetch(`/api/scripts/${scriptId}/download-pdf`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `script-${scriptTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur téléchargement PDF:", error);
      alert("Erreur lors du téléchargement du PDF");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'archived':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4" />;
      case 'scheduled':
        return <Clock className="w-4 h-4" />;
      case 'archived':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publiée';
      case 'scheduled':
        return 'Planifiée';
      case 'archived':
        return 'Archivée';
      default:
        return 'Brouillon';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
        <p className="text-slate-600">Chargement des vidéos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Modern Header */}
      <PageHeader
        title="Vidéos & Scripts"
        description="Consultez vos vidéos planifiées et leurs scripts associés"
        icon={Video}
        iconGradient="from-orange-500 to-orange-600"
      />

      {/* Modern Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total vidéos"
          value={videoPosts.length}
          subtext="Toutes vidéos"
          icon={Video}
          gradient="from-blue-500 to-blue-600"
          delay={0.1}
        />
        <StatCard
          label="Publiées"
          value={videoPosts.filter(v => v.status === 'published').length}
          subtext="En ligne"
          icon={CheckCircle}
          gradient="from-green-500 to-green-600"
          delay={0.2}
        />
        <StatCard
          label="Planifiées"
          value={videoPosts.filter(v => v.status === 'scheduled').length}
          subtext="À venir"
          icon={Clock}
          gradient="from-amber-500 to-amber-600"
          delay={0.3}
        />
        <StatCard
          label="Avec script"
          value={videoPosts.filter(v => v.script).length}
          subtext="Scripts prêts"
          icon={FileText}
          gradient="from-orange-500 to-orange-600"
          delay={0.4}
        />
      </div>

      {/* Videos Grid */}
      {videoPosts.length === 0 ? (
        <EmptyState
          icon={Video}
          title="Aucune vidéo planifiée"
          description="Vos vidéos planifiées apparaîtront ici une fois qu'elles seront créées dans le calendrier éditorial par l'équipe urstory."
          iconGradient="from-orange-500 to-orange-600"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoPosts.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all overflow-hidden border border-slate-200/60 hover:border-orange-300 h-full"
            >
                {/* Media Preview if available */}
                {video.media_urls && video.media_urls.length > 0 ? (
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img 
                      src={video.media_urls[0]} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs px-3 py-1.5 rounded-full border-2 backdrop-blur-md flex items-center gap-1.5 font-semibold shadow-lg ${getStatusColor(video.status)}`}>
                        {getStatusIcon(video.status)}
                        {getStatusText(video.status)}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="p-2 bg-orange-500 rounded-lg inline-flex">
                        <Play className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="p-4 bg-orange-500 rounded-2xl inline-flex mb-3">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs px-3 py-1.5 rounded-full border-2 flex items-center gap-1.5 font-semibold ${getStatusColor(video.status)}`}>
                        {getStatusIcon(video.status)}
                        {getStatusText(video.status)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{video.title}</h3>

                  {video.caption && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3">{video.caption}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    {video.platform && (
                      <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium text-slate-700">{video.platform}</span>
                      </div>
                    )}

                    {video.publication_date && (
                      <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-slate-700">
                          {new Date(video.publication_date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                          {video.scheduled_time && ` • ${video.scheduled_time}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Script Section */}
                  {video.script ? (
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border-2 border-orange-200/60">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-orange-500 rounded-lg">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-slate-900">Script disponible</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedScript(video.script!)}
                          className="px-3 py-2.5 text-sm font-semibold text-orange-700 bg-white hover:bg-orange-50 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
                        >
                          <Eye className="w-4 h-4" />
                          Lire
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(video.script!.id, video.script!.title)}
                          className="px-3 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
                        >
                          <Download className="w-4 h-4" />
                          PDF
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-4 rounded-xl border-2 border-dashed border-slate-300">
                      <p className="text-sm text-slate-500 text-center">📝 Script en préparation...</p>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedVideo(video)}
                    className="w-full mt-4 px-4 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                  >
                    Voir tous les détails →
                  </button>
                </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Script Modal */}
      {selectedScript && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200/60">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500 rounded-xl shadow-md">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedScript.title}</h2>
                  <p className="text-sm text-slate-600">
                    Créé le {new Date(selectedScript.created_at).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPdf(selectedScript.id, selectedScript.title)}
                  className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all flex items-center gap-2 font-semibold shadow-md hover:shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  Télécharger PDF
                </button>
                <button
                  onClick={() => setSelectedScript(null)}
                  className="p-2.5 hover:bg-white/60 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)] bg-gradient-to-br from-slate-50 to-gray-50">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <style dangerouslySetInnerHTML={{ __html: `
                  .script-content * {
                    color: #334155 !important;
                  }
                  .script-content h1 {
                    color: #ea580c !important;
                    font-size: 2rem !important;
                    font-weight: 700 !important;
                    margin-bottom: 1rem !important;
                  }
                  .script-content h2 {
                    color: #f97316 !important;
                    font-size: 1.5rem !important;
                    font-weight: 700 !important;
                    margin-bottom: 0.75rem !important;
                  }
                  .script-content h3 {
                    color: #1e293b !important;
                    font-size: 1.25rem !important;
                    font-weight: 600 !important;
                    margin-bottom: 0.5rem !important;
                  }
                  .script-content p {
                    color: #475569 !important;
                    line-height: 1.75 !important;
                    margin-bottom: 1rem !important;
                  }
                  .script-content strong, .script-content b {
                    color: #0f172a !important;
                    font-weight: 600 !important;
                  }
                  .script-content ul, .script-content ol {
                    color: #475569 !important;
                    margin-left: 1.5rem !important;
                    margin-bottom: 1rem !important;
                  }
                  .script-content li {
                    color: #475569 !important;
                    margin-bottom: 0.5rem !important;
                  }
                  .script-content blockquote {
                    border-left: 4px solid #fb923c !important;
                    padding-left: 1rem !important;
                    font-style: italic !important;
                    color: #64748b !important;
                  }
                  .script-content code {
                    color: #ea580c !important;
                    background-color: #fff7ed !important;
                    padding: 0.125rem 0.25rem !important;
                    border-radius: 0.25rem !important;
                  }
                  .script-content a {
                    color: #2563eb !important;
                    text-decoration: underline !important;
                  }
                  .script-content em, .script-content i {
                    color: #64748b !important;
                    font-style: italic !important;
                  }
                ` }} />
                <div
                  className="script-content"
                  dangerouslySetInnerHTML={{ __html: selectedScript.content }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Video Details Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Video className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedVideo.title}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 inline-flex mt-1 ${getStatusColor(selectedVideo.status)}`}>
                    {getStatusIcon(selectedVideo.status)}
                    {getStatusText(selectedVideo.status)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-2 hover:bg-slate-100/80 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                {selectedVideo.caption && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Légende</h3>
                    <p className="text-slate-700 bg-slate-50/80 p-4 rounded-lg">{selectedVideo.caption}</p>
                  </div>
                )}

                {selectedVideo.platform && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Plateforme</h3>
                    <p className="text-slate-700 bg-blue-50/80 p-4 rounded-lg">{selectedVideo.platform}</p>
                  </div>
                )}

                {selectedVideo.publication_date && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Date de publication</h3>
                    <div className="flex items-center gap-2 bg-amber-50/80 p-4 rounded-lg">
                      <Calendar className="w-5 h-5 text-amber-600" />
                      <span className="text-slate-700 font-medium">
                        {new Date(selectedVideo.publication_date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {selectedVideo.scheduled_time && ` à ${selectedVideo.scheduled_time}`}
                      </span>
                    </div>
                  </div>
                )}

                {selectedVideo.hashtags && selectedVideo.hashtags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Hashtags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVideo.hashtags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-50/80 text-blue-700 text-sm rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedVideo.script && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Script associé</h3>
                    <div className="bg-gradient-to-br from-orange-50/80 to-amber-50/80 border border-orange-200/60 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-orange-600" />
                          <span className="font-medium text-slate-900">{selectedVideo.script.title}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedVideo(null);
                            setSelectedScript(selectedVideo.script!);
                          }}
                          className="flex-1 px-4 py-2 text-sm font-medium text-orange-600 bg-white/80 hover:bg-orange-50/80 border border-orange-300/60 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Voir le script
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(selectedVideo.script!.id, selectedVideo.script!.title)}
                          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600/90 hover:bg-green-700/90 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Télécharger PDF
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-200/60">
                  <p className="text-xs text-slate-500">
                    Créée le {new Date(selectedVideo.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

