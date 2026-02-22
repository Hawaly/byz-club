-- =====================================================
-- MIGRATION: Refonte système de facturation
-- Séparation Expected / Invoiced / Collected
-- =====================================================

-- =====================================================
-- 1. TABLE: client_contract (Contrat virtuel)
-- =====================================================
CREATE TABLE IF NOT EXISTS client_contract (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT NOT NULL REFERENCES client(id) ON DELETE CASCADE,
  mandat_id BIGINT REFERENCES mandat(id) ON DELETE SET NULL,
  
  -- Informations du contrat
  contract_name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Montants
  monthly_amount DECIMAL(10,2) NOT NULL CHECK (monthly_amount >= 0),
  setup_fee DECIMAL(10,2) DEFAULT 0 CHECK (setup_fee >= 0),
  
  -- Période contractuelle
  start_date DATE NOT NULL,
  end_date DATE, -- NULL = contrat à durée indéterminée
  duration_months INTEGER, -- Durée en mois (alternative à end_date)
  
  -- Configuration de facturation
  billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly' 
    CHECK (billing_cycle IN ('monthly', 'quarterly', 'semi_annual', 'annual', 'one_time')),
  invoice_day INTEGER NOT NULL DEFAULT 1 CHECK (invoice_day BETWEEN 1 AND 31),
  payment_terms_days INTEGER DEFAULT 30 CHECK (payment_terms_days >= 0),
  
  -- Génération automatique
  auto_generate_invoices BOOLEAN DEFAULT true,
  auto_send_invoices BOOLEAN DEFAULT false,
  
  -- Statut
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'suspended', 'completed', 'cancelled')),
  
  -- Métadonnées
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Contraintes
  CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date > start_date),
  CONSTRAINT has_duration CHECK (end_date IS NOT NULL OR duration_months IS NOT NULL OR billing_cycle = 'one_time')
);

-- Index pour performance
CREATE INDEX idx_client_contract_client_id ON client_contract(client_id);
CREATE INDEX idx_client_contract_status ON client_contract(status);
CREATE INDEX idx_client_contract_dates ON client_contract(start_date, end_date);
CREATE INDEX idx_client_contract_mandat_id ON client_contract(mandat_id);

-- Trigger pour updated_at
CREATE TRIGGER update_client_contract_updated_at
  BEFORE UPDATE ON client_contract
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. TABLE: contract_schedule (Échéances attendues)
-- =====================================================
CREATE TABLE IF NOT EXISTS contract_schedule (
  id BIGSERIAL PRIMARY KEY,
  contract_id BIGINT NOT NULL REFERENCES client_contract(id) ON DELETE CASCADE,
  
  -- Dates de l'échéance
  period_start_date DATE NOT NULL,
  period_end_date DATE NOT NULL,
  expected_issue_date DATE NOT NULL, -- Date prévue d'émission de la facture
  expected_due_date DATE, -- Date d'échéance de paiement
  
  -- Montant attendu
  expected_amount DECIMAL(10,2) NOT NULL CHECK (expected_amount >= 0),
  
  -- Statut de l'échéance
  status VARCHAR(20) NOT NULL DEFAULT 'planned'
    CHECK (status IN ('planned', 'invoiced', 'paid', 'cancelled', 'skipped')),
  
  -- Lien vers la facture générée
  invoice_id BIGINT REFERENCES invoice(id) ON DELETE SET NULL,
  
  -- Métadonnées
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT valid_period CHECK (period_end_date >= period_start_date),
  CONSTRAINT valid_issue_date CHECK (expected_issue_date >= period_start_date),
  CONSTRAINT invoiced_has_invoice CHECK (
    (status = 'invoiced' AND invoice_id IS NOT NULL) OR 
    (status != 'invoiced')
  )
);

-- Index pour performance
CREATE INDEX idx_contract_schedule_contract_id ON contract_schedule(contract_id);
CREATE INDEX idx_contract_schedule_status ON contract_schedule(status);
CREATE INDEX idx_contract_schedule_expected_issue_date ON contract_schedule(expected_issue_date);
CREATE INDEX idx_contract_schedule_invoice_id ON contract_schedule(invoice_id);
CREATE INDEX idx_contract_schedule_dates ON contract_schedule(period_start_date, period_end_date);

