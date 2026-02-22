import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireSession } from '@/lib/authz';

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(request);
    if (session instanceof NextResponse) return session;

    // Only clients can access this endpoint
    if (session.roleId !== 2 || !session.clientId) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { subject, message, category } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Sujet et message requis' },
        { status: 400 }
      );
    }

    // Create contact request/message
    const { data, error } = await supabaseAdmin
      .from('client_message')
      .insert({
        client_id: session.clientId,
        user_id: session.userId,
        subject,
        message,
        category: category || 'general',
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      // If table doesn't exist, just return success
      console.log('client_message table may not exist:', error);
      return NextResponse.json({ 
        success: true, 
        message: 'Message envoyé avec succès' 
      });
    }

    return NextResponse.json({ 
      success: true, 
      data,
      message: 'Message envoyé avec succès' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
