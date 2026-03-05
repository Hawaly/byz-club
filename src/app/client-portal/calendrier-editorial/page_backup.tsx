"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar, ChevronLeft, ChevronRight, Plus, X, Save,
  Instagram, Linkedin, Video, Globe, Trash2, Edit3,
  Target, Users, FileText, LayoutGrid, List, Filter,
  Sparkles, TrendingUp, Eye, MessageCircle, Zap, Star,
  Clock, CheckCircle2, AlertCircle, PlayCircle, Lightbulb,
  BarChart2, PieChart, ChevronDown, Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PilierContenu } from '@/types/database';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Client {
  id: number;
  name: string;
  company_name?: string;
}

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
  client?: Client;
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

// ─── Composant principal ──────────────────────────────────────────────────────

export default function CalendrierPage() {
  const today = new Date();
  const [currentYear, setCurrentYear]   = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [viewMode, setViewMode]         = useState<'month' | 'week' | 'list'>('month');
  const [clients, setClients]           = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [entries, setEntries]           = useState<CalendarEntry[]>([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEntry, setSelectedEntry]     = useState<CalendarEntry | null>(null);
  const [isEditing, setIsEditing]       = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPillar, setFilterPillar] = useState<string | null>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [strategyId, setStrategyId] = useState<number | null>(null);
  const [piliers, setPiliers] = useState<PilierContenu[]>([]);
  const [scripts, setScripts] = useState<Array<{ id: number; title: string }>>([]);

  const emptyForm: {
    title: string; publish_date: string; publish_time: string; platform: string;
    objective: string; strategic_intent: string; pillar: string;
    persona: string; status: 'idea' | 'production' | 'scheduled' | 'published';
    notes: string; thumbnail_url: string; content_type: 'video' | 'post' | 'carousel';
    drive_link: string; content_description: string; script_id: string;
  } = {
    title: '', publish_date: '', publish_time: '', platform: 'instagram',
    objective: 'engagement', strategic_intent: '', pillar: 'education',
    persona: '', status: 'idea', notes: '', thumbnail_url: '',
    content_type: 'post', drive_link: '', content_description: '', script_id: '',
  };
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  // ─── Piliers affichés (stratégie ou défaut) ───────────────────────────────
  
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

  // ─── Chargement ────────────────────────────────────────────────────────────

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      loadStrategyAndPiliers();
      loadScripts();
    }
  }, [selectedClient]);

  useEffect(() => {
    if (selectedClient) loadEntries();
  }, [selectedClient, currentYear, currentMonth]);

  async function loadClients() {
    try {
      const response = await fetch('/api/calendrier/clients');
      const { clients } = await response.json();
      if (clients) setClients(clients);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  }

  async function loadStrategyAndPiliers() {
    if (!selectedClient) return;
    
    try {
      // Récupérer la stratégie active du client
      console.log('[Calendrier] Chargement stratégie pour client:', selectedClient.id);
      const response = await fetch(`/api/calendrier/strategy?client_id=${selectedClient.id}`);
      const { strategy } = await response.json();
      console.log('[Calendrier] Stratégie reçue:', strategy);

      if (strategy) {
        setStrategyId(strategy.id);
        // Charger les piliers de cette stratégie via API
        console.log('[Calendrier] Chargement piliers pour stratégie:', strategy.id);
        const piliersResponse = await fetch(`/api/calendrier/piliers?strategy_id=${strategy.id}`);
        const { piliers: piliersData } = await piliersResponse.json();
        console.log('[Calendrier] Piliers reçus:', piliersData);
        setPiliers(piliersData || []);
      } else {
        console.log('[Calendrier] Pas de stratégie validée - utilisation piliers par défaut');
        setStrategyId(null);
        setPiliers([]);
      }
    } catch (error) {
      console.error('Erreur chargement stratégie/piliers:', error);
      setPiliers([]);
    }
  }

  async function loadScripts() {
    if (!selectedClient) return;
    
    try {
      const response = await fetch(`/api/calendrier/scripts?client_id=${selectedClient.id}`);
      const { scripts: scriptsData } = await response.json();
      setScripts(scriptsData || []);
    } catch (error) {
      console.error('Erreur chargement scripts:', error);
      setScripts([]);
    }
  }

  async function loadEntries() {
    if (!selectedClient) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/editorial-calendar?client_id=${selectedClient.id}&year=${currentYear}&month=${currentMonth}`
      );
      const data = await res.json();
      setEntries(Array.isArray(data.entries) ? data.entries : []);
    } catch { setEntries([]); }
    finally { setIsLoading(false); }
  }

  // ─── CRUD ──────────────────────────────────────────────────────────────────

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedClient) return;
    if (!form.title || !form.publish_date || !form.pillar) {
      alert('Titre, date et pilier sont obligatoires');
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch('/api/editorial-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, client_id: selectedClient.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShowCreateModal(false);
      setForm(emptyForm);
      loadEntries();
    } catch (err: any) { alert(err.message); }
    finally { setIsSaving(false); }
  }

  async function handleUpdate() {
    if (!selectedEntry) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/editorial-calendar?id=${selectedEntry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShowDetailModal(false);
      setIsEditing(false);
      setSelectedEntry(null);
      loadEntries();
    } catch (err: any) { alert(err.message); }
    finally { setIsSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer cette entrée du calendrier ?')) return;
    try {
      await fetch(`/api/editorial-calendar?id=${id}`, { method: 'DELETE' });
      setShowDetailModal(false);
      setSelectedEntry(null);
      loadEntries();
    } catch {}
  }

  async function handleStatusChange(id: number, status: string) {
    try {
      await fetch(`/api/editorial-calendar?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      loadEntries();
    } catch {}
  }

  function openEntry(entry: CalendarEntry) {
    setSelectedEntry(entry);
    setForm({
      title: entry.title, publish_date: entry.publish_date,
      publish_time: entry.publish_time || '', platform: entry.platform,
      objective: entry.objective, strategic_intent: entry.strategic_intent || '',
      pillar: entry.pillar, persona: entry.persona || '',
      status: entry.status, notes: entry.notes || '',
      thumbnail_url: entry.thumbnail_url || '',
      content_type: entry.content_type || 'post',
      drive_link: entry.drive_link || '',
      content_description: entry.content_description || '',
      script_id: entry.script_id?.toString() || '',
    });
    setIsEditing(false);
    setShowDetailModal(true);
  }

  function openCreateOnDate(dateStr: string) {
    setForm({ ...emptyForm, publish_date: dateStr });
    setShowCreateModal(true);
  }

  // ─── Navigation mois ───────────────────────────────────────────────────────

  function prevMonth() {
    if (currentMonth === 1) { setCurrentMonth(12); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  }
  function nextMonth() {
    if (currentMonth === 12) { setCurrentMonth(1); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  }

  // ─── Données filtrées ──────────────────────────────────────────────────────

  const filtered = entries.filter(e => {
    if (filterStatus && e.status !== filterStatus) return false;
    if (filterPillar && e.pillar !== filterPillar) return false;
    return true;
  });

  const filteredClients = clients.filter(c =>
    (c.company_name || c.name).toLowerCase().includes(clientSearch.toLowerCase())
  );

  // ─── Stats ─────────────────────────────────────────────────────────────────

  const pillarStats = displayedPiliers.map(p => {
    const count = filtered.filter(e => e.pillar === p.key).length;
    const pct = filtered.length > 0 ? Math.round((count / filtered.length) * 100) : 0;
    return { key: p.key, label: p.label, count, pct };
  });

  const totalPublished = filtered.filter(e => e.status === 'published').length;
  const totalScheduled = filtered.filter(e => e.status === 'scheduled').length;

  // ─── Grille calendrier ─────────────────────────────────────────────────────

  function buildCalendarGrid() {
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    let startDow = firstDay.getDay(); // 0=Sun
    startDow = startDow === 0 ? 6 : startDow - 1; // Convert to Mon=0
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

  // ─── Vue liste ─────────────────────────────────────────────────────────────

  function buildWeekView() {
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
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

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex items-center gap-4 flex-wrap">
          {/* Titre */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900">Calendrier Éditorial</h1>
              <p className="text-xs text-gray-500">Stratégie de contenu mensuelle</p>
            </div>
          </div>

          {/* Sélecteur client */}
          <div className="relative ml-4">
            <button
              onClick={() => setShowClientDropdown(!showClientDropdown)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-semibold ${
                selectedClient
                  ? 'bg-purple-50 border-purple-300 text-purple-900'
                  : 'bg-gray-50 border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              <Users className="w-4 h-4" />
              {selectedClient ? (selectedClient.company_name || selectedClient.name) : 'Choisir un client'}
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            <AnimatePresence>
              {showClientDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  className="absolute top-full mt-2 left-0 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                      <Search className="w-3.5 h-3.5 text-gray-400" />
                      <input
                        autoFocus
                        value={clientSearch}
                        onChange={e => setClientSearch(e.target.value)}
                        placeholder="Rechercher un client..."
                        className="bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none flex-1"
                      />
                    </div>
                  </div>
                  <div className="max-h-56 overflow-y-auto py-1">
                    {filteredClients.map(c => (
                      <button
                        key={c.id}
                        onClick={() => { setSelectedClient(c); setShowClientDropdown(false); setClientSearch(''); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left ${
                          selectedClient?.id === c.id ? 'bg-purple-50 text-purple-900' : 'text-gray-700'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                          {(c.company_name || c.name)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{c.company_name || c.name}</p>
                          {c.company_name && <p className="text-xs text-gray-400">{c.name}</p>}
                        </div>
                      </button>
                    ))}
                    {filteredClients.length === 0 && (
                      <p className="text-center text-sm text-gray-500 py-4">Aucun client trouvé</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation mois */}
          {selectedClient && (
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-700">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold px-3 min-w-[140px] text-center text-gray-900">
                {MONTHS_FR[currentMonth - 1]} {currentYear}
              </span>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-700">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* View mode */}
          {selectedClient && (
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              {(['month', 'week', 'list'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === mode ? 'bg-white text-purple-600 shadow-md' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode === 'month' ? 'Mois' : mode === 'week' ? 'Semaine' : 'Liste'}
                </button>
              ))}
            </div>
          )}

          {/* Créer */}
          {selectedClient && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
            >
              <Plus className="w-4 h-4" />
              Nouveau post
            </motion.button>
          )}
        </div>

        {/* Filtres */}
        {selectedClient && (
          <div className="px-6 pb-3 flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            {Object.entries(STATUSES).map(([key, s]) => (
              <button
                key={key}
                onClick={() => setFilterStatus(filterStatus === key ? null : key)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  filterStatus === key
                    ? `${s.bg} ${s.color} ${s.border} shadow-sm`
                    : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {React.createElement(s.icon, { className: 'w-3 h-3' })}
                {s.label}
              </button>
            ))}
            <div className="w-px h-4 bg-gray-300 mx-1" />
            {displayedPiliers.map(p => {
              const pc = getPillarColorDynamic(p.key);
              return (
                <button
                  key={p.key}
                  onClick={() => setFilterPillar(filterPillar === p.key ? null : p.key)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
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
        )}
      </div>

      <div className="p-6">
        {/* ── État vide : pas de client ────────────────────────────────────── */}
        {!selectedClient && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="w-28 h-28 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mb-6 border-2 border-purple-200 shadow-lg">
              <Calendar className="w-14 h-14 text-purple-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">Choisissez un client</h2>
            <p className="text-gray-600 max-w-md mb-8 text-base">
              Sélectionnez un client dans la barre de navigation pour accéder à son calendrier éditorial et construire sa stratégie de contenu.
            </p>
            <button
              onClick={() => setShowClientDropdown(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <Users className="w-5 h-5" />
              Choisir un client
            </button>
          </motion.div>
        )}

        {/* ── Contenu principal ────────────────────────────────────────────── */}
        {selectedClient && (
          <div className="flex gap-6">

            {/* ── Panneau gauche : Stats ─────────────────────────────────── */}
            <aside className="w-64 shrink-0 space-y-4">
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
                    <span className="text-lg font-black text-purple-600">{totalScheduled}</span>
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

            {/* ── Zone calendrier ───────────────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {/* Vue Mois */}
                  {viewMode === 'month' && (
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                      {/* Jours de la semaine */}
                      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                        {DAYS_FR.map(d => (
                          <div key={d} className="py-3 text-center text-xs font-black text-gray-700 uppercase tracking-widest">
                            {d}
                          </div>
                        ))}
                      </div>
                      {/* Cellules */}
                      <div className="grid grid-cols-7">
                        {calendarCells.map((day, i) => {
                          const dayEntries = day ? entriesForDay(day) : [];
                          const isToday = day === today.getDate() && currentMonth === today.getMonth() + 1 && currentYear === today.getFullYear();
                          const dateStr = day ? `${currentYear}-${String(currentMonth).padStart(2,'0')}-${String(day).padStart(2,'0')}` : '';
                          return (
                            <div
                              key={i}
                              className={`min-h-[120px] p-3 border-r border-b border-gray-200 last:border-r-0 transition-colors group ${
                                day ? 'hover:bg-purple-50 cursor-pointer bg-white' : 'bg-gray-50'
                              } ${isToday ? 'bg-purple-50 ring-2 ring-inset ring-purple-300' : ''}`}
                              onClick={() => day && openCreateOnDate(dateStr)}
                            >
                              {day && (
                                <>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                                      isToday
                                        ? 'bg-purple-600 text-white shadow-md'
                                        : 'text-gray-700 group-hover:bg-purple-100'
                                    }`}>
                                      {day}
                                    </span>
                                    {dayEntries.length > 0 && (
                                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{dayEntries.length}</span>
                                    )}
                                  </div>
                                  <div className="space-y-1.5">
                                    {dayEntries.slice(0, 2).map(entry => {
                                      const pc = getPillarColorDynamic(entry.pillar);
                                      const StatusIcon = STATUSES[entry.status]?.icon || Lightbulb;
                                      const plt = PLATFORMS[entry.platform];
                                      const PlatIcon = plt?.icon || Globe;
                                      return (
                                        <motion.div
                                          key={entry.id}
                                          whileHover={{ scale: 1.02 }}
                                          onClick={e => { e.stopPropagation(); openEntry(entry); }}
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
                          <div key={str} className={`bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm ${isToday ? 'ring-2 ring-purple-400' : ''}`}>
                            <div className={`p-3 text-center border-b border-gray-200 ${isToday ? 'bg-purple-50' : 'bg-gray-50'}`}>
                              <p className="text-xs text-gray-600 uppercase font-bold">{DAYS_FR[date.getDay() === 0 ? 6 : date.getDay() - 1]}</p>
                              <p className={`text-xl font-black ${isToday ? 'text-purple-600' : 'text-gray-900'}`}>{date.getDate()}</p>
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
                              <button
                                onClick={() => openCreateOnDate(str)}
                                className="w-full p-1.5 border border-dashed border-gray-300 rounded-lg text-[10px] text-gray-500 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all font-semibold"
                              >
                                + Ajouter
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Vue Liste */}
                  {viewMode === 'list' && (
                    <div className="space-y-3">
                      {filtered.length === 0 && (
                        <div className="text-center py-16 text-gray-500">
                          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                          <p className="font-medium">Aucun post ce mois-ci</p>
                        </div>
                      )}
                      {filtered.map(entry => {
                        const pc = getPillarColorDynamic(entry.pillar);
                        const st = STATUSES[entry.status];
                        const StatusIcon = st?.icon || Lightbulb;
                        const plt = PLATFORMS[entry.platform];
                        const PlatIcon = plt?.icon || Globe;
                        const obj = OBJECTIVES[entry.objective];
                        const ObjIcon = obj?.icon || Target;
                        return (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ x: 4 }}
                            onClick={() => openEntry(entry)}
                            className="group flex items-center gap-4 bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-2xl overflow-hidden cursor-pointer transition-all shadow-sm hover:shadow-md"
                          >
                            {entry.thumbnail_url ? (
                              <div className="relative w-24 h-24 shrink-0">
                                <img src={entry.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                <div className={`absolute inset-0 bg-gradient-to-br ${pc.gradient} opacity-20`} />
                              </div>
                            ) : (
                              <div className={`w-2 self-stretch rounded-r-full bg-gradient-to-b ${pc.gradient}`} />
                            )}
                            <div className="flex-1 min-w-0 p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${pc.text} ${pc.light} px-2 py-1 rounded-full shadow-sm`}>
                                  {displayedPiliers.find(p => p.key === entry.pillar)?.label || entry.pillar}
                                </span>
                                <span className={`flex items-center gap-1 text-[10px] font-semibold ${st?.color} ${st?.bg} ${st?.border} border px-2 py-1 rounded-full shadow-sm`}>
                                  <StatusIcon className="w-2.5 h-2.5" />
                                  {st?.label}
                                </span>
                              </div>
                              <p className="font-bold text-gray-900 text-base group-hover:text-purple-600 transition-colors truncate">{entry.title}</p>
                              {entry.strategic_intent && (
                                <p className="text-xs text-gray-600 mt-1 truncate italic">"{entry.strategic_intent}"</p>
                              )}
                              <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {new Date(entry.publish_date + 'T00:00:00').toLocaleDateString('fr-FR', { day:'numeric', month:'short' })}
                                  {entry.publish_time && ` · ${entry.publish_time.slice(0,5)}`}
                                </span>
                                <span className={`flex items-center gap-1 text-xs font-semibold ${plt?.color}`}>
                                  <PlatIcon className="w-3.5 h-3.5" />
                                  {plt?.label}
                                </span>
                                <span className={`flex items-center gap-1 text-xs font-semibold ${obj?.color}`}>
                                  <ObjIcon className="w-3.5 h-3.5" />
                                  {obj?.label}
                                </span>
                                {entry.persona && (
                                  <span className="flex items-center gap-1 text-xs text-gray-600">
                                    <Users className="w-3.5 h-3.5" />
                                    {entry.persona}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pr-4">
                              <button
                                onClick={e => { e.stopPropagation(); handleDelete(entry.id); }}
                                className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL CRÉATION
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showCreateModal && (
          <Modal onClose={() => setShowCreateModal(false)} title="Nouveau post">
            <EntryForm
              form={form}
              setForm={setForm}
              onSubmit={handleCreate}
              onCancel={() => setShowCreateModal(false)}
              isSaving={isSaving}
              submitLabel="Créer le post"
              displayedPiliers={displayedPiliers}
              getPillarColorDynamic={getPillarColorDynamic}
              scripts={scripts}
            />
          </Modal>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL DÉTAIL / ÉDITION
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showDetailModal && selectedEntry && (
          <Modal
            onClose={() => { setShowDetailModal(false); setIsEditing(false); setSelectedEntry(null); }}
            title={isEditing ? 'Modifier le post' : selectedEntry.title}
            wide
          >
            {!isEditing ? (
              <EntryDetail
                entry={selectedEntry}
                onEdit={() => setIsEditing(true)}
                onDelete={() => handleDelete(selectedEntry.id)}
                onStatusChange={(s) => handleStatusChange(selectedEntry.id, s)}
                onClose={() => { setShowDetailModal(false); setSelectedEntry(null); }}
                displayedPiliers={displayedPiliers}
                getPillarColorDynamic={getPillarColorDynamic}
              />
            ) : (
              <EntryForm
                form={form}
                setForm={setForm}
                onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}
                onCancel={() => setIsEditing(false)}
                isSaving={isSaving}
                submitLabel="Sauvegarder"
                displayedPiliers={displayedPiliers}
                getPillarColorDynamic={getPillarColorDynamic}
                scripts={scripts}
              />
            )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Composants UI ────────────────────────────────────────────────────────────

function Modal({ children, onClose, title, wide }: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  wide?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}
        className={`bg-white border border-gray-200 rounded-3xl shadow-2xl ${wide ? 'max-w-3xl' : 'max-w-2xl'} w-full max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-black text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}

// ─── Formulaire de création/édition ──────────────────────────────────────────

function EntryForm({ form, setForm, onSubmit, onCancel, isSaving, submitLabel, displayedPiliers, getPillarColorDynamic, scripts }: {
  form: {
    title: string; publish_date: string; publish_time: string; platform: string;
    objective: string; strategic_intent: string; pillar: string;
    persona: string; status: 'idea' | 'production' | 'scheduled' | 'published';
    notes: string; thumbnail_url: string; content_type: 'video' | 'post' | 'carousel';
    drive_link: string; content_description: string; script_id: string;
  };
  setForm: (f: typeof form) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSaving: boolean;
  submitLabel: string;
  displayedPiliers: Array<{ key: string; label: string; id: number | null; index: number }>;
  getPillarColorDynamic: (pillar: string) => { gradient: string; light: string; text: string; dot: string };
  scripts: Array<{ id: number; title: string }>;
}) {
  const inputCls = "w-full bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all";
  const labelCls = "block text-xs font-black text-gray-700 uppercase tracking-widest mb-2";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Titre */}
      <div>
        <label className={labelCls}>Titre du post *</label>
        <input
          required value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="Ex: 3 erreurs qui tuent votre personal branding"
          className={inputCls}
        />
      </div>

      {/* Date + Heure */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Date de publication *</label>
          <input
            required type="date" value={form.publish_date}
            onChange={e => setForm({ ...form, publish_date: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Heure (optionnel)</label>
          <input
            type="time" value={form.publish_time}
            onChange={e => setForm({ ...form, publish_time: e.target.value })}
            className={inputCls}
          />
        </div>
      </div>

      {/* Pilier (obligatoire) */}
      <div>
        <label className={labelCls}>Pilier de contenu *</label>
        <div className="grid grid-cols-3 gap-2">
          {displayedPiliers.map(p => {
            const pc = getPillarColorDynamic(p.key);
            const active = form.pillar === p.key;
            return (
              <button
                key={p.key} type="button"
                onClick={() => setForm({ ...form, pillar: p.key })}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  active
                    ? `bg-gradient-to-br ${pc.gradient} border-transparent text-white shadow-lg`
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <span className={`w-2 h-2 rounded-full inline-block mr-2 ${active ? 'bg-white' : pc.dot}`} />
                <span className="text-xs font-bold">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Type de contenu */}
      <div>
        <label className={labelCls}>Type de contenu *</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'video', label: '🎥 Vidéo', icon: Video },
            { value: 'post', label: '📝 Post', icon: FileText },
            { value: 'carousel', label: '🎠 Carousel', icon: LayoutGrid },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm({ ...form, content_type: value as 'video' | 'post' | 'carousel' })}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                form.content_type === value
                  ? 'bg-purple-500 border-purple-500 text-white shadow-lg'
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-purple-400'
              }`}
            >
              <Icon className={`w-5 h-5 mx-auto mb-1 ${form.content_type === value ? 'text-white' : 'text-gray-500'}`} />
              <span className="text-xs font-bold block">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Script vidéo (si type = vidéo) */}
      {form.content_type === 'video' && (
        <div>
          <label className={labelCls}>Script vidéo</label>
          <select
            value={form.script_id}
            onChange={e => setForm({ ...form, script_id: e.target.value })}
            className={inputCls + " cursor-pointer"}
          >
            <option value="">-- Sélectionner un script --</option>
            {scripts.map(script => (
              <option key={script.id} value={script.id}>
                {script.title}
              </option>
            ))}
          </select>
          {scripts.length === 0 && (
            <p className="text-xs text-amber-600 mt-2">⚠️ Aucun script disponible pour ce client</p>
          )}
        </div>
      )}

      {/* Description du contenu (post/carousel) */}
      {(form.content_type === 'post' || form.content_type === 'carousel') && (
        <div>
          <label className={labelCls}>Description du contenu</label>
          <textarea
            value={form.content_description}
            onChange={e => setForm({ ...form, content_description: e.target.value })}
            rows={3}
            placeholder={form.content_type === 'carousel' ? "Ex: Slide 1: Hook, Slide 2: Problème, Slide 3: Solution..." : "Ex: Texte du post, CTA, émojis..."}
            className={inputCls + " resize-none"}
          />
        </div>
      )}

      {/* Lien Google Drive */}
      <div>
        <label className={labelCls}>Lien Google Drive</label>
        <input
          type="url"
          value={form.drive_link}
          onChange={e => setForm({ ...form, drive_link: e.target.value })}
          placeholder="https://drive.google.com/..."
          className={inputCls}
        />
        <p className="text-xs text-gray-500 mt-2">📂 Lien vers les assets (images, vidéos, etc.)</p>
      </div>

      {/* Plateforme + Objectif */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Plateforme *</label>
          <select
            value={form.platform}
            onChange={e => setForm({ ...form, platform: e.target.value })}
            className={inputCls + " cursor-pointer"}
          >
            {Object.entries(PLATFORMS).map(([key, p]) => (
              <option key={key} value={key}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Objectif *</label>
          <select
            value={form.objective}
            onChange={e => setForm({ ...form, objective: e.target.value })}
            className={inputCls + " cursor-pointer"}
          >
            {Object.entries(OBJECTIVES).map(([key, o]) => (
              <option key={key} value={key}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Intention stratégique */}
      <div>
        <label className={labelCls}>Pourquoi ce post ? (intention stratégique)</label>
        <textarea
          value={form.strategic_intent}
          onChange={e => setForm({ ...form, strategic_intent: e.target.value })}
          rows={2}
          placeholder="Ex: Positionner le client comme expert, déclencher la confiance avant un CTA de vente..."
          className={inputCls + " resize-none"}
        />
      </div>

      {/* Persona + Statut */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Persona ciblé</label>
          <input
            value={form.persona}
            onChange={e => setForm({ ...form, persona: e.target.value })}
            placeholder="Ex: Entrepreneur 30-45 ans"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Statut</label>
          <select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value as 'idea' | 'production' | 'scheduled' | 'published' })}
            className={inputCls + " cursor-pointer"}
          >
            {Object.entries(STATUSES).map(([key, s]) => (
              <option key={key} value={key}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Thumbnail */}
      <div>
        <label className={labelCls}>Thumbnail / Visuel (URL)</label>
        <input
          type="url"
          value={form.thumbnail_url}
          onChange={e => setForm({ ...form, thumbnail_url: e.target.value })}
          placeholder="https://example.com/image.jpg"
          className={inputCls}
        />
        {form.thumbnail_url && (
          <div className="mt-3 relative rounded-xl overflow-hidden border-2 border-white/10">
            <img
              src={form.thumbnail_url}
              alt="Preview"
              className="w-full h-40 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <button
              type="button"
              onClick={() => setForm({ ...form, thumbnail_url: '' })}
              className="absolute top-2 right-2 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <p className="text-xs text-slate-500 mt-2">💡 Collez l'URL d'une image hébergée ou uploadez sur Imgur/Cloudinary</p>
      </div>

      {/* Notes */}
      <div>
        <label className={labelCls}>Notes internes</label>
        <textarea
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
          rows={2}
          placeholder="Idées de visuels, références, hashtags..."
          className={inputCls + " resize-none"}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button" onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-semibold text-sm transition-all"
        >
          Annuler
        </button>
        <motion.button
          type="submit" disabled={isSaving}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 transition-all"
        >
          {isSaving ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : <Save className="w-4 h-4" />}
          {isSaving ? 'Sauvegarde...' : submitLabel}
        </motion.button>
      </div>
    </form>
  );
}

// ─── Détail d'une entrée ──────────────────────────────────────────────────────

function EntryDetail({ entry, onEdit, onDelete, onStatusChange, onClose, displayedPiliers, getPillarColorDynamic }: {
  entry: CalendarEntry;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (s: string) => void;
  onClose: () => void;
  displayedPiliers: Array<{ key: string; label: string; id: number | null; index: number }>;
  getPillarColorDynamic: (pillar: string) => { gradient: string; light: string; text: string; dot: string };
}) {
  const pc = getPillarColorDynamic(entry.pillar);
  const st = STATUSES[entry.status];
  const plt = PLATFORMS[entry.platform];
  const PlatIcon = plt?.icon || Globe;
  const obj = OBJECTIVES[entry.objective];
  const ObjIcon = obj?.icon || Target;
  const StatusIcon = st?.icon || Lightbulb;

  return (
    <div className="space-y-5">
      {/* Thumbnail en hero */}
      {entry.thumbnail_url && (
        <div className="relative -m-6 mb-0 h-56 overflow-hidden">
          <img src={entry.thumbnail_url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-2xl font-black text-white drop-shadow-lg">{entry.title}</h2>
          </div>
        </div>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r ${pc.gradient} text-white`}>
          <span className="w-2 h-2 bg-white/60 rounded-full" />
          {displayedPiliers.find(p => p.key === entry.pillar)?.label || entry.pillar}
        </span>
        <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${st?.bg} ${st?.color} border ${st?.border}`}>
          <StatusIcon className="w-3 h-3" />
          {st?.label}
        </span>
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${plt?.bg} ${plt?.color}`}>
          <PlatIcon className="w-3 h-3" />
          {plt?.label}
        </span>
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/5 ${obj?.color}`}>
          <ObjIcon className="w-3 h-3" />
          {obj?.label}
        </span>
      </div>

      {/* Date + heure */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Calendar className="w-4 h-4" />
        <span>
          {new Date(entry.publish_date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
          {entry.publish_time && ` à ${entry.publish_time.slice(0,5)}`}
        </span>
      </div>

      {/* Intention stratégique */}
      {entry.strategic_intent && (
        <div className="bg-purple-600/10 border border-purple-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-black text-purple-400 uppercase tracking-widest">Intention stratégique</h4>
          </div>
          <p className="text-sm text-slate-300 italic">"{entry.strategic_intent}"</p>
        </div>
      )}

      {/* Persona */}
      {entry.persona && (
        <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
          <Users className="w-4 h-4 text-slate-400" />
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Persona ciblé</p>
            <p className="text-sm font-semibold text-white">{entry.persona}</p>
          </div>
        </div>
      )}

      {/* Notes */}
      {entry.notes && (
        <div className="bg-white/3 rounded-xl p-4 border border-white/5">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Notes</h4>
          <p className="text-sm text-slate-300">{entry.notes}</p>
        </div>
      )}

      {/* Changer statut */}
      <div>
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Changer le statut</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(STATUSES).map(([key, s]) => {
            const SIcon = s.icon;
            return (
              <button
                key={key}
                onClick={() => { onStatusChange(key); onClose(); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  entry.status === key
                    ? `${s.bg} ${s.color} ${s.border} shadow-md`
                    : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                <SIcon className="w-3.5 h-3.5" />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2 border-t border-white/5">
        <button
          onClick={onDelete}
          className="px-4 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition-all flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Supprimer
        </button>
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-purple-500/30 transition-all"
        >
          <Edit3 className="w-4 h-4" />
          Modifier
        </button>
      </div>
    </div>
  );
}
