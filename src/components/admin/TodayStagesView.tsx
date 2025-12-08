import { motion } from 'framer-motion';
import { Clock, UserCheck, CheckCircle } from 'lucide-react';
import { Booking } from '@/hooks/useBookings';
import { TodayClientCard } from './TodayClientCard';
import { Skeleton } from '@/components/ui/skeleton';

interface TodayStagesViewProps {
  bookings: Booking[];
  isLoading: boolean;
  nextClientId: string | undefined;
  onStatusChange: (id: string, status: 'arrived' | 'completed') => void;
}

const stages = [
  {
    key: 'pending',
    label: 'Aguardando',
    icon: Clock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
  },
  {
    key: 'arrived',
    label: 'Chegaram',
    icon: UserCheck,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  {
    key: 'completed',
    label: 'Finalizados',
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
  },
];

export const TodayStagesView = ({
  bookings,
  isLoading,
  nextClientId,
  onStatusChange,
}: TodayStagesViewProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {stages.map((stage) => (
          <div key={stage.key} className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {stages.map((stage, stageIndex) => {
        const stageBookings = bookings.filter((b) => b.status === stage.key);
        const Icon = stage.icon;

        return (
          <motion.div
            key={stage.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: stageIndex * 0.1 }}
            className="space-y-4"
          >
            <div
              className={`flex items-center gap-3 p-4 rounded-lg border ${stage.bgColor} ${stage.borderColor}`}
            >
              <Icon className={`h-6 w-6 ${stage.color}`} />
              <div>
                <h3 className="font-semibold text-foreground">{stage.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {stageBookings.length}{' '}
                  {stageBookings.length === 1 ? 'cliente' : 'clientes'}
                </p>
              </div>
            </div>

            <div className="space-y-4 min-h-[200px]">
              {stageBookings.length === 0 ? (
                <div
                  className={`flex items-center justify-center h-32 rounded-lg border border-dashed ${stage.borderColor}`}
                >
                  <p className="text-muted-foreground text-sm">
                    Nenhum cliente
                  </p>
                </div>
              ) : (
                stageBookings.map((booking) => (
                  <TodayClientCard
                    key={booking.id}
                    booking={booking}
                    isNext={booking.id === nextClientId}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
