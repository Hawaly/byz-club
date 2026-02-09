/**
 * API Routes pour un contrat spécifique
 * DELETE /api/contracts/[id] - Supprimer un contrat
 * PUT /api/contracts/[id] - Mettre à jour un contrat
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireRole } from '@/lib/authz';
import { ClientContractUpdate } from '@/types/database';

// DELETE /api/contracts/[id] - Supprimer un contrat
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireRole(request, [1]); // Admin only
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const contractId = parseInt(id);

  if (isNaN(contractId)) {
    return NextResponse.json(
      { error: 'Invalid contract ID' },
      { status: 400 }
    );
  }

  try {
    // Vérifier si le contrat existe
    const { data: contract, error: fetchError } = await supabaseAdmin
      .from('client_contract')
      .select('id, status')
      .eq('id', contractId)
      .single();

    if (fetchError || !contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }

    // Vérifier si le contrat peut être supprimé
    // On ne peut supprimer que les contrats en statut 'draft' ou 'cancelled'
    if (contract.status !== 'draft' && contract.status !== 'cancelled') {
      return NextResponse.json(
        { 
          error: 'Cannot delete active or completed contracts. Please cancel it first.',
          current_status: contract.status
        },
        { status: 400 }
      );
    }

    // Supprimer le contrat (les schedules seront supprimés en cascade)
    const { error: deleteError } = await supabaseAdmin
      .from('client_contract')
      .delete()
      .eq('id', contractId);

    if (deleteError) {
      console.error('[API] Error deleting contract:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete contract', details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contract deleted successfully',
    });
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/contracts/[id] - Mettre à jour un contrat
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireRole(request, [1]); // Admin only
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const contractId = parseInt(id);

  if (isNaN(contractId)) {
    return NextResponse.json(
      { error: 'Invalid contract ID' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    // Vérifier si le contrat existe
    const { data: existingContract, error: fetchError } = await supabaseAdmin
      .from('client_contract')
      .select('*')
      .eq('id', contractId)
      .single();

    if (fetchError || !existingContract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }

    // Préparer les données de mise à jour
    const updateData: ClientContractUpdate = {};

    // Champs modifiables
    if (body.contract_name !== undefined) updateData.contract_name = body.contract_name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.monthly_amount !== undefined) updateData.monthly_amount = parseFloat(body.monthly_amount);
    if (body.setup_fee !== undefined) updateData.setup_fee = parseFloat(body.setup_fee);
    if (body.start_date !== undefined) updateData.start_date = body.start_date;
    if (body.end_date !== undefined) updateData.end_date = body.end_date;
    if (body.duration_months !== undefined) updateData.duration_months = body.duration_months;
    if (body.billing_cycle !== undefined) updateData.billing_cycle = body.billing_cycle;
    if (body.invoice_day !== undefined) updateData.invoice_day = body.invoice_day;
    if (body.payment_terms_days !== undefined) updateData.payment_terms_days = body.payment_terms_days;
    if (body.auto_generate_invoices !== undefined) updateData.auto_generate_invoices = body.auto_generate_invoices;
    if (body.auto_send_invoices !== undefined) updateData.auto_send_invoices = body.auto_send_invoices;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.mandat_id !== undefined) updateData.mandat_id = body.mandat_id;

    // Mettre à jour le contrat
    const { data, error } = await supabaseAdmin
      .from('client_contract')
      .update(updateData)
      .eq('id', contractId)
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
      .single();

    if (error) {
      console.error('[API] Error updating contract:', error);
      return NextResponse.json(
        { error: 'Failed to update contract', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
