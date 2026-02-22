/**
 * API Routes pour les paiements
 * GET /api/payments - Liste des paiements
 * POST /api/payments - Enregistrer un paiement
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireSession, requireRole } from '@/lib/authz';
import { recordPayment } from '@/lib/billingEngine';
import { PaymentInsert } from '@/types/database';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/payments - Liste des paiements
export async function GET(request: NextRequest) {
  const session = await requireSession(request);
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(request.url);
  const invoiceId = searchParams.get('invoice_id');
  const clientId = searchParams.get('client_id');

  try {
    let query = supabase
      .from('payment')
      .select(`
        *,
        invoice:invoice_id (
          id,
          invoice_number,
          total_ttc
        ),
        client:client_id (
          id,
          company_name,
          name
        )
      `)
      .order('payment_date', { ascending: false });

    // Filtrer par facture si spécifié
    if (invoiceId) {
      query = query.eq('invoice_id', parseInt(invoiceId));
    }

    // Filtrer par client si spécifié
    if (clientId) {
      query = query.eq('client_id', parseInt(clientId));
    }

    const { data, error } = await query;

    if (error) {
      console.error('[API] Error fetching payments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch payments' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/payments - Enregistrer un paiement
export async function POST(request: NextRequest) {
  const authResult = await requireRole(request, [1]); // Admin only
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();

    // Validation des champs requis
    const requiredFields = ['invoice_id', 'client_id', 'payment_date', 'amount', 'payment_method'];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validation du montant
    const amount = parseFloat(body.amount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Enregistrer le paiement via le billing engine
    const result = await recordPayment({
      invoice_id: parseInt(body.invoice_id),
      client_id: parseInt(body.client_id),
      payment_date: body.payment_date,
      amount,
      payment_method: body.payment_method,
      reference: body.reference || undefined,
      notes: body.notes || undefined,
      created_by: authResult.authUserId,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to record payment' },
        { status: 400 }
      );
    }

    return NextResponse.json(result.payment, { status: 201 });
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
