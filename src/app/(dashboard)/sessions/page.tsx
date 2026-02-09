"use client";

import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, Globe, MapPin, Calendar, LogOut, Shield, CheckCircle } from 'lucide-react';

interface SessionDetails {
  id: string;
  email: string;
  created_at: string;
  last_sign_in: string;
  expires_at: number;
  ip: string;
  user_agent: string;
  device: string;
  browser: string;
  os: string;
  is_current: boolean;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/sessions');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des sessions');
      }
      
      const data = await response.json();
      setSessions(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des sessions');
    } finally {
      setLoading(false);
    }
  };

  const closeSession = async (sessionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir fermer cette session ? Vous serez déconnecté.')) {
      return;
    }

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Rediriger vers login après fermeture de session
        window.location.href = '/login';
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la fermeture de la session:', error);
      alert('Erreur lors de la fermeture de la session');
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-6 h-6" />;
      case 'tablet':
        return <Tablet className="w-6 h-6" />;
      default:
        return <Monitor className="w-6 h-6" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getExpiresIn = (expiresAt: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = expiresAt - now;
    
    if (diff <= 0) return 'Expirée';
    
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    
    if (days > 0) return `${days}j ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}min`;
    return `${minutes}min`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-brand-orange" />
            Sessions Actives
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez vos sessions et la sécurité de votre compte
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sessions Actives</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {sessions.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Appareils</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {new Set(sessions.map(s => s.device)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Monitor className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Localisations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {new Set(sessions.map(s => s.ip)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6">
          <p className="text-red-900 font-semibold">{error}</p>
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all ${
              session.is_current
                ? 'border-green-300 bg-green-50/30'
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                {/* Device Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  session.is_current
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {getDeviceIcon(session.device)}
                </div>

                {/* Session Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      {session.device} - {session.os}
                    </h3>
                    {session.is_current && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle className="w-3 h-3" />
                        Session actuelle
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Navigateur:</span>
                      <span>{session.browser}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">IP:</span>
                      <span className="font-mono">{session.ip}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Dernière connexion:</span>
                      <span>{formatDate(session.last_sign_in)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Expire dans:</span>
                      <span className="font-semibold text-brand-orange">
                        {getExpiresIn(session.expires_at)}
                      </span>
                    </div>
                  </div>

                  {/* User Agent (collapsed) */}
                  <details className="mt-3">
                    <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                      Détails techniques
                    </summary>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 font-mono break-all">
                        {session.user_agent}
                      </p>
                    </div>
                  </details>
                </div>
              </div>

              {/* Actions */}
              <div className="ml-4">
                <button
                  onClick={() => closeSession(session.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Fermer
                </button>
              </div>
            </div>
          </div>
        ))}

        {sessions.length === 0 && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">Aucune session active</p>
            <p className="text-sm text-gray-500 mt-1">
              Vous n'avez aucune session active pour le moment
            </p>
          </div>
        )}
      </div>

      {/* Security Tips */}
      <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Conseils de sécurité
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Fermez les sessions que vous ne reconnaissez pas immédiatement</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Ne vous connectez pas sur des appareils publics ou partagés</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Changez régulièrement votre mot de passe</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Vérifiez régulièrement vos sessions actives</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
