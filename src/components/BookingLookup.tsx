import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getClientSafeError } from "@/lib/errorHandling";

interface BookingResult {
  id: string;
  client_name: string;
  client_phone: string;
  booking_date: string;
  booking_time: string;
  haircut_style: string;
  status: string;
  created_at: string;
}

export const BookingLookup = () => {
  const [token, setToken] = useState("");
  const [phone, setPhone] = useState("");
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !phone) {
      toast.error("Por favor, preencha o código de confirmação e telefone!");
      return;
    }

    setIsSearching(true);
    setBooking(null);

    try {
      const { data, error } = await supabase.rpc('lookup_booking_by_token', {
        _token: token.trim(),
        _phone: phone,
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setBooking(data[0]);
        toast.success("Agendamento encontrado!");
      } else {
        toast.error("Agendamento não encontrado. Verifique o código e telefone.");
      }
    } catch (error: any) {
      toast.error(getClientSafeError(error));
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Pendente", variant: "outline" },
      arrived: { label: "Chegou", variant: "secondary" },
      completed: { label: "Concluído", variant: "default" },
      cancelled: { label: "Cancelado", variant: "destructive" },
    };
    
    const statusInfo = statusMap[status] || { label: status, variant: "outline" as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Consultar Agendamento
          </CardTitle>
          <CardDescription>
            Digite o código de confirmação e seu telefone para consultar seu agendamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Código de Confirmação</Label>
              <Input
                id="token"
                type="text"
                placeholder="Digite o código recebido"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="inline h-4 w-4 mr-1" />
                Telefone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={handlePhoneChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSearching}>
              {isSearching ? "Procurando..." : "Buscar Agendamento"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {booking && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Seu Agendamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nome</Label>
                  <p className="font-medium">{booking.client_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(booking.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Data</Label>
                  <p className="font-medium">
                    {format(new Date(booking.booking_date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Horário</Label>
                  <p className="font-medium">{booking.booking_time}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Estilo de Corte</Label>
                <p className="font-medium">{booking.haircut_style}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Agendado em</Label>
                <p className="text-sm">
                  {format(new Date(booking.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};