-- Trigger pour updated_at
CREATE TRIGGER update_contract_schedule_updated_at
  BEFORE UPDATE ON contract_schedule
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. TABLE: payment (Paiements reçus)
-- =====================================================
CREATE TABLE IF NOT EXISTS payment (
  id BIGSERIAL PRIMARY KEY,
  
  -- Relations
  invoice_id BIGINT NOT NULL REFERENCES invoice(id) ON DELETE RESTRICT,
  client_id BIGINT NOT NULL REFERENCES client(id) ON DELETE RESTRICT,
  
  -- Informations du paiement
  payment_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  payment_method VARCHAR(50) DEFAULT 'bank_transfer'
    CHECK (payment_method IN ('bank_transfer', 'qr_bill', 'card', 'cash', 'other')),
  
  -- Référence
  reference VARCHAR(255), -- Référence bancaire, numéro de transaction, etc.
  
  -- Statut
  status VARCHAR(20) NOT NULL DEFAULT 'confirmed'
    CHECK (status IN ('pending', 'confirmed', 'failed', 'refunded')),
  
  -- Métadonnées
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Index pour performance
CREATE INDEX idx_payment_invoice_id ON payment(invoice_id);
CREATE INDEX idx_payment_client_id ON payment(client_id);
CREATE INDEX idx_payment_date ON payment(payment_date);
CREATE INDEX idx_payment_status ON payment(status);

-- Trigger pour updated_at
CREATE TRIGGER update_payment_updated_at
  BEFORE UPDATE ON payment
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. MODIFICATION TABLE: invoice (Ajout liens contrat)
-- =====================================================
-- Ajout des colonnes pour lier aux contrats et schedules
ALTER TABLE invoice 
  ADD COLUMN IF NOT EXISTS source_contract_id BIGINT REFERENCES client_contract(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS source_schedule_id BIGINT REFERENCES contract_schedule(id) ON DELETE SET NULL;

-- Index pour les nouvelles colonnes
CREATE INDEX IF NOT EXISTS idx_invoice_source_contract_id ON invoice(source_contract_id);
CREATE INDEX IF NOT EXISTS idx_invoice_source_schedule_id ON invoice(source_schedule_id);

-- Amélioration de l'index sur invoice_number pour unicité
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoice_number_unique ON invoice(invoice_number);

-- Index pour les requêtes de KPIs
CREATE INDEX IF NOT EXISTS idx_invoice_issue_date ON invoice(issue_date);
CREATE INDEX IF NOT EXISTS idx_invoice_payment_date ON invoice(payment_date) WHERE payment_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_invoice_status_dates ON invoice(status, issue_date, payment_date);

-- =====================================================
-- 5. VUES pour faciliter les requêtes
-- =====================================================

-- Vue: Résumé des contrats avec statistiques
CREATE OR REPLACE VIEW v_contract_summary AS
SELECT 
  cc.id,
  cc.client_id,
  cc.contract_name,
  cc.monthly_amount,
  cc.billing_cycle,
  cc.status,
  cc.start_date,
  cc.end_date,
  c.company_name as client_name,
  
  -- Statistiques des échéances
  COUNT(cs.id) as total_schedules,
  COUNT(cs.id) FILTER (WHERE cs.status = 'planned') as planned_schedules,
  COUNT(cs.id) FILTER (WHERE cs.status = 'invoiced') as invoiced_schedules,
  COUNT(cs.id) FILTER (WHERE cs.status = 'paid') as paid_schedules,
  
  -- Montants
  COALESCE(SUM(cs.expected_amount) FILTER (WHERE cs.status = 'planned'), 0) as expected_amount,
  COALESCE(SUM(cs.expected_amount) FILTER (WHERE cs.status = 'invoiced'), 0) as invoiced_amount,
  COALESCE(SUM(cs.expected_amount) FILTER (WHERE cs.status = 'paid'), 0) as paid_amount
  
FROM client_contract cc
LEFT JOIN client c ON c.id = cc.client_id
LEFT JOIN contract_schedule cs ON cs.contract_id = cc.id
GROUP BY cc.id, c.company_name;

-- Vue: Échéances à facturer
CREATE OR REPLACE VIEW v_schedules_due_for_invoicing AS
SELECT 
  cs.*,
  cc.client_id,
  cc.contract_name,
  cc.auto_generate_invoices,
  cc.payment_terms_days,
  c.company_name as client_name
FROM contract_schedule cs
JOIN client_contract cc ON cc.id = cs.contract_id
JOIN client c ON c.id = cc.client_id
WHERE cs.status = 'planned'
  AND cc.status = 'active'
  AND cc.auto_generate_invoices = true
  AND cs.expected_issue_date <= CURRENT_DATE
ORDER BY cs.expected_issue_date ASC;

-- Vue: Factures avec informations de paiement
CREATE OR REPLACE VIEW v_invoice_payment_status AS
SELECT 
  i.*,
  COALESCE(SUM(p.amount), 0) as total_paid,
  i.total_ttc - COALESCE(SUM(p.amount), 0) as remaining_amount,
  CASE 
    WHEN COALESCE(SUM(p.amount), 0) >= i.total_ttc THEN 'fully_paid'
    WHEN COALESCE(SUM(p.amount), 0) > 0 THEN 'partially_paid'
    ELSE 'unpaid'
  END as payment_status,
  COUNT(p.id) as payment_count
FROM invoice i
LEFT JOIN payment p ON p.invoice_id = i.id AND p.status = 'confirmed'
GROUP BY i.id;

-- =====================================================
-- 6. FONCTIONS utilitaires
-- =====================================================

-- Fonction: Calculer la date de fin d'un contrat
CREATE OR REPLACE FUNCTION calculate_contract_end_date(
  p_start_date DATE,
  p_duration_months INTEGER
) RETURNS DATE AS $$
BEGIN
  RETURN p_start_date + (p_duration_months || ' months')::INTERVAL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fonction: Obtenir le prochain jour de facturation
CREATE OR REPLACE FUNCTION get_next_invoice_date(
  p_from_date DATE,
  p_invoice_day INTEGER,
  p_billing_cycle VARCHAR
) RETURNS DATE AS $$
DECLARE
  v_next_date DATE;
  v_months_increment INTEGER;
BEGIN
  -- Déterminer l'incrément selon le cycle
  v_months_increment := CASE p_billing_cycle
    WHEN 'monthly' THEN 1
    WHEN 'quarterly' THEN 3
    WHEN 'semi_annual' THEN 6
    WHEN 'annual' THEN 12
    ELSE 1
  END;
  
  -- Calculer la prochaine date
  v_next_date := DATE_TRUNC('month', p_from_date) + (v_months_increment || ' months')::INTERVAL;
  
  -- Ajuster au jour de facturation (gérer les mois courts)
  v_next_date := v_next_date + (LEAST(p_invoice_day, EXTRACT(DAY FROM (DATE_TRUNC('month', v_next_date) + INTERVAL '1 month - 1 day'))::INTEGER) - 1 || ' days')::INTERVAL;
  
  RETURN v_next_date;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fonction: Marquer une échéance comme facturée
CREATE OR REPLACE FUNCTION mark_schedule_as_invoiced(
  p_schedule_id BIGINT,
  p_invoice_id BIGINT
) RETURNS VOID AS $$
BEGIN
  UPDATE contract_schedule
  SET 
    status = 'invoiced',
    invoice_id = p_invoice_id,
    updated_at = NOW()
  WHERE id = p_schedule_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Marquer une échéance comme payée
CREATE OR REPLACE FUNCTION mark_schedule_as_paid(
  p_schedule_id BIGINT
) RETURNS VOID AS $$
BEGIN
  UPDATE contract_schedule
  SET 
    status = 'paid',
    updated_at = NOW()
  WHERE id = p_schedule_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. RLS (Row Level Security)
-- =====================================================

-- Activer RLS sur les nouvelles tables
ALTER TABLE client_contract ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment ENABLE ROW LEVEL SECURITY;

-- Politique: Les clients voient uniquement leurs contrats
CREATE POLICY client_contract_client_access ON client_contract
  FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM client WHERE id = (
        SELECT client_id FROM app_user WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Politique: Les admins voient tous les contrats
CREATE POLICY client_contract_admin_access ON client_contract
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM app_user 
      WHERE auth_user_id = auth.uid() 
      AND role_id = 1
    )
  );

-- Politique: Les clients voient uniquement leurs échéances
CREATE POLICY contract_schedule_client_access ON contract_schedule
  FOR SELECT
  USING (
    contract_id IN (
      SELECT id FROM client_contract WHERE client_id IN (
        SELECT id FROM client WHERE id = (
          SELECT client_id FROM app_user WHERE auth_user_id = auth.uid()
        )
      )
    )
  );

-- Politique: Les admins voient toutes les échéances
CREATE POLICY contract_schedule_admin_access ON contract_schedule
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM app_user 
      WHERE auth_user_id = auth.uid() 
      AND role_id = 1
    )
  );

