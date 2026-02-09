"use client";

import { useState, useEffect } from 'react';
import { X, Save, Search } from 'lucide-react';

interface Invoice {
  id: number;
  invoice_number: string;
  total_ttc: number;
  client_id: number;
  client?: {
    name: string;
    company_name: string;
  };
}

interface PaymentFormProps {
  onClose: () => void;
  onSuccess: () => void;
  invoiceId?: number;
}

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Virement bancaire' },
  { value: 'qr_bill', label: 'QR-facture' },
  { value: 'card', label: 'Carte bancaire' },
  { value: 'cash', label: 'Espèces' },
  { value: 'other', label: 'Autre' },
];

export default function PaymentForm({ onClose, onSuccess, invoiceId }: PaymentFormProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    invoice_id: invoiceId || 0,
    payment_date: new Date().toISOString().split('T')[0],
    amount: 0,
    payment_method: 'bank_transfer',
    reference: '',
    notes: '',
  });

  useEffect(() => {
    fetchUnpaidInvoices();
  }, []);

  useEffect(() => {
    if (invoiceId && invoices.length > 0) {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (invoice) {
        setSelectedInvoice(invoice);
        setFormData(prev => ({
          ...prev,
          invoice_id: invoice.id,
          amount: invoice.total_ttc,
        }));
      }
    }
  }, [invoiceId, invoices]);

  const fetchUnpaidInvoices = async () => {
    try {
      const response = await fetch('/api/invoices?status=envoyee');
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des factures:', err);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const term = searchTerm.toLowerCase();
    return (
      invoice.invoice_number.toLowerCase().includes(term) ||
      invoice.client?.name?.toLowerCase().includes(term) ||
      invoice.client?.company_name?.toLowerCase().includes(term)
    );
  });

  const handleInvoiceSelect = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setFormData(prev => ({
      ...prev,
      invoice_id: invoice.id,
      amount: invoice.total_ttc,
    }));
    setSearchTerm('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedInvoice) {
      setError('Veuillez sélectionner une facture');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          client_id: selectedInvoice.client_id,
          status: 'confirmed',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du paiement');
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
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Enregistrer un Paiement</h2>
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

          {/* Sélection de la facture */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Facture <span className="text-red-500">*</span>
            </label>
            
            {selectedInvoice ? (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{selectedInvoice.invoice_number}</p>
                  <p className="text-sm text-gray-600">
                    {selectedInvoice.client?.company_name || selectedInvoice.client?.name}
                  </p>
                  <p className="text-sm font-medium text-green-600 mt-1">
                    {selectedInvoice.total_ttc.toLocaleString('fr-CH')} CHF
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
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
                    placeholder="Rechercher une facture..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                </div>
                
                {searchTerm && (
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg divide-y">
                    {filteredInvoices.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        Aucune facture trouvée
                      </div>
                    ) : (
                      filteredInvoices.map(invoice => (
                        <button
                          key={invoice.id}
                          type="button"
                          onClick={() => handleInvoiceSelect(invoice)}
                          className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          <p className="font-semibold text-gray-900">{invoice.invoice_number}</p>
                          <p className="text-sm text-gray-600">
                            {invoice.client?.company_name || invoice.client?.name}
                          </p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {invoice.total_ttc.toLocaleString('fr-CH')} CHF
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Date de paiement */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date de paiement <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.payment_date}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              className="input"
              required
            />
          </div>

          {/* Montant */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Montant (CHF) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              className="input"
              required
            />
            {selectedInvoice && formData.amount !== selectedInvoice.total_ttc && (
              <p className="text-sm text-amber-600 mt-1">
                ⚠️ Le montant diffère du total de la facture ({selectedInvoice.total_ttc.toLocaleString('fr-CH')} CHF)
              </p>
            )}
          </div>

          {/* Méthode de paiement */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Méthode de paiement <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              className="select"
              required
            >
              {PAYMENT_METHODS.map(method => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Référence */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Référence de transaction
            </label>
            <input
              type="text"
              placeholder="Ex: VIREMENT-2024-001"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="input"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              rows={3}
              placeholder="Notes optionnelles..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input resize-none"
            />
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
              disabled={loading || !selectedInvoice}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-orange to-brand-orange-light text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Enregistrer le Paiement
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
