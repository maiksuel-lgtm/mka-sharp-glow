import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil, Trash2, MessageSquare } from 'lucide-react';
import { Booking } from '@/hooks/useBookings';
import { EditBookingModal } from './EditBookingModal';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { ReadOnlyStars } from './ReadOnlyStars';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BookingsTableProps {
  bookings: Booking[];
  isLoading: boolean;
  onUpdate: (id: string, updates: Partial<Booking>) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  pending: { label: 'Pendente', variant: 'default' as const, className: 'bg-yellow-500/20 text-yellow-600 border-yellow-500' },
  arrived: { label: 'Chegou', variant: 'default' as const, className: 'bg-blue-500/20 text-blue-600 border-blue-500' },
  completed: { label: 'Concluído', variant: 'default' as const, className: 'bg-green-500/20 text-green-600 border-green-500' },
  cancelled: { label: 'Cancelado', variant: 'default' as const, className: 'bg-gray-500/20 text-gray-600 border-gray-500' },
};

export const BookingsTable = ({ bookings, isLoading, onUpdate, onDelete }: BookingsTableProps) => {
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);
  const [viewingComment, setViewingComment] = useState<Booking | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Estilo</TableHead>
              <TableHead>Avaliação</TableHead>
              <TableHead>Comentário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.client_name}</TableCell>
                <TableCell>{booking.client_phone}</TableCell>
                <TableCell>
                  {format(new Date(booking.booking_date), 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>{booking.booking_time}</TableCell>
                <TableCell>{booking.haircut_style}</TableCell>
                <TableCell>
                  {booking.rating ? (
                    <ReadOnlyStars rating={booking.rating} size="sm" />
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {booking.comment ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewingComment(booking)}
                      className="text-gold hover:text-gold-light"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={statusConfig[booking.status].className}>
                    {statusConfig[booking.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingBooking(booking)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingBooking(booking)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          open={!!editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={(updates) => {
            onUpdate(editingBooking.id, updates);
            setEditingBooking(null);
          }}
        />
      )}

      {deletingBooking && (
        <DeleteConfirmDialog
          open={!!deletingBooking}
          onClose={() => setDeletingBooking(null)}
          onConfirm={() => {
            onDelete(deletingBooking.id);
            setDeletingBooking(null);
          }}
          clientName={deletingBooking.client_name}
        />
      )}

      {viewingComment && (
        <Dialog open={!!viewingComment} onOpenChange={() => setViewingComment(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-gold">
                <MessageSquare className="h-5 w-5" />
                Comentário do Cliente
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Cliente:</p>
                <p className="font-medium">{viewingComment.client_name}</p>
              </div>
              {viewingComment.rating && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avaliação:</p>
                  <ReadOnlyStars rating={viewingComment.rating} />
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Comentário:</p>
                <div className="bg-secondary p-4 rounded-lg border border-border">
                  <p className="text-foreground italic">"{viewingComment.comment}"</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
