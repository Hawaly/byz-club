import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireRole } from '@/lib/authz';

/**
 * GET /api/concepts/[id]
 * Récupère les détails d'un concept (Admin uniquement)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(request, [1]);
    if (session instanceof NextResponse) return session;

    const { id: conceptId } = await params;

    const { data: concept, error } = await supabaseAdmin
      .from('creative_concept')
      .select(`
        *,
        client:client_id (
          id,
          name,
          company_name
        )
      `)
      .eq('id', conceptId)
      .single();

    if (error) {
      throw new Error(`Erreur récupération concept: ${error.message}`);
    }

    if (!concept) {
      return NextResponse.json(
        { error: 'Concept non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      concept,
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Erreur GET /api/concepts/[id]:', err);
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la récupération du concept' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/concepts/[id]
 * Modifier un concept existant (Admin uniquement)
 * MISE À JOUR PARTIELLE : ne modifie que les champs fournis
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(request, [1]);
    if (session instanceof NextResponse) return session;

    const { id: conceptId } = await params;
    const body = await request.json();

    const {
      type,
      title,
      description,
      goal,
      client_id,
      mandat_id,
      status,
      rejection_reason,
      review_notes,
    } = body;

    // Construire l'objet de mise à jour PARTIELLE
    const updateData: any = {};

    if (type !== undefined) {
      if (!['reel', 'post'].includes(type)) {
        return NextResponse.json(
          { error: 'Type invalide. Valeurs autorisées: reel, post' },
          { status: 400 }
        );
      }
      updateData.type = type;
    }

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (goal !== undefined) updateData.goal = goal;
    if (client_id !== undefined) updateData.client_id = client_id;
    if (mandat_id !== undefined) updateData.mandat_id = mandat_id;
    if (rejection_reason !== undefined) updateData.rejection_reason = rejection_reason;
    if (review_notes !== undefined) updateData.review_notes = review_notes;

    if (status !== undefined) {
      if (!['draft', 'proposed', 'approved', 'rejected'].includes(status)) {
        return NextResponse.json(
          { error: 'Statut invalide' },
          { status: 400 }
        );
      }
      updateData.status = status;

      // Si passage à "proposed", mettre à jour proposed_by et proposed_at
      if (status === 'proposed') {
        updateData.proposed_by = session.userId;
        updateData.proposed_at = new Date().toISOString();
      }
    }

    // Toujours mettre à jour updated_at
    updateData.updated_at = new Date().toISOString();

    const { data: updatedConcept, error } = await supabaseAdmin
      .from('creative_concept')
      .update(updateData)
      .eq('id', conceptId)
      .select(`
        *,
        client:client_id (
          id,
          name,
          company_name
        )
      `)
      .single();

    if (error) {
      throw new Error(`Erreur mise à jour concept: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      concept: updatedConcept,
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Erreur PUT /api/concepts/[id]:', err);
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la mise à jour du concept' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/concepts/[id]
 * Supprimer un concept (Admin uniquement)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(request, [1]);
    if (session instanceof NextResponse) return session;

    const { id: conceptId } = await params;

    const { error: deleteError } = await supabaseAdmin
      .from('creative_concept')
      .delete()
      .eq('id', conceptId);

    if (deleteError) {
      throw new Error(`Erreur suppression concept: ${deleteError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Concept supprimé avec succès',
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Erreur DELETE /api/concepts/[id]:', err);
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la suppression du concept' },
      { status: 500 }
    );
  }
}
