-- Remove trigger and functions for confirmation token generation
-- Since we removed the booking lookup feature, we don't need this anymore

-- First, drop the trigger
DROP TRIGGER IF EXISTS set_confirmation_token_on_insert ON public.bookings;

-- Then drop the functions that depend on nothing
DROP FUNCTION IF EXISTS public.set_booking_confirmation_token();
DROP FUNCTION IF EXISTS public.generate_confirmation_token();
DROP FUNCTION IF EXISTS public.lookup_booking_by_token(text, text);

-- Make confirmation token fields nullable (if they aren't already)
ALTER TABLE public.bookings 
ALTER COLUMN confirmation_token DROP NOT NULL,
ALTER COLUMN token_expires_at DROP NOT NULL;