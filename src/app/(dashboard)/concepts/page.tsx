"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { 
  Lightbulb, 
  Plus, 
  Search, 
  Video, 
  ImageIcon,
  Clock,
  CheckCircle2,
  XCircle,
  FileEdit,
  Trash2,
  Send,
  Filter,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Client {
  id: number;
  name: string;
  company_name?: string;
}

interface Concept {
  id: number;
  type: 'reel' | 'post';
  title: string;
  description?: string;
  goal?: string;
  client_id: number;
  client?: Client;
  mandat_id?: number;
  status: 'draft' | 'proposed' | 'approved' | 'rejected';
  rejection_reason?: string;
  proposed_at?: string;
  reviewed_at?: string;
  review_notes?: string;
  created_at: string;
  updated_at: string;
}

const TYPE_CONFIG = {
  reel: {
    label: 'Reel',
    icon: Video,
    gradient: 'from-pink-600 to-rose-500',
    bgGradient: 'from-pink-50 to-rose-50',
  },
  post: {
    label: 'Post',
    icon: ImageIcon,
    gradient: 'from-blue-600 to-indigo-500',
    bgGradient: 'from-blue-50 to-indigo-50',
  },
};

const STATUS_CONFIG = {
  draft: {
    label: 'Brouillon',
    icon: FileEdit,
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300',
  },
  proposed: {
    label: 'Proposé',
    icon: Clock,
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
  },
  approved: {
    label: 'Approuvé',
    icon: CheckCircle2,
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-300',
  },
  rejected: {
    label: 'Rejeté',
    icon: XCircle,
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-300',
  },
};

