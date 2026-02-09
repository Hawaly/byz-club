import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireRole } from '@/lib/authz';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification et rôle admin uniquement
    const session = await requireRole(request, [1]);
    if (session instanceof NextResponse) return session;

    const { id: invoiceId } = await params;

    // Récupérer les informations de la facture
    const { data: invoice, error: fetchError } = await supabaseAdmin
      .from('invoice')
      .select('id, client_id, total_ttc, status')
      .eq('id', invoiceId)
      .single();

    if (fetchError || !invoice) {
      throw new Error(`Facture non trouvée: ${fetchError?.message}`);
    }

    // Si la facture est déjà payée, ne rien faire
    if (invoice.status === 'payee') {
      return NextResponse.json({
        success: true,
        message: 'Facture déjà marquée comme payée',
      });
    }

    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

    // 1. Créer l'enregistrement de paiement
    const { error: paymentError } = await supabaseAdmin
      .from('payment')
      .insert([{
        invoice_id: invoice.id,
        client_id: invoice.client_id,
        payment_date: today,
        amount: invoice.total_ttc,
        payment_method: 'other', // Méthode par défaut
        status: 'confirmed',
        notes: 'Paiement enregistré automatiquement via "Marquer comme payée"',
        created_by: session.authUserId,
      }]);

    if (paymentError) {
      console.error('Erreur création paiement:', paymentError);
      throw new Error(`Erreur création paiement: ${paymentError.message}`);
    }

    // 2. Mettre à jour le statut de la facture
    const { error: updateError } = await supabaseAdmin
      .from('invoice')
      .update({ 
        status: 'payee',
        payment_date: today
      })
      .eq('id', invoiceId);

    if (updateError) {
      throw new Error(`Erreur mise à jour facture: ${updateError.message}`);
    }

    // 3. Si la facture est liée à un schedule, mettre à jour le schedule
    const { data: invoiceWithSchedule } = await supabaseAdmin
      .from('invoice')
      .select('source_schedule_id')
      .eq('id', invoiceId)
      .single();

    if (invoiceWithSchedule?.source_schedule_id) {
      await supabaseAdmin
        .from('contract_schedule')
        .update({ status: 'paid' })
        .eq('id', invoiceWithSchedule.source_schedule_id);
    }

    return NextResponse.json({
      success: true,
      message: 'Facture marquée comme payée et paiement enregistré',
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Erreur mark-paid:', err);
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

