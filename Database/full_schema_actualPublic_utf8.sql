


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."account_category" AS ENUM (
    'cash',
    'bank',
    'receivable',
    'fixed_asset',
    'inventory',
    'current_asset',
    'current_liability',
    'long_term_liability',
    'equity',
    'revenue',
    'cost_of_sales',
    'operating_expense',
    'tax'
);


ALTER TYPE "public"."account_category" OWNER TO "postgres";


CREATE TYPE "public"."account_type" AS ENUM (
    'asset',
    'liability',
    'equity',
    'revenue',
    'expense'
);


ALTER TYPE "public"."account_type" OWNER TO "postgres";


CREATE TYPE "public"."activity_status" AS ENUM (
    'planned',
    'completed',
    'cancelled'
);


ALTER TYPE "public"."activity_status" OWNER TO "postgres";


CREATE TYPE "public"."activity_type" AS ENUM (
    'call',
    'email',
    'task',
    'meeting'
);


ALTER TYPE "public"."activity_type" OWNER TO "postgres";


CREATE TYPE "public"."client_status" AS ENUM (
    'actif',
    'pause',
    'termine',
    'potentiel'
);


ALTER TYPE "public"."client_status" OWNER TO "postgres";


CREATE TYPE "public"."client_type" AS ENUM (
    'oneshot',
    'mensuel'
);


ALTER TYPE "public"."client_type" OWNER TO "postgres";


CREATE TYPE "public"."expense_type" AS ENUM (
    'client_mandat',
    'yourstory'
);


ALTER TYPE "public"."expense_type" OWNER TO "postgres";


CREATE TYPE "public"."invoice_recurrence" AS ENUM (
    'oneshot',
    'mensuel',
    'trimestriel',
    'annuel'
);


ALTER TYPE "public"."invoice_recurrence" OWNER TO "postgres";


CREATE TYPE "public"."invoice_status" AS ENUM (
    'brouillon',
    'envoyee',
    'payee',
    'annulee'
);


ALTER TYPE "public"."invoice_status" OWNER TO "postgres";


CREATE TYPE "public"."journal_status" AS ENUM (
    'draft',
    'posted',
    'validated',
    'cancelled'
);


ALTER TYPE "public"."journal_status" OWNER TO "postgres";


CREATE TYPE "public"."lead_source" AS ENUM (
    'website',
    'referral',
    'linkedin',
    'cold_outreach',
    'event',
    'other'
);


ALTER TYPE "public"."lead_source" OWNER TO "postgres";


CREATE TYPE "public"."mandat_status" AS ENUM (
    'en_cours',
    'termine',
    'annule'
);


ALTER TYPE "public"."mandat_status" OWNER TO "postgres";


CREATE TYPE "public"."priority_level" AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);


ALTER TYPE "public"."priority_level" OWNER TO "postgres";


CREATE TYPE "public"."prospect_status" AS ENUM (
    'new',
    'qualified',
    'discovery',
    'proposal',
    'negotiation',
    'won',
    'lost'
);


ALTER TYPE "public"."prospect_status" OWNER TO "postgres";


CREATE TYPE "public"."recurrence_type" AS ENUM (
    'oneshot',
    'mensuel'
);


ALTER TYPE "public"."recurrence_type" OWNER TO "postgres";


CREATE TYPE "public"."task_status" AS ENUM (
    'a_faire',
    'en_cours',
    'terminee'
);


ALTER TYPE "public"."task_status" OWNER TO "postgres";


CREATE TYPE "public"."task_type" AS ENUM (
    'contenu',
    'video',
    'reunion',
    'reporting',
    'autre'
);


ALTER TYPE "public"."task_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."audit_auth_users_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Protection complÔö£┬┐te contre les erreurs
  BEGIN
    -- Version simplifiÔö£┬«e sans inet_client_addr() ni current_setting()
    -- qui garantit de ne JAMAIS bloquer une opÔö£┬«ration sur auth.users
    INSERT INTO public.auth_users_audit (
      user_id,
      action,
      new_data,
      changed_by,
      ip_address
    ) VALUES (
      CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
      TG_OP,
      CASE
        WHEN TG_OP = 'DELETE' THEN jsonb_build_object('email', OLD.email)
        ELSE jsonb_build_object('email', NEW.email)
      END,
      NULL, -- On ne cherche pas Ôö£├í rÔö£┬«cupÔö£┬«rer current_user/setting qui fait planter
      NULL  -- On ne cherche pas l'IP qui fait planter
    );
  EXCEPTION WHEN OTHERS THEN
    -- On capture TOUTES les erreurs pour que le trigger ne plante JAMAIS
    NULL;
  END;
  
  -- Toujours permettre l'opÔö£┬«ration originale
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$;


ALTER FUNCTION "public"."audit_auth_users_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."blacklist_ip"("p_ip_address" "inet", "p_reason" "text", "p_duration_hours" integer DEFAULT 24, "p_is_permanent" boolean DEFAULT false) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_blocked_until TIMESTAMP WITH TIME ZONE;
BEGIN
  IF p_is_permanent THEN
    v_blocked_until := NULL;
  ELSE
    v_blocked_until := NOW() + (p_duration_hours || ' hours')::INTERVAL;
  END IF;

  INSERT INTO public.ip_blacklist (
    ip_address,
    reason,
    blocked_until,
    is_permanent
  ) VALUES (
    p_ip_address,
    p_reason,
    v_blocked_until,
    p_is_permanent
  )
  ON CONFLICT (ip_address) 
  DO UPDATE SET
    reason = EXCLUDED.reason,
    blocked_until = EXCLUDED.blocked_until,
    is_permanent = EXCLUDED.is_permanent,
    blocked_at = NOW();
END;
$$;


ALTER FUNCTION "public"."blacklist_ip"("p_ip_address" "inet", "p_reason" "text", "p_duration_hours" integer, "p_is_permanent" boolean) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_contract_end_date"("p_start_date" "date", "p_duration_months" integer) RETURNS "date"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
BEGIN
  RETURN p_start_date + (p_duration_months || ' months')::INTERVAL;
END;
$$;


