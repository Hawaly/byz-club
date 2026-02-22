/**
 * API Routes pour les contrats clients
 * GET /api/contracts - Liste des contrats
 * POST /api/contracts - Créer un contrat
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireSession, requireRole } from '@/lib/authz';
import { ClientContractInsert } from '@/types/database';

// GET /api/contracts - Liste des contrats
export async function GET(request: NextRequest) {
  const session = await requireSession(request);
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('client_id');
  const status = searchParams.get('status');

  try {
    let query = supabaseAdmin
      .from('client_contract')
      .select(`
        *,
        client:client_id (
          id,
          company_name,
          name
        ),
        mandat:mandat_id (
          id,
          title
        )
      `)
      .order('created_at', { ascending: false });

    // Filtrer par client si spécifié
    if (clientId) {
      query = query.eq('client_id', parseInt(clientId));
    }

    // Filtrer par statut si spécifié
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[API] Error fetching contracts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch contracts' },
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

// POST /api/contracts - Créer un contrat
export async function POST(request: NextRequest) {
  const authResult = await requireRole(request, [1]); // Admin only
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();

    // Validation des champs requis
    const requiredFields = [
      'client_id',
      'contract_name',
      'monthly_amount',
      'billing_cycle',
      'start_date',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validation: doit avoir soit end_date soit duration_months (sauf one_time)
    if (body.billing_cycle !== 'one_time' && !body.end_date && !body.duration_months) {
      return NextResponse.json(
        { error: 'Contract must have either end_date or duration_months' },
        { status: 400 }
      );
    }

    // Préparer les données du contrat
    const contractData: ClientContractInsert = {
      client_id: body.client_id,
      mandat_id: body.mandat_id || null,
      contract_name: body.contract_name,
      description: body.description || null,
      monthly_amount: parseFloat(body.monthly_amount),
      setup_fee: body.setup_fee ? parseFloat(body.setup_fee) : 0,
      start_date: body.start_date,
      end_date: body.end_date || null,
      duration_months: body.duration_months || null,
      billing_cycle: body.billing_cycle,
      invoice_day: body.invoice_day || 1,
      payment_terms_days: body.payment_terms_days || 30,
      auto_generate_invoices: body.auto_generate_invoices !== false,
      auto_send_invoices: body.auto_send_invoices || false,
      status: 'draft',
      notes: body.notes || null,
      created_by: authResult.authUserId,
    };

    // Insérer le contrat
    const { data, error } = await supabaseAdmin
      .from('client_contract')
      .insert([contractData])
      .select(`
        *,
        client:client_id (
          id,
          company_name,
          name
        )
      `)
      .single();

    if (error) {
      console.error('[API] Error creating contract:', error);
      return NextResponse.json(
        { error: 'Failed to create contract', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
