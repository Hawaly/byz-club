import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireSession } from '@/lib/authz';

/**
 * API route pour que les clients puissent lire leur calendrier éditorial
 * Accès en lecture seule uniquement
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireSession(request);
    if (session instanceof NextResponse) return session;

    // Vérifier que l'utilisateur est bien un client (role_id = 2)
    if (session.roleId !== 2) {
      return NextResponse.json(
        { error: 'Accès réservé aux clients' },
        { status: 403 }
      );
    }

    if (!session.clientId) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    // Récupérer les entrées du calendrier éditorial pour ce client (même requête que l'admin)
    let query = supabaseAdmin
      .from('editorial_calendar')
      .select(`
        *,
        client:client_id (id, name, company_name)
      `)
      .eq('client_id', session.clientId)
      .order('publish_date', { ascending: true });

    if (year && month) {
      const start = `${year}-${String(month).padStart(2, '0')}-01`;
      const end = new Date(Number(year), Number(month), 0).toISOString().slice(0, 10);
      query = query.gte('publish_date', start).lte('publish_date', end);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching editorial calendar:', error);
      return NextResponse.json(
        { error: 'Failed to fetch calendar entries' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      entries: data || [] 
    });
  } catch (error) {
    console.error('Error in GET /api/client-portal/editorial-calendar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
