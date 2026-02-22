/**
 * Script de migration des factures récurrentes vers le système de contrats
 * 
 * Ce script analyse les factures récurrentes existantes et propose de créer
 * des contrats correspondants pour le nouveau système.
 * 
 * Usage: npx tsx scripts/migrate-invoices-to-contracts.ts [--dry-run]
 */

import { createClient } from '@supabase/supabase-js';
import { Invoice, ClientContract, BillingCycle } from '@/types/database';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RecurringInvoiceGroup {
  client_id: number;
  mandat_id: number | null;
  client_name: string;
  is_recurring: string;
  monthly_amount: number;
  invoice_count: number;
  first_issue_date: string;
  last_issue_date: string;
  invoices: Invoice[];
}

/**
 * Convertit le type de récurrence Invoice vers BillingCycle
 */
function convertRecurrenceToBillingCycle(recurrence: string): BillingCycle {
  switch (recurrence) {
    case 'mensuel':
      return 'monthly';
    case 'trimestriel':
      return 'quarterly';
    case 'annuel':
      return 'annual';
    case 'oneshot':
    default:
      return 'one_time';
  }
}

/**
 * Récupère toutes les factures récurrentes actives
 */
async function getRecurringInvoices(): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoice')
    .select(`
      *,
      client:client_id (
        id,
        company_name,
        name
      )
    `)
    .neq('is_recurring', 'oneshot')
    .order('client_id', { ascending: true })
    .order('issue_date', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch recurring invoices: ${error.message}`);
  }

  return data as any[];
}

/**
 * Groupe les factures par client et type de récurrence
 */
function groupInvoicesByClient(invoices: any[]): RecurringInvoiceGroup[] {
  const groups = new Map<string, RecurringInvoiceGroup>();

  invoices.forEach((invoice) => {
    const key = `${invoice.client_id}-${invoice.mandat_id || 'null'}-${invoice.is_recurring}`;

    if (!groups.has(key)) {
      groups.set(key, {
        client_id: invoice.client_id,
        mandat_id: invoice.mandat_id,
        client_name: invoice.client?.company_name || invoice.client?.name || 'Unknown',
        is_recurring: invoice.is_recurring,
        monthly_amount: invoice.total_ttc,
        invoice_count: 0,
        first_issue_date: invoice.issue_date,
        last_issue_date: invoice.issue_date,
        invoices: [],
      });
    }

    const group = groups.get(key)!;
    group.invoice_count++;
    group.invoices.push(invoice);
    
    if (invoice.issue_date < group.first_issue_date) {
      group.first_issue_date = invoice.issue_date;
    }
    if (invoice.issue_date > group.last_issue_date) {
      group.last_issue_date = invoice.issue_date;
    }

    // Calculer le montant moyen
    const totalAmount = group.invoices.reduce((sum, inv) => sum + inv.total_ttc, 0);
    group.monthly_amount = totalAmount / group.invoice_count;
  });

  return Array.from(groups.values());
}

/**
 * Crée un contrat depuis un groupe de factures
 */
async function createContractFromGroup(
  group: RecurringInvoiceGroup,
  dryRun: boolean = true
): Promise<ClientContract | null> {
  const billingCycle = convertRecurrenceToBillingCycle(group.is_recurring);

  // Calculer le montant HT depuis le TTC moyen
  const monthlyAmountHT = group.monthly_amount / 1.081;

  const contractData = {
    client_id: group.client_id,
    mandat_id: group.mandat_id,
    contract_name: `Contrat ${group.client_name} - Migré`,
    description: `Contrat créé automatiquement depuis ${group.invoice_count} factures récurrentes existantes`,
    monthly_amount: Math.round(monthlyAmountHT * 100) / 100,
    setup_fee: 0,
    start_date: group.first_issue_date,
    end_date: null, // Contrat à durée indéterminée
    duration_months: null,
    billing_cycle: billingCycle,
    invoice_day: new Date(group.first_issue_date).getDate(),
    payment_terms_days: 30,
    auto_generate_invoices: false, // Désactivé par défaut pour migration
    auto_send_invoices: false,
    status: 'draft' as const, // Créer en draft pour révision manuelle
    notes: `Migration automatique - ${group.invoice_count} factures existantes`,
    created_by: null,
  };

  if (dryRun) {
    console.log('  [DRY RUN] Would create contract:', contractData);
    return contractData as any;
  }

  const { data, error } = await supabase
    .from('client_contract')
    .insert([contractData])
    .select()
    .single();

  if (error) {
    console.error('  ✗ Failed to create contract:', error.message);
    return null;
  }

  console.log(`  ✓ Contract created: ID ${data.id}`);
  return data as ClientContract;
}

/**
 * Lie les factures existantes au contrat créé
 */
async function linkInvoicesToContract(
  invoices: Invoice[],
  contractId: number,
  dryRun: boolean = true
): Promise<number> {
  if (dryRun) {
    console.log(`  [DRY RUN] Would link ${invoices.length} invoices to contract ${contractId}`);
    return invoices.length;
  }

  let linkedCount = 0;

  for (const invoice of invoices) {
    const { error } = await supabase
      .from('invoice')
      .update({
        source_contract_id: contractId,
        // Désactiver la récurrence automatique
        auto_send: false,
        next_generation_date: null,
      })
      .eq('id', invoice.id);

    if (error) {
      console.error(`  ✗ Failed to link invoice ${invoice.invoice_number}:`, error.message);
    } else {
      linkedCount++;
    }
  }

  console.log(`  ✓ Linked ${linkedCount}/${invoices.length} invoices to contract`);
  return linkedCount;
}

/**
 * Fonction principale de migration
 */
async function migrateInvoicesToContracts(dryRun: boolean = true) {
  console.log('='.repeat(60));
  console.log('MIGRATION: Factures récurrentes → Contrats');
  console.log('='.repeat(60));
  console.log(`Mode: ${dryRun ? 'DRY RUN (simulation)' : 'PRODUCTION (réel)'}`);
  console.log('');

  try {
    // 1. Récupérer les factures récurrentes
    console.log('1. Récupération des factures récurrentes...');
    const invoices = await getRecurringInvoices();
    console.log(`   Trouvé: ${invoices.length} factures récurrentes`);
    console.log('');

    if (invoices.length === 0) {
      console.log('Aucune facture récurrente à migrer.');
      return;
    }

    // 2. Grouper par client
    console.log('2. Groupement par client et type de récurrence...');
    const groups = groupInvoicesByClient(invoices);
    console.log(`   Trouvé: ${groups.length} groupes de factures`);
    console.log('');

    // 3. Créer les contrats
    console.log('3. Création des contrats...');
    let createdCount = 0;
    let linkedCount = 0;

    for (const group of groups) {
      console.log(`\n   Client: ${group.client_name}`);
      console.log(`   Récurrence: ${group.is_recurring}`);
      console.log(`   Factures: ${group.invoice_count}`);
      console.log(`   Montant moyen: ${group.monthly_amount.toFixed(2)} CHF TTC`);
      console.log(`   Période: ${group.first_issue_date} → ${group.last_issue_date}`);

      // Créer le contrat
      const contract = await createContractFromGroup(group, dryRun);

      if (contract) {
        createdCount++;

        // Lier les factures au contrat
        const linked = await linkInvoicesToContract(
          group.invoices,
          contract.id,
          dryRun
        );
        linkedCount += linked;
      }
    }

    console.log('');
    console.log('='.repeat(60));
    console.log('RÉSUMÉ DE LA MIGRATION');
    console.log('='.repeat(60));
    console.log(`Factures analysées: ${invoices.length}`);
    console.log(`Groupes identifiés: ${groups.length}`);
    console.log(`Contrats créés: ${createdCount}`);
    console.log(`Factures liées: ${linkedCount}`);
    console.log('');

    if (dryRun) {
      console.log('⚠️  SIMULATION UNIQUEMENT - Aucune modification en base');
      console.log('Pour exécuter réellement, lancez: npx tsx scripts/migrate-invoices-to-contracts.ts --production');
    } else {
      console.log('✓ Migration terminée avec succès');
      console.log('');
      console.log('PROCHAINES ÉTAPES:');
      console.log('1. Vérifier les contrats créés (status = draft)');
      console.log('2. Ajuster les montants/dates si nécessaire');
      console.log('3. Activer les contrats: POST /api/contracts/[id]/activate');
      console.log('4. Les anciennes factures restent liées via source_contract_id');
    }

  } catch (error) {
    console.error('');
    console.error('✗ ERREUR lors de la migration:', error);
    process.exit(1);
  }
}

// Exécution du script
const args = process.argv.slice(2);
const dryRun = !args.includes('--production');

migrateInvoicesToContracts(dryRun)
  .then(() => {
    console.log('');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
