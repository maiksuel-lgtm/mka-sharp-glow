import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const bookingSchema = z.object({
  client_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  client_phone: z.string().min(14, 'Telefone inválido'),
  booking_date: z.string().min(1, 'Data é obrigatória'),
  booking_time: z.string().min(1, 'Horário é obrigatório'),
  haircut_style: z.string().min(1, 'Estilo de corte é obrigatório'),
  rating: z.number().min(1).max(5).optional(),
  status: z.enum(['pending', 'arrived', 'completed', 'cancelled']),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;
