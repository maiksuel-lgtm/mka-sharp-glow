-- Add RLS policy to allow public read access to rated bookings for the public_reviews view
CREATE POLICY "Allow public read of rated bookings via view"
ON public.bookings
FOR SELECT
TO anon, authenticated
USING (rating IS NOT NULL);