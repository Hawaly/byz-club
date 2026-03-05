import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireRole } from '@/lib/authz';

/**
 * GET /api/client-portal/concepts
 * Récupère les concepts du client connecté (Client uniquement)
 * Query params:
 * - status: Filtrer par statut (proposed, approved, rejected)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireRole(request, [2]);
    if (session instanceof NextResponse) return session;

    // Récupérer le client_id de l'utilisateur connecté
    const { data: userData, error: userError } = await supabaseAdmin
      .from('app_user')
      .select('client_id')
      .eq('id', session.userId)
      .single();

    if (userError || !userData?.client_id) {
      return NextResponse.json(
        { error: 'Utilisateur non lié à un client' },
        { status: 403 }
      );
    }

    const clientId = userData.client_id;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('creative_concept')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: concepts, error } = await query;

    if (error) {
      throw new Error(`Erreur récupération concepts: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      concepts: concepts || [],
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Erreur GET /api/client-portal/concepts:', err);
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la récupération des concepts' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/client-portal/concepts
 * Approuver ou rejeter un concept (Client uniquement)
 * Body: { concept_id, status: 'approved' | 'rejected', rejection_reason?, review_notes? }
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await requireRole(request, [2]);
    if (session instanceof NextResponse) return session;

    // Récupérer le client_id de l'utilisateur connecté
    const { data: userData, error: userError } = await supabaseAdmin
      .from('app_user')
      .select('client_id')
      .eq('id', session.userId)
      .single();

    if (userError || !userData?.client_id) {
      return NextResponse.json(
        { error: 'Utilisateur non lié à un client' },
        { status: 403 }
      );
    }

    const clientId = userData.client_id;
    const body = await request.json();
    const { concept_id, status, rejection_reason, review_notes } = body;

    // Validation
    if (!concept_id || !status) {
      return NextResponse.json(
        { error: 'Champs requis: concept_id, status' },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide. Valeurs autorisées: approved, rejected' },
        { status: 400 }
      );
    }

    // Si rejet, la raison est OBLIGATOIRE
    if (status === 'rejected' && !rejection_reason?.trim()) {
      return NextResponse.json(
        { error: 'La raison du rejet est obligatoire' },
        { status: 400 }
      );
    }

    // Vérifier que le concept existe et appartient au client
    const { data: concept, error: conceptError } = await supabaseAdmin
      .from('creative_concept')
      .select('id, client_id, status')
      .eq('id', concept_id)
      .single();

    if (conceptError || !concept) {
      return NextResponse.json(
        { error: 'Concept non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que le concept appartient au client connecté
    if (concept.client_id !== clientId) {
      return NextResponse.json(
        { error: 'Vous n\'êtes pas autorisé à modifier ce concept' },
        { status: 403 }
      );
    }

    // Vérifier que le concept est en statut "proposed"
    if (concept.status !== 'proposed') {
      return NextResponse.json(
        { error: 'Seuls les concepts proposés peuvent être approuvés ou rejetés' },
        { status: 400 }
      );
    }

    // Mettre à jour le concept
    const updateData: any = {
      status,
      reviewed_by: session.userId,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (rejection_reason) {
      updateData.rejection_reason = rejection_reason;
    }

    if (review_notes) {
      updateData.review_notes = review_notes;
    }

    const { data: updatedConcept, error: updateError } = await supabaseAdmin
      .from('creative_concept')
      .update(updateData)
      .eq('id', concept_id)
      .select('*')
      .single();

    if (updateError) {
      throw new Error(`Erreur mise à jour concept: ${updateError.message}`);
    }

    return NextResponse.json({
      success: true,
      concept: updatedConcept,
      message: status === 'approved' 
        ? 'Concept approuvé avec succès' 
        : 'Concept rejeté avec succès',
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Erreur PUT /api/client-portal/concepts:', err);
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la mise à jour du concept' },
      { status: 500 }
    );
  }
}
