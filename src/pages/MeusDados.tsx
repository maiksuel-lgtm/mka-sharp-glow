import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClientSafeError } from "@/lib/errorHandling";
import { Button } from "@/components/ui/button";
import { Scissors, Calendar as CalendarIcon, Clock, Award, Edit, Save, X, LogOut, User, Phone, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HaircutSelector } from "@/components/HaircutSelector";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { StarRating } from "@/components/StarRating";

interface ClientData {
  name: string;
  phone: string;
  haircutStyle: string;
  bookingDate: string;
  bookingTime: string;
  rating: number;
}

export default function MeusDados() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [editedData, setEditedData] = useState<Partial<ClientData>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isNewBooking, setIsNewBooking] = useState(false);
  const [newBookingData, setNewBookingData] = useState({
    haircutStyle: "",
    bookingDate: undefined as Date | undefined,
    bookingTime: "",
    rating: 0,
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setUser(user);
    loadClientData(user.id);
  };

  const loadClientData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      if (!data) {
        toast.error("Nenhum agendamento encontrado");
        navigate('/');
        return;
      }

      const formattedData: ClientData = {
        name: data.client_name,
        phone: data.client_phone,
        haircutStyle: data.haircut_style,
        bookingDate: data.booking_date,
        bookingTime: data.booking_time,
        rating: data.rating || 0,
      };

      setClientData(formattedData);
      setEditedData(formattedData);
      setSelectedDate(new Date(data.booking_date));
    } catch (error: any) {
      toast.error(getClientSafeError(error));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSave = async () => {
    if (!clientData || !user) return;

    setIsSaving(true);
    try {
      const formattedDate = selectedDate?.toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('bookings')
        .update({
          haircut_style: editedData.haircutStyle,
          booking_date: formattedDate,
          booking_time: editedData.bookingTime,
        })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      toast.success("Agendamento atualizado com sucesso!");
      await loadClientData(user.id);
      setIsEditing(false);
    } catch (error: any) {
      toast.error(getClientSafeError(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(clientData || {});
    setSelectedDate(clientData ? new Date(clientData.bookingDate) : undefined);
    setIsEditing(false);
  };

  const handleNewBooking = async () => {
    if (!user || !clientData) return;
    if (!newBookingData.haircutStyle || !newBookingData.bookingDate || !newBookingData.bookingTime) {
      toast.error("Preencha todos os campos do novo agendamento");
      return;
    }

    setIsSaving(true);
    try {
      const formattedDate = newBookingData.bookingDate.toISOString().split('T')[0];

      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        client_name: clientData.name,
        client_phone: clientData.phone,
        haircut_style: newBookingData.haircutStyle,
        booking_date: formattedDate,
        booking_time: newBookingData.bookingTime,
        rating: newBookingData.rating,
        status: 'pending',
      });

      if (error) throw error;

      toast.success("Novo agendamento criado com sucesso!");
      setIsNewBooking(false);
      setNewBookingData({ haircutStyle: "", bookingDate: undefined, bookingTime: "", rating: 0 });
      await loadClientData(user.id);
    } catch (error: any) {
      toast.error(getClientSafeError(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelNewBooking = () => {
    setIsNewBooking(false);
    setNewBookingData({ haircutStyle: "", bookingDate: undefined, bookingTime: "", rating: 0 });
  };

  if (!clientData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Scissors className="w-12 h-12 text-gold" />
        </motion.div>
      </div>
    );
  }

  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundEffects />
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-4xl font-bold text-gold">Meus Dados</h1>
              <Button variant="outline" onClick={handleLogout} className="border-gold/50 text-gold hover:bg-gold/10">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
            <p className="text-muted-foreground">
              Visualize e edite suas informações
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Info Card */}
            <Card className="bg-card border-gold/20 shadow-gold">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gold">
                  <User className="w-5 h-5" />
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="text-lg font-medium text-foreground">{clientData.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gold" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="text-lg font-medium text-foreground">{clientData.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Info Card */}
            <Card className="bg-card border-gold/20 shadow-gold">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gold">
                  <Clock className="w-5 h-5" />
                  Agendamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setEditedData({ ...editedData, bookingTime: slot })}
                          className={cn(
                            "py-2 px-3 rounded-md text-sm font-medium transition-all border",
                            (editedData.bookingTime || clientData.bookingTime) === slot
                              ? "bg-gold text-primary-foreground"
                              : "bg-secondary hover:bg-gold/10"
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground">Data e Hora</p>
                    <p className="text-lg font-medium text-foreground">
                      {format(new Date(clientData.bookingDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      {" às "}
                      {clientData.bookingTime}
                    </p>
                  </div>
                )}
                {clientData.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gold" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avaliação</p>
                      <p className="text-lg font-medium text-foreground">{clientData.rating} estrelas</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Haircut Style Card */}
          <Card className="bg-card border-gold/20 shadow-gold">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold">
                <Scissors className="w-5 h-5" />
                Estilo de Corte
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <HaircutSelector
                  selectedCut={editedData.haircutStyle || clientData.haircutStyle}
                  onSelect={(style) => setEditedData({ ...editedData, haircutStyle: style })}
                />
              ) : (
                <div className="p-6 bg-secondary rounded-lg border border-gold/20 text-center">
                  <p className="text-2xl font-display font-bold text-gold">
                    {clientData.haircutStyle}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* New Booking Section */}
          <AnimatePresence>
            {isNewBooking && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="bg-card border-gold/20 shadow-gold">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gold">
                      <Plus className="w-5 h-5" />
                      Novo Agendamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Date Selection */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Selecione a Data</p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newBookingData.bookingDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newBookingData.bookingDate
                              ? format(newBookingData.bookingDate, "PPP", { locale: ptBR })
                              : "Selecione uma data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newBookingData.bookingDate}
                            onSelect={(date) => setNewBookingData({ ...newBookingData, bookingDate: date })}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Time Selection */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Selecione o Horário</p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setNewBookingData({ ...newBookingData, bookingTime: slot })}
                            className={cn(
                              "py-2 px-3 rounded-md text-sm font-medium transition-all border",
                              newBookingData.bookingTime === slot
                                ? "bg-gold text-primary-foreground border-gold"
                                : "bg-secondary hover:bg-gold/10 border-border"
                            )}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Haircut Selection */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Estilo de Corte</p>
                      <HaircutSelector
                        selectedCut={newBookingData.haircutStyle}
                        onSelect={(style) => setNewBookingData({ ...newBookingData, haircutStyle: style })}
                      />
                    </div>

                    {/* Rating */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Avaliação (opcional)</p>
                      <StarRating
                        rating={newBookingData.rating}
                        onRate={(rating) => setNewBookingData({ ...newBookingData, rating })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end flex-wrap">
            {isNewBooking ? (
              <>
                <Button variant="outline" onClick={handleCancelNewBooking} disabled={isSaving}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleNewBooking} disabled={isSaving} className="bg-gold hover:bg-gold-light text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Agendando..." : "Confirmar Agendamento"}
                </Button>
              </>
            ) : isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-gold hover:bg-gold-light text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Salvando..." : "Salvar"}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)} variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Agendamento
                </Button>
                <Button onClick={() => setIsNewBooking(true)} className="bg-gold hover:bg-gold-light text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
