-- =========================================================
-- FIX: SERVICE PACKAGES SYSTEM - Version sécurisée idempotente
-- À exécuter dans Supabase Dashboard → SQL Editor
-- Date: 2026-03-03
-- =========================================================

-- =========================================================
-- 1. TABLE: service_package
-- =========================================================
CREATE TABLE IF NOT EXISTS public.service_package (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  tagline VARCHAR(200),
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'CHF',
  billing_frequency VARCHAR(20) DEFAULT 'one_time',
  color VARCHAR(50),
  icon VARCHAR(50),
  badge VARCHAR(50),
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by INTEGER REFERENCES public.app_user(id),
  CONSTRAINT valid_billing_frequency CHECK (
    billing_frequency IN ('one_time', 'monthly', 'yearly', 'quarterly')
  )
);

-- =========================================================
-- 2. TABLE: package_feature
-- =========================================================
CREATE TABLE IF NOT EXISTS public.package_feature (
  id SERIAL PRIMARY KEY,
  package_id INTEGER NOT NULL REFERENCES public.service_package(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  is_highlighted BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 3. TABLE: package_task_template
-- =========================================================
CREATE TABLE IF NOT EXISTS public.package_task_template (
  id SERIAL PRIMARY KEY,
  package_id INTEGER NOT NULL REFERENCES public.service_package(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL DEFAULT 'production',
  status VARCHAR(50) DEFAULT 'todo',
  days_after_start INTEGER DEFAULT 0,
  estimated_hours DECIMAL(5,2),
  due_date_offset INTEGER,
  assigned_to_role VARCHAR(50),
  priority INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_task_type CHECK (
    type IN ('production', 'admin', 'revision', 'meeting', 'delivery', 'creative', 'technical', 'other')
  ),
  CONSTRAINT valid_task_status CHECK (
    status IN ('todo', 'in_progress', 'done', 'blocked', 'cancelled')
  )
);

-- =========================================================
-- 4. TABLE: package_mandat_template
-- =========================================================
CREATE TABLE IF NOT EXISTS public.package_mandat_template (
  id SERIAL PRIMARY KEY,
  package_id INTEGER NOT NULL UNIQUE REFERENCES public.service_package(id) ON DELETE CASCADE,
  title_template VARCHAR(200),
  description_template TEXT,
  objectives TEXT,
  deliverables TEXT,
  timeline_description TEXT,
  default_duration_days INTEGER,
  default_status VARCHAR(50) DEFAULT 'draft',
  contract_clauses JSONB,
  terms_and_conditions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 5. TABLE: package_invoice_template
-- =========================================================
CREATE TABLE IF NOT EXISTS public.package_invoice_template (
  id SERIAL PRIMARY KEY,
  package_id INTEGER NOT NULL UNIQUE REFERENCES public.service_package(id) ON DELETE CASCADE,
  line_item_description VARCHAR(500),
  unit_price DECIMAL(10,2),
  quantity INTEGER DEFAULT 1,
  payment_terms_days INTEGER DEFAULT 30,
  payment_schedule VARCHAR(50) DEFAULT 'upfront',
  deposit_percentage DECIMAL(5,2),
  invoice_notes TEXT,
  payment_instructions TEXT,
  is_taxable BOOLEAN DEFAULT true,
  tax_rate DECIMAL(5,2) DEFAULT 7.70,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_payment_schedule CHECK (
    payment_schedule IN ('upfront', 'milestone', 'monthly', 'quarterly', 'on_delivery')
  )
);

-- =========================================================
-- 6. TABLE: client_package
-- =========================================================
CREATE TABLE IF NOT EXISTS public.client_package (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES public.client(id) ON DELETE CASCADE,
  package_id INTEGER NOT NULL REFERENCES public.service_package(id) ON DELETE RESTRICT,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  purchased_price DECIMAL(10,2) NOT NULL,
  start_date DATE,
  end_date DATE,
  renewal_date DATE,
  is_recurring BOOLEAN DEFAULT false,
  auto_renew BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'active',
  mandat_id INTEGER REFERENCES public.mandat(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by INTEGER REFERENCES public.app_user(id),
  CONSTRAINT valid_package_status CHECK (
    status IN ('active', 'completed', 'cancelled', 'expired', 'paused')
  )
);

-- =========================================================
-- 7. INDEXES (DROP IF EXISTS + CREATE)
-- =========================================================
DROP INDEX IF EXISTS idx_service_package_slug;
DROP INDEX IF EXISTS idx_service_package_active;
DROP INDEX IF EXISTS idx_service_package_visible;
DROP INDEX IF EXISTS idx_service_package_featured;
DROP INDEX IF EXISTS idx_package_feature_package;
DROP INDEX IF EXISTS idx_package_task_template_package;
DROP INDEX IF EXISTS idx_client_package_client;
DROP INDEX IF EXISTS idx_client_package_package;
DROP INDEX IF EXISTS idx_client_package_status;

CREATE INDEX idx_service_package_slug ON public.service_package(slug);
CREATE INDEX idx_service_package_active ON public.service_package(is_active);
CREATE INDEX idx_service_package_visible ON public.service_package(is_visible);
CREATE INDEX idx_service_package_featured ON public.service_package(is_featured);
CREATE INDEX idx_package_feature_package ON public.package_feature(package_id);
CREATE INDEX idx_package_task_template_package ON public.package_task_template(package_id);
CREATE INDEX idx_client_package_client ON public.client_package(client_id);
CREATE INDEX idx_client_package_package ON public.client_package(package_id);
CREATE INDEX idx_client_package_status ON public.client_package(status);

-- =========================================================
-- 8. TRIGGER: updated_at (fonction déjà présente normalement)
-- =========================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_service_package_updated_at ON public.service_package;
CREATE TRIGGER update_service_package_updated_at
  BEFORE UPDATE ON public.service_package
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_package_feature_updated_at ON public.package_feature;
CREATE TRIGGER update_package_feature_updated_at
  BEFORE UPDATE ON public.package_feature
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_package_task_template_updated_at ON public.package_task_template;
CREATE TRIGGER update_package_task_template_updated_at
  BEFORE UPDATE ON public.package_task_template
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_client_package_updated_at ON public.client_package;
CREATE TRIGGER update_client_package_updated_at
  BEFORE UPDATE ON public.client_package
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================================
-- 9. RLS POLICIES
-- =========================================================
ALTER TABLE public.service_package ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_feature ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_package ENABLE ROW LEVEL SECURITY;

-- service_package : admins tout faire, authentifiés lire
DROP POLICY IF EXISTS "Admins manage service_package" ON public.service_package;
CREATE POLICY "Admins manage service_package"
ON public.service_package FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.app_user WHERE app_user.auth_user_id = auth.uid() AND app_user.role_id = 1)
);

DROP POLICY IF EXISTS "Authenticated can read active packages" ON public.service_package;
CREATE POLICY "Authenticated can read active packages"
ON public.service_package FOR SELECT TO authenticated
USING (is_active = true);

-- package_feature : admins tout faire, authentifiés lire
DROP POLICY IF EXISTS "Admins manage package_feature" ON public.package_feature;
CREATE POLICY "Admins manage package_feature"
ON public.package_feature FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.app_user WHERE app_user.auth_user_id = auth.uid() AND app_user.role_id = 1)
);

DROP POLICY IF EXISTS "Authenticated can read package_feature" ON public.package_feature;
CREATE POLICY "Authenticated can read package_feature"
ON public.package_feature FOR SELECT TO authenticated
USING (true);

-- client_package : admins tout faire
DROP POLICY IF EXISTS "Admins manage client_package" ON public.client_package;
CREATE POLICY "Admins manage client_package"
ON public.client_package FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.app_user WHERE app_user.auth_user_id = auth.uid() AND app_user.role_id = 1)
);

