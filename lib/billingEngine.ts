/**
 * Billing Engine - Moteur de facturation automatique
 * 
 * Ce module gère la génération automatique des factures à partir des échéances contractuelles.
 * Il est conçu pour être appelé par un cron job quotidien.
 */

import {
  ClientContract,
  ContractSchedule,
  Invoice,
  InvoiceItem,
  InvoiceInsert,
  InvoiceItemInsert,
  BillingCycle,
} from '@/types/database';
import { generateInvoiceNumber, calculateInvoiceTotals } from './invoiceHelpers';
import { supabaseAdmin } from './supabaseAdmin';

const supabase = supabaseAdmin;

// =====================================================
// TYPES ET INTERFACES
// =====================================================

export interface ScheduleDueForInvoicing extends ContractSchedule {
  client_id: number;
  contract_name: string;
  auto_generate_invoices: boolean;
  auto_send_invoices: boolean;
  payment_terms_days: number;
  client_name: string;
  mandat_id: number | null;
}

export interface InvoiceGenerationResult {
  success: boolean;
  invoice?: Invoice;
  schedule?: ContractSchedule;
  error?: string;
}

export interface BillingRunResult {
  success: boolean;
  invoices_generated: number;
  invoices: Invoice[];
  errors: Array<{ schedule_id: number; error: string }>;
  run_date: string;
}

// =====================================================
// FONCTIONS UTILITAIRES
// =====================================================

/**
 * Ajuste une date au jour de facturation du mois
 * Gère les mois courts (28/29/30/31 jours)
 * Si le jour de facturation est avant la date de début, passe au mois suivant
 */
export function adjustToInvoiceDay(date: Date, invoiceDay: number): Date {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // Obtenir le nombre de jours dans le mois
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Ajuster le jour si nécessaire (ex: 31 février → 28/29)
  const actualDay = Math.min(invoiceDay, daysInMonth);
  
  const issueDate = new Date(year, month, actualDay);
  
  // Si la date d'émission est avant la date de début de période,
  // passer au mois suivant
  if (issueDate < date) {
    const nextMonth = month + 1;
    const nextYear = nextMonth > 11 ? year + 1 : year;
    const nextMonthIndex = nextMonth > 11 ? 0 : nextMonth;
    const daysInNextMonth = new Date(nextYear, nextMonthIndex + 1, 0).getDate();
    const nextActualDay = Math.min(invoiceDay, daysInNextMonth);
    return new Date(nextYear, nextMonthIndex, nextActualDay);
  }
  
  return issueDate;
}

/**
 * Ajoute des jours à une date
 */
