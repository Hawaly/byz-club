-- =====================================================
-- Migration: Tracking des sessions utilisateur
-- Description: Table pour suivre toutes les sessions actives des utilisateurs
-- =====================================================

-- Table pour tracker les sessions
CREATE TABLE IF NOT EXISTS user_session (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  auth_user_id UUID NOT NULL,
  
  -- Informations de session
  session_token TEXT NOT NULL UNIQUE,
  refresh_token TEXT,
  
  -- Informations de l'appareil
  device_type VARCHAR(50), -- desktop, mobile, tablet
  browser VARCHAR(100),
  os VARCHAR(100),
  user_agent TEXT,
  
  -- Informations de localisation
  ip_address VARCHAR(45),
  country VARCHAR(100),
  city VARCHAR(100),
  
  -- Dates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Statut
  is_active BOOLEAN DEFAULT TRUE,
  revoked_at TIMESTAMPTZ,
  
  -- Métadonnées
  login_method VARCHAR(50), -- password, oauth, etc.
  
  CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

-- Index pour performance
CREATE INDEX idx_user_session_user_id ON user_session(user_id);
CREATE INDEX idx_user_session_auth_user_id ON user_session(auth_user_id);
CREATE INDEX idx_user_session_active ON user_session(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_user_session_token ON user_session(session_token);
CREATE INDEX idx_user_session_expires ON user_session(expires_at);

-- Fonction pour nettoyer les sessions expirées
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  UPDATE user_session 
  SET is_active = FALSE, 
      revoked_at = NOW()
  WHERE expires_at < NOW() 
    AND is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour last_activity automatiquement
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_activity = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_activity
  BEFORE UPDATE ON user_session
  FOR EACH ROW
  EXECUTE FUNCTION update_session_activity();

-- RLS Policies
ALTER TABLE user_session ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir uniquement leurs propres sessions
CREATE POLICY user_session_select_own ON user_session
  FOR SELECT
  USING (
    auth_user_id = auth.uid() OR
    user_id IN (
      SELECT id FROM app_user WHERE auth_user_id = auth.uid()
    )
  );

-- Les admins peuvent voir toutes les sessions
CREATE POLICY user_session_admin_all ON user_session
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM app_user 
      WHERE auth_user_id = auth.uid() 
      AND role_id = 1
    )
  );

-- Commentaires
COMMENT ON TABLE user_session IS 'Tracking de toutes les sessions utilisateur actives pour la gestion de sécurité';
COMMENT ON COLUMN user_session.session_token IS 'Token unique de session (peut être le JWT access token hash)';
COMMENT ON COLUMN user_session.is_active IS 'Session active ou révoquée';
COMMENT ON COLUMN user_session.last_activity IS 'Dernière activité sur cette session';
