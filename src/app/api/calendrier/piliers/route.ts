import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireSession } from '@/lib/authz';

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession(request);
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(request.url);
    const strategyId = searchParams.get('strategy_id');

    if (!strategyId) {
      return NextResponse.json(
        { error: 'strategy_id is required' },
        { status: 400 }
      );
    }

    const { data: piliers, error } = await supabaseAdmin
      .from('pilier_contenu')
      .select('*')
      .eq('strategy_id', parseInt(strategyId))
      .order('ordre', { ascending: true });

    if (error) {
      console.error('Error fetching piliers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch piliers' },
        { status: 500 }
      );
    }

    return NextResponse.json({ piliers: piliers || [] });
  } catch (error) {
    console.error('Error in GET /api/calendrier/piliers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
