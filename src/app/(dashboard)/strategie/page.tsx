"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Users, Search, ChevronDown, Eye, Calendar,
  Sparkles, Loader2, AlertCircle, CheckCircle, Clock,
  Plus, FileText, TrendingUp, Megaphone, BookOpen, BarChart3, Globe
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Client {
  id: number;
  name: string;
  company_name?: string;
  status: string;
}

interface Strategy {
  id: number;
  version: string;
  status: string;
  contexte_general?: string;
  objectifs_business?: string;
  objectifs_reseaux?: string;
  cibles?: string;
  plateformes?: string[];
  ton_voix?: string;
  frequence_calendrier?: string;
  created_at: string;
  updated_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; icon: any; bg: string; text: string; border: string; gradient: string }> = {
  draft:      { label: "Brouillon",   icon: Clock,        bg: "bg-gray-100",   text: "text-gray-700",   border: "border-gray-300",   gradient: "from-gray-500 to-slate-600"    },
  en_attente: { label: "En attente",  icon: AlertCircle,  bg: "bg-amber-100",  text: "text-amber-700",  border: "border-amber-300",  gradient: "from-amber-500 to-orange-500"  },
  valide:     { label: "Validé",      icon: CheckCircle,  bg: "bg-green-100",  text: "text-green-700",  border: "border-green-300",  gradient: "from-green-500 to-emerald-500" },
  archive:    { label: "Archivé",     icon: FileText,     bg: "bg-slate-100",  text: "text-slate-600",  border: "border-slate-300",  gradient: "from-slate-400 to-slate-500"   },
};

const PLATFORM_COLORS: Record<string, { color: string; bg: string }> = {
  instagram: { color: "text-pink-600",  bg: "bg-pink-100"  },
  linkedin:  { color: "text-blue-700",  bg: "bg-blue-100"  },
  tiktok:    { color: "text-gray-800",  bg: "bg-gray-100"  },
  youtube:   { color: "text-red-600",   bg: "bg-red-100"   },
  facebook:  { color: "text-blue-600",  bg: "bg-blue-50"   },
  twitter:   { color: "text-sky-600",   bg: "bg-sky-100"   },
};

function getPlatformStyle(p: string) {
  return PLATFORM_COLORS[p.toLowerCase()] || { color: "text-purple-600", bg: "bg-purple-100" };
}

