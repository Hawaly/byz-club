/**
 * API Route pour fermer une session spécifique
 * DELETE /api/sessions/[id] - Fermer une session
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/authz';
import { revokeSession, hashToken } from '@/lib/sessionTracking';
import { createClient } from '@/lib/supabase-server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authSession = await requireSession(request);
  if (authSession instanceof NextResponse) return authSession;

  const { id } = await params;

  try {
    // Révoquer la session dans la table
    const success = await revokeSession(id, authSession.authUserId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to revoke session' },
        { status: 500 }
      );
    }

    // Si c'est la session actuelle, déconnecter aussi de Supabase Auth
    const supabase = await createClient();
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (currentSession?.access_token) {
      const currentToken = hashToken(currentSession.access_token);
      // Vérifier si on révoque la session actuelle en comparant avec les sessions de l'utilisateur
      const { supabaseAdmin } = await import('@/lib/supabaseAdmin');
      const { data: sessionData } = await supabaseAdmin
        .from('user_session')
        .select('session_token')
        .eq('id', id)
        .single();
      
      if (sessionData?.session_token === currentToken) {
        // C'est la session actuelle, déconnecter
        await supabase.auth.signOut();
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Session fermée avec succès',
    });
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
