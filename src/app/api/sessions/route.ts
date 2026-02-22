/**
 * API Routes pour la gestion des sessions utilisateur
 * GET /api/sessions - Liste des sessions actives
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/authz';
import { getUserSessions, hashToken } from '@/lib/sessionTracking';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  const authSession = await requireSession(request);
  if (authSession instanceof NextResponse) return authSession;

  try {
    // Récupérer toutes les sessions de l'utilisateur depuis la table
    const sessions = await getUserSessions(authSession.authUserId);
    
    // Récupérer le token de la session actuelle pour l'identifier
    const supabase = await createClient();
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    const currentSessionToken = currentSession?.access_token 
      ? hashToken(currentSession.access_token) 
      : null;

    // Transformer les données pour l'interface
    const sessionDetails = sessions.map((s: any) => ({
      id: s.id,
      email: authSession.email,
      created_at: s.created_at,
      last_sign_in: s.created_at,
      last_activity: s.last_activity,
      expires_at: Math.floor(new Date(s.expires_at).getTime() / 1000),
      ip: s.ip_address || 'Unknown',
      user_agent: s.user_agent || 'Unknown',
      device: s.device_type || 'Unknown',
      browser: s.browser || 'Unknown',
      os: s.os || 'Unknown',
      is_current: s.session_token === currentSessionToken,
      session_token: s.session_token, // Gardé pour l'identification
    }));

    return NextResponse.json(sessionDetails);
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