ALTER FUNCTION "public"."calculate_contract_end_date"("p_start_date" "date", "p_duration_months" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_journal_entry_balance"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  total_debit DECIMAL(15,2);
  total_credit DECIMAL(15,2);
BEGIN
  -- Get totals for the journal entry
  SELECT 
    COALESCE(SUM(debit), 0), 
    COALESCE(SUM(credit), 0)
  INTO total_debit, total_credit
  FROM accounting_journal_line
  WHERE journal_entry_id = NEW.id;
  
  -- Check if debits equal credits
  IF total_debit != total_credit THEN
    RAISE EXCEPTION 'Journal entry % is not balanced. Debits (%) must equal credits (%)',
      NEW.entry_number, total_debit, total_credit;
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_journal_entry_balance"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_login_attempts"("p_email" character varying, "p_ip_address" "inet") RETURNS TABLE("is_blocked" boolean, "attempts_count" integer, "block_reason" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_attempts_count INTEGER;
  v_is_ip_blocked BOOLEAN;
BEGIN
  -- VÔö£┬«rifier si l'IP est blacklistÔö£┬«e
  v_is_ip_blocked := is_ip_blacklisted(p_ip_address);
  
  IF v_is_ip_blocked THEN
    RETURN QUERY SELECT 
      true::BOOLEAN as is_blocked,
      0::INTEGER as attempts_count,
      'IP address is blacklisted'::TEXT as block_reason;
    RETURN;
  END IF;
  
  -- Compter les tentatives Ôö£┬«chouÔö£┬«es rÔö£┬«centes
  SELECT COUNT(*)::INTEGER INTO v_attempts_count
  FROM public.security_logs
  WHERE email = p_email
    AND event_type = 'login_failed'
    AND created_at > NOW() - INTERVAL '15 minutes';
  
  -- Bloquer aprÔö£┬┐s 5 tentatives
  IF v_attempts_count >= 5 THEN
    -- Blacklister l'IP pour 1 heure
    PERFORM blacklist_ip(
      p_ip_address,
      'Too many failed login attempts for ' || p_email,
      1,
      false
    );
    
    RETURN QUERY SELECT 
      true::BOOLEAN as is_blocked,
      v_attempts_count as attempts_count,
      'Too many failed attempts'::TEXT as block_reason;
  ELSE
    RETURN QUERY SELECT 
      false::BOOLEAN as is_blocked,
      v_attempts_count as attempts_count,
      NULL::TEXT as block_reason;
  END IF;
END;
$$;


ALTER FUNCTION "public"."check_login_attempts"("p_email" character varying, "p_ip_address" "inet") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_user_permission"("p_user_id" integer, "p_required_role" character varying) RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  user_role VARCHAR(50);
BEGIN
  SELECT role INTO user_role FROM public.app_user WHERE id = p_user_id AND is_active = true;
  
  IF user_role IS NULL THEN
    RETURN false;
  END IF;
  
  -- Admin a tous les droits
  IF user_role = 'admin' THEN
    RETURN true;
  END IF;
  
  -- VÔö£┬«rifier le rÔö£Ôöñle spÔö£┬«cifique
  RETURN user_role = p_required_role;
END;
$$;


ALTER FUNCTION "public"."check_user_permission"("p_user_id" integer, "p_required_role" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_expired_sessions"() RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.user_session
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;


ALTER FUNCTION "public"."cleanup_expired_sessions"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."cleanup_expired_sessions"() IS 'Supprime les sessions expirÔö£┬«es (Ôö£├í exÔö£┬«cuter via cron)';



CREATE OR REPLACE FUNCTION "public"."create_editorial_calendar_for_strategy"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO editorial_calendar (strategy_id, name)
  VALUES (NEW.id, 'Calendrier ' || NEW.id);
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_editorial_calendar_for_strategy"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_security_notification"("p_user_id" integer, "p_security_log_id" bigint, "p_notification_type" character varying, "p_title" character varying, "p_message" "text", "p_severity" character varying DEFAULT 'info'::character varying) RETURNS bigint
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_notification_id BIGINT;
BEGIN
  INSERT INTO security_notifications (
    user_id,
    security_log_id,
    notification_type,
    title,
    message,
    severity
  ) VALUES (
    p_user_id,
    p_security_log_id,
    p_notification_type,
    p_title,
    p_message,
    p_severity
  )
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$;


ALTER FUNCTION "public"."create_security_notification"("p_user_id" integer, "p_security_log_id" bigint, "p_notification_type" character varying, "p_title" character varying, "p_message" "text", "p_severity" character varying) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."create_security_notification"("p_user_id" integer, "p_security_log_id" bigint, "p_notification_type" character varying, "p_title" character varying, "p_message" "text", "p_severity" character varying) IS 'Creates security notifications for users';



CREATE OR REPLACE FUNCTION "public"."current_app_user_id"() RETURNS integer
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT u.id
  FROM public.app_user u
  WHERE u.auth_user_id = auth.uid()
  LIMIT 1;
$$;


ALTER FUNCTION "public"."current_app_user_id"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."current_app_user_id"() IS 'Retourne l''ID de app_user liÔö£┬« au user Supabase authentifiÔö£┬« (via JWT).';



CREATE OR REPLACE FUNCTION "public"."current_user_client_id"() RETURNS bigint
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT u.client_id
  FROM public.app_user u
  WHERE u.auth_user_id = auth.uid()
  LIMIT 1;
$$;


ALTER FUNCTION "public"."current_user_client_id"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."current_user_client_id"() IS 'Retourne le client_id de l''utilisateur authentifiÔö£┬« (NULL pour admin/staff).';



CREATE OR REPLACE FUNCTION "public"."current_user_role_id"() RETURNS integer
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT COALESCE(u.role_id, 0)
  FROM public.app_user u
  WHERE u.auth_user_id = auth.uid()
  LIMIT 1;
$$;


ALTER FUNCTION "public"."current_user_role_id"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."current_user_role_id"() IS 'Retourne le role_id de l''utilisateur authentifiÔö£┬« (0 si non trouvÔö£┬«).';



CREATE OR REPLACE FUNCTION "public"."detect_suspicious_login"("p_user_id" integer, "p_ip_address" "inet", "p_device_info" "jsonb") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_is_suspicious BOOLEAN := FALSE;
  v_recent_ips TEXT[];
  v_recent_locations TEXT[];
BEGIN
  -- Check if IP address is new for this user in last 30 days
  SELECT ARRAY_AGG(DISTINCT host(ip_address)::TEXT)
  INTO v_recent_ips
  FROM security_logs
  WHERE user_id = p_user_id
    AND event_type = 'login'
    AND event_status = 'success'
    AND created_at > NOW() - INTERVAL '30 days'
    AND ip_address != p_ip_address;
  
  -- If user has previous logins and current IP is not in recent IPs
  IF v_recent_ips IS NOT NULL AND ARRAY_LENGTH(v_recent_ips, 1) > 0 THEN
    IF NOT (host(p_ip_address)::TEXT = ANY(v_recent_ips)) THEN
      v_is_suspicious := TRUE;
    END IF;
  END IF;
  
  RETURN v_is_suspicious;
END;
$$;


ALTER FUNCTION "public"."detect_suspicious_login"("p_user_id" integer, "p_ip_address" "inet", "p_device_info" "jsonb") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."detect_suspicious_login"("p_user_id" integer, "p_ip_address" "inet", "p_device_info" "jsonb") IS 'Detects suspicious login patterns';



CREATE OR REPLACE FUNCTION "public"."force_password_reset_all_users"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Forcer le reset pour tous les utilisateurs
  UPDATE auth.users
  SET raw_user_meta_data = 
    COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    '{"must_reset_password": true, "security_alert": "2026-01-06 SQL Injection Attack"}'::jsonb,
  updated_at = NOW();
END;
$$;


ALTER FUNCTION "public"."force_password_reset_all_users"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."force_user_password_reset"("user_id" bigint, "alert_message" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Mettre Ôö£├í jour notre table publique
  UPDATE public.app_user
  SET 
    must_reset_password = TRUE,
    security_alert = alert_message,
    updated_at = NOW()
  WHERE id = user_id;
  
  -- Note: Pour rÔö£┬«ellement forcer le reset dans Supabase Auth,
  -- utiliser l'API Admin depuis le backend:
  -- await supabase.auth.admin.updateUserById(authUserId, {
  --   password: generateTemporaryPassword(),
  --   email_confirm: false
  -- })
END;
$$;


ALTER FUNCTION "public"."force_user_password_reset"("user_id" bigint, "alert_message" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."force_user_password_reset"("user_id" bigint, "alert_message" "text") IS 'Force un utilisateur Ôö£├í rÔö£┬«initialiser son mot de passe. Utiliser l''API Supabase Auth pour le reset effectif.';



CREATE OR REPLACE FUNCTION "public"."get_current_user_role"() RETURNS TABLE("user_id" bigint, "role_id" integer, "role_code" character varying, "role_name" character varying)
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.role_id,
    r.code,
    r.name
  FROM public.app_user u
  LEFT JOIN public.role r ON u.role_id = r.id
  WHERE u.auth_user_id = auth.uid()
  AND u.is_active = TRUE;
END;
$$;


ALTER FUNCTION "public"."get_current_user_role"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_next_invoice_date"("p_from_date" "date", "p_invoice_day" integer, "p_billing_cycle" character varying) RETURNS "date"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
  v_next_date DATE;
  v_months_increment INTEGER;
BEGIN
  -- DÔö£┬«terminer l'incrÔö£┬«ment selon le cycle
  v_months_increment := CASE p_billing_cycle
    WHEN 'monthly' THEN 1
    WHEN 'quarterly' THEN 3
    WHEN 'semi_annual' THEN 6
    WHEN 'annual' THEN 12
    ELSE 1
  END;
  
  -- Calculer la prochaine date
  v_next_date := DATE_TRUNC('month', p_from_date) + (v_months_increment || ' months')::INTERVAL;
  
  -- Ajuster au jour de facturation (gÔö£┬«rer les mois courts)
  v_next_date := v_next_date + (LEAST(p_invoice_day, EXTRACT(DAY FROM (DATE_TRUNC('month', v_next_date) + INTERVAL '1 month - 1 day'))::INTEGER) - 1 || ' days')::INTERVAL;
  
  RETURN v_next_date;
END;
$$;


ALTER FUNCTION "public"."get_next_invoice_date"("p_from_date" "date", "p_invoice_day" integer, "p_billing_cycle" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.app_user u
    JOIN public.role r ON u.role_id = r.id
    WHERE u.auth_user_id = auth.uid()
      AND r.code = 'admin'
  );
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."is_admin"() IS 'Retourne TRUE si l''utilisateur authentifiÔö£┬« a le rÔö£Ôöñle admin.';



CREATE OR REPLACE FUNCTION "public"."is_authenticated"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT auth.uid() IS NOT NULL;
$$;


ALTER FUNCTION "public"."is_authenticated"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."is_authenticated"() IS 'Retourne TRUE si un JWT Supabase est prÔö£┬«sent dans la requÔö£┬¼te.';



CREATE OR REPLACE FUNCTION "public"."is_client"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.app_user u
    JOIN public.role r ON u.role_id = r.id
    WHERE u.auth_user_id = auth.uid()
      AND r.code = 'client'
  );
$$;


ALTER FUNCTION "public"."is_client"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."is_client"() IS 'Retourne TRUE si l''utilisateur authentifiÔö£┬« a le rÔö£Ôöñle client.';



CREATE OR REPLACE FUNCTION "public"."is_current_user_admin"() RETURNS boolean
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.app_user
    WHERE auth_user_id = auth.uid()
    AND role_id = 1
    AND is_active = TRUE
  );
END;
$$;


ALTER FUNCTION "public"."is_current_user_admin"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."is_current_user_admin"() IS 'VÔö£┬«rifie si l''utilisateur actuel est admin sans accÔö£┬«der au schÔö£┬«ma auth.';



CREATE OR REPLACE FUNCTION "public"."is_ip_blacklisted"("p_ip_address" "inet") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.ip_blacklist 
    WHERE ip_address = p_ip_address
      AND (is_permanent = true 
           OR blocked_until IS NULL 
           OR blocked_until > NOW())
  );
END;
$$;


ALTER FUNCTION "public"."is_ip_blacklisted"("p_ip_address" "inet") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_activity"("p_user_id" integer, "p_action" character varying, "p_entity_type" character varying DEFAULT NULL::character varying, "p_entity_id" integer DEFAULT NULL::integer, "p_details" "jsonb" DEFAULT NULL::"jsonb", "p_ip_address" character varying DEFAULT NULL::character varying) RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  new_id INTEGER;
BEGIN
  INSERT INTO public.activity_log (user_id, action, entity_type, entity_id, details, ip_address)
  VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_details, p_ip_address)
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;


ALTER FUNCTION "public"."log_activity"("p_user_id" integer, "p_action" character varying, "p_entity_type" character varying, "p_entity_id" integer, "p_details" "jsonb", "p_ip_address" character varying) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."log_activity"("p_user_id" integer, "p_action" character varying, "p_entity_type" character varying, "p_entity_id" integer, "p_details" "jsonb", "p_ip_address" character varying) IS 'Enregistre une action utilisateur dans le journal';



CREATE OR REPLACE FUNCTION "public"."log_failed_login_attempt"("user_email" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_user_id BIGINT;
  v_attempts INTEGER;
BEGIN
  -- Trouver l'utilisateur
  SELECT id, failed_login_attempts INTO v_user_id, v_attempts
  FROM public.app_user
  WHERE email = user_email;
  
  IF v_user_id IS NOT NULL THEN
    -- IncrÔö£┬«menter le compteur
    UPDATE public.app_user
    SET 
      failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1,
      account_locked_until = CASE 
        WHEN COALESCE(failed_login_attempts, 0) + 1 >= 5 
        THEN NOW() + INTERVAL '30 minutes'
        ELSE account_locked_until
      END,
      updated_at = NOW()
    WHERE id = v_user_id;
  END IF;
END;
$$;


ALTER FUNCTION "public"."log_failed_login_attempt"("user_email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_pipeline_change"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO pipeline_history (prospect_id, from_status, to_status)
    VALUES (NEW.id, OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."log_pipeline_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_security_event"("p_user_id" integer DEFAULT NULL::integer, "p_auth_user_id" "uuid" DEFAULT NULL::"uuid", "p_event_type" character varying DEFAULT 'login'::character varying, "p_event_status" character varying DEFAULT 'success'::character varying, "p_email" character varying DEFAULT NULL::character varying, "p_ip_address" "inet" DEFAULT NULL::"inet", "p_user_agent" "text" DEFAULT NULL::"text", "p_device_info" "jsonb" DEFAULT '{}'::"jsonb", "p_location_info" "jsonb" DEFAULT '{}'::"jsonb", "p_metadata" "jsonb" DEFAULT '{}'::"jsonb") RETURNS bigint
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_log_id BIGINT;
BEGIN
  INSERT INTO security_logs (
    user_id,
    auth_user_id,
    event_type,
    event_status,
    email,
    ip_address,
    user_agent,
    device_info,
    location_info,
    metadata
  ) VALUES (
    p_user_id,
    p_auth_user_id,
    p_event_type,
    p_event_status,
    p_email,
    p_ip_address,
    p_user_agent,
    p_device_info,
    p_location_info,
    p_metadata
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;


ALTER FUNCTION "public"."log_security_event"("p_user_id" integer, "p_auth_user_id" "uuid", "p_event_type" character varying, "p_event_status" character varying, "p_email" character varying, "p_ip_address" "inet", "p_user_agent" "text", "p_device_info" "jsonb", "p_location_info" "jsonb", "p_metadata" "jsonb") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."log_security_event"("p_user_id" integer, "p_auth_user_id" "uuid", "p_event_type" character varying, "p_event_status" character varying, "p_email" character varying, "p_ip_address" "inet", "p_user_agent" "text", "p_device_info" "jsonb", "p_location_info" "jsonb", "p_metadata" "jsonb") IS 'Function to log security events with metadata';



CREATE OR REPLACE FUNCTION "public"."mark_schedule_as_invoiced"("p_schedule_id" bigint, "p_invoice_id" bigint) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE contract_schedule
  SET 
    status = 'invoiced',
    invoice_id = p_invoice_id,
    updated_at = NOW()
  WHERE id = p_schedule_id;
END;
$$;


ALTER FUNCTION "public"."mark_schedule_as_invoiced"("p_schedule_id" bigint, "p_invoice_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."mark_schedule_as_paid"("p_schedule_id" bigint) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE contract_schedule
  SET 
    status = 'paid',
    updated_at = NOW()
  WHERE id = p_schedule_id;
END;
$$;


ALTER FUNCTION "public"."mark_schedule_as_paid"("p_schedule_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."on_auth_user_created"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."on_auth_user_created"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refresh_accounting_balances"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  REFRESH MATERIALIZED VIEW accounting_account_balance;
  RETURN;
END;
$$;


ALTER FUNCTION "public"."refresh_accounting_balances"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reset_failed_login_attempts"("user_auth_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE public.app_user
  SET 
    failed_login_attempts = 0,
    account_locked_until = NULL,
    updated_at = NOW()
  WHERE auth_user_id = user_auth_id;
END;
$$;


ALTER FUNCTION "public"."reset_failed_login_attempts"("user_auth_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_task_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_task_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_auth_audit_to_security_logs"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_user_id INTEGER;
  v_email TEXT;
  v_event_type VARCHAR(50);
  v_event_status VARCHAR(20);
BEGIN
  -- Map Supabase auth action to our event types
  CASE NEW.action
    WHEN 'login' THEN
      v_event_type := 'login';
      v_event_status := 'success';
    WHEN 'logout' THEN
      v_event_type := 'logout';
      v_event_status := 'success';
    WHEN 'user_signedup' THEN
      v_event_type := 'login';
      v_event_status := 'success';
    WHEN 'token_refreshed' THEN
      -- Skip token refresh events as they're too frequent
      RETURN NEW;
    WHEN 'password_recovery' THEN
      v_event_type := 'password_reset';
      v_event_status := 'info';
    ELSE
      -- For other events, log them as info
      v_event_type := 'login';
      v_event_status := 'info';
  END CASE;

  -- Get user_id from app_user if exists
  SELECT au.id, au.email INTO v_user_id, v_email
  FROM app_user au
  WHERE au.auth_user_id = NEW.user_id;

  -- Insert into security_logs
  INSERT INTO security_logs (
    user_id,
    auth_user_id,
    event_type,
    event_status,
    email,
    ip_address,
    user_agent,
    device_info,
    metadata,
    created_at
  ) VALUES (
    v_user_id,
    NEW.user_id,
    v_event_type,
    v_event_status,
    COALESCE(v_email, NEW.payload->>'email'),
    (NEW.ip_address)::INET,
    NEW.payload->>'user_agent',
    jsonb_build_object(
      'browser', 'Unknown',
      'os', 'Unknown',
      'device', 'Unknown'
    ),
    jsonb_build_object(
      'action', NEW.action,
      'payload', NEW.payload
    ),
    NEW.created_at
  );

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_auth_audit_to_security_logs"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."sync_auth_audit_to_security_logs"() IS 'Syncs Supabase auth.audit_log_entries to security_logs table';



CREATE OR REPLACE FUNCTION "public"."sync_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_account_balance"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- This function will be used for a view or materialized view in production
  -- Placeholder for actual implementation
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_account_balance"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_creative_concept_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_creative_concept_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_editorial_calendar_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_editorial_calendar_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_editorial_post_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_editorial_post_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_kpi_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_kpi_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_persona_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_persona_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_pilier_contenu_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_pilier_contenu_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_pitch_deck_slide_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Compte le nombre de slides dans le JSONB
  NEW.slide_count = COALESCE(jsonb_array_length(NEW.slides), 0);
  NEW.last_edited_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_pitch_deck_slide_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_prospect_last_contact"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE prospects 
  SET last_contact_date = CURRENT_DATE
  WHERE id = NEW.prospect_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_prospect_last_contact"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_input"("p_input" "text", "p_input_type" character varying DEFAULT 'general'::character varying) RETURNS boolean
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
  sql_patterns TEXT[] := ARRAY[
    '(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE)',
    '(--)|(;)|(\/\*)|(xp_)|(sp_)',
    '(OR\s+\d+\s*=\s*\d+)',
    '(AND\s+\d+\s*=\s*\d+)',
    '(EXEC|EXECUTE|CAST|DECLARE)',
    '(SCRIPT|JAVASCRIPT)',
    '(<script|<iframe|javascript:)',
    '(LOAD_FILE|INTO\s+OUTFILE|INTO\s+DUMPFILE)'
  ];
  pattern TEXT;
BEGIN
  -- VÔö£┬«rifier chaque pattern
  FOREACH pattern IN ARRAY sql_patterns
  LOOP
    IF p_input ~* pattern THEN
      -- Logger la tentative
      INSERT INTO public.sql_injection_attempts (
        email,
        payload,
        detected_patterns,
        severity
      ) VALUES (
        p_input_type,
        p_input,
        ARRAY[pattern],
        'high'
      );
      
      RETURN FALSE;
    END IF;
  END LOOP;
  
  RETURN TRUE;
END;
$$;


ALTER FUNCTION "public"."validate_input"("p_input" "text", "p_input_type" character varying) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."validate_input"("p_input" "text", "p_input_type" character varying) IS 'Valide les entrÔö£┬«es pour dÔö£┬«tecter les injections SQL';


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."accounting_account" (
    "id" integer NOT NULL,
    "code" character varying(20) NOT NULL,
    "name" character varying(255) NOT NULL,
    "type" "public"."account_type" NOT NULL,
    "category" "public"."account_category" NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true,
    "parent_id" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."accounting_account" OWNER TO "postgres";


COMMENT ON TABLE "public"."accounting_account" IS 'Chart of accounts for the accounting module';



COMMENT ON COLUMN "public"."accounting_account"."code" IS 'Unique account code (e.g., 1000 for Cash)';



COMMENT ON COLUMN "public"."accounting_account"."type" IS 'Basic account type: asset, liability, equity, revenue, or expense';



COMMENT ON COLUMN "public"."accounting_account"."category" IS 'More specific category of account';



CREATE TABLE IF NOT EXISTS "public"."accounting_journal_entry" (
    "id" integer NOT NULL,
    "entry_number" character varying(50) NOT NULL,
    "entry_date" "date" NOT NULL,
    "period_id" integer,
    "description" "text" NOT NULL,
    "reference_type" character varying(50),
    "reference_id" integer,
    "status" "public"."journal_status" DEFAULT 'draft'::"public"."journal_status" NOT NULL,
    "is_recurring" boolean DEFAULT false,
    "recurring_pattern" character varying(50),
    "recurring_next_date" "date",
    "notes" "text",
    "created_by" character varying(255),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "posted_at" timestamp with time zone,
    "posted_by" character varying(255),
    "validated_at" timestamp with time zone,
    "validated_by" character varying(255)
);


ALTER TABLE "public"."accounting_journal_entry" OWNER TO "postgres";


COMMENT ON TABLE "public"."accounting_journal_entry" IS 'Journal entries for recording financial transactions';



COMMENT ON COLUMN "public"."accounting_journal_entry"."reference_type" IS 'Source document type (invoice, payment, expense, manual)';



COMMENT ON COLUMN "public"."accounting_journal_entry"."reference_id" IS 'ID of source document in its respective table';



CREATE TABLE IF NOT EXISTS "public"."accounting_journal_line" (
    "id" integer NOT NULL,
    "journal_entry_id" integer NOT NULL,
    "account_id" integer NOT NULL,
    "debit" numeric(15,2) DEFAULT 0 NOT NULL,
    "credit" numeric(15,2) DEFAULT 0 NOT NULL,
    "description" "text",
    "line_order" integer DEFAULT 0 NOT NULL,
    "reconciled" boolean DEFAULT false,
    "reconciliation_id" integer,
    "currency" character varying(3) DEFAULT 'CHF'::character varying,
    "exchange_rate" numeric(15,5) DEFAULT 1.0,
    "base_currency_amount" numeric(15,2) GENERATED ALWAYS AS (
CASE
    WHEN ("debit" > (0)::numeric) THEN ("debit" * "exchange_rate")
    ELSE ("credit" * "exchange_rate")
END) STORED,
    "dimension1" character varying(50),
    "dimension2" character varying(50),
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "check_debit_credit" CHECK (((("debit" > (0)::numeric) AND ("credit" = (0)::numeric)) OR (("credit" > (0)::numeric) AND ("debit" = (0)::numeric))))
);


ALTER TABLE "public"."accounting_journal_line" OWNER TO "postgres";


COMMENT ON TABLE "public"."accounting_journal_line" IS 'Individual line items within journal entries';



COMMENT ON COLUMN "public"."accounting_journal_line"."debit" IS 'Debit amount (only one of debit or credit can be non-zero)';



COMMENT ON COLUMN "public"."accounting_journal_line"."credit" IS 'Credit amount (only one of debit or credit can be non-zero)';



CREATE MATERIALIZED VIEW "public"."accounting_account_balance" AS
 SELECT "a"."id",
    "a"."code",
    "a"."name",
    "a"."type",
    "a"."category",
    COALESCE(("sum"("jl"."debit") - "sum"("jl"."credit")), (0)::numeric) AS "balance"
   FROM (("public"."accounting_account" "a"
     LEFT JOIN "public"."accounting_journal_line" "jl" ON (("a"."id" = "jl"."account_id")))
     LEFT JOIN "public"."accounting_journal_entry" "je" ON ((("jl"."journal_entry_id" = "je"."id") AND ("je"."status" = 'posted'::"public"."journal_status"))))
  GROUP BY "a"."id", "a"."code", "a"."name", "a"."type", "a"."category"
  WITH NO DATA;


ALTER MATERIALIZED VIEW "public"."accounting_account_balance" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."accounting_account_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."accounting_account_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."accounting_account_id_seq" OWNED BY "public"."accounting_account"."id";



CREATE TABLE IF NOT EXISTS "public"."accounting_audit_log" (
    "id" integer NOT NULL,
    "action_type" character varying(50) NOT NULL,
    "resource_type" character varying(50) NOT NULL,
    "resource_id" integer NOT NULL,
    "description" "text" NOT NULL,
    "changes" "jsonb",
    "ip_address" character varying(45),
    "user_agent" "text",
    "performed_by" character varying(255),
    "performed_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."accounting_audit_log" OWNER TO "postgres";


COMMENT ON TABLE "public"."accounting_audit_log" IS 'Audit trail for all sensitive accounting operations';



CREATE SEQUENCE IF NOT EXISTS "public"."accounting_audit_log_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."accounting_audit_log_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."accounting_audit_log_id_seq" OWNED BY "public"."accounting_audit_log"."id";



CREATE TABLE IF NOT EXISTS "public"."accounting_document" (
    "id" integer NOT NULL,
    "journal_entry_id" integer NOT NULL,
    "file_name" character varying(255) NOT NULL,
    "file_path" "text" NOT NULL,
    "file_type" character varying(100),
    "file_size" integer,
    "description" "text",
    "uploaded_by" character varying(255),
    "uploaded_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."accounting_document" OWNER TO "postgres";


COMMENT ON TABLE "public"."accounting_document" IS 'Supporting documents and attachments for journal entries';



CREATE SEQUENCE IF NOT EXISTS "public"."accounting_document_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."accounting_document_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."accounting_document_id_seq" OWNED BY "public"."accounting_document"."id";



CREATE TABLE IF NOT EXISTS "public"."accounting_integration_mapping" (
    "id" integer NOT NULL,
    "source_type" character varying(50) NOT NULL,
    "source_id" character varying(50) NOT NULL,
    "account_id" integer NOT NULL,
    "is_debit" boolean NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."accounting_integration_mapping" OWNER TO "postgres";


COMMENT ON TABLE "public"."accounting_integration_mapping" IS 'Maps invoice types, expense categories, etc. to accounting accounts';



CREATE SEQUENCE IF NOT EXISTS "public"."accounting_integration_mapping_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."accounting_integration_mapping_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."accounting_integration_mapping_id_seq" OWNED BY "public"."accounting_integration_mapping"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."accounting_journal_entry_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."accounting_journal_entry_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."accounting_journal_entry_id_seq" OWNED BY "public"."accounting_journal_entry"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."accounting_journal_line_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."accounting_journal_line_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."accounting_journal_line_id_seq" OWNED BY "public"."accounting_journal_line"."id";



CREATE TABLE IF NOT EXISTS "public"."accounting_period" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date" NOT NULL,
    "is_closed" boolean DEFAULT false,
    "closed_at" timestamp with time zone,
    "closed_by" character varying(255),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "period_dates_check" CHECK (("end_date" >= "start_date"))
);


ALTER TABLE "public"."accounting_period" OWNER TO "postgres";


COMMENT ON TABLE "public"."accounting_period" IS 'Accounting periods for reporting and closing operations';



CREATE SEQUENCE IF NOT EXISTS "public"."accounting_period_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."accounting_period_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."accounting_period_id_seq" OWNED BY "public"."accounting_period"."id";



CREATE TABLE IF NOT EXISTS "public"."accounting_reconciliation" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "reconciliation_date" "date" NOT NULL,
    "description" "text",
    "is_complete" boolean DEFAULT false,
    "created_by" character varying(255),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "completed_at" timestamp with time zone
);


ALTER TABLE "public"."accounting_reconciliation" OWNER TO "postgres";


COMMENT ON TABLE "public"."accounting_reconciliation" IS 'Tracks reconciliation of transactions (e.g., matching invoices with payments)';



CREATE SEQUENCE IF NOT EXISTS "public"."accounting_reconciliation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."accounting_reconciliation_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."accounting_reconciliation_id_seq" OWNED BY "public"."accounting_reconciliation"."id";



CREATE TABLE IF NOT EXISTS "public"."accounting_recurring_template" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "frequency" character varying(20) NOT NULL,
    "day_of_month" integer,
    "month_of_year" integer,
    "next_run_date" "date" NOT NULL,
    "is_active" boolean DEFAULT true,
    "auto_post" boolean DEFAULT false,
    "template_data" "jsonb" NOT NULL,
    "created_by" character varying(255),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "accounting_recurring_template_day_of_month_check" CHECK ((("day_of_month" >= 1) AND ("day_of_month" <= 31))),
    CONSTRAINT "accounting_recurring_template_month_of_year_check" CHECK ((("month_of_year" >= 1) AND ("month_of_year" <= 12)))
);


ALTER TABLE "public"."accounting_recurring_template" OWNER TO "postgres";


COMMENT ON TABLE "public"."accounting_recurring_template" IS 'Templates for automatically generating recurring journal entries';



CREATE SEQUENCE IF NOT EXISTS "public"."accounting_recurring_template_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."accounting_recurring_template_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."accounting_recurring_template_id_seq" OWNED BY "public"."accounting_recurring_template"."id";



CREATE TABLE IF NOT EXISTS "public"."accounting_settings" (
    "id" integer NOT NULL,
    "default_currency" character varying(3) DEFAULT 'CHF'::character varying,
    "enable_multi_currency" boolean DEFAULT false,
    "fiscal_year_start_month" integer DEFAULT 1,
    "lock_days_after_period_close" integer DEFAULT 7,
    "require_validation" boolean DEFAULT true,
    "default_bank_account_id" integer,
    "default_sales_account_id" integer,
    "default_purchase_account_id" integer,
    "default_tax_account_id" integer,
    "default_receivable_account_id" integer,
    "default_payable_account_id" integer,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" character varying(255),
    CONSTRAINT "accounting_settings_fiscal_year_start_month_check" CHECK ((("fiscal_year_start_month" >= 1) AND ("fiscal_year_start_month" <= 12))),
    CONSTRAINT "accounting_settings_lock_days_after_period_close_check" CHECK (("lock_days_after_period_close" >= 0))
);


ALTER TABLE "public"."accounting_settings" OWNER TO "postgres";


COMMENT ON TABLE "public"."accounting_settings" IS 'Global settings for the accounting module';



CREATE SEQUENCE IF NOT EXISTS "public"."accounting_settings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."accounting_settings_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."accounting_settings_id_seq" OWNED BY "public"."accounting_settings"."id";



CREATE TABLE IF NOT EXISTS "public"."accounting_tax_rate" (
    "id" integer NOT NULL,
    "code" character varying(20) NOT NULL,
    "name" character varying(100) NOT NULL,
    "rate" numeric(5,2) NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true,
    "account_id" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."accounting_tax_rate" OWNER TO "postgres";


COMMENT ON TABLE "public"."accounting_tax_rate" IS 'VAT and other tax rates with associated liability accounts';



CREATE SEQUENCE IF NOT EXISTS "public"."accounting_tax_rate_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."accounting_tax_rate_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."accounting_tax_rate_id_seq" OWNED BY "public"."accounting_tax_rate"."id";



CREATE TABLE IF NOT EXISTS "public"."activities" (
    "id" integer NOT NULL,
    "prospect_id" integer,
    "contact_id" integer,
    "type" "public"."activity_type" NOT NULL,
    "subject" character varying(255) NOT NULL,
    "description" "text",
    "status" "public"."activity_status" DEFAULT 'planned'::"public"."activity_status",
    "priority" "public"."priority_level" DEFAULT 'medium'::"public"."priority_level",
    "due_date" timestamp with time zone,
    "completed_date" timestamp with time zone,
    "assigned_to" integer,
    "reminder_date" timestamp with time zone,
    "reminder_sent" boolean DEFAULT false,
    "outcome" "text",
    "next_action" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."activities" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."activities" OWNER TO "postgres";


COMMENT ON TABLE "public"."activities" IS 'ActivitÔö£┬«s commerciales: calls, emails, tasks';



CREATE SEQUENCE IF NOT EXISTS "public"."activities_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."activities_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."activities_id_seq" OWNED BY "public"."activities"."id";



CREATE TABLE IF NOT EXISTS "public"."activity_log" (
    "id" integer NOT NULL,
    "user_id" integer,
    "action" character varying(100) NOT NULL,
    "entity_type" character varying(50),
    "entity_id" integer,
    "details" "jsonb",
    "ip_address" character varying(45),
    "created_at" timestamp without time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."activity_log" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."activity_log" OWNER TO "postgres";


COMMENT ON TABLE "public"."activity_log" IS 'Journal de toutes les actions des utilisateurs';



COMMENT ON COLUMN "public"."activity_log"."action" IS 'Type d''action: login, logout, view, create, update, delete';



COMMENT ON COLUMN "public"."activity_log"."entity_type" IS 'Type d''entitÔö£┬«: strategy, invoice, mandat, etc.';



CREATE SEQUENCE IF NOT EXISTS "public"."activity_log_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."activity_log_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."activity_log_id_seq" OWNED BY "public"."activity_log"."id";



CREATE TABLE IF NOT EXISTS "public"."app_user" (
    "id" integer NOT NULL,
    "email" character varying(255) NOT NULL,
    "password_hash" character varying(255),
    "role_id" integer NOT NULL,
    "client_id" bigint,
    "is_active" boolean DEFAULT true,
    "last_login" timestamp without time zone,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "auth_user_id" "uuid",
    "must_reset_password" boolean DEFAULT false,
    "security_alert" "text",
    "last_password_change" timestamp with time zone,
    "failed_login_attempts" integer DEFAULT 0,
    "account_locked_until" timestamp with time zone
);

ALTER TABLE ONLY "public"."app_user" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."app_user" OWNER TO "postgres";


COMMENT ON TABLE "public"."app_user" IS 'Utilisateurs de l''application';



COMMENT ON COLUMN "public"."app_user"."role_id" IS 'RÔö£┬«fÔö£┬«rence vers la table role';



COMMENT ON COLUMN "public"."app_user"."client_id" IS 'RÔö£┬«fÔö£┬«rence vers client (NULL pour admin/staff)';



COMMENT ON COLUMN "public"."app_user"."auth_user_id" IS 'UUID du user Supabase Auth (auth.users.id). NULL = user legacy non migrÔö£┬«.';



CREATE SEQUENCE IF NOT EXISTS "public"."app_user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."app_user_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."app_user_id_seq" OWNED BY "public"."app_user"."id";



CREATE TABLE IF NOT EXISTS "public"."audit_log" (
    "id" bigint NOT NULL,
    "user_id" bigint NOT NULL,
    "action" "text" NOT NULL,
    "details" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."audit_log" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."audit_log" OWNER TO "postgres";


ALTER TABLE "public"."audit_log" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."audit_log_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."auth_users_audit" (
    "id" bigint NOT NULL,
    "user_id" "uuid",
    "action" character varying(10),
    "old_data" "jsonb",
    "new_data" "jsonb",
    "changed_by" character varying(255),
    "changed_at" timestamp with time zone DEFAULT "now"(),
    "ip_address" "inet"
);


ALTER TABLE "public"."auth_users_audit" OWNER TO "postgres";


COMMENT ON TABLE "public"."auth_users_audit" IS 'Audit trail pour toutes les modifications sur auth.users';



CREATE SEQUENCE IF NOT EXISTS "public"."auth_users_audit_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."auth_users_audit_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."auth_users_audit_id_seq" OWNED BY "public"."auth_users_audit"."id";



CREATE TABLE IF NOT EXISTS "public"."client" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "type" "public"."client_type" NOT NULL,
    "status" "public"."client_status" DEFAULT 'potentiel'::"public"."client_status" NOT NULL,
    "email" "text",
    "phone" "text",
    "company_name" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "address" "text",
    "zip_code" "text",
    "locality" "text",
    "represented_by" "text"
);

ALTER TABLE ONLY "public"."client" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."client" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."client_contract" (
    "id" bigint NOT NULL,
    "client_id" bigint NOT NULL,
    "mandat_id" bigint,
    "contract_name" character varying(255) NOT NULL,
    "description" "text",
    "monthly_amount" numeric(10,2) NOT NULL,
    "setup_fee" numeric(10,2) DEFAULT 0,
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "duration_months" integer,
    "billing_cycle" character varying(20) DEFAULT 'monthly'::character varying NOT NULL,
    "invoice_day" integer DEFAULT 1 NOT NULL,
    "payment_terms_days" integer DEFAULT 30,
    "auto_generate_invoices" boolean DEFAULT true,
    "auto_send_invoices" boolean DEFAULT false,
    "status" character varying(20) DEFAULT 'draft'::character varying NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid",
    CONSTRAINT "client_contract_billing_cycle_check" CHECK ((("billing_cycle")::"text" = ANY (ARRAY[('monthly'::character varying)::"text", ('quarterly'::character varying)::"text", ('semi_annual'::character varying)::"text", ('annual'::character varying)::"text", ('one_time'::character varying)::"text"]))),
    CONSTRAINT "client_contract_invoice_day_check" CHECK ((("invoice_day" >= 1) AND ("invoice_day" <= 31))),
    CONSTRAINT "client_contract_monthly_amount_check" CHECK (("monthly_amount" >= (0)::numeric)),
    CONSTRAINT "client_contract_payment_terms_days_check" CHECK (("payment_terms_days" >= 0)),
    CONSTRAINT "client_contract_setup_fee_check" CHECK (("setup_fee" >= (0)::numeric)),
    CONSTRAINT "client_contract_status_check" CHECK ((("status")::"text" = ANY (ARRAY[('draft'::character varying)::"text", ('active'::character varying)::"text", ('suspended'::character varying)::"text", ('completed'::character varying)::"text", ('cancelled'::character varying)::"text"]))),
    CONSTRAINT "has_duration" CHECK ((("end_date" IS NOT NULL) OR ("duration_months" IS NOT NULL) OR (("billing_cycle")::"text" = 'one_time'::"text"))),
    CONSTRAINT "valid_date_range" CHECK ((("end_date" IS NULL) OR ("end_date" > "start_date")))
);


ALTER TABLE "public"."client_contract" OWNER TO "postgres";


COMMENT ON TABLE "public"."client_contract" IS 'Contrats virtuels dÔö£┬«finissant les montants attendus et la pÔö£┬«riode contractuelle';



COMMENT ON COLUMN "public"."client_contract"."billing_cycle" IS 'FrÔö£┬«quence de facturation: monthly, quarterly, semi_annual, annual, one_time';



COMMENT ON COLUMN "public"."client_contract"."invoice_day" IS 'Jour du mois pour Ôö£┬«mettre la facture (1-31, ajustÔö£┬« pour mois courts)';



COMMENT ON COLUMN "public"."client_contract"."auto_generate_invoices" IS 'GÔö£┬«nÔö£┬«ration automatique des factures via cron job';



CREATE SEQUENCE IF NOT EXISTS "public"."client_contract_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."client_contract_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."client_contract_id_seq" OWNED BY "public"."client_contract"."id";



ALTER TABLE "public"."client" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."client_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."client_package" (
    "id" integer NOT NULL,
    "client_id" integer NOT NULL,
    "package_id" integer NOT NULL,
    "purchased_at" timestamp with time zone DEFAULT "now"(),
    "purchased_price" numeric(10,2) NOT NULL,
    "start_date" "date",
    "end_date" "date",
    "renewal_date" "date",
    "is_recurring" boolean DEFAULT false,
    "auto_renew" boolean DEFAULT false,
    "status" character varying(50) DEFAULT 'active'::character varying,
    "mandat_id" integer,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" integer,
    CONSTRAINT "valid_package_status" CHECK ((("status")::"text" = ANY (ARRAY[('active'::character varying)::"text", ('completed'::character varying)::"text", ('cancelled'::character varying)::"text", ('expired'::character varying)::"text", ('paused'::character varying)::"text"])))
);


ALTER TABLE "public"."client_package" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."client_package_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."client_package_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."client_package_id_seq" OWNED BY "public"."client_package"."id";



CREATE TABLE IF NOT EXISTS "public"."company_settings" (
    "id" bigint NOT NULL,
    "agency_name" "text" NOT NULL,
    "address" "text",
    "zip_code" "text",
    "city" "text",
    "country" "text",
    "phone" "text",
    "email" "text",
    "tva_number" "text",
    "represented_by" "text",
    "iban" "text",
    "qr_iban" "text"
);

ALTER TABLE ONLY "public"."company_settings" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."company_settings" OWNER TO "postgres";


ALTER TABLE "public"."company_settings" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."company_settings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."contacts" (
    "id" integer NOT NULL,
    "prospect_id" integer NOT NULL,
    "first_name" character varying(100) NOT NULL,
    "last_name" character varying(100) NOT NULL,
    "role" character varying(100),
    "department" character varying(100),
    "email" character varying(255),
    "phone" character varying(50),
    "mobile" character varying(50),
    "linkedin_url" character varying(255),
    "is_primary" boolean DEFAULT false,
    "is_decision_maker" boolean DEFAULT false,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."contacts" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."contacts" OWNER TO "postgres";


COMMENT ON TABLE "public"."contacts" IS 'Contacts associÔö£┬«s aux prospects';



CREATE SEQUENCE IF NOT EXISTS "public"."contacts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."contacts_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."contacts_id_seq" OWNED BY "public"."contacts"."id";



CREATE TABLE IF NOT EXISTS "public"."contract_schedule" (
    "id" bigint NOT NULL,
    "contract_id" bigint NOT NULL,
    "period_start_date" "date" NOT NULL,
    "period_end_date" "date" NOT NULL,
    "expected_issue_date" "date" NOT NULL,
    "expected_due_date" "date",
    "expected_amount" numeric(10,2) NOT NULL,
    "status" character varying(20) DEFAULT 'planned'::character varying NOT NULL,
    "invoice_id" bigint,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "contract_schedule_expected_amount_check" CHECK (("expected_amount" >= (0)::numeric)),
    CONSTRAINT "contract_schedule_status_check" CHECK ((("status")::"text" = ANY (ARRAY[('planned'::character varying)::"text", ('invoiced'::character varying)::"text", ('paid'::character varying)::"text", ('cancelled'::character varying)::"text", ('skipped'::character varying)::"text"]))),
    CONSTRAINT "invoiced_has_invoice" CHECK ((((("status")::"text" = 'invoiced'::"text") AND ("invoice_id" IS NOT NULL)) OR (("status")::"text" <> 'invoiced'::"text"))),
    CONSTRAINT "valid_issue_date" CHECK (("expected_issue_date" >= "period_start_date")),
    CONSTRAINT "valid_period" CHECK (("period_end_date" >= "period_start_date"))
);


ALTER TABLE "public"."contract_schedule" OWNER TO "postgres";


COMMENT ON TABLE "public"."contract_schedule" IS 'Ôö£├½chÔö£┬«ances planifiÔö£┬«es pour chaque contrat (Expected Revenue)';



COMMENT ON COLUMN "public"."contract_schedule"."expected_issue_date" IS 'Date prÔö£┬«vue d''Ôö£┬«mission de la facture (utilisÔö£┬«e par le billing engine)';



COMMENT ON COLUMN "public"."contract_schedule"."status" IS 'planned: Ôö£├í facturer, invoiced: facture Ôö£┬«mise, paid: payÔö£┬«e, cancelled: annulÔö£┬«e, skipped: sautÔö£┬«e';



CREATE SEQUENCE IF NOT EXISTS "public"."contract_schedule_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."contract_schedule_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."contract_schedule_id_seq" OWNED BY "public"."contract_schedule"."id";



CREATE TABLE IF NOT EXISTS "public"."contrat" (
    "id" bigint NOT NULL,
    "client_id" bigint NOT NULL,
    "mandat_id" bigint,
    "contrat_number" "text" NOT NULL,
    "file_path" "text" NOT NULL,
    "signed_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."contrat" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."contrat" OWNER TO "postgres";


ALTER TABLE "public"."contrat" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."contrat_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."creative_concept" (
    "id" bigint NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "category" character varying(100),
    "client_id" bigint,
    "mandat_id" bigint,
    "status" character varying(50) DEFAULT 'draft'::character varying,
    "concept_details" "jsonb" DEFAULT '{}'::"jsonb",
    "media_urls" "text"[],
    "tags" "text"[],
    "proposed_by" bigint,
    "proposed_at" timestamp with time zone,
    "reviewed_by" bigint,
    "reviewed_at" timestamp with time zone,
    "review_notes" "text",
    "priority" character varying(20) DEFAULT 'medium'::character varying,
    "estimated_duration" integer,
    "deadline" "date",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "type" character varying(20) DEFAULT 'post'::character varying,
    "goal" "text",
    "rejection_reason" "text",
    CONSTRAINT "creative_concept_priority_check" CHECK ((("priority")::"text" = ANY (ARRAY[('low'::character varying)::"text", ('medium'::character varying)::"text", ('high'::character varying)::"text", ('urgent'::character varying)::"text"]))),
    CONSTRAINT "creative_concept_status_check" CHECK ((("status")::"text" = ANY (ARRAY[('draft'::character varying)::"text", ('proposed'::character varying)::"text", ('approved'::character varying)::"text", ('rejected'::character varying)::"text"]))),
    CONSTRAINT "creative_concept_type_check" CHECK ((("type")::"text" = ANY (ARRAY[('reel'::character varying)::"text", ('post'::character varying)::"text"])))
);


ALTER TABLE "public"."creative_concept" OWNER TO "postgres";


COMMENT ON TABLE "public"."creative_concept" IS 'Table pour stocker les concepts crÔö£┬«atifs proposÔö£┬«s aux clients';



COMMENT ON COLUMN "public"."creative_concept"."title" IS 'Titre du concept crÔö£┬«atif';



COMMENT ON COLUMN "public"."creative_concept"."description" IS 'Description dÔö£┬«taillÔö£┬«e du concept';



COMMENT ON COLUMN "public"."creative_concept"."category" IS 'CatÔö£┬«gorie du concept (ex: campagne, vidÔö£┬«o, design, stratÔö£┬«gie)';



COMMENT ON COLUMN "public"."creative_concept"."status" IS 'Statut du concept (draft, proposed, approved, rejected, in_progress, completed)';



COMMENT ON COLUMN "public"."creative_concept"."concept_details" IS 'DÔö£┬«tails additionnels du concept en JSON';



COMMENT ON COLUMN "public"."creative_concept"."media_urls" IS 'URLs des mÔö£┬«dias associÔö£┬«s (images, vidÔö£┬«os, maquettes)';



COMMENT ON COLUMN "public"."creative_concept"."tags" IS 'Tags pour catÔö£┬«goriser le concept';



COMMENT ON COLUMN "public"."creative_concept"."priority" IS 'PrioritÔö£┬« du concept (low, medium, high, urgent)';



COMMENT ON COLUMN "public"."creative_concept"."estimated_duration" IS 'DurÔö£┬«e estimÔö£┬«e en jours';



CREATE SEQUENCE IF NOT EXISTS "public"."creative_concept_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."creative_concept_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."creative_concept_id_seq" OWNED BY "public"."creative_concept"."id";



CREATE TABLE IF NOT EXISTS "public"."editorial_calendar" (
    "id" integer NOT NULL,
    "strategy_id" integer NOT NULL,
    "name" character varying(255),
    "description" "text",
    "start_date" "date",
    "end_date" "date",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."editorial_calendar" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."editorial_calendar" OWNER TO "postgres";


COMMENT ON TABLE "public"."editorial_calendar" IS 'Calendrier Ôö£┬«ditorial associÔö£┬« Ôö£├í une stratÔö£┬«gie social media';



COMMENT ON COLUMN "public"."editorial_calendar"."strategy_id" IS 'ID de la stratÔö£┬«gie Ôö£├í laquelle appartient ce calendrier (relation 1-to-1)';



CREATE SEQUENCE IF NOT EXISTS "public"."editorial_calendar_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."editorial_calendar_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."editorial_calendar_id_seq" OWNED BY "public"."editorial_calendar"."id";



CREATE TABLE IF NOT EXISTS "public"."editorial_post" (
    "id" integer NOT NULL,
    "calendar_id" integer NOT NULL,
    "publication_date" "date" NOT NULL,
    "platform" character varying(50) NOT NULL,
    "content_type" character varying(100),
    "title" character varying(255) NOT NULL,
    "description" "text",
    "caption" "text",
    "hashtags" "text"[],
    "mentions" "text"[],
    "media_urls" "text"[],
    "status" character varying(20) DEFAULT 'draft'::character varying,
    "scheduled_time" time without time zone,
    "published_at" timestamp without time zone,
    "likes" integer DEFAULT 0,
    "comments" integer DEFAULT 0,
    "shares" integer DEFAULT 0,
    "views" integer DEFAULT 0,
    "reach" integer DEFAULT 0,
    "engagement_rate" numeric(5,2),
    "notes" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "created_by" character varying(255),
    "pilier_id" integer,
    CONSTRAINT "editorial_post_status_check" CHECK ((("status")::"text" = ANY (ARRAY[('draft'::character varying)::"text", ('scheduled'::character varying)::"text", ('published'::character varying)::"text", ('cancelled'::character varying)::"text"])))
);

ALTER TABLE ONLY "public"."editorial_post" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."editorial_post" OWNER TO "postgres";


COMMENT ON TABLE "public"."editorial_post" IS 'Posts planifiÔö£┬«s dans le calendrier Ôö£┬«ditorial';



COMMENT ON COLUMN "public"."editorial_post"."calendar_id" IS 'ID du calendrier Ôö£┬«ditorial auquel appartient ce post';



COMMENT ON COLUMN "public"."editorial_post"."platform" IS 'Plateforme de publication (Instagram, Facebook, LinkedIn, TikTok, Twitter, YouTube)';



COMMENT ON COLUMN "public"."editorial_post"."content_type" IS 'Type de contenu (Reel, Carrousel, Story, Post, Article, Video, etc.)';



COMMENT ON COLUMN "public"."editorial_post"."status" IS 'Statut du post: draft (brouillon), scheduled (programmÔö£┬«), published (publiÔö£┬«), cancelled (annulÔö£┬«)';



COMMENT ON COLUMN "public"."editorial_post"."pilier_id" IS 'Pilier de contenu associÔö£┬« Ôö£├í ce post';



CREATE SEQUENCE IF NOT EXISTS "public"."editorial_post_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."editorial_post_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."editorial_post_id_seq" OWNED BY "public"."editorial_post"."id";



CREATE TABLE IF NOT EXISTS "public"."expense" (
    "id" bigint NOT NULL,
    "type" "public"."expense_type" NOT NULL,
    "mandat_id" bigint,
    "client_id" bigint,
    "category_id" bigint,
    "label" "text" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "date" "date" NOT NULL,
    "is_recurring" "public"."recurrence_type" DEFAULT 'oneshot'::"public"."recurrence_type" NOT NULL,
    "notes" "text",
    "receipt_path" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."expense" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."expense" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."expense_category" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "is_recurring" boolean DEFAULT false NOT NULL
);

ALTER TABLE ONLY "public"."expense_category" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."expense_category" OWNER TO "postgres";


ALTER TABLE "public"."expense_category" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."expense_category_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."expense" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."expense_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."invoice" (
    "id" bigint NOT NULL,
    "client_id" bigint NOT NULL,
    "mandat_id" bigint,
    "invoice_number" "text" NOT NULL,
    "issue_date" "date" NOT NULL,
    "due_date" "date",
    "total_ht" numeric(10,2) DEFAULT 0 NOT NULL,
    "total_tva" numeric(10,2) DEFAULT 0 NOT NULL,
    "total_ttc" numeric(10,2) DEFAULT 0 NOT NULL,
    "status" "public"."invoice_status" DEFAULT 'brouillon'::"public"."invoice_status" NOT NULL,
    "pdf_path" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "is_recurring" "public"."invoice_recurrence" DEFAULT 'oneshot'::"public"."invoice_recurrence" NOT NULL,
    "recurrence_day" integer,
    "parent_invoice_id" bigint,
    "next_generation_date" "date",
    "auto_send" boolean DEFAULT false NOT NULL,
    "payment_date" "date",
    "end_date" "date",
    "max_occurrences" integer,
    "occurrences_count" integer DEFAULT 0,
    "source_contract_id" bigint,
    "source_schedule_id" bigint,
    CONSTRAINT "invoice_recurrence_day_check" CHECK ((("recurrence_day" >= 1) AND ("recurrence_day" <= 31)))
);

ALTER TABLE ONLY "public"."invoice" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."invoice" OWNER TO "postgres";


COMMENT ON COLUMN "public"."invoice"."is_recurring" IS 'Type de rÔö£┬«currence: oneshot (unique), mensuel, trimestriel, annuel';



COMMENT ON COLUMN "public"."invoice"."recurrence_day" IS 'Jour du mois (1-31) pour la gÔö£┬«nÔö£┬«ration automatique';



COMMENT ON COLUMN "public"."invoice"."parent_invoice_id" IS 'RÔö£┬«fÔö£┬«rence Ôö£├í la facture modÔö£┬┐le si cette facture a Ôö£┬«tÔö£┬« gÔö£┬«nÔö£┬«rÔö£┬«e automatiquement';



COMMENT ON COLUMN "public"."invoice"."next_generation_date" IS 'Prochaine date de gÔö£┬«nÔö£┬«ration automatique pour les factures rÔö£┬«currentes';



COMMENT ON COLUMN "public"."invoice"."auto_send" IS 'Envoi automatique lors de la gÔö£┬«nÔö£┬«ration (passe directement en statut envoyee)';



COMMENT ON COLUMN "public"."invoice"."payment_date" IS 'Date de paiement effectif de la facture. UtilisÔö£┬«e pour calculer le CA rÔö£┬«el du mois. NULL si non payÔö£┬«e.';



COMMENT ON COLUMN "public"."invoice"."end_date" IS 'Date de fin de la rÔö£┬«currence (optionnel). NULL = illimitÔö£┬«.';



ALTER TABLE "public"."invoice" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."invoice_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."invoice_item" (
    "id" bigint NOT NULL,
    "invoice_id" bigint NOT NULL,
    "description" "text" NOT NULL,
    "quantity" numeric(10,2) DEFAULT 1 NOT NULL,
    "unit_price" numeric(10,2) DEFAULT 0 NOT NULL,
    "total" numeric(10,2) DEFAULT 0 NOT NULL
);

ALTER TABLE ONLY "public"."invoice_item" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."invoice_item" OWNER TO "postgres";


ALTER TABLE "public"."invoice_item" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."invoice_item_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."ip_blacklist" (
    "id" bigint NOT NULL,
    "ip_address" "inet" NOT NULL,
    "reason" "text" NOT NULL,
    "blocked_at" timestamp with time zone DEFAULT "now"(),
    "blocked_until" timestamp with time zone,
    "created_by" character varying(255),
    "is_permanent" boolean DEFAULT false
);


ALTER TABLE "public"."ip_blacklist" OWNER TO "postgres";


COMMENT ON TABLE "public"."ip_blacklist" IS 'Table de blocage des IPs malveillantes suite Ôö£├í l''attaque SQL injection';



CREATE SEQUENCE IF NOT EXISTS "public"."ip_blacklist_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."ip_blacklist_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."ip_blacklist_id_seq" OWNED BY "public"."ip_blacklist"."id";



CREATE TABLE IF NOT EXISTS "public"."kpi" (
    "id" integer NOT NULL,
    "strategy_id" integer NOT NULL,
    "nom" character varying(255) NOT NULL,
    "objectif" "text",
    "valeur_cible" numeric(10,2),
    "unite" character varying(50),
    "periodicite" character varying(50),
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."kpi" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."kpi" OWNER TO "postgres";


COMMENT ON TABLE "public"."kpi" IS 'KPIs (Indicateurs de Performance) des stratÔö£┬«gies social media';



COMMENT ON COLUMN "public"."kpi"."nom" IS 'Nom du KPI (ex: Followers Instagram, Taux d''engagement)';



COMMENT ON COLUMN "public"."kpi"."valeur_cible" IS 'Valeur cible Ôö£├í atteindre';



COMMENT ON COLUMN "public"."kpi"."unite" IS 'UnitÔö£┬« de mesure (followers, %, CHF, etc.)';



COMMENT ON COLUMN "public"."kpi"."periodicite" IS 'PÔö£┬«riodicitÔö£┬« de mesure (mensuel, hebdomadaire, annuel)';



CREATE SEQUENCE IF NOT EXISTS "public"."kpi_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."kpi_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."kpi_id_seq" OWNED BY "public"."kpi"."id";



CREATE TABLE IF NOT EXISTS "public"."kpi_mesure" (
    "id" integer NOT NULL,
    "kpi_id" integer NOT NULL,
    "date" "date" NOT NULL,
    "valeur_mesuree" numeric(10,2) NOT NULL,
    "commentaire" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."kpi_mesure" OWNER TO "postgres";


COMMENT ON TABLE "public"."kpi_mesure" IS 'Mesures historiques des KPIs';



COMMENT ON COLUMN "public"."kpi_mesure"."valeur_mesuree" IS 'Valeur mesurÔö£┬«e Ôö£├í cette date';



COMMENT ON COLUMN "public"."kpi_mesure"."commentaire" IS 'Commentaire ou note sur cette mesure';



CREATE SEQUENCE IF NOT EXISTS "public"."kpi_mesure_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."kpi_mesure_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."kpi_mesure_id_seq" OWNED BY "public"."kpi_mesure"."id";



CREATE TABLE IF NOT EXISTS "public"."login_attempts" (
    "id" bigint NOT NULL,
    "email" character varying(255) NOT NULL,
    "ip_address" "inet",
    "attempt_status" character varying(20) NOT NULL,
    "attempt_count" integer DEFAULT 1,
    "last_attempt_at" timestamp with time zone DEFAULT "now"(),
    "locked_until" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "valid_attempt_status" CHECK ((("attempt_status")::"text" = ANY (ARRAY[('success'::character varying)::"text", ('failed'::character varying)::"text", ('locked'::character varying)::"text"])))
);


ALTER TABLE "public"."login_attempts" OWNER TO "postgres";


COMMENT ON TABLE "public"."login_attempts" IS 'Tracks login attempts and potential brute force attacks';



CREATE SEQUENCE IF NOT EXISTS "public"."login_attempts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."login_attempts_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."login_attempts_id_seq" OWNED BY "public"."login_attempts"."id";



CREATE TABLE IF NOT EXISTS "public"."mandat" (
    "id" bigint NOT NULL,
    "client_id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "status" "public"."mandat_status" DEFAULT 'en_cours'::"public"."mandat_status" NOT NULL,
    "start_date" "date",
    "end_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "mandat_type" "text" DEFAULT 'standard'::"text"
);

ALTER TABLE ONLY "public"."mandat" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."mandat" OWNER TO "postgres";


ALTER TABLE "public"."mandat" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."mandat_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."mandat_task" (
    "id" bigint NOT NULL,
    "mandat_id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "details" "text",
    "type" "public"."task_type" DEFAULT 'autre'::"public"."task_type" NOT NULL,
    "status" "public"."task_status" DEFAULT 'a_faire'::"public"."task_status" NOT NULL,
    "due_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."mandat_task" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."mandat_task" OWNER TO "postgres";


ALTER TABLE "public"."mandat_task" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."mandat_task_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."meeting_minutes" (
    "id" integer NOT NULL,
    "meeting_id" integer,
    "prospect_id" integer,
    "meeting_date" timestamp with time zone NOT NULL,
    "title" character varying(255) NOT NULL,
    "participants" "jsonb",
    "context" "text",
    "agenda" "text",
    "discussion_points" "text",
    "decisions" "text",
    "action_items" "jsonb",
    "next_meeting_date" timestamp with time zone,
    "next_meeting_notes" "text",
    "attachments" "jsonb",
    "is_approved" boolean DEFAULT false,
    "approved_by" integer,
    "approved_at" timestamp with time zone,
    "pdf_url" character varying(500),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."meeting_minutes" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."meeting_minutes" OWNER TO "postgres";


COMMENT ON TABLE "public"."meeting_minutes" IS 'ProcÔö£┬┐s-verbaux de rÔö£┬«unions structurÔö£┬«s';



CREATE SEQUENCE IF NOT EXISTS "public"."meeting_minutes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."meeting_minutes_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."meeting_minutes_id_seq" OWNED BY "public"."meeting_minutes"."id";



CREATE TABLE IF NOT EXISTS "public"."meetings" (
    "id" integer NOT NULL,
    "prospect_id" integer,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "location" character varying(255),
    "meeting_url" character varying(500),
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone NOT NULL,
    "timezone" character varying(50) DEFAULT 'Europe/Zurich'::character varying,
    "organizer_id" integer,
    "attendees_internal" integer[],
    "attendees_external" "jsonb",
    "status" character varying(50) DEFAULT 'scheduled'::character varying,
    "is_cancelled" boolean DEFAULT false,
    "cancellation_reason" "text",
    "ics_uid" character varying(255),
    "calendar_event_id" character varying(255),
    "agenda" "text",
    "preparation_notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."meetings" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."meetings" OWNER TO "postgres";


COMMENT ON TABLE "public"."meetings" IS 'Rendez-vous commerciaux et calendrier';



CREATE SEQUENCE IF NOT EXISTS "public"."meetings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."meetings_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."meetings_id_seq" OWNED BY "public"."meetings"."id";



CREATE TABLE IF NOT EXISTS "public"."package_feature" (
    "id" integer NOT NULL,
    "package_id" integer NOT NULL,
    "title" character varying(200) NOT NULL,
    "description" "text",
    "icon" character varying(50),
    "is_highlighted" boolean DEFAULT false,
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."package_feature" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."package_feature_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."package_feature_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."package_feature_id_seq" OWNED BY "public"."package_feature"."id";



CREATE TABLE IF NOT EXISTS "public"."package_invoice_template" (
    "id" integer NOT NULL,
    "package_id" integer NOT NULL,
    "line_item_description" character varying(500),
    "unit_price" numeric(10,2),
    "quantity" integer DEFAULT 1,
    "payment_terms_days" integer DEFAULT 30,
    "payment_schedule" character varying(50) DEFAULT 'upfront'::character varying,
    "deposit_percentage" numeric(5,2),
    "invoice_notes" "text",
    "payment_instructions" "text",
    "is_taxable" boolean DEFAULT true,
    "tax_rate" numeric(5,2) DEFAULT 7.70,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "valid_payment_schedule" CHECK ((("payment_schedule")::"text" = ANY (ARRAY[('upfront'::character varying)::"text", ('milestone'::character varying)::"text", ('monthly'::character varying)::"text", ('quarterly'::character varying)::"text", ('on_delivery'::character varying)::"text"])))
);


ALTER TABLE "public"."package_invoice_template" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."package_invoice_template_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."package_invoice_template_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."package_invoice_template_id_seq" OWNED BY "public"."package_invoice_template"."id";



CREATE TABLE IF NOT EXISTS "public"."package_mandat_template" (
    "id" integer NOT NULL,
    "package_id" integer NOT NULL,
    "title_template" character varying(200),
    "description_template" "text",
    "objectives" "text",
    "deliverables" "text",
    "timeline_description" "text",
    "default_duration_days" integer,
    "default_status" character varying(50) DEFAULT 'draft'::character varying,
    "contract_clauses" "jsonb",
    "terms_and_conditions" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."package_mandat_template" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."package_mandat_template_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."package_mandat_template_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."package_mandat_template_id_seq" OWNED BY "public"."package_mandat_template"."id";



CREATE TABLE IF NOT EXISTS "public"."package_task_template" (
    "id" integer NOT NULL,
    "package_id" integer NOT NULL,
    "title" character varying(200) NOT NULL,
    "description" "text",
    "type" character varying(50) DEFAULT 'production'::character varying NOT NULL,
    "status" character varying(50) DEFAULT 'todo'::character varying,
    "days_after_start" integer DEFAULT 0,
    "estimated_hours" numeric(5,2),
    "due_date_offset" integer,
    "assigned_to_role" character varying(50),
    "priority" integer DEFAULT 1,
    "display_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "valid_task_status" CHECK ((("status")::"text" = ANY (ARRAY[('todo'::character varying)::"text", ('in_progress'::character varying)::"text", ('done'::character varying)::"text", ('blocked'::character varying)::"text", ('cancelled'::character varying)::"text"]))),
    CONSTRAINT "valid_task_type" CHECK ((("type")::"text" = ANY (ARRAY[('production'::character varying)::"text", ('admin'::character varying)::"text", ('revision'::character varying)::"text", ('meeting'::character varying)::"text", ('delivery'::character varying)::"text", ('creative'::character varying)::"text", ('technical'::character varying)::"text", ('other'::character varying)::"text"])))
);


ALTER TABLE "public"."package_task_template" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."package_task_template_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."package_task_template_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."package_task_template_id_seq" OWNED BY "public"."package_task_template"."id";



CREATE TABLE IF NOT EXISTS "public"."payment" (
    "id" bigint NOT NULL,
    "invoice_id" bigint NOT NULL,
    "client_id" bigint NOT NULL,
    "payment_date" "date" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "payment_method" character varying(50) DEFAULT 'bank_transfer'::character varying,
    "reference" character varying(255),
    "status" character varying(20) DEFAULT 'confirmed'::character varying NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid",
    CONSTRAINT "payment_amount_check" CHECK (("amount" > (0)::numeric)),
    CONSTRAINT "payment_payment_method_check" CHECK ((("payment_method")::"text" = ANY (ARRAY[('bank_transfer'::character varying)::"text", ('qr_bill'::character varying)::"text", ('card'::character varying)::"text", ('cash'::character varying)::"text", ('other'::character varying)::"text"]))),
    CONSTRAINT "payment_status_check" CHECK ((("status")::"text" = ANY (ARRAY[('pending'::character varying)::"text", ('confirmed'::character varying)::"text", ('failed'::character varying)::"text", ('refunded'::character varying)::"text"])))
);


ALTER TABLE "public"."payment" OWNER TO "postgres";


COMMENT ON TABLE "public"."payment" IS 'Paiements reÔö£┬║us des clients (Collected Revenue)';



COMMENT ON COLUMN "public"."payment"."payment_method" IS 'MÔö£┬«thode de paiement: bank_transfer, qr_bill, card, cash, other';



COMMENT ON COLUMN "public"."payment"."status" IS 'pending: en attente, confirmed: confirmÔö£┬«, failed: Ôö£┬«chouÔö£┬«, refunded: remboursÔö£┬«';



CREATE SEQUENCE IF NOT EXISTS "public"."payment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."payment_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."payment_id_seq" OWNED BY "public"."payment"."id";



CREATE TABLE IF NOT EXISTS "public"."persona" (
    "id" integer NOT NULL,
    "strategy_id" integer NOT NULL,
    "nom" character varying(255) NOT NULL,
    "age_range" character varying(50),
    "profession" character varying(255),
    "besoins" "text",
    "problemes" "text",
    "attentes" "text",
    "comportements" "text",
    "canaux_preferes" "text"[],
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."persona" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."persona" OWNER TO "postgres";


COMMENT ON TABLE "public"."persona" IS 'Personas cibles pour les stratÔö£┬«gies social media';



COMMENT ON COLUMN "public"."persona"."strategy_id" IS 'ID de la stratÔö£┬«gie Ôö£├í laquelle appartient ce persona';



COMMENT ON COLUMN "public"."persona"."nom" IS 'Nom ou titre du persona';



COMMENT ON COLUMN "public"."persona"."age_range" IS 'Tranche d''Ôö£├│ge du persona (ex: 25-35 ans)';



COMMENT ON COLUMN "public"."persona"."canaux_preferes" IS 'Canaux de communication prÔö£┬«fÔö£┬«rÔö£┬«s du persona';



CREATE SEQUENCE IF NOT EXISTS "public"."persona_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."persona_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."persona_id_seq" OWNED BY "public"."persona"."id";



CREATE TABLE IF NOT EXISTS "public"."pilier_contenu" (
    "id" integer NOT NULL,
    "strategy_id" integer NOT NULL,
    "titre" character varying(255) NOT NULL,
    "description" "text",
    "exemples" "text",
    "pourcentage_cible" integer,
    "ordre" integer DEFAULT 0,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "pilier_contenu_pourcentage_cible_check" CHECK ((("pourcentage_cible" >= 0) AND ("pourcentage_cible" <= 100)))
);

ALTER TABLE ONLY "public"."pilier_contenu" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."pilier_contenu" OWNER TO "postgres";


COMMENT ON TABLE "public"."pilier_contenu" IS 'Piliers de contenu des stratÔö£┬«gies social media';



COMMENT ON COLUMN "public"."pilier_contenu"."titre" IS 'Titre du pilier de contenu';



COMMENT ON COLUMN "public"."pilier_contenu"."pourcentage_cible" IS 'Pourcentage cible du contenu pour ce pilier (0-100)';



COMMENT ON COLUMN "public"."pilier_contenu"."ordre" IS 'Ordre d''affichage du pilier';



CREATE SEQUENCE IF NOT EXISTS "public"."pilier_contenu_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."pilier_contenu_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."pilier_contenu_id_seq" OWNED BY "public"."pilier_contenu"."id";



CREATE TABLE IF NOT EXISTS "public"."pipeline_history" (
    "id" integer NOT NULL,
    "prospect_id" integer NOT NULL,
    "from_status" "public"."prospect_status",
    "to_status" "public"."prospect_status" NOT NULL,
    "changed_by" integer,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."pipeline_history" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."pipeline_history" OWNER TO "postgres";


COMMENT ON TABLE "public"."pipeline_history" IS 'Historique des changements de statut pipeline';



CREATE SEQUENCE IF NOT EXISTS "public"."pipeline_history_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."pipeline_history_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."pipeline_history_id_seq" OWNED BY "public"."pipeline_history"."id";



CREATE TABLE IF NOT EXISTS "public"."pitch_deck_assets" (
    "id" integer NOT NULL,
    "pitch_deck_id" integer NOT NULL,
    "file_name" character varying(255) NOT NULL,
    "file_type" character varying(50) NOT NULL,
    "file_size" integer,
    "file_url" character varying(500),
    "storage_path" character varying(500),
    "width" integer,
    "height" integer,
    "alt_text" character varying(255),
    "slide_index" integer,
    "element_id" bigint,
    "uploaded_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."pitch_deck_assets" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."pitch_deck_assets" OWNER TO "postgres";


COMMENT ON TABLE "public"."pitch_deck_assets" IS 'Assets (images, fichiers) utilisÔö£┬«s dans les pitch decks';



CREATE SEQUENCE IF NOT EXISTS "public"."pitch_deck_assets_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."pitch_deck_assets_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."pitch_deck_assets_id_seq" OWNED BY "public"."pitch_deck_assets"."id";



CREATE TABLE IF NOT EXISTS "public"."pitch_deck_templates" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "category" character varying(50),
    "slides_template" "jsonb" NOT NULL,
    "preview_image_url" character varying(500),
    "is_official" boolean DEFAULT false,
    "is_public" boolean DEFAULT true,
    "usage_count" integer DEFAULT 0,
    "created_by" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."pitch_deck_templates" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."pitch_deck_templates" OWNER TO "postgres";


COMMENT ON TABLE "public"."pitch_deck_templates" IS 'Templates prÔö£┬«dÔö£┬«finis pour pitch decks';



CREATE SEQUENCE IF NOT EXISTS "public"."pitch_deck_templates_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."pitch_deck_templates_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."pitch_deck_templates_id_seq" OWNED BY "public"."pitch_deck_templates"."id";



CREATE TABLE IF NOT EXISTS "public"."pitch_deck_versions" (
    "id" integer NOT NULL,
    "pitch_deck_id" integer NOT NULL,
    "slides_snapshot" "jsonb" NOT NULL,
    "version_number" integer NOT NULL,
    "change_description" "text",
    "changed_by" integer,
    "created_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."pitch_deck_versions" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."pitch_deck_versions" OWNER TO "postgres";


COMMENT ON TABLE "public"."pitch_deck_versions" IS 'Historique des versions pour undo/redo et audit';



CREATE SEQUENCE IF NOT EXISTS "public"."pitch_deck_versions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."pitch_deck_versions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."pitch_deck_versions_id_seq" OWNED BY "public"."pitch_deck_versions"."id";



CREATE TABLE IF NOT EXISTS "public"."pitch_decks" (
    "id" integer NOT NULL,
    "prospect_id" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "template_name" character varying(100),
    "slides" "jsonb" NOT NULL,
    "version" integer DEFAULT 1,
    "parent_deck_id" integer,
    "is_active" boolean DEFAULT true,
    "is_sent" boolean DEFAULT false,
    "sent_date" timestamp with time zone,
    "pdf_url" character varying(500),
    "pptx_url" character varying(500),
    "created_by" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "thumbnail_url" character varying(500),
    "slide_count" integer DEFAULT 0,
    "last_viewed_at" timestamp with time zone,
    "view_count" integer DEFAULT 0,
    "last_edited_at" timestamp with time zone DEFAULT "now"(),
    "tags" "text"[],
    "shared_with" integer[]
);

ALTER TABLE ONLY "public"."pitch_decks" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."pitch_decks" OWNER TO "postgres";


COMMENT ON TABLE "public"."pitch_decks" IS 'Pitch decks et prÔö£┬«sentations commerciales';



COMMENT ON COLUMN "public"."pitch_decks"."slides" IS 'Structure JSONB complÔö£┬┐te des slides avec tous les Ôö£┬«lÔö£┬«ments';



COMMENT ON COLUMN "public"."pitch_decks"."thumbnail_url" IS 'URL de la miniature/preview du pitch deck';



COMMENT ON COLUMN "public"."pitch_decks"."slide_count" IS 'Nombre total de slides (cache pour performance)';



COMMENT ON COLUMN "public"."pitch_decks"."view_count" IS 'Nombre de fois que le pitch deck a Ôö£┬«tÔö£┬« consultÔö£┬«';



COMMENT ON COLUMN "public"."pitch_decks"."tags" IS 'Tags pour filtrage et recherche';



CREATE SEQUENCE IF NOT EXISTS "public"."pitch_decks_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."pitch_decks_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."pitch_decks_id_seq" OWNED BY "public"."pitch_decks"."id";



CREATE TABLE IF NOT EXISTS "public"."prospects" (
    "id" integer NOT NULL,
    "company_name" character varying(255) NOT NULL,
    "website" character varying(255),
    "industry" character varying(100),
    "company_size" character varying(50),
    "location" character varying(255),
    "country" character varying(100),
    "status" "public"."prospect_status" DEFAULT 'new'::"public"."prospect_status" NOT NULL,
    "pipeline_stage" character varying(50) DEFAULT 'new'::character varying,
    "estimated_value" numeric(10,2),
    "probability" integer DEFAULT 0,
    "source" "public"."lead_source",
    "priority" "public"."priority_level" DEFAULT 'medium'::"public"."priority_level",
    "tags" "text"[],
    "owner_id" integer,
    "first_contact_date" "date",
    "last_contact_date" "date",
    "expected_close_date" "date",
    "won_date" "date",
    "lost_date" "date",
    "lost_reason" "text",
    "pain_points" "text",
    "objectives" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "prospects_probability_check" CHECK ((("probability" >= 0) AND ("probability" <= 100)))
);

ALTER TABLE ONLY "public"."prospects" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."prospects" OWNER TO "postgres";


COMMENT ON TABLE "public"."prospects" IS 'Entreprises prospects et opportunitÔö£┬«s commerciales';



CREATE SEQUENCE IF NOT EXISTS "public"."prospects_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."prospects_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."prospects_id_seq" OWNED BY "public"."prospects"."id";



CREATE TABLE IF NOT EXISTS "public"."role" (
    "id" integer NOT NULL,
    "code" character varying(50) NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "redirect_path" character varying(255) NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."role" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."role" OWNER TO "postgres";


COMMENT ON TABLE "public"."role" IS 'RÔö£Ôöñles utilisateurs avec redirections personnalisÔö£┬«es';



COMMENT ON COLUMN "public"."role"."code" IS 'Code unique du rÔö£Ôöñle (admin, client, staff)';



COMMENT ON COLUMN "public"."role"."redirect_path" IS 'Chemin de redirection aprÔö£┬┐s login';



CREATE SEQUENCE IF NOT EXISTS "public"."role_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."role_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."role_id_seq" OWNED BY "public"."role"."id";



CREATE TABLE IF NOT EXISTS "public"."security_logs" (
    "id" bigint NOT NULL,
    "user_id" integer,
    "auth_user_id" "uuid",
    "event_type" character varying(50) NOT NULL,
    "event_status" character varying(20) DEFAULT 'success'::character varying NOT NULL,
    "email" character varying(255),
    "ip_address" "inet",
    "user_agent" "text",
    "device_info" "jsonb" DEFAULT '{}'::"jsonb",
    "location_info" "jsonb" DEFAULT '{}'::"jsonb",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "valid_event_status" CHECK ((("event_status")::"text" = ANY (ARRAY[('success'::character varying)::"text", ('failure'::character varying)::"text", ('warning'::character varying)::"text", ('info'::character varying)::"text"]))),
    CONSTRAINT "valid_event_type" CHECK ((("event_type")::"text" = ANY (ARRAY[('login'::character varying)::"text", ('logout'::character varying)::"text", ('login_failed'::character varying)::"text", ('password_reset'::character varying)::"text", ('password_change'::character varying)::"text", ('account_locked'::character varying)::"text", ('account_unlocked'::character varying)::"text", ('role_changed'::character varying)::"text", ('permission_changed'::character varying)::"text"])))
);


ALTER TABLE "public"."security_logs" OWNER TO "postgres";


COMMENT ON TABLE "public"."security_logs" IS 'Stores all security-related events and audit trail';



CREATE OR REPLACE VIEW "public"."security_dashboard_view" AS
 SELECT "sl"."id",
    "sl"."user_id",
    "sl"."auth_user_id",
    "sl"."event_type",
    "sl"."event_status",
    "sl"."email",
    "sl"."ip_address",
    "sl"."user_agent",
    "sl"."device_info",
    "sl"."location_info",
    "sl"."metadata",
    "sl"."created_at",
    "u"."email" AS "user_email",
    "r"."name" AS "role_name",
    "r"."code" AS "role_code",
    "c"."name" AS "client_name",
        CASE
            WHEN ("sl"."created_at" > ("now"() - '00:05:00'::interval)) THEN 'just now'::"text"
            WHEN ("sl"."created_at" > ("now"() - '01:00:00'::interval)) THEN 'recently'::"text"
            WHEN ("sl"."created_at" > ("now"() - '24:00:00'::interval)) THEN 'today'::"text"
            ELSE 'older'::"text"
        END AS "time_category"
   FROM ((("public"."security_logs" "sl"
     LEFT JOIN "public"."app_user" "u" ON (("sl"."user_id" = "u"."id")))
     LEFT JOIN "public"."role" "r" ON (("u"."role_id" = "r"."id")))
     LEFT JOIN "public"."client" "c" ON (("u"."client_id" = "c"."id")))
  ORDER BY "sl"."created_at" DESC;


ALTER VIEW "public"."security_dashboard_view" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."security_logs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."security_logs_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."security_logs_id_seq" OWNED BY "public"."security_logs"."id";



CREATE TABLE IF NOT EXISTS "public"."sql_injection_attempts" (
    "id" bigint NOT NULL,
    "ip_address" "inet" NOT NULL,
    "email" character varying(255),
    "payload" "text" NOT NULL,
    "user_agent" "text",
    "detected_patterns" "text"[],
    "severity" character varying(20) DEFAULT 'high'::character varying,
    "detected_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."sql_injection_attempts" OWNER TO "postgres";


COMMENT ON TABLE "public"."sql_injection_attempts" IS 'Log des tentatives d''injection SQL dÔö£┬«tectÔö£┬«es';



CREATE OR REPLACE VIEW "public"."security_monitoring" AS
 SELECT 'failed_logins'::"text" AS "metric_type",
    "count"(*) AS "count",
    "max"("security_logs"."created_at") AS "last_occurrence"
   FROM "public"."security_logs"
  WHERE ((("security_logs"."event_type")::"text" = 'login_failed'::"text") AND ("security_logs"."created_at" > ("now"() - '01:00:00'::interval)))
UNION ALL
 SELECT 'blocked_ips'::"text" AS "metric_type",
    "count"(*) AS "count",
    "max"("ip_blacklist"."blocked_at") AS "last_occurrence"
   FROM "public"."ip_blacklist"
  WHERE (("ip_blacklist"."blocked_until" > "now"()) OR ("ip_blacklist"."is_permanent" = true))
UNION ALL
 SELECT 'sql_injections'::"text" AS "metric_type",
    "count"(*) AS "count",
    "max"("sql_injection_attempts"."detected_at") AS "last_occurrence"
   FROM "public"."sql_injection_attempts"
  WHERE ("sql_injection_attempts"."detected_at" > ("now"() - '24:00:00'::interval));


ALTER VIEW "public"."security_monitoring" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."security_notifications" (
    "id" bigint NOT NULL,
    "user_id" integer,
    "security_log_id" bigint,
    "notification_type" character varying(50) NOT NULL,
    "title" character varying(255) NOT NULL,
    "message" "text" NOT NULL,
    "severity" character varying(20) DEFAULT 'info'::character varying NOT NULL,
    "is_read" boolean DEFAULT false,
    "read_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "valid_notification_type" CHECK ((("notification_type")::"text" = ANY (ARRAY[('suspicious_login'::character varying)::"text", ('new_device'::character varying)::"text", ('new_location'::character varying)::"text", ('multiple_failed_attempts'::character varying)::"text", ('account_locked'::character varying)::"text", ('unusual_activity'::character varying)::"text"]))),
    CONSTRAINT "valid_severity" CHECK ((("severity")::"text" = ANY (ARRAY[('info'::character varying)::"text", ('warning'::character varying)::"text", ('critical'::character varying)::"text"])))
);


ALTER TABLE "public"."security_notifications" OWNER TO "postgres";


COMMENT ON TABLE "public"."security_notifications" IS 'Stores security notifications for users';



CREATE SEQUENCE IF NOT EXISTS "public"."security_notifications_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."security_notifications_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."security_notifications_id_seq" OWNED BY "public"."security_notifications"."id";



CREATE TABLE IF NOT EXISTS "public"."service_package" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "slug" character varying(100) NOT NULL,
    "description" "text",
    "tagline" character varying(200),
    "price" numeric(10,2) NOT NULL,
    "currency" character varying(3) DEFAULT 'CHF'::character varying,
    "billing_frequency" character varying(20) DEFAULT 'one_time'::character varying,
    "color" character varying(50),
    "icon" character varying(50),
    "badge" character varying(50),
    "is_featured" boolean DEFAULT false,
    "display_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "is_visible" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" integer,
    CONSTRAINT "valid_billing_frequency" CHECK ((("billing_frequency")::"text" = ANY (ARRAY[('one_time'::character varying)::"text", ('monthly'::character varying)::"text", ('yearly'::character varying)::"text", ('quarterly'::character varying)::"text"])))
);


ALTER TABLE "public"."service_package" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."service_package_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."service_package_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."service_package_id_seq" OWNED BY "public"."service_package"."id";



CREATE TABLE IF NOT EXISTS "public"."social_media_strategy" (
    "id" bigint NOT NULL,
    "version" integer DEFAULT 1 NOT NULL,
    "status" "text" DEFAULT 'brouillon'::"text" NOT NULL,
    "contexte_general" "text",
    "objectifs_business" "text",
    "objectifs_reseaux" "text",
    "cibles" "text",
    "personas" "jsonb",
    "plateformes" "text"[],
    "ton_voix" "text",
    "guidelines_visuelles" "text",
    "valeurs_messages" "text",
    "piliers_contenu" "jsonb",
    "formats_envisages" "text"[],
    "frequence_calendrier" "text",
    "workflow_roles" "text",
    "audit_profils" "text",
    "benchmark_concurrents" "text",
    "kpis" "jsonb",
    "cadre_suivi" "text",
    "owned_media" "text",
    "shared_media" "text",
    "paid_media" "text",
    "earned_media" "text",
    "temps_humain" "text",
    "outils" "text",
    "budget_pub" "text",
    "planning_global" "text",
    "processus_iteration" "text",
    "mise_a_jour" "text",
    "notes_internes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "text",
    "client_id" integer NOT NULL
);

ALTER TABLE ONLY "public"."social_media_strategy" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."social_media_strategy" OWNER TO "postgres";


COMMENT ON COLUMN "public"."social_media_strategy"."client_id" IS 'ID du client auquel appartient cette stratÔö£┬«gie';



ALTER TABLE "public"."social_media_strategy" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."social_media_strategy_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE SEQUENCE IF NOT EXISTS "public"."sql_injection_attempts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."sql_injection_attempts_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."sql_injection_attempts_id_seq" OWNED BY "public"."sql_injection_attempts"."id";



CREATE TABLE IF NOT EXISTS "public"."strategy_comments" (
    "id" integer NOT NULL,
    "strategy_id" integer NOT NULL,
    "client_id" bigint NOT NULL,
    "user_id" integer NOT NULL,
    "section_key" character varying(100) NOT NULL,
    "content" "text" NOT NULL,
    "status" character varying(20) DEFAULT 'pending'::character varying,
    "admin_response" "text",
    "admin_response_at" timestamp with time zone,
    "admin_response_by" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "strategy_comments_status_check" CHECK ((("status")::"text" = ANY (ARRAY[('pending'::character varying)::"text", ('read'::character varying)::"text", ('resolved'::character varying)::"text", ('archived'::character varying)::"text"])))
);


ALTER TABLE "public"."strategy_comments" OWNER TO "postgres";


COMMENT ON TABLE "public"."strategy_comments" IS 'Commentaires des clients sur les sections de leurs stratÔö£┬«gies social media';



COMMENT ON COLUMN "public"."strategy_comments"."client_id" IS 'ID du client propriÔö£┬«taire de la stratÔö£┬«gie (BIGINT pour correspondre Ôö£├í client.id)';



COMMENT ON COLUMN "public"."strategy_comments"."user_id" IS 'ID de l''utilisateur qui a crÔö£┬«Ôö£┬« le commentaire (INTEGER pour correspondre Ôö£├í app_user.id)';



COMMENT ON COLUMN "public"."strategy_comments"."section_key" IS 'ClÔö£┬« de la section de la stratÔö£┬«gie (ex: contexte_general, objectifs_business)';



COMMENT ON COLUMN "public"."strategy_comments"."status" IS 'Statut: pending (en attente), read (lu), resolved (rÔö£┬«solu), archived (archivÔö£┬«)';



CREATE SEQUENCE IF NOT EXISTS "public"."strategy_comments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."strategy_comments_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."strategy_comments_id_seq" OWNED BY "public"."strategy_comments"."id";



CREATE TABLE IF NOT EXISTS "public"."user_session" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" integer NOT NULL,
    "token" character varying(500) NOT NULL,
    "expires_at" timestamp without time zone NOT NULL,
    "ip_address" character varying(45),
    "user_agent" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."user_session" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_session" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_session" IS 'Sessions actives des utilisateurs';



COMMENT ON COLUMN "public"."user_session"."token" IS 'Token JWT ou session token';



COMMENT ON COLUMN "public"."user_session"."expires_at" IS 'Date d''expiration de la session';



CREATE OR REPLACE VIEW "public"."user_with_details" WITH ("security_invoker"='true') AS
 SELECT "u"."id" AS "user_id",
    "u"."email",
    "u"."is_active",
    "u"."last_login",
    "u"."created_at",
    "u"."auth_user_id",
    "r"."id" AS "role_id",
    "r"."code" AS "role_code",
    "r"."name" AS "role_name",
    "r"."redirect_path",
    "u"."client_id",
    "c"."name" AS "client_name",
    "c"."company_name",
    "c"."email" AS "client_email"
   FROM (("public"."app_user" "u"
     JOIN "public"."role" "r" ON (("u"."role_id" = "r"."id")))
     LEFT JOIN "public"."client" "c" ON (("u"."client_id" = "c"."id")));


ALTER VIEW "public"."user_with_details" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_admin_users" AS
 SELECT "u"."id",
    "u"."email",
    "u"."is_active",
    "u"."auth_user_id",
    "u"."role_id",
    "r"."name" AS "role_name",
    "u"."must_reset_password",
    "u"."security_alert",
    "u"."failed_login_attempts",
    "u"."account_locked_until",
    "u"."created_at",
    "u"."updated_at"
   FROM ("public"."app_user" "u"
     LEFT JOIN "public"."role" "r" ON (("u"."role_id" = "r"."id")))
  WHERE (EXISTS ( SELECT 1
           FROM "public"."app_user" "cu"
          WHERE (("cu"."auth_user_id" = "auth"."uid"()) AND ("cu"."role_id" = 1))));


ALTER VIEW "public"."v_admin_users" OWNER TO "postgres";


COMMENT ON VIEW "public"."v_admin_users" IS 'Vue sÔö£┬«curisÔö£┬«e des utilisateurs pour les admins, sans accÔö£┬┐s direct Ôö£├í auth.users';



CREATE OR REPLACE VIEW "public"."v_calendar_statistics" WITH ("security_invoker"='true') AS
 SELECT "ec"."id" AS "calendar_id",
    "ec"."strategy_id",
    "sms"."client_id",
    "count"("ep"."id") AS "total_posts",
    "count"(
        CASE
            WHEN (("ep"."status")::"text" = 'draft'::"text") THEN 1
            ELSE NULL::integer
        END) AS "draft_posts",
    "count"(
        CASE
            WHEN (("ep"."status")::"text" = 'scheduled'::"text") THEN 1
            ELSE NULL::integer
        END) AS "scheduled_posts",
    "count"(
        CASE
            WHEN (("ep"."status")::"text" = 'published'::"text") THEN 1
            ELSE NULL::integer
        END) AS "published_posts",
    "count"(
        CASE
            WHEN (("ep"."status")::"text" = 'cancelled'::"text") THEN 1
            ELSE NULL::integer
        END) AS "cancelled_posts",
    "sum"("ep"."likes") AS "total_likes",
    "sum"("ep"."comments") AS "total_comments",
    "sum"("ep"."shares") AS "total_shares",
    "sum"("ep"."views") AS "total_views",
    "avg"("ep"."engagement_rate") AS "avg_engagement_rate"
   FROM (("public"."editorial_calendar" "ec"
     LEFT JOIN "public"."editorial_post" "ep" ON (("ec"."id" = "ep"."calendar_id")))
     JOIN "public"."social_media_strategy" "sms" ON (("ec"."strategy_id" = "sms"."id")))
  GROUP BY "ec"."id", "ec"."strategy_id", "sms"."client_id";


ALTER VIEW "public"."v_calendar_statistics" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_contract_summary" AS
SELECT
    NULL::bigint AS "id",
    NULL::bigint AS "client_id",
    NULL::character varying(255) AS "contract_name",
    NULL::numeric(10,2) AS "monthly_amount",
    NULL::character varying(20) AS "billing_cycle",
    NULL::character varying(20) AS "status",
    NULL::"date" AS "start_date",
    NULL::"date" AS "end_date",
    NULL::"text" AS "client_name",
    NULL::bigint AS "total_schedules",
    NULL::bigint AS "planned_schedules",
    NULL::bigint AS "invoiced_schedules",
    NULL::bigint AS "paid_schedules",
    NULL::numeric AS "expected_amount",
    NULL::numeric AS "invoiced_amount",
    NULL::numeric AS "paid_amount";


ALTER VIEW "public"."v_contract_summary" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_editorial_posts_full" WITH ("security_invoker"='true') AS
 SELECT "ep"."id",
    "ep"."calendar_id",
    "ep"."publication_date",
    "ep"."platform",
    "ep"."content_type",
    "ep"."title",
    "ep"."description",
    "ep"."caption",
    "ep"."hashtags",
    "ep"."mentions",
    "ep"."media_urls",
    "ep"."status",
    "ep"."scheduled_time",
    "ep"."published_at",
    "ep"."likes",
    "ep"."comments",
    "ep"."shares",
    "ep"."views",
    "ep"."reach",
    "ep"."engagement_rate",
    "ep"."notes",
    "ep"."created_at",
    "ep"."updated_at",
    "ep"."created_by",
    "ep"."pilier_id",
    "ec"."strategy_id",
    "ec"."name" AS "calendar_name",
    "sms"."client_id",
    "c"."name" AS "client_name",
    "c"."company_name" AS "client_company"
   FROM ((("public"."editorial_post" "ep"
     JOIN "public"."editorial_calendar" "ec" ON (("ep"."calendar_id" = "ec"."id")))
     JOIN "public"."social_media_strategy" "sms" ON (("ec"."strategy_id" = "sms"."id")))
     JOIN "public"."client" "c" ON (("sms"."client_id" = "c"."id")));


ALTER VIEW "public"."v_editorial_posts_full" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_invoice_payment_status" AS
SELECT
    NULL::bigint AS "id",
    NULL::bigint AS "client_id",
    NULL::bigint AS "mandat_id",
    NULL::"text" AS "invoice_number",
    NULL::"date" AS "issue_date",
    NULL::"date" AS "due_date",
    NULL::numeric(10,2) AS "total_ht",
    NULL::numeric(10,2) AS "total_tva",
    NULL::numeric(10,2) AS "total_ttc",
    NULL::"public"."invoice_status" AS "status",
    NULL::"text" AS "pdf_path",
    NULL::timestamp with time zone AS "created_at",
    NULL::timestamp with time zone AS "updated_at",
    NULL::"public"."invoice_recurrence" AS "is_recurring",
    NULL::integer AS "recurrence_day",
    NULL::bigint AS "parent_invoice_id",
    NULL::"date" AS "next_generation_date",
    NULL::boolean AS "auto_send",
    NULL::"date" AS "payment_date",
    NULL::"date" AS "end_date",
    NULL::integer AS "max_occurrences",
    NULL::integer AS "occurrences_count",
    NULL::bigint AS "source_contract_id",
    NULL::bigint AS "source_schedule_id",
    NULL::numeric AS "total_paid",
    NULL::numeric AS "remaining_amount",
    NULL::"text" AS "payment_status",
    NULL::bigint AS "payment_count";


ALTER VIEW "public"."v_invoice_payment_status" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_posts_by_pilier" WITH ("security_invoker"='true') AS
 SELECT "pc"."id" AS "pilier_id",
    "pc"."strategy_id",
    "pc"."titre" AS "pilier_titre",
    "count"("ep"."id") AS "nombre_posts",
    "count"(
        CASE
            WHEN (("ep"."status")::"text" = 'published'::"text") THEN 1
            ELSE NULL::integer
        END) AS "posts_publies",
    "count"(
        CASE
            WHEN (("ep"."status")::"text" = 'scheduled'::"text") THEN 1
            ELSE NULL::integer
        END) AS "posts_programmes"
   FROM ("public"."pilier_contenu" "pc"
     LEFT JOIN "public"."editorial_post" "ep" ON (("pc"."id" = "ep"."pilier_id")))
  GROUP BY "pc"."id", "pc"."strategy_id", "pc"."titre";


ALTER VIEW "public"."v_posts_by_pilier" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_schedules_due_for_invoicing" AS
 SELECT "cs"."id",
    "cs"."contract_id",
    "cs"."period_start_date",
    "cs"."period_end_date",
    "cs"."expected_issue_date",
    "cs"."expected_due_date",
    "cs"."expected_amount",
    "cs"."status",
    "cs"."invoice_id",
    "cs"."notes",
    "cs"."created_at",
    "cs"."updated_at",
    "cc"."client_id",
    "cc"."contract_name",
    "cc"."auto_generate_invoices",
    "cc"."payment_terms_days",
    "c"."company_name" AS "client_name"
   FROM (("public"."contract_schedule" "cs"
     JOIN "public"."client_contract" "cc" ON (("cc"."id" = "cs"."contract_id")))
     JOIN "public"."client" "c" ON (("c"."id" = "cc"."client_id")))
  WHERE ((("cs"."status")::"text" = 'planned'::"text") AND (("cc"."status")::"text" = 'active'::"text") AND ("cc"."auto_generate_invoices" = true) AND ("cs"."expected_issue_date" <= CURRENT_DATE))
  ORDER BY "cs"."expected_issue_date";


ALTER VIEW "public"."v_schedules_due_for_invoicing" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_strategy_summary" WITH ("security_invoker"='true') AS
 SELECT "sms"."id",
    "sms"."client_id",
    "sms"."status",
    "sms"."created_at",
    "count"(DISTINCT "p"."id") AS "nombre_personas",
    "count"(DISTINCT "pc"."id") AS "nombre_piliers",
    "count"(DISTINCT "k"."id") AS "nombre_kpis",
    "count"(DISTINCT "ec"."id") AS "has_calendar"
   FROM (((("public"."social_media_strategy" "sms"
     LEFT JOIN "public"."persona" "p" ON (("sms"."id" = "p"."strategy_id")))
     LEFT JOIN "public"."pilier_contenu" "pc" ON (("sms"."id" = "pc"."strategy_id")))
     LEFT JOIN "public"."kpi" "k" ON (("sms"."id" = "k"."strategy_id")))
     LEFT JOIN "public"."editorial_calendar" "ec" ON (("sms"."id" = "ec"."strategy_id")))
  GROUP BY "sms"."id", "sms"."client_id", "sms"."status", "sms"."created_at";


ALTER VIEW "public"."v_strategy_summary" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."video_figurant" (
    "id" bigint NOT NULL,
    "video_task_id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "contact" "text",
    "role" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."video_figurant" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."video_figurant" OWNER TO "postgres";


ALTER TABLE "public"."video_figurant" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."video_figurant_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."video_script" (
    "id" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "content" "text" DEFAULT ''::"text" NOT NULL,
    "client_id" integer,
    "mandat_id" integer,
    "editorial_post_id" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."video_script" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."video_script" OWNER TO "postgres";


COMMENT ON TABLE "public"."video_script" IS 'Scripts vidÔö£┬«o avec Ôö£┬«diteur de texte riche';



COMMENT ON COLUMN "public"."video_script"."title" IS 'Titre du script';



COMMENT ON COLUMN "public"."video_script"."content" IS 'Contenu HTML du script';



COMMENT ON COLUMN "public"."video_script"."client_id" IS 'Client associÔö£┬« (optionnel)';



COMMENT ON COLUMN "public"."video_script"."mandat_id" IS 'Mandat associÔö£┬« (optionnel)';



COMMENT ON COLUMN "public"."video_script"."editorial_post_id" IS 'Lien vers la vidÔö£┬«o planifiÔö£┬«e dans le calendrier Ôö£┬«ditorial';



CREATE SEQUENCE IF NOT EXISTS "public"."video_script_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."video_script_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."video_script_id_seq" OWNED BY "public"."video_script"."id";



CREATE TABLE IF NOT EXISTS "public"."video_task_details" (
    "id" bigint NOT NULL,
    "task_id" bigint NOT NULL,
    "script" "text",
    "duration_minutes" integer,
    "location" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."video_task_details" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."video_task_details" OWNER TO "postgres";


ALTER TABLE "public"."video_task_details" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."video_task_details_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."accounting_account" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."accounting_account_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."accounting_audit_log" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."accounting_audit_log_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."accounting_document" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."accounting_document_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."accounting_integration_mapping" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."accounting_integration_mapping_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."accounting_journal_entry" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."accounting_journal_entry_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."accounting_journal_line" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."accounting_journal_line_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."accounting_period" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."accounting_period_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."accounting_reconciliation" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."accounting_reconciliation_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."accounting_recurring_template" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."accounting_recurring_template_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."accounting_settings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."accounting_settings_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."accounting_tax_rate" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."accounting_tax_rate_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."activities" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."activities_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."activity_log" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."activity_log_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."app_user" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."app_user_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."auth_users_audit" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."auth_users_audit_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."client_contract" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."client_contract_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."client_package" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."client_package_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."contacts" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."contacts_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."contract_schedule" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."contract_schedule_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."creative_concept" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."creative_concept_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."editorial_calendar" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."editorial_calendar_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."editorial_post" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."editorial_post_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."ip_blacklist" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."ip_blacklist_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."kpi" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."kpi_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."kpi_mesure" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."kpi_mesure_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."login_attempts" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."login_attempts_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."meeting_minutes" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."meeting_minutes_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."meetings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."meetings_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."package_feature" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."package_feature_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."package_invoice_template" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."package_invoice_template_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."package_mandat_template" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."package_mandat_template_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."package_task_template" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."package_task_template_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."payment" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."payment_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."persona" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."persona_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."pilier_contenu" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."pilier_contenu_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."pipeline_history" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."pipeline_history_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."pitch_deck_assets" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."pitch_deck_assets_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."pitch_deck_templates" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."pitch_deck_templates_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."pitch_deck_versions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."pitch_deck_versions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."pitch_decks" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."pitch_decks_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."prospects" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."prospects_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."role" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."role_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."security_logs" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."security_logs_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."security_notifications" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."security_notifications_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."service_package" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."service_package_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."sql_injection_attempts" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."sql_injection_attempts_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."strategy_comments" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."strategy_comments_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."video_script" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."video_script_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."accounting_account"
    ADD CONSTRAINT "accounting_account_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."accounting_account"
    ADD CONSTRAINT "accounting_account_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."accounting_audit_log"
    ADD CONSTRAINT "accounting_audit_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."accounting_document"
    ADD CONSTRAINT "accounting_document_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."accounting_integration_mapping"
    ADD CONSTRAINT "accounting_integration_mappin_source_type_source_id_is_debi_key" UNIQUE ("source_type", "source_id", "is_debit");



ALTER TABLE ONLY "public"."accounting_integration_mapping"
    ADD CONSTRAINT "accounting_integration_mapping_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."accounting_journal_entry"
    ADD CONSTRAINT "accounting_journal_entry_entry_number_key" UNIQUE ("entry_number");



ALTER TABLE ONLY "public"."accounting_journal_entry"
    ADD CONSTRAINT "accounting_journal_entry_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."accounting_journal_line"
    ADD CONSTRAINT "accounting_journal_line_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."accounting_period"
    ADD CONSTRAINT "accounting_period_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."accounting_reconciliation"
    ADD CONSTRAINT "accounting_reconciliation_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."accounting_recurring_template"
    ADD CONSTRAINT "accounting_recurring_template_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."accounting_settings"
    ADD CONSTRAINT "accounting_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."accounting_tax_rate"
    ADD CONSTRAINT "accounting_tax_rate_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."accounting_tax_rate"
    ADD CONSTRAINT "accounting_tax_rate_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."activities"
    ADD CONSTRAINT "activities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."activity_log"
    ADD CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."app_user"
    ADD CONSTRAINT "app_user_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."app_user"
    ADD CONSTRAINT "app_user_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."audit_log"
    ADD CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."auth_users_audit"
    ADD CONSTRAINT "auth_users_audit_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."client_contract"
    ADD CONSTRAINT "client_contract_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."client_package"
    ADD CONSTRAINT "client_package_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."client"
    ADD CONSTRAINT "client_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_settings"
    ADD CONSTRAINT "company_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contract_schedule"
    ADD CONSTRAINT "contract_schedule_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contrat"
    ADD CONSTRAINT "contrat_contrat_number_key" UNIQUE ("contrat_number");



ALTER TABLE ONLY "public"."contrat"
    ADD CONSTRAINT "contrat_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."creative_concept"
    ADD CONSTRAINT "creative_concept_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."editorial_calendar"
    ADD CONSTRAINT "editorial_calendar_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."editorial_calendar"
    ADD CONSTRAINT "editorial_calendar_strategy_unique" UNIQUE ("strategy_id");



ALTER TABLE ONLY "public"."editorial_post"
    ADD CONSTRAINT "editorial_post_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."expense_category"
    ADD CONSTRAINT "expense_category_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."expense_category"
    ADD CONSTRAINT "expense_category_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."expense"
    ADD CONSTRAINT "expense_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invoice"
    ADD CONSTRAINT "invoice_invoice_number_key" UNIQUE ("invoice_number");



ALTER TABLE ONLY "public"."invoice_item"
    ADD CONSTRAINT "invoice_item_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invoice"
    ADD CONSTRAINT "invoice_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ip_blacklist"
    ADD CONSTRAINT "ip_blacklist_ip_address_key" UNIQUE ("ip_address");



ALTER TABLE ONLY "public"."ip_blacklist"
    ADD CONSTRAINT "ip_blacklist_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."kpi_mesure"
    ADD CONSTRAINT "kpi_mesure_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."kpi"
    ADD CONSTRAINT "kpi_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."login_attempts"
    ADD CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mandat"
    ADD CONSTRAINT "mandat_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mandat_task"
    ADD CONSTRAINT "mandat_task_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."meeting_minutes"
    ADD CONSTRAINT "meeting_minutes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."meetings"
    ADD CONSTRAINT "meetings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."package_feature"
    ADD CONSTRAINT "package_feature_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."package_invoice_template"
    ADD CONSTRAINT "package_invoice_template_package_id_key" UNIQUE ("package_id");



ALTER TABLE ONLY "public"."package_invoice_template"
    ADD CONSTRAINT "package_invoice_template_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."package_mandat_template"
    ADD CONSTRAINT "package_mandat_template_package_id_key" UNIQUE ("package_id");



ALTER TABLE ONLY "public"."package_mandat_template"
    ADD CONSTRAINT "package_mandat_template_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."package_task_template"
    ADD CONSTRAINT "package_task_template_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payment"
    ADD CONSTRAINT "payment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."persona"
    ADD CONSTRAINT "persona_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pilier_contenu"
    ADD CONSTRAINT "pilier_contenu_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pipeline_history"
    ADD CONSTRAINT "pipeline_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pitch_deck_assets"
    ADD CONSTRAINT "pitch_deck_assets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pitch_deck_templates"
    ADD CONSTRAINT "pitch_deck_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pitch_deck_versions"
    ADD CONSTRAINT "pitch_deck_versions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pitch_decks"
    ADD CONSTRAINT "pitch_decks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."prospects"
    ADD CONSTRAINT "prospects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role"
    ADD CONSTRAINT "role_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."role"
    ADD CONSTRAINT "role_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."security_logs"
    ADD CONSTRAINT "security_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."security_notifications"
    ADD CONSTRAINT "security_notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."service_package"
    ADD CONSTRAINT "service_package_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."service_package"
    ADD CONSTRAINT "service_package_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."social_media_strategy"
    ADD CONSTRAINT "social_media_strategy_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sql_injection_attempts"
    ADD CONSTRAINT "sql_injection_attempts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."strategy_comments"
    ADD CONSTRAINT "strategy_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."video_task_details"
    ADD CONSTRAINT "unique_task_video" UNIQUE ("task_id");



ALTER TABLE ONLY "public"."user_session"
    ADD CONSTRAINT "user_session_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_session"
    ADD CONSTRAINT "user_session_token_key" UNIQUE ("token");



ALTER TABLE ONLY "public"."video_figurant"
    ADD CONSTRAINT "video_figurant_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."video_script"
    ADD CONSTRAINT "video_script_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."video_task_details"
    ADD CONSTRAINT "video_task_details_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_account_category" ON "public"."accounting_account" USING "btree" ("category");



CREATE INDEX "idx_account_code" ON "public"."accounting_account" USING "btree" ("code");



CREATE INDEX "idx_account_parent" ON "public"."accounting_account" USING "btree" ("parent_id");



CREATE INDEX "idx_account_type" ON "public"."accounting_account" USING "btree" ("type");



CREATE INDEX "idx_accounting_document_journal" ON "public"."accounting_document" USING "btree" ("journal_entry_id");



CREATE INDEX "idx_activities_assigned" ON "public"."activities" USING "btree" ("assigned_to");



CREATE INDEX "idx_activities_due_date" ON "public"."activities" USING "btree" ("due_date");



CREATE INDEX "idx_activities_prospect" ON "public"."activities" USING "btree" ("prospect_id");



CREATE INDEX "idx_activities_status" ON "public"."activities" USING "btree" ("status");



CREATE INDEX "idx_activities_type" ON "public"."activities" USING "btree" ("type");



CREATE INDEX "idx_activity_action" ON "public"."activity_log" USING "btree" ("action");



CREATE INDEX "idx_activity_created" ON "public"."activity_log" USING "btree" ("created_at");



CREATE INDEX "idx_activity_user" ON "public"."activity_log" USING "btree" ("user_id");



CREATE INDEX "idx_app_user_auth_user_id" ON "public"."app_user" USING "btree" ("auth_user_id");



CREATE UNIQUE INDEX "idx_app_user_auth_user_id_unique" ON "public"."app_user" USING "btree" ("auth_user_id") WHERE ("auth_user_id" IS NOT NULL);



CREATE INDEX "idx_app_user_client" ON "public"."app_user" USING "btree" ("client_id");



CREATE INDEX "idx_app_user_email" ON "public"."app_user" USING "btree" ("email");



CREATE INDEX "idx_app_user_role" ON "public"."app_user" USING "btree" ("role_id");



CREATE INDEX "idx_audit_log_action" ON "public"."accounting_audit_log" USING "btree" ("action_type");



CREATE INDEX "idx_audit_log_date" ON "public"."accounting_audit_log" USING "btree" ("performed_at");



CREATE INDEX "idx_audit_log_resource" ON "public"."accounting_audit_log" USING "btree" ("resource_type", "resource_id");



CREATE INDEX "idx_audit_log_user" ON "public"."accounting_audit_log" USING "btree" ("performed_by");



CREATE INDEX "idx_client_contract_client_id" ON "public"."client_contract" USING "btree" ("client_id");



CREATE INDEX "idx_client_contract_dates" ON "public"."client_contract" USING "btree" ("start_date", "end_date");



CREATE INDEX "idx_client_contract_mandat_id" ON "public"."client_contract" USING "btree" ("mandat_id");



CREATE INDEX "idx_client_contract_status" ON "public"."client_contract" USING "btree" ("status");



CREATE INDEX "idx_client_package_client" ON "public"."client_package" USING "btree" ("client_id");



CREATE INDEX "idx_client_package_package" ON "public"."client_package" USING "btree" ("package_id");



CREATE INDEX "idx_client_package_status" ON "public"."client_package" USING "btree" ("status");



CREATE INDEX "idx_contacts_email" ON "public"."contacts" USING "btree" ("email");



CREATE INDEX "idx_contacts_prospect" ON "public"."contacts" USING "btree" ("prospect_id");



CREATE INDEX "idx_contract_schedule_contract_id" ON "public"."contract_schedule" USING "btree" ("contract_id");



CREATE INDEX "idx_contract_schedule_dates" ON "public"."contract_schedule" USING "btree" ("period_start_date", "period_end_date");



CREATE INDEX "idx_contract_schedule_expected_issue_date" ON "public"."contract_schedule" USING "btree" ("expected_issue_date");



CREATE INDEX "idx_contract_schedule_invoice_id" ON "public"."contract_schedule" USING "btree" ("invoice_id");



CREATE INDEX "idx_contract_schedule_status" ON "public"."contract_schedule" USING "btree" ("status");



CREATE INDEX "idx_creative_concept_category" ON "public"."creative_concept" USING "btree" ("category");



CREATE INDEX "idx_creative_concept_client" ON "public"."creative_concept" USING "btree" ("client_id");



CREATE INDEX "idx_creative_concept_mandat" ON "public"."creative_concept" USING "btree" ("mandat_id");



CREATE INDEX "idx_creative_concept_proposed_by" ON "public"."creative_concept" USING "btree" ("proposed_by");



CREATE INDEX "idx_creative_concept_status" ON "public"."creative_concept" USING "btree" ("status");



CREATE INDEX "idx_editorial_calendar_strategy_id" ON "public"."editorial_calendar" USING "btree" ("strategy_id");



CREATE INDEX "idx_editorial_post_calendar_date" ON "public"."editorial_post" USING "btree" ("calendar_id", "publication_date");



CREATE INDEX "idx_editorial_post_calendar_id" ON "public"."editorial_post" USING "btree" ("calendar_id");



CREATE INDEX "idx_editorial_post_pilier_id" ON "public"."editorial_post" USING "btree" ("pilier_id");



CREATE INDEX "idx_editorial_post_platform" ON "public"."editorial_post" USING "btree" ("platform");



CREATE INDEX "idx_editorial_post_publication_date" ON "public"."editorial_post" USING "btree" ("publication_date");



CREATE INDEX "idx_editorial_post_status" ON "public"."editorial_post" USING "btree" ("status");



CREATE INDEX "idx_expense_date" ON "public"."expense" USING "btree" ("date");



CREATE INDEX "idx_expense_type" ON "public"."expense" USING "btree" ("type");



CREATE INDEX "idx_integration_mapping_account" ON "public"."accounting_integration_mapping" USING "btree" ("account_id");



CREATE INDEX "idx_integration_mapping_source" ON "public"."accounting_integration_mapping" USING "btree" ("source_type", "source_id");



CREATE INDEX "idx_invoice_is_recurring" ON "public"."invoice" USING "btree" ("is_recurring") WHERE ("is_recurring" <> 'oneshot'::"public"."invoice_recurrence");



CREATE INDEX "idx_invoice_issue_date" ON "public"."invoice" USING "btree" ("issue_date");



CREATE INDEX "idx_invoice_next_generation_date" ON "public"."invoice" USING "btree" ("next_generation_date") WHERE ("is_recurring" <> 'oneshot'::"public"."invoice_recurrence");



CREATE UNIQUE INDEX "idx_invoice_number_unique" ON "public"."invoice" USING "btree" ("invoice_number");



CREATE INDEX "idx_invoice_parent_invoice_id" ON "public"."invoice" USING "btree" ("parent_invoice_id");



CREATE INDEX "idx_invoice_payment_date" ON "public"."invoice" USING "btree" ("payment_date") WHERE ("payment_date" IS NOT NULL);



CREATE INDEX "idx_invoice_source_contract_id" ON "public"."invoice" USING "btree" ("source_contract_id");



CREATE INDEX "idx_invoice_source_schedule_id" ON "public"."invoice" USING "btree" ("source_schedule_id");



CREATE INDEX "idx_invoice_status_dates" ON "public"."invoice" USING "btree" ("status", "issue_date", "payment_date");



CREATE INDEX "idx_ip_blacklist_blocked_until" ON "public"."ip_blacklist" USING "btree" ("blocked_until");



CREATE INDEX "idx_ip_blacklist_ip" ON "public"."ip_blacklist" USING "btree" ("ip_address");



CREATE INDEX "idx_journal_entry_date" ON "public"."accounting_journal_entry" USING "btree" ("entry_date");



CREATE INDEX "idx_journal_entry_number" ON "public"."accounting_journal_entry" USING "btree" ("entry_number");



CREATE INDEX "idx_journal_entry_period" ON "public"."accounting_journal_entry" USING "btree" ("period_id");



CREATE INDEX "idx_journal_entry_reference" ON "public"."accounting_journal_entry" USING "btree" ("reference_type", "reference_id");



CREATE INDEX "idx_journal_entry_status" ON "public"."accounting_journal_entry" USING "btree" ("status");



CREATE INDEX "idx_journal_line_account" ON "public"."accounting_journal_line" USING "btree" ("account_id");



CREATE INDEX "idx_journal_line_entry" ON "public"."accounting_journal_line" USING "btree" ("journal_entry_id");



CREATE INDEX "idx_journal_line_reconciled" ON "public"."accounting_journal_line" USING "btree" ("reconciled");



CREATE INDEX "idx_journal_line_reconciliation" ON "public"."accounting_journal_line" USING "btree" ("reconciliation_id");



CREATE INDEX "idx_kpi_mesure_date" ON "public"."kpi_mesure" USING "btree" ("kpi_id", "date" DESC);



CREATE INDEX "idx_kpi_mesure_kpi_id" ON "public"."kpi_mesure" USING "btree" ("kpi_id");



CREATE INDEX "idx_kpi_strategy_id" ON "public"."kpi" USING "btree" ("strategy_id");



CREATE INDEX "idx_login_attempts_email" ON "public"."login_attempts" USING "btree" ("email");



CREATE INDEX "idx_login_attempts_ip_address" ON "public"."login_attempts" USING "btree" ("ip_address");



CREATE INDEX "idx_login_attempts_last_attempt" ON "public"."login_attempts" USING "btree" ("last_attempt_at" DESC);



CREATE INDEX "idx_mandat_task_due_date" ON "public"."mandat_task" USING "btree" ("due_date");



CREATE INDEX "idx_mandat_task_mandat_id" ON "public"."mandat_task" USING "btree" ("mandat_id");



CREATE INDEX "idx_mandat_task_status" ON "public"."mandat_task" USING "btree" ("status");



CREATE INDEX "idx_meeting_minutes_meeting" ON "public"."meeting_minutes" USING "btree" ("meeting_id");



CREATE INDEX "idx_meeting_minutes_prospect" ON "public"."meeting_minutes" USING "btree" ("prospect_id");



CREATE INDEX "idx_meetings_organizer" ON "public"."meetings" USING "btree" ("organizer_id");



CREATE INDEX "idx_meetings_prospect" ON "public"."meetings" USING "btree" ("prospect_id");



CREATE INDEX "idx_meetings_start_time" ON "public"."meetings" USING "btree" ("start_time");



CREATE INDEX "idx_package_feature_package" ON "public"."package_feature" USING "btree" ("package_id");



CREATE INDEX "idx_package_task_template_package" ON "public"."package_task_template" USING "btree" ("package_id");



CREATE INDEX "idx_payment_client_id" ON "public"."payment" USING "btree" ("client_id");



CREATE INDEX "idx_payment_date" ON "public"."payment" USING "btree" ("payment_date");



CREATE INDEX "idx_payment_invoice_id" ON "public"."payment" USING "btree" ("invoice_id");



CREATE INDEX "idx_payment_status" ON "public"."payment" USING "btree" ("status");



CREATE INDEX "idx_period_dates" ON "public"."accounting_period" USING "btree" ("start_date", "end_date");



CREATE INDEX "idx_period_status" ON "public"."accounting_period" USING "btree" ("is_closed");



CREATE INDEX "idx_persona_strategy_id" ON "public"."persona" USING "btree" ("strategy_id");



CREATE INDEX "idx_pilier_contenu_ordre" ON "public"."pilier_contenu" USING "btree" ("strategy_id", "ordre");



CREATE INDEX "idx_pilier_contenu_strategy_id" ON "public"."pilier_contenu" USING "btree" ("strategy_id");



CREATE INDEX "idx_pipeline_history_date" ON "public"."pipeline_history" USING "btree" ("created_at");



CREATE INDEX "idx_pipeline_history_prospect" ON "public"."pipeline_history" USING "btree" ("prospect_id");



CREATE INDEX "idx_pitch_deck_assets_deck" ON "public"."pitch_deck_assets" USING "btree" ("pitch_deck_id");



CREATE INDEX "idx_pitch_deck_assets_slide" ON "public"."pitch_deck_assets" USING "btree" ("pitch_deck_id", "slide_index");



CREATE INDEX "idx_pitch_deck_templates_category" ON "public"."pitch_deck_templates" USING "btree" ("category");



CREATE INDEX "idx_pitch_deck_templates_official" ON "public"."pitch_deck_templates" USING "btree" ("is_official");



CREATE INDEX "idx_pitch_deck_versions_deck" ON "public"."pitch_deck_versions" USING "btree" ("pitch_deck_id");



CREATE INDEX "idx_pitch_deck_versions_number" ON "public"."pitch_deck_versions" USING "btree" ("pitch_deck_id", "version_number");



CREATE INDEX "idx_pitch_decks_active" ON "public"."pitch_decks" USING "btree" ("is_active");



CREATE INDEX "idx_pitch_decks_prospect" ON "public"."pitch_decks" USING "btree" ("prospect_id");



CREATE INDEX "idx_pitch_decks_tags" ON "public"."pitch_decks" USING "gin" ("tags");



CREATE INDEX "idx_pitch_decks_template" ON "public"."pitch_decks" USING "btree" ("template_name");



CREATE INDEX "idx_pitch_decks_version" ON "public"."pitch_decks" USING "btree" ("version");



CREATE INDEX "idx_prospects_owner" ON "public"."prospects" USING "btree" ("owner_id");



CREATE INDEX "idx_prospects_status" ON "public"."prospects" USING "btree" ("status");



CREATE INDEX "idx_prospects_tags" ON "public"."prospects" USING "gin" ("tags");



CREATE INDEX "idx_security_logs_auth_user_id" ON "public"."security_logs" USING "btree" ("auth_user_id");



CREATE INDEX "idx_security_logs_created_at" ON "public"."security_logs" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_security_logs_email" ON "public"."security_logs" USING "btree" ("email");



CREATE INDEX "idx_security_logs_event_type" ON "public"."security_logs" USING "btree" ("event_type");



CREATE INDEX "idx_security_logs_ip_address" ON "public"."security_logs" USING "btree" ("ip_address");



CREATE INDEX "idx_security_logs_user_id" ON "public"."security_logs" USING "btree" ("user_id");



CREATE INDEX "idx_security_notifications_created_at" ON "public"."security_notifications" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_security_notifications_is_read" ON "public"."security_notifications" USING "btree" ("is_read");



CREATE INDEX "idx_security_notifications_severity" ON "public"."security_notifications" USING "btree" ("severity");



CREATE INDEX "idx_security_notifications_user_id" ON "public"."security_notifications" USING "btree" ("user_id");



CREATE INDEX "idx_service_package_active" ON "public"."service_package" USING "btree" ("is_active");



CREATE INDEX "idx_service_package_featured" ON "public"."service_package" USING "btree" ("is_featured");



CREATE INDEX "idx_service_package_slug" ON "public"."service_package" USING "btree" ("slug");



CREATE INDEX "idx_service_package_visible" ON "public"."service_package" USING "btree" ("is_visible");



CREATE INDEX "idx_session_expires" ON "public"."user_session" USING "btree" ("expires_at");



CREATE INDEX "idx_session_token" ON "public"."user_session" USING "btree" ("token");



CREATE INDEX "idx_session_user" ON "public"."user_session" USING "btree" ("user_id");



CREATE INDEX "idx_social_media_strategy_client_id" ON "public"."social_media_strategy" USING "btree" ("client_id");



CREATE INDEX "idx_social_media_strategy_status" ON "public"."social_media_strategy" USING "btree" ("status");



CREATE INDEX "idx_sql_injection_detected_at" ON "public"."sql_injection_attempts" USING "btree" ("detected_at" DESC);



CREATE INDEX "idx_sql_injection_ip" ON "public"."sql_injection_attempts" USING "btree" ("ip_address");



CREATE INDEX "idx_strategy_comments_client_id" ON "public"."strategy_comments" USING "btree" ("client_id");



CREATE INDEX "idx_strategy_comments_created_at" ON "public"."strategy_comments" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_strategy_comments_section" ON "public"."strategy_comments" USING "btree" ("section_key");



CREATE INDEX "idx_strategy_comments_status" ON "public"."strategy_comments" USING "btree" ("status");



CREATE INDEX "idx_strategy_comments_strategy_id" ON "public"."strategy_comments" USING "btree" ("strategy_id");



CREATE INDEX "idx_strategy_comments_user_id" ON "public"."strategy_comments" USING "btree" ("user_id");



CREATE INDEX "idx_video_figurant_video_task_id" ON "public"."video_figurant" USING "btree" ("video_task_id");



CREATE INDEX "idx_video_script_client_id" ON "public"."video_script" USING "btree" ("client_id");



CREATE INDEX "idx_video_script_editorial_post_id" ON "public"."video_script" USING "btree" ("editorial_post_id");



CREATE INDEX "idx_video_script_mandat_id" ON "public"."video_script" USING "btree" ("mandat_id");



CREATE INDEX "idx_video_script_updated_at" ON "public"."video_script" USING "btree" ("updated_at" DESC);



CREATE INDEX "idx_video_task_details_task_id" ON "public"."video_task_details" USING "btree" ("task_id");



CREATE UNIQUE INDEX "uq_company_settings_singleton" ON "public"."company_settings" USING "btree" ((true));



CREATE OR REPLACE VIEW "public"."v_contract_summary" AS
 SELECT "cc"."id",
    "cc"."client_id",
    "cc"."contract_name",
    "cc"."monthly_amount",
    "cc"."billing_cycle",
    "cc"."status",
    "cc"."start_date",
    "cc"."end_date",
    "c"."company_name" AS "client_name",
    "count"("cs"."id") AS "total_schedules",
    "count"("cs"."id") FILTER (WHERE (("cs"."status")::"text" = 'planned'::"text")) AS "planned_schedules",
    "count"("cs"."id") FILTER (WHERE (("cs"."status")::"text" = 'invoiced'::"text")) AS "invoiced_schedules",
    "count"("cs"."id") FILTER (WHERE (("cs"."status")::"text" = 'paid'::"text")) AS "paid_schedules",
    COALESCE("sum"("cs"."expected_amount") FILTER (WHERE (("cs"."status")::"text" = 'planned'::"text")), (0)::numeric) AS "expected_amount",
    COALESCE("sum"("cs"."expected_amount") FILTER (WHERE (("cs"."status")::"text" = 'invoiced'::"text")), (0)::numeric) AS "invoiced_amount",
    COALESCE("sum"("cs"."expected_amount") FILTER (WHERE (("cs"."status")::"text" = 'paid'::"text")), (0)::numeric) AS "paid_amount"
   FROM (("public"."client_contract" "cc"
     LEFT JOIN "public"."client" "c" ON (("c"."id" = "cc"."client_id")))
     LEFT JOIN "public"."contract_schedule" "cs" ON (("cs"."contract_id" = "cc"."id")))
  GROUP BY "cc"."id", "c"."company_name";



CREATE OR REPLACE VIEW "public"."v_invoice_payment_status" AS
 SELECT "i"."id",
    "i"."client_id",
    "i"."mandat_id",
    "i"."invoice_number",
    "i"."issue_date",
    "i"."due_date",
    "i"."total_ht",
    "i"."total_tva",
    "i"."total_ttc",
    "i"."status",
    "i"."pdf_path",
    "i"."created_at",
    "i"."updated_at",
    "i"."is_recurring",
    "i"."recurrence_day",
    "i"."parent_invoice_id",
    "i"."next_generation_date",
    "i"."auto_send",
    "i"."payment_date",
    "i"."end_date",
    "i"."max_occurrences",
    "i"."occurrences_count",
    "i"."source_contract_id",
    "i"."source_schedule_id",
    COALESCE("sum"("p"."amount"), (0)::numeric) AS "total_paid",
    ("i"."total_ttc" - COALESCE("sum"("p"."amount"), (0)::numeric)) AS "remaining_amount",
        CASE
            WHEN (COALESCE("sum"("p"."amount"), (0)::numeric) >= "i"."total_ttc") THEN 'fully_paid'::"text"
            WHEN (COALESCE("sum"("p"."amount"), (0)::numeric) > (0)::numeric) THEN 'partially_paid'::"text"
            ELSE 'unpaid'::"text"
        END AS "payment_status",
    "count"("p"."id") AS "payment_count"
   FROM ("public"."invoice" "i"
     LEFT JOIN "public"."payment" "p" ON ((("p"."invoice_id" = "i"."id") AND (("p"."status")::"text" = 'confirmed'::"text"))))
  GROUP BY "i"."id";



CREATE OR REPLACE TRIGGER "auto_create_editorial_calendar" AFTER INSERT ON "public"."social_media_strategy" FOR EACH ROW EXECUTE FUNCTION "public"."create_editorial_calendar_for_strategy"();



CREATE OR REPLACE TRIGGER "check_journal_balance_before_posting" BEFORE UPDATE ON "public"."accounting_journal_entry" FOR EACH ROW WHEN ((("old"."status" = 'draft'::"public"."journal_status") AND ("new"."status" = 'posted'::"public"."journal_status"))) EXECUTE FUNCTION "public"."check_journal_entry_balance"();



CREATE OR REPLACE TRIGGER "editorial_calendar_updated_at" BEFORE UPDATE ON "public"."editorial_calendar" FOR EACH ROW EXECUTE FUNCTION "public"."update_editorial_calendar_updated_at"();



CREATE OR REPLACE TRIGGER "editorial_post_updated_at" BEFORE UPDATE ON "public"."editorial_post" FOR EACH ROW EXECUTE FUNCTION "public"."update_editorial_post_updated_at"();



CREATE OR REPLACE TRIGGER "kpi_updated_at" BEFORE UPDATE ON "public"."kpi" FOR EACH ROW EXECUTE FUNCTION "public"."update_kpi_updated_at"();



CREATE OR REPLACE TRIGGER "log_prospect_status_change" AFTER UPDATE ON "public"."prospects" FOR EACH ROW EXECUTE FUNCTION "public"."log_pipeline_change"();



CREATE OR REPLACE TRIGGER "persona_updated_at" BEFORE UPDATE ON "public"."persona" FOR EACH ROW EXECUTE FUNCTION "public"."update_persona_updated_at"();



CREATE OR REPLACE TRIGGER "pilier_contenu_updated_at" BEFORE UPDATE ON "public"."pilier_contenu" FOR EACH ROW EXECUTE FUNCTION "public"."update_pilier_contenu_updated_at"();



CREATE OR REPLACE TRIGGER "trg_client_set_timestamp" BEFORE UPDATE ON "public"."client" FOR EACH ROW EXECUTE FUNCTION "public"."set_timestamp"();



CREATE OR REPLACE TRIGGER "trg_invoice_set_timestamp" BEFORE UPDATE ON "public"."invoice" FOR EACH ROW EXECUTE FUNCTION "public"."set_timestamp"();



CREATE OR REPLACE TRIGGER "trg_mandat_set_timestamp" BEFORE UPDATE ON "public"."mandat" FOR EACH ROW EXECUTE FUNCTION "public"."set_timestamp"();



CREATE OR REPLACE TRIGGER "trg_mandat_task_set_timestamp" BEFORE UPDATE ON "public"."mandat_task" FOR EACH ROW EXECUTE FUNCTION "public"."set_task_timestamp"();



CREATE OR REPLACE TRIGGER "trg_social_media_strategy_set_timestamp" BEFORE UPDATE ON "public"."social_media_strategy" FOR EACH ROW EXECUTE FUNCTION "public"."set_timestamp"();



CREATE OR REPLACE TRIGGER "trg_strategy_comments_set_timestamp" BEFORE UPDATE ON "public"."strategy_comments" FOR EACH ROW EXECUTE FUNCTION "public"."set_timestamp"();



CREATE OR REPLACE TRIGGER "trg_video_figurant_set_timestamp" BEFORE UPDATE ON "public"."video_figurant" FOR EACH ROW EXECUTE FUNCTION "public"."set_timestamp"();



CREATE OR REPLACE TRIGGER "trg_video_task_details_set_timestamp" BEFORE UPDATE ON "public"."video_task_details" FOR EACH ROW EXECUTE FUNCTION "public"."set_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_pitch_deck_assets_updated_at" BEFORE UPDATE ON "public"."pitch_deck_assets" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "trigger_pitch_deck_templates_updated_at" BEFORE UPDATE ON "public"."pitch_deck_templates" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "trigger_pitch_decks_updated_at" BEFORE UPDATE ON "public"."pitch_decks" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "trigger_update_creative_concept_updated_at" BEFORE UPDATE ON "public"."creative_concept" FOR EACH ROW EXECUTE FUNCTION "public"."update_creative_concept_updated_at"();



CREATE OR REPLACE TRIGGER "trigger_update_slide_count" BEFORE INSERT OR UPDATE OF "slides" ON "public"."pitch_decks" FOR EACH ROW EXECUTE FUNCTION "public"."update_pitch_deck_slide_count"();



CREATE OR REPLACE TRIGGER "update_activities_updated_at" BEFORE UPDATE ON "public"."activities" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_client_contract_updated_at" BEFORE UPDATE ON "public"."client_contract" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_client_package_updated_at" BEFORE UPDATE ON "public"."client_package" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_contacts_updated_at" BEFORE UPDATE ON "public"."contacts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_contract_schedule_updated_at" BEFORE UPDATE ON "public"."contract_schedule" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_last_contact_on_activity" AFTER INSERT ON "public"."activities" FOR EACH ROW EXECUTE FUNCTION "public"."update_prospect_last_contact"();



CREATE OR REPLACE TRIGGER "update_last_contact_on_meeting" AFTER INSERT ON "public"."meetings" FOR EACH ROW EXECUTE FUNCTION "public"."update_prospect_last_contact"();



CREATE OR REPLACE TRIGGER "update_meeting_minutes_updated_at" BEFORE UPDATE ON "public"."meeting_minutes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_meetings_updated_at" BEFORE UPDATE ON "public"."meetings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_package_feature_updated_at" BEFORE UPDATE ON "public"."package_feature" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_package_invoice_template_updated_at" BEFORE UPDATE ON "public"."package_invoice_template" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_package_mandat_template_updated_at" BEFORE UPDATE ON "public"."package_mandat_template" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_package_task_template_updated_at" BEFORE UPDATE ON "public"."package_task_template" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_payment_updated_at" BEFORE UPDATE ON "public"."payment" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_pitch_decks_updated_at" BEFORE UPDATE ON "public"."pitch_decks" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_prospects_updated_at" BEFORE UPDATE ON "public"."prospects" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_service_package_updated_at" BEFORE UPDATE ON "public"."service_package" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."accounting_account"
    ADD CONSTRAINT "accounting_account_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."accounting_account"("id");



ALTER TABLE ONLY "public"."accounting_document"
    ADD CONSTRAINT "accounting_document_journal_entry_id_fkey" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."accounting_journal_entry"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."accounting_integration_mapping"
    ADD CONSTRAINT "accounting_integration_mapping_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounting_account"("id");



ALTER TABLE ONLY "public"."accounting_journal_entry"
    ADD CONSTRAINT "accounting_journal_entry_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "public"."accounting_period"("id");



ALTER TABLE ONLY "public"."accounting_journal_line"
    ADD CONSTRAINT "accounting_journal_line_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounting_account"("id");



ALTER TABLE ONLY "public"."accounting_journal_line"
    ADD CONSTRAINT "accounting_journal_line_journal_entry_id_fkey" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."accounting_journal_entry"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."accounting_settings"
    ADD CONSTRAINT "accounting_settings_default_bank_account_id_fkey" FOREIGN KEY ("default_bank_account_id") REFERENCES "public"."accounting_account"("id");



ALTER TABLE ONLY "public"."accounting_settings"
    ADD CONSTRAINT "accounting_settings_default_payable_account_id_fkey" FOREIGN KEY ("default_payable_account_id") REFERENCES "public"."accounting_account"("id");



ALTER TABLE ONLY "public"."accounting_settings"
    ADD CONSTRAINT "accounting_settings_default_purchase_account_id_fkey" FOREIGN KEY ("default_purchase_account_id") REFERENCES "public"."accounting_account"("id");



ALTER TABLE ONLY "public"."accounting_settings"
    ADD CONSTRAINT "accounting_settings_default_receivable_account_id_fkey" FOREIGN KEY ("default_receivable_account_id") REFERENCES "public"."accounting_account"("id");



ALTER TABLE ONLY "public"."accounting_settings"
    ADD CONSTRAINT "accounting_settings_default_sales_account_id_fkey" FOREIGN KEY ("default_sales_account_id") REFERENCES "public"."accounting_account"("id");



ALTER TABLE ONLY "public"."accounting_settings"
    ADD CONSTRAINT "accounting_settings_default_tax_account_id_fkey" FOREIGN KEY ("default_tax_account_id") REFERENCES "public"."accounting_account"("id");



ALTER TABLE ONLY "public"."accounting_tax_rate"
    ADD CONSTRAINT "accounting_tax_rate_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounting_account"("id");



ALTER TABLE ONLY "public"."activities"
    ADD CONSTRAINT "activities_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."activities"
    ADD CONSTRAINT "activities_prospect_id_fkey" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."app_user"
    ADD CONSTRAINT "app_user_auth_user_fk" FOREIGN KEY ("auth_user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."app_user"
    ADD CONSTRAINT "app_user_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."app_user"
    ADD CONSTRAINT "app_user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."auth_users_audit"
    ADD CONSTRAINT "auth_users_audit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."client_contract"
    ADD CONSTRAINT "client_contract_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."client_contract"
    ADD CONSTRAINT "client_contract_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."client_contract"
    ADD CONSTRAINT "client_contract_mandat_id_fkey" FOREIGN KEY ("mandat_id") REFERENCES "public"."mandat"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."client_package"
    ADD CONSTRAINT "client_package_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."client_package"
    ADD CONSTRAINT "client_package_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."app_user"("id");



ALTER TABLE ONLY "public"."client_package"
    ADD CONSTRAINT "client_package_mandat_id_fkey" FOREIGN KEY ("mandat_id") REFERENCES "public"."mandat"("id");



ALTER TABLE ONLY "public"."client_package"
    ADD CONSTRAINT "client_package_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "public"."service_package"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_prospect_id_fkey" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contract_schedule"
    ADD CONSTRAINT "contract_schedule_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "public"."client_contract"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contract_schedule"
    ADD CONSTRAINT "contract_schedule_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoice"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."contrat"
    ADD CONSTRAINT "contrat_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contrat"
    ADD CONSTRAINT "contrat_mandat_id_fkey" FOREIGN KEY ("mandat_id") REFERENCES "public"."mandat"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."creative_concept"
    ADD CONSTRAINT "creative_concept_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."creative_concept"
    ADD CONSTRAINT "creative_concept_mandat_id_fkey" FOREIGN KEY ("mandat_id") REFERENCES "public"."mandat"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."editorial_calendar"
    ADD CONSTRAINT "editorial_calendar_strategy_id_fkey" FOREIGN KEY ("strategy_id") REFERENCES "public"."social_media_strategy"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."editorial_post"
    ADD CONSTRAINT "editorial_post_calendar_id_fkey" FOREIGN KEY ("calendar_id") REFERENCES "public"."editorial_calendar"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."editorial_post"
    ADD CONSTRAINT "editorial_post_pilier_id_fkey" FOREIGN KEY ("pilier_id") REFERENCES "public"."pilier_contenu"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."expense"
    ADD CONSTRAINT "expense_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."expense_category"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."expense"
    ADD CONSTRAINT "expense_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."expense"
    ADD CONSTRAINT "expense_mandat_id_fkey" FOREIGN KEY ("mandat_id") REFERENCES "public"."mandat"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."invoice"
    ADD CONSTRAINT "invoice_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."invoice_item"
    ADD CONSTRAINT "invoice_item_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoice"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."invoice"
    ADD CONSTRAINT "invoice_mandat_id_fkey" FOREIGN KEY ("mandat_id") REFERENCES "public"."mandat"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."invoice"
    ADD CONSTRAINT "invoice_parent_invoice_id_fkey" FOREIGN KEY ("parent_invoice_id") REFERENCES "public"."invoice"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."invoice"
    ADD CONSTRAINT "invoice_source_contract_id_fkey" FOREIGN KEY ("source_contract_id") REFERENCES "public"."client_contract"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."invoice"
    ADD CONSTRAINT "invoice_source_schedule_id_fkey" FOREIGN KEY ("source_schedule_id") REFERENCES "public"."contract_schedule"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."kpi_mesure"
    ADD CONSTRAINT "kpi_mesure_kpi_id_fkey" FOREIGN KEY ("kpi_id") REFERENCES "public"."kpi"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."kpi"
    ADD CONSTRAINT "kpi_strategy_id_fkey" FOREIGN KEY ("strategy_id") REFERENCES "public"."social_media_strategy"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mandat"
    ADD CONSTRAINT "mandat_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mandat_task"
    ADD CONSTRAINT "mandat_task_mandat_id_fkey" FOREIGN KEY ("mandat_id") REFERENCES "public"."mandat"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."meeting_minutes"
    ADD CONSTRAINT "meeting_minutes_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."meeting_minutes"
    ADD CONSTRAINT "meeting_minutes_prospect_id_fkey" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."meetings"
    ADD CONSTRAINT "meetings_prospect_id_fkey" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."package_feature"
    ADD CONSTRAINT "package_feature_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "public"."service_package"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."package_invoice_template"
    ADD CONSTRAINT "package_invoice_template_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "public"."service_package"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."package_mandat_template"
    ADD CONSTRAINT "package_mandat_template_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "public"."service_package"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."package_task_template"
    ADD CONSTRAINT "package_task_template_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "public"."service_package"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payment"
    ADD CONSTRAINT "payment_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."payment"
    ADD CONSTRAINT "payment_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."payment"
    ADD CONSTRAINT "payment_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoice"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."persona"
    ADD CONSTRAINT "persona_strategy_id_fkey" FOREIGN KEY ("strategy_id") REFERENCES "public"."social_media_strategy"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pilier_contenu"
    ADD CONSTRAINT "pilier_contenu_strategy_id_fkey" FOREIGN KEY ("strategy_id") REFERENCES "public"."social_media_strategy"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pipeline_history"
    ADD CONSTRAINT "pipeline_history_prospect_id_fkey" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pitch_deck_assets"
    ADD CONSTRAINT "pitch_deck_assets_pitch_deck_id_fkey" FOREIGN KEY ("pitch_deck_id") REFERENCES "public"."pitch_decks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pitch_deck_versions"
    ADD CONSTRAINT "pitch_deck_versions_pitch_deck_id_fkey" FOREIGN KEY ("pitch_deck_id") REFERENCES "public"."pitch_decks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pitch_decks"
    ADD CONSTRAINT "pitch_decks_parent_deck_id_fkey" FOREIGN KEY ("parent_deck_id") REFERENCES "public"."pitch_decks"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."pitch_decks"
    ADD CONSTRAINT "pitch_decks_prospect_id_fkey" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."security_logs"
    ADD CONSTRAINT "security_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."app_user"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."security_notifications"
    ADD CONSTRAINT "security_notifications_security_log_id_fkey" FOREIGN KEY ("security_log_id") REFERENCES "public"."security_logs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."security_notifications"
    ADD CONSTRAINT "security_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."app_user"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."service_package"
    ADD CONSTRAINT "service_package_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."app_user"("id");



ALTER TABLE ONLY "public"."social_media_strategy"
    ADD CONSTRAINT "social_media_strategy_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."strategy_comments"
    ADD CONSTRAINT "strategy_comments_admin_response_by_fkey" FOREIGN KEY ("admin_response_by") REFERENCES "public"."app_user"("id");



ALTER TABLE ONLY "public"."strategy_comments"
    ADD CONSTRAINT "strategy_comments_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."strategy_comments"
    ADD CONSTRAINT "strategy_comments_strategy_id_fkey" FOREIGN KEY ("strategy_id") REFERENCES "public"."social_media_strategy"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."strategy_comments"
    ADD CONSTRAINT "strategy_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."app_user"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."video_figurant"
    ADD CONSTRAINT "video_figurant_video_task_id_fkey" FOREIGN KEY ("video_task_id") REFERENCES "public"."video_task_details"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."video_script"
    ADD CONSTRAINT "video_script_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."video_script"
    ADD CONSTRAINT "video_script_editorial_post_id_fkey" FOREIGN KEY ("editorial_post_id") REFERENCES "public"."editorial_post"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."video_script"
    ADD CONSTRAINT "video_script_mandat_id_fkey" FOREIGN KEY ("mandat_id") REFERENCES "public"."mandat"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."video_task_details"
    ADD CONSTRAINT "video_task_details_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."mandat_task"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can do everything on creative_concept" ON "public"."creative_concept" USING ((EXISTS ( SELECT 1
   FROM "public"."app_user"
  WHERE (("app_user"."auth_user_id" = "auth"."uid"()) AND ("app_user"."role_id" = 1)))));



CREATE POLICY "Admins can view all notifications" ON "public"."security_notifications" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."app_user"
  WHERE (("app_user"."id" = ("current_setting"('app.user_id'::"text", true))::integer) AND ("app_user"."role_id" = 1)))));



CREATE POLICY "Admins can view all security logs" ON "public"."security_logs" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."app_user"
  WHERE (("app_user"."id" = ("current_setting"('app.user_id'::"text", true))::integer) AND ("app_user"."role_id" = 1)))));



CREATE POLICY "Admins can view login attempts" ON "public"."login_attempts" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."app_user"
  WHERE (("app_user"."id" = ("current_setting"('app.user_id'::"text", true))::integer) AND ("app_user"."role_id" = 1)))));



CREATE POLICY "Allow all authenticated access" ON "public"."strategy_comments" USING (true) WITH CHECK (true);



CREATE POLICY "Clients can update their concepts status" ON "public"."creative_concept" FOR UPDATE USING (("client_id" IN ( SELECT "app_user"."client_id"
   FROM "public"."app_user"
  WHERE ("app_user"."auth_user_id" = "auth"."uid"())))) WITH CHECK (("client_id" IN ( SELECT "app_user"."client_id"
   FROM "public"."app_user"
  WHERE ("app_user"."auth_user_id" = "auth"."uid"()))));



CREATE POLICY "Clients can view their concepts" ON "public"."creative_concept" FOR SELECT USING (("client_id" IN ( SELECT "app_user"."client_id"
   FROM "public"."app_user"
  WHERE ("app_user"."auth_user_id" = "auth"."uid"()))));



CREATE POLICY "Only admins can view auth_users_audit" ON "public"."auth_users_audit" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("auth"."uid"() = "users"."id") AND (("users"."raw_user_meta_data" ->> 'role'::"text") = 'admin'::"text")))));



CREATE POLICY "Only admins can view ip_blacklist" ON "public"."ip_blacklist" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("auth"."uid"() = "users"."id") AND (("users"."raw_user_meta_data" ->> 'role'::"text") = 'admin'::"text")))));



CREATE POLICY "Only admins can view sql_injection_attempts" ON "public"."sql_injection_attempts" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("auth"."uid"() = "users"."id") AND (("users"."raw_user_meta_data" ->> 'role'::"text") = 'admin'::"text")))));



CREATE POLICY "System can insert notifications" ON "public"."security_notifications" FOR INSERT WITH CHECK (true);



CREATE POLICY "System can insert security logs" ON "public"."security_logs" FOR INSERT WITH CHECK (true);



CREATE POLICY "System can manage login attempts" ON "public"."login_attempts" WITH CHECK (true);



CREATE POLICY "Users can delete calendars" ON "public"."editorial_calendar" FOR DELETE USING (true);



CREATE POLICY "Users can delete kpi measures" ON "public"."kpi_mesure" FOR DELETE USING (true);



CREATE POLICY "Users can delete kpis" ON "public"."kpi" FOR DELETE USING (true);



CREATE POLICY "Users can delete personas" ON "public"."persona" FOR DELETE USING (true);



CREATE POLICY "Users can delete piliers" ON "public"."pilier_contenu" FOR DELETE USING (true);



CREATE POLICY "Users can delete posts" ON "public"."editorial_post" FOR DELETE USING (true);



CREATE POLICY "Users can insert calendars" ON "public"."editorial_calendar" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can insert kpi measures" ON "public"."kpi_mesure" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can insert kpis" ON "public"."kpi" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can insert personas" ON "public"."persona" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can insert piliers" ON "public"."pilier_contenu" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can insert posts" ON "public"."editorial_post" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can update calendars" ON "public"."editorial_calendar" FOR UPDATE USING (true);



CREATE POLICY "Users can update kpi measures" ON "public"."kpi_mesure" FOR UPDATE USING (true);



CREATE POLICY "Users can update kpis" ON "public"."kpi" FOR UPDATE USING (true);



CREATE POLICY "Users can update personas" ON "public"."persona" FOR UPDATE USING (true);



CREATE POLICY "Users can update piliers" ON "public"."pilier_contenu" FOR UPDATE USING (true);



CREATE POLICY "Users can update posts" ON "public"."editorial_post" FOR UPDATE USING (true);



CREATE POLICY "Users can view all calendars" ON "public"."editorial_calendar" FOR SELECT USING (true);



CREATE POLICY "Users can view all kpi measures" ON "public"."kpi_mesure" FOR SELECT USING (true);



CREATE POLICY "Users can view all kpis" ON "public"."kpi" FOR SELECT USING (true);



CREATE POLICY "Users can view all personas" ON "public"."persona" FOR SELECT USING (true);



CREATE POLICY "Users can view all piliers" ON "public"."pilier_contenu" FOR SELECT USING (true);



CREATE POLICY "Users can view all posts" ON "public"."editorial_post" FOR SELECT USING (true);



CREATE POLICY "Users can view their own notifications" ON "public"."security_notifications" FOR SELECT USING (("user_id" = ("current_setting"('app.user_id'::"text", true))::integer));



ALTER TABLE "public"."activities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."activity_log" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "admin_all_activities" ON "public"."activities" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_activity_log" ON "public"."activity_log" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_app_user" ON "public"."app_user" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_audit_log" ON "public"."audit_log" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_client" ON "public"."client" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_company_settings" ON "public"."company_settings" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_contacts" ON "public"."contacts" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_contrat" ON "public"."contrat" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_editorial_calendar" ON "public"."editorial_calendar" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_editorial_post" ON "public"."editorial_post" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_expense" ON "public"."expense" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_expense_category" ON "public"."expense_category" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_invoice" ON "public"."invoice" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_invoice_item" ON "public"."invoice_item" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_kpi" ON "public"."kpi" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_mandat" ON "public"."mandat" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_mandat_task" ON "public"."mandat_task" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_meeting_minutes" ON "public"."meeting_minutes" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_meetings" ON "public"."meetings" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_persona" ON "public"."persona" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_pilier_contenu" ON "public"."pilier_contenu" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_pipeline_history" ON "public"."pipeline_history" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_pitch_deck_assets" ON "public"."pitch_deck_assets" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_pitch_deck_templates" ON "public"."pitch_deck_templates" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_pitch_deck_versions" ON "public"."pitch_deck_versions" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_pitch_decks" ON "public"."pitch_decks" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_prospects" ON "public"."prospects" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_role" ON "public"."role" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_social_media_strategy" ON "public"."social_media_strategy" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_user_session" ON "public"."user_session" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_video_figurant" ON "public"."video_figurant" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_video_script" ON "public"."video_script" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "admin_all_video_task_details" ON "public"."video_task_details" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



ALTER TABLE "public"."app_user" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."audit_log" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."auth_users_audit" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "auth_users_audit_admin_select" ON "public"."auth_users_audit" FOR SELECT USING ("public"."is_current_user_admin"());



CREATE POLICY "authenticated_read_roles" ON "public"."role" FOR SELECT USING ("public"."is_authenticated"());



ALTER TABLE "public"."client" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."client_contract" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "client_contract_admin_access" ON "public"."client_contract" USING ((EXISTS ( SELECT 1
   FROM "public"."app_user"
  WHERE (("app_user"."auth_user_id" = "auth"."uid"()) AND ("app_user"."role_id" = 1)))));



CREATE POLICY "client_contract_client_access" ON "public"."client_contract" FOR SELECT USING (("client_id" IN ( SELECT "client"."id"
   FROM "public"."client"
  WHERE ("client"."id" = ( SELECT "app_user"."client_id"
           FROM "public"."app_user"
          WHERE ("app_user"."auth_user_id" = "auth"."uid"()))))));



CREATE POLICY "client_select_own_calendars" ON "public"."editorial_calendar" FOR SELECT USING (("public"."is_client"() AND (EXISTS ( SELECT 1
   FROM "public"."social_media_strategy" "s"
  WHERE (("s"."id" = "editorial_calendar"."strategy_id") AND ("s"."client_id" = "public"."current_user_client_id"()))))));



CREATE POLICY "client_select_own_client" ON "public"."client" FOR SELECT USING (("public"."is_client"() AND ("id" = "public"."current_user_client_id"())));



CREATE POLICY "client_select_own_contrats" ON "public"."contrat" FOR SELECT USING (("public"."is_client"() AND ("client_id" = "public"."current_user_client_id"())));



CREATE POLICY "client_select_own_invoice_items" ON "public"."invoice_item" FOR SELECT USING (("public"."is_client"() AND (EXISTS ( SELECT 1
   FROM "public"."invoice" "i"
  WHERE (("i"."id" = "invoice_item"."invoice_id") AND ("i"."client_id" = "public"."current_user_client_id"()))))));



CREATE POLICY "client_select_own_invoices" ON "public"."invoice" FOR SELECT USING (("public"."is_client"() AND ("client_id" = "public"."current_user_client_id"())));



CREATE POLICY "client_select_own_mandat_tasks" ON "public"."mandat_task" FOR SELECT USING (("public"."is_client"() AND (EXISTS ( SELECT 1
   FROM "public"."mandat" "m"
  WHERE (("m"."id" = "mandat_task"."mandat_id") AND ("m"."client_id" = "public"."current_user_client_id"()))))));



CREATE POLICY "client_select_own_mandats" ON "public"."mandat" FOR SELECT USING (("public"."is_client"() AND ("client_id" = "public"."current_user_client_id"())));



CREATE POLICY "client_select_own_posts" ON "public"."editorial_post" FOR SELECT USING (("public"."is_client"() AND (EXISTS ( SELECT 1
   FROM ("public"."editorial_calendar" "c"
     JOIN "public"."social_media_strategy" "s" ON (("s"."id" = "c"."strategy_id")))
  WHERE (("c"."id" = "editorial_post"."calendar_id") AND ("s"."client_id" = "public"."current_user_client_id"()))))));



CREATE POLICY "client_select_own_strategies" ON "public"."social_media_strategy" FOR SELECT USING (("public"."is_client"() AND ("client_id" = "public"."current_user_client_id"())));



CREATE POLICY "client_select_own_video_scripts" ON "public"."video_script" FOR SELECT USING (("public"."is_client"() AND ((("client_id" IS NOT NULL) AND ("client_id" = "public"."current_user_client_id"())) OR (("mandat_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."mandat" "m"
  WHERE (("m"."id" = "video_script"."mandat_id") AND ("m"."client_id" = "public"."current_user_client_id"()))))) OR (("editorial_post_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM (("public"."editorial_post" "p"
     JOIN "public"."editorial_calendar" "c" ON (("c"."id" = "p"."calendar_id")))
     JOIN "public"."social_media_strategy" "s" ON (("s"."id" = "c"."strategy_id")))
  WHERE (("p"."id" = "video_script"."editorial_post_id") AND ("s"."client_id" = "public"."current_user_client_id"()))))))));



