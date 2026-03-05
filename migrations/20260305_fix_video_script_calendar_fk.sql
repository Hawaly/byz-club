-- Migration: Changer la FK editorial_post_id vers editorial_calendar
-- Date: 2026-03-05
-- Raison: Les scripts sont désormais liés aux entrées du calendrier éditorial (editorial_calendar)
--         et non plus aux anciens posts (editorial_post).

-- 1. Supprimer l'ancienne contrainte FK
ALTER TABLE public.video_script
  DROP CONSTRAINT IF EXISTS video_script_editorial_post_id_fkey;

-- 2. Mettre à NULL les valeurs existantes qui ne correspondent pas à des IDs valides dans editorial_calendar
--    (sécurité : éviter des violations après le changement de FK)
UPDATE public.video_script
SET editorial_post_id = NULL
WHERE editorial_post_id IS NOT NULL
  AND editorial_post_id NOT IN (SELECT id FROM public.editorial_calendar);

-- 3. Ajouter la nouvelle contrainte FK vers editorial_calendar
ALTER TABLE public.video_script
  ADD CONSTRAINT video_script_editorial_post_id_fkey
  FOREIGN KEY (editorial_post_id)
  REFERENCES public.editorial_calendar(id)
  ON DELETE SET NULL;

-- 4. Mettre à jour le commentaire de la colonne
COMMENT ON COLUMN public.video_script.editorial_post_id IS 'Lien vers le post du calendrier éditorial (editorial_calendar)';
