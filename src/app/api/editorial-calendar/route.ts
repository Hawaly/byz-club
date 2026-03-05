import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireRole } from '@/lib/authz';

export async function GET(request: NextRequest) {
  try {
    const session = await requireRole(request, [1]);
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    let query = supabaseAdmin
      .from('editorial_calendar')
      .select(`
        *,
        client:client_id (id, name, company_name)
      `)
      .order('publish_date', { ascending: true });

    if (clientId) query = query.eq('client_id', clientId);

    if (year && month) {
      const start = `${year}-${String(month).padStart(2, '0')}-01`;
      const end = new Date(Number(year), Number(month), 0).toISOString().slice(0, 10);
      query = query.gte('publish_date', start).lte('publish_date', end);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, entries: data || [] });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole(request, [1]);
    if (session instanceof NextResponse) return session;

    const body = await request.json();
    const {
      client_id, title, publish_date, publish_time,
      platform, objective, strategic_intent,
      pillar, persona, script_id, status, notes, color,
      content_type, drive_link, content_description, thumbnail_url,
    } = body;

    if (!client_id || !title || !publish_date || !pillar) {
      return NextResponse.json(
        { error: 'Champs requis: client_id, title, publish_date, pillar' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('editorial_calendar')
      .insert({
        client_id, title, publish_date, publish_time: publish_time || null,
        platform: platform || 'instagram',
        objective: objective || 'engagement',
        strategic_intent, pillar, persona,
        script_id: script_id ? parseInt(script_id) : null,
        status: status || 'idea',
        notes, color,
        content_type: content_type || 'post',
        drive_link,
        content_description,
        thumbnail_url,
      })
      .select(`*, client:client_id (id, name, company_name)`)
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, entry: data }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireRole(request, [1]);
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });

    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from('editorial_calendar')
      .update(body)
      .eq('id', id)
      .select(`*, client:client_id (id, name, company_name)`)
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, entry: data });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireRole(request, [1]);
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('editorial_calendar')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
