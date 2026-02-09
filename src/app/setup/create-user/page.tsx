'use client';

import { useState } from 'react';

export default function CreateUserPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role_id: '1', // Admin par défaut
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/setup/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `Utilisateur créé avec succès ! Email: ${data.user.email}`,
        });
        // Réinitialiser le formulaire
        setFormData({
          email: '',
          password: '',
          full_name: '',
          role_id: '1',
        });
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Erreur lors de la création',
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Erreur de connexion',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              🔧 Setup Utilisateurs
            </h1>
            <p className="text-white/60 text-sm">
              Page temporaire pour créer les premiers utilisateurs
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF6633] focus:border-transparent transition-all"
                placeholder="admin@byzclub.ch"
                required
              />
            </div>

            {/* Nom complet */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-white/80 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF6633] focus:border-transparent transition-all"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF6633] focus:border-transparent transition-all"
                placeholder="Minimum 6 caractères"
                required
                minLength={6}
              />
            </div>

            {/* Rôle */}
            <div>
              <label htmlFor="role_id" className="block text-sm font-medium text-white/80 mb-2">
                Rôle
              </label>
              <select
                id="role_id"
                value={formData.role_id}
                onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF6633] focus:border-transparent transition-all"
                required
              >
                <option value="1" className="bg-gray-800">Admin</option>
                <option value="2" className="bg-gray-800">Client</option>
                <option value="3" className="bg-gray-800">Staff</option>
              </select>
              <p className="mt-2 text-xs text-white/50">
                • Admin (1): Accès complet<br />
                • Client (2): Portail client<br />
                • Staff (3): Accès employé
              </p>
            </div>

            {/* Message de retour */}
            {message && (
              <div
                className={`p-4 rounded-lg border ${
                  message.type === 'success'
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            {/* Bouton submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-[#FF6633] hover:bg-[#FF5522] text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#FF6633]/50 transform hover:scale-[1.02]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Création en cours...
                </span>
              ) : (
                'Créer l\'utilisateur'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/40 text-center">
              ⚠️ Cette page est temporaire et ne doit être utilisée que pour créer les premiers utilisateurs.
              Supprimez-la en production !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
