"use client";

import { useState, useEffect } from 'react';
import { Plus, Wallet, CreditCard, Building2, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import PaymentForm from '@/components/forms/PaymentForm';

interface Payment {
  id: number;
  invoice_id: number;
  client_id: number;
  payment_date: string;
  amount: number;
  payment_method: string;
  reference: string | null;
  status: string;
  notes?: string | null;
  invoice?: {
    invoice_number: string;
    total_ttc: number;
  };
  client?: {
    company_name: string;
    name: string;
  };
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  bank_transfer: 'Virement bancaire',
  qr_bill: 'QR-facture',
  card: 'Carte',
  cash: 'Espèces',
  other: 'Autre',
};

const PAYMENT_METHOD_ICONS: Record<string, any> = {
  bank_transfer: Building2,
  qr_bill: CreditCard,
  card: CreditCard,
  cash: Wallet,
  other: DollarSign,
};

export default function PaiementsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchPayments();
    
    // Rafraîchir automatiquement toutes les 30 secondes
    const interval = setInterval(() => {
      fetchPayments();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalCollected = payments
    .filter(p => p.status === 'confirmed')
    .reduce((sum, p) => sum + p.amount, 0);

  const paymentsThisMonth = payments.filter(p => {
    const paymentDate = new Date(p.payment_date);
    const now = new Date();
    return paymentDate.getMonth() === now.getMonth() && 
           paymentDate.getFullYear() === now.getFullYear() &&
           p.status === 'confirmed';
  });

  const totalThisMonth = paymentsThisMonth.reduce((sum, p) => sum + p.amount, 0);

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
            <Wallet className="w-8 h-8 text-brand-orange" />
            Paiements
          </h1>
          <p className="text-gray-600 mt-2">
            Enregistrez et suivez les paiements reçus (Collected Revenue)
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-orange to-brand-orange-light text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Enregistrer un Paiement
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Encaissé</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalCollected.toLocaleString('fr-CH')} CHF
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
              <p className="text-sm text-gray-600">Ce Mois</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalThisMonth.toLocaleString('fr-CH')} CHF
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nombre de Paiements</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {payments.filter(p => p.status === 'confirmed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-brand-orange" />
            </div>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Facture
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Méthode
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Référence
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Aucun paiement</p>
                    <p className="text-sm mt-1">Enregistrez votre premier paiement</p>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => {
                  const PaymentIcon = PAYMENT_METHOD_ICONS[payment.payment_method] || DollarSign;
                  
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(payment.payment_date).toLocaleDateString('fr-CH')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {payment.client?.company_name || payment.client?.name || 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-mono text-sm text-gray-900">
                          {payment.invoice?.invoice_number || `#${payment.invoice_id}`}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-green-600">
                          {payment.amount.toLocaleString('fr-CH')} CHF
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <PaymentIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm text-gray-700">
                            {PAYMENT_METHOD_LABELS[payment.payment_method] || payment.payment_method}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-600 font-mono">
                            {payment.reference || '-'}
                          </p>
                          {payment.notes?.includes('automatiquement') && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                              🤖 Auto
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                            payment.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {payment.status === 'confirmed' && <CheckCircle className="w-4 h-4" />}
                          {payment.status === 'confirmed' ? 'Confirmé' : payment.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <PaymentForm
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchPayments();
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}
