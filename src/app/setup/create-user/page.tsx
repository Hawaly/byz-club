'use client';

import { useState, useEffect, useCallback } from 'react';

interface AppUser {
  id: number;
  email: string;
  role_id: number;
  client_id: number | null;
  is_active: boolean;
  auth_user_id: string | null;
  created_at: string;
  role: { id: number; code: string; name: string } | null;
}

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  admin:  { label: 'Admin',  color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/30' },
  client: { label: 'Client', color: 'text-blue-400',   bg: 'bg-blue-500/15 border-blue-500/30' },
  staff:  { label: 'Staff',  color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30' },
};

export default function DevUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    role_id: '1',
    client_id: '',
  });

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/setup/create-user');
      const data = await res.json();
      if (data.success) setUsers(data.users);
      else showToast('error', data.error || 'Erreur chargement');
    } catch {
      showToast('error', 'Impossible de charger les utilisateurs');
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/setup/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          client_id: form.client_id ? parseInt(form.client_id) : null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const triggerMsg = data.trigger_status === 'active'
          ? ' (trigger DB actif ✓)'
          : ' (insertion manuelle - appliquez FIX_auth_user_sync.sql)';
        showToast('success', `Créé : ${form.email}${triggerMsg}`);
        setForm({ email: '', password: '', full_name: '', role_id: '1', client_id: '' });
        loadUsers();
      } else {
        showToast('error', data.error || 'Erreur création');
      }
    } catch {
      showToast('error', 'Erreur réseau');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (user: AppUser) => {
    if (!confirm(`Supprimer ${user.email} ? Cette action est irréversible.`)) return;
    setDeletingId(user.id);
    try {
      const res = await fetch('/api/setup/create-user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_user_id: user.auth_user_id || null,
          app_user_id: user.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', `${user.email} supprimé`);
        loadUsers();
      } else {
        showToast('error', data.error || 'Erreur suppression');
      }
    } catch {
      showToast('error', 'Erreur réseau');
    } finally {
      setDeletingId(null);
    }
  };

  const adminCount  = users.filter(u => u.role?.code === 'admin').length;
  const clientCount = users.filter(u => u.role?.code === 'client').length;
  const linkedCount = users.filter(u => u.auth_user_id).length;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all ${
          toast.type === 'success'
            ? 'bg-green-900/90 border-green-500/40 text-green-300'
            : 'bg-red-900/90 border-red-500/40 text-red-300'
        }`}>
          {toast.type === 'success' ? '✓ ' : '✗ '}{toast.text}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-2xl">🔧</span> Dev — Gestion Utilisateurs
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Accessible sur <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">/setup/create-user</code> · DEV ONLY
            </p>
          </div>
          <div className="flex gap-3">
            <span className="px-3 py-1.5 bg-orange-500/15 border border-orange-500/30 rounded-lg text-orange-400 text-xs font-semibold">
              {adminCount} admin{adminCount > 1 ? 's' : ''}
            </span>
            <span className="px-3 py-1.5 bg-blue-500/15 border border-blue-500/30 rounded-lg text-blue-400 text-xs font-semibold">
              {clientCount} client{clientCount > 1 ? 's' : ''}
            </span>
            <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
              linkedCount === users.length && users.length > 0
                ? 'bg-green-500/15 border-green-500/30 text-green-400'
                : 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400'
            }`}>
              {linkedCount}/{users.length} liés auth
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Formulaire création */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
                <span>➕</span> Créer un utilisateur
              </h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF6633]/50 focus:border-[#FF6633]/50"
                    placeholder="user@byzclub.ch"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Nom complet</label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={e => setForm({ ...form, full_name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF6633]/50 focus:border-[#FF6633]/50"
                    placeholder="Prénom Nom"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Mot de passe *</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF6633]/50 focus:border-[#FF6633]/50"
                    placeholder="Min. 6 caractères"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Rôle *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: '1', label: 'Admin',  color: 'orange' },
                      { value: '2', label: 'Client', color: 'blue' },
                      { value: '3', label: 'Staff',  color: 'purple' },
                    ].map(r => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setForm({ ...form, role_id: r.value })}
                        className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                          form.role_id === r.value
                            ? r.color === 'orange'
                              ? 'bg-orange-500/25 border-orange-500/60 text-orange-300'
                              : r.color === 'blue'
                              ? 'bg-blue-500/25 border-blue-500/60 text-blue-300'
                              : 'bg-purple-500/25 border-purple-500/60 text-purple-300'
                            : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {form.role_id === '2' && (
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">
                      Client ID <span className="text-white/30">(optionnel)</span>
                    </label>
                    <input
                      type="number"
                      value={form.client_id}
                      onChange={e => setForm({ ...form, client_id: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                      placeholder="ID de la table client"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full py-2.5 bg-[#FF6633] hover:bg-[#FF5522] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all text-sm flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Création...
                    </>
                  ) : 'Créer l\'utilisateur'}
                </button>
              </form>

              <div className="mt-5 pt-5 border-t border-white/10 space-y-1.5">
                <p className="text-xs text-white/40 font-medium">Rôles</p>
                <p className="text-xs text-white/30">• <span className="text-orange-400">Admin (1)</span> → /dashboard</p>
                <p className="text-xs text-white/30">• <span className="text-blue-400">Client (2)</span> → /client-portal</p>
                <p className="text-xs text-white/30">• <span className="text-purple-400">Staff (3)</span> → /dashboard</p>
              </div>
            </div>
          </div>

          {/* Liste des users */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <span>👥</span> Utilisateurs ({users.length})
                </h2>
                <button
                  onClick={loadUsers}
                  disabled={loadingUsers}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1.5"
                >
                  <svg className={`h-3.5 w-3.5 ${loadingUsers ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  Actualiser
                </button>
              </div>

              {loadingUsers ? (
                <div className="flex items-center justify-center py-16 text-white/30 text-sm">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Chargement...
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-16 text-white/30 text-sm">
                  Aucun utilisateur dans app_user
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {users.map(user => {
                    const roleCode = user.role?.code || 'unknown';
                    const rc = ROLE_CONFIG[roleCode] || { label: roleCode, color: 'text-white/50', bg: 'bg-white/5 border-white/10' };
                    return (
                      <div key={user.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/3 transition-colors">
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60 flex-shrink-0">
                          {user.email[0].toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-white truncate">{user.email}</span>
                            <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${rc.bg} ${rc.color}`}>
                              {rc.label}
                            </span>
                            {user.client_id && (
                              <span className="px-2 py-0.5 rounded-md text-xs border bg-white/5 border-white/10 text-white/40">
                                client #{user.client_id}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-xs flex items-center gap-1 ${user.auth_user_id ? 'text-green-500/70' : 'text-yellow-500/70'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full inline-block ${user.auth_user_id ? 'bg-green-500' : 'bg-yellow-500'}`}/>
                              {user.auth_user_id ? 'Auth lié' : 'Auth non lié'}
                            </span>
                            <span className={`text-xs flex items-center gap-1 ${user.is_active ? 'text-white/30' : 'text-red-500/60'}`}>
                              {user.is_active ? 'Actif' : 'Inactif'}
                            </span>
                            <span className="text-xs text-white/20">
                              #{user.id}
                            </span>
                          </div>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={deletingId === user.id}
                          className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 hover:border-red-500/40 text-red-400 flex items-center justify-center transition-all disabled:opacity-40 flex-shrink-0"
                          title="Supprimer"
                        >
                          {deletingId === user.id ? (
                            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                          ) : (
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Avertissement */}
            <div className="mt-4 p-4 bg-yellow-500/8 border border-yellow-500/20 rounded-xl flex items-start gap-3">
              <span className="text-yellow-500 text-base flex-shrink-0">⚠️</span>
              <div>
                <p className="text-xs text-yellow-400/80 font-medium">DEV ONLY</p>
                <p className="text-xs text-yellow-400/50 mt-0.5">
                  Cette page expose la gestion des users sans authentification.
                  Désactivez ou protégez <code className="bg-white/10 px-1 rounded">/setup/create-user</code> avant la mise en production.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
