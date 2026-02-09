// @ts-nocheck
"use client";

import { useState, useEffect } from 'react';
import { useRequireClient } from '@/contexts/SimpleAuthContext';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import {
  Target, FileText, Eye, ArrowRight, CheckCircle, Clock, 
  CalendarCheck, ChevronRight, Sparkles, AlertCircle, Download
} from 'lucide-react';
import Link from 'next/link';
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
  client_name?: string;
}

interface Strategy {
  id: number;
  version: string;
  client_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  contexte_general?: string;
  objectifs_business?: string;
  objectifs_reseaux?: string;
  plateformes?: string[];
  ton_voix?: string;
  frequence_calendrier?: string;
  valeurs_messages?: string;
}

export default function StrategiesPage() {
  // useRequireClient garantit que user existe ou redirige
  const { user } = useRequireClient() as { user: User, isLoading: boolean };
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

  useEffect(() => {
    // useRequireClient guarantees user exists or redirects
    if (!user || !user.client_id) return;
    
    async function fetchStrategies() {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('social_media_strategy')
          .select('*')
          .eq('client_id', user.client_id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setStrategies(data || []);
      } catch (error) {
        console.error('Error fetching strategies:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchStrategies();
    
    // user! est utilisé ici car useRequireClient garantit que user existe
    // sinon il aurait redirigé vers la page de login
  }, [user!.client_id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (strategies.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Stratégies"
          description="Vos stratégies de communication social media"
          icon={Target}
          iconGradient="from-orange-500 to-orange-600"
        />
        <EmptyState
          icon={Target}
          title="Aucune stratégie disponible"
          description="Vous n'avez pas encore de stratégie social media. Contactez notre équipe pour en créer une adaptée à vos besoins."
          iconGradient="from-orange-500 to-orange-600"
        />
      </div>
    );
  }

  // Group strategies by status
  const activeStrategies = strategies.filter(s => s.status === 'actif');
  const inactiveStrategies = strategies.filter(s => s.status !== 'actif');

  return (
    <div className="space-y-6">
      {/* Modern Header */}
      <PageHeader
        title="Vos Stratégies Social Media"
        description="Consultez et téléchargez vos stratégies de communication"
        icon={Target}
        iconGradient="from-orange-500 to-orange-600"
        stats={[
          { label: 'Total', value: strategies.length },
          { label: 'Actives', value: activeStrategies.length, color: 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' }
        ]}
      />

      {/* Active Strategy */}
      {activeStrategies.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Stratégie active</h2>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-1">
            {activeStrategies.slice(0, 1).map(strategy => (
              <ModernCard key={strategy.id} className="overflow-hidden border-2 border-green-300" hover={true}>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-green-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-sm">Active</span>
                        <span className="text-slate-600 text-sm font-medium">Version {strategy.version}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Stratégie Social Media</h3>
                      <p className="text-slate-600">
                        Dernière mise à jour: {new Date(strategy.updated_at || strategy.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <Link href={`/client-portal/strategies/${strategy.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 bg-white text-green-600 rounded-xl shadow-sm hover:shadow-md transition-all border border-green-200 cursor-pointer"
                      >
                        <Eye className="w-5 h-5" />
                      </motion.div>
                    </Link>
                  </div>
                </div>

                <div className="p-6">
                  {/* Strategy Platforms */}
                  {strategy.plateformes && strategy.plateformes.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-slate-900 mb-3">Plateformes</h4>
                      <div className="flex flex-wrap gap-2">
                        {strategy.plateformes.map((platform, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs font-semibold rounded-full">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Preview */}
                  <div className="space-y-4">
                    {strategy.contexte_general && (
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Contexte général</h4>
                        <p className="text-slate-600 line-clamp-2">{strategy.contexte_general}</p>
                      </div>
                    )}
                    {strategy.objectifs_business && (
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Objectifs business</h4>
                        <p className="text-slate-600 line-clamp-2">{strategy.objectifs_business}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                    <Link href={`/client-portal/strategies/${strategy.id}`} className="flex-1 sm:flex-initial">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 text-orange-600 font-semibold hover:text-orange-700 py-2 cursor-pointer"
                      >
                        Voir les détails <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </Link>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all text-sm font-semibold shadow-sm w-full sm:w-auto"
                    >
                      <Download className="w-4 h-4" /> Télécharger PDF
                    </motion.button>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        </div>
      )}

      {/* Other Strategies */}
      {inactiveStrategies.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Anciennes versions</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {inactiveStrategies.map((strategy) => (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <ModernCard className="h-full border-2 border-transparent hover:border-orange-300 group" hover={true}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                          Version {strategy.version}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                        Stratégie Social Media
                      </h3>
                      <p className="text-sm text-slate-600 mt-1 font-medium">
                        {new Date(strategy.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  {strategy.plateformes && strategy.plateformes.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1.5">
                        {strategy.plateformes.slice(0, 3).map((p, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                            {p}
                          </span>
                        ))}
                        {strategy.plateformes.length > 3 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                            +{strategy.plateformes.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-4">
                    <Link href={`/client-portal/strategies/${strategy.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl transition-colors font-semibold cursor-pointer"
                      >
                        <Eye className="w-4 h-4" /> Voir les détails
                      </motion.div>
                    </Link>
                  </div>
                </ModernCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Strategy Comparison Section */}
      {strategies.length > 1 && (
        <ModernCard>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Comparaison des versions</h3>
          <p className="text-slate-600 mb-6">Comparez les différentes versions de votre stratégie social media pour comprendre son évolution.</p>
          
          <Link href="/client-portal/strategies/compare">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between p-5 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-slate-900">Comparer les stratégies</span>
              </div>
              <ChevronRight className="w-5 h-5 text-orange-600" />
            </motion.div>
          </Link>
        </ModernCard>
      )}

      {/* Strategy View Modal - Enhanced Professional Version */}
      {selectedStrategy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-6xl w-full my-8"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
              <div className="flex justify-between items-start">
              <div>
                  <h2 className="text-3xl font-bold mb-2">Stratégie Social Media</h2>
                  <div className="flex items-center gap-4 text-sm opacity-90">
                    <CalendarCheck className="w-4 h-4" />
                    <span>Version {selectedStrategy.version}</span>
                    <span>•</span>
                    <span>Dernière mise à jour: {new Date(selectedStrategy.updated_at || selectedStrategy.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
              </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Exporter PDF"
                  >
                    <Download className="w-5 h-5" />
                  </button>
              <button
                onClick={() => setSelectedStrategy(null)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-8">
              {/* 1. Contexte & Objectifs */}
              {(selectedStrategy.contexte_general || selectedStrategy.objectifs_business || selectedStrategy.objectifs_reseaux) && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-orange-500 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">1</span>
                    Contexte & Objectifs Business
                  </h3>
                  <div className="space-y-6">
                    {selectedStrategy.contexte_general && (
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border-2 border-gray-300 shadow-md">
                        <h4 className="text-sm font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Contexte général
                        </h4>
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">{selectedStrategy.contexte_general}</p>
                      </div>
                    )}
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      {selectedStrategy.objectifs_business && (
                        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 p-6 rounded-2xl border-3 border-green-400 shadow-lg transform transition-transform hover:scale-105">
                          <h4 className="text-sm font-bold text-green-800 uppercase mb-3 flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                            Objectifs business
                          </h4>
                          <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">{selectedStrategy.objectifs_business}</p>
                        </div>
                      )}
                      
                      {selectedStrategy.objectifs_reseaux && (
                        <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 p-6 rounded-2xl border-3 border-orange-400 shadow-lg transform transition-transform hover:scale-105">
                          <h4 className="text-sm font-bold text-orange-800 uppercase mb-3 flex items-center gap-2">
                            <span className="w-3 h-3 bg-orange-600 rounded-full"></span>
                            Objectifs réseaux sociaux (SMART)
                          </h4>
                          <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">{selectedStrategy.objectifs_reseaux}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Audience & Plateformes */}
              {((selectedStrategy.cibles) || (selectedStrategy.plateformes && selectedStrategy.plateformes.length > 0) || (selectedStrategy.personas && selectedStrategy.personas.length > 0)) && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-purple-500 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">2</span>
                    Audience & Personas
                  </h3>
                  <div className="space-y-6">
                    {selectedStrategy.cibles && (
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-purple-300 shadow-md">
                        <h4 className="text-sm font-bold text-purple-800 uppercase mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                          Cibles principales
                        </h4>
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">{selectedStrategy.cibles}</p>
                      </div>
                    )}

                    {selectedStrategy.personas && selectedStrategy.personas.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 bg-pink-600 rounded-full"></span>
                          Personas Marketing
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {selectedStrategy.personas.map((persona: any, index: number) => (
                            <div key={index} className="bg-gradient-to-br from-pink-100 via-rose-100 to-red-100 p-6 rounded-2xl border-3 border-pink-400 shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                  {persona.nom.charAt(0)}
                                </div>
                                <div>
                                  <h5 className="text-lg font-bold text-pink-900">{persona.nom}</h5>
                                  {persona.age && <p className="text-xs text-pink-700 font-semibold">{persona.age}</p>}
                                </div>
                              </div>
                              <div className="space-y-3 text-sm">
                                {persona.besoins && (
                                  <div className="bg-white/60 p-3 rounded-lg">
                                    <span className="font-bold text-pink-800 flex items-center gap-1">
                                      <span className="text-lg">🎯</span> Besoins:
                                    </span>
                                    <p className="text-gray-900 mt-1">{persona.besoins}</p>
                                  </div>
                                )}
                                {persona.problemes && (
                                  <div className="bg-white/60 p-3 rounded-lg">
                                    <span className="font-bold text-red-800 flex items-center gap-1">
                                      <span className="text-lg">⚠️</span> Problèmes:
                                    </span>
                                    <p className="text-gray-900 mt-1">{persona.problemes}</p>
                                  </div>
                                )}
                                {persona.attentes && (
                                  <div className="bg-white/60 p-3 rounded-lg">
                                    <span className="font-bold text-purple-800 flex items-center gap-1">
                                      <span className="text-lg">✨</span> Attentes:
                                    </span>
                                    <p className="text-gray-900 mt-1">{persona.attentes}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedStrategy.plateformes && selectedStrategy.plateformes.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          Plateformes sociales
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {selectedStrategy.plateformes.map((platform: string, idx: number) => (
                            <span key={idx} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-bold text-base shadow-lg transform transition-all hover:scale-110 hover:shadow-xl">
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. Positionnement & Identité */}
              {(selectedStrategy.ton_voix || selectedStrategy.guidelines_visuelles || selectedStrategy.valeurs_messages) && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-indigo-500 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">3</span>
                    Positionnement & Identité de Communication
                  </h3>
                  <div className="space-y-6">
                    {selectedStrategy.ton_voix && (
                      <div className="bg-gradient-to-br from-purple-100 via-violet-100 to-purple-200 p-6 rounded-2xl border-3 border-purple-400 shadow-xl">
                        <h4 className="text-sm font-bold text-purple-800 uppercase mb-3 flex items-center gap-2">
                          <span className="text-xl">🎤</span>
                          Ton / Voix de la marque
                        </h4>
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">{selectedStrategy.ton_voix}</p>
                      </div>
                    )}
                    
                    {selectedStrategy.guidelines_visuelles && (
                      <div className="bg-gradient-to-br from-pink-100 via-fuchsia-100 to-pink-200 p-6 rounded-2xl border-3 border-pink-400 shadow-xl">
                        <h4 className="text-sm font-bold text-pink-800 uppercase mb-3 flex items-center gap-2">
                          <span className="text-xl">🎨</span>
                          Guidelines visuelles
                        </h4>
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">{selectedStrategy.guidelines_visuelles}</p>
                      </div>
                    )}
                    
                    {selectedStrategy.valeurs_messages && (
                      <div className="bg-gradient-to-br from-yellow-100 via-amber-100 to-yellow-200 p-6 rounded-2xl border-3 border-yellow-400 shadow-xl">
                        <h4 className="text-sm font-bold text-yellow-800 uppercase mb-3 flex items-center gap-2">
                          <span className="text-xl">💎</span>
                          Valeurs & messages clés
                        </h4>
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">{selectedStrategy.valeurs_messages}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4. Piliers de contenu */}
              {selectedStrategy.piliers_contenu && selectedStrategy.piliers_contenu.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-teal-500 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">4</span>
                    Piliers de Contenu
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedStrategy.piliers_contenu.map((pilier: any, index: number) => (
                      <div key={index} className="relative bg-gradient-to-br from-cyan-100 via-teal-100 to-emerald-100 p-6 rounded-2xl border-3 border-teal-400 shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200 rounded-full opacity-20 -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">{['📱', '💡', '🎯', '🚀', '⭐', '🔥'][index % 6]}</span>
                            <h4 className="text-xl font-bold text-teal-900">{pilier.titre}</h4>
                          </div>
                          <p className="text-gray-900 leading-relaxed font-medium mb-3">{pilier.description}</p>
                          {pilier.exemples && (
                            <div className="mt-4 pt-4 border-t-2 border-teal-300 bg-white/50 p-3 rounded-lg">
                              <span className="text-xs font-bold text-teal-800 uppercase flex items-center gap-1">
                                <span>📝</span> Exemples:
                              </span>
                              <p className="text-sm text-gray-900 mt-2 font-medium">{pilier.exemples}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Formats & Rythme */}
              {((selectedStrategy.formats_envisages && selectedStrategy.formats_envisages.length > 0) || selectedStrategy.frequence_calendrier || selectedStrategy.workflow_roles) && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-green-500 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">5</span>
                    Formats & Rythme de Publication
                  </h3>
                  <div className="space-y-6">
                    {selectedStrategy.formats_envisages && selectedStrategy.formats_envisages.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2">
                          <span className="text-xl">📊</span>
                          Formats envisagés
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {selectedStrategy.formats_envisages.map((format: string, index: number) => (
                            <span key={index} className="px-5 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl font-bold text-sm shadow-lg transform transition-all hover:scale-110">
                              {format}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedStrategy.frequence_calendrier && (
                      <div className="bg-gradient-to-br from-blue-100 via-sky-100 to-blue-200 p-6 rounded-2xl border-3 border-blue-400 shadow-xl">
                        <h4 className="text-sm font-bold text-blue-800 uppercase mb-3 flex items-center gap-2">
                          <span className="text-xl">📅</span>
                          Fréquence & calendrier éditorial
                        </h4>
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">{selectedStrategy.frequence_calendrier}</p>
                      </div>
                    )}
                    
                    {selectedStrategy.workflow_roles && (
                      <div className="bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 p-6 rounded-2xl border-3 border-slate-400 shadow-xl">
                        <h4 className="text-sm font-bold text-slate-800 uppercase mb-3 flex items-center gap-2">
                          <span className="text-xl">⚙️</span>
                          Workflow & rôles
                        </h4>
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">{selectedStrategy.workflow_roles}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 6. Audit & Concurrence */}
              {(selectedStrategy.audit_profils || selectedStrategy.benchmark_concurrents) && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-red-500 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">6</span>
                    Audit & Analyse Concurrentielle
                  </h3>
                  <div className="space-y-6">
                    {selectedStrategy.audit_profils && (
                      <div className="bg-gradient-to-br from-red-100 via-rose-100 to-red-200 p-6 rounded-2xl border-3 border-red-400 shadow-xl">
                        <h4 className="text-sm font-bold text-red-800 uppercase mb-3 flex items-center gap-2">
                          <span className="text-xl">🔍</span>
                          Audit des profils existants
                        </h4>
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">{selectedStrategy.audit_profils}</p>
                      </div>
                    )}
                    
                    {selectedStrategy.benchmark_concurrents && (
                      <div className="bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200 p-6 rounded-2xl border-3 border-pink-400 shadow-xl">
                        <h4 className="text-sm font-bold text-pink-800 uppercase mb-3 flex items-center gap-2">
                          <span className="text-xl">📊</span>
                          Veille / Benchmark concurrents
                        </h4>
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">{selectedStrategy.benchmark_concurrents}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 7. KPIs & Suivi */}
              {((selectedStrategy.kpis && selectedStrategy.kpis.length > 0) || selectedStrategy.cadre_suivi) && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-amber-500 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">7</span>
                    KPIs & Suivi
                  </h3>
                  <div className="space-y-6">
                    {selectedStrategy.kpis && selectedStrategy.kpis.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2">
                          <span className="text-xl">📈</span>
                          Indicateurs de performance
                        </h4>
                        <div className="overflow-x-auto rounded-2xl shadow-xl border-3 border-amber-400">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gradient-to-r from-amber-400 to-orange-500">
                                <th className="border-2 border-amber-600 px-6 py-4 text-left font-bold text-white text-sm uppercase">🎯 KPI</th>
                                <th className="border-2 border-amber-600 px-6 py-4 text-left font-bold text-white text-sm uppercase">🎖️ Objectif</th>
                                <th className="border-2 border-amber-600 px-6 py-4 text-left font-bold text-white text-sm uppercase">⏱️ Périodicité</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {selectedStrategy.kpis.map((kpi: any, index: number) => (
                                <tr key={index} className="hover:bg-amber-50 transition-colors">
                                  <td className="border-2 border-amber-200 px-6 py-4 font-bold text-gray-900">{kpi.nom}</td>
                                  <td className="border-2 border-amber-200 px-6 py-4 text-gray-900 font-medium">{kpi.objectif}</td>
                                  <td className="border-2 border-amber-200 px-6 py-4 text-gray-900 font-medium">{kpi.periodicite}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {selectedStrategy.cadre_suivi && (
                      <div className="bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-200 p-6 rounded-2xl border-3 border-amber-400 shadow-xl">
                        <h4 className="text-sm font-bold text-amber-800 uppercase mb-3 flex items-center gap-2">
                          <span className="text-xl">📋</span>
                          Cadre de suivi
                        </h4>
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">{selectedStrategy.cadre_suivi}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 8. Canaux & Mix Média (PESO) */}
              {(selectedStrategy.owned_media || selectedStrategy.shared_media || selectedStrategy.paid_media || selectedStrategy.earned_media) && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-rose-500 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">8</span>
                    Canaux & Mix Média (Modèle PESO)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedStrategy.owned_media && (
                      <div className="relative bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-100 p-6 rounded-2xl border-4 border-blue-500 shadow-2xl transform transition-all hover:scale-105 overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-300 rounded-full opacity-30 -mr-20 -mt-20"></div>
                        <div className="relative z-10">
                          <h4 className="font-bold text-blue-900 mb-3 text-xl flex items-center gap-2">
                            <span className="text-3xl">📱</span> Owned Media
                          </h4>
                          <p className="text-gray-900 whitespace-pre-wrap leading-relaxed font-medium">{selectedStrategy.owned_media}</p>
                        </div>
                      </div>
                    )}
                    {selectedStrategy.shared_media && (
                      <div className="relative bg-gradient-to-br from-green-200 via-emerald-100 to-teal-100 p-6 rounded-2xl border-4 border-green-500 shadow-2xl transform transition-all hover:scale-105 overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-green-300 rounded-full opacity-30 -mr-20 -mt-20"></div>
                        <div className="relative z-10">
                          <h4 className="font-bold text-green-900 mb-3 text-xl flex items-center gap-2">
                            <span className="text-3xl">👥</span> Shared Media
                          </h4>
                          <p className="text-gray-900 whitespace-pre-wrap leading-relaxed font-medium">{selectedStrategy.shared_media}</p>
                        </div>
                      </div>
                    )}
                    {selectedStrategy.paid_media && (
                      <div className="relative bg-gradient-to-br from-orange-200 via-amber-100 to-yellow-100 p-6 rounded-2xl border-4 border-orange-500 shadow-2xl transform transition-all hover:scale-105 overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-orange-300 rounded-full opacity-30 -mr-20 -mt-20"></div>
                        <div className="relative z-10">
                          <h4 className="font-bold text-orange-900 mb-3 text-xl flex items-center gap-2">
                            <span className="text-3xl">💰</span> Paid Media
                          </h4>
                          <p className="text-gray-900 whitespace-pre-wrap leading-relaxed font-medium">{selectedStrategy.paid_media}</p>
                        </div>
                      </div>
                    )}
                    {selectedStrategy.earned_media && (
                      <div className="relative bg-gradient-to-br from-purple-200 via-violet-100 to-fuchsia-100 p-6 rounded-2xl border-4 border-purple-500 shadow-2xl transform transition-all hover:scale-105 overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-300 rounded-full opacity-30 -mr-20 -mt-20"></div>
                        <div className="relative z-10">
                          <h4 className="font-bold text-purple-900 mb-3 text-xl flex items-center gap-2">
                            <span className="text-3xl">🏆</span> Earned Media
                          </h4>
                          <p className="text-gray-900 whitespace-pre-wrap leading-relaxed font-medium">{selectedStrategy.earned_media}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 9. Budget & Ressources */}
              {(selectedStrategy.temps_humain || selectedStrategy.outils || selectedStrategy.budget_pub) && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-emerald-500 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">9</span>
                    Budget & Ressources
                  </h3>
                  <div className="space-y-6">
                    {selectedStrategy.temps_humain && (
                      <div className="bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 p-6 rounded-2xl border-3 border-emerald-400 shadow-xl">
                        <h4 className="text-sm font-bold text-emerald-800 uppercase mb-3 flex items-center gap-2">
                          <span className="text-xl">⏰</span>
                          Temps humain
                        </h4>
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">{selectedStrategy.temps_humain}</p>
                      </div>
                    )}
                    
                    {selectedStrategy.outils && (
                      <div className="bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-100 p-6 rounded-2xl border-3 border-sky-400 shadow-xl">
                        <h4 className="text-sm font-bold text-sky-800 uppercase mb-3 flex items-center gap-2">
                          <span className="text-xl">🛠️</span>
                          Outils
                        </h4>
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">{selectedStrategy.outils}</p>
                      </div>
                    )}
                    
                    {selectedStrategy.budget_pub && (
                      <div className="bg-gradient-to-br from-lime-100 via-green-100 to-lime-200 p-6 rounded-2xl border-3 border-lime-400 shadow-xl">
                        <h4 className="text-sm font-bold text-lime-800 uppercase mb-3 flex items-center gap-2">
                          <span className="text-xl">💵</span>
                          Budget pub éventuel
                        </h4>
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">{selectedStrategy.budget_pub}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 10. Planning & Optimisation */}
              {(selectedStrategy.planning_global || selectedStrategy.processus_iteration || selectedStrategy.mise_a_jour) && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-4 border-violet-500 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-violet-500 to-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">10</span>
                    Planning, Itération & Optimisation
                  </h3>
                  <div className="space-y-6">
                    {selectedStrategy.planning_global && (
                      <div className="bg-gradient-to-br from-violet-100 via-purple-100 to-fuchsia-100 p-6 rounded-2xl border-3 border-violet-400 shadow-xl">
                        <h4 className="text-sm font-bold text-violet-800 uppercase mb-3 flex items-center gap-2">
                          <span className="text-xl">📅</span>
                          Planning global
                        </h4>
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">{selectedStrategy.planning_global}</p>
                      </div>
                    )}
                    
                    {selectedStrategy.processus_iteration && (
                      <div className="bg-gradient-to-br from-fuchsia-100 via-pink-100 to-rose-100 p-6 rounded-2xl border-3 border-fuchsia-400 shadow-xl">
                        <h4 className="text-sm font-bold text-fuchsia-800 uppercase mb-3 flex items-center gap-2">
                          <span className="text-xl">🔄</span>
                          Processus d'itération
                        </h4>
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">{selectedStrategy.processus_iteration}</p>
                      </div>
                    )}
                    
                    {selectedStrategy.mise_a_jour && (
                      <div className="bg-gradient-to-br from-indigo-100 via-violet-100 to-purple-100 p-6 rounded-2xl border-3 border-indigo-400 shadow-xl">
                        <h4 className="text-sm font-bold text-indigo-800 uppercase mb-3 flex items-center gap-2">
                          <span className="text-xl">🔧</span>
                          Mise à jour & réévaluation
                        </h4>
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">{selectedStrategy.mise_a_jour}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="bg-gradient-to-r from-gray-800 via-slate-800 to-gray-900 p-8 rounded-2xl text-center text-white mt-8 shadow-2xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">🔒</span>
                  <p className="text-sm font-semibold">Document confidentiel</p>
                </div>
                <p className="text-xs text-gray-300">© BYZCLUB Agency {new Date().getFullYear()} - Tous droits réservés</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Télécharger PDF
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition-colors font-medium"
                onClick={() => setSelectedStrategy(null)}
              >
                Fermer
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
