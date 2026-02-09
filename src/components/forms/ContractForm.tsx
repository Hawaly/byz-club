"use client";

import { useState, useEffect } from 'react';
import { X, Save, Search } from 'lucide-react';

interface Client {
  id: number;
  name: string;
  company_name: string;
}

interface ContractFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const BILLING_CYCLES = [
  { value: 'monthly', label: 'Mensuel' },
  { value: 'quarterly', label: 'Trimestriel' },
  { value: 'semi_annual', label: 'Semestriel' },
  { value: 'annual', label: 'Annuel' },
];

export default function ContractForm({ onClose, onSuccess }: ContractFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    client_id: 0,
    contract_name: '',
    description: '',
    monthly_amount: 0,
    billing_cycle: 'monthly',
    billing_day: 1,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    auto_activate: false,
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients || []);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des clients:', err);
    }
  };

  const filteredClients = clients.filter(client => {
    const term = searchTerm.toLowerCase();
    return (
      client.name?.toLowerCase().includes(term) ||
      client.company_name?.toLowerCase().includes(term)
    );
  });

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setFormData(prev => ({
      ...prev,
      client_id: client.id,
      contract_name: `Contrat ${client.company_name || client.name}`,
    }));
    setSearchTerm('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedClient) {
      setError('Veuillez sélectionner un client');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          end_date: formData.end_date || null,
          status: formData.auto_activate ? 'active' : 'draft',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du contrat');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Créer un Contrat</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          )}

          {/* Sélection du client */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Client <span className="text-red-500">*</span>
            </label>
            
            {selectedClient ? (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedClient.company_name || selectedClient.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedClient(null)}
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Changer
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                </div>
                
                {searchTerm && (
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg divide-y">
                    {filteredClients.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        Aucun client trouvé
                      </div>
                    ) : (
                      filteredClients.map(client => (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => handleClientSelect(client)}
                          className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          <p className="font-semibold text-gray-900">
                            {client.company_name || client.name}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Nom du contrat */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nom du contrat <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.contract_name}
              onChange={(e) => setFormData({ ...formData, contract_name: e.target.value })}
              className="input"
              placeholder="Ex: Contrat Annuel Marketing Digital"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input resize-none"
              placeholder="Description du contrat..."
            />
          </div>

          {/* Montant et cycle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Montant mensuel HT (CHF) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.monthly_amount}
                onChange={(e) => setFormData({ ...formData, monthly_amount: parseFloat(e.target.value) })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cycle de facturation <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.billing_cycle}
                onChange={(e) => setFormData({ ...formData, billing_cycle: e.target.value })}
                className="select"
                required
              >
                {BILLING_CYCLES.map(cycle => (
                  <option key={cycle.value} value={cycle.value}>
                    {cycle.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date de début <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date de fin (optionnelle)
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="input"
                min={formData.start_date}
              />
            </div>
          </div>

          {/* Jour de facturation */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jour de facturation <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.billing_day}
              onChange={(e) => setFormData({ ...formData, billing_day: parseInt(e.target.value) })}
              className="select"
              required
            >
              {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>
                  {day} du mois
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Les factures seront générées automatiquement à cette date chaque mois
            </p>
          </div>

          {/* Auto-activation */}
          <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <input
              type="checkbox"
              id="auto_activate"
              checked={formData.auto_activate}
              onChange={(e) => setFormData({ ...formData, auto_activate: e.target.checked })}
              className="w-4 h-4 text-brand-orange focus:ring-brand-orange border-gray-300 rounded"
            />
            <label htmlFor="auto_activate" className="text-sm font-medium text-gray-700 cursor-pointer">
              Activer automatiquement le contrat (génère immédiatement les échéances)
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !selectedClient}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-orange to-brand-orange-light text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {formData.auto_activate ? 'Créer et Activer' : 'Créer en Brouillon'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