ALTER TABLE "public"."company_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contacts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contract_schedule" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "contract_schedule_admin_access" ON "public"."contract_schedule" USING ((EXISTS ( SELECT 1
   FROM "public"."app_user"
  WHERE (("app_user"."auth_user_id" = "auth"."uid"()) AND ("app_user"."role_id" = 1)))));



CREATE POLICY "contract_schedule_client_access" ON "public"."contract_schedule" FOR SELECT USING (("contract_id" IN ( SELECT "client_contract"."id"
   FROM "public"."client_contract"
  WHERE ("client_contract"."client_id" IN ( SELECT "client"."id"
           FROM "public"."client"
          WHERE ("client"."id" = ( SELECT "app_user"."client_id"
                   FROM "public"."app_user"
                  WHERE ("app_user"."auth_user_id" = "auth"."uid"()))))))));



ALTER TABLE "public"."contrat" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."creative_concept" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."editorial_calendar" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."editorial_post" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."expense" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."expense_category" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."invoice" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."invoice_item" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ip_blacklist" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "ip_blacklist_admin_select" ON "public"."ip_blacklist" FOR SELECT USING ("public"."is_current_user_admin"());



ALTER TABLE "public"."kpi" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."kpi_mesure" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."login_attempts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mandat" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mandat_task" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."meeting_minutes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."meetings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payment" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "payment_admin_access" ON "public"."payment" USING ((EXISTS ( SELECT 1
   FROM "public"."app_user"
  WHERE (("app_user"."auth_user_id" = "auth"."uid"()) AND ("app_user"."role_id" = 1)))));



