-- =========================================================
-- CREATIVE CONCEPTS SYSTEM - MIGRATION FINALE CONSOLIDÉE
-- Système d'approbation de concepts créatifs (Reels/Posts)
-- Date: 2026-02-27
-- Version: 1.0 FINAL
-- =========================================================

BEGIN;

-- =========================================================
-- 1. TABLE: creative_concept
-- =========================================================
CREATE TABLE IF NOT EXISTS public.creative_concept (
  id BIGSERIAL PRIMARY KEY,
  
  -- Type et contenu
  type VARCHAR(20) DEFAULT 'post' CHECK (type IN ('reel', 'post')),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  goal TEXT,
  
  -- Relations
  client_id BIGINT NOT NULL REFERENCES public.client(id) ON DELETE CASCADE,
  mandat_id BIGINT REFERENCES public.mandat(id) ON DELETE SET NULL,
  
  -- Workflow d'approbation
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'proposed', 'approved', 'rejected')),
  rejection_reason TEXT,
  
  -- Tracking de proposition
  proposed_by BIGINT REFERENCES public.app_user(id) ON DELETE SET NULL,
  proposed_at TIMESTAMPTZ,
  
  -- Tracking de révision
  reviewed_by BIGINT REFERENCES public.app_user(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  
  -- Colonnes legacy (pour compatibilité)
  category VARCHAR(50),
  concept_details JSONB,
  media_urls TEXT[],
  tags VARCHAR(100)[],
  priority VARCHAR(20),
  estimated_duration VARCHAR(50),
  deadline DATE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 2. INDEXES
-- =========================================================
DROP INDEX IF EXISTS idx_creative_concept_client;
DROP INDEX IF EXISTS idx_creative_concept_status;
DROP INDEX IF EXISTS idx_creative_concept_category;
DROP INDEX IF EXISTS idx_creative_concept_proposed_by;
DROP INDEX IF EXISTS idx_creative_concept_type;

CREATE INDEX idx_creative_concept_client ON public.creative_concept(client_id);
CREATE INDEX idx_creative_concept_status ON public.creative_concept(status);
CREATE INDEX idx_creative_concept_category ON public.creative_concept(category);
CREATE INDEX idx_creative_concept_proposed_by ON public.creative_concept(proposed_by);
CREATE INDEX idx_creative_concept_type ON public.creative_concept(type);

-- =========================================================
-- 3. TRIGGER: updated_at
-- =========================================================
DROP TRIGGER IF EXISTS update_creative_concept_updated_at ON public.creative_concept;

CREATE TRIGGER update_creative_concept_updated_at
  BEFORE UPDATE ON public.creative_concept
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================================
-- 4. RLS POLICIES
-- =========================================================
ALTER TABLE public.creative_concept ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Admins can do everything on creative_concept" ON public.creative_concept;
DROP POLICY IF EXISTS "Clients can view their concepts" ON public.creative_concept;
DROP POLICY IF EXISTS "Clients can update their concepts status" ON public.creative_concept;

-- Policy 1: Admins peuvent tout faire
CREATE POLICY "Admins can do everything on creative_concept"
ON public.creative_concept
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.app_user
    WHERE app_user.id = auth.uid()::bigint
    AND app_user.role_id = 1
  )
);

-- Policy 2: Clients peuvent voir leurs concepts
CREATE POLICY "Clients can view their concepts"
ON public.creative_concept
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.app_user
    WHERE app_user.id = auth.uid()::bigint
    AND app_user.role_id = 2
    AND app_user.client_id = creative_concept.client_id
  )
);

-- Policy 3: Clients peuvent mettre à jour le statut de leurs concepts
CREATE POLICY "Clients can update their concepts status"
ON public.creative_concept
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.app_user
    WHERE app_user.id = auth.uid()::bigint
    AND app_user.role_id = 2
    AND app_user.client_id = creative_concept.client_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.app_user
    WHERE app_user.id = auth.uid()::bigint
    AND app_user.role_id = 2
    AND app_user.client_id = creative_concept.client_id
  )
);

-- =========================================================
-- 5. SEED DATA (optionnel - pour tests)
-- =========================================================
-- Décommenter pour insérer des données de test
/*
INSERT INTO public.creative_concept (
  type, title, description, goal, client_id, status, proposed_by, proposed_at
) VALUES
(
  'reel',
  'Concept Reel - Lancement Produit',
  'Un reel dynamique de 30s présentant le nouveau produit avec musique tendance',
  'Générer du buzz et de l''engagement sur Instagram',
  1, -- Remplacer par un client_id valide
  'proposed',
  1, -- Remplacer par un app_user.id valide
  NOW()
),
(
  'post',
  'Post Carousel - Témoignage Client',
  'Carousel de 5 slides avec témoignage client et avant/après',
  'Renforcer la crédibilité et la preuve sociale',
  1,
  'draft',
  1,
  NULL
);
*/

COMMIT;

-- =========================================================
-- VÉRIFICATIONS POST-MIGRATION
-- =========================================================
-- Exécuter ces requêtes pour vérifier l'installation :
--
-- SELECT COUNT(*) FROM public.creative_concept;
-- SELECT * FROM pg_policies WHERE tablename = 'creative_concept';
-- SELECT * FROM pg_indexes WHERE tablename = 'creative_concept';
