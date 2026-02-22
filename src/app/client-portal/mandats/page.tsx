"use client";

import { useState, useEffect } from 'react';
import { useRequireClient } from '@/contexts/SimpleAuthContext';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import {
  Briefcase, Calendar, Clock, CheckCircle, AlertCircle,
  FileText, ArrowRight, ChevronRight, Eye, BarChart3,
  Clipboard, Calendar as CalendarIcon, Loader2, Download, X,
  CheckSquare, Activity, Check, PlayCircle
} from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/client-portal/PageHeader';
import { StatCard } from '@/components/client-portal/StatCard';
import { ModernCard } from '@/components/client-portal/ModernCard';

interface User {
  id: number;
  email: string;
  role_code: string;
  role_name: string;
  role_id: number; 
  client_id?: number;
  client_name?: string;
}

interface Mandat {
  id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status: 'en_cours' | 'termine' | 'en_attente' | 'annule';
  client_id: number;
  progression?: number;
  created_at: string;
  updated_at?: string;
  budget_hours?: number;
  used_hours?: number;
  deliverables?: string[];
  notes?: string;
}

interface Script {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface MandatTask {
  id: number;
  mandat_id: number;
  title: string;
  details: string | null;
  type: string;
  status: 'a_faire' | 'en_cours' | 'terminee' | 'bloquee';
  due_date: string | null;
  created_at: string;
  updated_at: string;
  script?: Script;
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
}

export default function MandatsPage() {
  // useRequireClient garantit que user existe ou redirige
  const { user } = useRequireClient() as { user: User, isLoading: boolean };
  const [mandats, setMandats] = useState<Mandat[]>([]);
  const [mandatTasks, setMandatTasks] = useState<{[key: number]: MandatTask[]}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMandat, setSelectedMandat] = useState<Mandat | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'tasks' | 'timeline' | 'videos' | 'calendrier'>('details');
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [editorialPosts, setEditorialPosts] = useState<EditorialPost[]>([]);
  const [loadingEditorialPosts, setLoadingEditorialPosts] = useState(false);

  // Group mandats by status
  const activeMandats = mandats.filter(m => m.status === 'en_cours');
  const completedMandats = mandats.filter(m => m.status === 'termine');
  const upcomingMandats = mandats.filter(m => m.status === 'en_attente');

