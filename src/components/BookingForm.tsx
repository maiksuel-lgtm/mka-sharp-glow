import { useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, Calendar, Clock, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { HaircutSelector } from "./HaircutSelector";
import { StarRating } from "./StarRating";
import { BookingLoader } from "./BookingLoader";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getClientSafeError } from "@/lib/errorHandling";

export const BookingForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [selectedCut, setSelectedCut] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
  ];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !date || !time || !selectedCut) {
      toast.error("Por favor, preencha todos os campos!");
      return;
    }

    // Validate rating if provided
    if (rating > 0 && (rating < 1 || rating > 5)) {
      toast.error("Avaliação deve estar entre 1 e 5 estrelas");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const bookingData = {
        client_name: name,
        client_phone: phone,
        booking_date: format(date, 'yyyy-MM-dd'),
        booking_time: time,
        haircut_style: selectedCut,
        rating: rating >= 1 && rating <= 5 ? rating : null,
        status: 'pending' as const,
      };

      const { data, error } = await supabase.from('bookings').insert(bookingData).select('confirmation_token').single();

      if (error) throw error;

      // Show success with confirmation token
      const confirmationMessage = data?.confirmation_token 
        ? `Agendamento realizado! Seu código de confirmação é: ${data.confirmation_token}. Guarde-o para consultar seu agendamento.`
        : "Agendamento realizado! Em breve entraremos em contato.";
      
      toast.success(confirmationMessage, {
        duration: 10000,
      });
      
      // Reset form
      setName("");
      setPhone("");
      setDate(undefined);
      setTime("");
      setSelectedCut("");
      setRating(0);
    } catch (error: any) {
      // Use safe error messaging - never expose internal details
      toast.error(getClientSafeError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      <BookingLoader isLoading={isSubmitting} />
      <motion.form
        onSubmit={handleSubmit}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl mx-auto space-y-8"
      >
      {/* Client Information */}
      <motion.div variants={itemVariants} className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-gold flex items-center gap-3">
          <User className="w-6 h-6" />
          Suas Informações
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground/90">Nome Completo</Label>
            <div className="relative">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome completo"
                className="bg-card border-border focus:border-gold transition-colors pl-4"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground/90">Telefone (WhatsApp)</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
              <Input
                id="phone"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(XX) XXXXX-XXXX"
                className="bg-card border-border focus:border-gold transition-colors pl-10"
                maxLength={15}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scheduling */}
      <motion.div variants={itemVariants} className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-gold flex items-center gap-3">
          <Calendar className="w-6 h-6" />
          Agendamento
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-foreground/90">Escolha a Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-card border-border hover:border-gold transition-colors",
                    !date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4 text-gold" />
                  {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border-gold/20" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label className="text-foreground/90">Escolha o Horário</Label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={cn(
                    "py-2 px-3 rounded-md text-sm font-medium transition-all",
                    "border border-border hover:border-gold",
                    time === slot
                      ? "bg-gold text-primary-foreground shadow-gold"
                      : "bg-card text-foreground/80 hover:bg-gold/10"
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Haircut Selection */}
      <motion.div variants={itemVariants}>
        <HaircutSelector selectedCut={selectedCut} onSelect={setSelectedCut} />
      </motion.div>

      {/* Rating */}
      <motion.div variants={itemVariants}>
        <StarRating rating={rating} onRate={setRating} />
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={itemVariants}>
        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full py-6 text-lg font-display font-bold",
            "bg-gold hover:bg-gold-light text-primary-foreground",
            "shadow-gold-lg transition-all duration-300",
            "hover:scale-[1.02] active:scale-[0.98]",
            isSubmitting && "animate-pulse-gold"
          )}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {isSubmitting ? "Enviando..." : "Confirmar Agendamento"}
        </Button>
      </motion.div>
    </motion.form>
    </>
  );
};
