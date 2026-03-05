"use client";

import React, { useState, useEffect } from 'react';
import { useRequireClient } from '@/contexts/SimpleAuthContext';
import {
  Calendar, ChevronLeft, ChevronRight, X,
  Instagram, Linkedin, Video, Globe,
  Target, Users, FileText, LayoutGrid, List, Filter,
  Sparkles, TrendingUp, Eye, MessageCircle, Zap, Star,
  Clock, CheckCircle2, PlayCircle, Lightbulb,
  BarChart2, PieChart, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PilierContenu } from '@/types/database';

// ─── Types ───────────────────────────────────────────────────────────────────

interface CalendarEntry {
  id: number;
  client_id: number;
  title: string;
  publish_date: string;
  publish_time?: string;
  platform: string;
  objective: string;
  strategic_intent?: string;
  pillar: string;
  persona?: string;
  script_id?: number;
  status: 'idea' | 'production' | 'scheduled' | 'published';
  notes?: string;
  color?: string;
  thumbnail_url?: string;
  content_type: 'video' | 'post' | 'carousel';
  drive_link?: string;
  content_description?: string;
}

// ─── Config données ───────────────────────────────────────────────────────────

const PLATFORMS: Record<string, { label: string; icon: React.ComponentType<{className?:string}>; color: string; bg: string }> = {
  instagram: { label: 'Instagram',  icon: Instagram,     color: 'text-pink-600',   bg: 'bg-pink-100' },
  tiktok:    { label: 'TikTok',     icon: Video,         color: 'text-gray-800',   bg: 'bg-gray-100' },
  linkedin:  { label: 'LinkedIn',   icon: Linkedin,      color: 'text-blue-700',   bg: 'bg-blue-100' },
  youtube:   { label: 'YouTube',    icon: Video,         color: 'text-red-600',    bg: 'bg-red-100'  },
  autre:     { label: 'Autre',      icon: Globe,         color: 'text-gray-500',   bg: 'bg-gray-100' },
};

const OBJECTIVES: Record<string, { label: string; icon: React.ComponentType<{className?:string}>; color: string }> = {
  notoriete:   { label: 'Notoriété',    icon: Eye,            color: 'text-purple-600' },
  engagement:  { label: 'Engagement',   icon: MessageCircle,  color: 'text-blue-600'   },
  conversion:  { label: 'Conversion',   icon: TrendingUp,     color: 'text-green-600'  },
  autorite:    { label: 'Autorité',     icon: Star,           color: 'text-yellow-600' },
  fidelisation:{ label: 'Fidélisation', icon: Users,          color: 'text-indigo-600' },
  inspiration: { label: 'Inspiration',  icon: Sparkles,       color: 'text-rose-600'   },
};

const STATUSES: Record<string, { label: string; icon: React.ComponentType<{className?:string}>; color: string; bg: string; border: string }> = {
  idea:       { label: 'Idée',          icon: Lightbulb,    color: 'text-yellow-700', bg: 'bg-yellow-50',  border: 'border-yellow-200' },
  production: { label: 'En production', icon: PlayCircle,   color: 'text-blue-700',   bg: 'bg-blue-50',    border: 'border-blue-200'   },
  scheduled:  { label: 'Planifié',      icon: Clock,        color: 'text-purple-700', bg: 'bg-purple-50',  border: 'border-purple-200' },
  published:  { label: 'Publié',        icon: CheckCircle2, color: 'text-green-700',  bg: 'bg-green-50',   border: 'border-green-200'  },
};

