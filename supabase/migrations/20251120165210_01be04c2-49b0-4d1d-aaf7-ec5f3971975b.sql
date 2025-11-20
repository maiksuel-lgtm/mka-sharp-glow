-- Remove a constraint antiga
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_haircut_style_valid;

-- Adicionar a nova constraint com todos os estilos de corte
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_haircut_style_valid 
CHECK (haircut_style IN (
  'Degradê Baixo',
  'Degradê Médio', 
  'Degradê Alto',
  'Corte Navalhado',
  'Corte Social',
  'Corte Americano',
  'Barba Completa',
  'Barba Desenhada',
  'Sobrancelha + Barba',
  -- Manter compatibilidade com estilos antigos
  'Corte Clássico',
  'Degradê',
  'Social',
  'Navalhado',
  'Barba',
  'Corte + Barba',
  'Militar',
  'Undercut'
));