export default function StrategiePage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [isLoadingStrategies, setIsLoadingStrategies] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  useEffect(() => { loadClients(); }, []);

  useEffect(() => {
    if (selectedClient) loadStrategies(selectedClient.id);
    else { setStrategies([]); setSelectedStrategy(null); }
  }, [selectedClient]);

  async function loadClients() {
    try {
      setIsLoadingClients(true);
      const { data } = await supabase
        .from("client")
        .select("id, name, company_name, status")
        .order("name", { ascending: true });
      setClients(data || []);
    } finally { setIsLoadingClients(false); }
  }

  async function loadStrategies(clientId: number) {
    try {
      setIsLoadingStrategies(true);
      const { data } = await supabase
        .from("social_media_strategy")
        .select("id, version, status, contexte_general, objectifs_business, objectifs_reseaux, cibles, plateformes, ton_voix, frequence_calendrier, created_at, updated_at")
        .eq("client_id", clientId)
        .order("version", { ascending: false });
      setStrategies(data || []);
      if (data && data.length > 0) setSelectedStrategy(data[0]);
      else setSelectedStrategy(null);
    } finally { setIsLoadingStrategies(false); }
  }

  const filteredClients = clients.filter(c =>
    (c.company_name || c.name).toLowerCase().includes(clientSearch.toLowerCase())
  );

  const statusCfg = selectedStrategy
    ? (STATUS_CONFIG[selectedStrategy.status] || STATUS_CONFIG.draft)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">

      {/* ── Header sticky */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 py-4 flex items-center gap-3 flex-wrap">

          {/* Titre */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900">Stratégies Social Media</h1>
              <p className="text-xs text-gray-500">Pilotez la stratégie de vos clients</p>
            </div>
          </div>

          {/* Sélecteur client */}
          <div className="relative ml-2">
            <button
              onClick={() => setShowClientDropdown(!showClientDropdown)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-semibold ${
                selectedClient
                  ? "bg-orange-50 border-orange-300 text-orange-900"
                  : "bg-gray-50 border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              <Users className="w-4 h-4" />
              {selectedClient ? (selectedClient.company_name || selectedClient.name) : "Choisir un client"}
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
                  <div className="max-h-64 overflow-y-auto py-1">
                    {isLoadingClients ? (
                      <div className="py-6 text-center"><Loader2 className="w-5 h-5 animate-spin text-orange-500 mx-auto" /></div>
                    ) : filteredClients.length === 0 ? (
                      <p className="text-center text-sm text-gray-500 py-4">Aucun client trouvé</p>
                    ) : filteredClients.map(c => (
                      <button
                        key={c.id}
                        onClick={() => { setSelectedClient(c); setShowClientDropdown(false); setClientSearch(""); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left ${
                          selectedClient?.id === c.id ? "bg-orange-50 text-orange-900" : "text-gray-700"
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {(c.company_name || c.name)[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{c.company_name || c.name}</p>
                          {c.company_name && <p className="text-xs text-gray-400 truncate">{c.name}</p>}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sélecteur version si plusieurs */}
          {strategies.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-semibold">Version :</span>
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                {strategies.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStrategy(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedStrategy?.id === s.id
                        ? "bg-white text-orange-600 shadow-md"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    v{s.version}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bouton gérer */}
          {selectedClient && (
            <Link
              href={`/clients/${selectedClient.id}/strategies`}
              className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all"
            >
              <Plus className="w-4 h-4" />
              Gérer les stratégies
            </Link>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6">

        {/* ── Pas de client sélectionné */}
        {!selectedClient && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-28 h-28 bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl flex items-center justify-center mb-6 border-2 border-orange-200 shadow-xl"
            >
              <Target className="w-14 h-14 text-orange-500" />
            </motion.div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">Choisissez un client</h2>
            <p className="text-gray-500 max-w-md mb-8 text-base">
              Sélectionnez un client pour accéder à sa stratégie social media.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowClientDropdown(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <Users className="w-5 h-5" />
              Choisir un client
            </motion.button>
          </motion.div>
        )}

        {/* ── Chargement */}
        {selectedClient && isLoadingStrategies && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500 mb-4" />
            <p className="text-gray-600 font-semibold">Chargement des stratégies...</p>
          </div>
        )}

        {/* ── Aucune stratégie */}
        {selectedClient && !isLoadingStrategies && strategies.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[50vh] text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl flex items-center justify-center mb-6 border-2 border-orange-200">
              <Sparkles className="w-12 h-12 text-orange-400" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Aucune stratégie</h2>
            <p className="text-gray-500 mb-6 max-w-sm">
              {selectedClient.company_name || selectedClient.name} n'a pas encore de stratégie social media.
            </p>
            <Link
              href={`/clients/${selectedClient.id}/strategies`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              Créer une stratégie
            </Link>
          </motion.div>
        )}

        {/* ── Contenu principal */}
        {selectedClient && !isLoadingStrategies && selectedStrategy && statusCfg && (
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Bannière client + stratégie */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white shadow-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg">
                    {(selectedClient.company_name || selectedClient.name)[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-1">Stratégie Social Media</p>
                    <h2 className="text-2xl sm:text-3xl font-black">{selectedClient.company_name || selectedClient.name}</h2>
                    {selectedClient.company_name && <p className="text-white/80 text-sm">{selectedClient.name}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3">
                    <span className="text-white/70 text-xs font-semibold uppercase tracking-wide">Version</span>
                    <span className="text-2xl font-black">v{selectedStrategy.version}</span>
                  </div>
                  <div className={`flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3`}>
                    <span className="text-white/70 text-xs font-semibold uppercase tracking-wide">Statut</span>
                    <span className="text-sm font-bold">{statusCfg.label}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Plateformes",    value: selectedStrategy.plateformes?.length ?? 0,     icon: Megaphone,  gradient: "from-blue-500 to-cyan-500"     },
                { label: "Objectifs",       value: selectedStrategy.objectifs_business ? "✓" : "—", icon: TrendingUp,  gradient: "from-green-500 to-emerald-500" },
                { label: "Cibles définies", value: selectedStrategy.cibles ? "✓" : "—",             icon: Users,      gradient: "from-purple-500 to-pink-500"   },
                { label: "Fréquence",       value: selectedStrategy.frequence_calendrier ? "✓" : "—", icon: Calendar,  gradient: "from-amber-500 to-orange-500"  },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-lg hover:shadow-xl transition-all group overflow-hidden relative"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{stat.label}</p>
                        <p className={`text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>{stat.value}</p>
                      </div>
                      <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Grille de contenu */}
            <div className="grid md:grid-cols-2 gap-4">

              {/* Contexte général */}
              {selectedStrategy.contexte_general && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-black text-gray-900">Contexte général</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">{selectedStrategy.contexte_general}</p>
                </motion.div>
              )}

              {/* Objectifs business */}
              {selectedStrategy.objectifs_business && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-black text-gray-900">Objectifs business</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">{selectedStrategy.objectifs_business}</p>
                </motion.div>
              )}

              {/* Objectifs réseaux */}
              {selectedStrategy.objectifs_reseaux && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-black text-gray-900">Objectifs réseaux sociaux</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">{selectedStrategy.objectifs_reseaux}</p>
                </motion.div>
              )}

              {/* Cibles */}
              {selectedStrategy.cibles && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-black text-gray-900">Cibles & audience</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">{selectedStrategy.cibles}</p>
                </motion.div>
              )}

              {/* Ton & voix */}
              {selectedStrategy.ton_voix && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-black text-gray-900">Ton & voix de marque</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">{selectedStrategy.ton_voix}</p>
                </motion.div>
              )}

              {/* Fréquence */}
              {selectedStrategy.frequence_calendrier && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-black text-gray-900">Fréquence & calendrier</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">{selectedStrategy.frequence_calendrier}</p>
                </motion.div>
              )}
            </div>

            {/* Plateformes */}
            {selectedStrategy.plateformes && selectedStrategy.plateformes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow">
                    <Megaphone className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-black text-gray-900">Plateformes actives</h3>
                  <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-700 text-xs font-black rounded-full">
                    {selectedStrategy.plateformes.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedStrategy.plateformes.map((platform, idx) => {
                    const style = getPlatformStyle(platform);
                    return (
                      <motion.span
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        className={`flex items-center gap-2 px-4 py-2.5 ${style.bg} ${style.color} font-bold rounded-xl text-sm shadow-sm border border-current/10`}
                      >
                        <Globe className="w-4 h-4" />
                        {platform}
                      </motion.span>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Footer avec dates + lien vers full view */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Créée le</p>
                  <p className="font-bold text-gray-900 text-sm">
                    {new Date(selectedStrategy.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Modifiée le</p>
                  <p className="font-bold text-gray-900 text-sm">
                    {new Date(selectedStrategy.updated_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
              <Link
                href={`/clients/${selectedClient.id}/strategies`}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow hover:shadow-lg transition-all text-sm"
              >
                <Eye className="w-4 h-4" />
                Voir la stratégie complète
              </Link>
            </motion.div>

          </div>
        )}
      </div>
    </div>
  );
}
