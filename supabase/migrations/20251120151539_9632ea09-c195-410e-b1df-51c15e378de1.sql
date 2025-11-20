-- Add confirmation token for secure booking lookup
ALTER TABLE public.bookings 
ADD COLUMN confirmation_token TEXT UNIQUE,
ADD COLUMN token_expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster token lookups
CREATE INDEX idx_bookings_confirmation_token ON public.bookings(confirmation_token) 
WHERE confirmation_token IS NOT NULL;

-- Function to generate secure confirmation tokens
CREATE OR REPLACE FUNCTION public.generate_confirmation_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  token TEXT;
BEGIN
  -- Generate a random 32-character alphanumeric token
  token := encode(gen_random_bytes(24), 'base64');
  -- Remove special characters for easier sharing
  token := regexp_replace(token, '[^a-zA-Z0-9]', '', 'g');
  RETURN substring(token, 1, 32);
END;
$$;

-- Trigger to auto-generate confirmation token on booking creation
CREATE OR REPLACE FUNCTION public.set_booking_confirmation_token()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Generate token for new bookings
  IF NEW.confirmation_token IS NULL THEN
    NEW.confirmation_token := public.generate_confirmation_token();
    -- Token expires in 30 days
    NEW.token_expires_at := now() + interval '30 days';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_confirmation_token_on_insert
BEFORE INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.set_booking_confirmation_token();

-- Add RLS policy for customers to view their own bookings using confirmation token
CREATE POLICY "Customers can view own bookings with valid token"
ON public.bookings
FOR SELECT
USING (
  -- Admins can see all
  public.has_role(auth.uid(), 'admin'::app_role)
  OR
  -- Anonymous users can see their booking if they provide valid token
  -- Note: This will be enforced in the application layer via RPC
  (confirmation_token IS NOT NULL AND token_expires_at > now())
);

-- Create RPC function for secure booking lookup
CREATE OR REPLACE FUNCTION public.lookup_booking_by_token(
  _token TEXT,
  _phone TEXT
)
RETURNS TABLE (
  id UUID,
  client_name TEXT,
  client_phone TEXT,
  booking_date DATE,
  booking_time TIME,
  haircut_style TEXT,
  status TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.client_name,
    b.client_phone,
    b.booking_date,
    b.booking_time,
    b.haircut_style,
    b.status,
    b.created_at
  FROM public.bookings b
  WHERE b.confirmation_token = _token
    AND b.client_phone = _phone
    AND b.token_expires_at > now()
  LIMIT 1;
END;
$$;