const PILLAR_COLORS: Record<string, { gradient: string; light: string; text: string; dot: string }> = {
  education:     { gradient: 'from-blue-500 to-cyan-500',    light: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-500'   },
  inspiration:   { gradient: 'from-purple-500 to-pink-500',  light: 'bg-purple-50',  text: 'text-purple-700', dot: 'bg-purple-500' },
  entertainment: { gradient: 'from-orange-500 to-red-500',   light: 'bg-orange-50',  text: 'text-orange-700', dot: 'bg-orange-500' },
  promotion:     { gradient: 'from-green-500 to-emerald-500',light: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-500'  },
  coulisses:     { gradient: 'from-amber-500 to-yellow-500', light: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-500'  },
  temoignage:    { gradient: 'from-rose-500 to-pink-500',    light: 'bg-rose-50',    text: 'text-rose-700',   dot: 'bg-rose-500'   },
  custom:        { gradient: 'from-gray-500 to-slate-500',   light: 'bg-gray-50',    text: 'text-gray-700',   dot: 'bg-gray-500'   },
};

const DEFAULT_PILLARS = [
  { key: 'education',     label: 'Éducation / Valeur' },
  { key: 'inspiration',   label: 'Inspiration' },
  { key: 'entertainment', label: 'Divertissement' },
  { key: 'promotion',     label: 'Promotion / CTA' },
  { key: 'coulisses',     label: 'Coulisses / Behind the scenes' },
  { key: 'temoignage',    label: 'Témoignage / Preuve sociale' },
];

const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

function getPillarColor(pillar: string) {
  return PILLAR_COLORS[pillar] || PILLAR_COLORS.custom;
}

function generatePillarColor(index: number) {
  const colors = [
    { gradient: 'from-blue-500 to-cyan-500',    light: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-500'   },
    { gradient: 'from-purple-500 to-pink-500',  light: 'bg-purple-50',  text: 'text-purple-700', dot: 'bg-purple-500' },
    { gradient: 'from-orange-500 to-red-500',   light: 'bg-orange-50',  text: 'text-orange-700', dot: 'bg-orange-500' },
    { gradient: 'from-green-500 to-emerald-500',light: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-500'  },
    { gradient: 'from-amber-500 to-yellow-500', light: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-500'  },
    { gradient: 'from-rose-500 to-pink-500',    light: 'bg-rose-50',    text: 'text-rose-700',   dot: 'bg-rose-500'   },
    { gradient: 'from-indigo-500 to-blue-500',  light: 'bg-indigo-50',  text: 'text-indigo-700', dot: 'bg-indigo-500' },
    { gradient: 'from-teal-500 to-cyan-500',    light: 'bg-teal-50',    text: 'text-teal-700',   dot: 'bg-teal-500'   },
  ];
  return colors[index % colors.length];
}

export default function CalendrierEditorialPage() {
  const { user } = useRequireClient();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<CalendarEntry | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPillar, setFilterPillar] = useState<string | null>(null);
  const [strategyId, setStrategyId] = useState<number | null>(null);
  const [piliers, setPiliers] = useState<PilierContenu[]>([]);

  // Piliers affichés
  const displayedPiliers = piliers.length > 0 
    ? piliers.map((p, idx) => ({ key: p.titre.toLowerCase().replace(/\s+/g, '_'), label: p.titre, id: p.id, index: idx }))
    : DEFAULT_PILLARS.map((p, idx) => ({ ...p, id: null, index: idx }));

  const pillarColorMap: Record<string, { gradient: string; light: string; text: string; dot: string }> = {};
  displayedPiliers.forEach((p) => {
    if (PILLAR_COLORS[p.key]) {
      pillarColorMap[p.key] = PILLAR_COLORS[p.key];
    } else {
      pillarColorMap[p.key] = generatePillarColor(p.index);
    }
  });

  function getPillarColorDynamic(pillar: string) {
    return pillarColorMap[pillar] || PILLAR_COLORS.custom;
  }

  // Chargement
  useEffect(() => {
    if (user?.client_id) {
      loadStrategyAndPiliers();
      loadEntries();
    }
  }, [user, currentYear, currentMonth]);

  async function loadStrategyAndPiliers() {
    if (!user?.client_id) return;
    
    try {
      console.log('[Client Calendrier] Chargement stratégie pour client:', user.client_id);
      const response = await fetch(`/api/calendrier/strategy?client_id=${user.client_id}`);
      const { strategy } = await response.json();
      console.log('[Client Calendrier] Stratégie reçue:', strategy);

      if (strategy) {
        setStrategyId(strategy.id);
        console.log('[Client Calendrier] Chargement piliers pour stratégie:', strategy.id);
        const piliersResponse = await fetch(`/api/calendrier/piliers?strategy_id=${strategy.id}`);
        const { piliers: piliersData } = await piliersResponse.json();
        console.log('[Client Calendrier] Piliers reçus:', piliersData);
        console.log('[Client Calendrier] Nombre de piliers:', piliersData?.length || 0);
        setPiliers(piliersData || []);
      } else {
        console.log('[Client Calendrier] Pas de stratégie validée - utilisation piliers par défaut');
        setStrategyId(null);
        setPiliers([]);
      }
    } catch (error) {
      console.error('[Client Calendrier] Erreur chargement stratégie/piliers:', error);
      setPiliers([]);
    }
  }

  async function loadEntries() {
    if (!user?.client_id) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/client-portal/editorial-calendar?year=${currentYear}&month=${currentMonth}`
      );
      const data = await res.json();
      setEntries(Array.isArray(data.entries) ? data.entries : []);
    } catch { setEntries([]); }
    finally { setIsLoading(false); }
  }

  function openEntry(entry: CalendarEntry) {
    setSelectedEntry(entry);
    setShowDetailModal(true);
  }

  // Navigation
  function prevMonth() {
    if (currentMonth === 1) { setCurrentMonth(12); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  }
  function nextMonth() {
    if (currentMonth === 12) { setCurrentMonth(1); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  }

  // Filtres
  const filtered = entries.filter(e => {
    if (filterStatus && e.status !== filterStatus) return false;
    if (filterPillar && e.pillar !== filterPillar) return false;
    return true;
  });

  // Stats
  const pillarStats = displayedPiliers.map(p => {
    const count = filtered.filter(e => e.pillar === p.key).length;
    const pct = filtered.length > 0 ? Math.round((count / filtered.length) * 100) : 0;
    return { key: p.key, label: p.label, count, pct };
  });

  const totalPublished = filtered.filter(e => e.status === 'published').length;
  const totalScheduled = filtered.filter(e => e.status === 'scheduled').length;

  // Grille calendrier
  function buildCalendarGrid() {
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    let startDow = firstDay.getDay();
    startDow = startDow === 0 ? 6 : startDow - 1;
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }

  const calendarCells = buildCalendarGrid();

  function entriesForDay(day: number) {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return filtered.filter(e => e.publish_date === dateStr);
  }

  function buildWeekView() {
    const startOfWeek = new Date(today);
    const dow = today.getDay() === 0 ? 6 : today.getDay() - 1;
    startOfWeek.setDate(today.getDate() - dow);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const str = d.toISOString().slice(0,10);
      days.push({ date: d, str, entries: filtered.filter(e => e.publish_date === str) });
    }
    return days;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        {/* Ligne 1 : titre + nav mois + toggle vue */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-4">

          {/* Titre — desktop seulement */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900">Calendrier Éditorial</h1>
              <p className="text-xs text-gray-500">Vos publications planifiées</p>
            </div>
          </div>

          {/* Navigation mois — centré sur mobile */}
          <div className="flex items-center gap-1 sm:gap-2 sm:ml-auto">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-colors text-gray-700">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold px-2 sm:px-3 min-w-[120px] sm:min-w-[140px] text-center text-gray-900">
              {MONTHS_FR[currentMonth - 1]} {currentYear}
            </span>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-colors text-gray-700">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View mode */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-100 rounded-xl p-1 ml-auto sm:ml-0">
            {(['month', 'week', 'list'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === mode ? 'bg-white text-orange-600 shadow-md' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode === 'month' ? 'Mois' : mode === 'week' ? <span className="hidden sm:inline">Semaine</span> : 'Liste'}
                {mode === 'week' && <span className="sm:hidden">Sem.</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Filtres — scroll horizontal sur mobile */}
        <div className="px-3 sm:px-6 pb-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          {Object.entries(STATUSES).map(([key, s]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(filterStatus === key ? null : key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                filterStatus === key
                  ? `${s.bg} ${s.color} ${s.border} shadow-sm`
                  : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              {React.createElement(s.icon, { className: 'w-3 h-3' })}
              {s.label}
            </button>
          ))}
          <div className="w-px h-4 bg-gray-300 mx-1 flex-shrink-0" />
          {displayedPiliers.map(p => {
            const pc = getPillarColorDynamic(p.key);
            return (
              <button
                key={p.key}
                onClick={() => setFilterPillar(filterPillar === p.key ? null : p.key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  filterPillar === p.key
                    ? `${pc.light} ${pc.text} border-current shadow-sm`
                    : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${pc.dot}`} />
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 sm:p-6">
        <div className="flex gap-6">
          {/* Panneau gauche : Stats — masqué sur mobile */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-4">
            {/* KPIs */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Ce mois</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total posts</span>
                  <span className="text-lg font-black text-gray-900">{filtered.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Publiés</span>
                  <span className="text-lg font-black text-green-600">{totalPublished}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Planifiés</span>
                  <span className="text-lg font-black text-orange-600">{totalScheduled}</span>
                </div>
              </div>
            </div>

            {/* Répartition piliers */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <PieChart className="w-4 h-4 text-gray-500" />
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Piliers</h3>
              </div>
              <div className="space-y-2">
                {pillarStats.filter(p => p.count > 0).map(p => {
                  const pc = getPillarColor(p.key);
                  return (
                    <div key={p.key}>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-xs font-semibold ${pc.text}`}>{p.label}</span>
                        <span className="text-xs text-gray-600">{p.count} ({p.pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${p.pct}%` }}
                          className={`h-full bg-gradient-to-r ${pc.gradient} rounded-full`}
                        />
                      </div>
                    </div>
                  );
                })}
                {pillarStats.every(p => p.count === 0) && (
                  <p className="text-xs text-gray-500 text-center py-2">Aucun post ce mois</p>
                )}
              </div>
            </div>

            {/* Équilibre plateformes */}
            {filtered.length > 0 && (
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart2 className="w-4 h-4 text-gray-500" />
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Plateformes</h3>
                </div>
                <div className="space-y-1.5">
                  {Object.entries(PLATFORMS).map(([key, p]) => {
                    const count = filtered.filter(e => e.platform === key).length;
                    if (!count) return null;
                    const Icon = p.icon;
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${p.color}`} />
                        <span className="text-xs text-gray-600 flex-1">{p.label}</span>
                        <span className="text-xs font-bold text-gray-900">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Conseil stratégique */}
            {filtered.length > 0 && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  <h3 className="text-xs font-black text-yellow-700 uppercase tracking-widest">Conseil</h3>
                </div>
                {(() => {
                  const promoCount = filtered.filter(e => e.pillar === 'promotion').length;
                  const total = filtered.length;
                  const promoRatio = total > 0 ? promoCount / total : 0;
                  if (promoRatio > 0.4)
                    return <p className="text-xs text-gray-700">Trop de posts promotionnels ({Math.round(promoRatio*100)}%). Pensez à équilibrer avec du contenu éducatif et inspirant.</p>;
                  if (total < 8)
                    return <p className="text-xs text-gray-700">Vous avez {total} posts ce mois. Visez 12-16 pour une présence régulière.</p>;
                  return <p className="text-xs text-gray-700">Bon équilibre éditorial ! Continuez sur cette lancée.</p>;
                })()}
              </div>
            )}
          </aside>

          {/* Zone calendrier */}
          <div className="flex-1 min-w-0 w-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Vue Mois */}
                {viewMode === 'month' && (
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                      {DAYS_FR.map(d => (
                        <div key={d} className="py-2 sm:py-3 text-center text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-widest">
                          {d.slice(0, 1)}<span className="hidden sm:inline">{d.slice(1)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7">
                      {calendarCells.map((day, i) => {
                        const dayEntries = day ? entriesForDay(day) : [];
                        const isToday = day === today.getDate() && currentMonth === today.getMonth() + 1 && currentYear === today.getFullYear();
                        return (
                          <div
                            key={i}
                            className={`min-h-[56px] sm:min-h-[120px] p-1 sm:p-3 border-r border-b border-gray-200 last:border-r-0 transition-colors ${
                              day ? 'bg-white' : 'bg-gray-50'
                            } ${isToday ? 'bg-orange-50 ring-2 ring-inset ring-orange-300' : ''}`}
                          >
                            {day && (
                              <> {/* Mobile: date + dot indicator only; desktop: full cards */}
                                <div className="flex items-center justify-between mb-1 sm:mb-2">
                                  <span className={`text-xs sm:text-sm font-bold w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center rounded-full ${
                                    isToday
                                      ? 'bg-orange-600 text-white shadow-md'
                                      : 'text-gray-700'
                                  }`}>
                                    {day}
                                  </span>
                                  {dayEntries.length > 0 && (
                                    <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 bg-gray-100 px-1 sm:px-2 py-0.5 rounded-full">{dayEntries.length}</span>
                                  )}
                                </div>
                                {/* Mobile: dots only */}
                                {dayEntries.length > 0 && (
                                  <div className="flex flex-wrap gap-0.5 sm:hidden">
                                    {dayEntries.slice(0, 3).map(entry => {
                                      const pc = getPillarColorDynamic(entry.pillar);
                                      return (
                                        <button
                                          key={entry.id}
                                          onClick={() => openEntry(entry)}
                                          className={`w-2 h-2 rounded-full ${pc.dot}`}
                                        />
                                      );
                                    })}
                                  </div>
                                )}
                                {/* Desktop: full cards */}
                                <div className="hidden sm:block space-y-1.5">
                                  {dayEntries.slice(0, 2).map(entry => {
                                    const pc = getPillarColorDynamic(entry.pillar);
                                    const StatusIcon = STATUSES[entry.status]?.icon || Lightbulb;
                                    const plt = PLATFORMS[entry.platform];
                                    const PlatIcon = plt?.icon || Globe;
                                    return (
                                      <motion.div
                                        key={entry.id}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => openEntry(entry)}
                                        className={`group relative overflow-hidden rounded-xl cursor-pointer border-2 transition-all ${pc.light} border-current/20 hover:border-current/60 hover:shadow-lg`}
                                      >
                                        {entry.thumbnail_url ? (
                                          <div className="relative h-16">
                                            <img src={entry.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                            <div className="absolute bottom-1 left-1 right-1">
                                              <div className="flex items-center gap-1 mb-0.5">
                                                <StatusIcon className="w-2.5 h-2.5 text-white drop-shadow" />
                                                <PlatIcon className={`w-2.5 h-2.5 ${plt?.color} drop-shadow`} />
                                              </div>
                                              <p className="text-[10px] font-bold text-white drop-shadow line-clamp-1">{entry.title}</p>
                                              {entry.publish_time && (
                                                <p className="text-[8px] text-white/80 drop-shadow">{entry.publish_time.slice(0,5)}</p>
                                              )}
                                            </div>
                                          </div>
                                        ) : (
                                          <div className={`p-2 ${pc.light}`}>
                                            <div className="flex items-center gap-1 mb-0.5">
                                              <StatusIcon className={`w-2.5 h-2.5 ${pc.text}`} />
                                              <PlatIcon className={`w-2.5 h-2.5 ${plt?.color}`} />
                                            </div>
                                            <p className={`text-[10px] font-semibold ${pc.text} line-clamp-2 leading-tight`}>{entry.title}</p>
                                            {entry.publish_time && (
                                              <p className="text-[9px] opacity-60 mt-0.5">{entry.publish_time.slice(0,5)}</p>
                                            )}
                                          </div>
                                        )}
                                      </motion.div>
                                    );
                                  })}
                                  {dayEntries.length > 2 && (
                                    <div className="text-center py-1.5 bg-gray-100 rounded-lg border border-gray-200">
                                      <p className="text-[10px] text-gray-600 font-semibold">+{dayEntries.length - 2} autres</p>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Vue Semaine */}
                {viewMode === 'week' && (
                  <div className="grid grid-cols-7 gap-3">
                    {buildWeekView().map(({ date, str, entries: dayEntries }) => {
                      const isToday = str === today.toISOString().slice(0,10);
                      return (
                        <div key={str} className={`bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm ${isToday ? 'ring-2 ring-orange-400' : ''}`}>
                          <div className={`p-3 text-center border-b border-gray-200 ${isToday ? 'bg-orange-50' : 'bg-gray-50'}`}>
                            <p className="text-xs text-gray-600 uppercase font-bold">{DAYS_FR[date.getDay() === 0 ? 6 : date.getDay() - 1]}</p>
                            <p className={`text-xl font-black ${isToday ? 'text-orange-600' : 'text-gray-900'}`}>{date.getDate()}</p>
                          </div>
                          <div className="p-2 space-y-2 min-h-[200px]">
                            {dayEntries.map(entry => {
                              const pc = getPillarColorDynamic(entry.pillar);
                              const plt = PLATFORMS[entry.platform];
                              const PlatIcon = plt?.icon || Globe;
                              return (
                                <motion.div
                                  key={entry.id}
                                  whileHover={{ scale: 1.02 }}
                                  onClick={() => openEntry(entry)}
                                  className={`group relative overflow-hidden rounded-xl cursor-pointer border-2 transition-all ${entry.thumbnail_url ? '' : pc.light} border-current/20 hover:border-current/60`}
                                >
                                  {entry.thumbnail_url ? (
                                    <div className="relative h-20">
                                      <img src={entry.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                      <div className="absolute bottom-2 left-2 right-2">
                                        <div className="flex items-center gap-1 mb-1">
                                          <PlatIcon className={`w-3 h-3 ${plt?.color} drop-shadow`} />
                                        </div>
                                        <p className="text-xs font-bold text-white drop-shadow line-clamp-1">{entry.title}</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="p-2">
                                      <div className="flex items-center gap-1 mb-1">
                                        <PlatIcon className={`w-3 h-3 ${plt?.color}`} />
                                      </div>
                                      <p className={`text-[11px] font-bold ${pc.text} line-clamp-2`}>{entry.title}</p>
                                    </div>
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Vue Liste */}
                {viewMode === 'list' && (
                  <div className="space-y-3">
                    {filtered.map(entry => {
                      const pc = getPillarColorDynamic(entry.pillar);
                      const plt = PLATFORMS[entry.platform];
                      const PlatIcon = plt?.icon || Globe;
                      const StatusIcon = STATUSES[entry.status]?.icon || Lightbulb;
                      return (
                        <motion.div
                          key={entry.id}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => openEntry(entry)}
                          className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-4 p-4">
                            {entry.thumbnail_url ? (
                              <img src={entry.thumbnail_url} alt="" className="w-24 h-24 object-cover rounded-xl" />
                            ) : (
                              <div className={`w-24 h-24 ${pc.light} rounded-xl flex items-center justify-center`}>
                                <FileText className={`w-10 h-10 ${pc.text}`} />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 text-xs font-bold rounded-lg ${plt?.bg} ${plt?.color} flex items-center gap-1`}>
                                  <PlatIcon className="w-3 h-3" />
                                  {plt?.label}
                                </span>
                                <span className={`px-2 py-1 text-xs font-bold rounded-lg ${STATUSES[entry.status]?.bg} ${STATUSES[entry.status]?.color} flex items-center gap-1`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {STATUSES[entry.status]?.label}
                                </span>
                              </div>
                              <h3 className="font-bold text-gray-900 mb-1">{entry.title}</h3>
                              <p className="text-sm text-gray-600">
                                {new Date(entry.publish_date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                {entry.publish_time && ` à ${entry.publish_time.slice(0,5)}`}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    {filtered.length === 0 && (
                      <div className="text-center py-12 bg-white rounded-xl">
                        <p className="text-gray-500">Aucune publication ce mois</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal détails - LECTURE SEULE */}
      <AnimatePresence>
        {showDetailModal && selectedEntry && (() => {
          const pc = getPillarColorDynamic(selectedEntry.pillar);
          const st = STATUSES[selectedEntry.status];
          const plt = PLATFORMS[selectedEntry.platform];
          const PlatIcon = plt?.icon || Globe;
          const obj = OBJECTIVES[selectedEntry.objective];
          const ObjIcon = obj?.icon || Target;
          const StatusIcon = st?.icon || Lightbulb;
          const pillarLabel = displayedPiliers.find(p => p.key === selectedEntry.pillar)?.label || selectedEntry.pillar;
          const ctMap: Record<string, { label: string; bg: string; color: string }> = {
            video:    { label: 'Vidéo',    bg: 'bg-blue-50',   color: 'text-blue-700'   },
            post:     { label: 'Post',     bg: 'bg-gray-100',  color: 'text-gray-700'   },
            carousel: { label: 'Carousel', bg: 'bg-violet-50', color: 'text-violet-700' },
          };
          const ct = ctMap[selectedEntry.content_type] || { label: selectedEntry.content_type, bg: 'bg-gray-100', color: 'text-gray-700' };

          return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDetailModal(false)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto"
              >
                {/* Header */}
                {selectedEntry.thumbnail_url ? (
                  <div className="relative h-52 overflow-hidden rounded-t-3xl">
                    <img src={selectedEntry.thumbnail_url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-6 right-14">
                      <h2 className="text-xl font-black text-white drop-shadow-lg leading-tight">{selectedEntry.title}</h2>
                      <p className="text-white/70 text-xs mt-1">#{selectedEntry.id}</p>
                    </div>
                    <button onClick={() => setShowDetailModal(false)} className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 text-white rounded-xl transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                      <h2 className="text-xl font-black text-gray-900 leading-tight">{selectedEntry.title}</h2>
                      <p className="text-gray-400 text-xs mt-1">Post #{selectedEntry.id}</p>
                    </div>
                    <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 text-gray-500 rounded-xl transition-colors ml-4 shrink-0">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <div className="p-6 space-y-5">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r ${pc.gradient} text-white shadow-sm`}>
                      <span className="w-1.5 h-1.5 bg-white/70 rounded-full" />{pillarLabel}
                    </span>
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${st?.bg} ${st?.color} border ${st?.border}`}>
                      <StatusIcon className="w-3 h-3" />{st?.label}
                    </span>
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${plt?.bg} ${plt?.color}`}>
                      <PlatIcon className="w-3 h-3" />{plt?.label || selectedEntry.platform}
                    </span>
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 ${obj?.color}`}>
                      <ObjIcon className="w-3 h-3" />{obj?.label || selectedEntry.objective}
                    </span>
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${ct.bg} ${ct.color}`}>
                      {ct.label}
                    </span>
                  </div>

                  {/* Grille infos */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />Date de publication
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(selectedEntry.publish_date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      {selectedEntry.publish_time && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{selectedEntry.publish_time.slice(0,5)}
                        </p>
                      )}
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Plateforme & Type</p>
                      <p className={`text-sm font-bold flex items-center gap-1.5 ${plt?.color || 'text-gray-900'}`}>
                        <PlatIcon className="w-4 h-4" />{plt?.label || selectedEntry.platform}
                      </p>
                      <p className={`text-xs mt-1 ${ct.color}`}>{ct.label}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                        <ObjIcon className="w-3 h-3" />Objectif
                      </p>
                      <p className={`text-sm font-bold ${obj?.color || 'text-gray-900'}`}>{obj?.label || selectedEntry.objective}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Pilier éditorial</p>
                      <p className={`text-sm font-bold ${pc.text}`}>{pillarLabel}</p>
                    </div>
                  </div>

                  {/* Persona */}
                  {selectedEntry.persona && (
                    <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
                      <div className="p-2 bg-indigo-100 rounded-xl shrink-0"><Users className="w-4 h-4 text-indigo-600" /></div>
                      <div>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Persona ciblé</p>
                        <p className="text-sm font-bold text-indigo-900">{selectedEntry.persona}</p>
                      </div>
                    </div>
                  )}

                  {/* Intention stratégique */}
                  {selectedEntry.strategic_intent && (
                    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-purple-600" />
                        <h4 className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Intention stratégique</h4>
                      </div>
                      <p className="text-sm text-purple-900 italic leading-relaxed">"{selectedEntry.strategic_intent}"</p>
                    </div>
                  )}

                  {/* Description du contenu */}
                  {selectedEntry.content_description && (
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <FileText className="w-3 h-3" />Description du contenu
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedEntry.content_description}</p>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedEntry.notes && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                      <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <MessageCircle className="w-3 h-3" />Notes
                      </h4>
                      <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-wrap">{selectedEntry.notes}</p>
                    </div>
                  )}

                  {/* Drive link */}
                  {selectedEntry.drive_link && (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-2xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-xl shrink-0"><ExternalLink className="w-4 h-4 text-green-700" /></div>
                        <div>
                          <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Fichier Drive / Assets</p>
                          <p className="text-xs text-green-800 font-medium mt-0.5 max-w-[240px] truncate">{selectedEntry.drive_link}</p>
                        </div>
                      </div>
                      <a href={selectedEntry.drive_link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all shrink-0">
                        <ExternalLink className="w-3.5 h-3.5" />Ouvrir
                      </a>
                    </div>
                  )}

                  {/* Thumbnail preview */}
                  {selectedEntry.thumbnail_url && !selectedEntry.thumbnail_url.startsWith('blob') && (
                    <div>
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Aperçu thumbnail</h4>
                      <img src={selectedEntry.thumbnail_url} alt={selectedEntry.title} className="w-full rounded-2xl border border-gray-200" />
                    </div>
                  )}
                </div>

                <div className="px-6 pb-6">
                  <button onClick={() => setShowDetailModal(false)}
                    className="w-full px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl transition-colors">
                    Fermer
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
