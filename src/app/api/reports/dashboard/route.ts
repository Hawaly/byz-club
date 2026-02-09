/**
 * API Route pour le tableau de bord comptable
 * GET /api/reports/dashboard - Statistiques et KPIs comptables
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireSession } from '@/lib/authz';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const session = await requireSession(request);
  if (session instanceof NextResponse) return session;

  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Récupérer toutes les factures
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoice')
      .select('*')
      .order('created_at', { ascending: false });

    if (invoicesError) throw invoicesError;

    // Récupérer tous les paiements
    const { data: payments, error: paymentsError } = await supabase
      .from('payment')
      .select('*')
      .eq('status', 'confirmed')
      .order('payment_date', { ascending: false });

    if (paymentsError) throw paymentsError;

    // Récupérer les contrats actifs
    const { data: contracts, error: contractsError } = await supabase
      .from('client_contract')
      .select('*')
      .eq('status', 'active');

    if (contractsError) throw contractsError;

    // === CALCULS DU MOIS EN COURS ===
    const invoicesThisMonth = invoices?.filter(inv => {
      const invDate = new Date(inv.invoice_date);
      return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
    }) || [];

    const paymentsThisMonth = payments?.filter(pay => {
      const payDate = new Date(pay.payment_date);
      return payDate.getMonth() === currentMonth && payDate.getFullYear() === currentYear;
    }) || [];

    const expectedRevenue = invoicesThisMonth.reduce((sum, inv) => sum + (inv.total_ttc || 0), 0);
    const invoicedRevenue = invoicesThisMonth
      .filter(inv => inv.status === 'envoyee' || inv.status === 'payee')
      .reduce((sum, inv) => sum + (inv.total_ttc || 0), 0);
    const collectedRevenue = paymentsThisMonth.reduce((sum, pay) => sum + (pay.amount || 0), 0);

    // === FACTURES EN RETARD (IMPAYÉS) ===
    const overdueInvoices = invoices?.filter(inv => {
      if (inv.status !== 'envoyee') return false;
      const dueDate = new Date(inv.due_date);
      return dueDate < now;
    }) || [];

    const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + (inv.total_ttc || 0), 0);

    // === TAUX DE RECOUVREMENT ===
    const recoveryRate = invoicedRevenue > 0 ? (collectedRevenue / invoicedRevenue) * 100 : 0;

    // === REVENUS MENSUELS RÉCURRENTS (MRR) ===
    const mrr = contracts?.reduce((sum, contract) => sum + (contract.monthly_amount || 0), 0) || 0;

    // === ÉVOLUTION SUR 6 MOIS ===
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentYear, currentMonth - i, 1);
      const month = targetDate.getMonth();
      const year = targetDate.getFullYear();

      const monthInvoices = invoices?.filter(inv => {
        const invDate = new Date(inv.invoice_date);
        return invDate.getMonth() === month && invDate.getFullYear() === year;
      }) || [];

      const monthPayments = payments?.filter(pay => {
        const payDate = new Date(pay.payment_date);
        return payDate.getMonth() === month && payDate.getFullYear() === year;
      }) || [];

      monthlyData.push({
        month: targetDate.toLocaleDateString('fr-CH', { month: 'short', year: 'numeric' }),
        expected: monthInvoices.reduce((sum, inv) => sum + (inv.total_ttc || 0), 0),
        invoiced: monthInvoices
          .filter(inv => inv.status === 'envoyee' || inv.status === 'payee')
          .reduce((sum, inv) => sum + (inv.total_ttc || 0), 0),
        collected: monthPayments.reduce((sum, pay) => sum + (pay.amount || 0), 0),
      });
    }

    // === TOP 5 CLIENTS PAR CA ===
    const clientRevenue = new Map<number, { name: string; amount: number }>();
    
    for (const payment of payments || []) {
      if (!payment.client_id) continue;
      
      const existing = clientRevenue.get(payment.client_id);
      if (existing) {
        existing.amount += payment.amount;
      } else {
        // Récupérer le nom du client
        const { data: client } = await supabase
          .from('client')
          .select('name, company_name')
          .eq('id', payment.client_id)
          .single();
        
        if (client) {
          clientRevenue.set(payment.client_id, {
            name: client.company_name || client.name,
            amount: payment.amount,
          });
        }
      }
    }

    const topClients = Array.from(clientRevenue.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // === PRÉVISIONS 3 MOIS ===
    const forecasts = [];
    for (let i = 1; i <= 3; i++) {
      const forecastDate = new Date(currentYear, currentMonth + i, 1);
      forecasts.push({
        month: forecastDate.toLocaleDateString('fr-CH', { month: 'short', year: 'numeric' }),
        projected: mrr, // Basé sur les contrats actifs
      });
    }

    // === STATISTIQUES PAR STATUT ===
    const draftInvoices = invoices?.filter(inv => inv.status === 'brouillon') || [];
    const sentInvoices = invoices?.filter(inv => inv.status === 'envoyee') || [];
    const paidInvoices = invoices?.filter(inv => inv.status === 'payee') || [];

    return NextResponse.json({
      // KPIs principaux
      currentMonth: {
        expectedRevenue,
        invoicedRevenue,
        collectedRevenue,
        recoveryRate: Math.round(recoveryRate * 10) / 10,
      },
      
      // Impayés
      overdue: {
        count: overdueInvoices.length,
        amount: overdueAmount,
        invoices: overdueInvoices.slice(0, 10), // Top 10 impayés
      },
      
      // Revenus récurrents
      mrr,
      
      // Évolution
      monthlyData,
      
      // Top clients
      topClients,
      
      // Prévisions
      forecasts,
      
      // Statistiques par statut
      invoiceStats: {
        draft: {
          count: draftInvoices.length,
          amount: draftInvoices.reduce((sum, inv) => sum + (inv.total_ttc || 0), 0),
        },
        sent: {
          count: sentInvoices.length,
          amount: sentInvoices.reduce((sum, inv) => sum + (inv.total_ttc || 0), 0),
        },
        paid: {
          count: paidInvoices.length,
          amount: paidInvoices.reduce((sum, inv) => sum + (inv.total_ttc || 0), 0),
        },
      },
      
      // Contrats
      contractStats: {
        active: contracts?.length || 0,
        mrr,
      },
    });
  } catch (error) {
    console.error('[API] Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
