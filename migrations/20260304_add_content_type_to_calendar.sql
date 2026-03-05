-- Migration: Ajouter les colonnes pour type de contenu et liens au calendrier éditorial
-- Date: 2026-03-04

-- Étape 1: Ajouter les nouvelles colonnes
ALTER TABLE public.editorial_calendar
  ADD COLUMN IF NOT EXISTS content_type TEXT NOT NULL DEFAULT 'post'
    CHECK (content_type IN ('video', 'post', 'carousel')),
  ADD COLUMN IF NOT EXISTS drive_link TEXT,
  ADD COLUMN IF NOT EXISTS content_description TEXT,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Étape 2: Ajouter une contrainte FK pour script_id si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'editorial_calendar_script_id_fkey'
  ) THEN
    ALTER TABLE public.editorial_calendar
      ADD CONSTRAINT editorial_calendar_script_id_fkey
      FOREIGN KEY (script_id) REFERENCES public.video_script(id) ON DELETE SET NULL;
  END IF;
END$$;

-- Étape 3: Créer un index sur content_type pour les filtres
CREATE INDEX IF NOT EXISTS idx_editorial_calendar_content_type 
  ON public.editorial_calendar(content_type);

-- Étape 4: Commentaires pour documentation
COMMENT ON COLUMN public.editorial_calendar.content_type IS 'Type de contenu: video, post, ou carousel';
COMMENT ON COLUMN public.editorial_calendar.drive_link IS 'Lien Google Drive vers les assets';
COMMENT ON COLUMN public.editorial_calendar.content_description IS 'Description du contenu du post/carousel';
COMMENT ON COLUMN public.editorial_calendar.script_id IS 'Référence au script vidéo (si content_type = video)';
COMMENT ON COLUMN public.editorial_calendar.thumbnail_url IS 'URL de la miniature/visuel';
