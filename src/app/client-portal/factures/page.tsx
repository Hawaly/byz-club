"use client";

import { useState, useEffect } from 'react';
import { useRequireClient } from '@/contexts/SimpleAuthContext';

interface User {
  id: number;
  email: string;
  role_code: string;
  role_name: string;
  role_id: number; 
  client_id?: number;
  client_name?: string;
}
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabaseClient';
import { 
  FileText, Download, Eye, Clock, CheckCircle, 
  AlertCircle, DollarSign, ChevronRight, ArrowUpRight, Loader2, X,
  Calendar
} from 'lucide-react';
import { PageHeader } from '@/components/client-portal/PageHeader';
import { StatCard } from '@/components/client-portal/StatCard';
import { ModernCard } from '@/components/client-portal/ModernCard';

interface Invoice {
  id: number;
  invoice_number: string;
  issue_date: string;
  due_date?: string;
  total_ht?: number;
  total_tva?: number;
  total_ttc?: number;
  status: 'payee' | 'envoyee' | 'brouillon';
  pdf_path?: string;
  qr_bill_path?: string;
  client_id: number;
}

export default function FacturesPage() {
  // useRequireClient garantit que user existe ou redirige
  const { user } = useRequireClient() as { user: User, isLoading: boolean };
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState<number | null>(null);
  const [downloadingQr, setDownloadingQr] = useState<number | null>(null);
  
  useEffect(() => {
    // useRequireClient guarantees user exists or redirects
    if (!user || !user.client_id) return;
    
    async function fetchInvoices() {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('invoice')
          .select('*')
          .eq('client_id', user.client_id)
          .order('issue_date', { ascending: false });
        
        if (error) throw error;
        setInvoices(data || []);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchInvoices();
  }, [user]);
  
  // Download PDF function
  const handleDownloadPdf = async (invoice: Invoice) => {
    setDownloadingPdf(invoice.id);
    try {
      let pdfPath = invoice.pdf_path;
      
      // If PDF path doesn't exist, generate it first
      if (!pdfPath) {
        const response = await fetch('/api/invoices/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invoice_id: invoice.id })
        });
        
        if (!response.ok) throw new Error('PDF generation failed');
        
        const result = await response.json();
        pdfPath = result.pdf_path || `/uploads/invoices/${invoice.invoice_number}.pdf`;
      }
      
      // Convert path to API path for local development
      let downloadPath = pdfPath || '';
      
      if (pdfPath) {
        // If it's a local path without /uploads/ prefix, add it
        if (pdfPath.startsWith('/invoices/') || pdfPath.startsWith('/contracts/')) {
          downloadPath = `/api/uploads${pdfPath}`;
        }
        // If it's already a /uploads/ path, convert to API path
        else if (pdfPath.startsWith('/uploads/')) {
          downloadPath = `/api${pdfPath}`;
        }
        // If it's a Supabase path (no leading slash), use uploads API
        else if (!pdfPath.startsWith('/') && !pdfPath.startsWith('http')) {
          downloadPath = `/api/uploads/${pdfPath}`;
        }
      }
      
      // Open download in new tab
      window.open(downloadPath, '_blank');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Erreur lors du téléchargement du PDF');
    } finally {
      setDownloadingPdf(null);
    }
  };
  
  // Download QR code function
  const handleDownloadQr = async (invoice: Invoice) => {
    setDownloadingQr(invoice.id);
    try {
      // If QR-bill path exists, use it
      if (invoice.qr_bill_path) {
        let qrPath = invoice.qr_bill_path;
        let downloadPath = qrPath;
        
        // Convert path to API path for local development
        if (qrPath.startsWith('/qr-bills/') || qrPath.startsWith('/invoices/')) {
          downloadPath = `/api/uploads${qrPath}`;
        } else if (qrPath.startsWith('/uploads/')) {
          downloadPath = `/api${qrPath}`;
        } else if (!qrPath.startsWith('/') && !qrPath.startsWith('http')) {
          downloadPath = `/api/uploads/${qrPath}`;
        }
        
        window.open(downloadPath, '_blank');
      } else {
        // Generate QR-bill via API
        const qrUrl = `/api/invoices/${invoice.id}/qr-bill`;
        window.open(qrUrl, '_blank');
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Erreur lors du téléchargement du QR code');
    } finally {
      setDownloadingQr(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 inline-flex p-4 rounded-full mx-auto mb-4">
          <FileText className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucune facture disponible</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Vous n'avez pas encore de factures dans votre espace client.
        </p>
      </div>
    );
  }

  // Group invoices by status
  const pendingInvoices = invoices.filter(i => i.status === 'envoyee');
  const paidInvoices = invoices.filter(i => i.status === 'payee');
  const draftInvoices = invoices.filter(i => i.status === 'brouillon');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <PageHeader
        title="Vos Factures"
        icon={FileText}
        gradient="from-purple-500 to-indigo-600"
      />

      {/* Payment stats - Standardized */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
        <StatCard
          label="Total des factures"
          value={invoices.length}
          icon={FileText}
          gradient="from-purple-500 to-indigo-600"
          delay={0.1}
        />
        <StatCard
          label="À payer"
          value={pendingInvoices.length}
          icon={Clock}
          gradient="from-red-500 to-orange-600"
          delay={0.2}
        />
        <div className="col-span-2 md:col-span-1">
          <StatCard
            label="Factures payées"
            value={paidInvoices.length}
            icon={CheckCircle}
            gradient="from-green-500 to-emerald-600"
            delay={0.3}
          />
        </div>
      </div>

      {/* Pending Invoices Section */}
      {pendingInvoices.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">Factures à payer</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingInvoices.map((invoice, i) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <ModernCard title="" className="overflow-hidden border-none shadow-sm !p-0 bg-white">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b-2 border-red-100">
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-200">
                          À payer
                        </span>
                        <h3 className="text-lg font-black text-slate-900 mt-3 truncate">{invoice.invoice_number}</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                          Émise le {new Date(invoice.issue_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Échéance</p>
                        <p className="text-sm font-black text-red-600 bg-red-100/50 px-2 py-1 rounded-lg">
                          {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('fr-FR') : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-6">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Montant</p>
                      <div className="flex items-baseline gap-1.5">
                        <p className="text-2xl font-black text-slate-900 tracking-tight">
                          {invoice.total_ttc?.toLocaleString('fr-CH')}
                        </p>
                        <p className="text-xs font-black text-slate-400 uppercase">CHF TTC</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownloadPdf(invoice)}
                          disabled={downloadingPdf === invoice.id}
                          className="btn btn-primary !from-purple-500 !to-indigo-600 flex-1 !py-2.5 text-xs font-black uppercase tracking-widest shadow-xl disabled:opacity-70"
                        >
                          {downloadingPdf === invoice.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )} 
                          Facture
                        </button>
                        
                        <button
                          onClick={() => handleDownloadQr(invoice)}
                          disabled={downloadingQr === invoice.id}
                          className="btn btn-primary !from-blue-500 !to-indigo-600 flex-1 !py-2.5 text-xs font-black uppercase tracking-widest shadow-xl disabled:opacity-70"
                        >
                          {downloadingQr === invoice.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )} 
                          QR-Code
                        </button>
                      </div>
                      
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
                        className="btn btn-secondary w-full !py-2.5 text-xs font-black uppercase tracking-widest"
                      >
                        <Eye className="w-4 h-4" />
                        Détails
                      </button>
                    </div>
                  </div>
                </ModernCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Paid Invoices Section */}
      {paidInvoices.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">Factures payées</h2>
          </div>

          <div className="hidden lg:block">
            <div className="table-container border-none shadow-sm overflow-hidden bg-white">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-100">
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Facture</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Date</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Montant</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Statut</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paidInvoices.map((invoice, i) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileText className="w-5 h-5 text-purple-600" />
                          </div>
                          <span className="font-black text-slate-900">{invoice.invoice_number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-xs font-black text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(invoice.issue_date).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-black text-slate-900">{invoice.total_ttc?.toLocaleString('fr-CH')} CHF</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">HT: {invoice.total_ht?.toLocaleString('fr-CH')} CHF</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg bg-emerald-50 text-emerald-700 border-2 border-emerald-100">
                          <CheckCircle className="w-3.5 h-3.5" /> Payée
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDownloadPdf(invoice)}
                            disabled={downloadingPdf === invoice.id}
                            className="btn btn-secondary !p-2 rounded-xl group-hover:bg-white"
                            title="Télécharger PDF"
                          >
                            {downloadingPdf === invoice.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                          </button>
                          
                          <button
                            onClick={() => setSelectedInvoice(invoice)}
                            className="btn btn-secondary !p-2 rounded-xl group-hover:bg-white"
                            title="Voir détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vue mobile pour factures payées */}
          <div className="lg:hidden space-y-3">
            {paidInvoices.map((invoice, i) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedInvoice(invoice)}
                className="bg-white rounded-2xl p-4 border-2 border-slate-100 shadow-sm active:scale-[0.98] transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-900 truncate">{invoice.invoice_number}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                      Payée le {new Date(invoice.issue_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-slate-900">{invoice.total_ttc?.toLocaleString('fr-CH')} CHF</div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-lg border border-emerald-100">
                      Payée
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                    <Calendar className="w-3 h-3" />
                    Émise le {new Date(invoice.issue_date).toLocaleDateString('fr-FR')}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Invoice View Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full h-full sm:h-auto sm:max-h-[90vh] flex flex-col"
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 sm:p-8 text-white relative flex-shrink-0">
              <button
                onClick={() => setSelectedInvoice(null)}
                aria-label="Fermer la fenêtre"
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-all active:scale-95"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="pr-12">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/20">
                    Facture #{selectedInvoice.invoice_number}
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight leading-tight">Détails de facturation</h2>
                <p className="text-[10px] sm:text-xs font-black text-white/70 uppercase tracking-[0.2em] mt-2">
                  Émise le {new Date(selectedInvoice.issue_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Statut</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border-2 ${
                    selectedInvoice.status === 'payee' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {selectedInvoice.status === 'payee' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {selectedInvoice.status === 'payee' ? 'Payée' : 'Envoyée'}
                  </span>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Échéance</p>
                  <p className="text-sm font-black text-slate-900">
                    {selectedInvoice.due_date 
                      ? new Date(selectedInvoice.due_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) 
                      : 'Non spécifiée'
                    }
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 sm:p-8 rounded-3xl border-2 border-purple-100 shadow-inner-glow">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Montant HT</p>
                    <p className="text-lg font-black text-slate-900">
                      {selectedInvoice.total_ht?.toLocaleString('fr-CH')} <span className="text-[10px] text-slate-400">CHF</span>
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">TVA</p>
                    <p className="text-lg font-black text-slate-900">
                      {selectedInvoice.total_tva?.toLocaleString('fr-CH')} <span className="text-[10px] text-slate-400">CHF</span>
                    </p>
                  </div>
                  
                  <div className="space-y-1 sm:text-right">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Total TTC</p>
                    <p className="text-2xl font-black text-indigo-600">
                      {selectedInvoice.total_ttc?.toLocaleString('fr-CH')} <span className="text-xs">CHF</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => handleDownloadPdf(selectedInvoice)} 
                  disabled={downloadingPdf === selectedInvoice.id}
                  className="btn btn-primary !from-purple-500 !to-indigo-600 flex-1 !py-3 text-xs font-black uppercase tracking-widest shadow-xl disabled:opacity-70"
                >
                  {downloadingPdf === selectedInvoice.id 
                    ? <Loader2 className="w-5 h-5 animate-spin" /> 
                    : <Download className="w-5 h-5" />
                  }
                  Télécharger PDF
                </button>
                
                {selectedInvoice.status === 'envoyee' && (
                  <button 
                    onClick={() => handleDownloadQr(selectedInvoice)} 
                    disabled={downloadingQr === selectedInvoice.id}
                    className="btn btn-primary !from-blue-500 !to-indigo-600 flex-1 !py-3 text-xs font-black uppercase tracking-widest shadow-xl disabled:opacity-70"
                  >
                    {downloadingQr === selectedInvoice.id 
                      ? <Loader2 className="w-5 h-5 animate-spin" /> 
                      : <Download className="w-5 h-5" />
                    }
                    QR de paiement
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8 border-t-2 border-slate-50 bg-slate-50/50 flex justify-end flex-shrink-0">
              <button
                className="btn btn-secondary !px-10 w-full sm:w-auto font-black uppercase tracking-widest text-xs"
                onClick={() => setSelectedInvoice(null)}
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Payment Instructions Card */}
      {pendingInvoices.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" /> Comment payer vos factures
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-100 rounded-lg">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Téléchargez le QR-code</p>
                <p className="text-gray-600 text-sm">Cliquez sur le bouton "QR-Code" pour télécharger le QR-code de paiement.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-100 rounded-lg">
                <ArrowUpRight className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Scannez avec votre e-banking</p>
                <p className="text-gray-600 text-sm">Utilisez l'application de votre banque pour scanner le QR-code et effectuer le paiement.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Confirmation automatique</p>
                <p className="text-gray-600 text-sm">Votre paiement sera automatiquement enregistré et votre facture marquée comme payée.</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
