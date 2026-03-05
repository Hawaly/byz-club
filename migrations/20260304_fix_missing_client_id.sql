-- =====================================================
-- Migration: Corriger les utilisateurs sans client_id
-- Description: Associer automatiquement les utilisateurs clients à leur client
-- =====================================================

-- Liste les utilisateurs actuellement sans client_id
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count 
  FROM public.app_user 
  WHERE client_id IS NULL AND role_id = 2;
  
  RAISE NOTICE 'Utilisateurs clients sans client_id: %', v_count;
END$$;

-- Option 1: Si l'email correspond à un domaine client existant
-- Exemple: greg@byzclub.ch → client avec email contenant @byzclub.ch
UPDATE public.app_user au
SET 
  client_id = c.id,
  updated_at = NOW()
FROM public.client c
WHERE au.client_id IS NULL
  AND au.role_id = 2  -- role client
  AND c.email IS NOT NULL
  AND au.email LIKE '%' || SUBSTRING(c.email FROM '@(.*)$');

-- Option 2: Si l'email match exactement avec le email du client
UPDATE public.app_user au
SET 
  client_id = c.id,
  updated_at = NOW()
FROM public.client c
WHERE au.client_id IS NULL
  AND au.role_id = 2
  AND au.email = c.email;

-- Option 3: Créer un client pour les utilisateurs orphelins
-- (à adapter selon vos besoins - commenté par défaut)
/*
INSERT INTO public.client (
  name,
  company_name,
  email,
  status,
  type,
  created_at,
  updated_at
)
SELECT 
  SPLIT_PART(au.email, '@', 1) as name,
  SPLIT_PART(au.email, '@', 2) as company_name,
  au.email as email,
  'potentiel'::client_status as status,
  'oneshot'::client_type as type,
  NOW() as created_at,
  NOW() as updated_at
FROM public.app_user au
WHERE au.client_id IS NULL 
  AND au.role_id = 2
ON CONFLICT DO NOTHING;

-- Associer les utilisateurs aux clients nouvellement créés
UPDATE public.app_user au
SET 
  client_id = c.id,
  updated_at = NOW()
FROM public.client c
WHERE au.client_id IS NULL
  AND au.role_id = 2
  AND au.email = c.email;
*/

-- Rapport final
DO $$
DECLARE
  v_linked INTEGER;
  v_unlinked INTEGER;
  i RECORD;
BEGIN
  SELECT COUNT(*) INTO v_linked 
  FROM public.app_user 
  WHERE client_id IS NOT NULL AND role_id = 2;
  
  SELECT COUNT(*) INTO v_unlinked 
  FROM public.app_user 
  WHERE client_id IS NULL AND role_id = 2;
  
  RAISE NOTICE 'Utilisateurs clients liés: %', v_linked;
  RAISE NOTICE 'Utilisateurs clients non liés (nécessite intervention manuelle): %', v_unlinked;
  
  -- Afficher les utilisateurs non liés
  IF v_unlinked > 0 THEN
    RAISE NOTICE 'Utilisateurs non liés:';
    FOR i IN 
      SELECT id, email 
      FROM public.app_user 
      WHERE client_id IS NULL AND role_id = 2
      ORDER BY email
    LOOP
      RAISE NOTICE '  - ID: %, Email: %', i.id, i.email;
    END LOOP;
  END IF;
END$$;
