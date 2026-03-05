-- ============================================================
-- FIX: Auth → app_user synchronisation
-- 
-- Problème: handle_new_user() et on_auth_user_created() sont
-- des stubs vides → aucun user n'est créé dans app_user
-- automatiquement → requireSession() retourne 401.
-- ============================================================

-- ── 1. Corriger handle_new_user (trigger sur auth.users INSERT) ──────────────
-- Cette fonction est appelée quand un nouveau user est créé via Supabase Auth.
-- Elle doit créer une ligne dans public.app_user si elle n'existe pas.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role_id INTEGER;
  v_client_id INTEGER;
BEGIN
  -- Récupérer le role_id depuis app_metadata (passé par admin.createUser)
  -- Sinon utiliser raw_user_meta_data (signup normal)
  -- Sinon role 2 (client) par défaut
  v_role_id := COALESCE(
    (NEW.raw_app_meta_data->>'role_id')::INTEGER,
    (NEW.raw_user_meta_data->>'role_id')::INTEGER,
    2  -- 2 = client par défaut
  );

  -- Récupérer le client_id depuis app_metadata si présent
  v_client_id := COALESCE(
    (NEW.raw_app_meta_data->>'client_id')::INTEGER,
    (NEW.raw_user_meta_data->>'client_id')::INTEGER,
    NULL
  );

  -- Insérer dans app_user seulement si pas déjà présent
  INSERT INTO public.app_user (
    email,
    auth_user_id,
    role_id,
    client_id,
    is_active,
    created_at,
    updated_at
  )
  VALUES (
    NEW.email,
    NEW.id,
    v_role_id,
    v_client_id,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (auth_user_id) DO UPDATE SET
    email = EXCLUDED.email,
    client_id = COALESCE(EXCLUDED.client_id, app_user.client_id),
    updated_at = NOW();

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Ne jamais bloquer la création du user auth
  RAISE WARNING 'handle_new_user: failed to sync app_user for %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$;

-- ── 2. Corriger on_auth_user_created (même logique, alias) ──────────────────
CREATE OR REPLACE FUNCTION public.on_auth_user_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.handle_new_user();
END;
$$;

-- ── 3. S'assurer que le trigger existe sur auth.users ────────────────────────
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 4. Ajouter contrainte UNIQUE sur auth_user_id si absente ─────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'app_user_auth_user_id_key'
  ) THEN
    ALTER TABLE public.app_user
      ADD CONSTRAINT app_user_auth_user_id_key UNIQUE (auth_user_id);
  END IF;
END$$;

-- ── 5. Migrer les users existants : lier auth_user_id aux users legacy ────────
-- Tente de matcher par email entre auth.users et app_user
-- (pour les users qui existent des deux côtés sans liaison)
UPDATE public.app_user au
SET
  auth_user_id = a.id,
  updated_at   = NOW()
FROM auth.users a
WHERE a.email = au.email
  AND au.auth_user_id IS NULL;

-- ── 6. Vérification ──────────────────────────────────────────────────────────
DO $$
DECLARE
  v_linked   INTEGER;
  v_unlinked INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_linked   FROM public.app_user WHERE auth_user_id IS NOT NULL;
  SELECT COUNT(*) INTO v_unlinked FROM public.app_user WHERE auth_user_id IS NULL;
  RAISE NOTICE 'app_user: % linked, % still unlinked (legacy/no auth account)', v_linked, v_unlinked;
END$$;