  // Function to render video tasks with their scripts
  const renderVideoTasks = () => {
    if (!selectedMandat) return null;
    
    const videoTasks = mandatTasks[selectedMandat.id]?.filter(task => 
      task.type === 'video' && task.script
    ) || [];
    
    if (videoTasks.length === 0) {
      return (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <FileText className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Aucune vidéo avec script disponible</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {videoTasks.map(task => (
          <div key={task.id} className="bg-white border-2 border-slate-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
            {/* Task header */}
            <div className="p-5 border-b border-slate-50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-black text-slate-900 text-base tracking-tight truncate mb-1">{task.title}</h4>
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-black uppercase rounded border border-orange-100">
                      Vidéo
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-lg font-black uppercase tracking-widest border-2 ${
                      task.status === 'terminee' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      task.status === 'en_cours' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      task.status === 'bloquee' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                      'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {
                        task.status === 'terminee' ? 'Terminée' :
                        task.status === 'en_cours' ? 'En cours' :
                        task.status === 'bloquee' ? 'Bloquée' :
                        'À faire'
                      }
                    </span>
                    {task.due_date && (
                      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.due_date).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Script section */}
            <div className="p-5 bg-orange-50/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-0.5">Script associé</p>
                    <p className="text-sm font-black text-slate-900 truncate">{task.script?.title || 'Sans titre'}</p>
                    <p className="text-xs text-slate-500 mt-1">Créé le {task.script?.created_at ? new Date(task.script.created_at).toLocaleDateString('fr-FR') : '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {task.script && (
                    <>
                      <button
                        onClick={() => task.script && setSelectedScript(task.script)}
                        className="btn btn-secondary !py-2 !px-4 text-[10px] font-black uppercase tracking-widest bg-white"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => task.script && handleDownloadPdf(task.script.id, task.script.title || 'Script')}
                        className="btn btn-primary !from-emerald-500 !to-teal-600 !py-2 !px-4 text-[10px] font-black uppercase tracking-widest"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Function to render editorial calendar videos
  const renderEditorialVideos = () => {
    if (!selectedMandat || loadingEditorialPosts) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
          <p className="text-slate-600">Chargement des vidéos planifiées...</p>
        </div>
      );
    }
    
    if (editorialPosts.length === 0) {
      return (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <PlayCircle className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Aucune vidéo planifiée dans le calendrier éditorial</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {editorialPosts.map(post => (
          <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 hover:border-orange-300 hover:shadow-md transition-all overflow-hidden h-full">
            <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <div className="text-center">
                <div className="p-4 bg-orange-500 rounded-2xl inline-flex mb-3">
                  <PlayCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="absolute top-3 right-3">
                <span className="text-xs px-3 py-1.5 rounded-full border-2 flex items-center gap-1.5 font-semibold
                  bg-blue-100 text-blue-700 border-blue-200">
                  <Clock className="w-4 h-4" />
                  {post.status === 'published' ? 'Publiée' : 'Planifiée'}
                </span>
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{post.title}</h3>

              {post.caption && (
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{post.caption}</p>
              )}

              <div className="space-y-2 mb-4">
                {post.platform && (
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-slate-700">{post.platform}</span>
                  </div>
                )}

                {post.publication_date && (
                  <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-slate-700">
                      {new Date(post.publication_date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                      {post.scheduled_time && ` • ${post.scheduled_time}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Script Section */}
              {post.script ? (
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border-2 border-orange-200/60">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-slate-900">Script disponible</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedScript(post.script!)}
                      className="px-3 py-2.5 text-sm font-semibold text-orange-700 bg-white hover:bg-orange-50 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
                    >
                      <Eye className="w-4 h-4" />
                      Lire
                    </button>
                    <button
                      onClick={() => handleDownloadPdf(post.script!.id, post.script!.title)}
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
            </div>
          </div>
        ))}
      </div>
    );
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

  const fetchEditorialVideos = async (mandatId: number) => {
    if (!user?.client_id || !mandatId) return;
    
    setLoadingEditorialPosts(true);
    try {
      const { data: strategies, error: stratError } = await supabase
        .from('social_media_strategy')
        .select('id')
        .eq('client_id', user.client_id);
      
      if (stratError) throw stratError;
      if (!strategies || strategies.length === 0) {
        setEditorialPosts([]);
        return;
      }
      
      const strategyIds = strategies.map(s => s.id);
      
      const { data: calendars, error: calError } = await supabase
        .from('editorial_calendar')
        .select('id, strategy_id')
        .in('strategy_id', strategyIds);
      
      if (calError) throw calError;
      if (!calendars || calendars.length === 0) {
        setEditorialPosts([]);
        return;
      }
      
      const calendarIds = calendars.map(c => c.id);
      
      const { data: posts, error: postError } = await supabase
        .from('editorial_post')
        .select('*')
        .in('calendar_id', calendarIds)
        .order('publication_date', { ascending: true });
      
      if (postError) throw postError;
      
      const videoPosts = (posts || []).filter(post => 
        post.content_type && 
        (post.content_type.toLowerCase().includes('video') || 
         post.content_type.toLowerCase().includes('vidéo') ||
         post.content_type.toLowerCase().includes('short') ||
         post.content_type.toLowerCase().includes('reel'))
      );
      
      if (videoPosts.length === 0) {
        setEditorialPosts([]);
        return;
      }
      
      const postIds = videoPosts.map(p => p.id);
      
      const { data: scripts, error: scriptsError } = await supabase
        .from('video_script')
        .select('id, title, content, editorial_post_id, created_at, updated_at')
        .in('editorial_post_id', postIds);
      
      if (scriptsError) console.error('Error fetching scripts:', scriptsError);
      
      const postsWithScripts = videoPosts.map(post => {
        const relatedScript = (scripts || []).find(s => s.editorial_post_id === post.id);
        return {
          ...post,
          script: relatedScript || undefined
        };
      });
      
      setEditorialPosts(postsWithScripts);
    } catch (error) {
      console.error('Error fetching editorial videos:', error);
      setEditorialPosts([]);
    } finally {
      setLoadingEditorialPosts(false);
    }
  };

  useEffect(() => {
    if (selectedMandat && activeTab === 'calendrier') {
      fetchEditorialVideos(selectedMandat.id);
    }
  }, [selectedMandat, activeTab]);
  
  useEffect(() => {
    if (!user?.client_id) return;
    
    async function fetchMandats() {
      try {
        const { data: mandatsData, error } = await supabase
          .from('mandat')
          .select('*')
          .eq('client_id', user.client_id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading mandats:', error);
          return;
        }

        if (mandatsData) {
          setMandats(mandatsData);
          
          const tasksPromises = mandatsData.map(async (mandat) => {
            const { data: tasksData, error: tasksError } = await supabase
              .from('mandat_task')
              .select(`*, script:video_script(*)`)
              .eq('mandat_id', mandat.id)
              .order('created_at', { ascending: false });

            if (tasksError) {
              console.error(`Error loading tasks for mandat ${mandat.id}:`, tasksError);
              return [];
            }

            return tasksData || [];
          });

          const tasksResults = await Promise.all(tasksPromises);
          const tasksMap: {[key: number]: MandatTask[]} = {};
          
          mandatsData.forEach((mandat, index) => {
            tasksMap[mandat.id] = tasksResults[index];
          });

          setMandatTasks(tasksMap);
        }
      } catch (error) {
        console.error('Error fetching mandats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMandats();
  }, [user]);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <PageHeader
            title="Vos Mandats"
            subtitle="Suivi des projets en cours et historique des réalisations"
            icon={Briefcase}
            gradient="from-blue-500 to-indigo-600"
          />

      {/* Modern Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Projets en cours"
          value={activeMandats.length}
          subtitle={activeMandats.length === 1 ? "1 projet actif" : `${activeMandats.length} projets actifs`}
          icon={Clock}
          gradient="from-blue-500 to-indigo-600"
          delay={0.1}
        />
        <StatCard
          label="Projets terminés"
          value={completedMandats.length}
          subtitle="Complétés"
          icon={CheckCircle}
          gradient="from-green-500 to-emerald-600"
          delay={0.2}
        />
        <StatCard
          label="À venir"
          value={upcomingMandats.length}
          subtitle="En attente"
          icon={Calendar}
          gradient="from-amber-500 to-orange-600"
          delay={0.3}
        />
      </div>

      {/* Active Mandats Section */}
      {activeMandats.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">Projets en cours</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {activeMandats.map((mandat) => {
              const progress = mandat.progression || 0;
              const tasks = mandatTasks[mandat.id] || [];
              const completedTasks = tasks.filter(t => t.status === 'terminee').length;
              const taskProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
              
              const today = new Date();
              const endDate = mandat.end_date ? new Date(mandat.end_date) : null;
              const startDate = new Date(mandat.start_date);
              const totalDays = endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) : 0;
              const elapsedDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
              const remainingDays = endDate ? Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 3600 * 24)) : 0;
              const timeProgress = totalDays > 0 ? Math.min(Math.round((elapsedDays / totalDays) * 100), 100) : 0;
              
              return (
                <motion.div
                  key={mandat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <ModernCard title="Détails du mandat" className="h-full border-none shadow-sm !p-0 overflow-hidden bg-white">
                    <div className="p-6 sm:p-8">
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="min-w-0">
                          <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight truncate mb-1">
                            {mandat.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <Briefcase className="w-3.5 h-3.5" />
                            Mandat #{mandat.id}
                          </div>
                        </div>
                        <span className="flex-shrink-0 px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg border-2 border-blue-100">
                          En cours
                        </span>
                      </div>
                      
                      {mandat.description && (
                        <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">{mandat.description}</p>
                        </div>
                      )}
                      
                      <div className="space-y-5 mb-8">
                        {/* Global Progress */}
                        <div>
                          <div className="flex justify-between items-center mb-2.5">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Progression globale</span>
                            <span className="text-xs font-black text-blue-600">{progress}%</span>
                          </div>
                          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${progress}%` }} 
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" 
                            />
                          </div>
                        </div>
                        
                        {/* Tasks Progress */}
                        {tasks.length > 0 && (
                          <div>
                            <div className="flex justify-between items-center mb-2.5">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tâches terminées</span>
                              <span className="text-xs font-black text-emerald-600">{completedTasks}/{tasks.length}</span>
                            </div>
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${taskProgress}%` }} 
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full" 
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* Time Progress */}
                        {endDate && (
                          <div>
                            <div className="flex justify-between items-center mb-2.5">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Échéance</span>
                              <span className={`text-[10px] font-black uppercase tracking-tight px-2 py-0.5 rounded ${
                                remainingDays < 7 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                              }`}>
                                {remainingDays > 0 ? `${remainingDays} jours restants` : 'Échéance passée'}
                              </span>
                            </div>
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${timeProgress}%` }} 
                                className={`h-full rounded-full ${
                                  timeProgress > 90 ? 'bg-red-500' :
                                  timeProgress > 75 ? 'bg-orange-500' :
                                  'bg-blue-500'
                                }`}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-8">
                        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Début</p>
                          <p className="text-sm font-black text-slate-900">
                            {new Date(mandat.start_date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        
                        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Fin prévue</p>
                          <p className="text-sm font-black text-slate-900">
                            {mandat.end_date ? new Date(mandat.end_date).toLocaleDateString('fr-FR') : 'Non définie'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-6 py-4 sm:px-8 sm:py-5 bg-slate-50/50 border-t-2 border-slate-50 flex items-center justify-between gap-4">
                      <div className="flex -space-x-2">
                        {tasks.length > 0 ? (
                          <>
                            {tasks.slice(0, 3).map((_, i) => (
                              <div
                                key={i}
                                className={`w-8 h-8 rounded-xl border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-sm ${
                                  ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500'][i % 3]
                                }`}
                              >
                                T
                              </div>
                            ))}
                            {tasks.length > 3 && (
                              <div className="w-8 h-8 rounded-xl border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600 shadow-sm">
                                +{tasks.length - 3}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aucune tâche</div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => setSelectedMandat(mandat)}
                        className="btn btn-primary !from-blue-500 !to-indigo-600 !py-2.5 !px-5 text-xs font-black uppercase tracking-widest shadow-xl"
                      >
                        Détails
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </ModernCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Mandats Section */}
      {completedMandats.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">Projets terminés</h2>
          </div>

          <div className="hidden lg:block">
            <div className="table-container border-none shadow-sm overflow-hidden bg-white">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-100">
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Projet</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Période</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Statut</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completedMandats.map((mandat, i) => (
                    <motion.tr
                      key={mandat.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Briefcase className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-black text-slate-900 block truncate">{mandat.title}</span>
                            {mandat.description && (
                              <p className="text-xs font-bold text-slate-400 uppercase truncate mt-0.5">{mandat.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-xs font-black text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(mandat.start_date).toLocaleDateString('fr-FR')} 
                          <span className="text-slate-300">→</span>
                          {mandat.end_date ? new Date(mandat.end_date).toLocaleDateString('fr-FR') : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg bg-emerald-50 text-emerald-700 border-2 border-emerald-100">
                          <CheckCircle className="w-3.5 h-3.5" /> Terminé
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => setSelectedMandat(mandat)}
                          className="btn btn-secondary !p-2 rounded-xl group-hover:bg-white"
                          title="Voir détails"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vue mobile pour mandats terminés */}
          <div className="lg:hidden space-y-3">
            {completedMandats.map((mandat, i) => (
              <motion.div
                key={mandat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedMandat(mandat)}
                className="bg-white rounded-2xl p-4 border-2 border-slate-100 shadow-sm active:scale-[0.98] transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-900 truncate">{mandat.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                      Fini le {mandat.end_date ? new Date(mandat.end_date).toLocaleDateString('fr-FR') : 'N/A'}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-lg border border-emerald-100">
                    Terminé
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                    <Calendar className="w-3 h-3" />
                    {new Date(mandat.start_date).toLocaleDateString('fr-FR')} - {mandat.end_date ? new Date(mandat.end_date).toLocaleDateString('fr-FR') : 'N/A'}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Upcoming Mandats Section */}
      {upcomingMandats.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">Projets à venir</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingMandats.map((mandat, i) => (
              <motion.div
                key={mandat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <ModernCard title="Détails du mandat" className="h-full !p-0 border-none shadow-sm overflow-hidden bg-white">
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight truncate">{mandat.title}</h3>
                      <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase rounded-lg border border-amber-100">
                        À venir
                      </span>
                    </div>

                    {mandat.description && (
                      <div className="bg-slate-50 rounded-xl p-4 mb-6">
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{mandat.description}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t-2 border-slate-50">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-amber-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Début prévu</span>
                      </div>
                      <span className="text-sm font-black text-slate-900">
                        {new Date(mandat.start_date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-slate-50/50 border-t-2 border-slate-50">
                    <button
                      onClick={() => setSelectedMandat(mandat)}
                      className="btn btn-secondary w-full text-xs font-black uppercase tracking-widest"
                    >
                      Voir détails
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </ModernCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Mandat Details Modal */}
      {selectedMandat && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full h-full sm:h-auto sm:max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 text-white relative flex-shrink-0">
              <button
                onClick={() => setSelectedMandat(null)}
                aria-label="Fermer la fenêtre"
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-all active:scale-95"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="pr-12">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/20">
                    Mandat #{selectedMandat.id}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/20 ${
                    selectedMandat.status === 'en_cours' ? 'bg-blue-500/50' : 
                    selectedMandat.status === 'termine' ? 'bg-emerald-500/50' : 'bg-amber-500/50'
                  }`}>
                    {selectedMandat.status === 'en_cours' ? 'En cours' : 
                     selectedMandat.status === 'termine' ? 'Terminé' : 'À venir'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight leading-tight">{selectedMandat.title}</h2>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Tabs Navigation */}
              <div className="flex items-center border-b-2 border-slate-100 bg-slate-50/50 sticky top-0 z-10 overflow-x-auto scrollbar-hide px-4">
                {[
                  { id: 'details', label: 'Détails', icon: FileText },
                  { id: 'tasks', label: 'Tâches', icon: CheckSquare },
                  { id: 'videos', label: 'Vidéos', icon: PlayCircle },
                  { id: 'calendrier', label: 'Calendrier', icon: Calendar },
                  { id: 'timeline', label: 'Timeline', icon: Activity }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      aria-selected={isActive}
                      role="tab"
                      className={`flex items-center gap-2 px-5 py-4 border-b-[3px] font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                        isActive 
                          ? 'border-blue-600 text-blue-700 bg-blue-50/50' 
                          : 'border-transparent text-slate-500 hover:text-blue-600 hover:bg-slate-100/50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              
              {/* Tab Content */}
              <div className="p-6 sm:p-8">
                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-8 animate-fade-in">
                    {selectedMandat.description && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-1 h-4 bg-orange-500 rounded-full" />
                          Description
                        </h3>
                        <div className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-100">
                          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{selectedMandat.description}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Date de début</p>
                        <p className="text-base font-black text-slate-900">
                          {new Date(selectedMandat.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      
                      <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Date de fin</p>
                        <p className="text-base font-black text-slate-900">
                          {selectedMandat.end_date 
                            ? new Date(selectedMandat.end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) 
                            : 'Non définie'}
                        </p>
                      </div>
                    </div>
                    
                    {selectedMandat.status === 'en_cours' && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-1 h-4 bg-blue-500 rounded-full" />
                          Progression
                        </h3>
                        <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-100">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-black text-slate-500 uppercase">Avancement global</span>
                            <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">{selectedMandat.progression || 0}%</span>
                          </div>
                          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${selectedMandat.progression || 0}%` }}
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-inner" 
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {(selectedMandat.budget_hours || selectedMandat.used_hours) && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-1 h-4 bg-purple-500 rounded-full" />
                          Gestion du temps
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight mb-1.5">Budget</p>
                            <p className="text-lg font-black text-slate-900">{selectedMandat.budget_hours || 0}h</p>
                          </div>
                          
                          <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100 text-center">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-tight mb-1.5">Utilisé</p>
                            <p className="text-lg font-black text-blue-700">{selectedMandat.used_hours || 0}h</p>
                          </div>
                          
                          <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-100 text-center">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-tight mb-1.5">Reste</p>
                            <p className="text-lg font-black text-emerald-700">
                              {selectedMandat.budget_hours && selectedMandat.used_hours
                                ? Math.max(0, selectedMandat.budget_hours - selectedMandat.used_hours)
                                : 'N/A'}h
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedMandat.deliverables && selectedMandat.deliverables.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                          Livrables
                        </h3>
                        <div className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-100">
                          <ul className="space-y-3">
                            {selectedMandat.deliverables.map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                </div>
                                <span className="text-sm font-bold text-slate-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    {selectedMandat.notes && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-1 h-4 bg-amber-500 rounded-full" />
                          Notes internes
                        </h3>
                        <div className="bg-amber-50/50 rounded-2xl p-5 border-2 border-amber-100 border-dashed">
                          <p className="text-slate-600 text-sm italic leading-relaxed">{selectedMandat.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Tasks Tab */}
                {activeTab === 'tasks' && (
                  <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1 h-4 bg-blue-500 rounded-full" />
                        Tâches du projet
                      </h3>
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-lg border border-slate-200">
                        {mandatTasks[selectedMandat.id]?.length || 0} tâches
                      </span>
                    </div>
                    
                    {mandatTasks[selectedMandat.id] && mandatTasks[selectedMandat.id].length > 0 ? (
                      <div className="space-y-4">
                        {mandatTasks[selectedMandat.id].map(task => (
                          <div key={task.id} className="bg-white border-2 border-slate-100 p-5 rounded-2xl shadow-sm hover:border-blue-200 transition-all group">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                                  task.status === 'terminee' ? 'bg-emerald-50 text-emerald-600' :
                                  task.status === 'en_cours' ? 'bg-blue-50 text-blue-600' :
                                  task.status === 'bloquee' ? 'bg-rose-50 text-rose-600' :
                                  'bg-slate-50 text-slate-400'
                                }`}>
                                  {task.status === 'terminee' ? <Check className="w-5 h-5" /> :
                                   task.status === 'en_cours' ? <Clock className="w-5 h-5" /> :
                                   task.status === 'bloquee' ? <AlertCircle className="w-5 h-5" /> :
                                   <Clipboard className="w-5 h-5" />}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                    <h4 className={`font-black text-sm sm:text-base tracking-tight truncate ${
                                      task.status === 'terminee' ? 'text-slate-400 line-through' : 'text-slate-900'
                                    }`}>
                                      {task.title}
                                    </h4>
                                    {task.type && (
                                      <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-black uppercase rounded border border-orange-100">
                                        {task.type}
                                      </span>
                                    )}
                                  </div>
                                  {task.details && (
                                    <p className="text-xs font-bold text-slate-500 leading-relaxed line-clamp-2">{task.details}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 pl-14 sm:pl-0">
                                {task.due_date && (
                                  <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Échéance</p>
                                    <p className="text-xs font-black text-slate-700">
                                      {new Date(task.due_date).toLocaleDateString('fr-FR')}
                                    </p>
                                  </div>
                                )}
                                <span className={`text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest border-2 ${
                                  task.status === 'terminee' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                  task.status === 'en_cours' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                  task.status === 'bloquee' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                  'bg-slate-50 text-slate-500 border-slate-100'
                                }`}>
                                  {task.status === 'terminee' ? 'Terminée' :
                                   task.status === 'en_cours' ? 'En cours' :
                                   task.status === 'bloquee' ? 'Bloquée' :
                                   'À faire'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                          <Clipboard className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Aucune tâche disponible</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Videos Tab */}
                {activeTab === 'videos' && (
                  <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1 h-4 bg-orange-500 rounded-full" />
                        <PlayCircle className="w-5 h-5 text-orange-500" />
                        Vidéos du projet
                      </h3>
                    </div>

                    {/* Videos and scripts section */}
                    {renderVideoTasks()}
                  </div>
                )}
                
                {/* Timeline Tab */}
                {activeTab === 'timeline' && (
                  <div className="animate-fade-in">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-8">
                      <div className="w-1 h-4 bg-orange-500 rounded-full" />
                      Timeline du projet
                    </h3>
                    
                    <div className="relative pl-8 border-l-4 border-slate-100 space-y-10 py-2">
                      <div className="relative">
                        <div className="absolute -left-[38px] top-0 w-8 h-8 rounded-xl bg-emerald-500 border-4 border-white flex items-center justify-center shadow-lg">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-100">
                          <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm">Début du projet</h4>
                          <p className="text-xs font-bold text-slate-500 uppercase mt-1">
                            {new Date(selectedMandat.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      {selectedMandat.status === 'en_cours' && (
                        <div className="relative">
                          <div className="absolute -left-[38px] top-0 w-8 h-8 rounded-xl bg-blue-500 border-4 border-white flex items-center justify-center shadow-lg">
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-blue-50 p-5 rounded-2xl border-2 border-blue-100">
                            <h4 className="font-black text-blue-900 uppercase tracking-tight text-sm">En cours de réalisation</h4>
                            <p className="text-xs font-bold text-blue-600 uppercase mt-1">
                              Progression : {selectedMandat.progression || 0}%
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedMandat.status === 'termine' && (
                        <div className="relative">
                          <div className="absolute -left-[38px] top-0 w-8 h-8 rounded-xl bg-emerald-600 border-4 border-white flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-emerald-50 p-5 rounded-2xl border-2 border-emerald-100">
                            <h4 className="font-black text-emerald-900 uppercase tracking-tight text-sm">Projet terminé</h4>
                            <p className="text-xs font-bold text-emerald-600 uppercase mt-1">
                              {selectedMandat.end_date ? 
                                new Date(selectedMandat.end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 
                                'Date non spécifiée'}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedMandat.status !== 'termine' && selectedMandat.end_date && (
                        <div className="relative">
                          <div className="absolute -left-[38px] top-0 w-8 h-8 rounded-xl bg-slate-300 border-4 border-white flex items-center justify-center shadow-lg">
                            <Calendar className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-100 border-dashed">
                            <h4 className="font-black text-slate-700 uppercase tracking-tight text-sm">Échéance prévue</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase mt-1">
                              {new Date(selectedMandat.end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 sm:p-8 border-t-2 border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 flex-shrink-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] hidden sm:block">
                Urstory Client Portal
              </p>
              <button
                className="btn btn-secondary !px-10 w-full sm:w-auto font-black uppercase tracking-widest text-xs"
                onClick={() => setSelectedMandat(null)}
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Script Modal */}
      {selectedScript && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 border-b-2 border-slate-50 gap-4 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shadow-lg shadow-orange-500/10 flex-shrink-0">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight truncate">{selectedScript.title}</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                    Créé le {new Date(selectedScript.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => handleDownloadPdf(selectedScript.id, selectedScript.title)}
                  className="btn btn-primary !from-emerald-500 !to-teal-600 flex-1 sm:flex-none !py-2.5 !px-5 text-xs font-black uppercase tracking-widest shadow-xl"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden xs:inline">Télécharger</span>
                  <span className="xs:hidden">PDF</span>
                </button>
                <button
                  onClick={() => setSelectedScript(null)}
                  className="btn btn-secondary !p-2.5 rounded-xl flex-shrink-0 bg-white"
                  aria-label="Fermer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar flex-1 bg-white">
              <div 
                className="prose prose-sm sm:prose-base max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-strong:font-black prose-ul:text-slate-600 prose-ol:text-slate-600 prose-li:font-medium"
                dangerouslySetInnerHTML={{ __html: selectedScript.content }}
              />
            </div>

            <div className="p-6 border-t-2 border-slate-50 bg-slate-50/50 flex justify-end flex-shrink-0">
              <button
                onClick={() => setSelectedScript(null)}
                className="btn btn-secondary !px-10 w-full sm:w-auto font-black uppercase tracking-widest text-xs"
              >
                Fermer l'aperçu
              </button>
            </div>
          </motion.div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
