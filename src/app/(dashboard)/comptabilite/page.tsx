"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, FileText, Wallet, AlertCircle, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  currentMonth: {
    expectedRevenue: number;
    invoicedRevenue: number;
    collectedRevenue: number;
    recoveryRate: number;
  };
  overdue: {
    count: number;
    amount: number;
    invoices: any[];
  };
  mrr: number;
  monthlyData: Array<{
    month: string;
    expected: number;
    invoiced: number;
    collected: number;
  }>;
  topClients: Array<{
    name: string;
    amount: number;
  }>;
  forecasts: Array<{
    month: string;
    projected: number;
  }>;
  invoiceStats: {
    draft: { count: number; amount: number };
    sent: { count: number; amount: number };
    paid: { count: number; amount: number };
  };
  contractStats: {
    active: number;
    mrr: number;
  };
}

export default function ComptabilitePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/reports/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-500">
          Erreur lors du chargement des statistiques
        </div>
      </div>
    );
  }

  const maxValue = Math.max(
    ...stats.monthlyData.map(d => Math.max(d.expected, d.invoiced, d.collected))
  );

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-brand-orange" />
          Tableau de Bord Comptable
        </h1>
        <p className="text-gray-600 mt-2">
          Vue d'ensemble de votre santé financière
        </p>
      </div>

      {/* KPIs Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Expected Revenue */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-200 px-2 py-1 rounded-full">
              Expected
            </span>
          </div>
          <p className="text-sm text-blue-700 font-medium mb-1">CA Attendu</p>
          <p className="text-3xl font-bold text-blue-900">
            {stats.currentMonth.expectedRevenue.toLocaleString('fr-CH')} CHF
          </p>
          <p className="text-xs text-blue-600 mt-2">Ce mois</p>
        </div>

        {/* Invoiced Revenue */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-purple-700 bg-purple-200 px-2 py-1 rounded-full">
              Invoiced
            </span>
          </div>
          <p className="text-sm text-purple-700 font-medium mb-1">CA Facturé</p>
          <p className="text-3xl font-bold text-purple-900">
            {stats.currentMonth.invoicedRevenue.toLocaleString('fr-CH')} CHF
          </p>
          <p className="text-xs text-purple-600 mt-2">Ce mois</p>
        </div>

        {/* Collected Revenue */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-green-700 bg-green-200 px-2 py-1 rounded-full">
              Collected
            </span>
          </div>
          <p className="text-sm text-green-700 font-medium mb-1">CA Encaissé</p>
          <p className="text-3xl font-bold text-green-900">
            {stats.currentMonth.collectedRevenue.toLocaleString('fr-CH')} CHF
          </p>
          <p className="text-xs text-green-600 mt-2">Ce mois</p>
        </div>

        {/* Recovery Rate */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-brand-orange rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-orange-700 bg-orange-200 px-2 py-1 rounded-full">
              Rate
            </span>
          </div>
          <p className="text-sm text-orange-700 font-medium mb-1">Taux de Recouvrement</p>
          <p className="text-3xl font-bold text-orange-900">
            {stats.currentMonth.recoveryRate}%
          </p>
          <p className="text-xs text-orange-600 mt-2">Ce mois</p>
        </div>
      </div>

      {/* Impayés Alert */}
      {stats.overdue.count > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 mb-1">
                Factures en Retard
              </h3>
              <p className="text-red-700 mb-3">
                Vous avez <strong>{stats.overdue.count} facture{stats.overdue.count > 1 ? 's' : ''}</strong> en retard pour un montant total de{' '}
                <strong>{stats.overdue.amount.toLocaleString('fr-CH')} CHF</strong>
              </p>
              <Link
                href="/factures?filter=overdue"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Voir les impayés
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Évolution sur 6 mois */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-orange" />
            Évolution sur 6 Mois
          </h3>
          <div className="space-y-4">
            {stats.monthlyData.map((data, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{data.month}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {data.collected.toLocaleString('fr-CH')} CHF
                  </span>
                </div>
                <div className="space-y-1">
                  {/* Expected */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${(data.expected / maxValue) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-20 text-right">
                      {data.expected.toLocaleString('fr-CH', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  {/* Invoiced */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-purple-500 h-full rounded-full transition-all"
                        style={{ width: `${(data.invoiced / maxValue) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-20 text-right">
                      {data.invoiced.toLocaleString('fr-CH', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  {/* Collected */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-green-500 h-full rounded-full transition-all"
                        style={{ width: `${(data.collected / maxValue) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-20 text-right">
                      {data.collected.toLocaleString('fr-CH', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-gray-600">Expected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full" />
              <span className="text-gray-600">Invoiced</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-gray-600">Collected</span>
            </div>
          </div>
        </div>

        {/* Top 5 Clients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-orange" />
            Top 5 Clients
          </h3>
          <div className="space-y-4">
            {stats.topClients.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Aucun paiement enregistré</p>
            ) : (
              stats.topClients.map((client, index) => {
                const maxClientAmount = stats.topClients[0].amount;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-brand-orange to-brand-orange-light rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900">{client.name}</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {client.amount.toLocaleString('fr-CH')} CHF
                      </span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-brand-orange to-brand-orange-light h-full rounded-full transition-all"
                        style={{ width: `${(client.amount / maxClientAmount) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Stats supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* MRR */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Revenus Mensuels Récurrents</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {stats.mrr.toLocaleString('fr-CH')} CHF
          </p>
          <p className="text-sm text-gray-600">
            {stats.contractStats.active} contrat{stats.contractStats.active > 1 ? 's' : ''} actif{stats.contractStats.active > 1 ? 's' : ''}
          </p>
        </div>

        {/* Factures envoyées */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Factures Envoyées</h3>
            <FileText className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {stats.invoiceStats.sent.count}
          </p>
          <p className="text-sm text-gray-600">
            {stats.invoiceStats.sent.amount.toLocaleString('fr-CH')} CHF
          </p>
        </div>

        {/* Factures payées */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Factures Payées</h3>
            <Wallet className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {stats.invoiceStats.paid.count}
          </p>
          <p className="text-sm text-gray-600">
            {stats.invoiceStats.paid.amount.toLocaleString('fr-CH')} CHF
          </p>
        </div>
      </div>

      {/* Prévisions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-orange" />
          Prévisions 3 Mois (basé sur MRR)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.forecasts.map((forecast, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <p className="text-sm font-medium text-blue-700 mb-1">{forecast.month}</p>
              <p className="text-2xl font-bold text-blue-900">
                {forecast.projected.toLocaleString('fr-CH')} CHF
              </p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          * Prévisions basées sur les contrats actifs et les revenus mensuels récurrents
        </p>
      </div>

      {/* Actions rapides */}
      <div className="bg-gradient-to-r from-brand-orange to-brand-orange-light rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/factures"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all text-center"
          >
            <FileText className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold">Gérer les Factures</p>
          </Link>
          <Link
            href="/paiements"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all text-center"
          >
            <Wallet className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold">Enregistrer un Paiement</p>
          </Link>
          <Link
            href="/contrats"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all text-center"
          >
            <DollarSign className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold">Gérer les Contrats</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
