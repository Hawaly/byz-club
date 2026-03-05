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

    const { data: strategies, error } = await supabaseAdmin
      .from('social_media_strategy')
      .select('id, version, status, contexte_general, plateformes, created_at, updated_at')
      .eq('client_id', parseInt(clientId))
      .order('version', { ascending: false });

    if (error) {
      console.error('Error fetching strategies:', error);
      return NextResponse.json(
        { error: 'Failed to fetch strategies' },
        { status: 500 }
      );
    }

    return NextResponse.json({ strategies: strategies || [] });
  } catch (error) {
    console.error('Error in GET /api/strategies:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
