// @ts-nocheck
"use client";

import { useState, useEffect, use } from 'react';
import { useRequireClient } from '@/contexts/SimpleAuthContext';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { getStrategyEntities } from '@/lib/strategyEntitiesApi';
import {
  Target, Users, MessageSquare, Megaphone, BarChart3, Palette,
  Calendar, Heart, Send, ChevronLeft, ChevronRight, X, Check,
  MessageCircle, Clock, CheckCircle, AlertCircle, Loader2, Sparkles,
  TrendingUp, Zap, Award, Star, Rocket, Lightbulb, Brain, Eye,
  Layers, Globe, DollarSign, Share2, Settings, FileText, PieChart, RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface User {
  id: number;
  email: string;
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
  cibles?: string;
  plateformes?: string[];
  ton_voix?: string;
  frequence_calendrier?: string;
  valeurs_messages?: string;
  guidelines_visuelles?: string;
  formats_envisages?: string[];
  workflow_roles?: string;
  audit_profils?: string;
  benchmark_concurrents?: string;
  cadre_suivi?: string;
  owned_media?: string;
  shared_media?: string;
  paid_media?: string;
  earned_media?: string;
  temps_humain?: string;
  outils?: string;
  budget_pub?: string;
  planning_global?: string;
  processus_iteration?: string;
  mise_a_jour?: string;
  notes_internes?: string;
  [key: string]: any;
}

interface Persona {
  id: number;
  strategy_id: number;
  nom: string;
  age_range?: string;
  profession?: string;
  besoins?: string;
  problemes?: string;
  attentes?: string;
  comportements?: string;
  canaux_preferes?: string[];
}

interface PilierContenu {
  id: number;
  strategy_id: number;
  titre: string;
  description?: string;
  exemples?: string;
  pourcentage_cible?: number;
  ordre: number;
}

interface KPI {
  id: number;
  strategy_id: number;
  nom: string;
  objectif?: string;
  valeur_cible?: number;
  unite?: string;
  periodicite?: string;
}

interface Comment {
  id: number;
  strategy_id: number;
  section_key: string;
  content: string;
  status: string;
  admin_response?: string;
  admin_response_at?: string;
  created_at: string;
}

// Définition des sections avec design créatif - TOUTES les sections
const STRATEGY_SECTIONS = [
  {
    key: 'contexte_objectifs',
    title: 'Contexte & Objectifs',
    subtitle: 'Les fondations de votre stratégie',
    icon: Target,
    emoji: '🎯',
    color: 'from-orange-500 via-red-500 to-pink-500',
    bgColor: 'from-orange-50 via-red-50 to-pink-50',
    borderColor: 'border-orange-300',
    fields: ['contexte_general', 'objectifs_business', 'objectifs_reseaux']
  },
  {
    key: 'audience',
    title: 'Audience & Cibles',
    subtitle: 'Vos personas et leurs besoins',
    icon: Users,
    emoji: '👥',
    color: 'from-purple-500 via-pink-500 to-rose-500',
    bgColor: 'from-purple-50 via-pink-50 to-rose-50',
    borderColor: 'border-purple-300',
    fields: ['cibles', 'personas']
  },
  {
    key: 'plateformes',
    title: 'Plateformes',
    subtitle: 'Où nous allons briller',
    icon: Megaphone,
    emoji: '📱',
    color: 'from-blue-500 via-cyan-500 to-teal-500',
    bgColor: 'from-blue-50 via-cyan-50 to-teal-50',
    borderColor: 'border-blue-300',
    fields: ['plateformes']
  },
  {
    key: 'piliers',
    title: 'Piliers de Contenu',
    subtitle: 'Les axes stratégiques',
    icon: Layers,
    emoji: '🏛️',
    color: 'from-emerald-500 via-teal-500 to-cyan-500',
    bgColor: 'from-emerald-50 via-teal-50 to-cyan-50',
    borderColor: 'border-emerald-300',
    fields: ['piliers']
  },
  {
    key: 'identite',
    title: 'Identité de Marque',
    subtitle: 'Ton, voix et valeurs',
    icon: Palette,
    emoji: '🎨',
    color: 'from-green-500 via-emerald-500 to-teal-500',
    bgColor: 'from-green-50 via-emerald-50 to-teal-50',
    borderColor: 'border-green-300',
    fields: ['ton_voix', 'guidelines_visuelles', 'valeurs_messages']
  },
  {
    key: 'formats',
    title: 'Formats & Rythme',
    subtitle: 'Types de contenu et calendrier',
    icon: Calendar,
    emoji: '📅',
    color: 'from-amber-500 via-yellow-500 to-orange-500',
    bgColor: 'from-amber-50 via-yellow-50 to-orange-50',
    borderColor: 'border-amber-300',
    fields: ['formats_envisages', 'frequence_calendrier', 'workflow_roles']
  },
  {
    key: 'audit',
    title: 'Audit & Concurrence',
    subtitle: 'Analyse et benchmark',
    icon: Eye,
    emoji: '🔍',
    color: 'from-slate-500 via-gray-500 to-slate-500',
    bgColor: 'from-slate-50 via-gray-50 to-slate-50',
    borderColor: 'border-slate-300',
    fields: ['audit_profils', 'benchmark_concurrents']
  },
  {
    key: 'peso',
    title: 'Modèle PESO',
    subtitle: 'Mix média (Paid, Earned, Shared, Owned)',
    icon: PieChart,
    emoji: '📊',
    color: 'from-violet-500 via-purple-500 to-fuchsia-500',
    bgColor: 'from-violet-50 via-purple-50 to-fuchsia-50',
    borderColor: 'border-violet-300',
    fields: ['owned_media', 'shared_media', 'paid_media', 'earned_media']
  },
  {
    key: 'kpis',
    title: 'KPIs & Suivi',
    subtitle: 'Indicateurs de performance',
    icon: BarChart3,
    emoji: '📈',
    color: 'from-indigo-500 via-violet-500 to-purple-500',
    bgColor: 'from-indigo-50 via-violet-50 to-purple-50',
    borderColor: 'border-indigo-300',
    fields: ['kpis', 'cadre_suivi']
  },
  {
    key: 'ressources',
    title: 'Budget & Ressources',
    subtitle: 'Moyens et outils',
    icon: DollarSign,
    emoji: '💰',
    color: 'from-yellow-500 via-amber-500 to-orange-500',
    bgColor: 'from-yellow-50 via-amber-50 to-orange-50',
    borderColor: 'border-yellow-300',
    fields: ['temps_humain', 'outils', 'budget_pub']
  },
  {
    key: 'planning',
    title: 'Planning & Optimisation',
    subtitle: 'Roadmap et itérations',
    icon: Rocket,
    emoji: '🚀',
    color: 'from-blue-500 via-indigo-500 to-purple-500',
    bgColor: 'from-blue-50 via-indigo-50 to-purple-50',
    borderColor: 'border-blue-300',
    fields: ['planning_global', 'processus_iteration', 'mise_a_jour']
  }
];

// Labels créatifs pour les champs
const FIELD_LABELS: Record<string, { label: string; icon: any; emoji: string }> = {
  contexte_general: { label: 'Contexte général', icon: Lightbulb, emoji: '💡' },
  objectifs_business: { label: 'Objectifs business', icon: TrendingUp, emoji: '📈' },
  objectifs_reseaux: { label: 'Objectifs réseaux sociaux (SMART)', icon: Rocket, emoji: '🚀' },
  cibles: { label: 'Cibles principales', icon: Target, emoji: '🎯' },
  personas: { label: 'Personas marketing', icon: Users, emoji: '👤' },
  piliers: { label: 'Piliers de contenu', icon: Layers, emoji: '🏛️' },
  plateformes: { label: 'Plateformes actives', icon: Megaphone, emoji: '📱' },
  ton_voix: { label: 'Ton et voix de marque', icon: MessageSquare, emoji: '💬' },
  guidelines_visuelles: { label: 'Guidelines visuelles', icon: Eye, emoji: '👁️' },
  valeurs_messages: { label: 'Valeurs et messages clés', icon: Heart, emoji: '❤️' },
  formats_envisages: { label: 'Formats envisagés', icon: FileText, emoji: '📄' },
  frequence_calendrier: { label: 'Fréquence & calendrier éditorial', icon: Calendar, emoji: '📅' },
  workflow_roles: { label: 'Workflow & rôles', icon: Settings, emoji: '⚙️' },
  audit_profils: { label: 'Audit des profils existants', icon: Eye, emoji: '🔍' },
  benchmark_concurrents: { label: 'Veille / Benchmark concurrents', icon: TrendingUp, emoji: '📊' },
  cadre_suivi: { label: 'Cadre de suivi', icon: BarChart3, emoji: '📈' },
  owned_media: { label: 'Owned Media', icon: Globe, emoji: '🌐' },
  shared_media: { label: 'Shared Media', icon: Share2, emoji: '👥' },
  paid_media: { label: 'Paid Media', icon: DollarSign, emoji: '💰' },
  earned_media: { label: 'Earned Media', icon: Award, emoji: '🏆' },
  temps_humain: { label: 'Temps humain', icon: Clock, emoji: '⏰' },
  outils: { label: 'Outils', icon: Settings, emoji: '🛠️' },
  budget_pub: { label: 'Budget pub éventuel', icon: DollarSign, emoji: '💵' },
  planning_global: { label: 'Planning global', icon: Calendar, emoji: '📆' },
  processus_iteration: { label: 'Processus d\'itération', icon: Zap, emoji: '⚡' },
  mise_a_jour: { label: 'Mise à jour & réévaluation', icon: RefreshCw, emoji: '🔄' },
  kpis: { label: 'Indicateurs de performance', icon: BarChart3, emoji: '📊' }
};

export default function StrategyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user } = useRequireClient() as { user: User };
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [piliers, setPiliers] = useState<PilierContenu[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [activeCommentSection, setActiveCommentSection] = useState<string | null>(null);
  const [isSendingComment, setIsSendingComment] = useState(false);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Fetch strategy, entities and comments
  useEffect(() => {
    if (!user?.client_id) return;

    async function fetchData() {
      setIsLoading(true);
      try {
        const strategyId = parseInt(resolvedParams.id);
        
        // Fetch strategy
        const { data: strategyData, error: strategyError } = await supabase
          .from('social_media_strategy')
          .select('*')
          .eq('id', strategyId)
          .eq('client_id', user.client_id)
          .single();

        if (strategyError) throw strategyError;
        setStrategy(strategyData);

        // Fetch entities (personas, piliers, kpis)
        try {
          const entities = await getStrategyEntities(strategyId);
          setPersonas(entities.personas || []);
          setPiliers(entities.piliers || []);
          setKpis(entities.kpis || []);
        } catch (entitiesError) {
          console.error('Error fetching entities:', entitiesError);
          // Continue even if entities fail
        }

        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase
          .from('strategy_comments')
          .select('*')
          .eq('strategy_id', strategyId)
          .order('created_at', { ascending: false });

        if (!commentsError) {
          setComments(commentsData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user?.client_id, resolvedParams.id]);

  const submitComment = async (sectionKey: string) => {
    if (!newComment.trim() || !strategy || !user) return;

    setIsSendingComment(true);
    try {
      const { data, error } = await supabase
        .from('strategy_comments')
        .insert({
          strategy_id: strategy.id,
          client_id: user.client_id,
          user_id: user.id,
          section_key: sectionKey,
          content: newComment.trim(),
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setComments(prev => [data, ...prev]);
      setNewComment('');
      setActiveCommentSection(null);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSendingComment(false);
    }
  };

  const getSectionComments = (sectionKey: string) => {
    return comments.filter(c => c.section_key === sectionKey);
  };

  const nextSection = () => {
    if (currentSection < STRATEGY_SECTIONS.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-pink-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <Sparkles className="w-full h-full text-orange-500" />
          </motion.div>
          <p className="text-slate-600 font-semibold text-lg">Chargement de votre stratégie...</p>
        </motion.div>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <AlertCircle className="w-10 h-10 text-red-500" />
          </motion.div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Stratégie introuvable</h2>
          <p className="text-slate-600 mb-8">Cette stratégie n'existe pas ou vous n'y avez pas accès.</p>
          <Link 
            href="/client-portal/strategies" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Retour aux stratégies
          </Link>
        </motion.div>
      </div>
    );
  }

  const currentSectionData = STRATEGY_SECTIONS[currentSection];
  const Icon = currentSectionData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className={`absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br ${currentSectionData.color} blur-3xl`}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br ${currentSectionData.color} blur-3xl`}
        />
      </div>

      {/* Mobile Header */}
      <motion.div 
        style={{ opacity }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4 py-4 md:hidden shadow-lg"
      >
        <div className="flex items-center justify-between">
          <Link href="/client-portal/strategies" className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl">{currentSectionData.emoji}</span>
              <h1 className="font-bold text-slate-900 text-base">Stratégie v{strategy.version}</h1>
            </div>
            <p className="text-xs text-slate-500 font-medium">{currentSectionData.title}</p>
          </div>
          <div className="w-10" />
        </div>
        
        {/* Progress dots with animation */}
        <div className="flex justify-center gap-2 mt-4">
          {STRATEGY_SECTIONS.map((section, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrentSection(idx)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`rounded-full transition-all ${
                idx === currentSection 
                  ? 'w-8 h-2 bg-gradient-to-r from-orange-500 to-red-500 shadow-lg' 
                  : idx < currentSection 
                    ? 'w-2 h-2 bg-orange-300' 
                    : 'w-2 h-2 bg-slate-300'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Desktop Header */}
      <motion.div 
        style={{ opacity }}
        className="hidden md:block sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/client-portal/strategies" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{currentSectionData.emoji}</span>
                  <h1 className="text-2xl font-bold text-slate-900">Stratégie Social Media</h1>
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  Version {strategy.version} • {strategy.status === 'actif' ? '✅ Active' : '📁 Archivée'}
                </p>
              </div>
            </div>
            
            {/* Section tabs with creative design */}
            <div className="flex items-center gap-2 bg-slate-100/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200">
              {STRATEGY_SECTIONS.map((section, idx) => {
                const SectionIcon = section.icon;
                return (
                  <motion.button
                    key={section.key}
                    onClick={() => setCurrentSection(idx)}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-xl transition-all relative ${
                      idx === currentSection 
                        ? 'bg-white shadow-lg text-orange-600' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                    }`}
                    title={section.title}
                  >
                    <SectionIcon className="w-5 h-5" />
                    {idx === currentSection && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Creative Section Header */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-10"
            >
              <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${currentSectionData.bgColor} border-2 ${currentSectionData.borderColor} p-8 shadow-2xl`}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
                  <div className={`w-full h-full bg-gradient-to-br ${currentSectionData.color} rounded-full blur-3xl`} />
                </div>
                
                <div className="relative z-10 flex items-start gap-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${currentSectionData.color} flex items-center justify-center shadow-2xl flex-shrink-0`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{currentSectionData.emoji}</span>
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                        Section {currentSection + 1}/{STRATEGY_SECTIONS.length}
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                      {currentSectionData.title}
                    </h2>
                    <p className="text-lg text-slate-600 font-medium">
                      {currentSectionData.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Section Content with creative cards */}
            <div className="space-y-8">
              {/* Special handling for PESO section - show all 4 together */}
              {currentSectionData.key === 'peso' ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {['owned_media', 'shared_media', 'paid_media', 'earned_media'].map((pesoField, idx) => {
                    const pesoValue = strategy[pesoField];
                    if (!pesoValue) return null;
                    
                    const pesoLabels: Record<string, { label: string; icon: any; emoji: string; color: string }> = {
                      owned_media: { label: 'Owned Media', icon: Globe, emoji: '🌐', color: 'blue' },
                      shared_media: { label: 'Shared Media', icon: Share2, emoji: '👥', color: 'green' },
                      paid_media: { label: 'Paid Media', icon: DollarSign, emoji: '💰', color: 'orange' },
                      earned_media: { label: 'Earned Media', icon: Award, emoji: '🏆', color: 'purple' }
                    };
                    
                    const pesoInfo = pesoLabels[pesoField];
                    const sectionComments = getSectionComments(pesoField);
                    const isCommentOpen = activeCommentSection === pesoField;
                    
                    return (
                      <motion.div
                        key={pesoField}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-slate-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300"
                      >
                        <div className={`relative px-6 py-5 bg-gradient-to-r ${
                          pesoField === 'owned_media' ? 'from-blue-50 to-cyan-50 border-blue-300' :
                          pesoField === 'shared_media' ? 'from-green-50 to-emerald-50 border-green-300' :
                          pesoField === 'paid_media' ? 'from-orange-50 to-amber-50 border-orange-300' :
                          'from-purple-50 to-violet-50 border-purple-300'
                        } border-b-2`}>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                          <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
                                pesoField === 'owned_media' ? 'from-blue-500 to-cyan-500' :
                                pesoField === 'shared_media' ? 'from-green-500 to-emerald-500' :
                                pesoField === 'paid_media' ? 'from-orange-500 to-amber-500' :
                                'from-purple-500 to-violet-500'
                              } flex items-center justify-center shadow-lg`}>
                                <pesoInfo.icon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xl">{pesoInfo.emoji}</span>
                                  <h3 className="text-xl font-bold text-slate-900">{pesoInfo.label}</h3>
                                </div>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setActiveCommentSection(isCommentOpen ? null : pesoField)}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-lg ${
                                isCommentOpen 
                                  ? `bg-gradient-to-r ${
                                    pesoField === 'owned_media' ? 'from-blue-500 to-cyan-500' :
                                    pesoField === 'shared_media' ? 'from-green-500 to-emerald-500' :
                                    pesoField === 'paid_media' ? 'from-orange-500 to-amber-500' :
                                    'from-purple-500 to-violet-500'
                                  } text-white` 
                                  : 'bg-white/90 text-slate-700 hover:bg-white'
                              }`}
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span className="hidden sm:inline">
                                {sectionComments.length > 0 ? `${sectionComments.length}` : '💬'}
                              </span>
                            </motion.button>
                          </div>
                        </div>
                        <div className="p-6 md:p-8">
                          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base font-medium">
                            {pesoValue}
                          </p>
                        </div>
                        {/* Comments for PESO field */}
                        <AnimatePresence>
                          {isCommentOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden"
                            >
                              <div className="p-6">
                                {sectionComments.length > 0 && (
                                  <div className="space-y-4 mb-6">
                                    {sectionComments.map((comment) => (
                                      <div key={comment.id} className="bg-white rounded-2xl p-4 shadow-sm">
                                        <p className="text-slate-700 text-sm">{comment.content}</p>
                                        {comment.admin_response && (
                                          <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-200">
                                            <p className="text-green-700 text-sm">{comment.admin_response}</p>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="space-y-4">
                                  <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="💬 Votre commentaire..."
                                    className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none resize-none text-slate-900 placeholder:text-slate-400 min-h-[100px]"
                                    rows={3}
                                  />
                                  <div className="flex justify-end">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => submitComment(pesoField)}
                                      disabled={!newComment.trim() || isSendingComment}
                                      className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${
                                        pesoField === 'owned_media' ? 'from-blue-500 to-cyan-500' :
                                        pesoField === 'shared_media' ? 'from-green-500 to-emerald-500' :
                                        pesoField === 'paid_media' ? 'from-orange-500 to-amber-500' :
                                        'from-purple-500 to-violet-500'
                                      } text-white rounded-2xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all`}
                                    >
                                      {isSendingComment ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                      Envoyer
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                // Regular fields (exclude PESO fields as they're handled separately)
                currentSectionData.fields
                  .filter(field => !['owned_media', 'shared_media', 'paid_media', 'earned_media'].includes(field))
                  .map((field, fieldIdx) => {
                    // Handle special fields from separate tables
                    let value: any;
                    if (field === 'personas') {
                      value = personas.length > 0 ? personas : null;
                    } else if (field === 'piliers') {
                      value = piliers.length > 0 ? piliers : null;
                    } else if (field === 'kpis') {
                      value = kpis.length > 0 ? kpis : null;
                    } else {
                      value = strategy[field];
                    }

                    if (!value || (Array.isArray(value) && value.length === 0 && field !== 'personas' && field !== 'piliers' && field !== 'kpis')) return null;

                const fieldInfo = FIELD_LABELS[field] || { label: field, icon: null, emoji: '📝' };
                const FieldIcon = fieldInfo.icon;
                const sectionComments = getSectionComments(field);
                const isCommentOpen = activeCommentSection === field;

                return (
                  <motion.div
                    key={field}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: fieldIdx * 0.1 }}
                    className="group"
                  >
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-slate-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
                      {/* Creative Field Header */}
                      <div className={`relative px-6 py-5 bg-gradient-to-r ${currentSectionData.bgColor} border-b-2 ${currentSectionData.borderColor}`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {FieldIcon && (
                              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentSectionData.color} flex items-center justify-center shadow-lg`}>
                                <FieldIcon className="w-6 h-6 text-white" />
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">{fieldInfo.emoji}</span>
                                <h3 className="text-xl font-bold text-slate-900">{fieldInfo.label}</h3>
                              </div>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setActiveCommentSection(isCommentOpen ? null : field)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-lg ${
                              isCommentOpen 
                                ? `bg-gradient-to-r ${currentSectionData.color} text-white` 
                                : 'bg-white/90 text-slate-700 hover:bg-white'
                            }`}
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">
                              {sectionComments.length > 0 ? `${sectionComments.length} commentaire${sectionComments.length > 1 ? 's' : ''}` : 'Commenter'}
                            </span>
                            {sectionComments.length > 0 && <span className="sm:hidden">{sectionComments.length}</span>}
                          </motion.button>
                        </div>
                      </div>

                      {/* Field Content with creative layouts */}
                      <div className="p-6 md:p-8">
                        {field === 'plateformes' && Array.isArray(value) ? (
                          <div className="flex flex-wrap gap-3">
                            {value.map((platform: string, idx: number) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="px-5 py-3 bg-gradient-to-r from-blue-100 via-cyan-100 to-teal-100 text-blue-900 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all border-2 border-blue-200"
                              >
                                {platform}
                              </motion.div>
                            ))}
                          </div>
                        ) : field === 'formats_envisages' && Array.isArray(value) ? (
                          <div className="flex flex-wrap gap-3">
                            {value.map((format: string, idx: number) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="px-5 py-3 bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 text-green-900 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all border-2 border-green-200"
                              >
                                {format}
                              </motion.div>
                            ))}
                          </div>
                        ) : field === 'personas' && Array.isArray(value) ? (
                          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {value.map((persona: Persona, idx: number) => (
                              <motion.div
                                key={persona.id || idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="relative p-6 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 rounded-3xl border-2 border-pink-200 shadow-lg overflow-hidden group"
                              >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-2xl" />
                                
                                <div className="relative z-10">
                                  <div className="flex items-center gap-4 mb-4">
                                    <motion.div
                                      whileHover={{ rotate: 360 }}
                                      transition={{ duration: 0.6 }}
                                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-2xl shadow-xl"
                                    >
                                      {persona.nom?.charAt(0) || '?'}
                                    </motion.div>
                                    <div>
                                      <h4 className="text-xl font-bold text-slate-900">{persona.nom}</h4>
                                      {persona.age_range && <p className="text-sm text-slate-600 font-medium">{persona.age_range}</p>}
                                      {persona.profession && <p className="text-xs text-pink-600 font-semibold">{persona.profession}</p>}
                                    </div>
                                  </div>
                                  <div className="space-y-3 text-sm">
                                    {persona.besoins && (
                                      <div className="p-3 bg-white/60 rounded-xl backdrop-blur-sm">
                                        <span className="font-bold text-pink-700 flex items-center gap-2 mb-1">
                                          <span className="text-lg">🎯</span> Besoins
                                        </span>
                                        <p className="text-slate-700">{persona.besoins}</p>
                                      </div>
                                    )}
                                    {persona.problemes && (
                                      <div className="p-3 bg-white/60 rounded-xl backdrop-blur-sm">
                                        <span className="font-bold text-red-700 flex items-center gap-2 mb-1">
                                          <span className="text-lg">⚠️</span> Problèmes
                                        </span>
                                        <p className="text-slate-700">{persona.problemes}</p>
                                      </div>
                                    )}
                                    {persona.attentes && (
                                      <div className="p-3 bg-white/60 rounded-xl backdrop-blur-sm">
                                        <span className="font-bold text-purple-700 flex items-center gap-2 mb-1">
                                          <span className="text-lg">✨</span> Attentes
                                        </span>
                                        <p className="text-slate-700">{persona.attentes}</p>
                                      </div>
                                    )}
                                    {persona.comportements && (
                                      <div className="p-3 bg-white/60 rounded-xl backdrop-blur-sm">
                                        <span className="font-bold text-blue-700 flex items-center gap-2 mb-1">
                                          <span className="text-lg">🧠</span> Comportements
                                        </span>
                                        <p className="text-slate-700">{persona.comportements}</p>
                                      </div>
                                    )}
                                    {persona.canaux_preferes && persona.canaux_preferes.length > 0 && (
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        {persona.canaux_preferes.map((canal, i) => (
                                          <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">
                                            {canal}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : field === 'piliers' && Array.isArray(value) ? (
                          <div className="space-y-6">
                            {value.map((pilier: PilierContenu, idx: number) => (
                              <motion.div
                                key={pilier.id || idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ x: 5 }}
                                className="relative p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl border-2 border-emerald-200 shadow-lg overflow-hidden"
                              >
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl" />
                                
                                <div className="relative z-10 flex items-start gap-5">
                                  <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-xl flex-shrink-0"
                                  >
                                    {pilier.ordre !== undefined ? pilier.ordre + 1 : idx + 1}
                                  </motion.div>
                                  <div className="flex-1">
                                    <h4 className="text-2xl font-bold text-slate-900 mb-3">{pilier.titre}</h4>
                                    {pilier.description && (
                                      <p className="text-slate-700 mb-4 leading-relaxed">{pilier.description}</p>
                                    )}
                                    {pilier.exemples && (
                                      <div className="p-4 bg-white/60 rounded-2xl backdrop-blur-sm border border-emerald-200">
                                        <span className="font-bold text-emerald-700 flex items-center gap-2 mb-2">
                                          <span className="text-lg">💡</span> Exemples
                                        </span>
                                        <p className="text-slate-700 text-sm">{pilier.exemples}</p>
                                      </div>
                                    )}
                                    {pilier.pourcentage_cible && (
                                      <div className="mt-4 flex items-center gap-3">
                                        <div className="flex-1 bg-white/60 rounded-full h-3 overflow-hidden">
                                          <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pilier.pourcentage_cible}%` }}
                                            transition={{ delay: idx * 0.2, duration: 0.8 }}
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                          />
                                        </div>
                                        <span className="text-sm font-bold text-emerald-700">{pilier.pourcentage_cible}%</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : field === 'kpis' && Array.isArray(value) ? (
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {value.map((kpi: KPI, idx: number) => (
                              <motion.div
                                key={kpi.id || idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="p-5 bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 rounded-2xl border-2 border-indigo-200 shadow-lg"
                              >
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-white" />
                                  </div>
                                  <h4 className="font-bold text-slate-900 text-lg">{kpi.nom}</h4>
                                </div>
                                {kpi.objectif && (
                                  <p className="text-sm text-indigo-700 font-semibold mb-1">🎯 Objectif: {kpi.objectif}</p>
                                )}
                                {kpi.valeur_cible && (
                                  <p className="text-sm text-indigo-600 font-bold mb-1">
                                    📊 Valeur cible: {kpi.valeur_cible} {kpi.unite || ''}
                                  </p>
                                )}
                                {kpi.periodicite && (
                                  <p className="text-sm text-slate-600">📅 {kpi.periodicite}</p>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        ) : (field === 'owned_media' || field === 'shared_media' || field === 'paid_media' || field === 'earned_media') && typeof value === 'string' ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`p-6 rounded-2xl border-2 ${
                              field === 'owned_media' ? 'bg-blue-50 border-blue-200' :
                              field === 'shared_media' ? 'bg-green-50 border-green-200' :
                              field === 'paid_media' ? 'bg-orange-50 border-orange-200' :
                              'bg-purple-50 border-purple-200'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              {field === 'owned_media' && <Globe className="w-6 h-6 text-blue-600" />}
                              {field === 'shared_media' && <Share2 className="w-6 h-6 text-green-600" />}
                              {field === 'paid_media' && <DollarSign className="w-6 h-6 text-orange-600" />}
                              {field === 'earned_media' && <Award className="w-6 h-6 text-purple-600" />}
                              <h4 className={`text-lg font-bold ${
                                field === 'owned_media' ? 'text-blue-900' :
                                field === 'shared_media' ? 'text-green-900' :
                                field === 'paid_media' ? 'text-orange-900' :
                                'text-purple-900'
                              }`}>
                                {field === 'owned_media' ? '🌐 Owned Media' :
                                 field === 'shared_media' ? '👥 Shared Media' :
                                 field === 'paid_media' ? '💰 Paid Media' :
                                 '🏆 Earned Media'}
                              </h4>
                            </div>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base font-medium">
                              {value}
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="prose prose-lg max-w-none"
                          >
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base md:text-lg font-medium">
                              {value}
                            </p>
                          </motion.div>
                        )}
                      </div>

                      {/* Comments Section with creative design */}
                      <AnimatePresence>
                        {isCommentOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden"
                          >
                            <div className="p-6">
                              {/* Existing Comments */}
                              {sectionComments.length > 0 && (
                                <div className="space-y-4 mb-6">
                                  {sectionComments.map((comment, idx) => (
                                    <motion.div
                                      key={comment.id}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: idx * 0.1 }}
                                      className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200"
                                    >
                                      <div className="flex items-start gap-4">
                                        <motion.div
                                          whileHover={{ scale: 1.1, rotate: 5 }}
                                          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0 shadow-lg"
                                        >
                                          <MessageSquare className="w-6 h-6 text-white" />
                                        </motion.div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <span className="font-bold text-slate-900">Vous</span>
                                            <span className="text-xs text-slate-400">
                                              {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                              comment.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                              comment.status === 'read' ? 'bg-blue-100 text-blue-700' :
                                              'bg-amber-100 text-amber-700'
                                            }`}>
                                              {comment.status === 'resolved' ? '✅ Résolu' :
                                               comment.status === 'read' ? '👁️ Lu' : '⏳ En attente'}
                                            </span>
                                          </div>
                                          <p className="text-slate-700 text-sm leading-relaxed">{comment.content}</p>
                                          
                                          {/* Admin Response */}
                                          {comment.admin_response && (
                                            <motion.div
                                              initial={{ opacity: 0, y: 10 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              className="mt-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-md"
                                            >
                                              <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                <span className="font-bold text-green-800">Réponse de l'équipe</span>
                                              </div>
                                              <p className="text-green-700 text-sm leading-relaxed">{comment.admin_response}</p>
                                            </motion.div>
                                          )}
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              )}

                              {/* New Comment Form */}
                              <div className="space-y-4">
                                <textarea
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  placeholder="💬 Votre commentaire ou question sur cette section..."
                                  className="w-full p-5 rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none resize-none text-slate-900 placeholder:text-slate-400 min-h-[120px] text-base font-medium transition-all"
                                  rows={4}
                                />
                                <div className="flex justify-end">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => submitComment(field)}
                                    disabled={!newComment.trim() || isSendingComment}
                                    className={`flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${currentSectionData.color} text-white rounded-2xl font-bold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl transition-all`}
                                  >
                                    {isSendingComment ? (
                                      <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                      <>
                                        <Send className="w-5 h-5" />
                                        Envoyer
                                      </>
                                    )}
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
                })
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Creative Navigation Footer */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t-2 border-slate-200 px-4 py-5 md:px-6 z-50 shadow-2xl"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevSection}
            disabled={currentSection === 0}
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Précédent</span>
          </motion.button>

          <div className="flex items-center gap-3">
            {STRATEGY_SECTIONS.map((section, idx) => (
              <motion.button
                key={section.key}
                onClick={() => setCurrentSection(idx)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                className={`rounded-full transition-all ${
                  idx === currentSection 
                    ? `w-8 h-3 bg-gradient-to-r ${section.color} shadow-lg` 
                    : 'w-3 h-3 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextSection}
            disabled={currentSection === STRATEGY_SECTIONS.length - 1}
            className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-r ${currentSectionData.color} text-white shadow-xl hover:shadow-2xl`}
          >
            <span className="hidden sm:inline">Suivant</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Bottom padding for fixed navigation */}
      <div className="h-28" />
    </div>
  );
}
