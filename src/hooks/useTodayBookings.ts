import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Booking } from './useBookings';

export const useTodayBookings = () => {
  const today = new Date().toISOString().split('T')[0];

  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['today-bookings', today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_date', today)
        .order('booking_time', { ascending: true });

      if (error) throw error;
      return data as Booking[];
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    refetchOnWindowFocus: true,
  });

  // Find the next client (closest to current time)
  const getNextClient = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    const pendingBookings = bookings.filter(
      (b) => b.status === 'pending' || b.status === 'arrived'
    );

    // Find the booking with time closest to now
    const nextBooking = pendingBookings.reduce((closest, booking) => {
      if (!closest) return booking;
      
      const bookingTime = booking.booking_time;
      const closestTime = closest.booking_time;
      
      if (bookingTime >= currentTime && bookingTime < closestTime) {
        return booking;
      }
      return closest;
    }, pendingBookings[0]);

    return nextBooking?.id;
  };

  const nextClientId = getNextClient();

  return {
    bookings,
    isLoading,
    error,
    nextClientId,
  };
};
