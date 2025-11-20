-- Add database constraints for input validation on bookings table

-- Add check constraint for client_name length
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_client_name_length 
CHECK (char_length(client_name) >= 3 AND char_length(client_name) <= 100);

-- Add check constraint for client_phone format (Brazilian phone format)
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_client_phone_length 
CHECK (char_length(client_phone) >= 14 AND char_length(client_phone) <= 15);

-- Add check constraint for haircut_style (must match predefined values - updated to include existing styles)
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_haircut_style_valid 
CHECK (haircut_style IN ('Corte Clássico', 'Degradê', 'Social', 'Navalhado', 'Barba', 'Corte + Barba', 'Militar', 'Undercut'));

-- Add check constraint for rating (1-5 or null)
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_rating_range 
CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5));