/**
 * KPIs Module - Calcul des indicateurs financiers
 * 
 * Ce module fournit les fonctions pour calculer les KPIs financiers:
 * - Expected Revenue (CA attendu selon contrats)
 * - Invoiced Revenue (CA facturé)
 * - Collected Revenue (CA encaissé)
 */

import { supabaseAdmin } from './supabaseAdmin';

const supabase = supabaseAdmin;

// Utilitaire pour formater les dates
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// =====================================================
// TYPES
// =====================================================

export interface RevenueMetrics {
  total: number;
  count: number;
  breakdown?: Array<{
    client_id: number;
    client_name: string;
    amount: number;
  }>;
}

export interface FinancialKPIs {
  expected: RevenueMetrics;
  invoiced: RevenueMetrics;
  collected: RevenueMetrics;
  gap_expected_vs_invoiced: number;
  gap_invoiced_vs_collected: number;
  collection_rate: number; // Collected / Invoiced (%)
  overdue_count: number;
  overdue_amount: number;
}

export interface OverdueInvoice {
  id: number;
  invoice_number: string;
  client_id: number;
  client_name?: string;
  issue_date: string;
  due_date: string;
  total_ttc: number;
  days_overdue: number;
}

// =====================================================
// EXPECTED REVENUE (CA Attendu)
// =====================================================

/**
 * Calcule le CA attendu basé sur les échéances contractuelles
 * Inclut les échéances 'planned' et 'invoiced' (non payées)
 */
export async function getExpectedRevenue(
  startDate?: string,
  endDate?: string
): Promise<RevenueMetrics> {
  let query = supabase
    .from('contract_schedule')
    .select('expected_amount, contract_id, client_contract!inner(client_id, client!inner(company_name))')
    .in('status', ['planned', 'invoiced']);
  
  if (startDate) {
    query = query.gte('expected_issue_date', startDate);
  }
  
  if (endDate) {
    query = query.lte('expected_issue_date', endDate);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('[KPIs] Error fetching expected revenue:', error);
    return { total: 0, count: 0 };
  }
  
  if (!data || data.length === 0) {
    return { total: 0, count: 0 };
  }
  
  const total = data.reduce((sum, schedule) => sum + schedule.expected_amount, 0);
  
  return {
    total,
    count: data.length,
  };
}

/**
 * Calcule le CA attendu par client
 */
