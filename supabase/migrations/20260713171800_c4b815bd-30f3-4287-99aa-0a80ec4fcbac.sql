
-- 1. Remove public exposure of bookings
DROP POLICY IF EXISTS "Allow public read of rated bookings via view" ON public.bookings;

-- 2. Remove first-admin race condition policy
DROP POLICY IF EXISTS "Allow first admin creation" ON public.user_roles;

-- 3. Lock down SECURITY DEFINER function execution
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
-- has_role must remain callable by authenticated because RLS policies invoke it
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Ensure the public_reviews view (used for public homepage reviews) remains readable
GRANT SELECT ON public.public_reviews TO anon, authenticated;
