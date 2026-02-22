-- =========================================================
-- DEBUG SCRIPT: Check RLS policies and current user setup
-- =========================================================
-- Run this in Supabase SQL Editor to diagnose RLS issues
-- =========================================================

-- 1. Check if staff RLS policies exist on client table
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'client'
ORDER BY policyname;

-- 2. Check current authenticated user's role
SELECT 
  auth.uid() as auth_user_id,
  au.id as app_user_id,
  au.email,
  au.role_id,
  r.code as role_code,
  r.name as role_name,
  au.is_active
FROM public.app_user au
JOIN public.role r ON r.id = au.role_id
WHERE au.auth_user_id = auth.uid();

-- 3. Test role checking functions
SELECT 
  'is_admin()' as function_name,
  public.is_admin() as result
UNION ALL
SELECT 
  'is_staff()' as function_name,
  public.is_staff() as result
UNION ALL
SELECT 
  'is_client()' as function_name,
  public.is_client() as result;

-- 4. Check if app_user has correct schema
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'app_user'
ORDER BY ordinal_position;

-- 5. Check if trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- =========================================================
-- EXPECTED RESULTS:
-- =========================================================
-- 1. Should show policies: admin_all_client, staff_all_client, client_view_own_client
-- 2. Should show your user with role_code = 'admin' or 'staff'
-- 3. One of is_admin() or is_staff() should return TRUE
-- 4. app_user should have: id, auth_user_id, email, role_id, client_id, is_active
-- 5. Trigger should exist on auth.users
-- =========================================================
