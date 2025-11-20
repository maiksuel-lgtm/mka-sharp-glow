import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Booking {
  id: string;
  client_name: string;
  client_phone: string;
  booking_date: string;
  booking_time: string;
  haircut_style: string;
  rating: number | null;
  status: 'pending' | 'arrived' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export const useBookings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: false })
        .order('booking_time', { ascending: false });

      if (error) throw error;
      return data as Booking[];
    },
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: true,
  });

  const updateBooking = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Booking> }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['today-bookings'] });
      toast({
        title: 'Agendamento atualizado',
        description: 'As alterações foram salvas com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteBooking = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['today-bookings'] });
      toast({
        title: 'Agendamento excluído',
        description: 'O agendamento foi removido com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    bookings,
    isLoading,
    error,
    updateBooking: updateBooking.mutate,
    deleteBooking: deleteBooking.mutate,
    isUpdating: updateBooking.isPending,
    isDeleting: deleteBooking.isPending,
  };
};
