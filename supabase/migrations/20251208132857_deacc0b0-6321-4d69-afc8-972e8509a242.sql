-- Create a secure view for public reviews that only exposes safe fields
CREATE VIEW public.public_reviews AS
SELECT 
  id,
  split_part(client_name, ' ', 1) as first_name,
  rating,
  comment,
  created_at
FROM public.bookings
WHERE rating IS NOT NULL;

-- Enable RLS on the view
ALTER VIEW public.public_reviews SET (security_invoker = on);

-- Grant access to the view for anon and authenticated users
GRANT SELECT ON public.public_reviews TO anon;
GRANT SELECT ON public.public_reviews TO authenticated;

-- Drop the problematic RLS policy that exposes all booking fields
DROP POLICY IF EXISTS "Anyone can view rated bookings" ON public.bookings;