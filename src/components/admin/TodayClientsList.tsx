import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { TodayClientCard } from './TodayClientCard';
import { Booking } from '@/hooks/useBookings';
import { Clock, UserCheck, CheckCircle2 } from 'lucide-react';

interface TodayClientsListProps {
  bookings: Booking[];
  isLoading: boolean;
  nextClientId: string | undefined;
  onStatusChange: (id: string, status: 'arrived' | 'completed') => void;
}

const statusSections = [
  {
    key: 'pending',
    label: 'Aguardando',
    icon: Clock,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
  {
    key: 'arrived',
    label: 'Em Atendimento',
    icon: UserCheck,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  {
    key: 'completed',
    label: 'Concluídos',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
];

export const TodayClientsList = ({
  bookings,
  isLoading,
  nextClientId,
  onStatusChange,
}: TodayClientsListProps) => {
  const groupedBookings = useMemo(() => {
    return statusSections.reduce((acc, section) => {
      acc[section.key] = bookings.filter(
        (b) => b.status === section.key
      );
      return acc;
    }, {} as Record<string, Booking[]>);
  }, [bookings]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {statusSections.map((section) => (
          <div key={section.key} className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
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
    <div className="space-y-8">
      {statusSections.map((section) => {
        const sectionBookings = groupedBookings[section.key] || [];
        const Icon = section.icon;

        return (
          <div key={section.key} className="space-y-4">
            <div className={`flex items-center gap-3 p-3 rounded-lg border ${section.bgColor} ${section.borderColor}`}>
              <Icon className={`h-5 w-5 ${section.color}`} />
              <h3 className={`font-semibold ${section.color}`}>
                {section.label}
              </h3>
              <span className={`ml-auto px-2 py-0.5 rounded-full text-sm font-medium ${section.bgColor} ${section.color}`}>
                {sectionBookings.length}
              </span>
            </div>

            {sectionBookings.length === 0 ? (
              <div className="bg-card/50 border border-border/50 rounded-lg p-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Nenhum cliente nesta etapa
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sectionBookings.map((booking) => (
                  <TodayClientCard
                    key={booking.id}
                    booking={booking}
                    isNext={booking.id === nextClientId}
                    onStatusChange={onStatusChange}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
