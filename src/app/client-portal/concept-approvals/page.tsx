"use client";

import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Video, 
  ImageIcon,
  Clock,
  CheckCircle2,
  XCircle,
  Target,
  ThumbsUp,
  ThumbsDown,
  X,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Concept {
  id: number;
  type: 'reel' | 'post';
  title: string;
  description?: string;
  goal?: string;
  status: 'draft' | 'proposed' | 'approved' | 'rejected';
  rejection_reason?: string;
  reviewed_at?: string;
  review_notes?: string;
  created_at: string;
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

export default function ConceptApprovalsPage() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'proposed' | 'approved' | 'rejected'>('proposed');
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadConcepts();
  }, []);

  async function loadConcepts() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/client-portal/concepts');

      if (response.ok) {
        const data = await response.json();
        setConcepts(Array.isArray(data.concepts) ? data.concepts : []);
      } else {
        setConcepts([]);
      }
    } catch (error) {
      console.error('Erreur chargement concepts:', error);
      setConcepts([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleApprove() {
    if (!selectedConcept) return;

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/client-portal/concepts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept_id: selectedConcept.id,
          status: 'approved',
          review_notes: reviewNotes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur approbation concept');
      }

      setSelectedConcept(null);
      setReviewNotes('');
      setRejectionReason('');
      loadConcepts();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReject() {
    if (!selectedConcept) return;

    if (!rejectionReason.trim()) {
      alert('Veuillez indiquer la raison du rejet');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/client-portal/concepts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept_id: selectedConcept.id,
          status: 'rejected',
          rejection_reason: rejectionReason.trim(),
          review_notes: reviewNotes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur rejet concept');
      }

      setSelectedConcept(null);
      setReviewNotes('');
      setRejectionReason('');
      loadConcepts();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const stats = {
    proposed: concepts.filter((c) => c.status === 'proposed').length,
    approved: concepts.filter((c) => c.status === 'approved').length,
    rejected: concepts.filter((c) => c.status === 'rejected').length,
  };

  const filteredConcepts = concepts.filter((c) => c.status === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête Premium */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-2xl shadow-purple-500/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl shadow-lg">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-black tracking-tight">Concepts Créatifs</h1>
            </div>
            <p className="text-purple-100 text-lg font-medium">
              ✨ Consultez et validez les concepts proposés par votre équipe
            </p>
          </div>
        </motion.div>

        {/* Cartes de résumé Premium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <span className="text-5xl font-black bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  {stats.proposed}
                </span>
              </div>
              <h3 className="font-black text-gray-900 text-lg mb-1">En attente</h3>
              <p className="text-sm text-gray-600 font-medium">Concepts à valider</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <span className="text-5xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  {stats.approved}
                </span>
              </div>
              <h3 className="font-black text-gray-900 text-lg mb-1">Approuvés</h3>
              <p className="text-sm text-gray-600 font-medium">Concepts validés</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-gradient-to-br from-red-500 to-rose-500 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <XCircle className="w-7 h-7 text-white" />
                </div>
                <span className="text-5xl font-black bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
                  {stats.rejected}
                </span>
              </div>
              <h3 className="font-black text-gray-900 text-lg mb-1">Rejetés</h3>
              <p className="text-sm text-gray-600 font-medium">Concepts refusés</p>
            </div>
          </motion.div>
        </div>

        {/* Onglets Premium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 bg-white/60 backdrop-blur-xl rounded-2xl p-2 border border-gray-200 shadow-lg"
        >
          <div className="flex gap-2">
            {[
              { key: 'proposed', label: 'En attente', count: stats.proposed, gradient: 'from-blue-500 to-cyan-500', icon: Clock },
              { key: 'approved', label: 'Approuvés', count: stats.approved, gradient: 'from-green-500 to-emerald-500', icon: CheckCircle2 },
              { key: 'rejected', label: 'Rejetés', count: stats.rejected, gradient: 'from-red-500 to-rose-500', icon: XCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl transition-all font-bold ${
                    activeTab === tab.key
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                      : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                    activeTab === tab.key
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Liste des concepts */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : filteredConcepts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'proposed' && 'Aucun concept en attente'}
              {activeTab === 'approved' && 'Aucun concept approuvé'}
              {activeTab === 'rejected' && 'Aucun concept rejeté'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {activeTab === 'proposed' && 'Les nouveaux concepts proposés par l\'équipe apparaîtront ici.'}
              {activeTab === 'approved' && 'Les concepts que vous approuvez seront listés ici.'}
              {activeTab === 'rejected' && 'Les concepts rejetés avec leurs raisons seront visibles ici.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConcepts.map((concept) => (
              <ConceptCard
                key={concept.id}
                concept={concept}
                onClick={() => setSelectedConcept(concept)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de détail */}
      <AnimatePresence>
        {selectedConcept && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setSelectedConcept(null);
              setReviewNotes('');
              setRejectionReason('');
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div
                className={`bg-gradient-to-r ${
                  TYPE_CONFIG[selectedConcept.type]?.gradient || TYPE_CONFIG.post.gradient
                } p-6 text-white relative`}
              >
                <button
                  onClick={() => {
                    setSelectedConcept(null);
                    setReviewNotes('');
                    setRejectionReason('');
                  }}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-2">
                  {React.createElement(
                    TYPE_CONFIG[selectedConcept.type]?.icon || ImageIcon,
                    { className: 'w-8 h-8' }
                  )}
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                    {TYPE_CONFIG[selectedConcept.type]?.label || 'Post'}
                  </span>
                </div>

                <h2 className="text-2xl font-bold mb-2">{selectedConcept.title}</h2>

                {selectedConcept.status === 'proposed' && (
                  <p className="text-white/90 text-sm">
                    ✨ Nouveau concept en attente de votre validation
                  </p>
                )}
              </div>

              {/* Contenu */}
              <div className="p-6 space-y-6">
                {selectedConcept.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedConcept.description}</p>
                  </div>
                )}

                {selectedConcept.goal && (
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">Objectif</h3>
                    </div>
                    <p className="text-gray-700">{selectedConcept.goal}</p>
                  </div>
                )}

                {/* Afficher les détails selon le statut */}
                {selectedConcept.status === 'approved' && (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-900">Concept approuvé</h3>
                    </div>
                    {selectedConcept.review_notes && (
                      <p className="text-gray-700 text-sm">{selectedConcept.review_notes}</p>
                    )}
                  </div>
                )}

                {selectedConcept.status === 'rejected' && selectedConcept.rejection_reason && (
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <h3 className="font-semibold text-red-900">Raison du rejet</h3>
                    </div>
                    <p className="text-gray-700">{selectedConcept.rejection_reason}</p>
                  </div>
                )}

                {/* Zone de décision (uniquement si proposed) */}
                {selectedConcept.status === 'proposed' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Commentaires (optionnel)
                      </label>
                      <textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        rows={3}
                        placeholder="Ajoutez des commentaires ou suggestions..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all"
                      />
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Votre décision</h3>

                      {/* Bouton Approuver */}
                      <button
                        onClick={handleApprove}
                        disabled={isSubmitting}
                        className="w-full mb-3 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50"
                      >
                        <ThumbsUp className="w-5 h-5" />
                        {isSubmitting ? 'Approbation...' : 'Approuver ce concept'}
                      </button>

                      {/* Section rejet (collapse) */}
                      <details className="group">
                        <summary className="cursor-pointer w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold list-none">
                          <ThumbsDown className="w-5 h-5" />
                          Rejeter ce concept
                        </summary>

                        <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Raison du rejet *
                          </label>
                          <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={3}
                            required
                            placeholder="Expliquez pourquoi ce concept ne convient pas (obligatoire)..."
                            className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all mb-3"
                          />
                          <button
                            onClick={handleReject}
                            disabled={isSubmitting || !rejectionReason.trim()}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50"
                          >
                            <XCircle className="w-5 h-5" />
                            {isSubmitting ? 'Rejet...' : 'Confirmer le rejet'}
                          </button>
                        </div>
                      </details>

                      <p className="text-xs text-gray-500 text-center mt-4">
                        💡 Prenez le temps nécessaire pour évaluer ce concept. Votre feedback aide l'équipe à mieux vous servir.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ConceptCard({ concept, onClick }: { concept: Concept; onClick: () => void }) {
  const typeConfig = TYPE_CONFIG[concept.type] || TYPE_CONFIG.post;
  const TypeIcon = typeConfig.icon;

  const statusGradients: Record<string, string> = {
    draft: 'from-gray-500 to-slate-600',
    proposed: 'from-blue-500 to-cyan-500',
    approved: 'from-green-500 to-emerald-500',
    rejected: 'from-red-500 to-rose-500',
  };

  const statusLabels: Record<string, string> = {
    draft: 'Brouillon',
    proposed: 'En attente',
    approved: 'Approuvé',
    rejected: 'Rejeté',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
    >
      {/* Gradient Background on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${typeConfig.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      {/* Header Premium */}
      <div className={`relative bg-gradient-to-r ${typeConfig.gradient} p-5 text-white`}>
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="bg-white/20 backdrop-blur-xl p-2 rounded-xl"
          >
            <TypeIcon className="w-5 h-5" />
          </motion.div>
          <span className="text-xs font-black bg-white/20 px-3 py-1.5 rounded-full shadow-lg">
            {typeConfig.label}
          </span>
        </div>
        <h3 className="font-black text-xl line-clamp-2 group-hover:scale-105 transition-transform">
          {concept.title}
        </h3>
      </div>

      {/* Contenu */}
      <div className="relative z-10 p-5">
        {concept.description && (
          <p className="text-sm text-gray-700 mb-3 line-clamp-3 font-medium">{concept.description}</p>
        )}

        {concept.goal && (
          <div className="flex items-start gap-2 mb-4 p-3 bg-purple-50 rounded-xl border border-purple-100">
            <Target className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-700 line-clamp-2 font-semibold">{concept.goal}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className={`px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r ${statusGradients[concept.status]} text-white shadow-lg`}>
            {statusLabels[concept.status] || 'En attente'}
          </span>
          <motion.button
            whileHover={{ x: 3 }}
            className="flex items-center gap-1 text-purple-600 text-sm font-black hover:text-purple-700"
          >
            Voir détails
            <span className="text-lg">→</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
