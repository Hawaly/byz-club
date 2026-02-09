-- =========================================================
-- TRIGGER: Auto-create app_user when auth.users is created
-- =========================================================
-- This trigger automatically creates a corresponding app_user record
-- whenever a new user is created in Supabase Auth (auth.users)
-- =========================================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  default_role_id INTEGER;
BEGIN
  -- Get the role_id from user metadata, or default to 'client' role (id=2)
  -- You can pass role_id via app_metadata when creating the user
  default_role_id := COALESCE(
    (NEW.raw_app_meta_data->>'role_id')::INTEGER,
    2  -- Default to 'client' role
  );

  -- Insert into app_user
  INSERT INTO public.app_user (
    auth_user_id,
    email,
    role_id,
    is_active,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    default_role_id,
    true,
    NOW(),
    NOW()
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block user creation
    RAISE WARNING 'Error creating app_user for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Optional: Handle user deletion (cascade delete app_user)
-- This is already handled by the FK constraint ON DELETE CASCADE
-- but we can add a trigger for custom cleanup if needed

COMMENT ON FUNCTION public.handle_new_user() IS 
  'Automatically creates app_user record when a user signs up via Supabase Auth';
