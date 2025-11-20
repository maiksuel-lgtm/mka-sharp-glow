import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Phone, Scissors, Clock, Star, User, ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { HaircutSelector } from "@/components/HaircutSelector";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientData {
  id: string;
  client_name: string;
  client_phone: string;
  haircut_style: string;
  booking_date: string;
  booking_time: string;
  rating: number | null;
}

const MeusDados = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState<Partial<ClientData>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Load client data - For now using phone from localStorage
  useEffect(() => {
    loadClientData();
  }, []);

  const loadClientData = async () => {
    const phone = localStorage.getItem('client_phone');
    if (!phone) {
      toast({
        title: "Nenhum agendamento encontrado",
        description: "Faça um agendamento primeiro",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('client_phone', phone)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível encontrar seus dados",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    setClientData(data);
    setEditedData(data);
  };

  const handleSave = async () => {
    if (!clientData) return;

    setIsSaving(true);
    const { error } = await supabase
      .from('bookings')
      .update({
        client_name: editedData.client_name || clientData.client_name,
        client_phone: editedData.client_phone || clientData.client_phone,
        haircut_style: editedData.haircut_style || clientData.haircut_style,
      })
      .eq('id', clientData.id);

    setIsSaving(false);

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações",
        variant: "destructive",
      });
      return;
    }

    // Update localStorage if phone changed
    if (editedData.client_phone) {
      localStorage.setItem('client_phone', editedData.client_phone);
    }

    setClientData({ ...clientData, ...editedData });
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    toast({
      title: "Dados atualizados!",
      description: "Suas informações foram salvas com sucesso",
    });
  };

  const handleCancel = () => {
    setEditedData(clientData || {});
    setIsEditing(false);
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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundEffects />

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-gold hover:text-gold-light hover:bg-gold/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gold">
                Meus Dados
              </h1>
              <p className="text-muted-foreground mt-2">
                Visualize e edite suas informações
              </p>
            </div>

            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-gold"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Editar Dados
              </Button>
            )}
          </div>
        </motion.div>

        {/* Success Animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="fixed top-8 right-8 z-50 bg-card border border-gold rounded-lg p-4 shadow-gold-lg"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <Check className="w-6 h-6 text-gold" />
                </motion.div>
                <span className="text-foreground font-medium">Dados salvos com sucesso!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Data Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card border-gold/20 shadow-gold">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gold">
                  <User className="w-5 h-5" />
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label htmlFor="name" className="text-muted-foreground">Nome</Label>
                      <Input
                        id="name"
                        value={editedData.client_name || clientData.client_name}
                        onChange={(e) => setEditedData({ ...editedData, client_name: e.target.value })}
                        className="mt-1 bg-secondary border-gold/30 focus:border-gold"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-muted-foreground">Telefone</Label>
                      <Input
                        id="phone"
                        value={editedData.client_phone || clientData.client_phone}
                        onChange={(e) => setEditedData({ ...editedData, client_phone: e.target.value })}
                        className="mt-1 bg-secondary border-gold/30 focus:border-gold"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="text-lg font-medium text-foreground">{clientData.client_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gold" />
                      <div>
                        <p className="text-sm text-muted-foreground">Telefone</p>
                        <p className="text-lg font-medium text-foreground">{clientData.client_phone}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Booking Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card border-gold/20 shadow-gold">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gold">
                  <Clock className="w-5 h-5" />
                  Agendamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Data e Hora</p>
                  <p className="text-lg font-medium text-foreground">
                    {format(new Date(clientData.booking_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    {" às "}
                    {clientData.booking_time}
                  </p>
                </div>
                {clientData.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                    <div>
                      <p className="text-sm text-muted-foreground">Sua Avaliação</p>
                      <p className="text-lg font-medium text-foreground">{clientData.rating} estrelas</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Haircut Style Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
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
                  selectedCut={editedData.haircut_style || clientData.haircut_style}
                  onSelect={(style) => setEditedData({ ...editedData, haircut_style: style })}
                />
              ) : (
                <div className="p-6 bg-secondary rounded-lg border border-gold/20 text-center">
                  <p className="text-2xl font-display font-bold text-gold">
                    {clientData.haircut_style}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex gap-4 justify-end"
          >
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
              className="border-gold/30 text-foreground hover:bg-gold/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-gold"
            >
              {isSaving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Scissors className="w-4 h-4 mr-2" />
                </motion.div>
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Salvar Alterações
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MeusDados;
