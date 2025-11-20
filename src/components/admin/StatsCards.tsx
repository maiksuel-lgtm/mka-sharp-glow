import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Booking } from '@/hooks/useBookings';

interface StatsCardsProps {
  bookings: Booking[];
}

export const StatsCards = ({ bookings }: StatsCardsProps) => {
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending' || b.status === 'arrived').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  };

  const cards = [
    {
      title: 'Total',
      value: stats.total,
      icon: Calendar,
      color: 'text-gold',
      bgColor: 'bg-gold/10',
    },
    {
      title: 'Pendentes',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Concluídos',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Cancelados',
      value: stats.cancelled,
      icon: XCircle,
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-card border border-border rounded-lg p-6 hover:shadow-gold transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
              <motion.p
                key={card.value}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold text-foreground"
              >
                {card.value}
              </motion.p>
            </div>
            <div className={`p-3 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
