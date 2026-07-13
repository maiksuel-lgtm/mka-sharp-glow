import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/BookingForm";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { ReviewsSection } from "@/components/ReviewsSection";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Helmet>
        <title>MkA Cortes — Barbearia Premium e Agendamento Online</title>
        <meta name="description" content="Agende seu corte na MkA Cortes: barbearia premium com cortes, barba e planos de assinatura mensal a partir de R$100." />
        <link rel="canonical" href="https://mka-cortes.lovable.app/" />
        <meta property="og:title" content="MkA Cortes — Barbearia Premium" />
        <meta property="og:description" content="Cortes premium, barba e planos de assinatura mensal. Agende online." />
        <meta property="og:url" content="https://mka-cortes.lovable.app/" />
      </Helmet>
      <BackgroundEffects />

      
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* My Profile Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 z-20"
        >
          <Button
            onClick={() => navigate(user ? '/meus-dados' : '/auth')}
            className="bg-gold hover:bg-gold-light text-primary-foreground shadow-gold-lg transition-all"
          >
            <User className="mr-2 h-4 w-4" />
            {user ? 'Meu Perfil' : 'Entrar'}
          </Button>
        </motion.div>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-gold tracking-tight">
              MkA Cortes — Barbearia Premium e Estilo
            </h1>
            <motion.div
              className="h-1 bg-gradient-gold rounded-full mt-4"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-gold" />
            Estilo Premium, Atendimento Exclusivo
            <Sparkles className="w-5 h-5 text-gold" />
          </motion.p>
        </motion.div>

        {/* Booking Form */}
        <main>
          <BookingForm />

          {/* Subscription Plans */}
          <SubscriptionPlans />

          {/* Reviews Section */}
          <ReviewsSection />
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 text-center text-muted-foreground text-sm"
        >
          <p>© {new Date().getFullYear()} MkA Cortes - Todos os direitos reservados</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
