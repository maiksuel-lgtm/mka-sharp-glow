import { Skeleton } from '@/components/ui/skeleton';
import { TodayClientCard } from './TodayClientCard';
import { Booking } from '@/hooks/useBookings';

interface TodayClientsListProps {
  bookings: Booking[];
  isLoading: boolean;
  nextClientId: string | undefined;
  onStatusChange: (id: string, status: 'arrived' | 'completed') => void;
}

export const TodayClientsList = ({
  bookings,
  isLoading,
  nextClientId,
  onStatusChange,
}: TodayClientsListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground text-lg">
          Nenhum agendamento para hoje
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <TodayClientCard
          key={booking.id}
          booking={booking}
          isNext={booking.id === nextClientId}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};
