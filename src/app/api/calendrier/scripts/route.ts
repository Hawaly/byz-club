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

    const { data: scripts, error } = await supabaseAdmin
      .from('video_script')
      .select('id, title, created_at')
      .eq('client_id', parseInt(clientId))
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching scripts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch scripts' },
        { status: 500 }
      );
    }

    return NextResponse.json({ scripts: scripts || [] });
  } catch (error) {
    console.error('Error in GET /api/calendrier/scripts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