export async function getExpectedRevenueByClient(
  startDate?: string,
  endDate?: string,
  topN: number = 10
): Promise<Array<{ client_id: number; client_name: string; amount: number }>> {
  let query = supabase
    .from('contract_schedule')
    .select(`
      expected_amount,
      contract_id,
      client_contract!inner(
        client_id,
        client!inner(company_name)
      )
    `)
    .in('status', ['planned', 'invoiced']);
  
  if (startDate) {
    query = query.gte('expected_issue_date', startDate);
  }
  
  if (endDate) {
    query = query.lte('expected_issue_date', endDate);
  }
  
  const { data, error } = await query;
  
  if (error || !data) {
    console.error('[KPIs] Error fetching expected revenue by client:', error);
    return [];
  }
  
  // Agréger par client
  const clientMap = new Map<number, { client_name: string; amount: number }>();
  
  data.forEach((schedule: any) => {
    const clientId = schedule.client_contract.client_id;
    const clientName = schedule.client_contract.client.company_name || 'Unknown';
    const amount = schedule.expected_amount;
    
    if (clientMap.has(clientId)) {
      clientMap.get(clientId)!.amount += amount;
    } else {
      clientMap.set(clientId, { client_name: clientName, amount });
    }
  });
  
  // Convertir en array et trier
  const result = Array.from(clientMap.entries())
    .map(([client_id, data]) => ({
      client_id,
      client_name: data.client_name,
      amount: data.amount,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, topN);
  
  return result;
}

// =====================================================
// INVOICED REVENUE (CA Facturé)
// =====================================================

/**
 * Calcule le CA facturé basé sur les factures émises (issue_date)
 * Inclut les factures 'envoyee' et 'payee'
 */
export async function getInvoicedRevenue(
  startDate?: string,
  endDate?: string
): Promise<RevenueMetrics> {
  let query = supabase
    .from('invoice')
    .select('total_ttc, client_id, client!inner(company_name)')
    .in('status', ['envoyee', 'payee']);
  
  if (startDate) {
    query = query.gte('issue_date', startDate);
  }
  
  if (endDate) {
    query = query.lte('issue_date', endDate);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('[KPIs] Error fetching invoiced revenue:', error);
    return { total: 0, count: 0 };
  }
  
  if (!data || data.length === 0) {
    return { total: 0, count: 0 };
  }
  
  const total = data.reduce((sum, invoice) => sum + invoice.total_ttc, 0);
  
  return {
    total,
    count: data.length,
  };
}

/**
 * Calcule le CA facturé par client
 */
export async function getInvoicedRevenueByClient(
  startDate?: string,
  endDate?: string,
  topN: number = 10
): Promise<Array<{ client_id: number; client_name: string; amount: number }>> {
  let query = supabase
    .from('invoice')
    .select('total_ttc, client_id, client!inner(company_name)')
    .in('status', ['envoyee', 'payee']);
  
  if (startDate) {
    query = query.gte('issue_date', startDate);
  }
  
  if (endDate) {
    query = query.lte('issue_date', endDate);
  }
  
  const { data, error } = await query;
  
  if (error || !data) {
    console.error('[KPIs] Error fetching invoiced revenue by client:', error);
    return [];
  }
  
  // Agréger par client
  const clientMap = new Map<number, { client_name: string; amount: number }>();
  
  data.forEach((invoice: any) => {
    const clientId = invoice.client_id;
    const clientName = invoice.client.company_name || 'Unknown';
    const amount = invoice.total_ttc;
    
    if (clientMap.has(clientId)) {
      clientMap.get(clientId)!.amount += amount;
    } else {
      clientMap.set(clientId, { client_name: clientName, amount });
    }
  });
  
  // Convertir en array et trier
  const result = Array.from(clientMap.entries())
    .map(([client_id, data]) => ({
      client_id,
      client_name: data.client_name,
      amount: data.amount,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, topN);
  
  return result;
}

// =====================================================
// COLLECTED REVENUE (CA Encaissé)
// =====================================================

/**
 * Calcule le CA encaissé basé sur les paiements confirmés (payment_date)
 */
export async function getCollectedRevenue(
  startDate?: string,
  endDate?: string
): Promise<RevenueMetrics> {
  let query = supabase
    .from('payment')
    .select('amount, client_id, client!inner(company_name)')
    .eq('status', 'confirmed');
  
  if (startDate) {
    query = query.gte('payment_date', startDate);
  }
  
  if (endDate) {
    query = query.lte('payment_date', endDate);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('[KPIs] Error fetching collected revenue:', error);
    return { total: 0, count: 0 };
  }
  
  if (!data || data.length === 0) {
    return { total: 0, count: 0 };
  }
  
  const total = data.reduce((sum, payment) => sum + payment.amount, 0);
  
  return {
    total,
    count: data.length,
  };
}

/**
 * Alternative: Calcule le CA encaissé basé sur invoice.payment_date
 * (Pour compatibilité avec l'ancien système)
 */
export async function getCollectedRevenueFromInvoices(
  startDate?: string,
  endDate?: string
): Promise<RevenueMetrics> {
  let query = supabase
    .from('invoice')
    .select('total_ttc, client_id, client!inner(company_name)')
    .eq('status', 'payee')
    .not('payment_date', 'is', null);
  
  if (startDate) {
    query = query.gte('payment_date', startDate);
  }
  
  if (endDate) {
    query = query.lte('payment_date', endDate);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('[KPIs] Error fetching collected revenue from invoices:', error);
    return { total: 0, count: 0 };
  }
  
  if (!data || data.length === 0) {
    return { total: 0, count: 0 };
  }
  
  const total = data.reduce((sum, invoice) => sum + invoice.total_ttc, 0);
  
  return {
    total,
    count: data.length,
  };
}

/**
 * Calcule le CA encaissé par client
 */
export async function getCollectedRevenueByClient(
  startDate?: string,
  endDate?: string,
  topN: number = 10
): Promise<Array<{ client_id: number; client_name: string; amount: number }>> {
  let query = supabase
    .from('payment')
    .select('amount, client_id, client!inner(company_name)')
    .eq('status', 'confirmed');
  
  if (startDate) {
    query = query.gte('payment_date', startDate);
  }
  
  if (endDate) {
    query = query.lte('payment_date', endDate);
  }
  
  const { data, error } = await query;
  
  if (error || !data) {
    console.error('[KPIs] Error fetching collected revenue by client:', error);
    return [];
  }
  
  // Agréger par client
  const clientMap = new Map<number, { client_name: string; amount: number }>();
  
  data.forEach((payment: any) => {
    const clientId = payment.client_id;
    const clientName = payment.client.company_name || 'Unknown';
    const amount = payment.amount;
    
    if (clientMap.has(clientId)) {
      clientMap.get(clientId)!.amount += amount;
    } else {
      clientMap.set(clientId, { client_name: clientName, amount });
    }
  });
  
  // Convertir en array et trier
  const result = Array.from(clientMap.entries())
    .map(([client_id, data]) => ({
      client_id,
      client_name: data.client_name,
      amount: data.amount,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, topN);
  
  return result;
}

// =====================================================
// FACTURES EN RETARD
// =====================================================

/**
 * Récupère les factures en retard de paiement
 */
export async function getOverdueInvoices(): Promise<OverdueInvoice[]> {
  const today = formatDate(new Date());
  
  const { data, error } = await supabase
    .from('invoice')
    .select('id, invoice_number, client_id, client!inner(company_name), issue_date, due_date, total_ttc')
    .eq('status', 'envoyee')
    .not('due_date', 'is', null)
    .lt('due_date', today)
    .order('due_date', { ascending: true });
  
  if (error) {
    console.error('[KPIs] Error fetching overdue invoices:', error);
    return [];
  }
  
  if (!data || data.length === 0) {
    return [];
  }
  
  // Calculer les jours de retard
  const todayDate = new Date(today);
  
  return data.map((invoice: any) => {
    const dueDate = new Date(invoice.due_date);
    const daysOverdue = Math.floor((todayDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      client_id: invoice.client_id,
      client_name: invoice.client.company_name,
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      total_ttc: invoice.total_ttc,
      days_overdue: daysOverdue,
    };
  });
}

/**
 * Calcule le montant total des factures en retard
 */
export async function getOverdueAmount(): Promise<{ count: number; amount: number }> {
  const overdueInvoices = await getOverdueInvoices();
  
  const amount = overdueInvoices.reduce((sum, invoice) => sum + invoice.total_ttc, 0);
  
  return {
    count: overdueInvoices.length,
    amount,
  };
}

// =====================================================
// GAP ANALYSIS
// =====================================================

/**
 * Calcule l'écart entre Expected et Invoiced
 * Un écart positif indique un retard de facturation
 */
export async function getGapExpectedVsInvoiced(
  startDate?: string,
  endDate?: string
): Promise<number> {
  const expected = await getExpectedRevenue(startDate, endDate);
  const invoiced = await getInvoicedRevenue(startDate, endDate);
  
  return expected.total - invoiced.total;
}

/**
 * Calcule l'écart entre Invoiced et Collected
 * Représente le montant en attente de paiement
 */
export async function getGapInvoicedVsCollected(
  startDate?: string,
  endDate?: string
): Promise<number> {
  const invoiced = await getInvoicedRevenue(startDate, endDate);
  const collected = await getCollectedRevenue(startDate, endDate);
  
  return invoiced.total - collected.total;
}

// =====================================================
// KPIs CONSOLIDÉS
// =====================================================

/**
 * Calcule tous les KPIs financiers en une seule fois
 */
export async function getFinancialKPIs(
  startDate?: string,
  endDate?: string
): Promise<FinancialKPIs> {
  // Exécuter toutes les requêtes en parallèle
  const [expected, invoiced, collected, overdue] = await Promise.all([
    getExpectedRevenue(startDate, endDate),
    getInvoicedRevenue(startDate, endDate),
    getCollectedRevenue(startDate, endDate),
    getOverdueAmount(),
  ]);
  
  // Calculer les gaps
  const gap_expected_vs_invoiced = expected.total - invoiced.total;
  const gap_invoiced_vs_collected = invoiced.total - collected.total;
  
  // Calculer le taux de recouvrement
  const collection_rate = invoiced.total > 0 
    ? (collected.total / invoiced.total) * 100 
    : 0;
  
  return {
    expected,
    invoiced,
    collected,
    gap_expected_vs_invoiced,
    gap_invoiced_vs_collected,
    collection_rate,
    overdue_count: overdue.count,
    overdue_amount: overdue.amount,
  };
}

// =====================================================
// MÉTRIQUES AVANCÉES
// =====================================================

/**
 * Calcule le DSO (Days Sales Outstanding) - Délai moyen de paiement
 */
export async function getAverageDaysToPay(): Promise<number> {
  const { data, error } = await supabase
    .from('invoice')
    .select('issue_date, payment_date')
    .eq('status', 'payee')
    .not('payment_date', 'is', null);
  
  if (error || !data || data.length === 0) {
    return 0;
  }
  
  const totalDays = data.reduce((sum, invoice) => {
    const issueDate = new Date(invoice.issue_date);
    const paymentDate = new Date(invoice.payment_date!);
    const days = Math.floor((paymentDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0);
  
  return Math.round(totalDays / data.length);
}

/**
 * Calcule le MRR (Monthly Recurring Revenue)
 */
export async function getMonthlyRecurringRevenue(): Promise<number> {
  const { data, error } = await supabase
    .from('client_contract')
    .select('monthly_amount, billing_cycle')
    .eq('status', 'active');
  
  if (error || !data) {
    console.error('[KPIs] Error fetching MRR:', error);
    return 0;
  }
  
  // Normaliser tous les montants en mensuel
  const mrr = data.reduce((sum, contract) => {
    let monthlyAmount = contract.monthly_amount;
    
    // Ajuster selon le cycle
    switch (contract.billing_cycle) {
      case 'quarterly':
        monthlyAmount = contract.monthly_amount / 3;
        break;
      case 'semi_annual':
        monthlyAmount = contract.monthly_amount / 6;
        break;
      case 'annual':
        monthlyAmount = contract.monthly_amount / 12;
        break;
      case 'one_time':
        monthlyAmount = 0; // Ne pas compter les one-time dans le MRR
        break;
    }
    
    return sum + monthlyAmount;
  }, 0);
  
  return mrr;
}

/**
 * Calcule l'ARR (Annual Recurring Revenue)
 */
export async function getAnnualRecurringRevenue(): Promise<number> {
  const mrr = await getMonthlyRecurringRevenue();
  return mrr * 12;
}

/**
 * Calcule le taux de paiement par client
 */
export async function getPaymentRateByClient(): Promise<Array<{
  client_id: number;
  client_name: string;
  total_invoices: number;
  paid_invoices: number;
  payment_rate: number;
}>> {
  const { data, error } = await supabase
    .from('invoice')
    .select('client_id, status, client!inner(company_name)')
    .in('status', ['envoyee', 'payee']);
  
  if (error || !data) {
    console.error('[KPIs] Error fetching payment rate by client:', error);
    return [];
  }
  
  // Agréger par client
  const clientMap = new Map<number, {
    client_name: string;
    total: number;
    paid: number;
  }>();
  
  data.forEach((invoice: any) => {
    const clientId = invoice.client_id;
    const clientName = invoice.client.company_name || 'Unknown';
    
    if (clientMap.has(clientId)) {
      const stats = clientMap.get(clientId)!;
      stats.total++;
      if (invoice.status === 'payee') {
        stats.paid++;
      }
    } else {
      clientMap.set(clientId, {
        client_name: clientName,
        total: 1,
        paid: invoice.status === 'payee' ? 1 : 0,
      });
    }
  });
  
  // Convertir en array et calculer le taux
  const result = Array.from(clientMap.entries())
    .map(([client_id, stats]) => ({
      client_id,
      client_name: stats.client_name,
      total_invoices: stats.total,
      paid_invoices: stats.paid,
      payment_rate: (stats.paid / stats.total) * 100,
    }))
    .sort((a, b) => b.payment_rate - a.payment_rate);
  
  return result;
}