export default function ConceptsPage() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<{
    type: 'reel' | 'post';
    title: string;
    description: string;
    goal: string;
    client_id: string;
  }>({ type: 'post', title: '', description: '', goal: '', client_id: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [filterClient, setFilterClient] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    type: 'post' as 'reel' | 'post',
    title: '',
    description: '',
    goal: '',
    client_id: '',
    status: 'draft' as 'draft' | 'proposed',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);
      const [conceptsRes, clientsRes] = await Promise.all([
        fetch('/api/concepts'),
        fetch('/api/clients'),
      ]);

      if (conceptsRes.ok) {
        const conceptsData = await conceptsRes.json();
        setConcepts(Array.isArray(conceptsData.concepts) ? conceptsData.concepts : []);
      }

      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        setClients(Array.isArray(clientsData.clients) ? clientsData.clients : []);
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
      setConcepts([]);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateConcept(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.title || !formData.client_id) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const response = await fetch('/api/concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          client_id: parseInt(formData.client_id),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur création concept');
      }

      setShowCreateModal(false);
      setFormData({
        type: 'post',
        title: '',
        description: '',
        goal: '',
        client_id: '',
        status: 'draft',
      });
      loadData();
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function handleSendForApproval(conceptId: number) {
    if (!confirm('Envoyer ce concept pour approbation au client ?')) return;

    try {
      const response = await fetch(`/api/concepts/${conceptId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'proposed' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur envoi concept');
      }

      loadData();
    } catch (error: any) {
      alert(error.message);
    }
  }

  function openConceptDetail(concept: Concept) {
    setSelectedConcept(concept);
    setIsEditing(false);
    setEditData({
      type: concept.type,
      title: concept.title,
      description: concept.description || '',
      goal: concept.goal || '',
      client_id: String(concept.client_id),
    });
  }

  async function handleUpdateConcept() {
    if (!selectedConcept) return;
    if (!editData.title || !editData.client_id) {
      alert('Titre et client sont obligatoires');
      return;
    }
    try {
      setIsSaving(true);
      const response = await fetch(`/api/concepts/${selectedConcept.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: editData.type,
          title: editData.title,
          description: editData.description,
          goal: editData.goal,
          client_id: parseInt(editData.client_id),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur modification concept');
      setIsEditing(false);
      setSelectedConcept(null);
      loadData();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteConcept(conceptId: number) {
    if (!confirm('Supprimer définitivement ce concept ?')) return;

    try {
      const response = await fetch(`/api/concepts/${conceptId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur suppression concept');
      }

      loadData();
    } catch (error: any) {
      alert(error.message);
    }
  }

  const filteredConcepts = concepts.filter((concept) => {
    if (filterClient && concept.client_id !== filterClient) return false;
    if (filterType && concept.type !== filterType) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        concept.title.toLowerCase().includes(term) ||
        concept.description?.toLowerCase().includes(term) ||
        concept.client?.name.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const statsByStatus = {
    draft: filteredConcepts.filter((c) => c.status === 'draft').length,
    proposed: filteredConcepts.filter((c) => c.status === 'proposed').length,
    approved: filteredConcepts.filter((c) => c.status === 'approved').length,
    rejected: filteredConcepts.filter((c) => c.status === 'rejected').length,
  };

  const columns: ('draft' | 'proposed' | 'approved' | 'rejected')[] = ['draft', 'proposed', 'approved', 'rejected'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header title="Concepts Créatifs" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête Premium */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-2xl shadow-purple-500/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl shadow-lg">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-black tracking-tight">
                  Concepts Créatifs
                </h1>
              </div>
              <p className="text-purple-100 text-lg font-medium">
                ✨ Créez, proposez et validez vos idées créatives
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl hover:shadow-2xl transition-all duration-300 font-bold shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Nouveau Concept
            </motion.button>
          </div>
        </motion.div>

        {/* Statistiques Premium */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {columns.map((status, index) => {
            const config = STATUS_CONFIG[status];
            const Icon = config.icon;
            const gradients = {
              draft: 'from-gray-500 to-slate-600',
              proposed: 'from-blue-500 to-cyan-500',
              approved: 'from-green-500 to-emerald-500',
              rejected: 'from-red-500 to-rose-500',
            };
            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradients[status]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      {config.label}
                    </p>
                    <p className={`text-4xl font-black bg-gradient-to-r ${gradients[status]} bg-clip-text text-transparent`}>
                      {statsByStatus[status]}
                    </p>
                  </div>
                  <div className={`bg-gradient-to-br ${gradients[status]} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filtres Premium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input
                type="text"
                placeholder="🔍 Rechercher un concept par titre, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
              />
            </div>

            <select
              value={filterClient || ''}
              onChange={(e) => setFilterClient(e.target.value ? parseInt(e.target.value) : null)}
              className="px-5 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all font-semibold text-gray-700 cursor-pointer hover:border-purple-300"
            >
              <option value="">👥 Tous les clients</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.company_name || client.name}
                </option>
              ))}
            </select>

            <select
              value={filterType || ''}
              onChange={(e) => setFilterType(e.target.value || null)}
              className="px-5 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all font-semibold text-gray-700 cursor-pointer hover:border-purple-300"
            >
              <option value="">🎨 Tous les types</option>
              <option value="reel">🎬 Reels</option>
              <option value="post">📸 Posts</option>
            </select>
          </div>
        </motion.div>

        {/* Vue Kanban */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((status) => {
              const config = STATUS_CONFIG[status];
              const columnConcepts = filteredConcepts.filter((c) => c.status === status);

              const gradients = {
                draft: 'from-gray-500 to-slate-600',
                proposed: 'from-blue-500 to-cyan-500',
                approved: 'from-green-500 to-emerald-500',
                rejected: 'from-red-500 to-rose-500',
              };
              
              return (
                <motion.div
                  key={status}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + columnConcepts.length * 0.05 }}
                  className="bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-xl rounded-2xl border-2 border-gray-200 p-5 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-gray-200">
                    <div className={`bg-gradient-to-br ${gradients[status]} p-3 rounded-xl shadow-lg`}>
                      {React.createElement(config.icon, { className: 'w-5 h-5 text-white' })}
                    </div>
                    <h3 className="font-black text-gray-900 text-lg">{config.label}</h3>
                    <span className={`ml-auto px-3 py-1.5 rounded-full text-sm font-black bg-gradient-to-r ${gradients[status]} text-white shadow-md`}>
                      {columnConcepts.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {columnConcepts.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-8">Aucun concept</p>
                    ) : (
                      columnConcepts.map((concept) => (
                        <ConceptCard
                          key={concept.id}
                          concept={concept}
                          onSendForApproval={handleSendForApproval}
                          onDelete={handleDeleteConcept}
                          onClick={() => openConceptDetail(concept)}
                        />
                      ))
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de détail / édition */}
      <AnimatePresence>
        {selectedConcept && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { setSelectedConcept(null); setIsEditing(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header coloré selon type */}
              <div className={`bg-gradient-to-r ${TYPE_CONFIG[selectedConcept.type]?.gradient || TYPE_CONFIG.post.gradient} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {React.createElement(TYPE_CONFIG[selectedConcept.type]?.icon || ImageIcon, { className: 'w-7 h-7' })}
                    <div>
                      <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">
                        {TYPE_CONFIG[selectedConcept.type]?.label || 'Post'}
                      </p>
                      <h2 className="text-xl font-black">{selectedConcept.title}</h2>
                      <p className="text-white/80 text-sm mt-0.5">
                        {selectedConcept.client?.company_name || selectedConcept.client?.name || 'Client inconnu'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-all"
                      >
                        ✏️ Modifier
                      </button>
                    )}
                    <button
                      onClick={() => { setSelectedConcept(null); setIsEditing(false); }}
                      className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {isEditing ? (
                  /* Mode édition */
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['reel', 'post'] as const).map((t) => {
                          const cfg = TYPE_CONFIG[t];
                          const Icon = cfg.icon;
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setEditData({ ...editData, type: t })}
                              className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all ${
                                editData.type === t
                                  ? 'border-purple-600 bg-purple-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Icon className={`w-5 h-5 ${editData.type === t ? 'text-purple-600' : 'text-gray-400'}`} />
                              <span className={`font-semibold text-sm ${editData.type === t ? 'text-purple-600' : 'text-gray-600'}`}>{cfg.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Client *</label>
                      <select
                        value={editData.client_id}
                        onChange={(e) => setEditData({ ...editData, client_id: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all"
                      >
                        <option value="">Sélectionner un client</option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.company_name || client.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Titre *</label>
                      <input
                        type="text"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <textarea
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Objectif</label>
                      <input
                        type="text"
                        value={editData.goal}
                        onChange={(e) => setEditData({ ...editData, goal: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={handleUpdateConcept}
                        disabled={isSaving}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50"
                      >
                        {isSaving ? 'Sauvegarde...' : '💾 Sauvegarder'}
                      </button>
                    </div>
                  </>
                ) : (
                  /* Mode lecture */
                  <>
                    {selectedConcept.description && (
                      <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Description</h3>
                        <p className="text-gray-800 leading-relaxed">{selectedConcept.description}</p>
                      </div>
                    )}

                    {selectedConcept.goal && (
                      <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                        <h3 className="text-sm font-bold text-purple-700 uppercase tracking-wide mb-1">🎯 Objectif</h3>
                        <p className="text-gray-800">{selectedConcept.goal}</p>
                      </div>
                    )}

                    {selectedConcept.status === 'rejected' && selectedConcept.rejection_reason && (
                      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                        <h3 className="text-sm font-bold text-red-700 uppercase tracking-wide mb-1">⚠️ Raison du rejet</h3>
                        <p className="text-gray-800">{selectedConcept.rejection_reason}</p>
                      </div>
                    )}

                    {selectedConcept.review_notes && (
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-1">💬 Notes de révision</h3>
                        <p className="text-gray-800">{selectedConcept.review_notes}</p>
                      </div>
                    )}

                    {/* Actions selon statut */}
                    {selectedConcept.status === 'draft' && (
                      <div className="flex gap-3 pt-2 border-t border-gray-200">
                        <button
                          onClick={() => { handleSendForApproval(selectedConcept.id); setSelectedConcept(null); }}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                        >
                          <Send className="w-4 h-4" />
                          Envoyer pour approbation
                        </button>
                        <button
                          onClick={() => { handleDeleteConcept(selectedConcept.id); setSelectedConcept(null); }}
                          className="px-4 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {selectedConcept.status === 'rejected' && (
                      <div className="pt-2 border-t border-gray-200">
                        <button
                          onClick={() => { handleSendForApproval(selectedConcept.id); setSelectedConcept(null); }}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                        >
                          <Send className="w-4 h-4" />
                          Renvoyer pour approbation
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de création */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Nouveau Concept Créatif</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateConcept} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type de concept *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {(['reel', 'post'] as const).map((type) => {
                      const config = TYPE_CONFIG[type];
                      const Icon = config.icon;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, type })}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            formData.type === type
                              ? `bg-gradient-to-br ${config.bgGradient} border-${config.gradient.split(' ')[0].replace('from-', '')}`
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className={`w-8 h-8 mx-auto mb-2 ${
                            formData.type === type ? `bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent` : 'text-gray-400'
                          }`} />
                          <p className="font-semibold">{config.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Client *
                  </label>
                  <select
                    value={formData.client_id}
                    onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all"
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.company_name || client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Titre du concept *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Ex: Reel dynamique lancement produit"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Décrivez le concept en détail..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Objectif
                  </label>
                  <input
                    type="text"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    placeholder="Ex: Générer du buzz et de l'engagement"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Statut initial
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'proposed' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all"
                  >
                    <option value="draft">Brouillon (à finaliser)</option>
                    <option value="proposed">Proposé (envoyer au client)</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                  >
                    Créer le concept
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ConceptCard({
  concept,
  onSendForApproval,
  onDelete,
  onClick,
}: {
  concept: Concept;
  onSendForApproval: (id: number) => void;
  onDelete: (id: number) => void;
  onClick: () => void;
}) {
  const typeConfig = TYPE_CONFIG[concept.type] || TYPE_CONFIG.post;
  const TypeIcon = typeConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.02 }}
      className="group relative bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-purple-400 hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Gradient Background on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${typeConfig.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-3">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className={`bg-gradient-to-br ${typeConfig.gradient} p-2.5 rounded-xl shadow-lg`}
          >
            <TypeIcon className="w-5 h-5 text-white" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-purple-600 transition-colors mb-1">
              {concept.title}
            </h4>
            <p className="text-xs text-gray-500 font-medium">
              {concept.client?.company_name || concept.client?.name || 'Client inconnu'}
            </p>
          </div>
        </div>

        {concept.goal && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2 italic bg-gray-50 p-2 rounded-lg border border-gray-100">
            🎯 {concept.goal}
          </p>
        )}

        {concept.status === 'draft' && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSendForApproval(concept.id)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              Envoyer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(concept.id)}
              className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        )}

        {concept.status === 'rejected' && concept.rejection_reason && (
          <div className="mt-3 p-3 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border-2 border-red-200">
            <p className="text-xs text-red-700 font-black mb-1.5 flex items-center gap-1">
              ⚠️ Raison du rejet
            </p>
            <p className="text-xs text-red-600 line-clamp-2 font-medium">{concept.rejection_reason}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
