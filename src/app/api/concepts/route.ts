import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireRole } from '@/lib/authz';

/**
 * GET /api/concepts
 * Liste tous les concepts créatifs (Admin uniquement)
 * Query params:
 * - client_id: Filtrer par client
 * - status: Filtrer par statut (draft, proposed, approved, rejected)
 * - type: Filtrer par type (reel, post)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireRole(request, [1]);
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let query = supabaseAdmin
      .from('creative_concept')
      .select(`
        *,
        client:client_id (
          id,
          name,
          company_name
        )
      `)
      .order('created_at', { ascending: false });

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (type) {
      query = query.eq('type', type);
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
    console.error('Erreur GET /api/concepts:', err);
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la récupération des concepts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/concepts
 * Créer un nouveau concept créatif (Admin uniquement)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireRole(request, [1]);
    if (session instanceof NextResponse) return session;

    const body = await request.json();
    const { 
      type, 
      title, 
      description, 
      goal, 
      client_id, 
      mandat_id,
      status = 'draft'
    } = body;

    // Validation
    if (!title || !client_id) {
      return NextResponse.json(
        { error: 'Champs requis: title, client_id' },
        { status: 400 }
      );
    }

    // Valider le type
    if (type && !['reel', 'post'].includes(type)) {
      return NextResponse.json(
        { error: 'Type invalide. Valeurs autorisées: reel, post' },
        { status: 400 }
      );
    }

    // Valider le statut
    if (!['draft', 'proposed', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }

    // Créer le concept
    const conceptData: any = {
      type: type || 'post',
      title,
      description,
      goal,
      client_id,
      mandat_id,
      status,
    };

    // Si le statut est "proposed", ajouter les infos de proposition
    if (status === 'proposed') {
      conceptData.proposed_by = session.userId;
      conceptData.proposed_at = new Date().toISOString();
    }

    const { data: newConcept, error } = await supabaseAdmin
      .from('creative_concept')
      .insert(conceptData)
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
      throw new Error(`Erreur création concept: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      concept: newConcept,
    }, { status: 201 });

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Erreur POST /api/concepts:', err);
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la création du concept' },
      { status: 500 }
    );
  }
}
