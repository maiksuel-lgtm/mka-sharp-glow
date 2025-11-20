import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatsCards } from '@/components/admin/StatsCards';
import { BookingFilters } from '@/components/admin/BookingFilters';
import { BookingsTable } from '@/components/admin/BookingsTable';
import { useBookings } from '@/hooks/useBookings';

export default function AdminDashboard() {
  const { bookings, isLoading, updateBooking, deleteBooking } = useBookings();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [styleFilter, setStyleFilter] = useState('all');

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch = booking.client_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      const matchesStyle = styleFilter === 'all' || booking.haircut_style === styleFilter;

      return matchesSearch && matchesStatus && matchesStyle;
    });
  }, [bookings, searchTerm, statusFilter, styleFilter]);

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Painel de Agendamentos
          </h2>
          <p className="text-muted-foreground">
            Gerencie todos os agendamentos da barbearia
          </p>
        </motion.div>

        <StatsCards bookings={bookings} />

        <BookingFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          styleFilter={styleFilter}
          setStyleFilter={setStyleFilter}
        />

        <BookingsTable
          bookings={filteredBookings}
          isLoading={isLoading}
          onUpdate={(id, updates) => updateBooking({ id, updates })}
          onDelete={deleteBooking}
        />
      </main>
    </div>
  );
}