-- =========================================================
-- 10. SEED DATA (si pas encore de packs)
-- =========================================================
INSERT INTO public.service_package (
  name, slug, description, tagline, price, currency,
  color, icon, badge, is_featured, display_order, is_active, is_visible
)
SELECT * FROM (VALUES
  (
    'Pack de 10 Posts',
    'pack-10-posts',
    'Stratégie marketing complète + 10 posts par mois (6 vidéos + 4 carrousels)',
    'Stratégie marketing complète + 10 posts par mois (6 vidéos + 4 carrousels)',
    2000.00::DECIMAL(10,2),
    'CHF',
    'from-orange-600 to-orange-500',
    'Zap',
    'MEILLEURE VALEUR',
    true,
    1,
    true,
    true
  ),
  (
    'Business Booster',
    'business-booster',
    'Stratégie marketing ciblée + 6 vidéos percutantes pour booster votre croissance',
    'Stratégie marketing ciblée + 6 vidéos percutantes pour booster votre croissance',
    1400.00::DECIMAL(10,2),
    'CHF',
    'from-blue-600 to-blue-500',
    'TrendingUp',
    'POPULAIRE',
    false,
    2,
    true,
    true
  ),
  (
    'Pack Starter',
    'pack-starter',
    'Pack d''entrée de gamme pour démarrer votre présence digitale',
    'Idéal pour les petites entreprises qui débutent',
    800.00::DECIMAL(10,2),
    'CHF',
    'from-green-600 to-green-500',
    'Rocket',
    NULL,
    false,
    3,
    true,
    true
  )
) AS v(name, slug, description, tagline, price, currency, color, icon, badge, is_featured, display_order, is_active, is_visible)
WHERE NOT EXISTS (SELECT 1 FROM public.service_package LIMIT 1);

