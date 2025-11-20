import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  User, Phone, Scissors, Clock, Calendar, Star, 
  CheckCircle2, Edit3, ArrowLeft, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HaircutSelector } from "@/components/HaircutSelector";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BackgroundEffects } from "@/components/BackgroundEffects";

interface ClientData {
  client_name: string;
  client_phone: string;
  booking_date: string;
  booking_time: string;
  haircut_style: string;
  rating: number | null;
  created_at: string;
}

export default function PerfilPosCadastro() {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState<ClientData | null>(null);
  const [showSuccessCheckmark, setShowSuccessCheckmark] = useState(false);

  useEffect(() => {
    loadClientData();
  }, []);

  const loadClientData = async () => {
    const clientPhone = localStorage.getItem('client_phone');
    
    if (!clientPhone) {
      navigate('/');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('client_phone', clientPhone)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      
      if (data) {
        setClientData(data);
        setEditedData(data);
      } else {
        toast.error("Dados não encontrados");
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      navigate('/');
    }
  };

  const handleSave = async () => {
    if (!editedData || !clientData) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          client_name: editedData.client_name,
          client_phone: editedData.client_phone,
          haircut_style: editedData.haircut_style,
        })
        .eq('client_phone', clientData.client_phone);

      if (error) throw error;

      // Update localStorage if phone changed
      if (editedData.client_phone !== clientData.client_phone) {
        localStorage.setItem('client_phone', editedData.client_phone);
      }

      setClientData(editedData);
      setIsEditing(false);
      setShowSuccessCheckmark(true);
      
      setTimeout(() => setShowSuccessCheckmark(false), 2000);
      
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(clientData);
    setIsEditing(false);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
    return value;
  };

  if (!clientData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  const firstName = clientData.client_name.split(' ')[0];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundEffects />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header with Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-16 h-16 text-gold mx-auto" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gold mb-3">
            Bem-vindo, {firstName}!
          </h1>
          
          <p className="text-lg text-foreground/80 flex items-center justify-center gap-2">
            <Scissors className="w-5 h-5 text-gold" />
            Seu perfil MkA Cortes está pronto
            <CheckCircle2 className="w-5 h-5 text-gold" />
          </p>
        </motion.div>

        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="bg-card border-gold/30 shadow-gold-lg relative overflow-hidden">
            {/* Gold border glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5 pointer-events-none" />
            
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-display text-gold flex items-center gap-3">
                  <User className="w-7 h-7" />
                  Meu Perfil Premium
                </CardTitle>
                
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="border-gold/50 hover:bg-gold/10 hover:border-gold text-gold"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="relative space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-foreground/80 flex items-center gap-2">
                    <User className="w-4 h-4 text-gold" />
                    Nome Completo
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedData?.client_name || ''}
                      onChange={(e) => setEditedData({ ...editedData!, client_name: e.target.value })}
                      className="bg-background border-border focus:border-gold"
                    />
                  ) : (
                    <p className="text-lg font-medium text-foreground">
                      {clientData.client_name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground/80 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gold" />
                    Telefone
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedData?.client_phone || ''}
                      onChange={(e) => setEditedData({ 
                        ...editedData!, 
                        client_phone: formatPhone(e.target.value) 
                      })}
                      className="bg-background border-border focus:border-gold"
                      maxLength={15}
                    />
                  ) : (
                    <p className="text-lg font-medium text-foreground">
                      {clientData.client_phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Booking Information */}
              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <div className="space-y-2">
                  <Label className="text-foreground/80 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold" />
                    Data do Agendamento
                  </Label>
                  <p className="text-lg font-medium text-foreground">
                    {format(new Date(clientData.booking_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground/80 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold" />
                    Horário
                  </Label>
                  <p className="text-lg font-medium text-foreground">
                    {clientData.booking_time}
                  </p>
                </div>
              </div>

              {/* Haircut Style */}
              <div className="space-y-3 pt-4 border-t border-border/50">
                <Label className="text-foreground/80 flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-gold" />
                  Estilo de Corte
                </Label>
                
                {isEditing ? (
                  <HaircutSelector
                    selectedCut={editedData?.haircut_style || ''}
                    onSelect={(cut) => setEditedData({ ...editedData!, haircut_style: cut })}
                  />
                ) : (
                  <div className="bg-gradient-to-r from-gold/10 to-transparent border border-gold/30 rounded-lg p-4">
                    <p className="text-xl font-display font-semibold text-gold">
                      {clientData.haircut_style}
                    </p>
                  </div>
                )}
              </div>

              {/* Rating */}
              {clientData.rating && (
                <div className="space-y-2 pt-4 border-t border-border/50">
                  <Label className="text-foreground/80 flex items-center gap-2">
                    <Star className="w-4 h-4 text-gold" />
                    Avaliação
                  </Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${
                          star <= clientData.rating! 
                            ? 'fill-gold text-gold' 
                            : 'text-border'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Edit Actions */}
              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 pt-6"
                >
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-gold hover:bg-gold-light text-primary-foreground shadow-gold"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-border hover:bg-secondary"
                  >
                    Cancelar
                  </Button>
                </motion.div>
              )}

              {/* Success Checkmark Animation */}
              {showSuccessCheckmark && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="bg-gold rounded-full p-6 shadow-gold-lg">
                    <CheckCircle2 className="w-16 h-16 text-primary-foreground" />
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-gold hover:text-gold-light hover:bg-gold/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