CREATE POLICY "payment_client_access" ON "public"."payment" FOR SELECT USING (("client_id" IN ( SELECT "client"."id"
   FROM "public"."client"
  WHERE ("client"."id" = ( SELECT "app_user"."client_id"
           FROM "public"."app_user"
          WHERE ("app_user"."auth_user_id" = "auth"."uid"()))))));



ALTER TABLE "public"."persona" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pilier_contenu" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pipeline_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pitch_deck_assets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pitch_deck_templates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pitch_deck_versions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pitch_decks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."prospects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."role" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."security_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."security_notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."social_media_strategy" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sql_injection_attempts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "sql_injection_attempts_admin_select" ON "public"."sql_injection_attempts" FOR SELECT USING ("public"."is_current_user_admin"());



ALTER TABLE "public"."strategy_comments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_read_own_profile" ON "public"."app_user" FOR SELECT USING (("public"."is_authenticated"() AND ("id" = "public"."current_app_user_id"())));



ALTER TABLE "public"."user_session" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."video_figurant" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."video_script" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."video_task_details" ENABLE ROW LEVEL SECURITY;


REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."audit_auth_users_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."audit_auth_users_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."audit_auth_users_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."blacklist_ip"("p_ip_address" "inet", "p_reason" "text", "p_duration_hours" integer, "p_is_permanent" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."blacklist_ip"("p_ip_address" "inet", "p_reason" "text", "p_duration_hours" integer, "p_is_permanent" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."blacklist_ip"("p_ip_address" "inet", "p_reason" "text", "p_duration_hours" integer, "p_is_permanent" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_contract_end_date"("p_start_date" "date", "p_duration_months" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_contract_end_date"("p_start_date" "date", "p_duration_months" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_contract_end_date"("p_start_date" "date", "p_duration_months" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."check_journal_entry_balance"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_journal_entry_balance"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_journal_entry_balance"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_login_attempts"("p_email" character varying, "p_ip_address" "inet") TO "anon";
GRANT ALL ON FUNCTION "public"."check_login_attempts"("p_email" character varying, "p_ip_address" "inet") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_login_attempts"("p_email" character varying, "p_ip_address" "inet") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_user_permission"("p_user_id" integer, "p_required_role" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."check_user_permission"("p_user_id" integer, "p_required_role" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_user_permission"("p_user_id" integer, "p_required_role" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_expired_sessions"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_expired_sessions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_expired_sessions"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_editorial_calendar_for_strategy"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_editorial_calendar_for_strategy"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_editorial_calendar_for_strategy"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_security_notification"("p_user_id" integer, "p_security_log_id" bigint, "p_notification_type" character varying, "p_title" character varying, "p_message" "text", "p_severity" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."create_security_notification"("p_user_id" integer, "p_security_log_id" bigint, "p_notification_type" character varying, "p_title" character varying, "p_message" "text", "p_severity" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_security_notification"("p_user_id" integer, "p_security_log_id" bigint, "p_notification_type" character varying, "p_title" character varying, "p_message" "text", "p_severity" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."current_app_user_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."current_app_user_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_app_user_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."current_user_client_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."current_user_client_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_user_client_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."current_user_role_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."current_user_role_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_user_role_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."detect_suspicious_login"("p_user_id" integer, "p_ip_address" "inet", "p_device_info" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."detect_suspicious_login"("p_user_id" integer, "p_ip_address" "inet", "p_device_info" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."detect_suspicious_login"("p_user_id" integer, "p_ip_address" "inet", "p_device_info" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."force_password_reset_all_users"() TO "anon";
GRANT ALL ON FUNCTION "public"."force_password_reset_all_users"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."force_password_reset_all_users"() TO "service_role";



GRANT ALL ON FUNCTION "public"."force_user_password_reset"("user_id" bigint, "alert_message" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."force_user_password_reset"("user_id" bigint, "alert_message" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."force_user_password_reset"("user_id" bigint, "alert_message" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_current_user_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_current_user_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_current_user_role"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_next_invoice_date"("p_from_date" "date", "p_invoice_day" integer, "p_billing_cycle" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."get_next_invoice_date"("p_from_date" "date", "p_invoice_day" integer, "p_billing_cycle" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_next_invoice_date"("p_from_date" "date", "p_invoice_day" integer, "p_billing_cycle" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_authenticated"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_authenticated"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_authenticated"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_client"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_client"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_client"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_current_user_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_current_user_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_current_user_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_ip_blacklisted"("p_ip_address" "inet") TO "anon";
GRANT ALL ON FUNCTION "public"."is_ip_blacklisted"("p_ip_address" "inet") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_ip_blacklisted"("p_ip_address" "inet") TO "service_role";



GRANT ALL ON FUNCTION "public"."log_activity"("p_user_id" integer, "p_action" character varying, "p_entity_type" character varying, "p_entity_id" integer, "p_details" "jsonb", "p_ip_address" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."log_activity"("p_user_id" integer, "p_action" character varying, "p_entity_type" character varying, "p_entity_id" integer, "p_details" "jsonb", "p_ip_address" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_activity"("p_user_id" integer, "p_action" character varying, "p_entity_type" character varying, "p_entity_id" integer, "p_details" "jsonb", "p_ip_address" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."log_failed_login_attempt"("user_email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."log_failed_login_attempt"("user_email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_failed_login_attempt"("user_email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."log_pipeline_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_pipeline_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_pipeline_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_security_event"("p_user_id" integer, "p_auth_user_id" "uuid", "p_event_type" character varying, "p_event_status" character varying, "p_email" character varying, "p_ip_address" "inet", "p_user_agent" "text", "p_device_info" "jsonb", "p_location_info" "jsonb", "p_metadata" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."log_security_event"("p_user_id" integer, "p_auth_user_id" "uuid", "p_event_type" character varying, "p_event_status" character varying, "p_email" character varying, "p_ip_address" "inet", "p_user_agent" "text", "p_device_info" "jsonb", "p_location_info" "jsonb", "p_metadata" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_security_event"("p_user_id" integer, "p_auth_user_id" "uuid", "p_event_type" character varying, "p_event_status" character varying, "p_email" character varying, "p_ip_address" "inet", "p_user_agent" "text", "p_device_info" "jsonb", "p_location_info" "jsonb", "p_metadata" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."mark_schedule_as_invoiced"("p_schedule_id" bigint, "p_invoice_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."mark_schedule_as_invoiced"("p_schedule_id" bigint, "p_invoice_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."mark_schedule_as_invoiced"("p_schedule_id" bigint, "p_invoice_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."mark_schedule_as_paid"("p_schedule_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."mark_schedule_as_paid"("p_schedule_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."mark_schedule_as_paid"("p_schedule_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."on_auth_user_created"() TO "anon";
GRANT ALL ON FUNCTION "public"."on_auth_user_created"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."on_auth_user_created"() TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_accounting_balances"() TO "anon";
GRANT ALL ON FUNCTION "public"."refresh_accounting_balances"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."refresh_accounting_balances"() TO "service_role";



GRANT ALL ON FUNCTION "public"."reset_failed_login_attempts"("user_auth_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."reset_failed_login_attempts"("user_auth_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."reset_failed_login_attempts"("user_auth_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_task_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_task_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_task_timestamp"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_timestamp"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_auth_audit_to_security_logs"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_auth_audit_to_security_logs"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_auth_audit_to_security_logs"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_account_balance"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_account_balance"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_account_balance"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_creative_concept_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_creative_concept_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_creative_concept_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_editorial_calendar_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_editorial_calendar_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_editorial_calendar_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_editorial_post_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_editorial_post_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_editorial_post_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_kpi_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_kpi_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_kpi_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_persona_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_persona_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_persona_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_pilier_contenu_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_pilier_contenu_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_pilier_contenu_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_pitch_deck_slide_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_pitch_deck_slide_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_pitch_deck_slide_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_prospect_last_contact"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_prospect_last_contact"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_prospect_last_contact"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_input"("p_input" "text", "p_input_type" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."validate_input"("p_input" "text", "p_input_type" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_input"("p_input" "text", "p_input_type" character varying) TO "service_role";



GRANT ALL ON TABLE "public"."accounting_account" TO "anon";
GRANT ALL ON TABLE "public"."accounting_account" TO "authenticated";
GRANT ALL ON TABLE "public"."accounting_account" TO "service_role";



GRANT ALL ON TABLE "public"."accounting_journal_entry" TO "anon";
GRANT ALL ON TABLE "public"."accounting_journal_entry" TO "authenticated";
GRANT ALL ON TABLE "public"."accounting_journal_entry" TO "service_role";



GRANT ALL ON TABLE "public"."accounting_journal_line" TO "anon";
GRANT ALL ON TABLE "public"."accounting_journal_line" TO "authenticated";
GRANT ALL ON TABLE "public"."accounting_journal_line" TO "service_role";



GRANT ALL ON TABLE "public"."accounting_account_balance" TO "anon";
GRANT ALL ON TABLE "public"."accounting_account_balance" TO "authenticated";
GRANT ALL ON TABLE "public"."accounting_account_balance" TO "service_role";



GRANT ALL ON SEQUENCE "public"."accounting_account_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."accounting_account_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."accounting_account_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."accounting_audit_log" TO "anon";
GRANT ALL ON TABLE "public"."accounting_audit_log" TO "authenticated";
GRANT ALL ON TABLE "public"."accounting_audit_log" TO "service_role";



GRANT ALL ON SEQUENCE "public"."accounting_audit_log_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."accounting_audit_log_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."accounting_audit_log_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."accounting_document" TO "anon";
GRANT ALL ON TABLE "public"."accounting_document" TO "authenticated";
GRANT ALL ON TABLE "public"."accounting_document" TO "service_role";



GRANT ALL ON SEQUENCE "public"."accounting_document_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."accounting_document_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."accounting_document_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."accounting_integration_mapping" TO "anon";
GRANT ALL ON TABLE "public"."accounting_integration_mapping" TO "authenticated";
GRANT ALL ON TABLE "public"."accounting_integration_mapping" TO "service_role";



GRANT ALL ON SEQUENCE "public"."accounting_integration_mapping_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."accounting_integration_mapping_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."accounting_integration_mapping_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."accounting_journal_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."accounting_journal_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."accounting_journal_entry_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."accounting_journal_line_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."accounting_journal_line_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."accounting_journal_line_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."accounting_period" TO "anon";
GRANT ALL ON TABLE "public"."accounting_period" TO "authenticated";
GRANT ALL ON TABLE "public"."accounting_period" TO "service_role";



GRANT ALL ON SEQUENCE "public"."accounting_period_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."accounting_period_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."accounting_period_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."accounting_reconciliation" TO "anon";
GRANT ALL ON TABLE "public"."accounting_reconciliation" TO "authenticated";
GRANT ALL ON TABLE "public"."accounting_reconciliation" TO "service_role";



GRANT ALL ON SEQUENCE "public"."accounting_reconciliation_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."accounting_reconciliation_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."accounting_reconciliation_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."accounting_recurring_template" TO "anon";
GRANT ALL ON TABLE "public"."accounting_recurring_template" TO "authenticated";
GRANT ALL ON TABLE "public"."accounting_recurring_template" TO "service_role";



GRANT ALL ON SEQUENCE "public"."accounting_recurring_template_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."accounting_recurring_template_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."accounting_recurring_template_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."accounting_settings" TO "anon";
GRANT ALL ON TABLE "public"."accounting_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."accounting_settings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."accounting_settings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."accounting_settings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."accounting_settings_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."accounting_tax_rate" TO "anon";
GRANT ALL ON TABLE "public"."accounting_tax_rate" TO "authenticated";
GRANT ALL ON TABLE "public"."accounting_tax_rate" TO "service_role";



GRANT ALL ON SEQUENCE "public"."accounting_tax_rate_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."accounting_tax_rate_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."accounting_tax_rate_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."activities" TO "anon";
GRANT ALL ON TABLE "public"."activities" TO "authenticated";
GRANT ALL ON TABLE "public"."activities" TO "service_role";



GRANT ALL ON SEQUENCE "public"."activities_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."activities_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."activities_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."activity_log" TO "anon";
GRANT ALL ON TABLE "public"."activity_log" TO "authenticated";
GRANT ALL ON TABLE "public"."activity_log" TO "service_role";



GRANT ALL ON SEQUENCE "public"."activity_log_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."activity_log_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."activity_log_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."app_user" TO "anon";
GRANT ALL ON TABLE "public"."app_user" TO "authenticated";
GRANT ALL ON TABLE "public"."app_user" TO "service_role";



GRANT ALL ON SEQUENCE "public"."app_user_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."app_user_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."app_user_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."audit_log" TO "anon";
GRANT ALL ON TABLE "public"."audit_log" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_log" TO "service_role";



GRANT ALL ON SEQUENCE "public"."audit_log_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."audit_log_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."audit_log_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."auth_users_audit" TO "anon";
GRANT ALL ON TABLE "public"."auth_users_audit" TO "authenticated";
GRANT ALL ON TABLE "public"."auth_users_audit" TO "service_role";



GRANT ALL ON SEQUENCE "public"."auth_users_audit_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."auth_users_audit_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."auth_users_audit_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."client" TO "anon";
GRANT ALL ON TABLE "public"."client" TO "authenticated";
GRANT ALL ON TABLE "public"."client" TO "service_role";



GRANT ALL ON TABLE "public"."client_contract" TO "anon";
GRANT ALL ON TABLE "public"."client_contract" TO "authenticated";
GRANT ALL ON TABLE "public"."client_contract" TO "service_role";



GRANT ALL ON SEQUENCE "public"."client_contract_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."client_contract_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."client_contract_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."client_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."client_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."client_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."client_package" TO "anon";
GRANT ALL ON TABLE "public"."client_package" TO "authenticated";
GRANT ALL ON TABLE "public"."client_package" TO "service_role";



GRANT ALL ON SEQUENCE "public"."client_package_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."client_package_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."client_package_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."company_settings" TO "anon";
GRANT ALL ON TABLE "public"."company_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."company_settings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."company_settings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."company_settings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."company_settings_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."contacts" TO "anon";
GRANT ALL ON TABLE "public"."contacts" TO "authenticated";
GRANT ALL ON TABLE "public"."contacts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."contacts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."contacts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."contacts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."contract_schedule" TO "anon";
GRANT ALL ON TABLE "public"."contract_schedule" TO "authenticated";
GRANT ALL ON TABLE "public"."contract_schedule" TO "service_role";



GRANT ALL ON SEQUENCE "public"."contract_schedule_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."contract_schedule_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."contract_schedule_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."contrat" TO "anon";
GRANT ALL ON TABLE "public"."contrat" TO "authenticated";
GRANT ALL ON TABLE "public"."contrat" TO "service_role";



GRANT ALL ON SEQUENCE "public"."contrat_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."contrat_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."contrat_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."creative_concept" TO "anon";
GRANT ALL ON TABLE "public"."creative_concept" TO "authenticated";
GRANT ALL ON TABLE "public"."creative_concept" TO "service_role";



GRANT ALL ON SEQUENCE "public"."creative_concept_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."creative_concept_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."creative_concept_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."editorial_calendar" TO "anon";
GRANT ALL ON TABLE "public"."editorial_calendar" TO "authenticated";
GRANT ALL ON TABLE "public"."editorial_calendar" TO "service_role";



GRANT ALL ON SEQUENCE "public"."editorial_calendar_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."editorial_calendar_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."editorial_calendar_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."editorial_post" TO "anon";
GRANT ALL ON TABLE "public"."editorial_post" TO "authenticated";
GRANT ALL ON TABLE "public"."editorial_post" TO "service_role";



GRANT ALL ON SEQUENCE "public"."editorial_post_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."editorial_post_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."editorial_post_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."expense" TO "anon";
GRANT ALL ON TABLE "public"."expense" TO "authenticated";
GRANT ALL ON TABLE "public"."expense" TO "service_role";



GRANT ALL ON TABLE "public"."expense_category" TO "anon";
GRANT ALL ON TABLE "public"."expense_category" TO "authenticated";
GRANT ALL ON TABLE "public"."expense_category" TO "service_role";



GRANT ALL ON SEQUENCE "public"."expense_category_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."expense_category_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."expense_category_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."expense_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."expense_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."expense_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."invoice" TO "anon";
GRANT ALL ON TABLE "public"."invoice" TO "authenticated";
GRANT ALL ON TABLE "public"."invoice" TO "service_role";



GRANT ALL ON SEQUENCE "public"."invoice_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."invoice_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."invoice_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."invoice_item" TO "anon";
GRANT ALL ON TABLE "public"."invoice_item" TO "authenticated";
GRANT ALL ON TABLE "public"."invoice_item" TO "service_role";



GRANT ALL ON SEQUENCE "public"."invoice_item_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."invoice_item_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."invoice_item_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."ip_blacklist" TO "anon";
GRANT ALL ON TABLE "public"."ip_blacklist" TO "authenticated";
GRANT ALL ON TABLE "public"."ip_blacklist" TO "service_role";



GRANT ALL ON SEQUENCE "public"."ip_blacklist_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ip_blacklist_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ip_blacklist_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."kpi" TO "anon";
GRANT ALL ON TABLE "public"."kpi" TO "authenticated";
GRANT ALL ON TABLE "public"."kpi" TO "service_role";



GRANT ALL ON SEQUENCE "public"."kpi_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."kpi_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."kpi_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."kpi_mesure" TO "anon";
GRANT ALL ON TABLE "public"."kpi_mesure" TO "authenticated";
GRANT ALL ON TABLE "public"."kpi_mesure" TO "service_role";



GRANT ALL ON SEQUENCE "public"."kpi_mesure_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."kpi_mesure_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."kpi_mesure_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."login_attempts" TO "anon";
GRANT ALL ON TABLE "public"."login_attempts" TO "authenticated";
GRANT ALL ON TABLE "public"."login_attempts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."login_attempts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."login_attempts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."login_attempts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."mandat" TO "anon";
GRANT ALL ON TABLE "public"."mandat" TO "authenticated";
GRANT ALL ON TABLE "public"."mandat" TO "service_role";



GRANT ALL ON SEQUENCE "public"."mandat_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mandat_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mandat_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."mandat_task" TO "anon";
GRANT ALL ON TABLE "public"."mandat_task" TO "authenticated";
GRANT ALL ON TABLE "public"."mandat_task" TO "service_role";



GRANT ALL ON SEQUENCE "public"."mandat_task_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mandat_task_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mandat_task_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."meeting_minutes" TO "anon";
GRANT ALL ON TABLE "public"."meeting_minutes" TO "authenticated";
GRANT ALL ON TABLE "public"."meeting_minutes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."meeting_minutes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."meeting_minutes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."meeting_minutes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."meetings" TO "anon";
GRANT ALL ON TABLE "public"."meetings" TO "authenticated";
GRANT ALL ON TABLE "public"."meetings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."meetings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."meetings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."meetings_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."package_feature" TO "anon";
GRANT ALL ON TABLE "public"."package_feature" TO "authenticated";
GRANT ALL ON TABLE "public"."package_feature" TO "service_role";



GRANT ALL ON SEQUENCE "public"."package_feature_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."package_feature_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."package_feature_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."package_invoice_template" TO "anon";
GRANT ALL ON TABLE "public"."package_invoice_template" TO "authenticated";
GRANT ALL ON TABLE "public"."package_invoice_template" TO "service_role";



GRANT ALL ON SEQUENCE "public"."package_invoice_template_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."package_invoice_template_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."package_invoice_template_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."package_mandat_template" TO "anon";
GRANT ALL ON TABLE "public"."package_mandat_template" TO "authenticated";
GRANT ALL ON TABLE "public"."package_mandat_template" TO "service_role";



GRANT ALL ON SEQUENCE "public"."package_mandat_template_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."package_mandat_template_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."package_mandat_template_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."package_task_template" TO "anon";
GRANT ALL ON TABLE "public"."package_task_template" TO "authenticated";
GRANT ALL ON TABLE "public"."package_task_template" TO "service_role";



GRANT ALL ON SEQUENCE "public"."package_task_template_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."package_task_template_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."package_task_template_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."payment" TO "anon";
GRANT ALL ON TABLE "public"."payment" TO "authenticated";
GRANT ALL ON TABLE "public"."payment" TO "service_role";



GRANT ALL ON SEQUENCE "public"."payment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."payment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."payment_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."persona" TO "anon";
GRANT ALL ON TABLE "public"."persona" TO "authenticated";
GRANT ALL ON TABLE "public"."persona" TO "service_role";



GRANT ALL ON SEQUENCE "public"."persona_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."persona_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."persona_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pilier_contenu" TO "anon";
GRANT ALL ON TABLE "public"."pilier_contenu" TO "authenticated";
GRANT ALL ON TABLE "public"."pilier_contenu" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pilier_contenu_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pilier_contenu_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pilier_contenu_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pipeline_history" TO "anon";
GRANT ALL ON TABLE "public"."pipeline_history" TO "authenticated";
GRANT ALL ON TABLE "public"."pipeline_history" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pipeline_history_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pipeline_history_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pipeline_history_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pitch_deck_assets" TO "anon";
GRANT ALL ON TABLE "public"."pitch_deck_assets" TO "authenticated";
GRANT ALL ON TABLE "public"."pitch_deck_assets" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pitch_deck_assets_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pitch_deck_assets_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pitch_deck_assets_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pitch_deck_templates" TO "anon";
GRANT ALL ON TABLE "public"."pitch_deck_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."pitch_deck_templates" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pitch_deck_templates_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pitch_deck_templates_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pitch_deck_templates_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pitch_deck_versions" TO "anon";
GRANT ALL ON TABLE "public"."pitch_deck_versions" TO "authenticated";
GRANT ALL ON TABLE "public"."pitch_deck_versions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pitch_deck_versions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pitch_deck_versions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pitch_deck_versions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pitch_decks" TO "anon";
GRANT ALL ON TABLE "public"."pitch_decks" TO "authenticated";
GRANT ALL ON TABLE "public"."pitch_decks" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pitch_decks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pitch_decks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pitch_decks_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."prospects" TO "anon";
GRANT ALL ON TABLE "public"."prospects" TO "authenticated";
GRANT ALL ON TABLE "public"."prospects" TO "service_role";



GRANT ALL ON SEQUENCE "public"."prospects_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."prospects_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."prospects_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."role" TO "anon";
GRANT ALL ON TABLE "public"."role" TO "authenticated";
GRANT ALL ON TABLE "public"."role" TO "service_role";



GRANT ALL ON SEQUENCE "public"."role_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."role_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."role_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."security_logs" TO "anon";
GRANT ALL ON TABLE "public"."security_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."security_logs" TO "service_role";



GRANT ALL ON TABLE "public"."security_dashboard_view" TO "anon";
GRANT ALL ON TABLE "public"."security_dashboard_view" TO "authenticated";
GRANT ALL ON TABLE "public"."security_dashboard_view" TO "service_role";



GRANT ALL ON SEQUENCE "public"."security_logs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."security_logs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."security_logs_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."sql_injection_attempts" TO "anon";
GRANT ALL ON TABLE "public"."sql_injection_attempts" TO "authenticated";
GRANT ALL ON TABLE "public"."sql_injection_attempts" TO "service_role";



GRANT ALL ON TABLE "public"."security_monitoring" TO "anon";
GRANT ALL ON TABLE "public"."security_monitoring" TO "authenticated";
GRANT ALL ON TABLE "public"."security_monitoring" TO "service_role";



GRANT ALL ON TABLE "public"."security_notifications" TO "anon";
GRANT ALL ON TABLE "public"."security_notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."security_notifications" TO "service_role";



GRANT ALL ON SEQUENCE "public"."security_notifications_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."security_notifications_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."security_notifications_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."service_package" TO "anon";
GRANT ALL ON TABLE "public"."service_package" TO "authenticated";
GRANT ALL ON TABLE "public"."service_package" TO "service_role";



GRANT ALL ON SEQUENCE "public"."service_package_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."service_package_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."service_package_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."social_media_strategy" TO "anon";
GRANT ALL ON TABLE "public"."social_media_strategy" TO "authenticated";
GRANT ALL ON TABLE "public"."social_media_strategy" TO "service_role";



GRANT ALL ON SEQUENCE "public"."social_media_strategy_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."social_media_strategy_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."social_media_strategy_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."sql_injection_attempts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."sql_injection_attempts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."sql_injection_attempts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."strategy_comments" TO "anon";
GRANT ALL ON TABLE "public"."strategy_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."strategy_comments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."strategy_comments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."strategy_comments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."strategy_comments_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_session" TO "anon";
GRANT ALL ON TABLE "public"."user_session" TO "authenticated";
GRANT ALL ON TABLE "public"."user_session" TO "service_role";



GRANT ALL ON TABLE "public"."user_with_details" TO "anon";
GRANT ALL ON TABLE "public"."user_with_details" TO "authenticated";
GRANT ALL ON TABLE "public"."user_with_details" TO "service_role";



GRANT ALL ON TABLE "public"."v_admin_users" TO "anon";
GRANT ALL ON TABLE "public"."v_admin_users" TO "authenticated";
GRANT ALL ON TABLE "public"."v_admin_users" TO "service_role";



GRANT ALL ON TABLE "public"."v_calendar_statistics" TO "anon";
GRANT ALL ON TABLE "public"."v_calendar_statistics" TO "authenticated";
GRANT ALL ON TABLE "public"."v_calendar_statistics" TO "service_role";



GRANT ALL ON TABLE "public"."v_contract_summary" TO "anon";
GRANT ALL ON TABLE "public"."v_contract_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."v_contract_summary" TO "service_role";



GRANT ALL ON TABLE "public"."v_editorial_posts_full" TO "anon";
GRANT ALL ON TABLE "public"."v_editorial_posts_full" TO "authenticated";
GRANT ALL ON TABLE "public"."v_editorial_posts_full" TO "service_role";



GRANT ALL ON TABLE "public"."v_invoice_payment_status" TO "anon";
GRANT ALL ON TABLE "public"."v_invoice_payment_status" TO "authenticated";
GRANT ALL ON TABLE "public"."v_invoice_payment_status" TO "service_role";



GRANT ALL ON TABLE "public"."v_posts_by_pilier" TO "anon";
GRANT ALL ON TABLE "public"."v_posts_by_pilier" TO "authenticated";
GRANT ALL ON TABLE "public"."v_posts_by_pilier" TO "service_role";



GRANT ALL ON TABLE "public"."v_schedules_due_for_invoicing" TO "anon";
GRANT ALL ON TABLE "public"."v_schedules_due_for_invoicing" TO "authenticated";
GRANT ALL ON TABLE "public"."v_schedules_due_for_invoicing" TO "service_role";



GRANT ALL ON TABLE "public"."v_strategy_summary" TO "anon";
GRANT ALL ON TABLE "public"."v_strategy_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."v_strategy_summary" TO "service_role";



GRANT ALL ON TABLE "public"."video_figurant" TO "anon";
GRANT ALL ON TABLE "public"."video_figurant" TO "authenticated";
GRANT ALL ON TABLE "public"."video_figurant" TO "service_role";



GRANT ALL ON SEQUENCE "public"."video_figurant_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."video_figurant_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."video_figurant_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."video_script" TO "anon";
GRANT ALL ON TABLE "public"."video_script" TO "authenticated";
GRANT ALL ON TABLE "public"."video_script" TO "service_role";



GRANT ALL ON SEQUENCE "public"."video_script_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."video_script_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."video_script_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."video_task_details" TO "anon";
GRANT ALL ON TABLE "public"."video_task_details" TO "authenticated";
GRANT ALL ON TABLE "public"."video_task_details" TO "service_role";



GRANT ALL ON SEQUENCE "public"."video_task_details_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."video_task_details_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."video_task_details_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";




