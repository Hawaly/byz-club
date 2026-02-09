/**
 * Helper functions pour le tracking des sessions utilisateur
 */

import { supabaseAdmin } from './supabaseAdmin';
import crypto from 'crypto';

interface SessionInfo {
  userId: number;
  authUserId: string;
  userAgent: string;
  ipAddress: string;
  expiresAt: Date;
}

interface DeviceInfo {
  device_type: string;
  browser: string;
  os: string;
}

/**
 * Parse le user agent pour extraire les infos de l'appareil
 */
export function parseUserAgent(userAgent: string): DeviceInfo {
  const ua = userAgent.toLowerCase();
  
  // Détection du navigateur
  let browser = 'Unknown';
  if (ua.includes('chrome') && !ua.includes('edge') && !ua.includes('edg/')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edge') || ua.includes('edg/')) browser = 'Edge';
  else if (ua.includes('opera') || ua.includes('opr/')) browser = 'Opera';
  
  // Détection de l'OS
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac os x') || ua.includes('macos')) os = 'macOS';
  else if (ua.includes('linux') && !ua.includes('android')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  // Détection du type d'appareil
  let device_type = 'Desktop';
  if (ua.includes('mobile') && !ua.includes('tablet')) device_type = 'Mobile';
  else if (ua.includes('tablet') || ua.includes('ipad')) device_type = 'Tablet';
  
  return { device_type, browser, os };
}

/**
 * Crée un hash du token pour le stocker de manière sécurisée
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Enregistre une nouvelle session dans la base de données
 */
export async function trackSession(sessionInfo: SessionInfo, accessToken: string) {
  try {
    const deviceInfo = parseUserAgent(sessionInfo.userAgent);
    const sessionToken = hashToken(accessToken);

    const { data, error } = await supabaseAdmin
      .from('user_session')
      .insert([{
        user_id: sessionInfo.userId,
        auth_user_id: sessionInfo.authUserId,
        session_token: sessionToken,
        device_type: deviceInfo.device_type,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        user_agent: sessionInfo.userAgent,
        ip_address: sessionInfo.ipAddress,
        expires_at: sessionInfo.expiresAt.toISOString(),
        is_active: true,
        login_method: 'password',
      }])
      .select()
      .single();

    if (error) {
      console.error('[SessionTracking] Error tracking session:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('[SessionTracking] Unexpected error:', error);
    return null;
  }
}

/**
 * Met à jour l'activité d'une session
 */
export async function updateSessionActivity(sessionToken: string) {
  try {
    const hashedToken = hashToken(sessionToken);
    
    const { error } = await supabaseAdmin
      .from('user_session')
      .update({ 
        last_activity: new Date().toISOString() 
      })
      .eq('session_token', hashedToken)
      .eq('is_active', true);

    if (error) {
      console.error('[SessionTracking] Error updating session activity:', error);
    }
  } catch (error) {
    console.error('[SessionTracking] Unexpected error:', error);
  }
}

/**
 * Récupère toutes les sessions actives d'un utilisateur
 */
export async function getUserSessions(authUserId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_session')
      .select('*')
      .eq('auth_user_id', authUserId)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .order('last_activity', { ascending: false });

    if (error) {
      console.error('[SessionTracking] Error fetching sessions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('[SessionTracking] Unexpected error:', error);
    return [];
  }
}

/**
 * Révoque une session spécifique
 */
export async function revokeSession(sessionId: string, authUserId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('user_session')
      .update({ 
        is_active: false,
        revoked_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .eq('auth_user_id', authUserId);

    if (error) {
      console.error('[SessionTracking] Error revoking session:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[SessionTracking] Unexpected error:', error);
    return false;
  }
}

/**
 * Révoque toutes les autres sessions (sauf la session courante)
 */
export async function revokeOtherSessions(currentSessionToken: string, authUserId: string) {
  try {
    const hashedToken = hashToken(currentSessionToken);
    
    const { error } = await supabaseAdmin
      .from('user_session')
      .update({ 
        is_active: false,
        revoked_at: new Date().toISOString()
      })
      .eq('auth_user_id', authUserId)
      .eq('is_active', true)
      .neq('session_token', hashedToken);

    if (error) {
      console.error('[SessionTracking] Error revoking other sessions:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[SessionTracking] Unexpected error:', error);
    return false;
  }
}

/**
 * Nettoie les sessions expirées
 */
export async function cleanupExpiredSessions() {
  try {
    const { error } = await supabaseAdmin
      .from('user_session')
      .update({ 
        is_active: false,
        revoked_at: new Date().toISOString()
      })
      .eq('is_active', true)
      .lt('expires_at', new Date().toISOString());

    if (error) {
      console.error('[SessionTracking] Error cleaning up sessions:', error);
    }
  } catch (error) {
    console.error('[SessionTracking] Unexpected error:', error);
  }
}
