-- Allow anyone to view bookings that have ratings (for public reviews display)
CREATE POLICY "Anyone can view rated bookings" 
ON public.bookings 
FOR SELECT 
USING (rating IS NOT NULL);