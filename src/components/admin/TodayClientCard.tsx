import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Scissors, Clock } from 'lucide-react';
import { Booking } from '@/hooks/useBookings';
import { ReadOnlyStars } from './ReadOnlyStars';
import { cn } from '@/lib/utils';

interface TodayClientCardProps {
  booking: Booking;
  isNext: boolean;
  onStatusChange: (id: string, status: 'arrived' | 'completed') => void;
}

const statusConfig = {
  pending: { label: 'Aguardando', className: 'border-l-4 border-yellow-500' },
  arrived: { label: 'Chegou', className: 'border-l-4 border-blue-500' },
  completed: { label: 'Concluído', className: 'border-l-4 border-green-500' },
  cancelled: { label: 'Cancelado', className: 'border-l-4 border-gray-500' },
};

export const TodayClientCard = ({ booking, isNext, onStatusChange }: TodayClientCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-card border rounded-lg p-6 hover:shadow-lg transition-all',
        statusConfig[booking.status].className,
        isNext && 'border-2 border-gold shadow-gold-lg'
      )}
    >
      {isNext && (
        <Badge className="mb-3 bg-gradient-gold text-primary-foreground">
          Próximo Cliente
        </Badge>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-gold" />
            <span className="text-2xl font-bold text-foreground">
              {booking.booking_time}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-1">
            {booking.client_name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Phone className="h-4 w-4" />
            {booking.client_phone}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Scissors className="h-4 w-4" />
            {booking.haircut_style}
          </div>
        </div>

        <Badge
          className={cn(
            'ml-2',
            booking.status === 'pending' && 'bg-yellow-500/20 text-yellow-600 border-yellow-500',
            booking.status === 'arrived' && 'bg-blue-500/20 text-blue-600 border-blue-500',
            booking.status === 'completed' && 'bg-green-500/20 text-green-600 border-green-500'
          )}
        >
          {statusConfig[booking.status].label}
        </Badge>
      </div>

      {booking.rating && (
        <div className="mb-4">
          <ReadOnlyStars rating={booking.rating} size="sm" />
        </div>
      )}

      <div className="flex gap-2">
        {booking.status === 'pending' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange(booking.id, 'arrived')}
            className="flex-1"
          >
            Marcou Chegada
          </Button>
        )}
        {(booking.status === 'pending' || booking.status === 'arrived') && (
          <Button
            size="sm"
            onClick={() => onStatusChange(booking.id, 'completed')}
            className="flex-1 bg-gradient-gold"
          >
            Concluir Atendimento
          </Button>
        )}
      </div>
    </motion.div>
  );
};
