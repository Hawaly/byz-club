import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireSession } from '@/lib/authz';

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession(request);
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');

    if (!clientId) {
      return NextResponse.json(
        { error: 'client_id is required' },
        { status: 400 }
      );
    }

    // Récupérer la stratégie validée du client
    const { data: strategy, error } = await supabaseAdmin
      .from('social_media_strategy')
      .select('id')
      .eq('client_id', parseInt(clientId))
      .eq('status', 'valide')
      .order('version', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching strategy:', error);
      return NextResponse.json(
        { error: 'Failed to fetch strategy' },
        { status: 500 }
      );
    }

    return NextResponse.json({ strategy: strategy || null });
  } catch (error) {
    console.error('Error in GET /api/calendrier/strategy:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
