-- =========================================================
-- MIGRATION 003: Fix functions and views to use auth_user_id
-- =========================================================
-- After migration 002, user_id was renamed to auth_user_id
-- This migration updates all functions and views that still reference user_id
-- =========================================================

BEGIN;

-- =========================================================
-- Drop existing functions first to avoid return type conflicts
-- =========================================================
DROP FUNCTION IF EXISTS public.current_user_role_code() CASCADE;
DROP FUNCTION IF EXISTS public.current_user_client_id() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_client() CASCADE;
DROP FUNCTION IF EXISTS public.is_staff() CASCADE;

-- =========================================================
-- Fix Function: current_user_role_code
-- =========================================================
CREATE FUNCTION public.current_user_role_code()
RETURNS VARCHAR
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.code
  FROM public.app_user au
  JOIN public.role r ON r.id = au.role_id
  WHERE au.auth_user_id = auth.uid()
  LIMIT 1
$$;

-- =========================================================
-- Fix Function: current_user_client_id
-- =========================================================
CREATE FUNCTION public.current_user_client_id()
RETURNS BIGINT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT au.client_id
  FROM public.app_user au
  WHERE au.auth_user_id = auth.uid()
  LIMIT 1
$$;

-- =========================================================
-- Fix Function: is_admin
-- =========================================================
CREATE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.app_user au
    JOIN public.role r ON r.id = au.role_id
    WHERE au.auth_user_id = auth.uid()
    AND r.code = 'admin'
  )
$$;

-- =========================================================
-- Fix Function: is_client
-- =========================================================
CREATE FUNCTION public.is_client()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.app_user au
    JOIN public.role r ON r.id = au.role_id
    WHERE au.auth_user_id = auth.uid()
    AND r.code = 'client'
  )
$$;

-- =========================================================
-- Fix Function: is_staff
-- =========================================================
CREATE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.app_user au
    JOIN public.role r ON r.id = au.role_id
    WHERE au.auth_user_id = auth.uid()
    AND r.code = 'staff'
  )
$$;

-- =========================================================
-- Fix View: user_with_details
-- =========================================================
DROP VIEW IF EXISTS public.user_with_details CASCADE;

CREATE OR REPLACE VIEW public.user_with_details AS
SELECT
  au.id,
  au.auth_user_id,
  u.email,
  au.is_active,
  au.last_login,
  au.created_at,
  r.id as role_id,
  r.code as role_code,
  r.name as role_name,
  r.redirect_path,
  au.client_id,
  c.name as client_name,
  c.company_name,
  c.email as client_email
FROM public.app_user au
JOIN public.role r ON au.role_id = r.id
LEFT JOIN public.client c ON au.client_id = c.id
LEFT JOIN auth.users u ON u.id = au.auth_user_id;

COMMIT;

COMMENT ON FUNCTION public.current_user_role_code() IS 'Returns the role code of the currently authenticated user (fixed for auth_user_id)';
COMMENT ON FUNCTION public.current_user_client_id() IS 'Returns the client_id of the currently authenticated user (fixed for auth_user_id)';
COMMENT ON VIEW public.user_with_details IS 'User details with role and client info (fixed for auth_user_id)';
