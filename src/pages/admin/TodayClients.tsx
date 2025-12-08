import { motion } from 'framer-motion';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { TodayHeader } from '@/components/admin/TodayHeader';
import { TodayStatsCards } from '@/components/admin/TodayStatsCards';
import { TodayStagesView } from '@/components/admin/TodayStagesView';
import { useTodayBookings } from '@/hooks/useTodayBookings';
import { useBookings } from '@/hooks/useBookings';

export default function TodayClients() {
  const { bookings, isLoading, nextClientId } = useTodayBookings();
  const { updateBooking } = useBookings();

  const handleStatusChange = (id: string, status: 'arrived' | 'completed') => {
    updateBooking({ id, updates: { status } });
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TodayHeader />
        </motion.div>

        <TodayStatsCards bookings={bookings} />

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Clientes por Etapa
          </h3>
        </div>

        <TodayStagesView
          bookings={bookings}
          isLoading={isLoading}
          nextClientId={nextClientId}
          onStatusChange={handleStatusChange}
        />
      </main>
    </div>
  );
}
