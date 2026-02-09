-- =========================================================
-- MIGRATION 004: Add RLS policies for staff role
-- =========================================================
-- The staff role has no RLS policies defined in database.sql
-- This causes "violates row-level security policy" errors
-- when staff tries to create/edit clients and related entities
-- =========================================================

BEGIN;

-- =========================================================
-- Drop existing staff policies first to avoid conflicts
-- =========================================================
DROP POLICY IF EXISTS staff_all_client ON public.client;
DROP POLICY IF EXISTS staff_all_mandat ON public.mandat;
DROP POLICY IF EXISTS staff_all_mandat_task ON public.mandat_task;
DROP POLICY IF EXISTS staff_all_contrat ON public.contrat;
DROP POLICY IF EXISTS staff_all_invoice ON public.invoice;
DROP POLICY IF EXISTS staff_all_invoice_item ON public.invoice_item;
DROP POLICY IF EXISTS staff_all_expense_category ON public.expense_category;
DROP POLICY IF EXISTS staff_all_expense ON public.expense;
DROP POLICY IF EXISTS staff_all_social_media_strategy ON public.social_media_strategy;
DROP POLICY IF EXISTS staff_all_editorial_calendar ON public.editorial_calendar;
DROP POLICY IF EXISTS staff_all_editorial_post ON public.editorial_post;
DROP POLICY IF EXISTS staff_all_persona ON public.persona;
DROP POLICY IF EXISTS staff_all_pilier_contenu ON public.pilier_contenu;
DROP POLICY IF EXISTS staff_all_video_script ON public.video_script;
DROP POLICY IF EXISTS staff_all_kpi ON public.kpi;
DROP POLICY IF EXISTS staff_all_kpi_mesure ON public.kpi_mesure;
DROP POLICY IF EXISTS staff_all_client_kpi ON public.client_kpi;
DROP POLICY IF EXISTS staff_all_client_kpi_value ON public.client_kpi_value;
DROP POLICY IF EXISTS staff_all_prospects ON public.prospects;
DROP POLICY IF EXISTS staff_all_contacts ON public.contacts;
DROP POLICY IF EXISTS staff_all_activities ON public.activities;
DROP POLICY IF EXISTS staff_all_meetings ON public.meetings;
DROP POLICY IF EXISTS staff_all_meeting_minutes ON public.meeting_minutes;
DROP POLICY IF EXISTS staff_all_pitch_decks ON public.pitch_decks;
DROP POLICY IF EXISTS staff_all_pitch_deck_assets ON public.pitch_deck_assets;
DROP POLICY IF EXISTS staff_all_pitch_deck_versions ON public.pitch_deck_versions;
DROP POLICY IF EXISTS staff_all_pitch_deck_templates ON public.pitch_deck_templates;
DROP POLICY IF EXISTS staff_all_pipeline_history ON public.pipeline_history;
DROP POLICY IF EXISTS staff_view_activity_log ON public.activity_log;
DROP POLICY IF EXISTS staff_view_company_settings ON public.company_settings;

-- =========================================================
-- STAFF POLICIES - Full access to all business entities
-- =========================================================
-- Staff role (employees) should have full CRUD access to:
-- - clients, mandats, invoices, expenses, contracts
-- - strategies, calendars, posts, scripts, KPIs
-- - CRM (prospects, contacts, activities, meetings, pitch decks)

-- Core entities
CREATE POLICY staff_all_client ON public.client FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_mandat ON public.mandat FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_mandat_task ON public.mandat_task FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_contrat ON public.contrat FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_invoice ON public.invoice FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_invoice_item ON public.invoice_item FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_expense_category ON public.expense_category FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_expense ON public.expense FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

-- Social media & content
CREATE POLICY staff_all_social_media_strategy ON public.social_media_strategy FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_editorial_calendar ON public.editorial_calendar FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_editorial_post ON public.editorial_post FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_persona ON public.persona FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_pilier_contenu ON public.pilier_contenu FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_video_script ON public.video_script FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

-- KPIs
CREATE POLICY staff_all_kpi ON public.kpi FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_kpi_mesure ON public.kpi_mesure FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_client_kpi ON public.client_kpi FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_client_kpi_value ON public.client_kpi_value FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

-- CRM entities
CREATE POLICY staff_all_prospects ON public.prospects FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_contacts ON public.contacts FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_activities ON public.activities FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_meetings ON public.meetings FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_meeting_minutes ON public.meeting_minutes FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_pitch_decks ON public.pitch_decks FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_pitch_deck_assets ON public.pitch_deck_assets FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_pitch_deck_versions ON public.pitch_deck_versions FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_pitch_deck_templates ON public.pitch_deck_templates FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY staff_all_pipeline_history ON public.pipeline_history FOR ALL
USING (public.is_staff()) WITH CHECK (public.is_staff());

-- Activity logs (read-only for staff)
CREATE POLICY staff_view_activity_log ON public.activity_log FOR SELECT
USING (public.is_staff());

-- Staff can read company_settings but not modify
CREATE POLICY staff_view_company_settings ON public.company_settings FOR SELECT
USING (public.is_staff());

COMMIT;

COMMENT ON POLICY staff_all_client ON public.client IS 'Staff (employees) have full access to clients';
COMMENT ON POLICY staff_all_mandat ON public.mandat IS 'Staff (employees) have full access to mandats';
