-- Drop the overly permissive booking creation policy
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- Create a new policy that requires authentication
CREATE POLICY "Authenticated users can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Remove the unused legacy token-based access policy
DROP POLICY IF EXISTS "Customers can view own bookings with valid token" ON public.bookings;