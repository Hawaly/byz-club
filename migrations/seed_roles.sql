-- ============================================================
-- SEED: Table role (admin, client, staff)
-- ============================================================

-- Insérer les 3 rôles de base si absents
INSERT INTO public.role (id, code, name, description, redirect_path)
VALUES
  (1, 'admin',  'Administrateur', 'Accès complet à toutes les fonctionnalités', '/dashboard'),
  (2, 'client', 'Client',         'Accès au portail client uniquement', '/client-portal'),
  (3, 'staff',  'Staff',          'Accès employé avec permissions limitées', '/dashboard')
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  redirect_path = EXCLUDED.redirect_path;

-- S'assurer que la séquence est synchronisée
SELECT setval('public.role_id_seq', (SELECT MAX(id) FROM public.role));
