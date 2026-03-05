import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireSession } from '@/lib/authz';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireSession(request);
    if (session instanceof NextResponse) return session;

    const { data: strategy, error } = await supabaseAdmin
      .from('social_media_strategy')
      .select('*')
      .eq('id', parseInt(params.id))
      .single();

    if (error) {
      console.error('Error fetching strategy:', error);
      return NextResponse.json(
        { error: 'Failed to fetch strategy' },
        { status: 500 }
      );
    }

    return NextResponse.json({ strategy });
  } catch (error) {
    console.error('Error in GET /api/strategies/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
