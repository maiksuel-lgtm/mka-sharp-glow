import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Booking } from '@/hooks/useBookings';
import { EditableStars } from './EditableStars';

interface EditBookingModalProps {
  booking: Booking;
  open: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Booking>) => void;
}

export const EditBookingModal = ({ booking, open, onClose, onSave }: EditBookingModalProps) => {
  const [formData, setFormData] = useState({
    client_name: booking.client_name,
    client_phone: booking.client_phone,
    booking_date: booking.booking_date,
    booking_time: booking.booking_time,
    haircut_style: booking.haircut_style,
    status: booking.status,
    rating: booking.rating || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Agendamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_name">Nome do Cliente</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_phone">Telefone</Label>
              <Input
                id="client_phone"
                value={formData.client_phone}
                onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking_date">Data</Label>
              <Input
                id="booking_date"
                type="date"
                value={formData.booking_date}
                onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking_time">Horário</Label>
              <Input
                id="booking_time"
                type="time"
                value={formData.booking_time}
                onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="haircut_style">Estilo de Corte</Label>
              <Select
                value={formData.haircut_style}
                onValueChange={(value) => setFormData({ ...formData, haircut_style: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Degradê">Degradê</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                  <SelectItem value="Navalhado">Navalhado</SelectItem>
                  <SelectItem value="Undercut">Undercut</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="arrived">Chegou</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Avaliação</Label>
            <EditableStars
              rating={formData.rating}
              onRatingChange={(rating) => setFormData({ ...formData, rating })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-gold">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
