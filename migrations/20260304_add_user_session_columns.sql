-- =====================================================
-- Migration: Ajouter colonnes manquantes à user_session
-- Description: Ajouter auth_user_id et autres colonnes pour le tracking complet
-- =====================================================

-- Ajouter les colonnes manquantes à la table user_session existante
ALTER TABLE public.user_session 
  ADD COLUMN IF NOT EXISTS auth_user_id UUID,
  ADD COLUMN IF NOT EXISTS session_token TEXT,
  ADD COLUMN IF NOT EXISTS refresh_token TEXT,
  ADD COLUMN IF NOT EXISTS device_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS browser VARCHAR(100),
  ADD COLUMN IF NOT EXISTS os VARCHAR(100),
  ADD COLUMN IF NOT EXISTS user_agent TEXT,
  ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45),
  ADD COLUMN IF NOT EXISTS country VARCHAR(100),
  ADD COLUMN IF NOT EXISTS city VARCHAR(100),
  ADD COLUMN IF NOT EXISTS last_activity TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS login_method VARCHAR(50);

-- Migrer les données existantes: copier token vers session_token
UPDATE public.user_session 
SET session_token = token 
WHERE session_token IS NULL;

-- Populate auth_user_id from app_user table
UPDATE public.user_session us
SET auth_user_id = au.auth_user_id
FROM public.app_user au
WHERE us.user_id = au.id AND us.auth_user_id IS NULL;

-- Rendre auth_user_id NOT NULL après migration
ALTER TABLE public.user_session 
  ALTER COLUMN auth_user_id SET NOT NULL;

-- Ajouter constraint sur session_token unique
-- Supprimer d'abord si elle existe
ALTER TABLE public.user_session 
  DROP CONSTRAINT IF EXISTS user_session_session_token_unique;

ALTER TABLE public.user_session 
  ADD CONSTRAINT user_session_session_token_unique UNIQUE (session_token);

-- Ajouter constraint de validation
ALTER TABLE public.user_session 
  ADD CONSTRAINT valid_expiry CHECK (expires_at > created_at);

-- Créer les index pour performance
CREATE INDEX IF NOT EXISTS idx_user_session_auth_user_id ON public.user_session(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_user_session_active ON public.user_session(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_session_session_token ON public.user_session(session_token);

-- Mettre à jour les RLS policies
DROP POLICY IF EXISTS user_session_select_own ON public.user_session;
DROP POLICY IF EXISTS user_session_admin_all ON public.user_session;

-- Les utilisateurs peuvent voir uniquement leurs propres sessions
CREATE POLICY user_session_select_own ON public.user_session
  FOR SELECT
  USING (
    auth_user_id = auth.uid() OR
    user_id IN (
      SELECT id FROM public.app_user WHERE auth_user_id = auth.uid()
    )
  );

-- Les admins peuvent voir toutes les sessions
CREATE POLICY user_session_admin_all ON public.user_session
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Fonction pour nettoyer les sessions expirées
-- Supprimer l'ancienne version si elle existe
DROP FUNCTION IF EXISTS public.cleanup_expired_sessions();

CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  UPDATE public.user_session 
  SET is_active = FALSE, 
      revoked_at = NOW()
  WHERE expires_at < NOW() 
    AND is_active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour mettre à jour last_activity automatiquement
CREATE OR REPLACE FUNCTION public.update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_activity = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_session_activity ON public.user_session;
CREATE TRIGGER trigger_update_session_activity
  BEFORE UPDATE ON public.user_session
  FOR EACH ROW
  EXECUTE FUNCTION public.update_session_activity();

-- Commentaires
COMMENT ON COLUMN public.user_session.auth_user_id IS 'UUID de l''utilisateur dans auth.users';
COMMENT ON COLUMN public.user_session.session_token IS 'Token unique de session (hash du JWT)';
COMMENT ON COLUMN public.user_session.is_active IS 'Session active ou révoquée';
COMMENT ON COLUMN public.user_session.last_activity IS 'Dernière activité sur cette session';