export function addDays(date: Date | string, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Ajoute des mois à une date
 */
export function addMonths(date: Date | string, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Formate une date en string YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Obtient l'incrément de mois selon le cycle de facturation
 */
export function getMonthsIncrement(billingCycle: BillingCycle): number {
  switch (billingCycle) {
    case 'monthly':
      return 1;
    case 'quarterly':
      return 3;
    case 'semi_annual':
      return 6;
    case 'annual':
      return 12;
    case 'one_time':
      return 0;
    default:
      return 1;
  }
}

/**
 * Calcule la date de fin de période
 */
export function getPeriodEndDate(
  startDate: Date,
  billingCycle: BillingCycle
): Date {
  if (billingCycle === 'one_time') {
    return startDate;
  }
  
  const months = getMonthsIncrement(billingCycle);
  const endDate = addMonths(startDate, months);
  
  // Retourner le dernier jour du mois précédent
  endDate.setDate(0);
  return endDate;
}

// =====================================================
// GÉNÉRATION DES ÉCHÉANCES (SCHEDULES)
// =====================================================

/**
 * Génère toutes les échéances pour un contrat
 */
export async function generateSchedulesForContract(
  contract: ClientContract
): Promise<ContractSchedule[]> {
  const schedules: ContractSchedule[] = [];
  
  // Calculer la date de fin du contrat
  let contractEndDate: Date;
  if (contract.end_date) {
    contractEndDate = new Date(contract.end_date);
  } else if (contract.duration_months) {
    contractEndDate = addMonths(contract.start_date, contract.duration_months);
  } else {
    throw new Error('Contract must have either end_date or duration_months');
  }
  
  // 1. Setup fee (si présent)
  if (contract.setup_fee > 0) {
    const setupSchedule: Omit<ContractSchedule, 'id' | 'created_at' | 'updated_at'> = {
      contract_id: contract.id,
      period_start_date: contract.start_date,
      period_end_date: contract.start_date,
      expected_issue_date: contract.start_date,
      expected_due_date: formatDate(addDays(contract.start_date, contract.payment_terms_days)),
      expected_amount: contract.setup_fee,
      status: 'planned',
      invoice_id: null,
      notes: 'Frais d\'installation',
    };
    
    schedules.push(setupSchedule as ContractSchedule);
  }
  
  // 2. Échéances récurrentes
  if (contract.billing_cycle !== 'one_time') {
    let currentDate = new Date(contract.start_date);
    
    while (currentDate < contractEndDate) {
      const periodEnd = getPeriodEndDate(currentDate, contract.billing_cycle);
      const adjustedPeriodEnd = periodEnd < contractEndDate ? periodEnd : new Date(contractEndDate);
      
      // Calculer la date d'émission (ajustée au jour de facturation)
      const issueDate = adjustToInvoiceDay(currentDate, contract.invoice_day);
      
      const schedule: Omit<ContractSchedule, 'id' | 'created_at' | 'updated_at'> = {
        contract_id: contract.id,
        period_start_date: formatDate(currentDate),
        period_end_date: formatDate(adjustedPeriodEnd),
        expected_issue_date: formatDate(issueDate),
        expected_due_date: formatDate(addDays(issueDate, contract.payment_terms_days)),
        expected_amount: contract.monthly_amount,
        status: 'planned',
        invoice_id: null,
        notes: null,
      };
      
      schedules.push(schedule as ContractSchedule);
      
      // Passer à la période suivante
      const monthsIncrement = getMonthsIncrement(contract.billing_cycle);
      currentDate = addMonths(currentDate, monthsIncrement);
    }
  }
  
  return schedules;
}

/**
 * Insère les échéances dans la base de données
 */
export async function insertSchedules(
  schedules: Omit<ContractSchedule, 'id' | 'created_at' | 'updated_at'>[]
): Promise<ContractSchedule[]> {
  const { data, error } = await supabase
    .from('contract_schedule')
    .insert(schedules)
    .select();
  
  if (error) {
    throw new Error(`Failed to insert schedules: ${error.message}`);
  }
  
  return data as ContractSchedule[];
}

// =====================================================
// GÉNÉRATION DES FACTURES
// =====================================================

/**
 * Récupère les échéances à facturer
 */
export async function getSchedulesDueForInvoicing(
  today: Date = new Date()
): Promise<ScheduleDueForInvoicing[]> {
  const todayStr = formatDate(today);
  
  const { data, error } = await supabase
    .from('v_schedules_due_for_invoicing')
    .select('*')
    .lte('expected_issue_date', todayStr)
    .order('expected_issue_date', { ascending: true });
  
  if (error) {
    throw new Error(`Failed to fetch schedules: ${error.message}`);
  }
  
  return data as ScheduleDueForInvoicing[];
}

/**
 * Crée les items de facture depuis le contrat
 */
async function createInvoiceItemsFromContract(
  invoiceId: number,
  contract: ClientContract,
  schedule: ContractSchedule
): Promise<InvoiceItem[]> {
  // Pour l'instant, créer un item simple
  // TODO: Intégrer avec les packages/templates si nécessaire
  
  const description = schedule.notes || 
    `${contract.contract_name} - Période du ${schedule.period_start_date} au ${schedule.period_end_date}`;
  
  const item: InvoiceItemInsert = {
    invoice_id: invoiceId,
    description,
    quantity: 1,
    unit_price: schedule.expected_amount,
    total: schedule.expected_amount,
  };
  
  const { data, error } = await supabase
    .from('invoice_item')
    .insert([item])
    .select();
  
  if (error) {
    throw new Error(`Failed to create invoice items: ${error.message}`);
  }
  
  return data as InvoiceItem[];
}

/**
 * Génère une facture depuis une échéance
 */
export async function generateInvoiceFromSchedule(
  schedule: ScheduleDueForInvoicing
): Promise<InvoiceGenerationResult> {
  try {
    // Utiliser une transaction Supabase (via RPC ou gestion manuelle)
    // Pour simplifier, on fait les opérations séquentiellement
    
    // 1. Récupérer le contrat complet
    const { data: contract, error: contractError } = await supabase
      .from('client_contract')
      .select('*')
      .eq('id', schedule.contract_id)
      .single();
    
    if (contractError || !contract) {
      throw new Error(`Failed to fetch contract: ${contractError?.message}`);
    }
    
    // 2. Générer le numéro de facture
    const invoiceNumber = await generateInvoiceNumber();
    
    // 3. Créer la facture
    const invoiceData: InvoiceInsert = {
      client_id: schedule.client_id,
      mandat_id: schedule.mandat_id,
      invoice_number: invoiceNumber,
      issue_date: schedule.expected_issue_date,
      due_date: schedule.expected_due_date,
      payment_date: null,
      total_ht: 0, // Sera calculé après
      total_tva: 0,
      total_ttc: 0,
      status: schedule.auto_send_invoices ? 'envoyee' : 'brouillon',
      pdf_path: null,
      qr_bill_path: null,
      qr_additional_info: null,
      
      // Champs deprecated (valeurs par défaut)
      is_recurring: 'oneshot',
      recurrence_day: null,
      parent_invoice_id: null,
      next_generation_date: null,
      auto_send: false,
      max_occurrences: null,
      occurrences_count: 0,
      end_date: null,
      
      // Nouveaux champs
      source_contract_id: contract.id,
      source_schedule_id: schedule.id,
    };
    
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoice')
      .insert([invoiceData])
      .select()
      .single();
    
    if (invoiceError || !invoice) {
      throw new Error(`Failed to create invoice: ${invoiceError?.message}`);
    }
    
    // 4. Créer les items de facture
    const items = await createInvoiceItemsFromContract(
      invoice.id,
      contract as ClientContract,
      schedule
    );
    
    // 5. Calculer les totaux
    const totals = calculateInvoiceTotals(
      items.map(item => ({
        quantity: item.quantity,
        unit_price: item.unit_price,
      }))
    );
    
    // 6. Mettre à jour la facture avec les totaux
    const { data: updatedInvoice, error: updateError } = await supabase
      .from('invoice')
      .update({
        total_ht: totals.total_ht,
        total_tva: totals.total_tva,
        total_ttc: totals.total_ttc,
      })
      .eq('id', invoice.id)
      .select()
      .single();
    
    if (updateError || !updatedInvoice) {
      throw new Error(`Failed to update invoice totals: ${updateError?.message}`);
    }
    
    // 7. Mettre à jour l'échéance
    const { data: updatedSchedule, error: scheduleError } = await supabase
      .from('contract_schedule')
      .update({
        status: 'invoiced',
        invoice_id: invoice.id,
      })
      .eq('id', schedule.id)
      .select()
      .single();
    
    if (scheduleError) {
      throw new Error(`Failed to update schedule: ${scheduleError?.message}`);
    }
    
    return {
      success: true,
      invoice: updatedInvoice as Invoice,
      schedule: updatedSchedule as ContractSchedule,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Génère toutes les factures dues
 * Fonction principale appelée par le cron job
 */
export async function generateDueInvoices(
  today: Date = new Date()
): Promise<BillingRunResult> {
  const result: BillingRunResult = {
    success: true,
    invoices_generated: 0,
    invoices: [],
    errors: [],
    run_date: formatDate(today),
  };
  
  try {
    // 1. Récupérer les échéances à facturer
    const schedules = await getSchedulesDueForInvoicing(today);
    
    console.log(`[Billing Engine] Found ${schedules.length} schedules due for invoicing`);
    
    // 2. Générer une facture pour chaque échéance
    for (const schedule of schedules) {
      console.log(`[Billing Engine] Processing schedule ${schedule.id} for contract ${schedule.contract_id}`);
      
      const generationResult = await generateInvoiceFromSchedule(schedule);
      
      if (generationResult.success && generationResult.invoice) {
        result.invoices.push(generationResult.invoice);
        result.invoices_generated++;
        console.log(`[Billing Engine] ✓ Invoice ${generationResult.invoice.invoice_number} created`);
      } else {
        result.errors.push({
          schedule_id: schedule.id,
          error: generationResult.error || 'Unknown error',
        });
        console.error(`[Billing Engine] ✗ Failed to generate invoice for schedule ${schedule.id}: ${generationResult.error}`);
      }
    }
    
    // 3. Déterminer le succès global
    result.success = result.errors.length === 0;
    
    console.log(`[Billing Engine] Run completed: ${result.invoices_generated} invoices generated, ${result.errors.length} errors`);
    
    return result;
  } catch (error) {
    console.error('[Billing Engine] Fatal error during billing run:', error);
    
    return {
      success: false,
      invoices_generated: 0,
      invoices: [],
      errors: [
        {
          schedule_id: 0,
          error: error instanceof Error ? error.message : 'Unknown fatal error',
        },
      ],
      run_date: formatDate(today),
    };
  }
}

// =====================================================
// ACTIVATION DE CONTRAT
// =====================================================

/**
 * Active un contrat et génère ses échéances
 */
export async function activateContract(
  contractId: number
): Promise<{ success: boolean; schedules?: ContractSchedule[]; error?: string }> {
  try {
    // 1. Récupérer le contrat
    const { data: contract, error: fetchError } = await supabase
      .from('client_contract')
      .select('*')
      .eq('id', contractId)
      .single();
    
    if (fetchError || !contract) {
      throw new Error(`Contract not found: ${fetchError?.message}`);
    }
    
    // 2. Vérifier que le contrat est en draft
    if (contract.status !== 'draft') {
      throw new Error(`Contract is not in draft status (current: ${contract.status})`);
    }
    
    // 3. Générer les échéances
    const schedules = await generateSchedulesForContract(contract as ClientContract);
    
    // 4. Insérer les échéances
    const insertedSchedules = await insertSchedules(schedules);
    
    // 5. Mettre à jour le statut du contrat
    const { error: updateError } = await supabase
      .from('client_contract')
      .update({ status: 'active' })
      .eq('id', contractId);
    
    if (updateError) {
      throw new Error(`Failed to activate contract: ${updateError.message}`);
    }
    
    console.log(`[Billing Engine] Contract ${contractId} activated with ${insertedSchedules.length} schedules`);
    
    return {
      success: true,
      schedules: insertedSchedules,
    };
  } catch (error) {
    console.error(`[Billing Engine] Failed to activate contract ${contractId}:`, error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// =====================================================
// GESTION DES PAIEMENTS
// =====================================================

/**
 * Enregistre un paiement et met à jour le statut de la facture/échéance
 */
export async function recordPayment(paymentData: {
  invoice_id: number;
  client_id: number;
  payment_date: string;
  amount: number;
  payment_method: string;
  reference?: string;
  notes?: string;
  created_by?: string;
}): Promise<{ success: boolean; payment?: any; error?: string }> {
  try {
    // 1. Récupérer la facture
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoice')
      .select('*')
      .eq('id', paymentData.invoice_id)
      .single();
    
    if (invoiceError || !invoice) {
      throw new Error(`Invoice not found: ${invoiceError?.message}`);
    }
    
    // 2. Créer le paiement
    const { data: payment, error: paymentError } = await supabase
      .from('payment')
      .insert([{
        invoice_id: paymentData.invoice_id,
        client_id: paymentData.client_id,
        payment_date: paymentData.payment_date,
        amount: paymentData.amount,
        payment_method: paymentData.payment_method,
        reference: paymentData.reference || null,
        status: 'confirmed',
        notes: paymentData.notes || null,
        created_by: paymentData.created_by || null,
      }])
      .select()
      .single();
    
    if (paymentError || !payment) {
      throw new Error(`Failed to create payment: ${paymentError?.message}`);
    }
    
    // 3. Calculer le total payé
    const { data: payments, error: paymentsError } = await supabase
      .from('payment')
      .select('amount')
      .eq('invoice_id', paymentData.invoice_id)
      .eq('status', 'confirmed');
    
    if (paymentsError) {
      throw new Error(`Failed to calculate total paid: ${paymentsError.message}`);
    }
    
    const totalPaid = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    
    // 4. Si totalement payé, mettre à jour la facture et l'échéance
    if (totalPaid >= invoice.total_ttc) {
      // Mettre à jour la facture
      await supabase
        .from('invoice')
        .update({
          status: 'payee',
          payment_date: paymentData.payment_date,
        })
        .eq('id', paymentData.invoice_id);
      
      // Mettre à jour l'échéance si elle existe
      if (invoice.source_schedule_id) {
        await supabase
          .from('contract_schedule')
          .update({ status: 'paid' })
          .eq('id', invoice.source_schedule_id);
      }
      
      console.log(`[Billing Engine] Invoice ${invoice.invoice_number} marked as paid`);
    }
    
    return {
      success: true,
      payment,
    };
  } catch (error) {
    console.error('[Billing Engine] Failed to record payment:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