-- Politique: Les clients voient uniquement leurs paiements
CREATE POLICY payment_client_access ON payment
  FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM client WHERE id = (
        SELECT client_id FROM app_user WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Politique: Les admins voient tous les paiements
CREATE POLICY payment_admin_access ON payment
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM app_user 
      WHERE auth_user_id = auth.uid() 
      AND role_id = 1
    )
  );

-- =====================================================
-- 8. COMMENTAIRES pour documentation
-- =====================================================

COMMENT ON TABLE client_contract IS 'Contrats virtuels définissant les montants attendus et la période contractuelle';
COMMENT ON TABLE contract_schedule IS 'Échéances planifiées pour chaque contrat (Expected Revenue)';
COMMENT ON TABLE payment IS 'Paiements reçus des clients (Collected Revenue)';

COMMENT ON COLUMN client_contract.billing_cycle IS 'Fréquence de facturation: monthly, quarterly, semi_annual, annual, one_time';
COMMENT ON COLUMN client_contract.invoice_day IS 'Jour du mois pour émettre la facture (1-31, ajusté pour mois courts)';
COMMENT ON COLUMN client_contract.auto_generate_invoices IS 'Génération automatique des factures via cron job';

COMMENT ON COLUMN contract_schedule.status IS 'planned: à facturer, invoiced: facture émise, paid: payée, cancelled: annulée, skipped: sautée';
COMMENT ON COLUMN contract_schedule.expected_issue_date IS 'Date prévue d''émission de la facture (utilisée par le billing engine)';

COMMENT ON COLUMN payment.payment_method IS 'Méthode de paiement: bank_transfer, qr_bill, card, cash, other';
COMMENT ON COLUMN payment.status IS 'pending: en attente, confirmed: confirmé, failed: échoué, refunded: remboursé';

-- =====================================================
-- FIN DE LA MIGRATION
-- =====================================================
