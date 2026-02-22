"use client";

import { useState, useEffect } from 'react';
import { Plus, FileSignature, Calendar, DollarSign, CheckCircle, XCircle, Clock, Play, Trash2 } from 'lucide-react';
import { ClientContract, CONTRACT_STATUS_LABELS, CONTRACT_STATUS_COLORS, BILLING_CYCLE_LABELS, BillingCycle, ContractStatus } from '@/types/database';
import ContractForm from '@/components/forms/ContractForm';

export default function ContratsPage() {
  const [contracts, setContracts] = useState<ClientContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await fetch('/api/contracts');
      if (response.ok) {
        const data = await response.json();
        setContracts(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des contrats:', error);
    } finally {
      setLoading(false);
    }
  };

  const activateContract = async (contractId: number) => {
    if (!confirm('Activer ce contrat ? Cela générera automatiquement les échéances de facturation.')) {
      return;
    }

    try {
      const response = await fetch(`/api/contracts/${contractId}/activate`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Contrat activé avec succès !');
        fetchContracts();
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'activation:', error);
      alert('Erreur lors de l\'activation du contrat');
    }
  };

  const deleteContract = async (contractId: number, contractName: string) => {
    if (!confirm(`Supprimer le contrat "${contractName}" ? Cette action est irréversible.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Contrat supprimé avec succès !');
        fetchContracts();
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du contrat');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'draft':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'suspended':
        return <XCircle className="w-5 h-5 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
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
            <FileSignature className="w-8 h-8 text-brand-orange" />
            Contrats Clients
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les contrats virtuels et les échéances de facturation
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-orange to-brand-orange-light text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Nouveau Contrat
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Contrats Actifs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {contracts.filter(c => c.status === 'active').length}
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
              <p className="text-sm text-gray-600">Brouillons</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {contracts.filter(c => c.status === 'draft').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus Mensuels</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {contracts
                  .filter(c => c.status === 'active')
                  .reduce((sum, c) => sum + c.monthly_amount, 0)
                  .toLocaleString('fr-CH')} CHF
              </p>
            </div>
            <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-brand-orange" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Contrats</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {contracts.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileSignature className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contrat
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Montant Mensuel
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cycle
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Période
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <FileSignature className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Aucun contrat</p>
                    <p className="text-sm mt-1">Créez votre premier contrat pour commencer</p>
                  </td>
                </tr>
              ) : (
                contracts.map((contract: any) => (
                  <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-orange/10 rounded-lg flex items-center justify-center">
                          <FileSignature className="w-5 h-5 text-brand-orange" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{contract.contract_name}</p>
                          {contract.description && (
                            <p className="text-sm text-gray-500 truncate max-w-xs">{contract.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {contract.client?.company_name || contract.client?.name || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {contract.monthly_amount.toLocaleString('fr-CH')} CHF
                      </p>
                      <p className="text-xs text-gray-500">HT</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {BILLING_CYCLE_LABELS[contract.billing_cycle as keyof typeof BILLING_CYCLE_LABELS]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(contract.start_date).toLocaleDateString('fr-CH')}</span>
                        {contract.end_date && (
                          <>
                            <span>→</span>
                            <span>{new Date(contract.end_date).toLocaleDateString('fr-CH')}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                          CONTRACT_STATUS_COLORS[contract.status as keyof typeof CONTRACT_STATUS_COLORS]
                        }`}
                      >
                        {getStatusIcon(contract.status)}
                        {CONTRACT_STATUS_LABELS[contract.status as keyof typeof CONTRACT_STATUS_LABELS]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {contract.status === 'draft' && (
                          <button
                            onClick={() => activateContract(contract.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            <Play className="w-4 h-4" />
                            Activer
                          </button>
                        )}
                        
                        {(contract.status === 'draft' || contract.status === 'cancelled') && (
                          <button
                            onClick={() => deleteContract(contract.id, contract.contract_name)}
                            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <ContractForm
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchContracts();
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}