-- Features pour Pack de 10 Posts
INSERT INTO public.package_feature (package_id, title, icon, is_highlighted, display_order)
SELECT sp.id, f.title, 'CheckCircle', false, f.ord
FROM public.service_package sp
CROSS JOIN (VALUES
  ('Stratégie marketing personnalisée', 1),
  ('Analyse de votre cible & positionnement', 2),
  ('Production de 6 vidéos professionnelles', 3),
  ('Création de 4 carrousels engageants', 4),
  ('Proposition de 15 concepts créatifs', 5),
  ('Rédaction de scripts optimisés SEO', 6),
  ('Activation d''un acteur professionnel', 7),
  ('Tournage et montage complet en interne', 8),
  ('Modifications illimitées jusqu''à satisfaction', 9),
  ('Publication et suivi des performances', 10)
) AS f(title, ord)
WHERE sp.slug = 'pack-10-posts'
AND NOT EXISTS (SELECT 1 FROM public.package_feature pf WHERE pf.package_id = sp.id);

-- Features pour Business Booster
INSERT INTO public.package_feature (package_id, title, icon, is_highlighted, display_order)
SELECT sp.id, f.title, 'CheckCircle', false, f.ord
FROM public.service_package sp
CROSS JOIN (VALUES
  ('Stratégie marketing sur mesure', 1),
  ('Analyse de votre audience cible', 2),
  ('Production de 6 vidéos optimisées', 3),
  ('Proposition de 15 concepts créatifs', 4),
  ('Rédaction de scripts orientés conversion', 5),
  ('Activation d''un acteur professionnel', 6),
  ('Tournage et montage premium', 7),
  ('Modifications illimitées', 8),
  ('Publication clé en main', 9)
) AS f(title, ord)
WHERE sp.slug = 'business-booster'
AND NOT EXISTS (SELECT 1 FROM public.package_feature pf WHERE pf.package_id = sp.id);

-- Features pour Pack Starter
INSERT INTO public.package_feature (package_id, title, icon, is_highlighted, display_order)
SELECT sp.id, f.title, 'CheckCircle', false, f.ord
FROM public.service_package sp
CROSS JOIN (VALUES
  ('Stratégie marketing de base', 1),
  ('3 vidéos courtes', 2),
  ('Script et montage inclus', 3),
  ('1 proposition de concept créatif', 4),
  ('Publication sur 1 plateforme', 5)
) AS f(title, ord)
WHERE sp.slug = 'pack-starter'
AND NOT EXISTS (SELECT 1 FROM public.package_feature pf WHERE pf.package_id = sp.id);

-- =========================================================
-- VÉRIFICATIONS
-- =========================================================
-- SELECT * FROM public.service_package ORDER BY display_order;
-- SELECT COUNT(*) FROM public.package_feature;
-- SELECT * FROM public.client_package;
