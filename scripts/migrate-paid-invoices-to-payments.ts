/**
 * Script de migration : Créer des paiements pour toutes les factures déjà payées
 * 
 * Ce script parcourt toutes les factures avec status='payee' et crée
 * un enregistrement de paiement correspondant dans la table payment.
 * 
 * Usage: npx tsx scripts/migrate-paid-invoices-to-payments.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger les variables d'environnement depuis .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { supabaseAdmin } from '../lib/supabaseAdmin';

interface Invoice {
  id: number;
  client_id: number;
  total_ttc: number;
  payment_date: string | null;
  invoice_number: string;
  status: string;
}

async function migratePaidInvoices() {
  console.log('🚀 Début de la migration des factures payées...\n');

  try {
    // 1. Récupérer toutes les factures payées
    console.log('📋 Récupération des factures payées...');
    const { data: paidInvoices, error: fetchError } = await supabaseAdmin
      .from('invoice')
      .select('id, client_id, total_ttc, payment_date, invoice_number, status')
      .eq('status', 'payee')
      .order('payment_date', { ascending: true });

    if (fetchError) {
      throw new Error(`Erreur lors de la récupération des factures: ${fetchError.message}`);
    }

    if (!paidInvoices || paidInvoices.length === 0) {
      console.log('✅ Aucune facture payée à migrer.');
      return;
    }

    console.log(`📊 ${paidInvoices.length} factures payées trouvées\n`);

    // 2. Vérifier quelles factures ont déjà un paiement
    const { data: existingPayments, error: paymentsError } = await supabaseAdmin
      .from('payment')
      .select('invoice_id');

    if (paymentsError && paymentsError.code !== '42P01') { // 42P01 = table doesn't exist
      throw new Error(`Erreur lors de la vérification des paiements: ${paymentsError.message}`);
    }

    const existingInvoiceIds = new Set(
      existingPayments?.map(p => p.invoice_id) || []
    );

    // 3. Créer les paiements pour les factures qui n'en ont pas
    const paymentsToCreate = paidInvoices
      .filter(invoice => !existingInvoiceIds.has(invoice.id))
      .filter(invoice => invoice.total_ttc && invoice.total_ttc > 0) // Filtrer les montants invalides
      .map(invoice => ({
        invoice_id: invoice.id,
        client_id: invoice.client_id,
        payment_date: invoice.payment_date || new Date().toISOString().split('T')[0],
        amount: invoice.total_ttc,
        payment_method: 'other',
        status: 'confirmed',
        notes: `Migration automatique - Facture ${invoice.invoice_number}`,
        created_by: null, // Migration système
      }));

    if (paymentsToCreate.length === 0) {
      console.log('✅ Tous les paiements existent déjà.');
      return;
    }

    console.log(`💾 Création de ${paymentsToCreate.length} paiements...\n`);

    // Insérer par lots de 50
    const batchSize = 50;
    let created = 0;
    let errors = 0;

    for (let i = 0; i < paymentsToCreate.length; i += batchSize) {
      const batch = paymentsToCreate.slice(i, i + batchSize);
      
      const { error: insertError } = await supabaseAdmin
        .from('payment')
        .insert(batch);

      if (insertError) {
        console.error(`❌ Erreur lors de l'insertion du lot ${i / batchSize + 1}:`, insertError.message);
        errors += batch.length;
      } else {
        created += batch.length;
        console.log(`✅ Lot ${i / batchSize + 1}: ${batch.length} paiements créés`);
      }
    }

    // 4. Résumé
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ DE LA MIGRATION');
    console.log('='.repeat(60));
    console.log(`Total factures payées:        ${paidInvoices.length}`);
    console.log(`Paiements déjà existants:     ${existingInvoiceIds.size}`);
    console.log(`Paiements créés avec succès:  ${created}`);
    console.log(`Erreurs:                      ${errors}`);
    console.log('='.repeat(60) + '\n');

    if (created > 0) {
      console.log('✅ Migration terminée avec succès !');
      console.log('💡 Vous pouvez maintenant voir vos paiements sur /paiements\n');
    }

  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }
}

// Exécuter la migration
migratePaidInvoices()
  .then(() => {
    console.log('✨ Script terminé');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur non gérée:', error);
    process.exit(1);
  });
